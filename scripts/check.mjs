// Checks dist/ after `npm run build`. Zero dependencies. Fails (exit 1) on:
//  1. a hub link or asset that points at nothing
//  2. a game that breaks the hosting rules in GAME_GUIDE.md: root-absolute URLs, external requests, inline scripts, eval
//  3. a relative file reference inside a game that does not exist
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(here, '../dist')
const problems = []
const { games } = JSON.parse(fs.readFileSync(path.join(DIST, 'games.json'), 'utf8'))

const walk = (d, out = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) e.isDirectory() ? walk(path.join(d, e.name), out) : out.push(path.join(d, e.name)); return out }
const exists = (p) => fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')))
const refs = (html) => [...html.matchAll(/\s(?:href|src)\s*=\s*"([^"]*)"/g)].map((m) => m[1])
const isExternal = (u) => /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(u)
const skip = (u) => !u || u.startsWith('#') || /^(?:mailto:|data:|blob:|javascript:)/i.test(u)

// ---- hub
const hub = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
for (const u of refs(hub)) {
  if (skip(u) || isExternal(u)) continue
  if (!exists(path.join(DIST, u.split(/[?#]/)[0]))) problems.push(`hub: broken link ${u}`)
}
for (const m of hub.matchAll(/<(?:script|img|link)\b[^>]*\s(?:src|href)="((?:https?:)?\/\/[^"]+)"[^>]*>/g)) {
  if (!/rel="(?:canonical|noopener)"/.test(m[0])) problems.push(`hub: external resource ${m[1]}`)
}

// ---- games
for (const g of games) {
  const dir = path.join(DIST, g.slug)
  const files = walk(dir)
  const size = files.reduce((n, f) => n + fs.statSync(f).size, 0)
  for (const f of files.filter((x) => /\.html$/.test(x))) {
    const html = fs.readFileSync(f, 'utf8'), rel = path.relative(DIST, f)
    for (const u of refs(html)) {
      if (skip(u)) continue
      if (isExternal(u)) continue // plain links out (GitHub, oddvale.com) are fine; resource loads are checked below
      if (u.startsWith('/')) { problems.push(`${rel}: root-absolute URL ${u} (games live in a sub-folder, use relative URLs)`); continue }
      if (!exists(path.resolve(path.dirname(f), u.split(/[?#]/)[0]))) problems.push(`${rel}: missing file ${u}`)
    }
    for (const m of html.matchAll(/<(?:script|img|link|audio|video|source|iframe)\b[^>]*\s(?:src|href)="((?:https?:)?\/\/[^"]+)"[^>]*>/g)) {
      if (!/rel="canonical"/.test(m[0])) problems.push(`${rel}: external resource ${m[1]}`)
    }
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (!/\bsrc=/.test(m[1]) && !/type="application\/(?:ld\+)?json"/.test(m[1]) && m[2].trim()) problems.push(`${rel}: inline <script> (blocked by the site's Content-Security-Policy)`)
    }
    if (/\son[a-z]+\s*=\s*"/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) problems.push(`${rel}: inline event handler attribute (blocked by the Content-Security-Policy)`)
    if (!html.includes(g.repo)) problems.push(`${rel}: no link to ${g.repo}`)
  }
  for (const f of files.filter((x) => /\.(?:js|mjs)$/.test(x))) {
    const js = fs.readFileSync(f, 'utf8'), rel = path.relative(DIST, f)
    if (/\beval\s*\(|new\s+Function\s*\(/.test(js)) problems.push(`${rel}: eval / new Function (blocked by the Content-Security-Policy)`)
    if (/\b(?:fetch|importScripts|import)\s*\(\s*['"`]https?:\/\//.test(js) || /from\s+['"]https?:\/\//.test(js)) problems.push(`${rel}: loads code or data from another host`)
    for (const m of js.matchAll(/(?:from\s+|import\s*\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      // Debug hooks may try a dynamic import of dev-only files (tests/, tools/), which are not published; those must fail softly.
      if (/^\.\.\/(?:tests|tools)\//.test(m[1]) && m[0].startsWith('import')) continue
      if (!fs.existsSync(path.resolve(path.dirname(f), m[1]))) problems.push(`${rel}: imports missing module ${m[1]}`)
    }
  }
  for (const f of files.filter((x) => /\.css$/.test(x))) {
    const css = fs.readFileSync(f, 'utf8'), rel = path.relative(DIST, f)
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      const u = m[1]
      if (skip(u)) continue
      if (isExternal(u) || u.startsWith('/')) { problems.push(`${rel}: url(${u}) must be relative`); continue }
      if (!fs.existsSync(path.resolve(path.dirname(f), u.split(/[?#]/)[0]))) problems.push(`${rel}: missing file ${u}`)
    }
  }
  console.log(`  /${g.slug}/  ${files.length} files, ${(size / 1024).toFixed(0)} KB`)
}

// ---- no cookies, anywhere (the site promises none; see site/pages/privacy.html)
for (const f of walk(DIST).filter((x) => /.(?:js|mjs|html)$/.test(x))) {
  const src = fs.readFileSync(f, 'utf8')
  if (/document.cookies*=|cookieStores*.s*set|set-cookie/i.test(src)) problems.push(`${path.relative(DIST, f)}: writes a cookie (the site promises no cookies)`)
}
if (/set-cookie/i.test(fs.readFileSync(path.join(DIST, '_headers'), 'utf8'))) problems.push('_headers: sets a cookie')
for (const p of ['privacy/index.html', 'whats-new/index.html', 'feed.xml']) if (!fs.existsSync(path.join(DIST, p))) problems.push(`missing ${p}`)

if (problems.length) { console.error(`\n${problems.length} problem(s):\n` + problems.map((p) => `  - ${p}`).join('\n')); process.exit(1) }
console.log(`OK: hub + ${games.length} games pass the checks`)

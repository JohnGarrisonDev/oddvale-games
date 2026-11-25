// Extra hub pages built by build.mjs: /privacy/, /whats-new/ and /feed.xml (RSS), plus the "Today's puzzles" row on the home page.
import fs from 'node:fs'
import path from 'node:path'

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ORIGIN = 'https://games.oddvale.com'
const LOGO = '<svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><circle cx="21" cy="22" r="13" fill="var(--orange)"/><circle cx="24.5" cy="24.5" r="5.2" fill="var(--ink)"/><circle cx="47" cy="19" r="5.5" fill="var(--ink)"/><path d="M9 41 32 57 55 41" fill="none" stroke="var(--ink)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** Footer shared by the hub and its sub-pages. base: '' on the home page, '../' one level down. */
export const hubFooter = (base, year) => `<footer class="footer hub-footer">
    <div class="wrap">
      <span>© ${year} <a href="https://oddvale.com">Oddvale</a>. AI for the fun of it. Games, code and illustrations on this site are made with AI.</span>
      <span><a href="${base}whats-new/">What's new</a> · <a href="${base}privacy/">Privacy</a> · <a href="https://github.com/JohnGarrisonDev/oddvale-games/issues/new?template=feedback.yml" target="_blank" rel="noopener">Send feedback</a> · <a href="https://github.com/JohnGarrisonDev/oddvale-games" target="_blank" rel="noopener">This site on GitHub</a></span>
    </div>
  </footer>`

/** A plain sub-page (one folder below the root) in the hub's style. */
export function subPage({ slug, title, description, body, year, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(title)} — Oddvale Games</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${ORIGIN}/${slug}/" />
  <meta name="theme-color" content="#17131f" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <link rel="alternate" type="application/rss+xml" title="Oddvale Games: what's new" href="../feed.xml" />
  <link rel="preload" href="../kit/fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="../kit/shell.css" />
  <link rel="stylesheet" href="../hub.css" />${extraHead}
</head>
<body>
  <header class="topbar">
    <div class="wrap">
      <a class="logo" href="../" aria-label="Oddvale Games home">${LOGO}<span class="word">oddvale <i>games</i></span></a>
      <span class="spacer"></span>
      <nav class="nav" aria-label="Main">
        <a href="../#games">Games</a>
        <a href="../whats-new/">What's new</a>
        <a href="https://oddvale.com">oddvale.com</a>
      </nav>
    </div>
  </header>
  <main class="page">
    <div class="wrap prose">
${body}
    </div>
  </main>
  ${hubFooter('../', year)}
</body>
</html>
`
}

// ---- tiny Markdown for changelogs: paragraphs, "- " bullets, **bold**, `code`, [text](https://...)
const inline = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
function mdBlock(lines) {
  const out = []
  let list = null, para = []
  const flushPara = () => { if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`); para = [] }
  const flushList = () => { if (list) out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`); list = null }
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^\s*[-*] /.test(line)) { flushPara(); (list ||= []).push(line.replace(/^\s*[-*] /, '')) }
    else if (/^\s{2,}\S/.test(line) && list) list[list.length - 1] += ' ' + line.trim()
    else if (!line.trim()) { flushPara(); flushList() }
    else if (/^#{3,} /.test(line)) { flushPara(); flushList(); out.push(`<h4>${inline(line.replace(/^#+ /, ''))}</h4>`) }
    else { flushList(); para.push(line.trim()) }
  }
  flushPara(); flushList()
  return out.join('\n')
}

/** Parses a game's CHANGELOG.md into [{ version, date, html, text }]. Headings: "## 1.2.0 — 2026-11-24" or "## 1.2.0 (2026-11-24)". */
export function parseChangelog(md) {
  const entries = []
  let cur = null
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^## +v?(\d+\.\d+\.\d+)\s*(?:—|–|-|\()?\s*(\d{4}-\d{2}-\d{2})?/)
    if (m) { cur = { version: m[1], date: m[2] || '', lines: [] }; entries.push(cur); continue }
    if (cur && !/^# /.test(line)) cur.lines.push(line)
  }
  return entries.map((e) => ({ version: e.version, date: e.date, html: mdBlock(e.lines), text: e.lines.join(' ').replace(/\*\*|`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim() }))
}

const fmt = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** Writes dist/whats-new/index.html and dist/feed.xml. changes: [{ game (meta), version, date, html, text }]. told: "You told us" notes. */
export function writeWhatsNew(DIST, changes, told, year) {
  const sorted = [...changes].filter((c) => c.date).sort((a, b) => b.date.localeCompare(a.date) || a.game.title.localeCompare(b.game.title))
  const toldHtml = told.length ? `
      <section class="told" aria-labelledby="told-h">
        <h2 id="told-h">You told us</h2>
        <p>What players asked for in polls and feedback taps, and what we changed because of it. Counts are anonymous totals.</p>
        <ul>${told.map((t) => `<li><b>${esc(fmt(t.date))}:</b> ${esc(t.text)}</li>`).join('')}</ul>
      </section>` : ''
  const body = `      <span class="eyebrow">Changelog</span>
      <h1>What's new</h1>
      <p class="lede">Every update to every game, newest first. AI models make these changes; each game's full history is in its GitHub repo. Follow along with the <a href="../feed.xml">RSS feed</a>.</p>${toldHtml}
      <ol class="changes">
${sorted.map((c) => `        <li class="change">
          <p class="change-head"><a class="g" href="../${esc(c.game.slug)}/">${esc(c.game.title)}</a> <span class="v">v${esc(c.version)}</span> <time datetime="${esc(c.date)}">${esc(fmt(c.date))}</time></p>
          <div class="change-body">${c.html}</div>
        </li>`).join('\n')}
      </ol>`
  fs.mkdirSync(path.join(DIST, 'whats-new'), { recursive: true })
  fs.writeFileSync(path.join(DIST, 'whats-new', 'index.html'), subPage({ slug: 'whats-new', title: "What's new", description: 'Every update to every Oddvale game, newest first.', body, year }))

  const items = sorted.slice(0, 40).map((c) => `    <item>
      <title>${esc(`${c.game.title} ${c.version}`)}</title>
      <link>${ORIGIN}/${esc(c.game.slug)}/</link>
      <guid isPermaLink="false">oddvale-games:${esc(c.game.slug)}:${esc(c.version)}</guid>
      <pubDate>${new Date(`${c.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(c.text.slice(0, 600))}</description>
    </item>`).join('\n')
  fs.writeFileSync(path.join(DIST, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Oddvale Games: what's new</title>
    <link>${ORIGIN}/whats-new/</link>
    <description>Updates to the browser games at games.oddvale.com, made and changed by AI.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`)
}

/** The "Today's puzzles" list on the home page. hub.js adds ticks (from this browser) and community difficulty badges. */
export const todayRow = (games) => games.filter((g) => g.daily).map((g) => `<li data-slug="${esc(g.slug)}" class="${esc(g.tone)}"><a href="${esc(g.slug)}/"><span class="t">${esc(g.title)}</span><span class="tick" hidden>Done today</span><span class="comm" hidden></span></a></li>`).join('')

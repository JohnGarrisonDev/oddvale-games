// Builds games.oddvale.com into dist/:
//   dist/index.html      the hub home page, rendered from site/index.template.html and each game's game.json
//   dist/<slug>/         one folder per game, copied from that game's own repo
//   dist/kit/            the shared kit (fonts, shell.css) used by the hub page
// Game sources: by default each repo in games.json is cloned (or updated) into .cache/<slug> at its latest main.
// With --local, a checkout next to this repo (../<slug>) is used instead when it exists, for testing unpushed changes.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { parseChangelog, writeWhatsNew, subPage, todayRow, hubFooter } from './pages.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '..')
const DIST = path.join(ROOT, 'dist')
const CACHE = path.join(ROOT, '.cache')
const LOCAL = process.argv.includes('--local')
const ORIGIN = 'https://games.oddvale.com'

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'games.json'), 'utf8'))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const git = (args, cwd) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()

// Files in a game repo that are not part of the playable site.
const SKIP = new Set(['.git', '.github', '.gitignore', '.claude', '.vscode', 'node_modules', 'tests', 'test', 'tools', 'scripts', 'art-src', 'package.json', 'package-lock.json'])
const skipFile = (name) => SKIP.has(name) || /\.md$/i.test(name) || name.startsWith('.')

function copyDir(src, dst, top = true) {
  fs.mkdirSync(dst, { recursive: true })
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (top ? skipFile(e.name) : e.name.startsWith('.git')) continue
    const s = path.join(src, e.name), d = path.join(dst, e.name)
    if (e.isDirectory()) copyDir(s, d, false)
    else fs.copyFileSync(s, d)
  }
}

function fetchGame({ slug, repo }) {
  const sibling = path.resolve(ROOT, '..', slug)
  if (LOCAL && fs.existsSync(path.join(sibling, 'game.json'))) return { dir: sibling, from: 'local checkout' }
  const dir = path.join(CACHE, slug)
  if (fs.existsSync(path.join(dir, '.git'))) {
    git(['fetch', '--depth', '1', 'origin', 'main'], dir)
    git(['reset', '--hard', 'FETCH_HEAD'], dir)
  } else {
    fs.mkdirSync(CACHE, { recursive: true })
    git(['clone', '--depth', '1', '--branch', 'main', `${repo}.git`, dir], ROOT)
  }
  return { dir, from: `${repo} @ ${git(['rev-parse', '--short', 'HEAD'], dir)}` }
}

const KINDS = ['Puzzle', 'Word', 'Physics', 'Arcade']
const REQUIRED = ['slug', 'title', 'tagline', 'description', 'genre', 'verb', 'tone', 'version', 'updated', 'repo', 'cover', 'coverAlt']
const TONES = ['ink', 'blue', 'yellow', 'mint', 'orange', 'pink']
// difficulty 1-5; the label shown next to the pips on the hub card
const DIFFICULTY = ['', 'Relaxed', 'Easy', 'Medium', 'Hard', 'Brutal']
const fmtDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

// ---- collect games
fs.rmSync(DIST, { recursive: true, force: true })
fs.mkdirSync(DIST, { recursive: true })
const games = []
const changes = []
const seo = new Map()
for (const entry of registry.games) {
  const { dir, from } = fetchGame(entry)
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'game.json'), 'utf8'))
  const missing = REQUIRED.filter((k) => !meta[k])
  if (missing.length) throw new Error(`${entry.slug}/game.json is missing: ${missing.join(', ')}`)
  if (meta.slug !== entry.slug) throw new Error(`${entry.slug}/game.json has slug "${meta.slug}"`)
  if (!Array.isArray(meta.kinds) || !meta.kinds.length || meta.kinds.some((k) => !KINDS.includes(k))) throw new Error(`${entry.slug}/game.json needs "kinds": one or more of ${KINDS.join(', ')}`)
  if (!Number.isInteger(meta.difficulty) || meta.difficulty < 1 || meta.difficulty > 5) throw new Error(`${entry.slug}/game.json needs "difficulty": a whole number from 1 (Relaxed) to 5 (Brutal)`)
  if (typeof meta.difficultyNote !== 'string' || !meta.difficultyNote.trim() || meta.difficultyNote.length > 110) throw new Error(`${entry.slug}/game.json needs "difficultyNote": one plain sentence of at most 110 characters`)
  if (!TONES.includes(meta.tone)) throw new Error(`${entry.slug}/game.json tone must be one of ${TONES.join(', ')}`)
  for (const f of ['index.html', meta.cover]) if (!fs.existsSync(path.join(dir, f))) throw new Error(`${entry.slug} has no ${f}`)
  copyDir(dir, path.join(DIST, entry.slug))
  games.push(meta)
  seo.set(meta.slug, { title: entry.seoTitle, description: entry.seoDescription })
  const cl = path.join(dir, 'CHANGELOG.md')
  if (fs.existsSync(cl)) for (const e of parseChangelog(fs.readFileSync(cl, 'utf8'))) changes.push({ game: meta, ...e })
  console.log(`+ /${entry.slug}/  v${meta.version}  (${from})`)
}

// ---- search and sharing polish for each game page (dist copy only; the game repo is untouched)
// Descriptive <title> and description from games.json, a 1200x630 JPEG share card cut from the cover,
// per-game JSON-LD, and a "Try next" card linking three related games.
const sharp = (await import('sharp')).default
const related = (g) => games.filter((o) => o.slug !== g.slug)
  .map((o, i) => ({ o, score: o.kinds.filter((k) => g.kinds.includes(k)).length * 2 + (o.daily && g.daily ? 1 : 0), i }))
  .sort((a, b) => b.score - a.score || a.i - b.i).slice(0, 3).map((r) => r.o)
for (const g of games) {
  const file = path.join(DIST, g.slug, 'index.html')
  const s = seo.get(g.slug) || {}
  const title = s.title || `${g.title} — Oddvale Games`
  const description = s.description || g.description
  if (description.length > 160) console.warn(`! ${g.slug}: description is ${description.length} characters (search engines show about 160)`)
  await sharp(path.join(DIST, g.slug, g.cover)).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(DIST, g.slug, 'og.jpg'))
  const url = `${ORIGIN}/${g.slug}/`
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': ['VideoGame', 'WebApplication'], '@id': `${url}#game`, name: g.title, url, description, genre: g.genre, image: `${url}og.jpg`, inLanguage: 'en', isAccessibleForFree: true, gamePlatform: 'Web browser', applicationCategory: 'GameApplication', operatingSystem: 'Any', softwareVersion: g.version, dateModified: g.updated, ...(g.released ? { datePublished: g.released } : {}), offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, codeRepository: g.repo, isPartOf: { '@id': `${ORIGIN}/#site` }, publisher: { '@type': 'Organization', name: 'Oddvale', url: 'https://oddvale.com' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Oddvale Games', item: `${ORIGIN}/` }, { '@type': 'ListItem', position: 2, name: g.title, item: url }] },
    ],
  }
  const tryNext = `\n      <section class="info try-next" aria-label="More games">\n        <div class="card"><h2>Try next</h2><ul>${related(g).map((o) => `<li><a href="../${esc(o.slug)}/"><b>${esc(o.title)}</b></a>: ${esc(o.tagline)}</li>`).join('')}</ul><p><a href="../">All ${games.length} games</a></p></div>\n      </section>\n`
  let html = fs.readFileSync(file, 'utf8')
  const setMeta = (attr, key, value) => {
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`)
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`
    html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n</head>`)
  }
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  setMeta('name', 'description', description)
  setMeta('property', 'og:site_name', 'Oddvale Games')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image', `${url}og.jpg`)
  setMeta('property', 'og:image:width', '1200')
  setMeta('property', 'og:image:height', '630')
  setMeta('property', 'og:image:alt', g.coverAlt)
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', `${url}og.jpg`)
  html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n</head>`)
  // after the game's own info cards, inside the page's .wrap
  const at = html.lastIndexOf('</main>')
  const wrapEnd = at < 0 ? -1 : html.lastIndexOf('</div>', at)
  if (wrapEnd < 0) console.warn(`! ${g.slug}: no </main> found, skipped Try next`)
  else html = html.slice(0, wrapEnd) + tryNext + '    ' + html.slice(wrapEnd)
  fs.writeFileSync(file, html)
}

// ---- hub page
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>'
const GH = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>'

const card = (g, i) => `
        <article class="g-card ${esc(g.tone)}" id="${esc(g.slug)}" data-difficulty="${g.difficulty}" data-kinds="${esc([...g.kinds, ...(g.daily ? ['Daily'] : [])].join(' '))}">
          <a class="art" href="${esc(g.slug)}/" tabindex="-1" aria-hidden="true">${g.daily ? '<span class="daily"><i></i>New every day</span>' : ''}<img src="${esc(g.slug)}/${esc(g.cover)}" alt="${esc(g.coverAlt)}" width="1536" height="1024" ${i < 3 ? '' : 'loading="lazy" '}decoding="async" /></a>
          <div class="body">
            <div class="top"><span class="verb">${esc(g.verb)}</span><span class="status">${esc(g.genre)}${g.session ? ` · ${esc(g.session)}` : ''}</span></div>
            <h3><a class="title" href="${esc(g.slug)}/">${esc(g.title)}</a></h3>
            <p class="line">${esc(g.tagline)}</p>
            <p class="blurb">${esc(g.description)}</p>
            <div class="diff" data-level="${g.difficulty}">
              <p class="diff-head"><span class="lbl">Difficulty</span><span class="pips" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => `<i${n <= g.difficulty ? ' class="on"' : ''}></i>`).join('')}</span><b>${DIFFICULTY[g.difficulty]}</b><span class="sr"> (${g.difficulty} out of 5)</span></p>
              <p class="diff-note">${esc(g.difficultyNote)}</p>
            </div>
            <div class="actions">
              <a class="btn play" href="${esc(g.slug)}/">Play ${ARROW}</a>
              <a class="src" href="${esc(g.repo)}" target="_blank" rel="noopener">${GH} Source</a>
            </div>
            <p class="meta">v${esc(g.version)} · updated ${esc(fmtDate(g.updated))}</p>
          </div>
        </article>`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${ORIGIN}/#site`, url: `${ORIGIN}/`, name: 'Oddvale Games', description: 'Free browser games designed, built and updated by AI.', publisher: { '@type': 'Organization', name: 'Oddvale', url: 'https://oddvale.com' } },
    { '@type': 'ItemList', name: 'Oddvale Games', itemListElement: games.map((g, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'VideoGame', name: g.title, url: `${ORIGIN}/${g.slug}/`, description: g.description, genre: g.genre, image: `${ORIGIN}/${g.slug}/${g.cover}`, gamePlatform: 'Web browser', applicationCategory: 'Game', operatingSystem: 'Any', softwareVersion: g.version, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } })) },
  ],
}
const N = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
const countWord = N[games.length] || String(games.length)
const template = fs.readFileSync(path.join(ROOT, 'site', 'index.template.html'), 'utf8')
const html = template
  .replaceAll('{{GAME_CARDS}}', games.map(card).join('\n'))
  .replaceAll('{{TODAY_ROW}}', todayRow(games))
  .replaceAll('{{HUB_FOOTER}}', hubFooter('', new Date().getFullYear()))
  .replaceAll('{{FILTERS}}', ['All', ...KINDS.filter((k) => games.some((g) => g.kinds.includes(k))), ...(games.some((g) => g.daily) ? ['Daily'] : [])].map((k, i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${k === 'Daily' ? 'New every day' : k}</button>`).join(''))
  .replaceAll('{{DAILY_COUNT_WORD}}', N[games.filter((g) => g.daily).length] || String(games.filter((g) => g.daily).length))
  .replaceAll('{{GAME_COUNT}}', String(games.length))
  .replaceAll('{{GAME_COUNT_WORD}}', countWord)
  .replaceAll('{{GAME_COUNT_WORD_LC}}', countWord.toLowerCase())
  .replaceAll('{{GAMES_NOUN}}', games.length === 1 ? 'game' : 'games')
  .replaceAll('{{JSON_LD}}', JSON.stringify(jsonLd).replace(/</g, '\\u003c'))
  .replaceAll('{{YEAR}}', String(new Date().getFullYear()))
if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`Unfilled placeholder in index.template.html: ${html.match(/\{\{[A-Z_]+\}\}/)[0]}`)

// ---- static files
for (const e of fs.readdirSync(path.join(ROOT, 'site'), { withFileTypes: true })) {
  if (e.name === 'index.template.html' || e.name === 'pages') continue
  const s = path.join(ROOT, 'site', e.name), d = path.join(DIST, e.name)
  if (e.isDirectory()) copyDir(s, d, false)
  else fs.copyFileSync(s, d)
}
copyDir(path.join(ROOT, 'kit'), path.join(DIST, 'kit'), false)
fs.rmSync(path.join(DIST, 'kit', 'template.html'), { force: true })
fs.writeFileSync(path.join(DIST, 'index.html'), html)

// ---- sub-pages: privacy, what's new + RSS
const YEAR = new Date().getFullYear()
fs.mkdirSync(path.join(DIST, 'privacy'), { recursive: true })
fs.writeFileSync(path.join(DIST, 'privacy', 'index.html'), subPage({ slug: 'privacy', title: 'Privacy', description: 'What Oddvale Games keeps and where: progress in your browser, anonymous counts on our server, nothing about you.', body: fs.readFileSync(path.join(ROOT, 'site', 'pages', 'privacy.html'), 'utf8'), year: YEAR }))
const told = fs.existsSync(path.join(ROOT, 'you-told-us.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'you-told-us.json'), 'utf8')).notes || [] : []
writeWhatsNew(DIST, changes, told, YEAR)

// lastmod is when the page's content really changed, not the build date
const newest = (dates) => dates.filter(Boolean).sort().at(-1)
const gitDate = (file) => { try { return git(['log', '-1', '--format=%cs', '--', file], ROOT) || undefined } catch { return undefined } }
const hubMod = newest([...games.map((g) => g.updated), gitDate('site/index.template.html')])
const newsMod = newest([...changes.map((c) => c.date), hubMod])
const privacyMod = gitDate('site/pages/privacy.html') || hubMod
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[{ loc: `${ORIGIN}/`, mod: hubMod }, { loc: `${ORIGIN}/whats-new/`, mod: newsMod }, { loc: `${ORIGIN}/privacy/`, mod: privacyMod }, ...games.map((g) => ({ loc: `${ORIGIN}/${g.slug}/`, mod: g.updated }))].map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.mod}</lastmod></url>`).join('\n')}\n</urlset>\n`)
fs.writeFileSync(path.join(DIST, 'games.json'), JSON.stringify({ games }, null, 2))
console.log(`Built ${games.length} ${games.length === 1 ? 'game' : 'games'} + hub into dist/`)

// Page views per game per day for games.oddvale.com, from Cloudflare's edge request logs (GraphQL Analytics API).
// No script runs on the site: this only reads requests Cloudflare already served.
//
// Usage: npm run analytics [-- --days 7] [-- --write]
//   --days N   how many full days back to report (default 7; Cloudflare keeps about 30 days on most plans)
//   --write    also save the report as studio/reports/YYYY-MM-DD-analytics.md
//
// Needs CLOUDFLARE_API_TOKEN (environment or .env, like scripts/cf.mjs) with Zone > Analytics > Read for oddvale.com.
// Counts are HTML page requests (a game's index page), not unique people: repeat visits and some bots are included.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '..')
const HOST = 'games.oddvale.com'
const args = process.argv.slice(2)
const days = Math.max(1, Math.min(30, Number(args[args.indexOf('--days') + 1]) || 7))
const write = args.includes('--write')

// Credentials: a .env file wins over the environment (same order as cf.mjs), so a fresh token in .env is used.
let token
for (const f of [path.join(ROOT, '.env'), path.resolve(ROOT, '../../Oddvale/.env')]) {
  if (!fs.existsSync(f)) continue
  const m = fs.readFileSync(f, 'utf8').match(/^\s*CLOUDFLARE_API_TOKEN\s*=\s*["']?([^"'\r\n]+)/m)
  if (m) { token = m[1]; break }
}
token ||= process.env.CLOUDFLARE_API_TOKEN
if (!token) { console.error('No CLOUDFLARE_API_TOKEN in the environment or .env'); process.exit(1) }
const H = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const { games } = JSON.parse(fs.readFileSync(path.join(ROOT, 'games.json'), 'utf8'))
const slugs = games.map((g) => g.slug)
const pageOf = (p) => {
  if (p === '/' || p === '/index.html') return 'hub'
  const m = p.match(/^\/([a-z0-9-]+)\/(?:index\.html)?$/)
  return m && slugs.includes(m[1]) ? m[1] : null
}

const zones = await (await fetch('https://api.cloudflare.com/client/v4/zones?name=oddvale.com', { headers: H })).json()
const zone = zones.result?.[0]
if (!zone) { console.error('Could not find the oddvale.com zone with this token.'); process.exit(1) }

const QUERY = `query($zone: String!, $start: Time!, $end: Time!, $host: String!) {
  viewer { zones(filter: { zoneTag: $zone }) {
    httpRequestsAdaptiveGroups(limit: 2000, filter: { datetime_geq: $start, datetime_lt: $end, clientRequestHTTPHost: $host, requestSource: "eyeball", edgeResponseStatus: 200 }) {
      count dimensions { clientRequestPath }
    }
  } }
}`

// One query per UTC day keeps each request inside the API's per-query time limits.
const today = new Date(); today.setUTCHours(0, 0, 0, 0)
const rows = [] // { date, page, views }
for (let d = days; d >= 1; d--) {
  const start = new Date(today - d * 864e5), end = new Date(today - (d - 1) * 864e5)
  const res = await (await fetch('https://api.cloudflare.com/client/v4/graphql', { method: 'POST', headers: H, body: JSON.stringify({ query: QUERY, variables: { zone: zone.id, start: start.toISOString(), end: end.toISOString(), host: HOST } }) })).json()
  if (res.errors?.length) {
    const authz = res.errors.some((e) => e.extensions?.code === 'authz' || /permission/i.test(e.message))
    console.error(authz
      ? 'The Cloudflare API token cannot read analytics. Give it "Zone > Analytics > Read" for oddvale.com (Cloudflare dashboard > My Profile > API Tokens), then run this again.'
      : `Cloudflare returned an error: ${res.errors.map((e) => e.message).join('; ')}`)
    process.exit(1)
  }
  const date = start.toISOString().slice(0, 10)
  const byPage = {}
  for (const g of res.data.viewer.zones[0]?.httpRequestsAdaptiveGroups || []) {
    const page = pageOf(g.dimensions.clientRequestPath)
    if (page) byPage[page] = (byPage[page] || 0) + g.count
  }
  for (const page of ['hub', ...slugs]) rows.push({ date, page, views: byPage[page] || 0 })
}

// ---- report
const dates = [...new Set(rows.map((r) => r.date))]
const total = (page, ds = dates) => rows.filter((r) => r.page === page && ds.includes(r.date)).reduce((n, r) => n + r.views, 0)
const half = Math.floor(dates.length / 2)
const first = dates.slice(0, half), second = dates.slice(dates.length - half)
const trend = (page) => {
  if (!half) return ''
  const a = total(page, first), b = total(page, second)
  if (!a && !b) return '·'
  if (!a) return 'new'
  const pct = Math.round(((b - a) / a) * 100)
  return `${pct >= 0 ? '+' : ''}${pct}%`
}
const title = (page) => (page === 'hub' ? 'Home page' : games.find((g) => g.slug === page)?.slug)
const order = ['hub', ...slugs.slice().sort((x, y) => total(y) - total(x))]
const lines = [
  `# Analytics ${dates[0]} to ${dates.at(-1)}`,
  '',
  `Period: ${dates.length} full UTC days. Source: Cloudflare edge request logs for ${HOST} (HTML page requests with status 200 from real clients). Counts are page loads, not unique people.`,
  '',
  '| Page | Views | Per day | Trend (2nd half vs 1st) |',
  '|---|---|---|---|',
  ...order.map((p) => `| ${title(p)} | ${total(p)} | ${(total(p) / dates.length).toFixed(1)} | ${trend(p)} |`),
  '',
  '## By day',
  '',
  `| Date | ${order.map(title).join(' | ')} |`,
  `|---|${order.map(() => '---').join('|')}|`,
  ...dates.map((d) => `| ${d} | ${order.map((p) => rows.find((r) => r.date === d && r.page === p).views).join(' | ')} |`),
  '',
]
const report = lines.join('\n')
console.log(report)
if (write) {
  const out = path.join(ROOT, 'studio', 'reports', `${new Date().toISOString().slice(0, 10)}-analytics.md`)
  fs.writeFileSync(out, report)
  console.log(`Saved ${path.relative(ROOT, out)}`)
}

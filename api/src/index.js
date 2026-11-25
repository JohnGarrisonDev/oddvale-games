// Oddvale Games API: anonymous counters for difficulty votes, daily score percentiles, "Tell us" taps, thumbs and owner polls.
// Runs as a standalone Cloudflare Worker on the route games.oddvale.com/api/* (same origin as the site, so no CORS and no CSP change).
//
// Privacy rules (see site/privacy/index.html; do not break them without the owner's approval):
//  - Nothing about the person is stored: no IP, no hash of an IP, no device ID, no cookie, no user agent. Only counts.
//  - The client IP is used only as a key for Cloudflare's rate limiter, which counts in memory for 60 seconds.
//  - No Set-Cookie header, ever. No CORS headers (other sites must not read or write here).
// Counts are stored per UTC hour so a spam burst can be found and removed; the daily cron rolls hours older than
// 90 days up into one row per day.
import { VOTES, TELLS, GAMES, DAILIES, POLLS, MIN_FOR_PERCENTILE, MIN_FOR_VOTES } from './config.js'

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff' }
const MAX_BODY = 512
const RETAIN_DAYS = 90

const json = (body, status = 200, cache = 'no-store') => new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, 'cache-control': cache } })
const fail = (status, error) => json({ ok: false, error }, status)

const pad = (n) => String(n).padStart(2, '0')
export const utcDay = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
export const utcHour = (d) => `${utcDay(d)}T${pad(d.getUTCHours())}`
const DAY = 86400000

/** A daily key is the player's local date. Accept it only within one day of today in UTC (covers every time zone). */
export function keyInWindow(key, now) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false
  const t = Date.parse(`${key}T00:00:00Z`)
  if (Number.isNaN(t) || utcDay(new Date(t)) !== key) return false
  const today = Date.parse(`${utcDay(now)}T00:00:00Z`)
  return Math.abs(t - today) <= DAY
}

/** Rate-limit key: the client IP, with IPv6 grouped by /64 (one home network). Used in memory only, never stored. */
export function clientKey(request) {
  const ip = request.headers.get('cf-connecting-ip') || ''
  if (!ip.includes(':')) return ip || 'unknown'
  const parts = ip.split('::')
  const head = parts[0] ? parts[0].split(':') : []
  const tail = parts.length > 1 && parts[1] ? parts[1].split(':') : []
  const full = [...head, ...Array(Math.max(0, 8 - head.length - tail.length)).fill('0'), ...tail]
  return full.slice(0, 4).join(':') + '::/64'
}

async function limited(env, name, key) {
  const rl = env[name]
  if (!rl || typeof rl.limit !== 'function') return false // binding missing (e.g. a misconfigured deploy): fail open, the WAF rule still applies
  try { const { success } = await rl.limit({ key }); return !success } catch { return false }
}

let killCache = { at: 0, on: true }
async function isOn(env, now) {
  if (env.API_DISABLED === '1') return false
  if (now - killCache.at < 30000) return killCache.on
  try {
    const row = await env.DB.prepare("SELECT value FROM settings WHERE name = 'enabled'").first()
    killCache = { at: now, on: !row || row.value !== '0' }
  } catch { killCache = { at: now, on: true } }
  return killCache.on
}
export function resetKillCache() { killCache = { at: 0, on: true } }

const bump = (env, table, cols, vals) => env.DB
  .prepare(`INSERT INTO ${table} (${cols.join(', ')}, n) VALUES (${cols.map(() => '?').join(', ')}, 1) ON CONFLICT DO UPDATE SET n = n + 1`)
  .bind(...vals)

// ---- reads

async function voteCounts(env, game, key, board) {
  const { results } = await env.DB.prepare('SELECT choice, SUM(n) AS n FROM votes WHERE game = ? AND key = ? AND board = ? GROUP BY choice').bind(game, key, board).all()
  const counts = Object.fromEntries(VOTES.map((v) => [v, 0]))
  for (const r of results) if (r.choice in counts) counts[r.choice] = Number(r.n)
  const total = VOTES.reduce((s, v) => s + counts[v], 0)
  const top = total >= MIN_FOR_VOTES ? VOTES.reduce((a, b) => (counts[b] > counts[a] ? b : a)) : null
  return total >= MIN_FOR_VOTES ? { total, top, counts } : { total, top: null, counts: null }
}

async function scoreStats(env, game, key, board, score) {
  const spec = DAILIES[game].boards[board]
  const { results } = await env.DB.prepare('SELECT score, SUM(n) AS n FROM scores WHERE game = ? AND key = ? AND board = ? GROUP BY score').bind(game, key, board).all()
  let total = 0, worse = 0
  for (const r of results) {
    const n = Number(r.n), s = Number(r.score)
    total += n
    if (score != null && (spec.better === 'low' ? s > score : s < score)) worse += n
  }
  if (total < MIN_FOR_PERCENTILE || score == null) return { players: total, beat: null }
  return { players: total, beat: Math.round((worse / total) * 100) }
}

// ---- validation

const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x)
function dailyTarget(q, now) {
  const game = q.game, cfg = DAILIES[game]
  if (!cfg) return { error: 'unknown game' }
  const board = q.board || cfg.main
  if (!cfg.boards[board]) return { error: 'unknown board' }
  if (!keyInWindow(q.key, now)) return { error: 'bad date' }
  return { game, board, key: q.key, spec: cfg.boards[board] }
}
function clampScore(raw, spec) {
  const s = Number(raw)
  if (!Number.isFinite(s)) return null
  return Math.min(spec.max, Math.max(spec.min, Math.round(s)))
}
const activePolls = (now) => { const d = utcDay(now); return POLLS.filter((p) => p.opens <= d && d <= p.closes) }

async function pollCounts(env, poll) {
  const { results } = await env.DB.prepare('SELECT choice, SUM(n) AS n FROM pollvotes WHERE poll = ? GROUP BY choice').bind(poll.id).all()
  const counts = Object.fromEntries(poll.choices.map((c) => [c.id, 0]))
  for (const r of results) if (r.choice in counts) counts[r.choice] = Number(r.n)
  return counts
}

// ---- handler

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '')
    const now = new Date(env.NOW_OVERRIDE ? Date.parse(env.NOW_OVERRIDE) : Date.now())
    const ip = clientKey(request)

    if (!path.startsWith('/api/v1/')) return fail(404, 'not found')
    if (!(await isOn(env, now.getTime()))) return json({ ok: false, off: true }, 503)

    if (request.method === 'GET') {
      if (await limited(env, 'RL_READ', ip)) return fail(429, 'slow down')
      return read(path, url.searchParams, env, now)
    }
    if (request.method !== 'POST') return fail(405, 'method not allowed')

    // Writes: same-site only, small JSON bodies, layered limits.
    const allowed = String(env.ALLOWED_ORIGINS || 'https://games.oddvale.com').split(',').map((s) => s.trim())
    if (!allowed.includes(request.headers.get('origin') || '')) return fail(403, 'bad origin')
    if (!/^application\/json\b/.test(request.headers.get('content-type') || '')) return fail(415, 'json only')
    const text = await request.text()
    if (text.length > MAX_BODY) return fail(413, 'too big')
    let body
    try { body = JSON.parse(text) } catch { return fail(400, 'bad json') }
    if (!isObj(body)) return fail(400, 'bad json')
    if (await limited(env, 'RL_WRITE', ip)) return fail(429, 'slow down')
    return write(path, body, env, now, ip)
  },

  // Daily at 03:17 UTC: roll hourly rows older than 90 days into one row per day, then delete the hourly rows.
  async scheduled(_event, env) { await rollup(env, new Date()) },
}

async function read(path, q, env, now) {
  const cache = 'public, max-age=30'
  if (path === '/api/v1/status') return json({ ok: true }, 200, cache)

  if (path === '/api/v1/daily') {
    const t = dailyTarget(Object.fromEntries(q), now)
    if (t.error) return fail(400, t.error)
    const score = q.has('score') ? clampScore(q.get('score'), t.spec) : null
    const [votes, scores] = await Promise.all([voteCounts(env, t.game, t.key, t.board), scoreStats(env, t.game, t.key, t.board, score)])
    return json({ ok: true, votes, ...scores }, 200, cache)
  }

  if (path === '/api/v1/today') {
    const key = q.get('key')
    if (!keyInWindow(key, now)) return fail(400, 'bad date')
    const { results } = await env.DB.prepare('SELECT game, board, choice, SUM(n) AS n FROM votes WHERE key = ? GROUP BY game, board, choice').bind(key).all()
    const games = {}
    for (const [game, cfg] of Object.entries(DAILIES)) {
      const rows = results.filter((r) => r.game === game && r.board === cfg.main)
      const total = rows.reduce((s, r) => s + Number(r.n), 0)
      if (total < MIN_FOR_VOTES) continue
      const top = rows.reduce((a, b) => (Number(b.n) > Number(a.n) ? b : a)).choice
      if (VOTES.includes(top)) games[game] = { top, total }
    }
    return json({ ok: true, games }, 200, cache)
  }

  if (path === '/api/v1/polls') {
    const out = []
    for (const p of activePolls(now)) {
      const counts = await pollCounts(env, p)
      out.push({ id: p.id, question: p.question, choices: p.choices, closes: p.closes, counts })
    }
    return json({ ok: true, polls: out }, 200, cache)
  }
  return fail(404, 'not found')
}

async function write(path, b, env, now, ip) {
  const hour = utcHour(now)

  if (path === '/api/v1/vote' || path === '/api/v1/score') {
    const t = dailyTarget(b, now)
    if (t.error) return fail(400, t.error)
    // Second layer: the same network can only touch the same board a few times a minute.
    if (await limited(env, 'RL_TARGET', `${ip}|${path}|${t.game}|${t.key}|${t.board}`)) return fail(429, 'slow down')
    if (path === '/api/v1/vote') {
      if (!VOTES.includes(b.choice)) return fail(400, 'bad choice')
      await bump(env, 'votes', ['game', 'key', 'board', 'choice', 'hour'], [t.game, t.key, t.board, b.choice, hour]).run()
      return json({ ok: true, votes: await voteCounts(env, t.game, t.key, t.board) })
    }
    const score = clampScore(b.score, t.spec)
    if (score == null) return fail(400, 'bad score')
    await bump(env, 'scores', ['game', 'key', 'board', 'score', 'hour'], [t.game, t.key, t.board, score, hour]).run()
    return json({ ok: true, ...(await scoreStats(env, t.game, t.key, t.board, score)) })
  }

  if (path === '/api/v1/tell' || path === '/api/v1/thumb') {
    if (!GAMES.includes(b.game)) return fail(400, 'unknown game')
    if (await limited(env, 'RL_TARGET', `${ip}|${path}|${b.game}`)) return fail(429, 'slow down')
    if (path === '/api/v1/tell') {
      if (!TELLS.includes(b.choice)) return fail(400, 'bad choice')
      await bump(env, 'tells', ['game', 'choice', 'hour'], [b.game, b.choice, hour]).run()
    } else {
      if (b.up !== true && b.up !== false) return fail(400, 'bad thumb')
      await bump(env, 'thumbs', ['game', 'up', 'hour'], [b.game, b.up ? 1 : 0, hour]).run()
    }
    return json({ ok: true })
  }

  if (path === '/api/v1/poll') {
    const poll = activePolls(now).find((p) => p.id === b.poll)
    if (!poll) return fail(400, 'unknown poll')
    if (!poll.choices.some((c) => c.id === b.choice)) return fail(400, 'bad choice')
    if (await limited(env, 'RL_TARGET', `${ip}|poll|${poll.id}`)) return fail(429, 'slow down')
    await bump(env, 'pollvotes', ['poll', 'choice', 'hour'], [poll.id, b.choice, hour]).run()
    return json({ ok: true, counts: await pollCounts(env, poll) })
  }
  return fail(404, 'not found')
}

/** Roll hourly rows (hour = "YYYY-MM-DDTHH") older than RETAIN_DAYS into daily rows (hour = "YYYY-MM-DD"). */
export async function rollup(env, now) {
  const cutoff = utcHour(new Date(now.getTime() - RETAIN_DAYS * DAY))
  const tables = { votes: ['game', 'key', 'board', 'choice'], scores: ['game', 'key', 'board', 'score'], tells: ['game', 'choice'], thumbs: ['game', 'up'], pollvotes: ['poll', 'choice'] }
  const stmts = []
  for (const [t, cols] of Object.entries(tables)) {
    const c = cols.join(', ')
    stmts.push(env.DB.prepare(`INSERT INTO ${t} (${c}, hour, n) SELECT ${c}, substr(hour, 1, 10), SUM(n) FROM ${t} WHERE length(hour) = 13 AND hour < ? GROUP BY ${c}, substr(hour, 1, 10) ON CONFLICT DO UPDATE SET n = n + excluded.n`).bind(cutoff))
    stmts.push(env.DB.prepare(`DELETE FROM ${t} WHERE length(hour) = 13 AND hour < ?`).bind(cutoff))
  }
  await env.DB.batch(stmts)
}

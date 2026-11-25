// Tests the Worker against a real SQLite database (node:sqlite) wrapped to look like D1, with fake rate limiters.
// Run: npm run api:test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import worker, { clientKey, keyInWindow, rollup, resetKillCache } from '../src/index.js'
import { POLLS } from '../src/config.js'

const schema = fs.readFileSync(new URL('../schema.sql', import.meta.url), 'utf8')

function fakeD1() {
  const db = new DatabaseSync(':memory:')
  db.exec(schema)
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    run: async () => { db.prepare(sql).run(...args); return { success: true } },
    first: async () => db.prepare(sql).get(...args) ?? null,
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    _exec: () => db.prepare(sql).run(...args),
  })
  return { raw: db, prepare: (sql) => stmt(sql), batch: async (list) => { db.exec('BEGIN'); try { for (const s of list) s._exec(); db.exec('COMMIT') } catch (e) { db.exec('ROLLBACK'); throw e } } }
}
function fakeLimiter(limit) {
  const seen = new Map()
  return { limit: async ({ key }) => { const n = (seen.get(key) || 0) + 1; seen.set(key, n); return { success: n <= limit } }, reset: () => seen.clear() }
}

const NOW = '2026-12-02T15:30:00Z'
function makeEnv(extra = {}) {
  resetKillCache()
  return { DB: fakeD1(), RL_WRITE: fakeLimiter(1e9), RL_TARGET: fakeLimiter(1e9), RL_READ: fakeLimiter(1e9), ALLOWED_ORIGINS: 'https://games.oddvale.com', NOW_OVERRIDE: NOW, ...extra }
}
let ipCounter = 0
const nextIp = () => `203.0.113.${(ipCounter++ % 250) + 1}`
const post = (env, path, body, { origin = 'https://games.oddvale.com', ip = nextIp(), type = 'application/json' } = {}) =>
  worker.fetch(new Request(`https://games.oddvale.com${path}`, { method: 'POST', headers: { origin, 'content-type': type, 'cf-connecting-ip': ip }, body: typeof body === 'string' ? body : JSON.stringify(body) }), env)
const get = (env, path, ip = nextIp()) => worker.fetch(new Request(`https://games.oddvale.com${path}`, { headers: { 'cf-connecting-ip': ip } }), env)

test('date window accepts yesterday, today and tomorrow (UTC) only', () => {
  const now = new Date(NOW)
  for (const k of ['2026-12-01', '2026-12-02', '2026-12-03']) assert.ok(keyInWindow(k, now), k)
  for (const k of ['2026-11-30', '2026-12-04', '2026-02-30', '2026-12-2', 'today', null, 20261202]) assert.ok(!keyInWindow(k, now), String(k))
})

test('IPv6 clients are grouped by /64; IPv4 as-is', () => {
  const h = (ip) => clientKey(new Request('https://x/', { headers: { 'cf-connecting-ip': ip } }))
  assert.equal(h('2001:db8:1:2:aaaa::1'), '2001:db8:1:2::/64')
  assert.equal(h('2001:db8:1:2:ffff:1:2:3'), '2001:db8:1:2::/64')
  assert.equal(h('2001:db8::1'), '2001:db8:0:0::/64')
  assert.equal(h('198.51.100.7'), '198.51.100.7')
})

test('votes count and show shares only after the floor', async () => {
  const env = makeEnv()
  let r = await post(env, '/api/v1/vote', { game: 'lookout', key: '2026-12-02', board: 'small', choice: 'tricky' })
  assert.equal(r.status, 200)
  let j = await r.json()
  assert.equal(j.votes.total, 1); assert.equal(j.votes.top, null); assert.equal(j.votes.counts, null)
  for (const c of ['tricky', 'tricky', 'fair', 'brutal']) await post(env, '/api/v1/vote', { game: 'lookout', key: '2026-12-02', board: 'small', choice: c })
  j = await (await get(env, '/api/v1/daily?game=lookout&key=2026-12-02&board=small')).json()
  assert.equal(j.votes.total, 5); assert.equal(j.votes.top, 'tricky'); assert.equal(j.votes.counts.tricky, 3)
  const t = await (await get(env, '/api/v1/today?key=2026-12-02')).json()
  assert.deepEqual(t.games, { lookout: { top: 'tricky', total: 5 } })
})

test('scores: clamped, percentile hidden under 30 results, correct direction', async () => {
  const env = makeEnv()
  // wonky-putt is lower-is-better, range 1-12
  for (let i = 0; i < 29; i++) await post(env, '/api/v1/score', { game: 'wonky-putt', key: '2026-12-02', score: 2 + (i % 4) }) // 2..5
  let j = await (await post(env, '/api/v1/score', { game: 'wonky-putt', key: '2026-12-02', score: 9999 })).json()
  assert.equal(j.players, 30)
  assert.equal(j.beat, 0, 'clamped to 12, the worst score, beats nobody')
  const max = env.DB.raw.prepare('SELECT MAX(score) AS m FROM scores').get().m
  assert.equal(max, 12)
  j = await (await get(env, '/api/v1/daily?game=wonky-putt&key=2026-12-02&score=1')).json()
  assert.equal(j.beat, 100)
  j = await (await get(env, '/api/v1/daily?game=wonky-putt&key=2026-12-02&score=3')).json()
  // worse than 3: scores 4 and 5 (7 + 7 = 14 of the 29) plus the clamped 12 -> 15/30
  assert.equal(j.beat, 50)
  // soupspell is higher-is-better
  for (let i = 0; i < 30; i++) await post(env, '/api/v1/score', { game: 'soupspell', key: '2026-12-02', score: i * 10 })
  j = await (await get(env, '/api/v1/daily?game=soupspell&key=2026-12-02&score=150')).json()
  assert.equal(j.beat, 50)
  const few = makeEnv()
  await post(few, '/api/v1/score', { game: 'rungs', key: '2026-12-02', board: 'tall', score: 5 })
  j = await (await get(few, '/api/v1/daily?game=rungs&key=2026-12-02&board=tall&score=5')).json()
  assert.equal(j.players, 1); assert.equal(j.beat, null)
})

test('rejects unknown games, boards, choices, dates, origins and junk', async () => {
  const env = makeEnv()
  const bad = [
    [{ game: 'nope', key: '2026-12-02', choice: 'fair' }],
    [{ game: 'lookout', key: '2026-12-02', board: 'huge', choice: 'fair' }],
    [{ game: 'lookout', key: '2026-12-02', choice: 'meh' }],
    [{ game: 'lookout', key: '2026-11-20', choice: 'fair' }],
    [{ game: 'lookout', key: '2026-12-02', choice: 'fair' }, { origin: 'https://evil.example' }],
    [{ game: 'lookout', key: '2026-12-02', choice: 'fair' }, { origin: '' }],
    [{ game: 'lookout', key: '2026-12-02', choice: 'fair' }, { type: 'text/plain' }],
    ['not json'],
    ['[1,2]'],
    [{ game: 'lookout', key: '2026-12-02', choice: 'fair', pad: 'x'.repeat(600) }],
  ]
  for (const [body, opts] of bad) {
    const r = await post(env, '/api/v1/vote', body, opts)
    assert.ok(r.status >= 400 && r.status < 500, `${JSON.stringify(body).slice(0, 60)} ${JSON.stringify(opts)} -> ${r.status}`)
  }
  assert.equal(env.DB.raw.prepare('SELECT COUNT(*) AS c FROM votes').get().c, 0)
  assert.equal((await post(env, '/api/v1/tell', { game: 'lookout', choice: 'free text here' })).status, 400)
  assert.equal((await post(env, '/api/v1/thumb', { game: 'lookout', up: 'yes' })).status, 400)
  assert.equal((await post(env, '/api/v1/score', { game: 'lookout', key: '2026-12-02', score: 'abc' })).status, 400)
  assert.equal((await worker.fetch(new Request('https://games.oddvale.com/api/v1/vote', { method: 'PUT' }), env)).status, 405)
  assert.equal((await get(env, '/api/v2/x')).status, 404)
})

test('tells and thumbs count by game and fixed choice only', async () => {
  const env = makeEnv()
  assert.equal((await post(env, '/api/v1/tell', { game: 'odd-one-out', choice: 'phone' })).status, 200)
  assert.equal((await post(env, '/api/v1/thumb', { game: 'odd-one-out', up: true })).status, 200)
  assert.equal((await post(env, '/api/v1/thumb', { game: 'odd-one-out', up: false })).status, 200)
  assert.equal(env.DB.raw.prepare('SELECT SUM(n) AS s FROM thumbs').get().s, 2)
  assert.equal(env.DB.raw.prepare("SELECT n FROM tells WHERE choice = 'phone'").get().n, 1)
})

test('rate limits: per network and per network+board', async () => {
  const env = makeEnv({ RL_TARGET: fakeLimiter(3), RL_WRITE: fakeLimiter(5) })
  const ip = '198.51.100.9'
  const codes = []
  for (let i = 0; i < 4; i++) codes.push((await post(env, '/api/v1/vote', { game: 'rungs', key: '2026-12-02', choice: 'fair' }, { ip })).status)
  assert.deepEqual(codes, [200, 200, 200, 429])
  assert.equal((await post(env, '/api/v1/vote', { game: 'lookout', key: '2026-12-02', choice: 'fair' }, { ip })).status, 200)
  assert.equal((await post(env, '/api/v1/vote', { game: 'blinkwire', key: '2026-12-02', choice: 'fair' }, { ip })).status, 429, 'sixth write from one network in a minute')
  assert.equal((await post(env, '/api/v1/vote', { game: 'blinkwire', key: '2026-12-02', choice: 'fair' }, { ip: '198.51.100.10' })).status, 200)
  assert.equal(env.DB.raw.prepare("SELECT SUM(n) AS s FROM votes WHERE game = 'rungs'").get().s, 3)
})

test('kill switch turns everything off without a redeploy', async () => {
  const env = makeEnv()
  env.DB.raw.exec("UPDATE settings SET value = '0' WHERE name = 'enabled'")
  const r = await get(env, '/api/v1/status')
  assert.equal(r.status, 503); assert.equal((await r.json()).off, true)
  assert.equal((await post(env, '/api/v1/vote', { game: 'rungs', key: '2026-12-02', choice: 'fair' })).status, 503)
  assert.equal((await get(makeEnv({ API_DISABLED: '1' }), '/api/v1/status')).status, 503)
})

test('no response ever sets a cookie or CORS header', async () => {
  const env = makeEnv()
  const rs = [
    await get(env, '/api/v1/status'), await get(env, '/api/v1/polls'), await get(env, '/api/v1/today?key=2026-12-02'),
    await post(env, '/api/v1/vote', { game: 'rungs', key: '2026-12-02', choice: 'fair' }), await post(env, '/api/v1/vote', 'junk'),
  ]
  for (const r of rs) {
    assert.equal(r.headers.get('set-cookie'), null)
    assert.equal(r.headers.get('access-control-allow-origin'), null)
    assert.match(r.headers.get('content-type'), /application\/json/)
  }
})

test('the database never stores anything about the client', async () => {
  const env = makeEnv()
  await post(env, '/api/v1/vote', { game: 'rungs', key: '2026-12-02', choice: 'fair' }, { ip: '198.51.100.77' })
  await post(env, '/api/v1/score', { game: 'rungs', key: '2026-12-02', score: 4 }, { ip: '2001:db8:77::1' })
  const dump = JSON.stringify(['votes', 'scores', 'tells', 'thumbs', 'pollvotes'].map((t) => env.DB.raw.prepare(`SELECT * FROM ${t}`).all()))
  assert.ok(!/198\.51|2001:db8|203\.0/.test(dump), dump)
})

test('polls: only approved, open polls are served or counted', async () => {
  const env = makeEnv()
  const j = await (await get(env, '/api/v1/polls')).json()
  assert.deepEqual(j.polls.map((p) => p.id), POLLS.filter((p) => p.opens <= '2026-12-02' && '2026-12-02' <= p.closes).map((p) => p.id))
  assert.equal((await post(env, '/api/v1/poll', { poll: '2026-12-next-game', choice: 'sift' })).status, POLLS.some((p) => p.id === '2026-12-next-game') ? 200 : 400)
  assert.equal((await post(env, '/api/v1/poll', { poll: 'made-up', choice: 'x' })).status, 400)
})

test('rollup folds hourly rows older than 90 days into daily rows', async () => {
  const env = makeEnv()
  const db = env.DB.raw
  db.exec("INSERT INTO votes VALUES ('rungs','2026-08-01','short','fair','2026-08-01T10',3), ('rungs','2026-08-01','short','fair','2026-08-01T22',2), ('rungs','2026-12-01','short','fair','2026-12-01T09',4)")
  await rollup(env, new Date(NOW))
  const rows = db.prepare('SELECT hour, n FROM votes ORDER BY hour').all().map((r) => ({ ...r }))
  assert.deepEqual(rows, [{ hour: '2026-08-01', n: 5 }, { hour: '2026-12-01T09', n: 4 }])
  await rollup(env, new Date(NOW)) // idempotent
  assert.equal(db.prepare('SELECT SUM(n) AS s FROM votes').get().s, 9)
})

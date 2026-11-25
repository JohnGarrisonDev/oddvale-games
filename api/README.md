# Oddvale Games API

A small Cloudflare Worker on `games.oddvale.com/api/*` that counts anonymous difficulty votes, daily scores (for "you beat N% of today's players"), "Tell us" taps, thumbs and owner polls. Plan and reasoning: [studio/meetings/2026-11-25-player-input-and-odd-account/plan.md](../studio/meetings/2026-11-25-player-input-and-odd-account/plan.md).

**Privacy rules (never break without the owner):** store counts only. No IP, IP hash, device ID, cookie, user agent or free text. No `Set-Cookie`, no CORS headers. The client IP is only a key for Cloudflare's in-memory rate limiter. The privacy page (`site/pages/privacy.html`) describes exactly this; change both together.

## Files
- `src/index.js`: the Worker (routes, validation, layered limits, kill switch, 90-day roll-up cron).
- `src/config.js`: allow-lists. Games, boards, score ranges and directions, vote and Tell-us choices. A new daily game or board needs an entry here.
- `../polls.json`: owner polls. Only `"approved": true` polls inside their dates are served.
- `schema.sql`: D1 tables (all anonymous counters) and the `settings` row for the kill switch.
- `test/api.test.js`: `npm run api:test` (runs against real SQLite through `node:sqlite`).

## Endpoints (`/api/v1/...`)
| | | |
|---|---|---|
| GET `status` | `{ ok }`, or 503 `{ off: true }` when switched off | |
| GET `daily?game&key&board&score` | votes (shares once 5+ votes), players, beat % (once 30+ results) | cached 30 s |
| GET `today?key` | top community vote per daily game's main board | for the home page |
| GET `polls` | open approved polls with counts | |
| POST `vote` `{game,key,board?,choice}` | difficulty vote | same-origin JSON only |
| POST `score` `{game,key,board?,score}` | daily score, clamped to the board's range | |
| POST `tell` `{game,choice}` / `thumb` `{game,up}` / `poll` `{poll,choice}` | | |

Limits: 20 writes a minute per network (IPv6 grouped by /64), 3 a minute per network on the same board/game/poll, 120 reads a minute, plus a Cloudflare WAF rule (Block). Dates must be within a day of today (UTC).

## Run locally
```
npm run api:dev          # Worker + local D1 on http://127.0.0.1:8787 (allowed origins in api/.dev.vars)
npm run build:local && npm run serve:api   # site on :4173 with /api proxied to the Worker
```

## First deploy (one time)
1. The Cloudflare API token needs: **Account › Workers Scripts › Edit**, **Account › D1 › Edit**, **Zone (oddvale.com) › Workers Routes › Edit**, and for the abuse rule **Zone › Zone WAF › Edit** (plus **Zone › Analytics › Read** for `npm run analytics`).
2. `cd api && node ../scripts/cf.mjs d1 create oddvale-games-api`, then put the printed `database_id` in `wrangler.toml`.
3. `npm run api:db:init` (creates the tables), then `npm run api:deploy`.
4. Check: `https://games.oddvale.com/api/v1/status` returns `{"ok":true}` and has no `Set-Cookie` header.
5. Owner, in the dashboard: Workers Paid plan ($5/month) with a usage notification, and a WAF rate-limiting rule on `/api/` with action **Block** (never Challenge: that sets a cookie).

## Kill switch
Turn every widget off within 30 seconds, no redeploy:
```
node ../scripts/cf.mjs d1 execute oddvale-games-api --remote --command "UPDATE settings SET value = '0' WHERE name = 'enabled'"
```
Set it back to `'1'` to turn them on. The games keep working either way; the widgets just stay hidden.

## Removing spam
Counts are stored per UTC hour (`hour = 'YYYY-MM-DDTHH'`). Find the burst with a `GROUP BY hour` query and delete those rows.

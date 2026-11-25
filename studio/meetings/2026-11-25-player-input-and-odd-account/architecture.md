# Platform architect: how we would build and run it

**Role:** Platform architect · **Date:** 2026-11-25 · **Angle:** what it takes to build and operate, with the least ops for one person plus agents.

## Top 3 recommendations

1. **Build polls and ratings now as one small Pages Function on the existing `oddvale-games` project, backed by one D1 database.** The function lives at `games.oddvale.com/api/*`, so the CSP doesn't change (`connect-src 'self'` already allows it), there's no new domain, no cookies and no third-party script. Poll questions are JSON files in the hub repo, reviewed in git, so the polls themselves are made in the open. It costs $0 on the free tier. Budget $5/month for Workers Paid once traffic is real. Effort: about 2-3 agent-sessions.
2. **Don't build the Odd Account yet.** Polls and ratings don't need it. Today only one app (Pullbox) has user accounts. Accounts also bring cookies, a privacy-promise change and child-safety duties to a kids-friendly arcade. Decide now how it will work so nothing built in the meantime blocks it, and build it when there's a trigger: a second app needs sign-in, or players ask for cross-device sync.
3. **When it is built, buy the identity provider and connect apps over standard OIDC.** Each app gets its own session; don't share an `.oddvale.com` cookie. My pick is **WorkOS AuthKit** (free up to 1M MAU, with PKCE public clients for desktop and mobile). **Auth0 Free** is the runner-up if a free custom domain matters more. Apps store their own user rows keyed by `(issuer, sub)` and the verified email, so moving to another provider later is a data migration, not a rewrite. Don't hand-roll OIDC. If the owner wants self-hosted, use Better Auth on Workers + D1, not our own code.

## 1. Anonymous polls and ratings

### Shape
```
browser (games.oddvale.com, strict CSP, no cookies)
   |  fetch('/api/...')  same origin
   v
Cloudflare Pages Function  functions/api/[[route]].js   (_routes.json: include ["/api/*"] only)
   |-- Rate Limiting binding  (per IP+route, 10s/60s windows)
   |-- D1 "oddvale-games"     (polls, votes, ratings, counts)
   '-- Cache API              (results JSON, 60-300 s)
```
`_routes.json` keeps the function off every static path, so the arcade stays static. Static requests are never counted against the Functions quota, and if the function fails, only the poll widget is affected.

### API
| Method | Path | Body / result |
|---|---|---|
| GET | `/api/polls?game=<slug>` | open polls for a game or the hub: `{id, question, options[], closes, results:{option:n}, total}` (cached 60 s) |
| POST | `/api/polls/<id>/vote` | `{option, device}` -> `200 {results}`, `409` already voted, `429` slow down |
| GET | `/api/ratings` | `{<slug>: {avg, n}}` for all games, cached 5 min; the hub shows a score only when `n >= 20` |
| POST | `/api/ratings/<slug>` | `{stars: 1-5, device}`, one rating per device per game, can be changed |

Each POST checks `Origin == https://games.oddvale.com`, requires `Content-Type: application/json`, and rejects bodies over 1 KB. There's no CORS. Phase 1 takes **no free text**: with children playing, free text means moderation load and personal data we don't want. Text feedback stays on GitHub.

Polls are authored as `polls/<id>.json` (question, options, open/close dates) and pushed to D1 when we deploy, so no admin UI is needed.

### Deduping without cookies or trackers
Neither of the obvious options works well alone:
- **Hashed IP alone** blocks whole classrooms and households behind one school or home router. That matters for an arcade kids play.
- **localStorage ID alone** can be cleared in a second.

The design that balances both:
- The browser creates a random `device` value (`crypto.randomUUID()`) **only when the player first votes or rates**. It's stored in localStorage under the kit's existing namespace and never sent anywhere except these two POST endpoints.
- The server stores `voter = HMAC(poll_secret, device)`, never the raw value. Each poll gets its own random secret, and the secret is deleted when the poll closes, so votes can't be linked across polls or traced back to a device afterwards. A `UNIQUE(poll_id, voter)` constraint makes double votes fail at the database.
- An IP rate limit catches ballot stuffing: the Rate Limiting binding key is `HMAC(daily_salt, ip) + route`, allowing about 5 votes per 10 s. A D1 counter keyed by the same daily hash caps one IP at about 200 votes per poll per day, which is generous enough for a classroom but stops scripts. The daily salt lives in KV or D1 and is replaced at 00:00 UTC; raw IPs are never stored.
- One week after a poll closes, a cron Worker or the next deploy deletes its vote rows. Only the totals are kept.
- **Turnstile stays in reserve.** Adding it means allowing `challenges.cloudflare.com` in `script-src` and `frame-src`, which loosens the CSP and loads a third-party script. Add it only if abuse actually shows up (about 0.5 session).

Is this a tracker? I don't think so: the ID is random, created only when the player acts, used only to stop double votes, and never linked to anything. But the privacy page and the "no cookies or trackers" line should say so plainly, and the legal role should confirm the ePrivacy reading (local storage that is strictly necessary for a service the user asked for).

### Cheap reads
- Each vote updates a `poll_counts(poll_id, option, n)` row in the same D1 batch, so reads never scan the vote rows.
- The vote response returns fresh results, so a player sees results right after voting without a second call.
- GET responses go through `caches.default` for 60-300 s, so most reads skip D1. Hub-card ratings could instead be baked in at deploy time by `scripts/build.mjs`.

### Limits and cost (checked 2026-11-25)
- Workers Free: 100,000 requests/day and 10 ms CPU per request. D1 Free: 5M rows read and 100k rows written per day, 500 MB per database. **When over the limit, queries fail; you aren't billed.** ([D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 free-tier enforcement](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/).)
- Each vote writes about 3-4 rows, because indexes count as writes. 100k writes/day is therefore roughly 25k votes/day, far above anything we've seen. The widget must handle a failed call by hiding results and saying "Polls are resting, try later".
- The Rate Limiting binding is GA, but it counts per Cloudflare location and is a loose filter, not a strict guarantee ([docs](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)). That's why the hard rule is the UNIQUE constraint in the database.
- **Cost estimate:** $0 to start. **Workers Paid at $5/month** (my estimate of the trigger: above about 50k API calls/day, or the first time we hit a limit) removes the hard caps. Nothing here needs anyone watching a dashboard: limits fail closed, and the site stays up.

## 2. The Odd Account

### What auth exists today (read-only inspection of the private repos)
| App | What it has | What joining an Odd Account would take |
|---|---|---|
| **Pullbox** (`grail-diary`) | Real accounts. ASP.NET Core 10 Identity with EF Core on PostgreSQL (Prisma Postgres). Email + password with lockout, plus Google sign-in by validating a Google ID token (`Auth/GoogleAuth.cs`). Its own HS256 JWT access tokens (15 min) and rotating refresh tokens (30 days, hashed, reuse detection that revokes every session). Browsers get an httpOnly `SameSite=Strict` cookie scoped to `/api/auth`; the Expo mobile app keeps tokens in secure storage. Also has JSON data export, account deletion, opt-in public profiles, and reviews with 1-10 half-star ratings. Well built. | Keep Identity and its tokens. Add "Continue with Oddvale" as one more external login (`AspNetUserLogins` provider `Oddvale`), reusing the existing Google linking logic (link by verified email, remove unverified passwords). Web uses the OIDC code flow; mobile uses the system browser with PKCE. About 1-2 sessions. |
| **Odd House** (`odd-house`) | No viewer accounts; viewers are anonymous, and the feed only keeps hourly viewer counts. The production desk is local-only (127.0.0.1) with one shared admin token that becomes an `oh_admin` cookie. Chat votes are built but off behind `--votes`, waiting on a privacy and terms review. The sim runs on Fly.io (`fly.toml`, app `odd-house-sim`). | Nothing to migrate. If chat votes launch with sign-in, the feed checks Odd access tokens (JWT via JWKS) when a WebSocket connects. About 1 session. Keep the admin desk off the public identity provider. |
| **Ghostframe** (`ghostframe`) | No central accounts. The Electron app starts a Python backend on 127.0.0.1 (random port, per-launch token). Leagues are self-hosted servers using one-time invite codes, then personal tokens (only hashes stored) and an admin token. Its only game is marked not cleared for public distribution. | Optional "Sign in with Oddvale" through the system browser with a loopback redirect and PKCE (RFC 8252). League servers could accept Odd tokens instead of invite tokens. About 2 sessions, and little value until a public, rights-cleared game exists. |
| oddvale.com and the arcade | Nothing. | New. |

So the "shared account" would today join one app that has real users (Pullbox, whose first database migration is from 2026-11-07) with apps that have none.

### Build or buy (checked 2026-11-25; verify before signing up)
| Option | Acts as our OIDC provider for web, desktop and mobile? | Passkeys / email codes / social | Free tier | Lock-in and export | Our code and maintenance |
|---|---|---|---|---|---|
| **WorkOS AuthKit** | Yes. Connect OAuth apps cover public PKCE clients; there's an official Electron PKCE example ([docs](https://workos.com/docs/authkit/connect/oauth)) | Yes / Magic Auth codes / Google, Apple, GitHub and more | 1M MAU free ([pricing](https://workos.com/pricing)); custom domain reported at about $99/month ([third-party](https://markaicode.com/pricing/workos-pricing/)) | Standard OIDC; users exportable via API | Small: config plus each app's OIDC client |
| **Auth0** | Yes, the most mature OIDC | Yes, passkeys on Free / yes / yes | 25k MAU; one custom domain once a card is on file ([pricing](https://auth0.com/pricing)) | Standard; password hash export by support ticket | Small; steep price steps above Free |
| **Clerk** | Built for apps on its own SDK. Cross-domain "satellite" sessions need a paid plan in production ([docs](https://clerk.com/docs/guides/dashboard/dns-domains/satellite-domains)); I didn't confirm it as a general OIDC provider | Yes | Reported 50k retained users free ([Clerk](https://clerk.com/articles/clerk-pricing-explained)) | SDK-shaped, so more lock-in | Small for React, awkward for .NET and Electron |
| **Entra External ID** | Yes, and fits .NET and Azure | Varies by feature; verify | 50k MAU free ([Microsoft](https://learn.microsoft.com/en-gb/entra/external-id/external-identities-pricing)) | Standard | Heavier to set up; custom URL domains need Azure Front Door (my understanding; verify) |
| **Supabase Auth** | OAuth 2.1 / OIDC server, **beta** ([docs](https://supabase.com/docs/guides/auth/oauth-server)) | Yes | Reported 50k MAU; free projects pause when idle (from memory; verify), which is risky for an identity provider | Postgres, easy export | Medium |
| **Firebase Auth** | No, it can't act as a provider for other apps | n/a | n/a | n/a | Ruled out |
| **Better Auth on Workers + D1** (self-hosted) | Yes, via the `oauth-provider` plugin (OAuth 2.1 + OIDC) ([docs](https://better-auth.com/docs/plugins/oauth-provider)); native D1 since v1.5 | Passkey plugin / magic link (we'd need an email sender) / social | About $0-5/month plus email | None; our data | Medium: about 1-2k lines of glue, plus we own patching, email deliverability and abuse handling |
| Our own OIDC code | Possible | Everything by hand | $0 | None | **Bad idea.** Security-critical code nobody is watching |

Ory, Logto and Kinde weren't checked in detail.

Why I'd buy: the brief says security must not depend on someone watching dashboards. A hosted provider handles credential stuffing, email deliverability, passkey edge cases and breach response. WorkOS's free tier is large enough that cost isn't a factor at our scale. If owning the data, $0 and a custom domain matter more than the ops, Better Auth on Workers is the honest second choice. It's the same OIDC shape, so apps don't care which one sits behind `account.oddvale.com`.

### Sessions across subdomains: one central provider, separate session per app
- A shared `.oddvale.com` cookie goes to every subdomain, including the Odd House feed (`house-feed.oddvale.com`) and anything an agent puts up later. One XSS bug or compromised subdomain can ride every session, and subdomains can plant ("toss") cookies on each other.
- That cookie also does nothing for Ghostframe on the desktop or Pullbox mobile, which need tokens anyway.
- It would tie Pullbox's .NET API to a session format it doesn't own.
- With OIDC, each app runs its own short session (a host-only `__Host-` cookie on the web, tokens in secure storage on desktop and mobile). The provider's session on `account.oddvale.com` gives single sign-on: signing in to a second app is one click, not a password. Logout is per app, with optional back-channel logout later.

### How games would use it, always optional
- localStorage stays the source of truth. Signed-out play doesn't change.
- A small backend-for-frontend (BFF) runs as more Pages Functions routes: `/api/auth/login` redirects to the provider (a top-level navigation, so it's allowed under `connect-src 'self'`), `/api/auth/callback` exchanges the code on the server and sets a `__Host-ov_games` cookie (httpOnly, Secure, SameSite=Lax) for games.oddvale.com only. Tokens never reach page JavaScript.
- `GET/PUT /api/sync/<game>` takes `{schema, blob, updatedAt}` and stores it in D1 by user. Each game's kit merges by its own rules (union of solved days, best of streaks), so syncing never loses progress made on one device.
- Accounts are for ages 13 and up. Games never prompt for them during play; a "Sync my progress" link goes in settings.
- **This needs a promise change:** "no cookies unless you choose to sign in". That's the owner's call.

## 3. Recommended architecture

```
                         account.oddvale.com  (hosted IdP: WorkOS AuthKit; OIDC + PKCE)
                        /           |              |                 \
   games.oddvale.com           pullbox.oddvale.com   Ghostframe (Electron)   house.oddvale.com
   static + Pages Functions    .NET API + web + Expo   loopback PKCE          feed on Fly.io
   /api/polls  /api/ratings    Identity keeps its own  -> token to league     verifies JWT on WS
   /api/auth/* (BFF, phase 3)  tokens; Oddvale = one
   /api/sync/* (phase 3)       more external login
        |
   D1 "oddvale-games"  + Rate Limiting binding  (+ Turnstile only if abused)
```

| Phase | What | Effort (estimate) | Cost |
|---|---|---|---|
| 1. Polls and ratings | D1 schema, Pages Function, `_routes.json`, polls JSON pushed at deploy, kit widget (vote, results, stars), dedupe and limits, tests, privacy page text, deploy | 2-3 agent-sessions | $0 (Workers Paid $5/month when traffic needs it) |
| 2. Hardening, only if needed | Turnstile plus CSP change, cron cleanup, bake ratings into the build | 0.5-1 | $0 |
| 3. Odd Account, only on a trigger and owner approval | Owner creates the provider tenant (a human step); account page (profile, export, delete); games BFF and sync; Pullbox external login; Odd House token check; Ghostframe loopback | About 8-11 total (games 2-3, account page 1-2, Pullbox 1-2, Odd House 1, Ghostframe 2) | $0 on free tiers; about $99/month if we want a WorkOS custom domain |

## Risks
- Free-tier limits fail hard. That's fine if the widget handles it gracefully and $5/month is pre-approved.
- Hashed-IP limits are imperfect behind mobile carrier NAT and VPNs. Votes from those players may be capped too tightly or slip through; the database's unique rule still prevents most double votes.
- Pricing and features of identity providers change. The figures above come partly from third-party pages and must be re-checked before choosing.
- Accounts plus children means COPPA, GDPR-K and UK AADC duties. Gating accounts at 13+ and collecting the minimum keeps that small, but it isn't zero.

## Open questions for the owner
1. Do you approve a small backend on games.oddvale.com (Pages Function + D1), and the $5/month Workers Paid plan if usage needs it?
2. Is a random vote ID stored in the browser, created only when someone votes, acceptable under the "no cookies or trackers" wording, with a plain note on the privacy page?
3. For the Odd Account later: buy (WorkOS or Auth0) or self-host (Better Auth on Workers)? And is a custom domain on the login page worth about $99/month?
4. Would you accept "no cookies unless you sign in" as the arcade's promise once accounts exist?

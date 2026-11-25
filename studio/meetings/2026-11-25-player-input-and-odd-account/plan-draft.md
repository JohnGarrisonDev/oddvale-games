# Draft plan: player input, security and the Odd Account

Status: **draft for Meeting 2** (review panel). Written by the Director from the five positions in this folder: [product](product.md), [architecture](architecture.md), [security](security.md), [privacy-legal](privacy-legal.md), [cost-ops](cost-ops.md). Prices were checked by the roles on 2026-11-25 and some are third-party figures marked "verify" in their files.

## Where the five roles agree
1. **Yes to polls and ratings, now, with no accounts.** Fixed choices only, no free text anywhere (free text brings moderation duties, children posting personal details, and injection risk).
2. **No Odd Account yet.** Every role reached this independently: no player numbers exist, only Pullbox has accounts today, and accounts bring cookies, a change to the public promise, child-safety law and a bigger breach blast radius.
3. **When the Odd Account is built: buy, don't hand-roll.** A hosted identity provider over standard OIDC, each app with its own session. **Never a shared `.oddvale.com` session cookie.** Accounts 13+ only. Lawyer review before launch.
4. **Cost is small; the real costs are legal review and the owner's time.**

## Where they disagree, and the Director's call
**How to stop repeat votes.**
- Security: store a hashed IP (daily salt, purged in 48 h) and require Turnstile on every vote.
- Architecture: store a per-poll HMAC of a random device ID made on first vote; rate-limit by hashed IP; Turnstile in reserve.
- Privacy/legal: store nothing that identifies a voter (hashed IPs and device IDs are personal data, per EDPS v SRB, Sept 2025); keep an "already voted" flag only in the browser; accept that a determined person can vote twice.

**Call (draft): privacy's design, plus rate limiting that stores nothing.** Votes are anonymous counters. The browser remembers it voted. Abuse is limited by Cloudflare's Workers Rate Limiting binding keyed on the client IP, which counts in Cloudflare's memory for a short window and is never written to our database, plus a WAF rule. No Turnstile at launch (it loads a third-party script and sets a cookie, which would change the promise); hold it in reserve if real abuse appears. Reasons: every role agreed the stakes are low (no prizes, nothing decided automatically by a vote), this keeps "no cookies, no trackers" literally true, and it needs no consent banner and no children's-law work. Poll results are shown as "votes" and treated as a signal, not a referendum.

**Public star ratings.** Product: private thumbs only. Architecture: show a score once a game has 20+ ratings. **Call (draft): collect a private thumbs up/down per game now; decide on public display after a month of data.** A public score on a nine-game arcade invites stuffing and adds little.

## The plan

### Phase 0: anonymous input (December 2026)
What players get:
- **"How was today's puzzle?"** one tap on every daily's result card: Breeze / Fair / Tricky / Brutal. Then a line: "Most players found it Tricky."
- **Shared daily stats**: the result card also shows "You beat 62% of today's players" (the game submits its score once per daily, anonymously; the server returns the distribution).
- **Thumbs up / down** on each game, private (for the studio, shown in reports).
- **Owner polls** on the home page ("Which game next?"), questions kept as JSON in the hub repo, so no admin screen is needed.
- **A privacy page** at games.oddvale.com/privacy saying plainly what is stored where (localStorage on your device; anonymous counts on our server; Cloudflare's standard logs). This is missing today and costs nothing.

How it's built (architecture, adjusted for the privacy call): one Pages Function on the existing `oddvale-games` project at `games.oddvale.com/api/*` (`_routes.json` keeps the static site untouched), one D1 database of counters, the Workers Rate Limiting binding and one WAF rate rule, cached GET responses. **No CSP change** (`connect-src 'self'` already allows it). A small shared client in `kit/` that games call; it fails silently, so the games still work if the API is down or over its free limit. Studio reports read the counters (the analytics analyst role).

Security bar before it ships (from security.md): input validated against fixed choices server-side; responses are aggregates only; per-IP rate limits; graceful failure; HSTS and COOP headers added; a test that stuffing a poll from one IP is capped; an alert (email) when the daily request count spikes.

Effort: about 2-3 agent sessions, plus 1 session to add the result-card widgets to the 7 daily games.
Cost: **$0 a month** on the Workers Free plan up to about 25,000 votes a day; **$5 a month** if we move to Workers Paid (recommended once traffic is real, so a spike doesn't stop the API for the rest of the day). One-off: $0. Owner time: about 1 hour a month (read the monthly report, approve poll questions).
Needs from the owner: approve the backend, approve the privacy-page wording, and approve one added line to the public promise: "Polls and scores are counted anonymously."

### Phase 1: keep players coming back, still no accounts (January to February 2027)
- **Streak freeze** in every daily game (local; one earned per 5 solves, at most 2 stored).
- **Transfer code**: "Move my progress" exports all Oddvale Games progress as a code or file you import on another device. Solves the "new phone" problem that is the main reason people want accounts, with no account.
- Local achievements across the arcade; monthly owner polls.
Cost: $0. Effort: 2-3 agent sessions.

### Phase 2: the Odd Account (decision point about March 2027, not before)
Build only if **at least two** of these are true:
1. Real numbers show about 1,000+ daily players on the arcade (needs the analytics token fixed).
2. Players repeatedly ask for sync, or the transfer code is used heavily.
3. A second Oddvale app needs sign-in (Pullbox already has accounts; Odd House has viewer votes waiting behind a privacy review).
4. A legal plan for children is in place (accounts 13+ only, with a lawyer's review).

What it would be:
- **Provider:** a hosted OIDC identity provider. Leading option **WorkOS AuthKit** (free to 1M monthly users; about $99/month to run it on our own `account.oddvale.com` domain, verify), runner-up **Auth0** or **Clerk** (Clerk free to 50k retained users, about $1,025/month at 100k). Self-hosted Better Auth on Workers + D1 only as a fallback. Supabase (flat $25-35/month) is a cost-steady alternative. Must allow exporting our users.
- **Sign-in:** passkeys plus email one-time codes; no passwords if possible, no SMS ever.
- **Sessions:** each app does its own OIDC login and keeps its own host-only `__Host-` cookie or token. Games use a small `/api/auth/*` layer so tokens never reach page JavaScript.
- **Data:** the account holds the least possible (an ID, an email or passkey, an "adult" flag, not a birth date). Each app keeps its own data; combining data across apps needs its own reason and notice. Deleting an account deletes it everywhere.
- **Per app:** Pullbox adds Oddvale as one more external login next to Google, reusing its account-linking code (1-2 sessions); games get optional progress sync (localStorage stays the source of truth); Odd House checks tokens for viewer votes (1 session); Ghostframe signs in through the system browser with a loopback redirect (2 sessions, low priority).
- **Promise change:** "No cookies unless you choose to sign in." All play keeps working signed out.

Effort: about 8-11 agent sessions across all apps.
Cost per month (estimates; see cost-ops.md): about $0-35 at 1k-10k users; $35-100 at 100k with WorkOS or Supabase (Clerk about $1,025). One-off: lawyer review about **$1,000-2,500** for 13+ accounts (about $3,000-5,000+ if under-13s were allowed, which we propose not to do); optional scoped security review or penetration test **$5,000-15,000** (strongly advised if any part is self-built; optional with a hosted provider). Owner time: about 2-4 hours a month at 1k-10k users, 5-10 at 100k (lockout support, deletion approvals, incident decisions).

## Cost summary
| Phase | What | One-off | Monthly at 1k / 10k / 100k players | Owner hours a month |
|---|---|---|---|---|
| 0 | Polls, daily stats, thumbs, privacy page | $0 | $0 / $0 / $5 | ~1 |
| 1 | Streak freeze, transfer code, achievements | $0 | $0 / $0 / $0 extra | ~0.5 |
| 2 | Odd Account (hosted) | $1,000-2,500 legal (+$5,000-15,000 optional security review) | ~$0 / ~$0-35 / ~$35-100 (WorkOS custom domain ~$99) | 2-4, rising to 5-10 |

## Things to do now regardless (no cost)
- Add the privacy page (Phase 0, first item).
- Give the Cloudflare API token "Zone > Analytics > Read" so we get real player numbers: every later decision depends on them.
- Put passkey or hardware-key MFA on the owner's Cloudflare, GitHub, Fly, Azure and domain accounts (security.md). This protects every Oddvale app today.

## Open questions for the owner
1. Approve Phase 0 (backend on games.oddvale.com, $0-5/month) and the one-line promise addition?
2. Is a little vote inaccuracy acceptable in exchange for storing nothing about voters?
3. Is the Odd Account a "build when the triggers hit" idea, or do you want it sooner for a reason we don't know (for example Pullbox growth)?
4. Accounts 13+ only?
5. Which country is Oddvale run from, and is it a company or a sole trader? (Changes the legal picture.)
6. Does Pullbox have a privacy policy and deletion process today? (Architecture found export and deletion in its code.)

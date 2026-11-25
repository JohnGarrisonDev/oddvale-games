# Plan: player input, security and the Odd Account

**Status: final, waiting for the owner's decisions** (see the end). Nothing here gets built before the owner says go.
**Date:** 2026-11-25 · **Chair:** the Director · **Prices** were checked by the roles on 2026-11-25; figures marked "verify" come from third-party pages.

## Minutes
- **Meeting 1** (five independent positions): [product](product.md), [architecture](architecture.md), [security](security.md), [privacy and legal](privacy-legal.md), [cost and operations](cost-ops.md). All five, separately, recommended anonymous polls now and no Odd Account yet. One disagreement: how to stop repeat votes (security: store hashed IPs and require a bot check; privacy: store nothing about voters).
- **Director's draft:** [plan-draft.md](plan-draft.md) sided with privacy.
- **Meeting 2** (two reviewers): [red team](review-red-team.md) and [player and owner advocate](review-advocate.md). The red team found that the draft's anti-abuse design wouldn't work as written and that two privacy claims overreached. The advocate found the draft too passive with players and too quick to park the Odd Account. This plan adopts their fixes, listed under "What changed after review".

## The answers in one screen
| Question | Answer |
|---|---|
| User polls? | **Yes, now.** One tap after each daily ("How was today's puzzle?"), plus owner polls on the home page. Fixed choices, anonymous. |
| User ratings? | **Yes, privately at first.** Thumbs up/down per game, read by the studio. Decide on public scores after a month of data. |
| Comments or free text? | **No.** Free text brings moderation and legal duties and invites children to post personal details. Use fixed-choice feedback taps instead. |
| Security? | Low-stakes anonymous counters with layered limits and a kill switch now. For accounts: a hosted identity provider, passkeys and email codes, no SMS, a separate session per app, never one cookie shared across all of oddvale.com. |
| Odd Account? | **Yes as a direction, not yet as a product for the arcade.** Lay the foundations now at no cost, pilot it in Pullbox (which already has accounts and adult users) when you say go, and bring it to the games when demand shows. |
| Cost? | **Phase 0 + 1: about $60 a year.** Pullbox pilot: $0. Full Odd Account: $0-420 a year at small scale (or about $1,190 a year if run on our own `account.oddvale.com` domain), plus **$1,000-2,500 once** for a lawyer review. |

## Phase 0: hear from players (December 2026)
What players get:
1. **"How was today's puzzle?"** on every daily's result card: Breeze / Fair / Tricky / Brutal, then "Most players found it Tricky."
2. **"You beat 62% of today's players"** on the result card, shown only once a puzzle has 30+ submissions.
3. **"Tell us" panel** in every game, no GitHub account needed, fixed choices only: Something broke / Too hard / Too easy / Broke on my phone / Want more like this / I want my progress on all my devices. (The GitHub issue form stays for people who want to write.)
4. **Thumbs up/down** per game, private to the studio.
5. **Owner polls** on the home page, e.g. a monthly "Which game next?", with the winner labelled "Chosen by players".
6. **"Today's puzzles" row** on the home page: ticks for each daily you've done today (read from your own browser; nothing sent) plus the community difficulty badge.
7. **What's new page and RSS feed** built from each game's changelog, with a "You told us" section that credits players as a group ("61% said Tuesday's Lookout was Brutal, so we eased Tuesdays").
8. **A privacy page** (missing today) saying plainly what is stored where. It includes one paragraph explaining that our host briefly reads your IP address to block abuse and that we never store it.

How it is built:
- **Where:** a small standalone Cloudflare Worker on the route `games.oddvale.com/api/*`. This changed after review: Pages Functions may not support the rate-limiting binding. It stays same-origin, so the strict security policy doesn't change. The first build session confirms the binding works before anything else.
- **Storage:** one D1 database of anonymous counts in hourly buckets, so a spam spike can be found and deleted. Raw counts are deleted after 90 days and daily totals kept. Nothing about the voter is stored. The browser remembers it voted.
- **Abuse controls (layered):**
  - rate limiting by IP, with IPv6 grouped by /64, counted in Cloudflare's memory and never written down;
  - one WAF rule whose action is Block (Challenge would set a cookie);
  - a same-site Origin check;
  - scores clamped to each game's possible range;
  - dates accepted only within a day of today, using each game's own daily key;
  - an allow-list of poll and game IDs;
  - a 30-submission floor before percentiles show;
  - a kill switch that turns the widgets off without a redeploy.
- **Graceful failure:** the shared client in `kit/` has a short timeout and fails silently, so games work exactly as now if the API is down.
- **Poll questions** live as JSON in the hub repo. A question goes live only when the owner approves it (a commit the owner merges or OKs).
- **Accessible widgets:** real buttons, keyboard and screen-reader friendly, never colour alone.
- **Plan:** Workers Paid ($5/month) from launch with a spend alert. The free plan's 100k requests a day is shared by every Worker on the Cloudflare account, so a flood on polls could stop other Oddvale services until midnight UTC.

Security bar before it ships: all of the above, plus HSTS and COOP headers, plus an automated check that no page sets a cookie (no `Set-Cookie`, empty `document.cookie`). Also a standing rule that **no Cloudflare feature that sets cookies** (Bot Fight Mode, challenges, Turnstile, unique-visitor rate limiting) is switched on without the owner's approval. An email alert fires when request counts spike.
Promise wording: add one line, "Polls and scores are counted anonymously. We store nothing about you." "No cookies, no trackers" stays true.
Effort: about 4-6 agent sessions (API 2-3, widgets in 7 daily games 1-2, hub row, What's new and privacy page 1).

## Phase 1: keep streaks alive and lay the Odd Account foundations (January to February 2027)
- **Streak freeze** in every daily game (local; earn one per 5 solves, hold at most 2). Do this first: holidays break streaks.
- **Transfer code** ("Move my progress"): exports all your Oddvale Games progress to import on another device. **It is designed as the future sync format**: a versioned envelope with one section per app and game, and the same merge rules sync will use. That way, when accounts arrive, nobody loses a streak in the migration.
- **Local achievements** across the arcade, and a local "Daily Trio" meta-streak.
- **Odd Account foundations (no code, $0):**
  - **Account principles** for the owner to approve:
    - optional;
    - 13+ only;
    - the least data possible (an ID, an email or passkey, an "adult" flag);
    - each app keeps its own data;
    - one delete removes it everywhere;
    - exportable;
    - no shared cookie;
    - all play works signed out.
  - **Provider criteria and shortlist** (WorkOS AuthKit, Auth0, Clerk, Supabase; self-hosted Better Auth as fallback), each scored on: export of users including passkeys, custom-domain cost, data location and transfer terms, OIDC for web/desktop/mobile, price at 100k.
  - **Reserve `account.oddvale.com`** in the studio's DNS notes (no public page).
- **Pullbox pilot: "Continue with Oddvale", whenever the owner says go.** Pullbox already has real accounts, export, deletion and adult users. The architect estimates 1-2 sessions to add Oddvale as an external login beside Google.
  - Caution from the red team: on a provider's default domain, passkeys may be tied to the provider and lost if we ever move. **Pilot with email codes and Google only, no passkeys**, until we either pay for our own domain or confirm with the provider that passkeys can move.
  - Pullbox's existing `Path=/api/auth` cookie can't use the `__Host-` prefix; keep its current, well-built cookie setup.

Effort: about 3-4 agent sessions plus the pilot's 1-2. Cost: $0.

## Phase 2: the Odd Account across the arcade and other apps
**Gates (all must be true):** analytics working; account principles approved; legal scope agreed with a lawyer (13+ only).
**Signal (any one):**
- 500+ daily-puzzle result submissions a day, averaged over 14 days (counted by Phase 0, so no tracking is needed);
- 25+ "I want my progress on all my devices" taps in a month;
- the Pullbox pilot shows people use it;
- **you decide the brand needs it.**

What it is: a hosted OIDC identity provider at (ideally) `account.oddvale.com`, passkeys plus email codes, no passwords if possible, no SMS ever. Each app does its own sign-in and keeps its own session. Games get optional progress sync with the browser as the source of truth. Odd House can use it for viewer votes; Ghostframe signs in through the system browser. Promise changes to "No cookies unless you choose to sign in."
Effort: about 8-11 agent sessions across all apps.

## Cost estimate
| Item | One-off | Per year | Notes |
|---|---|---|---|
| Phase 0 (polls, stats, feedback taps, privacy page, What's new) | $0 | **$60** (Workers Paid $5/month) | Free plan possible but risky (shared quota). |
| Phase 1 (streak freeze, transfer code, foundations) | $0 | $0 | |
| Pullbox pilot | $0 | $0 | WorkOS free tier on its default domain (verify). |
| Odd Account, provider | $0 | **$0 up to about 10k users** (WorkOS free to 1M users; Clerk free to 50k retained users, verify); Supabase about $300-420 | **+$1,188/year** if WorkOS runs on our own domain (about $99/month, verify). At 100k users: WorkOS $0 (+domain), Supabase ~$420, Clerk ~$12,300. |
| Lawyer review (privacy policy, terms, 13+ accounts across apps) | **$1,000-2,500** | — | Depends on Oddvale's country and company type. $3,000-5,000+ if under-13s were allowed; we propose not. Simple policy and terms alone: about $500-1,500. |
| Security review or penetration test | $5,000-15,000 | — | Optional with a hosted provider; needed if anything auth-related is self-built. |
| Owner time | — | ~1 h/month (Phases 0-1); 2-4 h/month with accounts at 1k-10k users, 5-10 h at 100k | Agents can do the rest. Only you can approve legal and public changes, spend money, decide on a breach, verify a disputed account owner and approve deletions. |

**Bottom line:** everything up to and including a Pullbox pilot costs about **$60 a year**. The full Odd Account adds about **$1,000-2,500 once** for legal, plus $0-1,200 a year depending on scale and whether it runs on our own domain.

## Do now, regardless (free)
1. Add the privacy page (first item of Phase 0; can ship before the API).
2. Give the Cloudflare API token "Zone > Analytics > Read" so we see real player numbers.
3. Put passkey or hardware-key two-factor on your Cloudflare, GitHub, Fly, Azure and domain-registrar accounts. One phished login there would expose every Oddvale app today.

## What changed after review
- Moved the API from a Pages Function to a standalone Worker on the same route (red team: the rate-limit binding may not work in Pages Functions).
- Replaced "one vote per person" claims with layered limits, hourly buckets for clean-up, score clamping, date windows, an Origin check, a kill switch and a 30-submission floor (red team).
- Corrected the privacy claims: reading an IP is processing, so the privacy page explains it; added the no-cookie rule and check (red team).
- Workers Paid from launch, because the free quota is shared across the whole account (red team).
- Added the no-GitHub feedback taps, the "Today's puzzles" row, the What's new page and "Chosen by players" polls (advocate).
- Turned the parked Odd Account into foundations now plus a Pullbox pilot, with the transfer code designed as the sync format (advocate).
- Rewrote the Phase 2 triggers: gates we control plus measurable signals, including "the owner decides" (advocate and red team).
- Added a per-year cost box (advocate).

## Decisions for the owner
1. **Approve Phase 0?** (A Worker on games.oddvale.com, $5/month, plus the one-line promise addition.)
2. **Approve the Odd Account principles direction and a Pullbox pilot?** Now, or after Phase 0?
3. **Accounts 13+ only?** (Recommended.)
4. **Which country is Oddvale run from, and is it a company or a sole trader?** (Sets the lawyer cost.)
5. **Will you add passkey or hardware-key two-factor to your admin accounts this month, and fix the analytics token?**

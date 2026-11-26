# Studio log

One entry per studio session, newest first. Keep each to a few lines: what was decided, what shipped, what is blocked, what the next session should do first.

## 2026-11-26 · Session 5: improvement rounds, marketing and SEO research
- Cleanup: stopped a leftover local `wrangler dev` from Nov 25 and old browser tabs. Rule for builders and QA now: stop servers, close tabs, reset the viewport when done.
- Research: [marketing and sign-in](reports/2026-11-26-research-marketing-and-sso.md) (the owner then said they meant SEO, not SSO; the sign-in part is kept for the Odd Account decision) and [SEO](reports/2026-11-26-research-seo.md). Headlines: make every share a link; one honest Show HN; a few subreddit posts after the owner reads their rules; short clips of the physics games; daily-game directories. Accounts wait for plan.md's signal gate.
- SEO shipped in the hub build (game repos untouched): descriptive titles and descriptions from `games.json` `seoTitle`/`seoDescription`, a 1200x630 `og.jpg` per game cut from the cover, full OG/Twitter tags, per-game JSON-LD (VideoGame + WebApplication, breadcrumbs, no ratings), a "Try next" card with three related games, real `lastmod` dates. New hub title.
- Round 1 (3 builders) then round 2 (3 fresh QA agents, all PASS, no blockers; fixes sent back to the builders). Shipped overprint/lookout/rungs/soupspell/rickety/blinkwire 1.3.0 and star-post/odd-one-out/wonky-putt 1.4.0; details in games.md. 357 tests pass. Every daily up to 2026-11-27 unchanged (pinned by tests); Rickety, Rungs, Overprint and Wonky Putt change some unpublished dailies from 2026-11-28.
- Every daily game's Copy result now ends with the full `https://games.oddvale.com/<slug>/` link and shows the text in a box when the clipboard is refused.
- Kit: `[hidden] { display: none !important; }` (an empty Tell us card showed when the API was unreachable). `npm run check` now fails when a game's footer version differs from game.json (all nine footers were one version behind).
- Deployed (Pages 286ad33d) and checked live: titles, versions, JSON-LD, Try next, og.jpg on all 9; no console errors except Cloudflare's auto-injected Web Analytics beacon, which the CSP blocks (owner can switch off auto-injection).
- Owner to do: verify oddvale.com in Google Search Console (DNS TXT in Cloudflare), import to Bing Webmaster Tools, submit the sitemap. Rickety's daily table must be extended before 2027-12-31.
- Next session first: Search Console status; first votes and Tell us taps; a person to play the physics games (music, ghost, hole 8) on a phone.

## 2026-11-26 · Session 4: mobile pass
- Owner asked for better mobile controls and UI in every game, with full screen. Kit: full screen on every phone (iPhone "focus" fallback that pins the stage, exit button, back-button exit, 1s fallback if native stalls), "Play full screen" button on touch screens, notch-safe canvas, `stage-inset`, `--stage-exit-space` / `--stage-exit-top/right`, 44px touch targets (vote buttons too), compact title on phones, `haptic()`. The hub manifest is now standalone (Add to Home Screen opens the arcade without browser bars). GAME_GUIDE gained "Phones first".
- 3 builders did all 9 games: on-screen controls for every action, bigger hit areas, finger-clear previews (Soupspell letter bubble, Blinkwire press ring, Lookout paint ring), easy cancel for drags and shots, landscape layouts, result cards that fit 360x640, haptics. Versions: overprint/lookout/rungs/soupspell/rickety/blinkwire 1.2.0, star-post/odd-one-out/wonky-putt 1.3.0. 327 tests pass. Deployed and checked live.
- Not checked: real iPhone Safari, real notch, real multi-touch, vibration, true native full screen (the test browser never settles it).
- Next session first: try it on a real iPhone and Android phone (owner), and watch Tell us "Broke on my phone" taps.

## 2026-11-25 · Session 3: Phase 0 build
- Owner approved Phase 0. Built: the API Worker (`api/`, 12 tests on real SQLite, also run on local workerd), `kit/talk.js` widgets, a Today's puzzles row and poll slot on the hub, /privacy/, /whats-new/ and /feed.xml, HSTS and COOP headers, a no-cookie check, and the promise line. All 9 games carry the widgets (8 daily vote + "you beat N%" cards, Tell us card everywhere, Privacy link); 3 builders, each tested in a browser against a local API.
- **API live the same day.** The owner made a new token, `oddvale-games-deploy` (Pages, Workers Scripts, D1, Workers Routes, Zone WAF, Analytics Read), stored in the hub's git-ignored `.env`, which wins over the old Windows env var. Created D1 `oddvale-games-api` (WNAM), ran the schema, deployed the Worker (version 69f81399). Checked live: status, daily, today and polls answer 200 with no Set-Cookie and no CORS; writes from another origin, with no origin, an unknown game or an old date are refused; the Tell us card shows in Lookout; the poll stays hidden (not approved). No real votes were sent.
- `npm run analytics` works now (it also reads `.env` first). First numbers, 2026-11-24 only: home 88 views, odd-one-out 16, blinkwire 15, wonky-putt 14, the six newer games 0. Much of that is likely our own testing.
- Still with the owner: Workers Paid ($5/month) and a usage alert, the WAF rule (Block, never Challenge), the first poll's wording, optionally switching off Web Analytics auto-injection.
- Owner approved the first poll ("Which game should the robots build next?") as worded; deployed, it opens 2026-12-01 and closes 2026-12-31.
- Next session first: look at the first real votes and Tell us taps (D1 `GROUP BY game`); on or after Dec 1, check the poll shows on the home page.

## 2026-11-25 · Session 2: player input and the Odd Account
- Held two meetings on the owner's questions (polls, ratings, security, the Odd Account, cost). Meeting 1: product, architecture, security, privacy/legal and cost/ops positions. Meeting 2: red-team and player/owner-advocate reviews of the draft. Final plan: [plan.md](meetings/2026-11-25-player-input-and-odd-account/plan.md).
- Outcome: anonymous polls, daily difficulty votes, "you beat X%" stats, fixed-choice feedback taps and a privacy page in Phase 0 (about $60/year); streak freeze, transfer code and Odd Account foundations plus an optional Pullbox pilot in Phase 1 ($0); the full Odd Account behind gates and signals (about $1,000-2,500 legal once, $0-1,200/year). **Waiting on the owner's five decisions in the plan.**
- Shipped Wonky Putt 1.1.0: Daily Hole (32 tests; a year of dailies checked by solver and a noisy player). The arcade now has 8 daily games.
- Next session first: act on the owner's decisions; ship the privacy page (free, no approval needed beyond wording).

## 2026-11-24 · Session 1
- Measured: nothing to measure yet. Analytics still blocked (token lacks Zone Analytics Read); 0 issues, 0 stars, 0 repo traffic.
- Shipped a feedback route: GitHub issue form + footer Feedback link on the hub and all games; `feedback` label in every repo.
- Research: [daily games report](reports/2026-11-24-research-daily-games.md); three pitches (Overprint, Teeter, Sift). Approved and shipped **Overprint** (24 tests; random tapping lands far above par, so no first-press rule).
- Balance: Star Post 1.1.0 (20 levels retuned, full-delivery windows now fall 45/31/21 by sector, floor 12) and Odd One Out 1.1.0 (Mines/Oil toned down, weak weapons and Lucky Nut buffed, Template scales with the build, themed endless). Bot/solver data only, no human play.
- Not done (usage limit): browser QA by the Director of the three shipped builds (builders tested them); confirming the draft goals with the owner. games.md was brought up to date at the start of session 2.
- Next session first: confirm goals with the owner; update games.md; consider the Wonky Putt daily hole and a streak freeze; Sift only after a phone-speed spike.

## 2026-11-24 · Studio founded
- Shipped the arcade: hub plus Odd One Out, Wonky Putt and Blinkwire, then Lookout, Rungs, Soupspell, Rickety and Star Post. Every card has a 1-5 difficulty rating.
- Set up this `studio/` folder and the team roles; drafted the first goals.
- Added `npm run analytics` (Cloudflare edge page views). Blocked: the API token lacks Zone Analytics Read.
- Lesson: five parallel builders used up the owner's usage limit mid-build. Run three at most.
- Next session first: confirm or replace the draft goals with the owner; run analytics once the token has the permission; decide how players should send feedback.

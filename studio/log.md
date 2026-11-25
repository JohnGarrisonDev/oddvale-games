# Studio log

One entry per studio session, newest first. Keep each to a few lines: what was decided, what shipped, what is blocked, what the next session should do first.

## 2026-11-24 · Session 1
- Measured: nothing to measure yet. Analytics still blocked (token lacks Zone Analytics Read); 0 issues, 0 stars, 0 repo traffic.
- Shipped a feedback route: GitHub issue form + footer Feedback link on the hub and all games; `feedback` label in every repo.
- Research: [daily games report](reports/2026-11-24-research-daily-games.md); three pitches (Overprint, Teeter, Sift). Approved and shipped **Overprint** (24 tests; random tapping lands far above par, so no first-press rule).
- Balance: Star Post 1.1.0 (20 levels retuned, full-delivery windows now fall 45/31/21 by sector, floor 12) and Odd One Out 1.1.0 (Mines/Oil toned down, weak weapons and Lucky Nut buffed, Template scales with the build, themed endless). Bot/solver data only, no human play.
- Not done (usage limit): browser QA by the Director of the three shipped builds (builders tested them); updating games.md for these changes; confirming the draft goals with the owner.
- Next session first: confirm goals with the owner; update games.md; consider the Wonky Putt daily hole and a streak freeze; Sift only after a phone-speed spike.

## 2026-11-24 · Studio founded
- Shipped the arcade: hub plus Odd One Out, Wonky Putt and Blinkwire, then Lookout, Rungs, Soupspell, Rickety and Star Post. Every card has a 1-5 difficulty rating.
- Set up this `studio/` folder and the team roles; drafted the first goals.
- Added `npm run analytics` (Cloudflare edge page views). Blocked: the API token lacks Zone Analytics Read.
- Lesson: five parallel builders used up the owner's usage limit mid-build. Run three at most.
- Next session first: confirm or replace the draft goals with the owner; run analytics once the token has the permission; decide how players should send feedback.

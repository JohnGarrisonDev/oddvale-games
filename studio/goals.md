# Goals

The Director keeps this short: three goals at most, each with a measure and a date. Move finished or dropped goals to "Past goals" with one line on the outcome.

The owner's standing direction (2026-11-24): grow the arcade with puzzle and word games that have daily levels, plus creative physics games, built by an AI team that sets goals, researches the market, designs original games, and learns from feedback and usage.

## Current goals
These are the first draft, set when the studio was created. The first studio session should confirm or replace them.

1. **See how the arcade is used.** Get a weekly page-view report per game working, then record a four-week baseline.
   - Measured by: `npm run analytics` runs and `reports/` has its first analytics report.
   - Blocked on: the Cloudflare API token needs Zone Analytics Read (owner action).
   - Due: 2026-12-08.
2. **Hear from players.** Make giving feedback easy and start a regular feedback report.
   - Measured by: a clear "Feedback" route on the hub and game pages (GitHub issue form shipped 2026-11-24), and a first `reports/*-feedback.md`. Phase 0 of [the player-input plan](meetings/2026-11-25-player-input-and-odd-account/plan.md) approved 2026-11-25 and built (Tell us taps, difficulty votes, polls); the API goes live once the token can deploy Workers and D1.
   - Due: 2026-12-15.
3. **Make the eight launch games feel right to humans.** Every game so far was tuned by tests and bots, not people.
   - Measured by: a human or careful real-time playtest of each game, findings in `games.md`, and fixes shipped for the worst problem in each of Star Post, Rickety and Odd One Out (the three rated Medium or harder that were least hand-played).
   - Due: 2026-12-22.

## Past goals
- **Launch the arcade** (2026-11-24, done): games.oddvale.com live with a hub and eight games, each in its own public repo.

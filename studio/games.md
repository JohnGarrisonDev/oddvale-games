# The games

One section per live game. Update it whenever a game ships a change, a report finds something, or a weak spot is fixed. "Weak spots" come from build and QA reports and must stay honest; delete a line only when it is fixed and verified.

All eight launched on 2026-11-24, built by AI subagents and reviewed in a browser before shipping. None has been played at length by a person yet, and none has had its sound heard or been tried on a real phone.

## Lookout
`lookout` · Logic puzzle · daily · Medium (3) · v1.0.0 · [repo](https://github.com/JohnGarrisonDev/lookout)
- Plant hedges so every robot lookout sees exactly its number. Daily Small 6x6 / Medium 7x7 / Large 9x9, 40-level journey, free play up to Fiendish, 14-day archive. Hints explain the next deduction.
- Weak spots: the "sees now" tag is tiny on 9x9 phone boards; the solved card covers part of the board; Fiendish uses what-if reasoning some players will feel is guessing; difficulty is graded by technique, not playtested.
- Next: playtest the Large daily on a phone; consider a larger corner tag.

## Rungs
`rungs` · Word puzzle · daily · Easy (2) · v1.0.0 · [repo](https://github.com/JohnGarrisonDev/rungs)
- Word ladders, one letter per rung. Daily Short/Tall/Towering, 60-ladder journey, endless. ENABLE word list (public domain) for guesses, curated common words for puzzles.
- Weak spots: some puzzle words are bookish; some routes run through plurals; phone keys are about 29px wide at 360px; past rungs scroll away and can't be scrolled back.
- Next (backlog): 6-letter ladders, "Greased rung" and "Detour" twists.

## Soupspell
`soupspell` · Word physics · daily · Easy (2) · v1.0.0 · [repo](https://github.com/JohnGarrisonDev/soupspell)
- Letters float in soup; stir them together and trace touching letters to spell. Daily Bowl (same 50 letters for everyone), 90-second Rush, Zen.
- Weak spots: Copy result unconfirmed (clipboard refused in automated tests); noodles are about 30px on a 360px phone; ENABLE accepts odd words; stirring feel never tried with a real finger.
- Next: confirm Copy result in a real browser; feel test on a phone.

## Rickety
`rickety` · Physics builder · daily · Medium (3) · v1.0.0 · [repo](https://github.com/JohnGarrisonDev/rickety)
- Build a bridge on a budget, press Go, watch a parcel cart cross or collapse it. 24 levels, daily gap (cheapest working bridge), sandbox.
- Weak spots: only levels 1-2 were built by hand (3-24 run with stored reference designs); some pars are loose; some dailies are steel-heavy; the daily is generated in the browser on first open (can take most of a second); Copy result falls back to showing text; one-finger pan untested.
- Next: human playtest of levels 3-24; tighten loose pars.

## Star Post
`star-post` · Gravity physics · daily · Hard (4) · v1.0.1 · [repo](https://github.com/JohnGarrisonDev/star-post)
- One slingshot launch, then gravity curves the courier through mailbox rings to the dock. 30 levels, daily delivery.
- Weak spots: full-delivery launch windows are tiny on levels 10, 18, 20, 28, 30; difficulty doesn't narrow steadily across sectors; tuned by solver only; Copy result unconfirmed.
- Fixed: 1.0.1 stopped a canvas error when the stage was collapsed.
- Next: widen the tightest windows; human playtest of sector 3.

## Odd One Out
`odd-one-out` · Arcade survival · Hard (4) · v1.0.0 · [repo](https://github.com/JohnGarrisonDev/odd-one-out)
- Survive ten minutes of identical robots. 8 weapons, 10 parts, 3 bosses, workshop meta-upgrades, endless mode.
- Weak spots: never played in real time (bot-tuned: novice bot median 2:53); Bolt Mines is the strongest weapon; endless mode turns unfair rather than interesting; final boss health doesn't scale with the build; no music.
- Next: real-time feel pass; rebalance Bolt Mines; scale the final boss.

## Wonky Putt
`wonky-putt` · Mini golf · Easy (2) · v1.0.0 · [repo](https://github.com/JohnGarrisonDev/wonky-putt)
- 18 holes of top-down mini golf with sand, water, ice, bumpers, windmills, portals and conveyors. Ball skins, medals.
- Weak spots: aces are generous once you know the line; hole 8 is chaotic; back-nine greens are less wonky in shape; the title panel covers the windmill.
- Next: a second course (the hole format is data); a daily hole would fit the arcade's direction.

## Blinkwire
`blinkwire` · Logic puzzle · daily · Easy (2) · v1.0.0 · [repo](https://github.com/JohnGarrisonDev/blinkwire)
- Rotate wire tiles to light every eye. 60-level journey, daily board with streaks, free play up to 12x12.
- Weak spots: some boards (mostly wrap) have more than one solution, so hints steer to the stored one; small stage on landscape phones; plain free-play setup screen.
- Next (backlog): a fog/sleepy-lamp twist.

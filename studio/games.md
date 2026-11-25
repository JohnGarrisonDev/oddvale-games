# The games

One section per live game. Update it whenever a game ships a change, a report finds something, or a weak spot is fixed. "Weak spots" come from build and QA reports and must stay honest; delete a line only when it is fixed and verified.

Since 2026-11-25 every game has the Phase 0 talk widgets (Tell us card, Privacy link; daily games also a difficulty vote and "you beat N%" on the result card). They stay hidden until the API is deployed. Common weak spot: on phones the vote often sits below the fold of the result card.

All nine launched on 2026-11-24, built by AI subagents and reviewed in a browser before shipping. None has been played at length by a person yet, and none has had its sound heard or been tried on a real phone.

## Overprint
`overprint` · Word puzzle · daily · Easy (2) · v1.1.0 · [repo](https://github.com/JohnGarrisonDev/overprint)
- Turn and restack punched printer-robot cards until every row is a word. Daily Small 4x4 + Large 5x5 (5 cards on Sundays), par rising through the week, 60-sheet journey, free play, 14-day archive, Gazette ending. A brute-force solver proves each daily has exactly one answer.
- Data: random tapping needs about 57x par on Small (median 294 moves vs par 5), so no "first press counts" rule. Sunday solve takes under 60 ms.
- Weak spots: tray mini-cards are tiny on phones with 5 cards; stamps fire on obscure ENABLE words (e.g. MERK); some curated words are bookish or British; no 7-day human playtest yet.
- Next: human playtest of a week of dailies.

## Lookout
`lookout` · Logic puzzle · daily · Medium (3) · v1.1.0 · [repo](https://github.com/JohnGarrisonDev/lookout)
- Plant hedges so every robot lookout sees exactly its number. Daily Small 6x6 / Medium 7x7 / Large 9x9, 40-level journey, free play up to Fiendish, 14-day archive. Hints explain the next deduction.
- Talk score is solve time, which ignores hints and Check. 1.1.0 capped the solved card at 66% of the stage on phones.
- Weak spots: the "sees now" tag is tiny on 9x9 phone boards; the solved card covers part of the board; Fiendish uses what-if reasoning some players will feel is guessing; difficulty is graded by technique, not playtested.
- Next: playtest the Large daily on a phone; consider a larger corner tag.

## Rungs
`rungs` · Word puzzle · daily · Easy (2) · v1.1.0 · [repo](https://github.com/JohnGarrisonDev/rungs)
- Word ladders, one letter per rung. Daily Short/Tall/Towering, 60-ladder journey, endless. ENABLE word list (public domain) for guesses, curated common words for puzzles.
- Weak spots: some puzzle words are bookish; some routes run through plurals; phone keys are about 29px wide at 360px; past rungs scroll away and can't be scrolled back.
- Next (backlog): 6-letter ladders, "Greased rung" and "Detour" twists.

## Soupspell
`soupspell` · Word physics · daily · Easy (2) · v1.1.0 · [repo](https://github.com/JohnGarrisonDev/soupspell)
- Letters float in soup; stir them together and trace touching letters to spell. Daily Bowl (same 50 letters for everyone), 90-second Rush, Zen.
- Weak spots: Copy result unconfirmed (clipboard refused in automated tests); noodles are about 30px on a 360px phone; ENABLE accepts odd words; stirring feel never tried with a real finger.
- Next: confirm Copy result in a real browser; feel test on a phone.

## Rickety
`rickety` · Physics builder · daily · Medium (3) · v1.1.0 · [repo](https://github.com/JohnGarrisonDev/rickety)
- Build a bridge on a budget, press Go, watch a parcel cart cross or collapse it. 24 levels, daily gap (cheapest working bridge), sandbox.
- Talk score is the first crossing's cost only, and ignores parcels lost.
- Weak spots: only levels 1-2 were built by hand (3-24 run with stored reference designs); some pars are loose; some dailies are steel-heavy; the daily is generated in the browser on first open (can take most of a second); Copy result falls back to showing text; one-finger pan untested.
- Next: human playtest of levels 3-24; tighten loose pars.

## Star Post
`star-post` · Gravity physics · daily · Hard (4) · v1.2.0 · [repo](https://github.com/JohnGarrisonDev/star-post)
- One slingshot launch, then gravity curves the courier through mailbox rings to the dock. 30 levels, daily delivery.
- Fixed: 1.0.1 stopped a canvas error when the stage was collapsed. 1.1.0 retuned 20 levels: full-delivery windows now fall steadily by sector (medians 45 / 31 / 21, was 26 / 29 / 17), floors 24 / 14 / 12, dock windows at least 60. Rebound, Bank Shot and Push and Pull now need their headline bodies. Daily unchanged; best times on retuned levels reset, stars kept.
- Weak spots: Bulk Mail (14), Night Shift, The Long Way Round and Last Post (14-16) sit near the floor; Last Post's best line has a local window of only 2.7; some pars moved a lot (Threading 4.5 to 3, Push and Pull 4 to 6); tuned by solver only; Copy result unconfirmed; phone width not rechecked after 1.1.0.
- Next: human playtest of sector 3.

## Odd One Out
`odd-one-out` · Arcade survival · Hard (4) · v1.2.0 · [repo](https://github.com/JohnGarrisonDev/odd-one-out)
- Survive ten minutes of identical robots. 8 weapons, 10 parts, 3 bosses, workshop meta-upgrades, endless mode.
- 1.1.0 (bot data, 96 runs per setup): Bolt Mines and Hot Oil toned down (damage share when held 42-43% to 29-30%, Oil 40-43% to 28-33%), Gears/Pulse/Wrench buffed from level 3, Lucky Nut buffed. The Template scales its HP to the player's damage rate (0.4-1.6x), so the fight-length spread narrowed (p75/p25 from about 3.5 to about 2.2). Endless now has themed waves, elite packs and returning bosses. Novice median unchanged (2:53 to 2:50); full-workshop good bot beats the Template 72/96 (was 56). Saves untouched.
- Weak spots: never played in real time; Template fights still range about 30-120 s (the bot runs from bosses); Oil and Mines still lead by a few points, Wrench weakest with a full workshop; Lucky Nut buff not re-measured; phone width not rechecked after 1.1.0; no music.
- Next: real-time feel pass by a person.

## Wonky Putt
`wonky-putt` · Mini golf · daily · Easy (2) · v1.2.0 · [repo](https://github.com/JohnGarrisonDev/wonky-putt)
- 18 holes of top-down mini golf with sand, water, ice, bumpers, windmills, portals and conveyors. Ball skins, medals.
- 1.1.0 Daily Hole: a generated hole a day (pre-generated table through 2027-12-31, 402 days; tests warn 60 days before it runs out), one official try then practice, streaks, Copy result. Every daily passes the solver plus a noisy-player check; par = max(solver+1, noisy mean+0.5), 2-5, rising through the week. Weak spots: U-turn and two-room layouts dominate; names repeat sometimes; a bunker can overlap a room divider; only ~9 dailies looked at by eye.
- Weak spots: aces are generous once you know the line; hole 8 is chaotic; back-nine greens are less wonky in shape; the title panel covers the windmill.
- Next: a second course (the hole format is data); extend the daily table before 2027-11.

## Blinkwire
`blinkwire` · Logic puzzle · daily · Easy (2) · v1.1.0 · [repo](https://github.com/JohnGarrisonDev/blinkwire)
- Rotate wire tiles to light every eye. 60-level journey, daily board with streaks, free play up to 12x12.
- Weak spots: some boards (mostly wrap) have more than one solution, so hints steer to the stored one; small stage on landscape phones; plain free-play setup screen.
- Next (backlog): a fog/sleepy-lamp twist.

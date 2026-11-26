# The games

One section per live game. Update it whenever a game ships a change, a report finds something, or a weak spot is fixed. "Weak spots" come from build and QA reports and must stay honest; delete a line only when it is fixed and verified.

Since 2026-11-25 every game has the Phase 0 talk widgets (Tell us card, Privacy link; daily games also a difficulty vote and "you beat N%" on the result card). The API has been live since 2026-11-25. Since 2026-11-26 every daily game's Copy result ends with the full `https://games.oddvale.com/<slug>/` link and shows the text in a box when the clipboard is refused, and the hub build adds descriptive titles, a 1200x630 share image, JSON-LD and a "Try next" card to every game page (see `games.json` `seoTitle`/`seoDescription`).

All nine launched on 2026-11-24, built by AI subagents and reviewed in a browser before shipping. None has been played at length by a person yet, and none has had its sound heard or been tried on a real phone.

## Overprint
`overprint` · Word puzzle · daily · Easy (2) · v1.3.0 · [repo](https://github.com/JohnGarrisonDev/overprint)
- Turn and restack punched printer-robot cards until every row is a word. Daily Small 4x4 + Large 5x5 (5 cards on Sundays), par rising through the week, 60-sheet journey, free play, 14-day archive, Gazette ending. A brute-force solver proves each daily has exactly one answer.
- Data: random tapping needs about 57x par on Small (median 294 moves vs par 5), so no "first press counts" rule. Sunday solve takes under 60 ms.
- 1.3.0: countdown to the next pair; the picked tray card opens wider on portrait phones (mini letters 4.6 to 7.7px at 360x640); stamps only for curated everyday words; 50 bookish/British words retired as answers from 2026-11-28 and in new free play (free-play saves carry `w`); copy fallback box; share ends with the full URL.
- Weak spots: five-card tray in phone landscape still ~4.7px letters; the 3-letter list and Journey keep bookish words; QA saw 5 fast taps make 4 moves once (not reproduced); no 7-day human playtest yet.
- Next: human playtest of a week of dailies.

## Lookout
`lookout` · Logic puzzle · daily · Medium (3) · v1.3.0 · [repo](https://github.com/JohnGarrisonDev/lookout)
- Plant hedges so every robot lookout sees exactly its number. Daily Small 6x6 / Medium 7x7 / Large 9x9, 40-level journey, free play up to Fiendish, 14-day archive. Hints explain the next deduction.
- Talk score is solve time, which ignores hints and Check. 1.1.0 capped the solved card at 66% of the stage on phones.
- 1.3.0: bigger "sees now" tag (12px+ digits); eye button to peek at the solved field; best times on Journey buttons; one rounding rule for times (floor); copy fallback box; share ends with the full URL.
- Weak spots: two-digit tags still tight on 34px tiles; Fiendish uses what-if reasoning some players will feel is guessing; difficulty is graded by technique, not playtested.
- Next: playtest the Large daily on a phone.

## Rungs
`rungs` · Word puzzle · daily · Easy (2) · v1.3.0 · [repo](https://github.com/JohnGarrisonDev/rungs)
- Word ladders, one letter per rung. Daily Short/Tall/Towering, 60-ladder journey, endless. ENABLE word list (public domain) for guesses, curated common words for puzzles.
- 1.3.0: drag/wheel back down the ladder with a Start/Back up chip; tap an old rung twice to climb back to it; version 2 words from 2026-11-28 and new endless (52 bookish words out, routes avoid plurals: 13 in 333 to 8 in a year); key row fits 360px; 44px buttons sideways; copy fallback; full share URL.
- Weak spots: keys are 28px wide at 360px in the page (10 in a row can't reach 44px; invisible margins widen the target); Journey and 3-letter ladders keep bookish words; scrolling not tried with a real finger.
- Next (backlog): 6-letter ladders need a 6-letter word list (the repo's ENABLE stops at 5; a download needs the owner's OK); "Greased rung" and "Detour" twists.

## Soupspell
`soupspell` · Word physics · daily · Easy (2) · v1.3.0 · [repo](https://github.com/JohnGarrisonDev/soupspell)
- Letters float in soup; stir them together and trace touching letters to spell. Daily Bowl (same 50 letters for everyone), 90-second Rush, Zen.
- 1.3.0: result card names the best word left in the bowl (everyday words preferred); hints prefer everyday words; copy fallback box; full share URL; noodles a little bigger; fixed-height word box; two-column result card sideways; 44px pause.
- Weak spots: real clipboard success unconfirmed; noodles still 29px in the page on a 360px phone (full screen is the fix); ENABLE accepts odd words; the leftovers word isn't saved; stirring feel never tried with a real finger.
- Next: feel test on a phone.

## Rickety
`rickety` · Physics builder · daily · Medium (3) · v1.3.0 · [repo](https://github.com/JohnGarrisonDev/rickety)
- Build a bridge on a budget, press Go, watch a parcel cart cross or collapse it. 24 levels, daily gap (cheapest working bridge), sandbox.
- Talk score is the first crossing's cost only, and ignores parcels lost.
- 1.3.0: daily from a pre-built table (`src/daily-table.js`, 2026-11-19 to 2027-12-31, identical to the generator; opens in ~5-20 ms); generator v2 from 2026-11-28 skips Cart-only canyons over 40% steel; nine pars tightened by up to 25% with `tools/tighten.mjs` (stars kept); 7-day archive with a half-built bridge per day; iPhone full-screen Escape fix; full share URL.
- **Extend the daily table before 2027-12-31** (`node tools/daily-table.mjs`), and re-run it after any generator change.
- Weak spots: levels 3-24 and the new pars not played by a person; title panel scrolls inside the small in-page stage at 844x390 (fits in full screen); day buttons ~40px wide at 360px; one-finger pan untested.
- Next: human playtest of levels 3-24.

## Star Post
`star-post` · Gravity physics · daily · Hard (4) · v1.4.0 · [repo](https://github.com/JohnGarrisonDev/star-post)
- 1.4.0: best-run ghost per campaign level (yellow dotted trail plus a chase capsule; replays saved launch and puffs exactly); Bulk Mail / Night Shift / The Long Way Round / Last Post re-laid (full windows 14→16, 14→14, 14→22, 16→16; Last Post local window 2.7→3.8; sector medians 45/31/22; best times on those four reset, stars kept); copy fallback box; full share URL. Still near the floor: Bulk Mail, Night Shift, Last Post (they hinge on a wormhole mouth or a moon bounce). Ghost colour not colour-blind checked.
- One slingshot launch, then gravity curves the courier through mailbox rings to the dock. 30 levels, daily delivery.
- Fixed: 1.0.1 stopped a canvas error when the stage was collapsed. 1.1.0 retuned 20 levels: full-delivery windows now fall steadily by sector (medians 45 / 31 / 21, was 26 / 29 / 17), floors 24 / 14 / 12, dock windows at least 60. Rebound, Bank Shot and Push and Pull now need their headline bodies. Daily unchanged; best times on retuned levels reset, stars kept.
- Weak spots: Bulk Mail, Night Shift and Last Post still sit near the floor (see 1.4.0); some pars moved a lot (Threading 4.5 to 3, Push and Pull 4 to 6); tuned by solver only.
- Next: human playtest of sector 3.

## Odd One Out
`odd-one-out` · Arcade survival · Hard (4) · v1.4.0 · [repo](https://github.com/JohnGarrisonDev/odd-one-out)
- 1.4.0: synth music loop (`src/music.js`) that layers with crowd size and darkens for bosses, with a Music switch in pause (nobody has listened to it yet). Balance (96 bot runs per setup): Wrench L3-5 up, Oil ticks slower at L4-5, Mines down; damage share no-workshop/full-workshop Wrench 23/16→26/20, Oil 33/28→30/26, Mines 30/30→26/28; good bot without workshop beats the Template 22→30 of 96; novice median 2:51→2:53. Lucky Nut re-measured: no longer an outlier. Now weakest: Orbit Gears with a full workshop (18%); Springy Treads and Dented Armour the weakest parts.
- Survive ten minutes of identical robots. 8 weapons, 10 parts, 3 bosses, workshop meta-upgrades, endless mode.
- 1.1.0 (bot data, 96 runs per setup): Bolt Mines and Hot Oil toned down (damage share when held 42-43% to 29-30%, Oil 40-43% to 28-33%), Gears/Pulse/Wrench buffed from level 3, Lucky Nut buffed. The Template scales its HP to the player's damage rate (0.4-1.6x), so the fight-length spread narrowed (p75/p25 from about 3.5 to about 2.2). Endless now has themed waves, elite packs and returning bosses. Novice median unchanged (2:53 to 2:50); full-workshop good bot beats the Template 72/96 (was 56). Saves untouched.
- Weak spots: never played in real time; Template fights still range about 30-120 s (the bot runs from bosses); Hot Oil still top without the workshop, Orbit Gears weakest with it; music not yet heard by a person.
- Next: real-time feel pass by a person.

## Wonky Putt
`wonky-putt` · Mini golf · daily · Easy (2) · v1.4.0 · [repo](https://github.com/JohnGarrisonDev/wonky-putt)
- 1.4.0: live "Next hole in…" countdown; title panel moved off the windmill; hole 8 sand strips (random first-putt aces 2.18%→0.51%, shaky-aim bot 1.58→1.88 strokes, par 3); daily generator rejects bunkers near walls from 2026-11-28 (`make-dailies.mjs --redo-gen` re-picked 19 table days; 25-27 Nov pinned unchanged); copy fallback; full share URL. Aces still ~1-3% on holes 1, 6 and 16.
- 18 holes of top-down mini golf with sand, water, ice, bumpers, windmills, portals and conveyors. Ball skins, medals.
- 1.1.0 Daily Hole: a generated hole a day (pre-generated table through 2027-12-31, 402 days; tests warn 60 days before it runs out), one official try then practice, streaks, Copy result. Every daily passes the solver plus a noisy-player check; par = max(solver+1, noisy mean+0.5), 2-5, rising through the week. Weak spots: U-turn and two-room layouts dominate; names repeat sometimes; only ~9 dailies looked at by eye.
- Weak spots: back-nine greens are less wonky in shape; in page-mode landscape the stage is small; the portrait title hides the stars/aces line.
- Next: a second course (the hole format is data); extend the daily table before 2027-11.

## Blinkwire
`blinkwire` · Logic puzzle · daily · Easy (2) · v1.3.0 · [repo](https://github.com/JohnGarrisonDev/blinkwire)
- Rotate wire tiles to light every eye. 60-level journey, daily board with streaks, free play up to 12x12.
- 1.3.0: hints aim at the valid answer closest to the player's board (about 1 in 10 boards have a second answer); free-play setup with a board preview and a "Feels" word; 2:1 stage on sideways phones (656x328 at 844x390, was 470x294); PAR stamps and chapter counts; result card fits sideways full screen; 44px buttons; copy fallback; full share URL.
- Weak spots: par and stars still count turns to the stored answer only; a 12x12 board on a sideways phone gets ~24px tiles; the free-play 9-wide note doesn't update on resize.
- Next (backlog): a fog/sleepy-lamp twist.

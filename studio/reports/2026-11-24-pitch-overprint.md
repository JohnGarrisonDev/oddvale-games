# Pitch: Overprint (daily word puzzle)

**Question:** is a stencil-stacking word puzzle worth building as the arcade's next daily word game?
**Data:** the design below, plus [2026-11-24-research-daily-games.md](2026-11-24-research-daily-games.md) (word-guessing is crowded; spatial word games and fair, solver-checked dailies are not).
**Takeaway for the Director:** a small build in which every daily can be proven to have exactly one answer, and a different kind of word thinking from Rungs and Soupspell. Recommended first.

- **Working title:** Overprint · **slug:** `overprint` · **kinds:** Word, Puzzle · **daily:** yes
- **Target difficulty:** 2 (Easy). difficultyNote: "The Small sheet is a quick read; the Large sheet's fourth card makes you think."
- **Build size:** small (one board, three modes, a generator with a brute-force solver)
- **Scores:** Fun 4 · Daily 5 · Originality 4 · Fits 5 · Phone 4 · Build 4 = **26**

## One-line hook
Three printer robots each punched holes in a card. Turn and restack the cards until every row reads a word.

## Core loop (three sentences)
A grid of letters is printed on a base sheet, and on top sit two to four punched cards. Each card has letters printed on its solid squares and holes everywhere else, so what you see in each square is the topmost printed letter. Rotate cards a quarter turn and change their order until every row, read left to right, is a real word, then press it into print.

## What makes it original
- The idea of a word hidden by stacked, rotating cards with holes (a punched overlay, like an old cipher grille) is old and free to use. A **daily puzzle where you rotate and reorder several punched cards over a fixed grid until every row is a word** is not something I found. The nearest relatives are Cleariosity (stack clear cards to spell one three-letter word, a physical game) and Stackdown and Word Layers (take tiles off a stack). In those you remove letters. In Overprint nothing is removed: every move changes several squares at once, and the puzzle is working out which card owns which square.
- The reasoning is spatial as much as verbal: "the Q is on the top card, so wherever I turn it, its row must start with Q", or "this hole has to sit over the base sheet's A".
- Rows that are already words get an ink stamp, so you get hot-and-cold feedback without any guessing.

## Why it fits Oddvale
- It is a print game in a print-look arcade: cream paper, ink overprint, registration marks, a small newspaper at the end ("The Oddvale Gazette" headline made of your four words, e.g. BOLT GEAR OILY SNUG).
- Each card belongs to a printer robot (Pica, Elite, Smudge, Serif) shown on its tab. The punched holes are cut in the robot's face shape: one big round hole like its big eye, plus a tiny dot punch beside it. Each card's letters are in its robot's ink colour **and** its tab carries a pattern (stripes, dots, checks), so colour is never the only way to tell them apart.
- When you solve it, the robots stamp the sheet and argue about whose ink smudged.

## Daily mode
- Two sheets a day, for everyone: **Small** (4x4, base plus 3 cards) and **Large** (5x5, base plus 4 cards). Sunday's Large has 5 cards (the "Sunday edition"). The weekday ramp: Monday's par is lowest, and par rises a little each day (the generator targets a par band per weekday).
- Score: moves used against par (par = the fewest moves from the starting stack, found by the solver). A move is one quarter turn or one swap of two neighbouring cards. Undo is free but also counts as a move, so trying things out has a cost.
- Result line (no spoilers): `Overprint 2026-12-01 · Small ✓ 6 moves (par 5) · Large ✓ 13 (par 11) · games.oddvale.com/overprint/`
- Streak counts days with at least the Small solved. Add the arcade's new streak freeze (one per five solves, up to two stored) if the Director adopts it.
- Seeded by `hashString('overprint:' + date + ':small')` and `':large'`, snapshot-tested like the other dailies.

## Controls
- **Phone:** tap a card's tab (in the stack tray beside or below the board) to select it. Tap the turn arrow (or tap the selected tab again) to rotate it 90° clockwise. Drag a tab up or down in the tray to restack. Big tabs, at least 48px.
- **Mouse:** same, plus the scroll wheel over a tab to rotate.
- **Keyboard:** 1-5 select a card, R or Space rotates, Up and Down move it in the stack, U undoes, Enter presses once solved.
- Letters always stay upright. A turn moves where the holes and printed squares sit, not which way the letters face (they are stamped, not written).

## First 10 seconds
The page opens on today's Small sheet with one line: "Turn and stack the cards until every row is a word." The top card's tab wiggles. The player taps it, the card spins a quarter turn with a paper flap sound, four letters change, and the second row suddenly reads BOLT and gets a stamp *thunk* plus a small ink splat. Two more taps and the sheet is half stamped. At around ten seconds the player understands that each card owns some squares, and the puzzle has started.

## What a day's puzzle looks like
Small, 4x4. The base sheet is fully printed. Card Pica (orange, stripes) has 5 printed squares, card Elite (blue, dots) 5, and card Smudge (mint, checks) 4. The answer stack is Pica on Elite on Smudge on base, with Pica turned twice, Elite once and Smudge not at all. The rows read GEAR, OILY, BOLT, SNUG. The day starts scrambled (Smudge on top, all three turned differently) and shows, say, GXAR / BLOY / OILT / SKNG. Par is 5.

## Content plan: levels, generator, solver
- **Journey:** 60 sheets that teach as you play. Sheets 1-10 are 3x3 with 1-2 cards and 3-letter words; 11-30 are 4x4 with 3 cards; 31-50 are 4x4 with tricks (a card with a lone hole, a card that looks the same after a half turn); 51-60 are 5x5 with 4 cards. The journey comes from the generator with fixed seeds and is checked by tests.
- **Free play:** endless, pick size and card count.
- **Words:** reuse Rungs' word lists, which are already in the arcade and so need no new download: ENABLE (public domain) to accept answers, and the curated common-word list for the target rows. Avoid repeating a target word within 60 days by checking the generator's earlier dates in a test.
- **Generator** (fast, runs in the browser):
  1. Pick target words for each row from the curated list.
  2. Give each square an owner layer (one of the cards, or the base). Each card gets 4-7 printed squares at Small. Reject a card whose pattern looks the same after a turn (it would allow two equal answers).
  3. Write the target letter in each square's top printed layer in the answer stack. Every printed square hidden underneath gets a **decoy** letter, chosen so that the wrong stacks almost make words, which is where the tension comes from.
  4. Pick a scrambled start, then BFS for par. Keep the sheet only if par falls in the weekday's band (for example Small Monday 3-4 up to Saturday 5-7).
- **Solver** (this is what proves every daily is fair): try every stack order times every rotation. Small: 3! x 4^3 = **384** stacks; Large: 4! x 4^4 = **6,144**; Sunday: 5! x 4^5 = **122,880**. Each takes milliseconds to a fraction of a second. A sheet is accepted only if **exactly one** stack makes every row a curated word. If a stack makes every row an ENABLE word, the player still wins and gets an "Alternate edition" stamp, but the generator keeps such stacks to a minimum. Tests run the solver over a year of dates.

## Difficulty curve and target rating
- Rating 2 (Easy): a new player solves the Small sheet in about 1-3 minutes. Large is the optional harder sheet, Medium to Hard on Sunday.
- What makes it harder: more cards, a larger grid, fewer printed squares on the top card (so more of the grid depends on lower cards), and decoys that are closer to real words.
- Claims to verify before shipping: par bands from the solver, a bot that solves by random turns (to check that blind tapping does clearly worse than par), and a human playtest of 7 consecutive dailies.

## Risks
- **Tapping until it works.** Small has only 384 stacks. Mitigations: par is part of the shared result, undo costs a move, and Large and Sunday have thousands of stacks. If the bot shows random tapping still lands near par, add a "first press counts" rule (one Press per sheet for the shared score).
- **Readability on a 360px phone:** 5x5 at about 56px a square fits, but the stack tray has to sit below the board in portrait. Prototype this first.
- **Odd words:** curated targets only; ENABLE is used only to accept.
- **It feels random if decoys are too good.** Tune decoys so that at least one row has an obvious toehold (the Pips lesson). The generator can check this: some row must be fixed by a single card's position.
- **Closeness to Cleariosity and Stackdown:** different enough (rotation and reordering over a fixed grid, every row must be a word), but the builder must not borrow their names, art or layouts.

## Rough size
**Small.** One canvas or DOM board, a tray, a generator, a solver, three modes (Daily, Journey, Free play), and the standard kit, store and share. Similar in scope to Blinkwire.

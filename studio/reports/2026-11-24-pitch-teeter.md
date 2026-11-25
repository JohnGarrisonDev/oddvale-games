# Pitch: Teeter (daily balance puzzle)

**Question:** is a mobile-balancing logic puzzle with picky robots a good small daily for the arcade?
**Data:** the design below, plus [2026-11-24-research-daily-games.md](2026-11-24-research-daily-games.md) (balance puzzles exist as level packs, such as Heft's mobiles chapter and Vectorpark's Levers; I found no daily one).
**Takeaway for the Director:** a small, very phone-friendly daily puzzle with real physics feel, provable by search. It is less original than Overprint, so it is the third choice.

- **Working title:** Teeter · **slug:** `teeter` · **kinds:** Puzzle, Physics · **daily:** yes
- **Target difficulty:** 2 (Easy). difficultyNote: "Small mobiles balance fast; the Large one's picky robots make it a proper puzzle."
- **Build size:** small-medium
- **Scores:** Fun 4 · Daily 4 · Originality 3 · Fits 5 · Phone 5 · Build 4 = **25**

## One-line hook
The robots want to hang from the workshop mobile. Hang every one so each beam is level, and nobody's sulking.

## Core loop (three sentences)
A mobile hangs from the ceiling: beams with numbered notches, and some beams hanging from other beams. You drag the day's robots (each with a weight of 1-6, shown as bolts on its belly) onto notches, and the beams swing live as you do. You finish when every beam is level **and** every robot's wish card is satisfied (such as "Nib won't hang under anyone", "the twins share a beam", or "Gus wants to be lowest").

## What makes it original
- The balance rule is the classic lever rule (weight times distance must match on both sides; a hanging beam pulls with everything below it), which is ancient and free. Heft's mobiles chapter asks you to *work out unknown weights*; Levers has you hang objects freehand. **Teeter gives you known robots to place, adds a seating-chart logic layer of wishes, and has a daily mobile that is the same for everyone.** Doing the sums and satisfying the wishes together is the twist: the weights alone allow several answers, and the wishes cut them down to exactly one.
- It shows the physics live: the beams tilt in proportion to the imbalance with a damped swing, so you *feel* the answer getting close before you finish counting.

## Why it fits Oddvale
- The robots are the weights. Each has mismatched eyes, a bolt count and an opinion. They dangle by their antennae, kick their feet, and peer down when they're high up.
- A paper-craft mobile in the print look: thick ink outlines, hard shadows, beams like painted wooden dowels, a slight sway even when level.
- The wish cards are tiny printed tags tied to each robot.

## Daily mode
- Two mobiles a day: **Small** (2 beams, 4-5 robots, 1 wish) and **Large** (3-4 beams, 6-8 robots, 2-3 wishes). The weekday ramp adds beams and wishes towards Sunday.
- Score: **nudges**, meaning how many times you moved a robot that was already hanging. Par comes from the solver's shortest placement order, which is just the number of robots, so par = 0 nudges. The result shows it without spoilers: `Teeter 2026-12-01 · Small ✓ 0 nudges · Large ✓ 3 nudges · games.oddvale.com/teeter/`
- A streak, plus the streak freeze if adopted. Seeded by `hashString('teeter:' + date + ':small' | ':large')`, snapshot-tested.

## Controls
- **Phone:** drag a robot from the bench (bottom) to a notch; notches glow when a robot is near, and the snap radius is generous (at least 44px). Tap a hanging robot to send it back to the bench. Wish tags open with a tap.
- **Mouse:** the same drag-and-drop.
- **Keyboard:** arrow keys move a cursor over the notches, 1-8 picks a robot from the bench, Enter hangs it, Backspace returns it.

## First 10 seconds
One beam, one robot already hanging on the left at notch 2, tilting the beam down. One line: "Make it level." The player drags the only bench robot (2 bolts) to the right, and the beam swings, overshoots and settles level with a chime. Both robots cheer. A second beam drops in from above with three robots on the bench and a wish tag: the real puzzle has begun, at about 10 seconds.

## What a day's puzzle looks like
Large, Thursday. A top beam has notches -3..+3, and a sub-beam hangs from its notch -2. The bench holds six robots weighing 1, 2, 2, 3, 4 and 6. Wishes: "Pim (3) won't hang under anyone" and "Dot and Dash (the 2s) share a beam". The weights alone allow 4 solutions; the wishes leave exactly one.

## Content plan: levels, generator, solver
- **Generator:** pick a tree shape (beams and where each hangs) by weekday, then build a solution backwards: assign robots to notches with weights chosen so every beam balances, working from the bottom beam up (a hanging beam's total weight is the sum below it). Then give the robots fixed personalities and names.
- **Solver:** backtracking assignment of bench robots to notches with early pruning when a beam can't balance; it counts *all* solutions. Large is at most about 8 robots on about 14 notches, which takes milliseconds with pruning. Wishes are added one at a time, chosen from a template list (above or below, same beam, lowest or highest, not next to X, far end) to cut the solution count until it is **exactly 1**. Reject a puzzle if more than 3 wishes would be needed. Tests run a year of dates through the solver.
- **Journey:** 40 mobiles generated from fixed seeds: 1 beam, then 2 beams, then the first wish, then hanging sub-beams, then 3 wishes.
- **Free play:** endless, with a chosen size.

## Difficulty curve and target rating
- Rating 2 (Easy) for the Small daily; Large is Medium.
- What makes it harder: deeper trees (sums carry upward), more robots of similar weight, and wishes that only make sense together.
- To verify: solver-based difficulty (count of forced deductions), and a human playtest of a week of dailies.

## Risks
- **Originality is the weakest score (3).** Heft and Levers cover the balance rule. The daily format and the wishes have to carry it. The builder must not borrow either game's look or levels.
- **Arithmetic as a chore:** some players dislike sums. The live tilt makes it more feel than maths at Small sizes, and the numbers stay small (1-6, notches up to 3).
- **Wishes may read as arbitrary.** Keep a small, consistent set of wish types and use icons on the tags.
- **Physics feel:** the beam swing has to look right (damped spring, angle limits); tune it by eye in a real browser. It is purely cosmetic, so whether a beam counts as level never depends on frame timing.

## Rough size
**Small-medium.** One scene, drag and drop, a cosmetic swing simulation, a generator and solver, three modes. Similar to Lookout in logic, simpler in UI.

# Pitch: Sift (daily falling-sand physics)

**Question:** can the "falling sand with goals" spark become a fair, shareable daily physics game?
**Data:** the design below, plus [2026-11-24-research-daily-games.md](2026-11-24-research-daily-games.md) (falling sand exists as sandboxes, with no daily goal mode found; daily physics in general is thin).
**Takeaway for the Director:** the most distinctive physics idea we have. Because the simulation is integer-only, every player's pour comes out exactly the same, so scores are comparable. It is a medium-to-large build with a phone-speed risk, so prove the simulation in a one-day spike before approving the full build.

- **Working title:** Sift · **slug:** `sift` · **kinds:** Physics, Puzzle · **daily:** yes
- **Target difficulty:** 3 (Medium). difficultyNote: "Two parts on Monday, four by Sunday; 100% purity takes real thought."
- **Build size:** medium-large (cellular-automaton simulation, part placement, an offline solver and a puzzle bank)
- **Scores:** Fun 5 · Daily 4 · Originality 3 · Fits 5 · Phone 4 · Build 2 = **23**

## One-line hook
The grit hopper at the robot foundry is jammed with pebbles, sand and dust. Hang the sieves, pull the lever, and sort it all into the right bins.

## Core loop (three sentences)
Each puzzle is a tall box: a hopper of mixed grit at the top, three labelled bins at the bottom, and a few mounting pegs in between. You hang the day's parts (sieves with different hole sizes, a plank, later a fan) on the pegs at one of three angles, then pull the lever and watch thousands of grains pour, bounce and split. Your score is how pure the bins end up; you get three pours a day, and your best one counts.

## What makes it original
- **Sorting by size is the core idea.** Pebbles (drawn 2x2) can't pass through a **big-eye sieve** and roll off its low end; sand (1x1) falls through it. A **dot-eye sieve** lets only dust through. Dust is light, so a **fan** pushes it sideways. The puzzle is a sorting network made of physical parts.
- The nearest relative, Sugar, Sugar, has you *draw lines* to steer one kind of sugar into cups (later with colour filters), and it is level-based. Sift has no drawing: a few fixed parts on fixed pegs, sorting by grain size, a purity percentage, and a **daily** pour that is identical for everyone. Falling-sand sandboxes (Sandspiel, Sandboxels) have no goals or dailies that I found.
- **Exact sameness:** the simulation is an integer cellular automaton with a fixed update order and a seeded RNG. Every device produces the same pour from the same placement, grain for grain, so "94%" means the same thing for everyone and tests can snapshot results.

## Why it fits Oddvale
- The sieves' holes are robot eyes: big-eye mesh (rows of big round holes) and dot-eye mesh (tiny dots). It's the brand's mismatched eyes as a game mechanic.
- Each bin is a robot sitting in a bucket with its head poking out. It gets buried happily; a pure bin earns it a sandcastle hat, and a contaminated bin makes it sneeze dust.
- Flat print look: grains in ink, orange and mint on cream, chunky outlined parts with hard shadows, a slightly tilted box.

## Daily mode
- One box a day, the same for everyone. **Three pours**; your best counts. Before pouring you can use a free **Trickle**: tap a grain icon to drop five grains of that kind and see their path. This lets you reason before committing, and keeps the three pours meaningful.
- **Weekday ramp:** Monday has 2 parts and 3 pegs; midweek 3 parts and 4-5 pegs; Saturday adds the fan; Sunday has 4 parts with a "wet sand" box (wet sand clumps and slides as a chunk).
- **Score:** purity = correct grains in bins divided by all grains, shown as a percentage. Par = the solver's best (often but not always 100%).
- **Result line (no spoilers):** `Sift 2026-12-01 · 96% (par 100%) · pour 1 ▓▓▓▓▓▓▓░░░ 71% · pour 2 ▓▓▓▓▓▓▓▓▓░ 93% · pour 3 ▓▓▓▓▓▓▓▓▓▓ 96% · games.oddvale.com/sift/`
- Streak = days with at least one pour at 80% or better. Seeded by `hashString('sift:' + date)`, picked from a bank (see below), and snapshot-tested.

## Controls
- **Phone:** drag a part from the tray onto a glowing peg (pegs have 56px touch targets), tap a placed part to cycle its angle (/ - \), drag it off to remove it. Pull the lever, a big button below the box. Trickle buttons sit beside the bins.
- **Mouse:** the same; right-click a part to rotate it the other way.
- **Keyboard:** Tab cycles pegs, 1-4 places a part, R rotates, Delete removes, Space pours, T plus 1-3 trickles.
- Pause when the tab is hidden; a pour also pauses mid-stream and resumes.

## First 10 seconds
The box appears with the hopper full and one line: "Sort the grit: pebbles left, sand middle, dust right." A big-eye sieve wobbles in the tray and one peg glows. The player drags it on (clunk) and taps the lever. Grit pours with a hiss; pebbles hit the sieve and roll left, sand rains through, and within about eight seconds the left robot is up to its chin in pebbles while the dust has gone everywhere. "71% sorted. The dot-eye sieve catches dust." The player wants another go.

## What a day's puzzle looks like
A Wednesday box, 90x140 cells. The hopper holds 1,800 grains (500 pebble-cells, 900 sand, 400 dust), released in a fixed seeded pattern. There are four pegs: two high, one middle-left, one low-right, plus a fixed funnel. The parts are a big-eye sieve, a dot-eye sieve and a plank. The solver's best is big-eye on the high-left peg tilted \, dot-eye on the middle peg tilted /, and the plank on the low-right peg flat, scoring 98%. Some dust bounces off the plank, so 100% isn't possible today, and par says so.

## Content plan: levels, generator, solver
- **Simulation:** typed-array grid, about 90x140 cells (about 12,600), 1,500-2,500 grains. The update runs bottom-up, with left/right order alternating by tick parity, all integer. Pebbles are 2x2 entities that check their two-cell footprint. Sieve cells are passable by grain kind. Tilted parts are drawn and simulated as stair-steps. Rendering writes the grid to an ImageData scaled up with `image-rendering: pixelated`, with parts drawn as vector shapes on top. A pour lasts about 6-10 seconds and can be sped up 2x.
- **Why a bank, not live generation:** checking one box means simulating every placement. With 4 pegs, 3 parts and 3 angles that is (4x3x2) x 27 = 648 pours, roughly 0.5 million cell updates each, too slow for a phone. So a dev-only `tools/solve.mjs` (Node) generates boxes from seeds and runs every placement. It keeps a box only if (a) the best purity is at least 90%, (b) the best placement wins by a clear margin (at least 8 points over the most obvious placement, so thinking pays), and (c) at least one 80%+ placement exists, so the streak is reachable. It writes `src/daily-bank.json`: one entry per date for 2026-12 to 2027-12, holding the layout, parts, par and reference placement (a few KB per box, gzip-friendly).
- **Proven solvable:** every bank entry stores its reference placement, and `tests/` re-simulates it in Node and checks the purity equals the stored par. Snapshot tests pin the bank so a published day can never change. The bank must be extended before it runs out; the builder adds a test that fails 60 days before the last date.
- **Journey:** 30 boxes generated by the solver, then hand-ordered, introducing the plank, big-eye, dot-eye, funnel, fan and wet sand, three stars at 70/90/100%.
- **Sandbox:** all parts, any number of pegs, pour forever (this keeps the joy of the falling-sand toy).

## Difficulty curve and target rating
- Rating 3 (Medium): reaching 80% is easy with the Trickle, 100% on Saturday or Sunday is hard.
- What makes it harder: more parts and pegs, the fan's dust drift, bounce interactions between parts, and wet-sand clumps.
- Data needed before shipping: the solver's purity spread per weekday, a random-placement bot's median (so the Monday median should be around 60%), and a human playtest on a real phone.

## Risks
- **Phone speed (the main risk).** 2,500 grains at 60 fps in plain JS should be fine with typed arrays and no per-frame allocation, but this must be measured on a throttled phone profile in a **one-day spike before the full build**. Fallback: fewer, larger cells (60x94).
- **Identical results across browsers:** guaranteed only if the simulation uses no floats and no `Math.random`. Tests must compare a pour's final grid hash between Node and a browser run.
- **Telling grain kinds apart:** pebbles are bigger (2x2) and darker; sand is mid-tone; dust is pale and speckled. Bins carry shape icons, not just colours. Check with a greyscale screenshot.
- **Closeness to Sugar, Sugar:** keep the no-drawing, sieve-by-size, purity-score design, and don't use cups or sugar, or anything from that game's look or levels.
- **Overlap with Rickety and Star Post:** all three are "set up, then watch". Sift's difference is the material (thousands of grains, and a partial score rather than pass or fail). The Director should weigh whether a third set-up-then-watch physics game is too many.
- **Size:** the offline solver and bank add work, and the bank must be extended once a year.

## Rough size
**Medium-large.** Simulation plus renderer, part placement, an offline solver tool, a bank, three modes, tests. Bigger than Rickety's generator, comparable to Star Post overall.

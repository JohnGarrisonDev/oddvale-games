# How to build a game for Oddvale Games

Oddvale Games (games.oddvale.com) hosts browser games that are designed, built and updated by AI models. Every game is its own public GitHub repo, and is served at `games.oddvale.com/<slug>/`. This guide is the contract between a game repo and the hub. If you are an AI agent starting or updating a game, read all of it.

## The rules
1. **No build step, no dependencies.** A game repo is plain static files: HTML, CSS, ES modules, assets. Opening `index.html` through any static server must run the game. No npm packages at runtime, no bundler, no framework, no CDN.
2. **Relative URLs only.** The game is served from a sub-folder (`/<slug>/`), so never start a URL with `/`. The link back to the hub is `../`.
3. **No external requests.** No analytics, fonts, scripts or images from other hosts. No cookies. The hub sends a strict Content-Security-Policy (`default-src 'self'`; inline styles allowed, inline scripts and `eval` not).
4. **Save with localStorage only**, in one JSON blob under the key `oddvale:<slug>` (use `makeStore` from the kit). There are no accounts. Handle missing or broken save data without crashing.
5. **Works with mouse, keyboard and touch**, from a 360px-wide phone to a desktop monitor. The game must be fully playable on a phone, portrait included.
6. **Original work only.** Genres and mechanics are fine to borrow. Names, characters, art, music or level layouts from existing games are not.
7. **Pause when hidden.** Stop the simulation when the tab is hidden (`visibilitychange`) and clamp frame delta time, so nobody dies while in another tab.
8. **Say it's AI-made.** The page carries the standard "Made by AI, in the open" card and a GitHub link in the top bar.
9. **Make feedback easy.** The footer links to the repo's feedback form (`issues/new?template=feedback.yml`, already in `kit/template.html`), and the repo has `.github/ISSUE_TEMPLATE/feedback.yml` and `config.yml` (copy them from any game repo and change the names). Players' issues are what the studio's feedback analyst reads.

## Repo layout
```
index.html        the game page (start from kit/template.html in the hub repo)
game.json         metadata the hub reads to list the game (see below)
cover.webp        1536x1024 cover art for the hub card and social previews
src/main.js       entry point (ES module); split the rest of the code into small modules in src/
src/game.css      game-specific styles (overlays, HUD); the shell comes from kit/shell.css
kit/              copy of the hub's kit: shell.css, kit.js, fonts/, favicon.svg, mark.svg. Do not edit; re-copy from the hub to update.
tools/            optional dev-only scripts (balance sims, solvers); like tests/, not published to the site
tests/            node tests for game logic (`node --test tests/`; add a tests/index.js that imports each test file, newer Node versions need it); keep rules/simulation code free of DOM access so it can be tested
README.md         what the game is, how to run it, how the code is laid out
AGENTS.md         notes for the next AI: architecture, how to add content, balance notes, ideas backlog
CHANGELOG.md      one entry per version, newest first, written for players
```

## game.json
```json
{
  "slug": "my-game",
  "title": "My Game",
  "tagline": "One short line that sells it.",
  "description": "Two or three plain sentences: what you do and why it's fun.",
  "genre": "Arcade survival",
  "kinds": ["Arcade"],
  "daily": false,
  "difficulty": 3,
  "difficultyNote": "One plain sentence on how hard it is and how that ramps.",
  "verb": "Survive",
  "tone": "ink",
  "players": "1 player",
  "session": "5–10 min runs",
  "controls": ["Keyboard", "Mouse", "Touch"],
  "version": "1.0.0",
  "released": "2026-11-24",
  "updated": "2026-11-24",
  "repo": "https://github.com/JohnGarrisonDev/my-game",
  "cover": "cover.webp",
  "coverAlt": "Illustration: ..."
}
```
`tone` picks the hub card colour: `ink`, `blue`, `yellow`, `mint`, `orange` or `pink`. `kinds` drives the hub's filter chips: one or more of `Puzzle`, `Word`, `Physics`, `Arcade`. Set `daily` to `true` when the game has a new puzzle or challenge every day; the hub then shows a "New every day" badge. `difficulty` is a whole number from 1 to 5, shown on the hub card as pips and a word: 1 Relaxed, 2 Easy, 3 Medium, 4 Hard, 5 Brutal. Rate the typical experience of a new player, not the hardest optional challenge, and use `difficultyNote` (one sentence, at most 110 characters) to say how it ramps or where the hard part is. Revisit both when an update changes the balance.

## The kit
`kit/shell.css` gives the page shell: top bar, `.stage` (the bordered box the game lives in), `.info` cards, `.btn`, `.chip`, `kbd`, the brand fonts and the colour tokens. `kit/kit.js` exports:
- `C` (brand colours) and `FONT` (font stacks) for canvas drawing
- `makeStore(slug, defaults)` for save data
- `fitCanvas(canvas)` for crisp canvases at device pixel ratio
- `makeRng(seed)` and `hashString(str)` for seeded randomness (daily challenges)
- `sfx.tone / sfx.noise / sfx.tune` for synthesised sound effects (no audio files needed), with a mute state shared by all Oddvale games
- `wireChrome({ stage })` to hook up the mute and full-screen buttons in the top bar
- `drawOddFace(ctx, x, y, size, opts)` to draw the Oddvale face (big orange eye, small dot eye, V smile)

Set the stage shape per game in `src/game.css`, e.g. `.stage { --stage-ratio: 16 / 9; --stage-ratio-n: 1.7778; }` and switch to a taller ratio on narrow screens with a media query. Everything the player needs during play (menus, HUD, pause, game over) goes inside `.stage` so full screen works.

## Look and feel
Oddvale's brand is a playful print look: warm cream paper `#FBF6EC`, plum-black ink `#17131F`, odd orange `#FF5B2E`, sun yellow `#FFC93C`, mint `#2FD6A3`, electric blue `#5B5BFF`, bubblegum pink `#FF8FC7`. Flat shapes, 2px+ ink outlines, hard offset shadows (no blur), big rounded corners, things tilted a degree or two. Headlines in Fraunces (soft, wonky, 800), body in Figtree, labels in DM Mono uppercase.

The stars are **odd little robots with mismatched eyes**: one big orange eye with an off-centre pupil, one small dot eye. Nothing matches, on purpose. Draw game art in code (canvas shapes) in this flat style, or use generated images in the same style. Voice: playful, plain, specific, short sentences. Jokes welcome, hype not.

## What "good" means here
- Fun in the first 10 seconds, with no instructions needed beyond one line. Teach by playing.
- Juice: squash and stretch, particles, screen shake (small, and off under `prefers-reduced-motion`), sound on every meaningful action.
- A reason to come back: best scores, unlocks, daily challenges or new levels, all saved locally.
- Fair difficulty that ramps. A new player should last a few minutes; a good player should still find it hard.
- 60fps on a mid-range phone. Pool objects, avoid per-frame allocations in hot loops, cap particle counts.
- Accessible: readable text sizes, colour is never the only signal, keyboard focus works on menus, respects reduced motion.

## Shipping an update
1. Change the game, add or update tests, run `node --test tests/`.
2. Play it in a browser, on desktop and at phone width, with the console open. No errors, no warnings.
3. Bump `version` and `updated` in `game.json`, add a `CHANGELOG.md` entry, update `AGENTS.md` if the architecture or backlog changed.
4. Commit and push to `main`. The hub picks up the latest `main` of every game the next time it deploys (`npm run deploy` in the hub repo).

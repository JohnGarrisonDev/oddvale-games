# Notes for AI agents working on Oddvale Games

You are probably here to do one of three things.

## 1. Update an existing game
Work in that game's own repo, not here. Read its `AGENTS.md` first (architecture, how to add content, backlog), then [GAME_GUIDE.md](GAME_GUIDE.md) in this repo for the hosting rules. Ship with the checklist at the bottom of the guide. Then run `npm run deploy` in this repo to publish.

Good updates are small and whole: one new idea, finished, tested and written up in the game's `CHANGELOG.md`. Do not rewrite a game's core or rename it. Never break existing save data: migrate old `localStorage` blobs forward.

## 2. Add a new game
Follow "Adding a game" in [README.md](README.md). Pick something the arcade does not have yet (check `games.json`). The bar: fun within 10 seconds, playable on a phone, a reason to come back tomorrow. Original work only: borrow genres and mechanics, never another game's name, characters, art or levels.

## 3. Change the hub
- Home page copy and layout: `site/index.template.html` and `site/hub.css`. Game cards are generated in `scripts/build.mjs` from each game's `game.json`, so card text is changed in the game repo.
- Shared look: `kit/shell.css` and `kit/kit.js`. Games carry their own copy of `kit/`, so a kit change reaches a game only when the kit is re-copied into that game's repo. Keep kit changes backwards compatible.
- After any change: `npm run build:local && npm run check`, then look at it with `npm run serve` at desktop and phone width, in light and dark mode.

## House rules
- Zero runtime dependencies and no build step for games. The hub's only dev dependencies are `sharp` (art conversion) and `wrangler` (deploy).
- Follow the voice in GAME_GUIDE.md: playful, plain, specific. No hype.
- Never commit secrets. Cloudflare credentials come from the environment or a git-ignored `.env`.

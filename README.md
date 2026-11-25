# games.oddvale.com

The Oddvale arcade: a home page plus every Oddvale browser game, served from one Cloudflare Pages project (`oddvale-games`).

The games are designed, built and updated by AI models. Each game lives in **its own public repo** and is served at `games.oddvale.com/<slug>/`. This repo is the hub: the home page, the shared design kit, the rules for game repos, and the script that stitches everything into one site.

| Game | Kind | Play | Repo |
|---|---|---|---|
| Lookout | Logic puzzle · daily | [games.oddvale.com/lookout](https://games.oddvale.com/lookout/) | [JohnGarrisonDev/lookout](https://github.com/JohnGarrisonDev/lookout) |
| Rungs | Word puzzle · daily | [games.oddvale.com/rungs](https://games.oddvale.com/rungs/) | [JohnGarrisonDev/rungs](https://github.com/JohnGarrisonDev/rungs) |
| Soupspell | Word physics · daily | [games.oddvale.com/soupspell](https://games.oddvale.com/soupspell/) | [JohnGarrisonDev/soupspell](https://github.com/JohnGarrisonDev/soupspell) |
| Rickety | Physics builder · daily | [games.oddvale.com/rickety](https://games.oddvale.com/rickety/) | [JohnGarrisonDev/rickety](https://github.com/JohnGarrisonDev/rickety) |
| Star Post | Gravity physics · daily | [games.oddvale.com/star-post](https://games.oddvale.com/star-post/) | [JohnGarrisonDev/star-post](https://github.com/JohnGarrisonDev/star-post) |
| Odd One Out | Arcade survival | [games.oddvale.com/odd-one-out](https://games.oddvale.com/odd-one-out/) | [JohnGarrisonDev/odd-one-out](https://github.com/JohnGarrisonDev/odd-one-out) |
| Wonky Putt | Mini golf | [games.oddvale.com/wonky-putt](https://games.oddvale.com/wonky-putt/) | [JohnGarrisonDev/wonky-putt](https://github.com/JohnGarrisonDev/wonky-putt) |
| Blinkwire | Logic puzzle · daily | [games.oddvale.com/blinkwire](https://games.oddvale.com/blinkwire/) | [JohnGarrisonDev/blinkwire](https://github.com/JohnGarrisonDev/blinkwire) |

## How it fits together
```
games.json                  the list of games: slug + repo URL, in display order
site/                       the home page (index.template.html, hub.css), 404 page, headers, icons
kit/                        shared page shell every game copies: shell.css, kit.js, fonts, template.html
scripts/build.mjs           clones each game repo at latest main, copies it to dist/<slug>/, renders the home page from each game.json
scripts/check.mjs           checks links and that every game follows the hosting rules
scripts/serve.mjs           tiny static server for local testing
scripts/cf.mjs              runs Wrangler with the Cloudflare credentials
scripts/art.mjs             converts art-src/*.png into WebP (hero art here, covers into each game repo)
GAME_GUIDE.md               the contract for game repos. Read this before building or changing a game.
studio/                     how the AI team runs the arcade: roles, goals, game status, ideas, log, reports
scripts/analytics.mjs       page views per game from Cloudflare edge logs (npm run analytics)
```
Nothing here needs a framework or a bundler. The home page is one HTML template and one CSS file.

## Commands
```sh
npm ci
npm run build         # fetch every game at latest main -> dist/
npm run build:local   # same, but use ../<slug> checkouts next to this repo when they exist (test unpushed work)
npm run serve         # http://127.0.0.1:4173
npm run check         # links + hosting rules
npm run deploy        # build + check + upload to Cloudflare Pages
npm run art           # re-convert illustrations from art-src/
npm run analytics     # page views per game per day (needs Zone Analytics Read on the Cloudflare token)
```
Deploying needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, either in the environment or in an `.env` file here (git-ignored).

## Shipping a game update
Push to the game's `main`, then run `npm run deploy` here. The hub always ships the latest `main` of every game.

## Adding a game
1. Create a public repo named after the slug and build the game to [GAME_GUIDE.md](GAME_GUIDE.md) (start from `kit/template.html`, copy `kit/` into the repo).
2. Add `{ "slug": "...", "repo": "..." }` to `games.json`.
3. Add a cover prompt to `art-src/PROMPTS.md`, generate `art-src/cover-<slug>.png`, run `npm run art`, and commit the resulting `cover.webp` in the game repo.
4. `npm run deploy`.

## Notes
- No backend, no accounts, no cookies, no trackers. Games save progress in the player's browser with localStorage.
- The site sends a strict Content-Security-Policy (see `site/_headers`): everything loads from the same origin.
- Illustrations are AI-generated. Prompts and the shared style are in `art-src/PROMPTS.md`.
- Brand guide: see `BRAND.md` in the main [oddvale-site](https://github.com/JohnGarrisonDev/oddvale-site) repo. The short version is in GAME_GUIDE.md.

## License
Code is MIT licensed, see [LICENSE](LICENSE). The fonts in `kit/fonts/` (Fraunces, Figtree, DM Mono) are under the SIL Open Font License 1.1. The Oddvale name and mark are not covered by the MIT license.

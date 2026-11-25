# Meeting brief: player input, engagement, security and the "Odd Account"

**Date:** 2026-11-25 · **Chair:** the Director (studio/README.md) · **Format:** two meetings. Meeting 1: five roles each write a position independently (this folder, one file per role). The Director drafts a plan from them. Meeting 2: a review panel challenges the draft. The Director then writes the final plan and minutes for the owner to decide on.

## The owner's questions (verbatim intent)
1. How do we get **user input and engagement** on games.oddvale.com? Can we have **user polls**? **User ratings**?
2. With that, we need to figure out **security**.
3. Should we implement the **"Odd Account"**: the owner's idea of one user account **shared across all Oddvale applications, present and future**?
4. Produce **a plan and a cost estimate** (if there is a cost).

Nothing gets built from this meeting without the owner's go-ahead: accounts, forms, cookies and new services are all on the studio's "ask the owner first" list.

## Where things stand today (facts)
**The arcade, games.oddvale.com**
- One Cloudflare Pages project (`oddvale-games`), fully static: a hub page plus 9 games, each game its own public GitHub repo, built with no framework and no dependencies. Hub repo: `C:\Users\John\Documents\Sandy\Oddvale Games\oddvale-games` (read `studio/README.md`, `studio/goals.md`, `studio/games.md`, `GAME_GUIDE.md`).
- No backend, no accounts, no cookies, no trackers, no ads. Progress, streaks and settings live in each player's browser (localStorage). The site says so publicly ("no downloads, no sign-up, no ads", "no cookies or trackers").
- Strict Content-Security-Policy in `site/_headers`: `default-src 'self'`, no inline scripts, `connect-src 'self'`, `frame-ancestors 'none'`, `form-action 'none'`.
- 6 of 9 games have a daily puzzle with a shareable spoiler-free result line (copy to clipboard).
- Feedback today: a "Feedback" link in every footer opens a GitHub issue form (needs a GitHub account). Zero issues so far. Usage analytics: blocked (the Cloudflare API token lacks analytics read); no numbers exist yet. Games launched 2026-11-24.

**The rest of Oddvale** (the company: "a small AI venture studio", tagline "AI for the fun of it"; brand promises no cookies or trackers on oddvale.com)
- `oddvale.com`: static React site on Cloudflare Pages (local copy at `C:\Users\John\Documents\Sandy\Oddvale`).
- **Ghostframe** (`ghostframe.oddvale.com`, repo `JohnGarrisonDev/ghostframe`, private): AI speedrun lab, free Windows desktop app plus a site.
- **Odd House** (`house.oddvale.com`, repo `JohnGarrisonDev/odd-house`, private; local folder `C:\Users\John\Documents\Sandy\AI Big Brother`): a 24/7 AI reality show watched in the browser; Cloudflare Pages front end plus a simulation on Fly.io (`house-feed.oddvale.com`).
- **Pullbox** (`pullbox.oddvale.com`, repo `JohnGarrisonDev/grail-diary`, private): comic collection manager: web + mobile + .NET API with AI cover scanning. It likely already has its own user accounts.
- All DNS is in one Cloudflare zone (`oddvale.com`). The owner also uses Azure, Fly.io and GitHub. The owner works mostly alone, with AI agents doing much of the building and operating.

## Constraints and values to respect
- Oddvale's promises: fun first, made in the open, no trackers, no ads, plain honest language. Changing a public promise is the owner's call; say clearly if your recommendation needs one changed.
- Small team (effectively one person plus AI agents): prefer low-maintenance, low-ops, low-cost options; security must not depend on someone watching dashboards daily.
- The games are casual and colourful, so **children may play them**. Treat that as a real design and legal input.
- Everything must still work for people who never sign in.

## Rules for role agents
- Write your position to `<this folder>/<role>.md` (the file name is given in your brief). Aim for 900-1,600 words. Lead with your top 3 recommendations, then reasoning, options considered, risks, and open questions for the owner.
- Use web search for anything that changes over time (prices, free-tier limits, laws, product features) and cite sources with dates. Mark estimates as estimates. Your training data may be out of date; check.
- Do not build anything, change any repo, run git, create accounts, sign up for services, or download files. Reading local folders and private repos read-only (`gh` CLI, `gh api`, `gh search code`) is fine.
- Be specific and honest. If something is a bad idea, say so.

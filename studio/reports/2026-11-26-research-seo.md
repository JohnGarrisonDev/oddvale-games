# Research: SEO for games.oddvale.com (2026-11-26)

**Role:** Market researcher. **Read date for every link: 2026-11-26.**
**Method:** fetched Google, IndexNow and Bing pages; fetched the live site; read the built `dist/` folder, `scripts/build.mjs` and each game's `index.html` (read only). Nothing was posted, signed up for, downloaded or changed. No git.
**Labels:** **Source says** = what a page states. **Our view** = my judgment. Many fetches were summarised by a small model, so quotes are paraphrases.

## Summary (10 lines)
1. The basics are already good: unique titles and descriptions, absolute canonicals, a sitemap, an open robots.txt, no noindex, real text on every game page, and a 404 that is noindex.
2. Google needs nothing special for games or AI answers. Source says no special markup, no llms.txt, same fundamentals as any site.
3. Biggest gap: the site is not verified in Google Search Console or Bing Webmaster Tools, so we are blind and slow to be found. This is an owner step (DNS on Cloudflare).
4. Game page titles are only "Name — Oddvale Games". They do not say what the game is (daily word ladder puzzle, etc.). Cheap fix, real gain.
5. Game pages have no structured data and no links to each other except a "More games" link. The hub has a VideoGame list, but Google shows no rich result for VideoGame alone.
6. Share cards use a 3:2 webp cover on game pages. A 1200x630 PNG or JPG is safer. No `og:site_name` or `og:image:alt` on game pages.
7. Do NOT make per-day archive pages (/rungs/2026-11-26/). They would be thin, near-duplicate, canvas-rendered pages and look like doorway or scaled content.
8. Do NOT chase "unblocked" keywords. Wrong audience, spam neighbourhood, no fit with our promise.
9. Backlinks matter most for a new site. Fit: oddvale.com, the 9 GitHub repos, daily-game directories, "best daily games" lists. All need the owner to post or submit.
10. Expect slow results. Realistic goal for 3 months: every page indexed, brand search ("Oddvale Games") and a few long-tail genre queries working. No tracker needed to measure; Search Console is free and cookie-free for visitors.

---

# Part 1. Research

## 1.1 How browser and daily puzzle games get search traffic

**Source says**
- A search for "games like Wordle" returns mainly list articles from big publishers (PC Gamer, GamesRadar, Digital Trends, Arkadium, Beebom, Pocket Tactics and others). Recurring terms: "Wordle alternatives", "daily word puzzle", "free browser puzzle", "brain teasers". I found no search-volume data. (Web search, 2026-11-26.)
- John Mueller (Google) wrote that no AI system uses llms.txt ([Search Engine Roundtable, 2025-06-18](https://www.seroundtable.com/google-ai-llms-txt-39607.html)).

**Our view (no volume data was available; treat as reasoning, not measurement)**
- Head terms ("Wordle", "games like Wordle", "daily word game") are owned by big publishers and Wordle itself. A new site will not rank for them in the first months.
- Realistic targets are long-tail and mechanic-specific: "word ladder game online free", "daily word ladder puzzle", "logic puzzle hedges numbers online", "bridge building physics game browser", "gravity slingshot puzzle online", "mini golf browser game". Each of our games has a distinctive mechanic, which helps.
- Pattern that works for small daily games: be the page that answers "what is this game and how do I play it", have a stable URL for the game itself (not per day), and get a few real links. Players come back by habit, not by search (the 2026-11-24 report says the same).
- Visitors also search the game name once they hear of it. Brand queries ("Rungs oddvale", "Soupspell") are the first thing to win. Short unusual names help here.
- **"Unblocked" keywords:** these come from students on filtered school networks looking for games on non-blocked domains. The results are dominated by mirror and proxy sites. Our view: avoid. The audience wants games on any host, not ours specifically; the pages that rank are often doorway-style; chasing them would mean pages written for a search term, which Google's own guidance warns against (see 1.2). It also invites children and sits badly with "no ads, no trackers" brand trust.
- **"Answer today" keywords** (e.g. "Wordle answer today") are large but are spoilers. A public answer page would also break our daily puzzles. Avoid.

## 1.2 What Google says that matters here

| Topic | Source says | Our view for us |
|---|---|---|
| Helpful content | Content should be created mainly for people, not to manipulate rankings. Signs of search-engine-first content include heavy automation, covering many topics to see what ranks, and changing content just to look fresh. Explain **who** made it and **how** (including AI or automation) where readers would wonder. [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | Our "Made by AI, in the open" card and public repos already answer "how". Add one short About page so the "who/how/why" lives in one place, linked from the footer. |
| AI-generated content | Not penalised as such. Using generative AI to make many pages without adding value can break the **scaled content abuse** policy. Fact-check, review titles, descriptions and structured data. [Using generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) | Nine hand-curated game pages are fine. The risk is later: generating hundreds of near-identical pages (daily archives, "word of the day" pages). Don't. |
| Spam policies | Scaled content abuse = many pages mainly to rank, low added value, however produced. Doorway abuse includes pages made to funnel users into the useful part of a site and substantially similar pages closer to search results than a browsable hierarchy. [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) | Per-day archive pages fall close to this. See 1.3. |
| Structured data | The gallery has 25 features. **No Game, VideoGame or WebApplication feature.** It does have "Software app" (SoftwareApplication, and its subtypes MobileApplication and WebApplication). That feature needs `name`, `offers.price` (0 for free) and **either** `aggregateRating` **or** `review`. Google shows no rich result for a page typed only as VideoGame; you must co-type it with another type. [Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), [Software app](https://developers.google.com/search/docs/appearance/structured-data/software-app) | We have no ratings or reviews, and must not invent them. So we cannot earn the Software app rich result. JSON-LD is still harmless and helps machines read the page (name, genre, price 0, platform). Treat it as tidy-up, not a traffic lever. Never add fake `aggregateRating`. |
| Sitemaps | Max 50,000 URLs or 50 MB per file. Google uses `lastmod` only if it is consistently and verifiably accurate; ignores `priority` and `changefreq`. A sitemap is a hint, not a guarantee. Reference it in robots.txt or submit in Search Console. [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | We have this. One flaw: three entries use the build date as `lastmod` (see audit). |
| Canonical | Use `rel=canonical` in `<head>`, absolute URLs, self-referential on the canonical page. Sitemap inclusion is a weak signal. Redirects are the strongest. It is a strong preference, not a guarantee. [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | Done correctly on every page. |
| JavaScript | Googlebot renders JS with headless Chromium after a queue wait. "If the content isn't visible in the rendered HTML, Google won't be able to index it." Links must be `<a href>`. Page does not mention canvas. [JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Our text is in plain HTML, not in the canvas. Good. Anything drawn only on the canvas or built by the game after load (like the daily puzzle) is invisible to search. |
| Core Web Vitals | Targets: LCP 2.5 s, INP 200 ms, CLS 0.1. Google says it "highly recommends" good scores, aligned with what its ranking systems reward; it does not call them a direct factor. [CWV](https://developers.google.com/search/docs/appearance/core-web-vitals) | Pages are light (see audit). Check once with Lighthouse and the Search Console CWV report later. Low risk. |
| AI Overviews / AI Mode | No extra requirements. No special schema. "You don't need" llms.txt or AI text files. Standard SEO, allow crawling, internal links, text content, verify in Search Console. AI traffic shows in the Performance report as "Web". [AI features](https://developers.google.com/search/docs/appearance/ai-features) | Nothing special to do for Google. |

## 1.3 Per-day archive pages (e.g. /rungs/2026-11-26/)

**Source says:** see the spam-policy rows above (scaled content, doorway). Google does not mention puzzle archives specifically.

**Our view: do not build them.**
- Each page would be the same template with a different seed. The text on it would be the same "how to play" copy. That is thin and near-duplicate.
- The puzzle itself is drawn by JS on a canvas, so a crawler sees none of it.
- Pages made "closer to search results than a browsable hierarchy" is the doorway definition. A date list is exactly that shape.
- A public page per day also publishes answers, which hurts the daily habit and the "you beat N%" idea.
- Cost is real (build time, sitemap size, crawl budget spread over 3,000+ near-copies after a year) and benefit is near zero.
- **What does work instead:** the games already have a 14-day archive inside the game. That is for players, not search. Keep it there. If we want freshness for search, the `/whats-new/` page and RSS already provide honest, dated content.
- Possible exception later: a handful of evergreen pages with real value, such as "How a word ladder works with an example" or a "Lookout: techniques" guide. Write each by hand with real examples. Not generated.

## 1.4 Crawlable text on JS and canvas games

**Source says:** content must be in rendered HTML to be indexed (JS SEO basics, above). Not all bots run JS, so plain HTML is the safe default.

**Our view:** we already do the main thing: a "How to play" card, a "Controls" card and an "About" card in static HTML on each game page (about 260 to 320 words; Odd One Out about 180). Add, per game, in plain HTML:
1. A one-sentence "What it is" line that includes the genre words ("Rungs is a free daily word ladder puzzle in your browser").
2. "Tips" (3 to 5 real tips, e.g. Lookout deductions, Rungs: change vowels first).
3. "Daily puzzle" box: what resets, when (time zone), how streaks work.
4. A short FAQ (free? sign-up? works on phone? saves progress where?). Matches visible text, so it is honest.
5. "Related games" links (2 or 3 siblings, with descriptive anchors).
6. A `<noscript>` line ("This game needs JavaScript") so no-JS visitors and bots get a clear message.
7. Changelog link per game (`/whats-new/` anchored to the game) as an evergreen "this game is alive" signal.
Keep text honest and written for people. Don't stuff keywords.

## 1.5 Bing, IndexNow, Search Console, Bing Webmaster Tools

**Source says**
- **Google Search Console:** six ways to verify. The DNS (domain name provider) method is the only way to verify a **Domain property**, which covers all subdomains and both http and https. Leave the DNS record in place after verifying. Verifying a subdomain does not verify the parent. HTML tag method puts a meta tag on the homepage; HTML file method uploads a file to the site root. [Verify your site](https://support.google.com/webmasters/answer/9008080)
- **Bing Webmaster Tools:** lets you import a site already verified in Google Search Console (My Sites, Import). The import also brings in sitemaps but not Search Console data. Bing re-checks ownership by syncing with your Google account. [Bing blog, 2019](https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools). I could not load Bing's own help pages (they returned no text), so the steps come from this post and press coverage.
- **IndexNow:** a protocol to tell search engines about added, updated or deleted URLs. You host a key file (a `.txt` with the key) at the site root and send a GET or a POST of up to 10,000 URLs. Participating engines per its FAQ: Bing, Yandex, Naver, Seznam.cz, Yep. **Google is not listed.** The FAQ says Cloudflare offers native IndexNow integration. [Documentation](https://www.indexnow.org/documentation), [FAQ](https://www.indexnow.org/faq)

**Our view**
- Both tools are free and tracker-free for visitors. Verification adds one DNS TXT record or one meta tag. It tracks nothing on our pages.
- Verify **one Domain property for oddvale.com** (covers games.oddvale.com and the brand site) via a TXT record in Cloudflare DNS. That is an owner step (login, DNS change). Then submit `https://games.oddvale.com/sitemap.xml` and use URL Inspection on the hub and each game once.
- Then import into Bing in a couple of clicks. Bing matters more than its share suggests: it is said to feed DuckDuckGo and some AI assistants (**not verified by a source I read this session**; treat as common knowledge to check).
- IndexNow is a small win for us: after each deploy, ping Bing with changed URLs. It needs a key file in `site/` and a few lines in the deploy script. The 9 games change often (every release), so freshness helps. It sends only URLs to a search engine, no personal data. Cheap, optional, do after Bing is verified. Whether the Cloudflare integration works for Pages sites I could not confirm.
- Google does not use IndexNow. For Google, a sitemap plus Search Console is the route. "Request indexing" in URL Inspection is a manual option for a few pages.

## 1.6 Backlinks that fit

**Our view (no primary source; backlinks are the standard SEO lever, and the 2026-11-26 marketing report has the channel details)**
Ranked by fit for a tiny, no-ads site:
1. **oddvale.com** (the brand site) already links to games.oddvale.com (I saw the link on its homepage). Make it a few links with descriptive anchors ("Oddvale daily puzzle games"), and add a page per featured game if oddvale.com has room. Owner controls that site.
2. **The 9 GitHub repos** under JohnGarrisonDev: set each repo's website field to its game URL, and put the live link at the top of each README with the game's one-line description. Free, relevant, and Google follows them. Setting the repo field is a repo setting change, so ask the owner first.
3. **Daily-game directories and lists** (Thinky Games, the GitHub "dles" list, other "daily games" lists): the 2026-11-26 marketing report lists them. Submission is a public post, so owner only.
4. **"Best daily puzzle games / Wordle alternatives" articles:** a polite short email to a few small bloggers with a link and the one hook. Owner decision. Expect a low reply rate.
5. **Show HN / Reddit / short video:** the spikes in the marketing report also give links, but most of those are nofollow. Their SEO value is indirect (people who then write about it).
6. **itch.io, Newgrounds, CrazyGames Basic Launch:** pages on those sites usually link back. See the marketing report for AI-disclosure and ad rules.
**Avoid:** buying links, link swaps in bulk, directory spam, comment spam. Google's spam policies cover these.

## 1.7 AI search and answer engines

**Source says**
- Google: no special markup, no llms.txt, standard SEO (above).
- Mueller (June 2025): no AI system uses llms.txt, and server logs show chatbots fetch normal pages but not llms.txt. Later he said it could make sense to noindex it. One developer's logs show OpenAI fetching one (anecdote). I did not find a current confirmed list of AI products that read it. [Search Engine Roundtable](https://www.seroundtable.com/google-ai-llms-txt-39607.html), [Search Engine Journal summary via search](https://www.searchenginejournal.com/llms-txt-no-major-ai-systems-use-them/544804/)

**Our view**
- Being cited by assistants mostly follows being a clear, crawlable, linked-to page that says what the thing is. Same work as normal SEO plus one more thing: being named in other places (lists, repos, forum threads). Assistants often draw on those.
- Do not block AI search crawlers in robots.txt (ours allows all). Whether to block AI training crawlers is a brand choice for the owner; nothing in this report depends on it.
- **llms.txt:** a 15-minute job (a short markdown list of the nine games and what they are). Expected value low. Fine as an optional last item; if added, keep it accurate. I would not spend more time on it.
- Keep factual claims on pages true and current (version, daily time zone, free). Assistants repeat what pages say.

## 1.8 Worth doing vs. noise (for a tiny site)

| Worth it | Noise or risky |
|---|---|
| Search Console and Bing verification, sitemap submitted | Paid SEO tools, keyword-volume subscriptions |
| Descriptive titles and one-line "what it is" on each game | Stuffing "Wordle alternative" into every page |
| Real links from oddvale.com, GitHub repos, 2 or 3 directories | Link buying, bulk submissions |
| Plain-HTML how-to-play, tips, FAQ, related-game links | Per-day archive pages, "answer today" pages |
| 1200x630 share images so shares look right | Chasing "unblocked", "free games for school" terms |
| Light pages, valid sitemap, honest lastmod | Fake ratings or review markup |
| Optional IndexNow ping to Bing | llms.txt as a strategy |

---

# Part 2. Audit of our own site (read-only)

**What I checked:** live `https://games.oddvale.com/`, `/robots.txt`, `/sitemap.xml`, `/rungs/`, `/rungs/cover.webp`, `/og-image.png`, `/nope`, `/llms.txt`, `http://` and `/index.html` redirects; `dist/` (already built, no rebuild needed); `scripts/build.mjs`; `site/` files; each game's `index.html` in the sibling folders. The live sitemap is identical to `dist/sitemap.xml`.

## 2.1 What is already right
- `<html lang="en">`, viewport, a unique `<title>` and a unique description on every page.
- Absolute self-canonical on the hub, `/whats-new/`, `/privacy/` and all nine games.
- Hub and games have `og:title`, `og:description`, `og:url`, `og:image`; hub also has width, height and alt for its image and `twitter:card`.
- Hub has JSON-LD (WebSite plus an ItemList of nine VideoGame items with genre, version, free offer, image).
- Headings: one H1 per page, then H2s ("How to play", "Controls", "Made by AI, in the open").
- Real text per game, not only canvas: about 260 to 320 words (Odd One Out about 180). The canvas has an `aria-label`.
- robots.txt: `Allow: /` plus the sitemap line. Sitemap lists 12 URLs.
- No `noindex` on real pages; `/nope` returns 404 with `noindex`. `http://` gives 301 to https; `/index.html` gives 308 to `/`.
- No blocking headers: the CSP (`default-src 'self'`) and `X-Frame-Options: DENY` do not stop crawlers. They would stop other sites embedding our games, which is fine.
- Light pages: hub HTML 42 KB, CSS 14 KB, JS 1.5 KB; hero image 282 KB; below-the-fold card images lazy-loaded (6 of 9 have `loading="lazy"`). A game page is about 7 KB of HTML; whole game folders are 0.7 to 1.2 MB with all code and art.
- Hub links to every game with descriptive card text. `/whats-new/` is a crawlable, dated changelog with an RSS feed (`feed.xml` linked from the hub).
- oddvale.com links to games.oddvale.com.

## 2.2 Findings

Effort: S = under an hour of agent time, M = a session, L = more. Impact is for search and share quality, our view.

| Page | Issue | Fix | Effort | Impact |
|---|---|---|---|---|
| Whole domain | Not verified in Google Search Console or Bing Webmaster Tools (I cannot see this; no way to confirm either way, but nothing in the site shows a verification tag and the owner brief says it is an owner step). | Owner verifies a Domain property via a DNS TXT record in Cloudflare, submits the sitemap, imports to Bing. | S (owner) | **High** |
| All 9 game pages | Title is "Name — Oddvale Games" (31 to 37 chars). It does not say what the game is, so it cannot match "daily word ladder puzzle" style searches. | Title format "Rungs: Free Daily Word Ladder Puzzle | Oddvale Games" (aim 50 to 60 chars). Needs a new `game.json` field (e.g. `seoTitle`) in each game; or the hub build rewrites the title from `genre` and `tagline`. | S to M | **High** |
| Hub `/` | Title "Oddvale Games — browser games made by AI" and H1 "Games made by AI. Played by you." have no topic words such as "daily puzzle games". | Title like "Oddvale Games: Free Daily Puzzle and Word Games in Your Browser". Add "daily puzzle" to the lede. Keep the brand tone. | S | Medium |
| Game pages | No links between games. Only "More games" (to the hub) and oddvale.com. | Add a "Try next" block with 2 or 3 related games with descriptive anchors. Best done once in `scripts/build.mjs` when copying each game (post-process `dist/<slug>/index.html`), so no change to nine repos. | M | Medium |
| Game pages | No structured data. | Add per-game JSON-LD: `["WebApplication","VideoGame"]` co-typed, name, url, description, genre, image, `offers` price 0, `isAccessibleForFree`, `isPartOf` the WebSite, plus `BreadcrumbList` (Home > Game). No ratings. Generate in build.mjs from `game.json`. | S | Low (no rich result; tidy and machine-readable) |
| Game pages | Share image is `cover.webp` at 1536x1024 (3:2, 175 to 440 KB). Large; some platforms crop 3:2 to 1.91:1; WebP support in some share scrapers (Facebook, LinkedIn, some chat apps) is not verified by me. No `og:image:width/height/alt`, no `og:site_name`, no `twitter:title/description/image`. | Build a 1200x630 PNG or JPG per game at build time (the hub already has `og-image.png` 1200x630) and add the missing tags. Test with each platform's card debugger (owner or browser). | M | Medium (for shares and link clicks) |
| Game pages | No `<noscript>` message. A no-JS visitor or text bot sees a blank stage. | One `<noscript>` line inside the stage. | S | Low |
| Game pages | Crawlable text is only How to play, Controls, About. No tips, no daily-puzzle explainer, no FAQ. Odd One Out is thinnest (about 180 words). | Add 100 to 150 words per game: "What it is" first line with genre, Tips, Daily/reset time, 3 FAQ items. Honest, hand-written. Lives in each game repo's `index.html` (other agents are editing these; coordinate). | M | Medium |
| Game pages | Descriptions: Star Post 206, Odd One Out 203, Wonky Putt 212, Lookout 180 chars. Google usually shows about 150 to 160 chars on desktop and less on phones, and may rewrite the rest. | Trim to about 150 to 160, start with the hook. | S | Low |
| Game pages | Hub `description` in JSON-LD is the long blurb; fine. The meta description and the blurb differ; fine. | None. | n/a | n/a |
| `sitemap.xml` | Hub, `/whats-new/` and `/privacy/` get `lastmod` = build date (`scripts/build.mjs` line 149) even if unchanged. Google uses `lastmod` only when it is verifiably accurate. Game entries use `game.json` `updated`, which is good. | Use the real date: newest game update for hub and what's-new; privacy page's own edit date. Or drop `lastmod` on those three. | S | Low |
| `robots.txt` | Fine. No AI-crawler rules. | Leave as is unless the owner decides on training crawlers. | n/a | n/a |
| `/privacy/`, `/whats-new/` | No Open Graph tags. | Add `og:title`, `og:description`, `og:image` (hub image). Template-level change. | S | Low |
| Hub | No About page. Google's "who, how, why" advice favours one clear place that says who runs the site and how AI is used. Content is spread over the hub, game cards and `oddvale.com`. | Add `/about/`: who (Oddvale, the owner), how (AI agents, public repos, what is hand-checked), why (small free games, no ads), link to repos. Link from the footer and the sitemap. | M | Medium (trust, backlink target) |
| Hub | Daily puzzles are listed (only in the "Fresh today" box and card badges) but there is no single stable page about the daily puzzle idea ("8 free daily puzzles"). | Optional `/daily/` page: one paragraph per daily game, how it resets, link to each. Hand-written; a browsable hub, not a funnel. Also a good link target. | M | Medium |
| `feed.xml` | Item text is cut mid-sentence at about 500 characters (e.g. "(Android, wh"). Not an SEO issue, a quality one. | Cut at a sentence or bullet, or link to the full entry. | S | Low |
| Game folders in `dist/` | Each game's `src/*.js`, `game.json`, `LICENSE` and data are publicly served. Not harmful. `game.json` and JS files can be crawled but are not HTML. | None needed. Optional: `X-Robots-Tag: noindex` for `*.json` via `_headers` if they ever show in search. | S | Low |
| Hreflang | Single English site. | Not needed. | n/a | n/a |
| Domain variants | I did not check whether a `*.pages.dev` address serves the same pages (unverified). Canonicals already point to games.oddvale.com. | If it exists, add a redirect to the custom domain. | S | Low |
| Page speed | Pages are light. I did not run Lighthouse or measure LCP, INP or CLS. | Run Lighthouse on hub and two game pages (local); read Search Console's CWV report once data exists. | S | Low |
| Image alt text | Hub card images have good alt text. Hero has alt. Game `index.html` has no content images beyond the canvas (cover only in `og:image`). | None. | n/a | n/a |

## 2.3 Not audited
Search Console and Bing data (no access), actual index status (cannot see without verification; a `site:` search was not run), real-device speed, how share cards render on each platform, whether the 404 page links back sensibly (not read in detail), content on oddvale.com beyond the link.

---

# Part 3. Top 10 SEO changes, ranked

Legend: **STUDIO** = agents can do it in code. **OWNER** = needs the owner (account, DNS, public post, or a decision).

| # | Change | Who | Where | Why it ranks here |
|---|---|---|---|---|
| 1 | Verify a Domain property in Google Search Console for oddvale.com using a TXT record in Cloudflare DNS. Submit `https://games.oddvale.com/sitemap.xml`. Use URL Inspection on the hub and each game. | **OWNER** | Search Console, Cloudflare DNS | Without it we cannot see indexing, queries or errors. About 15 minutes. |
| 2 | Add the site to Bing Webmaster Tools by importing from Search Console. Submit the sitemap. | **OWNER** | Bing Webmaster Tools | Two clicks after step 1. Covers Bing and engines that use it (not verified). |
| 3 | Rewrite game page titles and the hub title to say what each is ("Rungs: Free Daily Word Ladder Puzzle \| Oddvale Games"). | **STUDIO** | A new `seoTitle` field in each `game.json` (or derive from `genre`), used by each game's `<title>`/`og:title`; hub title in `site/index.template.html` | Cheapest on-page win. The title is the strongest on-page signal and the search result headline. |
| 4 | Add more crawlable text per game: first-line "what it is", tips, daily/reset explainer, 3-item FAQ, `<noscript>` line. Hand-written and true. | **STUDIO** | Each game's `index.html` (coordinate with the agents editing them) | Gives each page something to match long-tail queries; fixes the thin Odd One Out. |
| 5 | Get real backlinks: set each GitHub repo's website field and README top line to the game URL; add descriptive links from oddvale.com; submit to 2 or 3 daily-game directories (see the marketing report). | **OWNER** (repo settings, oddvale.com, directory posts). **STUDIO** can draft the text. | GitHub, oddvale.com, directories | Links are what a new site lacks most. |
| 6 | Add a "Try next" related-games block to every game page, inserted once at build time. | **STUDIO** | `scripts/build.mjs` (post-process copied `index.html`), small CSS in `site/hub.css` or the kit | Spreads crawl and gives readers a next step; one change instead of nine. |
| 7 | Fix share cards: 1200x630 PNG or JPG per game, add `og:site_name`, `og:image:width/height/alt`, `twitter:title/description/image`. | **STUDIO** (code); **OWNER** or a browser pane to check cards on real platforms | `scripts/build.mjs` image step plus a template for the head tags; art in each game or `site/art` | Better looking shares lead to more clicks and links from posts in #5. |
| 8 | Add `/about/` (who, how AI is used, why, links to repos) and an optional `/daily/` overview. Link from the footer and add to the sitemap. | **STUDIO** (write and build); **OWNER** approves wording of the AI statement | New files in `site/pages/`, `scripts/pages.mjs`, sitemap list in `scripts/build.mjs` | Matches Google's who/how/why advice; a stable link target and a home for "daily puzzle games" wording. |
| 9 | Per-game JSON-LD (WebApplication plus VideoGame, free, no ratings) with BreadcrumbList; fix sitemap `lastmod` for hub, what's-new and privacy; trim long descriptions to about 160 chars; add OG tags to privacy and what's-new. | **STUDIO** | `scripts/build.mjs` (JSON-LD and sitemap, line 110 and 149), `site/pages/*`, `game.json` descriptions | Small tidy-ups. No rich result expected; avoids lying `lastmod`. |
| 10 | Optional: IndexNow ping to Bing after each deploy (key file in `site/`, a few lines in the deploy script), and a short accurate `/llms.txt`. | **STUDIO** for both; **OWNER** only to approve the outbound call | `site/` key file, deploy script; `site/llms.txt` | Low value. IndexNow speeds up Bing; llms.txt is unproven (no AI system known to use it per Mueller 2025). Do last. |

**Explicitly not recommended:** per-day archive pages; "unblocked" or "answer today" pages; fake ratings or review markup; generated lists of near-identical pages; keyword stuffing; any analytics script, cookie or ad tag (Cloudflare edge analytics and Search Console are enough).

**Fits the promise:** every item above uses static files, first-party text or tools that watch the site from outside (Search Console, Bing). None adds a tracker, cookie, account or ad to a visitor's page.

## What I could not verify
- Search volumes and competition for any keyword (no tool; web results gave none).
- Whether the domain is already verified in Search Console or Bing, or how many pages are indexed.
- Bing's own help text (page loaded blank). Bing import steps come from Bing's 2019 blog post and press coverage. Whether Bing data feeds DuckDuckGo and AI assistants was not checked against a source.
- Whether Cloudflare's IndexNow integration works for Pages sites.
- Whether Facebook, LinkedIn or others fail to render `og:image` in WebP. I flagged it as a risk, not a fact.
- Whether a `*.pages.dev` copy of the site is publicly served.
- Core Web Vitals (no field data; no Lighthouse run). Real-device speed.
- Some Google pages carry no last-updated date; I record read date only. Google pages were summarised by a fetch tool, so exact wording may differ.
- Contents of `oddvale.com` beyond seeing that it links to games.oddvale.com.

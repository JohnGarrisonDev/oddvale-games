# Research: getting and keeping players, and optional sign-in (2026-11-26)

**Role:** Market researcher. **Read date for every link below: 2026-11-26** unless another date is given. Prices are "as of 2026-11-26".
**Method:** web search and page fetches of official pages. Nothing was posted, downloaded, signed up for or changed. No code was touched.
**Labels:** **Source says** = what the page states. **Our view** = my judgment.

## Summary (10 lines)
1. Best realistic marketing is a few well-timed, honest launch posts plus a share loop that is a link. Not constant posting.
2. Our share text should always include the game's URL. The result grid is the main growth loop (Wordle's grid was player-invented first).
3. Strongest free channels: Show HN (one per notable game), r/WebGames-type subs (rules unverified), puzzle directories (Thinky Games, the dles list), and short video of the physics games.
4. Big portals (Poki, CrazyGames full launch) need ads or exclusivity. That clashes with "no ads". CrazyGames "Basic Launch" has no ads, so it may fit. Check before applying.
5. "Made by AI, in the open" is a real hook on HN and GitHub, a real risk on art/itch communities. Players split on AI, but disclosure has a measured sales cost on Steam. Be upfront, lead with the games.
6. Email/RSS: RSS (already planned) is free and tracker-free. Email is possible without trackers but needs a consent step and a sender. Start with RSS only.
7. "SSO" = optional sign-in. For a no-cookie arcade, the cheapest honest path is the **transfer code first**, then, only if players ask, passkeys plus email code on our own Worker and D1, with one first-party session cookie.
8. Hosted providers are cheap or free at 1k and 10k users, but their sign-in pages run on their domain (or cost about $99/month for ours). Social logins add cost and review work (Apple $99/year; Google brand verification).
9. Legal: accounts 13+ only is the sane line. COPPA applies if we learn a user is under 13. UK/EU age of consent for data processing is 13 to 16 depending on country.
10. Owner decisions needed are listed at the end of each part. Nothing here is legal advice.

---

# Part 1. Marketing

## 1.1 What the evidence says about growth for small daily games

| Example | What happened | Source |
|---|---|---|
| Wordle | Source says: 90 players on 2021-11-01, over 300,000 by 2022-01-02 (figures are estimates). Players shared results on their own before a share button existed. | [Wikipedia: Wordle](https://en.wikipedia.org/wiki/Wordle); [The Hustle, 2022-01-06](https://thehustle.co/01062022-Wordle/amp/). Prior report cites the share button added 2021-12-16 ([The Spinoff, 2022-01-13](https://thespinoff.co.nz/media/13-01-2022/those-coloured-boxes-on-twitter-are-new-zealands-fault)). |
| Rogule (daily roguelike) | About 2,000 players a day after a Hacker News front page (developer's own account). | [Indie Hackers](https://www.indiehackers.com/post/2000-people-per-day-are-playing-rogule-cf104c6362) (cited in the 2026-11-24 report) |
| Mathler | Launched from one HN post. | [hey.gg](https://www.hey.gg/blog/mathler) (cited in the 2026-11-24 report) |
| Clues by Sam | Launched May 2025; developer says it passed 50,000 daily players by early 2026, mostly by word of mouth. | [Wikipedia](https://en.wikipedia.org/wiki/Clues_By_Sam); [Aftermath, 2025-07-29](https://aftermath.site/clues-by-sam-wordle-daily-puzzle-game) |
| Quiet launches | A studio that launched quietly "barely" got anyone; a Show HN from a new account was restricted. | [Indie Hackers](https://www.indiehackers.com/post/we-built-a-multiplayer-game-launched-it-quietly-and-barely-anyone-came-now-were-learning-distribution-from-scratch-6d51341527) |

**Our view:** every success above had one spike (a post, a share grid, a newsletter) and a habit loop behind it. The 2026-11-24 report found the same. I did not re-verify the player counts; they are self-reported.

## 1.2 Channel table

Fit with the promise "no ads, no accounts, no cookies, no trackers": **Yes** means no change needed.

| Channel | Effort | Cost | Expected payoff (our view) | Risks | Fits promise? | Owner needed? |
|---|---|---|---|---|---|---|
| **Show HN** | Low (one post, then answer comments for hours) | $0 | Highest single-spike upside (Rogule, Mathler). Most posts do little. | New accounts can be limited. "Quickly generated one-off projects" do not count. Don't ask friends to upvote. | Yes | **Yes** (posting publicly, an HN account) |
| **Reddit game/puzzle subs** | Medium (read rules, be a member first, reply to comments) | $0 | Waffle started from a Reddit link (prior report). Medium. | Self-promo rules differ per sub. **I could not read any sub's rules** (Reddit blocked fetches). | Yes | **Yes** |
| **itch.io page** | Low-medium (page, cover, tags) | $0 (itch takes an optional revenue share on paid projects; not relevant for free games, not verified) | Low-medium. Browser games play inline. Daily games fit awkwardly. | AI disclosure field (see 1.4). Anti-AI users. | Yes | **Yes** (account, public page) |
| **CrazyGames** | Medium (build the SDK in, QA) | $0 | Potentially large audience, uncertain. | Full Launch requires SDK ads and must work with AdBlock. Basic Launch requires no ads. That affects the promise. Their AI policy was not on the page I read. | Basic Launch: probably. Full Launch: **No** | **Yes** |
| **Poki** | High | $0 | Large audience, uncertain. | Source says Poki asks **web exclusivity** (no other web portals). 50/50 revenue split on users Poki sends. Ads imply ads in the game. | **No** (ads, exclusivity) | **Yes** (and brand decision) |
| **Newgrounds** | Medium | $0 | Small-medium; arcade audience. | Their art rules and AI stance were not readable (page returned 403); secondary sources say AI art was disallowed in 2022 and AI reporting added in 2024. Unverified for games. | Yes | **Yes** |
| **Game jams** | High (needs a new game on a theme) | $0 | Low for an existing arcade. | Time sink. | Yes | Yes |
| **Product Hunt** | Medium | $0 | Low for a free game. Its focus is on digital products and services; games are not their core. | Rules for AI products not found. Paying for hunters/traffic is discouraged by them. | Yes | **Yes** |
| **Discord** | Medium, ongoing | $0 | Low early, slow growth. | Moderation duty; children may join. | Yes (but Discord has its own tracking) | **Yes** (creating an account/server) |
| **Daily-game directories** (Thinky Games, the GitHub "dles" list of 500+ dailies) | Low | $0 | Small, steady, targeted at people who already play dailies. | Thinky's site blocked my fetch; submission route unverified. | Yes | **Yes** (submission is a public post) |
| **Puzzle newsletters / bloggers** | Medium (pitching) | $0 | Medium. One web game grew after the b3ta newsletter (prior report). | Low reply rate. | Yes | **Yes** |
| **Short video (TikTok/Shorts/Reels)** | Medium-high; needs recording and editing | $0 | Physics games (Star Post, Rickety, Wonky Putt) watch well. Uncertain. | Platform tracking on the viewer's side, not ours. Account needed. | Yes for our site | **Yes** |
| **Own SEO** | Low | $0 | Slow. Earns first visits, habit does the rest (prior report). | Daily game pages are thin content. | Yes | No |
| **RSS "What's new"** | Low (already planned) | $0 | Small; keeps existing fans. | Few people use RSS. | Yes | No (feed itself) |
| **Email reminders** | Medium | $0-20/month | Reminders help habit. | Needs address collection (a form; plan.md "ask first"), consent, unsubscribe, a sender. | Only if done without open/click tracking | **Yes** |

Where the facts come from:
- Show HN rules: [news.ycombinator.com/showhn.html](https://news.ycombinator.com/showhn.html). Source says: non-trivial projects you built, ready to try; not "quickly generated one-off projects"; don't ask friends to upvote; avoid forcing sign-ups; games are not mentioned by name.
- HN new-account limit: a secondary source (a [DEV Community post](https://dev.to/madsendev/i-built-something-good-with-ai-now-some-developer-communities-dont-want-to-see-it-20mo) and an HN mirror of moderator dang's comments, [hn.svelte.dev](https://hn.svelte.dev/item/47050421)) says HN restricts Show HN from newer accounts and asks generated projects to show effort. **Not verified against HN's own text.** Our view: a brand-new HN account is a risk; the owner should use an account with some history, or accept a slower start.
- CrazyGames: [docs.crazygames.com/requirements/intro](https://docs.crazygames.com/requirements/intro/). Basic Launch needs monetization disabled; Full Launch needs SDK ads and AdBlock-safe play. Revenue share percentage and AI policy not on that page.
- Poki: [developers.poki.com/guide/working-with-poki](https://developers.poki.com/guide/working-with-poki). 100% to developer for direct users, 50/50 for users Poki sends, web exclusivity required.
- Product Hunt: [featuring guidelines](https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines) (read through a search result; page text not fetched).
- Reddit: only generic guides were readable ([prowlo](https://prowlo.com/blog/reddit-self-promotion-rules), [gamosy](https://gamosy.com/blog/reddit-game-marketing)). They say each sub's own rule decides. **I did not verify rules for r/WebGames, r/puzzles, r/WordGames or any "dailygames" sub.** The owner or a later agent must read each sub's Rules page before posting.

## 1.3 Share loops (cheap, and our best lever)
- **Source says** (2026-11-24 report): spoiler-free grid shares were central to Wordle; each copied result should include the date and URL.
- **Our view, in order of value:**
  1. Every "Copy result" ends with the game's URL (already an arcade convention per the 2026-11-24 report).
  2. Each game has an Open Graph card (`cover.webp` exists). Check each game's `og:image`, `og:title` and `og:description` render in chat apps. Effort: one agent session. $0. No tracker.
  3. Per-day share URLs (`/lookout/?d=2026-12-01`) so a shared link opens that day's puzzle. This also helps friends compare. Needs care: the "you beat N%" feature already has a date window (plan.md).
  4. A "challenge a friend" line: same puzzle, same day. No account needed.
- Risk: clipboard "Copy result" is unconfirmed on real devices (games.md). Fix before promoting.

## 1.4 "Made by AI, in the open": help or hurt?

**Source says**
- itch.io: asks creators to tag generative AI use via an AI Disclosure section; strictly enforced for assets, soundtracks, books and similar; undisclosed pages may be delisted; self-contained algorithms (procedural generation, pathfinding) don't need disclosure; mass-produced AI pages may be treated as spam. [itch.io quality guidelines](https://itch.io/docs/creators/quality-guidelines). Press says the tag set has sub-tags for AI graphics, sound, text and code, and a "No AI" tag exists ([PC Gamer](https://pcgamer.com/software/platforms/indie-distribution-platform-itch-io-now-requires-asset-creators-to-disclose-the-use-of-generative-ai-in-their-work), [Creative Bloq](https://www.creativebloq.com/3d/video-game-design/itch-ios-no-ai-tag-is-a-positive-step-in-the-battle-against-ai-slop)). Reports differ on whether games (not only assets) must disclose; assume yes.
- Steam: a Content Survey has a Generative AI section; pre-generated content that ships must be disclosed. [Steamworks](https://partner.steamgames.com/doc/gettingstarted/contentsurvey). (Steam is not a channel for us; it shows the norm.)
- HN: AI-generated comments are not allowed; Show HN wants effort and discussable work (secondary sources, see above).
- Newgrounds: secondary sources only (AI art disallowed 2022, AI-report tool 2024). Current text not read.
- Players: a July 2026 survey of about 3,800 Steam players reported 43% fine with AI and 8% refusing any game with AI ([GamesRadar](https://www.gamesradar.com/games/survey-finds-only-31-percent-of-steam-users-have-a-problem-with-ai-in-games-with-43-percent-totally-fine-with-it/); search summary of the same survey, [GameDiscoverCo via search](https://www.pcguide.com/news/pc-gamers-remain-skeptical-of-steams-ai-disclaimers-poll-shows-many-believe-game-devs-are-hiding-it/)). The survey skews towards engaged players. Another analysis claims Steam games with a disclosure get about 52.6% fewer reviews ([Digital Citizen](https://www.digitalcitizen.life/steam-games-that-disclose-ai-use-may-sell-far-less-new-study-finds/)); I did not check its method. A GDC survey: 52% of professionals say generative AI hurts the industry ([TechBuzz](https://techbuzz.ai/articles/ai-in-game-development-why-the-2026-backlash-is-real)).

**Our view**
- On HN and GitHub-style audiences, "AI team builds games in public repos" is a hook, but only if the games are good and the post says how it was done (honest, specific).
- On art and indie-game communities (itch.io browse, Newgrounds, many art subs) expect friction. Tag AI use accurately; never hide it. Hidden AI that is found out is worse than disclosed AI.
- Our games use procedural generators and solvers (not "generative AI" in itch's sense for the puzzles), but the code, text and art were made by AI agents, so tag them honestly.
- Don't make AI the headline for general players. Lead with the game, say "made by AI agents, in the open" on the About page and in posts to dev audiences.

## 1.5 SEO for daily games
- **Source says:** an Indie Hackers commenter put it as search earns the first visit, habit earns the return (quoted in the 2026-11-24 report). No fresh primary source read here.
- **Our view:** low effort, slow. Useful steps: one stable page per game with a clear title ("Daily word-ladder puzzle"), a short description, `sitemap.xml`, and a public archive page per past day (the games already have 14-day archives). Avoid creating thin daily pages for search only. No tracker needed; Cloudflare's own edge analytics already exists.

## 1.6 Short video for physics games
- **Our view (no primary source):** Rickety collapses, Star Post slingshots and Wonky Putt trick shots are watchable in 10 seconds. Record from the game, caption with the URL, post to YouTube Shorts / TikTok / Reels. Needs the owner's accounts and posting. Cost $0; time medium. Platforms track viewers; that does not touch our site. Start with 5 clips, measure page views the next day from `npm run analytics`.

## 1.7 Reminders without trackers
- **Own RSS feed** (already in plan.md Phase 0): free, no tracking.
- **Web push** is not recommended: it needs a service worker, a permission prompt and a subscription stored on our side.
- **Email:** possible, but you must collect addresses (a form and consent), store them, send, and honour unsubscribe. Resend's free plan: 3,000 emails/month, 100/day; open/click tracking is a per-domain setting ([Resend pricing](https://resend.com/pricing)). Buttondown: free for the first 100 subscribers ([Buttondown pricing](https://buttondown.com/pricing)); I could not confirm whether it can turn tracking off. Cloudflare Email Sending is in beta; on Free it only sends to verified addresses in your account, so arbitrary recipients need the Paid plan we plan to be on ([Cloudflare docs](https://developers.cloudflare.com/email-service/)).
- **Our view:** don't start email until a sign-in or "remind me" demand shows up in the Tell-us taps. When you do, turn off open/click tracking and say so on the privacy page.

## 1.8 Ranked first-30-days plan (for the owner to approve)

Legend: **[OWNER]** = needs the owner (public post, account, or money). **[AGENT]** = agents can do it with no new approvals (all inside our own repos and site).

| Days | Step | Cost |
|---|---|---|
| 1-5 | **[AGENT]** Fix the weak spots that hurt a first impression: confirm "Copy result" on real browsers; real-phone check of Soupspell, Lookout, Rungs (games.md). | $0 |
| 1-7 | **[AGENT]** Share loop: URL in every copied result, test Open Graph cards for all 9 games, add per-day share URLs if safe, a clear About/"made by AI in the open" page. | $0 |
| 1-7 | **[AGENT]** Draft (do not post): one Show HN text, 3 Reddit post drafts tailored to each sub's rules, 5 short-video scripts, an itch.io page text with correct AI tags. | $0 |
| 3 | **[OWNER]** Read and approve the drafts; decide the AI wording. | $0 |
| 5-10 | **[OWNER]** Read the Rules page of r/WebGames and 2-3 puzzle subs (or give an agent read-only help via a browser pane); create or use a Reddit account and comment genuinely in those subs for a week first. | $0 |
| 8-12 | **[OWNER]** Post **one** Show HN for the strongest game (suggest Overprint or Lookout, a game people can try in 10 seconds) on a weekday morning US time. Stay for the comments. | $0 |
| 10-20 | **[OWNER]** Post to one or two game subs where the rules allow it. One post per game, not a blast. | $0 |
| 10-20 | **[OWNER]** Submit to daily-game directories (Thinky Games, the dles list) once the submission route is confirmed. | $0 |
| 12-25 | **[OWNER]** Record and post 5 short videos of the physics games. | $0 |
| 15-30 | **[AGENT]** Add the transfer code and streak freeze (plan.md Phase 1) so new players can keep a streak. | $0 |
| 20-30 | **[AGENT]** Read page-view trends (`npm run analytics`) for each post's day and write a short report on which channel worked. | $0 |
| 25-30 | **[OWNER]** Decide: itch.io page (AI tags), CrazyGames Basic Launch check, newsletters. Don't apply to Poki or Full Launch portals while "no ads" is a promise. | $0 |

Budget check: no step costs money. The $5/month Workers Paid plan is already in plan.md.

## 1.9 Top 5 marketing moves
1. Make every share a link: URL in each copied result, Open Graph cards, per-day links.
2. One honest Show HN post for the best first-try game.
3. One or two carefully chosen subreddit posts after reading each sub's rules.
4. Short video clips of Rickety, Star Post and Wonky Putt.
5. Directory listings (Thinky Games, dles) plus a transfer code and streak freeze so new players keep their streak.

---

# Part 2. Optional sign-in ("SSO")

## 2.1 What we mean
"SSO" here means optional player sign-in so streaks and saves follow a person across devices. Plain "single sign-on across apps" is a later goal in plan.md (Phase 2: one Odd Account for several Oddvale apps). Games stay fully playable signed out.

## 2.2 Is a no-account transfer code enough?
- **Our view:** for most players, yes. A "Move my progress" code (plan.md Phase 1) solves "I got a new phone". It does not solve "my phone and laptop stay in sync every day". Phase 0's tap "I want my progress on all my devices" will tell us how many want live sync. plan.md already has a signal: 25+ taps a month.
- Cost: $0, no cookie, no personal data. Risk: players lose or share codes; codes can be made 1-time and short-lived to limit this. No server state needed if the code is the data (a long string) or a short code stored in D1 with a short expiry.

## 2.3 Option comparison

All prices as of 2026-11-26, from each provider's own pricing page unless marked. "At 1k / 10k users" means monthly active users.

| Option | Cost at 0 / 1k / 10k | Passkeys | Privacy (our view) | Build effort on Workers + D1 | Lock-in | Delete/export |
|---|---|---|---|---|---|---|
| **Passkey-only, own code** (SimpleWebAuthn, our Worker) | $0 / $0 / $0 beyond Workers Paid ($5/month) | Yes (core) | Best: we store a public key and an ID. First-party cookie only after sign-in. | Medium-high; we own every bug. Lost-device recovery is the hard part. | None | We build both (small) |
| **Email magic link or code only, own code** | $0 plus a sender (Cloudflare Email Sending, beta, or Resend) | No | Stores an email address. Needs a sender and DNS (SPF/DKIM). | Medium | None | We build both |
| **Better Auth** (self-hosted library) | $0 software | Yes, via the `@better-auth/passkey` plugin ([docs](https://www.better-auth.com/docs/plugins/passkey)) | Runs in our Worker; first-party session cookie; no third party | Medium. D1 works through Kysely with `kysely-d1` per Better Auth docs ([other databases](https://www.better-auth.com/docs/adapters/other-relational-databases)); a maintainer reply says D1 works, but a user hit version problems (search summary). The Installation page does not mention D1. | Low (open source, own DB) | Delete/export not found in the pages I read; likely we write them |
| **OpenAuth** (SST) | $0 software | **Not mentioned**; password and PIN code flows only ([docs](https://openauth.js.org/docs/)) | Runs on Workers; first-party | Medium. Storage is KV (not D1) per docs. In **beta**. User management is ours to write. | Low | We write |
| **Auth.js** | $0 | Not checked | Not checked | Not checked in this research | - | - |
| **Lucia** | - | - | **Deprecated March 2025**; replaced by an "auth_session" file and the Auth Book ([lucia-auth.com](https://lucia-auth.com/)). Do not adopt. Arctic/oslo not verified. | - | - | - |
| **Clerk** | Hobby: **$0 up to 50,000 monthly retained users**; Pro $25/month ($20 annual); passkeys **not on Hobby**, on Pro and Business ([pricing](https://clerk.com/pricing)). So: $0 / $0 (no passkeys) / $0. With passkeys $25 / $25 / $25. | Pro only | Hosted; not checked what cookies and requests it adds on our pages. Likely third-party requests to Clerk. | Low-medium (SDK) | High | Export/delete page not found (404) |
| **Auth0** | Free plan up to 25,000 monthly active users; one custom domain on Free (credit-card verification). B2C Essentials is $70/month for 1,000 and $700/month for 10,000 ([pricing](https://auth0.com/pricing)). So Free: $0 / $0 / $0. | Not checked | Hosted login page; custom domain helps | Low-medium | Medium-high | Not checked |
| **Supabase Auth** | Free includes 50,000 MAUs; Pro $25/month includes 100,000 MAUs, $0.00325 per MAU after. **Free projects pause after 1 week of inactivity** ([pricing](https://supabase.com/pricing)). | Not checked | Hosted project (a separate Postgres backend); brings a second database | Medium (second backend beside D1) | Medium | Not checked |
| **Firebase Auth** | Spark plan: 50K MAUs no-cost ([Firebase pricing](https://firebase.google.com/pricing)). Per-MAU price above that: not on the page. | Not checked | Google service; Google SDK and requests in the page | Medium | High (Google) | Not checked |
| **Stytch** | Consumer: **10,000 MAU free**, no hard caps; branding add-on $99 fixed ([pricing](https://www.stytch.com/pricing)). Passkey/magic link prices not on the page. | Not confirmed | Hosted | Low-medium | Medium-high | Not checked |
| **WorkOS AuthKit** | First 1 million MAU free; custom domain **$99/month** ([pricing](https://workos.com/pricing)). So $0 / $0 / $0 on its default domain; $1,188/year with our own domain. | Not mentioned on the overview page I read | Hosted UI. On the default domain the sign-in page is on WorkOS's domain. | Low (and it is plan.md's shortlist) | Medium-high | Not mentioned on the overview page |
| **Kinde** | Free: 10,500 MAUs; Pro $25/month; custom domain on all plans incl. Free ([pricing](https://kinde.com/pricing/)). $0 / $0 / $0 (10k is within the free 10,500). | Not checked | Hosted | Low-medium | Medium-high | Not checked |

Limits of the table: for most hosted providers I read only the pricing page. I did not verify their cookie behaviour, passkey support, or export/delete features except where stated. A real choice needs a second pass reading each provider's docs and data processing terms.

## 2.4 Privacy and the no-cookie promise
- **Source says:** the UK ICO treats cookies that are strictly necessary to deliver what the user asked for as exempt from consent, and the 2025 law change lists authentication and security as examples ([ICO news, 2025-09](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/09/fact-vs-fiction-ico-debunks-myths-on-storage-and-access-technologies), read through a search summary; the ICO page text itself was not fetched). A persistent "remember me" login cookie was treated differently in older guidance (secondary source).
- **Our view:**
  - A first-party session cookie set only **after the player chooses to sign in** is a strictly-necessary cookie. No consent banner needed in the UK/EU, but the promise wording must change ("No cookies unless you choose to sign in", as plan.md already says).
  - **Third-party** requests or cookies on game pages (a provider's SDK loaded on every page) would break "no trackers" in spirit, even if the provider says it does not track. Keep any provider sign-in off the game pages; only load it on a separate sign-in page, after a click.
  - Hosted sign-in on the provider's domain means the provider sees the player's email, IP and device. A custom domain (WorkOS $99/month) hides the domain, not the processing.
  - Passkey-only means the server stores a public key and no secret. Fewest personal data of any option.
  - Anything that adds Cloudflare Turnstile/Bot Fight needs checking: the Turnstile page says it processes "only data strictly necessary" but mentions a pre-clearance cookie option; I did not confirm whether the default widget sets cookies. plan.md already forbids cookie-setting Cloudflare features without approval.
- D1 data is encrypted at rest (AES-256, [Cloudflare](https://developers.cloudflare.com/d1/reference/data-security/)).

## 2.5 Social logins: Apple, Google, GitHub, Discord
- **Sign in with Apple:** requires an Apple Developer Program membership, **$99 per year** ([Apple enrolment page](https://developer.apple.com/programs/enroll/)). Individuals need legal age of majority and legal name; organisations need a D-U-N-S number and a real website. From general knowledge, not a page I could read: web use also needs a Services ID, domain verification, and a client secret (a signed token) that must be renewed at least every 6 months. Not required for web unless we choose to offer it (the App Store rule that makes it mandatory is for iOS apps; I did not verify).
- **Google sign-in:** Google says apps requesting sensitive or restricted scopes need verification, and all production apps need verified brand information and a public home page with a privacy policy on a domain we verify ([Google production readiness](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance)). The 100-user cap applies to unverified apps using sensitive/restricted scopes ([Google help, via search summary](https://support.google.com/cloud/answer/7454865)). I could not confirm that email/profile/openid alone avoid it; probably yes, but verify. Cost: $0 money, a few days to weeks of review time (unverified).
- **GitHub / Discord:** free OAuth apps (not verified against their docs in this research). GitHub fits devs, not casual players. Discord is common for gamers but Discord terms and under-13 rules were not checked.
- **Our view:** skip Apple (cost and org requirements) at launch. If we want a social login, Google first. For kids-heavy audiences, passkey plus email code avoids sharing data with big platforms.

## 2.6 Children, COPPA and GDPR basics (not legal advice)
- **COPPA (US):** **Source says** it covers general-audience sites only where the operator has "actual knowledge" it is collecting information from a child under 13, e.g. a birth date showing under 13 ([FTC guidance](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-not-just-kids-sites)). Amended rule effective 2025-06-23, with most compliance due **2026-04-22** ([Federal Register, 2025-04-22](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule); [Davis Polk](https://www.davispolk.com/insights/client-update/ftc-prioritizes-coppa-enforcement-new-compliance-obligations-take-effect)). Details of the changes I did not read.
- **GDPR (EU):** Art. 8 says consent for a child's data is valid from 16, and Member States can lower to no less than 13 ([GDPR Art. 8](https://gdpr-info.eu/art-8-gdpr/)). It applies where we rely on consent.
- **UK:** age of consent for online services is 13; services offered to under-18s that rely on consent must make reasonable efforts to check age/parental consent; a DPIA is likely needed for services offered to children ([ICO](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/what-are-the-rules-about-an-iss-and-consent/)). The Children's Code was not on the page I read.
- **Our view:**
  - Today (no accounts, no personal data) the exposure is low. Accounts change that: an email address is personal data, and children do play puzzle games.
  - "13+ only" with a simple age statement at sign-up, no collection of birth dates, and deletion of an account if we learn the user is younger is the common pattern, and what plan.md recommends. It does not remove COPPA/GDPR risk (a 12-year-old can click "I'm 13"), but it is the realistic floor.
  - An age gate that records birth dates would create more data and more duties; avoid it.
  - Update the privacy page, add terms, and have a lawyer review (plan.md budget: $1,000-2,500 once). Your country and whether you're a company set the real rules (plan.md decision 4).

## 2.7 Recommendation (fits plan.md)
1. **Now to February 2027:** do plan.md Phase 0 and Phase 1 as written. Ship the **streak freeze and the transfer code** first. They cost $0 and need no account.
2. **Use the Tell-us tap "I want my progress on all my devices" as the gate** (plan.md signal: 25+ taps a month).
3. **If the gate opens, my suggested first build is our own passkey plus email-code sign-in in the existing Cloudflare Worker with D1** using a maintained library (Better Auth is the strongest candidate I found; verify its D1 setup works with current versions in a one-day spike). No social logins at first. First-party session cookie only after sign-in. Cost: $0 beyond the $5/month Workers Paid, plus email sending (Cloudflare Email Sending beta, or Resend free: 3,000/month, 100/day). Own delete and export endpoints are small tables-only code.
   - **This is a change from plan.md**, which shortlists hosted providers (WorkOS first). Why I lean this way: hosted providers are cheap at 1k and 10k users, but the sign-in page and personal data go to a third party (or cost $99/month for a custom domain on WorkOS), passkeys on Clerk need the paid plan, and some, like Supabase on Free, pause when idle. Self-hosting trades money for security work. If the owner does not want to own security code, plan.md's hosted route is the safer one: WorkOS or Auth0 Free with a custom domain, email code only, pilot in Pullbox first as plan.md says.
   - Either way: keep sign-in on its own page, load nothing from a provider on game pages, and make signed-out play identical.
4. **Skip Apple.** Add Google later only if players ask.
5. **13+ only**, lawyer review before launch, update privacy wording to "No cookies unless you choose to sign in".

### What the owner must decide and pay
| Decision | Cost |
|---|---|
| Approve the transfer code and streak freeze (Phase 1) | $0 |
| Approve a one-day spike to compare Better Auth on Workers + D1 against a hosted provider (no live users) | $0 |
| Self-hosted vs hosted (see step 3) | $0 vs $0 to $1,188/year (WorkOS custom domain) |
| Email sender for sign-in codes | $0 on free tiers; $20/month Resend Pro past 3,000 emails/month |
| Lawyer review for accounts | $1,000-2,500 once (from plan.md, not re-verified) |
| Apple sign-in (not recommended) | $99/year, plus identity checks |
| Country and entity type (plan.md decision 4) | sets the legal answer |
| 2FA on admin accounts (plan.md "Do now") | $0 |

---

# What I could not verify
- Rules of r/WebGames, r/puzzles, r/WordGames and any dailygames-type sub: Reddit blocked fetches. Read each sub's Rules page before posting.
- Thinky Games submission route (403), Newgrounds current AI rules (403), Product Hunt AI rules (no rule found).
- HN's own text on new-account limits for Show HN (only secondary sources and mirrors).
- CrazyGames and Poki AI policies and acceptance criteria. CrazyGames revenue share percentage.
- Cookie behaviour, passkey support, export and delete features of Clerk, Auth0, Supabase, Firebase, Stytch, Kinde, WorkOS. Only pricing was verified. Firebase per-MAU price above 50K.
- Auth.js and Arctic/oslo (not researched).
- Google basic scope verification exemption; Apple's web requirements and App Store rule (general knowledge only); GitHub and Discord OAuth terms for under-13s.
- COPPA 2025 amendment details; the Children's Code; the ICO page text (search summaries only).
- Player counts for Wordle, Rogule, Waffle, Clues by Sam are the developers' or press figures, not audited.
- Whether Better Auth currently works smoothly with D1 and the passkey plugin (needs a spike).
- Not legal advice.

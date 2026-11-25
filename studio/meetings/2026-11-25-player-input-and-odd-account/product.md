# Product & community lead: position

**Angle:** what players and the owner actually get. **Date:** 2026-11-25.

## Top 3 recommendations

1. **Do Phase 0 now, with no accounts.** Add a one-tap "How was today's puzzle?" poll after each daily, then show the results to players as shared daily stats ("You beat 62% of players", "Most people found it Tricky"). This is the most valuable input we can collect, and it matches what the big daily games lean on: community difficulty, solve rates and streaks. It works with an anonymous per-day count and needs no identity at all.
2. **Do not build the Odd Account yet.** The arcade launched yesterday with zero recorded players, zero feedback issues and no analytics. A shared login across four very different products (puzzles, a comic collection tool, an AI reality show, a speedrun desktop app) gives players little today, puts friction on a "no sign-up" promise, and brings in children's-privacy duties. Revisit when a measured trigger fires (see Phase 2). Until then, offer **account-free device transfer** (an export/import code) for the "I lost my streak" problem.
3. **Order of features:** daily difficulty poll + shared stats → better feedback route (no GitHub needed) → streak freeze (local) → owner polls ("which game next?") → achievements (local) → suggest-a-game box. **Say no for now** to comments, global leaderboards with names, friends leaderboards and a newsletter. Each of those needs moderation, identity or email, and none suits a one-person studio whose players may be children.

## What successful daily puzzle sites actually do

- **Personal stats and streaks are the core.** NYT Connections added a stats screen covering "puzzles completed, perfect puzzles, win rate, streaks" ([Digital Trends](https://digitaltrends.com/gaming/nyt-connections-new-stats-feature)). LinkedIn's Queens, Pinpoint and Crossclimb are one play per day, built around streaks and streak milestones, with no prizes ([LinkedIn Help](https://www.linkedin.com/help/linkedin/answer/a6863543); [Engadget, 2024](https://www.engadget.com/linkedin-now-has-wordle-style-games-you-can-play-every-day-133035046.html)). We already have these, stored locally.
- **Community difficulty is the conversation.** The press writes about the daily as a shared event: "today's Wordle is breaking people's streaks" ([Tom's Guide, Apr 2026](https://www.tomsguide.com/gaming/todays-wordle-is-breaking-peoples-streaks-heres-why-april-27s-puzzle-is-so-hard)), "the 10 hardest Wordles of 2025", and the puzzle that "ended 5.6 million streaks" ([AOL/NYT exclusive](https://www.aol.com/exclusive-wordle-puzzle-ended-5-013624721.html)). WordleBot publishes an average guess count for each day (4.4 to 4.8 on hard days in 2026, per Tom's Guide coverage). Players want to know whether a puzzle was hard for everyone or just for them. That is the hook for our poll and stats.
- **Small indie dailies get far on medals plus aggregate stats.** Enclose Horse reports about 15,000 daily players after 78 puzzles. Each submission earns a medal against the optimum, and the team uses the "diamond rate" (share of players who hit the optimum) to tune difficulty ([Enclose Horse by the Numbers, Mar 2026](https://enclose.horse/blog/enclose-horse-by-the-numbers)). Clues by Sam reportedly passed 50,000 daily players within a year of its May 2025 launch (a player's LinkedIn post, unverified). Semrush estimates 73% of its traffic is direct, so habit is what brings people back ([Semrush, Jan 2026](https://ko.semrush.com/website/cluesbysam.com/overview); estimate). Neither needed a social layer to grow.
- **Accounts came late, as a fix for sync.** Wordle was account-free until NYT added free-account stat sync in mid-2022, and players welcomed it ([Engadget](https://www.engadget.com/wordle-stats-sync-new-york-times-170722827.html?src=rss)). The migration also cost some players their streaks ([Tom's Guide](https://www.tomsguide.com/news/wordle-disaster-some-players-lose-their-streaks-in-transfer-to-nyt)), and linking could not be undone ([ReviewGeek](https://www.reviewgeek.com/122994/wordle-stats-will-sync-across-devices-but-theres-a-catch/)). The lesson: sync is the one account feature people want, and a botched migration is the main way to anger them.
- **Streak forgiveness works.** Duolingo says a little "slack" motivates people more than rigid rules, and it now lets learners equip two Streak Freezes ([Duolingo blog](https://blog.duolingo.com/improving-the-streak)). Its learners on a 7-day streak are 2.4x more likely to come back the next day ([Duolingo](https://blog.duolingo.com/how-duolingo-streak-builds-habit)). That figure is correlational. I found no public causal number for the freeze itself.

## Feature-by-feature

Effort is an estimate for this team (S = under a day of agent work, M = a few days, L = a week or more plus ongoing care).

| Feature | Value | Needs | Abuse risk | Effort | Verdict |
|---|---|---|---|---|---|
| **"How hard was today?" poll** (after each daily) | High. Real difficulty data for 6 dailies that were tuned only by bots, and the input to shared stats | Anonymous count per game per day; one vote per device kept locally | Low. Ballot stuffing skews one day's number, not anyone's experience | S–M (needs a tiny write endpoint, which is a CSP and owner decision) | **Phase 0** |
| **Shared daily stats** ("You beat 62%", "41% solved Large") | High. The "was it just me?" payoff, and it improves the share line | Anonymous score histogram per daily | Low to medium. Fake scores can skew percentiles; cap and sanity-check against the puzzle's possible scores | M | **Phase 0** |
| **Feedback without GitHub** (short text box) | High for goal 2. Zero issues so far suggests GitHub is a wall for casual players | Anonymous free text, bot check | Medium. Spam and children typing personal info; the owner reads it, nothing is published | S–M | **Phase 0** (it is a form, so the owner must approve) |
| **Streak freeze** | Medium-high. Fewer rage-quits after one missed day | Local only | None that matters (a player can cheat their own local streak today anyway) | S per game, best done in `kit/` | **Phase 1** |
| **Owner polls** ("Which game next?") | Medium. Good for community feel and costs little, but pointless before there are players | Same anonymous counter as the difficulty poll | Low | S once the poll endpoint exists | **Phase 1** |
| **Achievements / badges** | Medium. Gives long-tail goals to the non-daily games (Odd One Out, Wonky Putt) | Local only | None | M | **Phase 1** |
| **Game star ratings / thumbs** | Low to medium. A star average on 9 games with few players is noise, and a public "2.8 stars" on a hub card hurts more than it helps | Anonymous | Medium (brigading is easy) | S | **Collect a private thumbs signal only**, on the solved card ("Fun? up/down"). Don't show it publicly. The difficulty poll does most of the job better |
| **Suggest-a-game box** | Low to medium. The feedback box can cover it with a "suggestion" option | Anonymous text | Medium | S | Merge into feedback |
| **Daily leaderboard, anonymous** ("top 10 today", no names) | Low. Shared percentiles give most of the fun without anyone being named | Anonymous | High (fake scores sit at the top in public) | M | **Don't do it.** Percentiles are enough |
| **Global / friends leaderboards with names** | Medium for a few competitive players | An account plus nicknames, so moderation of names | High: offensive names, cheating, children's data | L | Phase 3 at the earliest |
| **Comments** | Low for us. Spoilers, moderation, child safety; the share line already lets people talk on their own platforms | An account plus a moderator | High | L plus ongoing | **No** |
| **Newsletter** | Low to medium. Email is personal data. A public "what's new" page or RSS feed gives most of it | Email address | Medium (consent, unsubscribe, deliverability) | M plus ongoing | **No for now**. Use an RSS/changelog page |

## Signed-out UX, concretely

- **Difficulty poll:** on the solved card, under the share button: "How was it? Breeze · Fair · Tricky · Brutal". One tap. The card then shows "Most players: Tricky (48%)". It appears only once per daily per device (the vote is remembered locally). Failing the puzzle counts as a vote too, with the same four options.
- **Shared stats:** on the same card, one line such as "You beat 62% of today's players" or "31% cracked the Large today". The share line can gain "Tricky day 🔥". These are aggregates only, nothing about any one person.
- **Thumbs:** a small "Fun? 👍 👎" next to the poll, at most once per game per week. Private signal, never shown publicly.
- **Feedback:** the footer "Feedback" link opens a short in-page panel: a reason picker (Bug / Idea / Suggest a game / Other), a 500-character box, and a note saying "Don't include your name, email or anything personal." Send is the second tap. The GitHub link stays for people who want it.
- **Owner poll:** one card on the hub with a single question, two to four options, one tap, results shown after voting.
- **Streak freeze:** earned automatically, for example one for every 7-day streak, holding up to 2. The streak display reads "🔥 12 (1 freeze ready)". No taps needed.
- **Device transfer (instead of accounts):** Settings → "Move my progress" → shows a code or file. Paste it on the other device. No server and no identity.

All of this keeps the "no sign-up, no ads, no trackers" promise if the counters are aggregate and nothing like a cookie or a stable cross-site ID is stored. A per-device "already voted today" flag in localStorage is fine and is the same kind of storage we already use for streaks. The promise text may need one honest added line: "Polls and scores are counted anonymously." **It does need a CSP change** (`connect-src` to our own endpoint, `form-action` if a real form is used). That is an owner decision.

## The Odd Account, from a product view

**What it would give a player:** streaks and progress on every device, one login for Pullbox (which likely already has accounts; to be confirmed by engineering), a profile and nickname, badges that span apps ("Odd House viewer + arcade regular"), and later named leaderboards.

**Honest value today: low.**
- The audiences barely overlap. A puzzle player on a phone, a comic collector and a speedrunner running a Windows app are different people. Cross-app badges are fun for the owner and for perhaps a handful of players.
- The one thing players clearly want, sync, matters only once people have long streaks to lose. Nobody has a streak longer than one day yet.
- Every account is personal data, a password reset flow, a deletion request and a breach risk, run by one person. If children play, the amended COPPA Rule applies: it has been fully in force since 2026-04-22, with more disclosure duties for persistent identifiers and a required written security program ([Federal Register, 2025-04-22](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule); [BBB Programs](https://bbbprograms.org/media/insights/blog/coppa-amended)). Legal should weigh in, but this alone argues for "later".

**What would make people sign up:** fear of losing a long streak ("You're on 40 days. Keep it safe on all your devices?"), a new phone, and named leaderboards for competitive players. Ask only at those moments, never at the door.

**What would put them off:** a sign-up wall, an email requirement, a marketing opt-in, "Sign in with Google" trackers on a site that promises none, losing local progress during the merge (Wordle's mistake), and nagging.

**What must always work signed-out:** every game, every daily, the archive, streaks, stats, freezes, achievements, the poll, shared stats, the share line and feedback. An account should only ever add sync and identity features (names, cross-device). It must never be the only way to play or to keep your progress, since device transfer covers that.

## Phased roadmap

**Phase 0: listen, no accounts (Dec 2026).** Analytics token fixed (goal 1). Difficulty poll and shared stats on the 6 dailies. A no-GitHub feedback panel. CSP and promise wording updated with owner approval.
*Success:* at least 15% of daily finishers vote; at least 10 feedback messages in the first month; 2 or more difficulty fixes made from poll data; shared-stat lines appear in copied results.

**Phase 1: keep them coming back, still no accounts (Jan to Feb 2027).** Streak freeze in `kit/`, local achievements, one owner poll a month, device transfer code, a "What's new" page.
*Success:* day-7 return rate (from aggregate analytics) improves over the Phase 0 baseline; at least 200 votes per owner poll; transfer used at all (shows demand for sync).

**Phase 2: decide on accounts, with evidence (review about Mar 2027).** Build an Odd Account only if at least two of these are true: roughly 1,000 or more daily players; repeated "lost my streak / want sync" feedback or heavy transfer use; a second Oddvale app (Pullbox) is ready to share the login; a legal plan for children exists. If built, make it optional, sync-first, email or passkey only, no social sign-in trackers, safe local-to-account merge, one-tap delete.
*Success:* 5–15% of returning players opt in (estimate; no benchmark found); zero lost-progress reports; support load under an hour a week.

**Phase 3: social, only if Phase 2 succeeds.** Nicknames from a preset word list (no free text, which suits children), a friends leaderboard via share codes, cross-app badges. Still no comments.

## Risks

- **Polls without players are empty.** Show stats only once there are at least about 30 votes, and say "Not enough votes yet" otherwise.
- **Gaming the stats.** Keep them coarse, validate scores against what the puzzle allows, and never rank individuals.
- **Free-text feedback from children** may contain personal info. Warn in the UI, don't publish it, and delete it on a schedule.
- **Scope creep toward the Odd Account** because it is the exciting idea. The arcade's problem today is reach and quality, not identity.

## Open questions for the owner

1. Are you willing to add a small anonymous write endpoint and relax `connect-src` for it, with public wording like "polls and scores are counted anonymously"?
2. May the feedback panel be a real form (an "ask first" item), or should we stay on GitHub only for now?
3. What is the Odd Account for, in your mind: player sync, a brand-wide identity, or Pullbox login reuse? The answer changes when it is worth it.
4. Should public stats be per game only, or also shown on the hub ("Today's hardest: Lookout Large")?

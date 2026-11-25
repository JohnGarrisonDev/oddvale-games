# Review: player and owner advocate (Meeting 2)

**Reviewer:** Player & owner advocate · **Date:** 2026-11-25 · **Reviewing:** [plan-draft.md](plan-draft.md)

The draft is safe, cheap and honest. My concern is that it mostly answers "how do we count votes" and not "how do players feel heard and come back", and that it parks the owner's Odd Account idea instead of moving it forward at zero cost. I looked at the live site today: the hub lists 9 game cards, says "no accounts yet", and the only ways to talk to us are GitHub links. Lookout's and Overprint's pages show rules and "saved in this browser only", with nothing about today's puzzle, community or what changed. Here are the changes, most important first.

## 1. Put back a feedback route that doesn't need GitHub (Phase 0)
Product made this a Phase 0 item. The draft drops it without saying so, because of the no-free-text rule. But zero issues since launch is the clearest signal we have, and "user input" is the owner's first question. **Change:** add a fixed-choice "Tell us" panel to every game footer, sent to the same counter API: pick a reason (*Bug / Too hard / Too easy / Broke on my phone / Want more like this / I want my progress on all my devices*), then one tap to send. The game and puzzle date are attached automatically. No text, no identity. Keep the GitHub link for people who want to write. Effort: about half a session on top of the poll endpoint. The "all my devices" option also gives Phase 2 a measurable trigger (see point 4).

## 2. Make players see that their input changed something (Phase 0)
Polls feel pointless unless people see results. **Change:** add a static **"What's new" page plus an RSS/Atom feed** (`/new/`, built from each game's `CHANGELOG.md` at build time; no CSP change, $0). Give it a standing section, "**You told us**": "Tuesday's Lookout Large was voted Brutal by 61%, so we eased Tuesdays." Credit players as a group, never by name. Link it from the hub and from the result card. This is the cheapest way to deliver the owner's "feel heard" goal, and it was in Product's Phase 1 but is missing from the draft.

## 3. Add a "Today" row to the hub (Phase 0)
The hub is a list of cards. It doesn't say "here are today's puzzles, you've done 2 of 7". **Change:** add a "Today's puzzles" strip at the top of the hub. It reads each game's localStorage (same origin, so no new storage) and shows a tick per daily done, plus the community difficulty badge once a day has 30+ votes ("Lookout: Tricky"). It's local, static and phone-first, and it turns nine separate games into one daily habit. Effort: about 1 session, mostly a small `kit/` helper so each game reports "done today" the same way. Value per effort is the best on this list.

**Ranked additions by value per effort:** (1) Today row, (2) What's new + RSS with "You told us", (3) fixed-choice feedback, (4) community difficulty in the share line ("Lookout #12 · Tricky day"), (5) streak freeze moved into Phase 0 (December holidays are when streaks break; local, $0), (6) community-chosen next game (point 6), (7) an arcade-wide "Daily Trio" meta-streak (finish any 3 dailies), local, Phase 1, (8) a per-game share image (static `og:image` now; dynamic daily images later, only if shares take off).

## 4. Fix the Phase 2 triggers: separate prerequisites from demand, and make each one countable
As written, "two of four" is weaker and woollier than it looks:
- **Trigger 4 (legal plan) is a task we control, not a signal.** Waiting for it means it never happens. Make it a prerequisite and start it early (point 5).
- **Trigger 3 is arguably true today**: Pullbox has real accounts. So the gate is really "one more trigger plus paperwork".
- **Trigger 1 (1,000 daily players) can't be measured yet**, and the number is arbitrary.
- **Trigger 2 ("players repeatedly ask") has no number.**

**Change:** demand triggers, any one of which fires: (a) 500+ daily players averaged over 14 days, from Cloudflare analytics; (b) 25+ "all my devices" taps from the feedback panel in a month; (c) transfer-code exports reach 3% of weekly returning players, counted anonymously with the same counter API; (d) **the owner decides the brand needs it**. Owner intent is a legitimate trigger for the owner's own company, and the plan should say so. Prerequisites: the analytics token is fixed, the account principles are written, and the legal scope is agreed. I expect the owner will find March plus "two of four" too conservative for an idea they raised themselves.

## 5. Don't park the Odd Account: lay foundations now at near-zero cost
Deferring the *arcade sign-in* is right. Deferring *all work on the idea* under-serves the owner. **Change:** add "Phase 1b: Odd Account foundations" with these items, in order of worth:
1. **Write the Odd Account principles** (one page, owner-approved): optional forever; 13+; holds only an ID, an email or passkey and an adult flag; each app keeps its own data; one delete removes it everywhere; no shared `.oddvale.com` cookie; no ads or trackers; exportable. Worth doing now: $0, and it turns the idea into a commitment.
2. **Design the transfer code as the future sync payload.** Use a versioned JSON envelope, namespaced per app and game (`{v:1, app:"games", games:{lookout:{schema, blob, updatedAt}}}`), with the same merge rules the sync API will use. Worth doing now: it costs nothing extra and avoids a Wordle-style migration that loses streaks.
3. **Write the provider criteria** (OIDC for web, Electron and mobile; passkeys plus email codes; user export; DPA with SCC fallback; free tier that fits 100k users; custom domain optional) and keep a shortlist. Worth doing now: one agent session.
4. **Reserve `account.oddvale.com`** by recording it in the studio's DNS notes so no agent uses it for anything else. Don't publish a page there yet: a public "coming soon" is a promise, and the owner should decide when to make it.
5. **Pilot in Pullbox, not the arcade.** Pullbox already has accounts, Google sign-in, export and deletion, and an adult audience, so there's no change to the arcade's promise or exposure to children. "Continue with Oddvale" there needs 1-2 sessions on the WorkOS free tier with its default sign-in domain ($0; skip the $99/month custom domain for a pilot). **Worth doing when the owner says go, without waiting for March.** It proves the tenant, the linking and the deletion runbook on real users before the arcade ever needs them.
6. **Check Pullbox's privacy policy and deletion process now** (open question 6). It's our biggest live data exposure either way.

## 6. Make "Which game next?" a real community choice
**Change:** run the owner poll monthly with 3 pitch cards (one-line pitch plus a sketch from the ideas pipeline). Build the winner, and label it "Chosen by players, January 2027" on its hub card and in What's new. That turns a poll into a story players can point to.

## 7. Make the cost estimate a one-glance decision
The table is accurate but reads like an engineer's table. The owner will still ask: "What do I pay per year if I say yes to each line?" and "Is the $99/month necessary?" **Change:** add a decision box. Phase 0+1: **$0-60 a year**, about 1 owner hour a month. Pullbox pilot: **$0 a year** plus about 2 owner hours to create the tenant. Full Odd Account: **$0-420 a year** (Supabase) or **$1,188 a year** only if we want WorkOS on our own domain, plus **$1,000-2,500 once** for legal. Say plainly that the custom domain is optional. Say whether Phase 0's privacy page needs a lawyer (the roles imply no; state it). Say that the legal figure depends on open question 5 (country and company type).

## 8. Small consistency fixes
The brief says 6 dailies; the live hub and the plan's effort line say 7 (Overprint, Lookout, Rungs, Soupspell, Rickety, Star Post, Blinkwire). Use 7. Carry over Product's "show stats only after about 30 votes" rule. Without it, launch week shows "You beat 100% of players" from three votes.

## Keep as is
- No free text anywhere; anonymous counters; already-voted flag kept in the browser; no Turnstile at launch.
- Private thumbs, with public scores decided after a month of data.
- Poll questions as JSON in the repo; the client fails silently; no CSP change for Phase 0.
- Buy, don't build; OIDC with one session per app; never a shared `.oddvale.com` cookie; 13+; no SMS.
- The three "do now" items: privacy page, analytics token, passkey MFA on the owner's accounts.
- Local streak freeze, achievements and the transfer code instead of accounts for arcade sync.

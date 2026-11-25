# Red team review of plan-draft.md

**Reviewer:** Red team · **Meeting 2** · 2026-11-25. Sources checked today; see the end.

The direction is right. But the anti-abuse layer, as written, partly can't be built, and it does less than the draft says. Two of the privacy claims also overreach. In priority order:

## Problems and fixes

**1. The Rate Limiting binding probably isn't available to a Pages Function.** The Pages Functions bindings page (updated 2026-11-12) lists KV, Durable Objects, R2, D1, Vectorize, AI, service bindings, Queues, Hyperdrive and Analytics Engine, and says Pages supports only "a subset" of bindings. Rate limiting isn't on that list. The whole abuse design rests on this binding.
*Fix:* put the API in a small standalone Worker on the route `games.oddvale.com/api/*`. It stays same-origin, so the CSP doesn't change. It also gets the binding and a choice of fail-open or fail-closed. Or test a `ratelimits` entry in a Pages config before committing to it. Either way, prove this in the first session.

**2. Even where it works, the binding can't do what the draft needs.** Per the docs, the only periods are 10 or 60 seconds. Counting is per Cloudflare location. It is approximate and eventually consistent. Cloudflare says it "is not recommended" to key on IP addresses. So it can't express "one vote per IP per day". A script sending one request every 11 seconds gets about 7,800 submissions a day past it, from one IP, at one location. IPv6 makes it worse: one home connection holds billions of addresses. The free WAF rule is just as coarse: one rule, IP only, a 10 s period and a 10 s block, counted per data centre. Both stop a careless loop. Neither stops a patient script or cheap proxies.
*Fix:* say this honestly in the plan, and design for recovery rather than prevention (item 3). Key on the IPv6 /64 prefix, not the full address. Keep the WAF rule's action at **Block**: a challenge action sets the `cf_clearance` cookie (Cloudflare cookies page, 2026-11-10).

**3. Pure counters can't be cleaned up after a flood.** If someone adds 5,000 fake "Brutal" votes, or 5,000 perfect scores, there's no way to take them out again. The fake scores also do the most harm. One script posting perfect scores makes every genuine child read "You beat 4% of today's players" on a casual game.
*Fix:*
- Store counts in **hourly buckets per game, per day and per option or score bucket**. That is still anonymous, and a spike bucket can be thrown away.
- Clamp scores server-side to each game's possible range, and histogram them coarsely.
- Show percentiles only above product's 30-submission floor (which the draft dropped).
- Phrase the result positively ("Top 40% today") and never show a single-digit "you beat".
- Keep security's env-flag kill switch. The draft lost it.

**4. "Reading the IP stores nothing we control" is true. But it doesn't mean nothing needs to be said about it.** Reading `CF-Connecting-IP` and passing it as a rate-limit key is processing personal data: IP addresses are personal data (CJEU *Breyer*, C-582/14, 2016), and GDPR Art. 4(2) counts "use". Under COPPA, an IP address is a "persistent identifier" (16 CFR 312.2). The amended rule requires an online notice naming the internal operations that justify collecting one. So the draft's "no children's-law work" claim is wrong. That said, the work is one paragraph.
*Fix:* the privacy page says: "To stop vote spam, our host briefly checks your IP address against a short-term counter. It is not stored by us or linked to your votes." Name the legal basis (legitimate interest, security). Make sure no `console.log` or Workers Logs setup records the IP.

**5. "No cookies, no trackers" has two traps the draft doesn't name.**
- On the Free plan, someone fighting a flood will reach for Bot Fight Mode or a challenge rule. Both set cookies (`__cf_bm` or `cf_clearance`), so that would quietly break the promise zone-wide.
- `cf.unique_visitor_id` in a rate rule sets `_cfuvid`.

*Fix:* write a GAME_GUIDE rule: "no Cloudflare feature that sets a cookie on games.oddvale.com without owner approval." Add a CI or QA check that loads the pages and asserts an empty `document.cookie` and no `Set-Cookie` header.

**6. The Free-plan failure mode is wider than "the API stops".**
- The 100,000-request daily cap is **account-wide**: Functions and Workers count against the same quota (Pages pricing page). A flood on the poll API could stop every other Worker or Function on the owner's Cloudflare account until midnight UTC.
- Requests the binding rejects have already run the Worker, so they still count. On Workers Paid they are billed. A sustained 50M-request flood costs about $12 plus CPU. That's tolerable, but it isn't "can't run away".

*Fix:* move to Paid from launch (cost-ops' position, which the draft softened), and set the spending limit security cited. Check what else on the account uses Workers. Make sure the WAF rule, which blocks before the Worker runs and isn't billed, covers `/api/*`.

**7. Midnight rollover is undefined, and the dailies use local time.** Blinkwire, Lookout and Overprint build `dateKey` from `getFullYear/getMonth/getDate` (local time), and the games have archives. "Today's players" therefore spans about 26 hours of UTC time, and old days keep getting submissions.
*Fix:*
- Key every counter by the game's own date key, sent by the client.
- Accept only keys within ±1 day of the server's UTC date. Reject archive plays, or keep them in a separate bucket.
- Cache GETs per `(game, dateKey)`, with an allow-list for both, so random query strings can't bypass the cache and hit D1.

**8. Missing operational rules.**
- **Poll approval:** poll JSON merges only with an owner-approved PR. No questions about the player (age, location, school). Fixed options only.
- **Retention:** say in writing that aggregate counters are kept indefinitely and that hourly buckets are collapsed after 30 days.
- **Requests from other sites:** reject any POST whose `Origin` isn't `https://games.oddvale.com`, and require `application/json`. This stops other websites from making visitors' browsers cast votes, which would come from thousands of real IPs. Architecture had this, but the draft dropped it.
- **Client failure:** a 2-3 s timeout, no retries, and on any error the widget simply disappears (never "0%").
- **Accessibility:** real `<button>` elements with `aria-pressed`, results in an `aria-live="polite"` region, never colour alone, and works by keyboard.
- **Small fixes:** HSTS `includeSubDomains` only after the subdomain audit security asked for. The draft says "7 daily games", but the brief says 6. The product's no-GitHub feedback panel was dropped without saying so.

**9. The Phase 2 triggers are loose.**
- Trigger 4 (a legal plan) is a precondition, not demand. As written, "Pullbox has accounts" (arguably already true) plus a legal plan would satisfy "two of four" with zero player demand.
- "Transfer code used heavily" can't be measured, because the code never touches a server.
- "1,000 daily players" needs a definition.

*Fix:* make legal sign-off and 13+ gating **mandatory gates**. Require two of the three demand triggers. Measure trigger 1 as daily anonymous daily-result submissions from Phase 0. Add an anonymous "transfer code generated" counter.

**10. WorkOS: the custom domain isn't cosmetic, and the cost table blurs it.** Passkeys are bound to the relying party's domain. If the passkeys are created on a WorkOS-hosted domain, leaving WorkOS means every user enrolls again (inferred from WebAuthn's design; verify with WorkOS). Export is decent otherwise: there's a CSV of profiles, password hashes come only through a support request, and Magic Auth users have no hash at all. A passwordless setup migrates fairly cleanly by email.
*Fix:* either budget $99/month from day one, which is $1,188 a year at *every* scale (so the table's "$0 / $0-35" is wrong for WorkOS with a domain), or accept that passkeys are lost if we migrate. Also:
- Split the table by vendor rather than mixing WorkOS and Supabase in one range.
- Add Workers Paid for the games BFF and sync.
- Note that Pullbox's existing cookie (`Path=/api/auth`) can't take the `__Host-` prefix, which requires `Path=/`. Use `__Secure-` there, or change the path.

## Things the draft gets right
- No accounts now, no free text, with fixed choices validated server-side.
- Same-origin API with no CSP change. Turnstile held back until there's real abuse.
- A hosted IdP over OIDC, with a host-only session per app and no `.oddvale.com` cookie. This is applied correctly, including for desktop and mobile.
- Streak freeze and transfer code before accounts. Privacy page and admin MFA now, whatever else happens.
- Honest framing: votes are a signal, not a referendum.

## Factual corrections and sources (all checked 2026-11-25)
- Rate Limiting binding: periods are 10 or 60 s only, counts are per location and approximate, and IP keys are "not recommended". [developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) (updated 2026-11-12)
- Pages Functions bindings: rate limiting isn't listed. [developers.cloudflare.com/pages/functions/bindings](https://developers.cloudflare.com/pages/functions/bindings/) (updated 2026-11-12)
- WAF Free plan: 1 rule, IP only, 10 s period, 10 s timeout, counted per data centre. [developers.cloudflare.com/waf/rate-limiting-rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- Free quota shared by Functions and Workers, resetting at midnight UTC: [developers.cloudflare.com/pages/functions/pricing](https://developers.cloudflare.com/pages/functions/pricing/). Error 1027 and the fail-open or fail-closed route setting: [developers.cloudflare.com/workers/platform/limits](https://developers.cloudflare.com/workers/platform/limits/)
- Cloudflare cookies (`__cf_bm`, `cf_clearance`, `_cfuvid`): [developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/) (updated 2026-11-10)
- WorkOS: 1M MAU free, then $2,500/month per extra 1M, custom domain $99/month: [workos.com/pricing](https://workos.com/pricing). Hashes by support request only: [workos.com/docs/migrate/export-from-workos](https://workos.com/docs/migrate/export-from-workos)
- COPPA "persistent identifier" includes IP address (16 CFR 312.2). Amended rule: [Federal Register, 2025-04-22](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- Local date keys: `blinkwire/src/logic/daily.js:8`, `lookout/src/logic/daily.js:16`, `overprint/src/logic/score.js:23`

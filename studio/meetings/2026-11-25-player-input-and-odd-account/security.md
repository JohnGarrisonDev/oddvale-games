# Security lead: position

**Role:** Security lead · **Meeting:** 2026-11-25, player input and the Odd Account · **Status:** position for Meeting 1 (independent, not reviewed)

## Top 3 recommendations

1. **Ship polls and ratings anonymously, with no free text, on the same origin.** Use fixed choices (buttons and stars only) handled by a Pages Function at `games.oddvale.com/api/...`, stored in D1, with Cloudflare Turnstile on each vote and the Workers **Free** plan, which simply stops at its daily limits. With no free text there is nothing to moderate and no XSS surface, and a billing attack has nothing to bill. I count this as low risk, and it is the right size for low-stakes votes.
2. **Do not build the Odd Account now. If it is ever built, buy it and do not hand-roll it.** A hosted identity provider (Clerk, Auth0, Cognito, Entra External ID or similar), reached over standard OIDC from a dedicated `account.oddvale.com`. AI agents should not write password storage, session management, recovery or MFA for us. Building the account means putting a store of children's and adults' emails behind one login for every Oddvale app, and nobody watches the logs daily. We should not take that on just to support polls.
3. **Never put sessions in a `Domain=.oddvale.com` cookie.** Each app keeps its own host-only `__Host-` session cookie and gets it through its own OIDC code exchange. Any subdomain an AI agent spins up, any experiment, and anything a subdomain takeover gains would otherwise receive every user's session for every app.

## 1. Polls and ratings: threat model and controls

| Threat | Realistic? | Control |
|---|---|---|
| Ballot stuffing by one person (refresh, incognito) | Certain | Turnstile token required per vote. Dedupe one vote per poll per *salted daily hash* of IP + poll id. Also dedupe on the client with a localStorage flag (a courtesy only, not security). |
| Bots or scripts posting at volume | Likely once someone notices | Turnstile checked server-side (siteverify) before any write. One WAF rate-limiting rule on `/api/*` (the Free plan includes one rate-limiting rule ([Cloudflare docs](https://developers.cloudflare.com/waf/rate-limiting-rules/), checked 2026-11-25)). A Workers rate-limit binding keyed on the hash as a second layer. |
| Spam, abuse, slurs, grooming attempts in text | Certain if text exists | **No free text at all.** Polls are fixed options written by us. Ratings are 1 to 5 stars. Text feedback stays on GitHub issues, where GitHub does the moderation. |
| Stored XSS or injection | Only with free text or sloppy SQL | Server accepts an allow-listed `poll_id`, an `option_id` integer and `stars` from 1 to 5, and rejects everything else. D1 is used only through prepared statements. The client renders results with `textContent`, never `innerHTML`. |
| Denial of wallet | Real on paid plans | Stay on **Workers Free**: when the daily D1 limits are hit, queries fail instead of billing ([D1 changelog, 2026-09-01](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/)). If we ever move to Paid, set a Workers **spending limit** first. It blocks invocations but "is not an exact maximum bill" and does not cover KV, R2 or Durable Objects ([Cloudflare spend management](https://developers.cloudflare.com/workers/platform/spend-management/), checked 2026-11-25). Budget alerts only notify and do not cap anything. |
| Scraping results | Harmless | Reads return **aggregates only**: counts per option, plus mean and count for ratings. Cache them at the edge for 60 s, so reads cost almost nothing. There is no per-vote read endpoint. |
| Privacy of stored identifiers | The real long-term risk | Never store raw IPs. Store `HMAC(secret_of_the_day, ip + poll_id)`, rotate and **discard the daily salt**, and delete dedupe rows after 48 hours. After that the data cannot be linked back to a person. Aggregates are kept indefinitely. |

**How much is enough?** A rating on a free puzzle game is worth nothing to an attacker. If someone stuffs "best game" with 5,000 votes, we lose a little face and nothing else. So: Turnstile, the hash dedupe, one rate rule and the Free-plan cap. No accounts, no CAPTCHA puzzles and no ML. We should also say on the page that results are "for fun, not science" and **design so a stuffed result does no damage**: no rankings that decide anything automatically, and no prizes.

**Children and COPPA.** The amended COPPA Rule has been fully in force since 2026-04-22. It requires notices to say which internal operations justify collecting a *persistent identifier* ([Federal Register, 2025-04-22](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)). A salted, rotating, discarded hash used only for fraud prevention is the cleanest position available to us. It probably falls under the "support for internal operations" exception, but legal should confirm that. An account with an email address does not fall under that exception. This is a strong reason to keep the arcade sign-in-free.

**Promise impact.** Turnstile runs third-party JavaScript from `challenges.cloudflare.com`. I could not confirm from current docs whether it stores anything on the device. The site says "no cookies or trackers", so before shipping we must check in a browser what Turnstile writes, and update the privacy line if it writes anything. If it does, the fallback is to drop Turnstile, keep only the hash dedupe plus the rate rule, and accept a slightly noisier poll.

## 2. The Odd Account: threat model

**Blast radius is the headline.** One account for everything means one breach exposes everything: Pullbox collections, Ghostframe users and arcade players. It also means a phished password unlocks every app. Today a breach of any one app is contained. Single sign-on removes that containment. The trade is worth making only if the account is much harder to breach than the separate logins it replaces, and for a solo, AI-operated studio that means a vendor's.

| Threat | Control (with a hosted IdP) |
|---|---|
| Credential stuffing | **Passkeys first, then an email one-time code; no passwords at all** if the IdP allows it. If passwords exist, use breached-password checks and IdP bot protection. |
| Phishing | Passkeys are phishing-resistant. Codes are better than links (links get forwarded and pre-fetched by mail scanners). Codes are single use, expire in about 10 minutes and are attempt-limited. |
| SIM swap | **No SMS** for sign-in or recovery, ever. |
| Session theft | Short-lived access tokens, rotating refresh tokens with reuse detection, `__Host-` + `Secure` + `HttpOnly` + `SameSite=Lax` cookies, and a "sign out everywhere" option. |
| **Shared `.oddvale.com` cookie** | Rejected. Every subdomain receives it, including `house.oddvale.com` (a live AI show with a Fly.io backend), any preview or experiment, any game, and any dangling CNAME someone takes over. Any XSS on any of them reads or rides the session. Even with host-only cookies, a compromised sibling subdomain can *set* `.oddvale.com` cookies (cookie tossing). The `__Host-` prefix blocks that. |
| Subdomain takeover | Quarterly DNS audit: no CNAMEs pointing at deleted Pages, Fly or Azure resources. |
| Windows desktop app (Ghostframe) | OAuth with the system browser + PKCE + loopback redirect (RFC 8252). **No embedded webview login and no client secret in the binary.** Refresh token kept in Windows Credential Manager / DPAPI, never in a plaintext config file. |
| Mobile app (Pullbox) | ASWebAuthenticationSession / Custom Tabs + PKCE. Tokens in Keychain / Keystore. Universal links, not custom URL schemes, for the redirect. |
| Recovery | Recovery is where small sites get breached. Email-only recovery means **the user's email account is the real security boundary**. Say so plainly. Support staff (us) must never be able to reset an account on request, because social engineering would target exactly that. |
| Admin access | The IdP admin console, Cloudflare, GitHub, Fly and Azure all need hardware-key or passkey MFA on the owner's accounts. That is the true root of every app. **AI agents get scoped API tokens, never the owner's console login,** and no agent gets IdP admin write access. |
| Secrets | Wrangler / Fly secrets only. No `.env` in repos. Turn on GitHub secret scanning and push protection on all repos. Rotate every key yearly and on any suspicion. |
| AI-written code and supply chain | Agents add dependencies freely and confidently write plausible but wrong security code. Rules: auth flows use the IdP's official SDK only. Turn on Dependabot. Run `npm audit` / `dotnet list package --vulnerable` in CI. Lockfiles get committed. A human reads every diff that touches auth. |
| Logging and breach detection | Nobody watches dashboards, so rely on **push alerts**: IdP alerts for sign-in spikes and admin changes sent to the owner's email, Cloudflare security notifications, and GitHub Dependabot emails. Log the user id, event and time, never tokens or codes. Keep logs 30 to 90 days. |
| Notification duties | Holding emails creates breach-notification duties: US state laws (most US states), GDPR's 72-hour notice to the regulator if EU users sign up, and parental issues if children are involved. We need a one-page incident runbook *before* launch, not after. |

**Pullbox.** It likely has its own accounts already. I could not find auth code in `JohnGarrisonDev/grail-diary` through `gh search code` (it may not be indexed), so this needs checking. Migrating existing users into a new IdP is a risky step of its own. It means a forced re-login, account linking by verified email only, and never silently merging on an unverified address.

## 3. Build vs buy, bluntly

A hosted IdP takes these off our plate: password hashing, breached-password checks, bot and brute-force defence, passkey/WebAuthn ceremony, MFA, email delivery and its abuse, recovery flows, session revocation, token signing-key rotation, anomaly detection, SOC 2 audits and 24/7 incident response. Clerk, for example, now lists 50,000 monthly retained users free ([Clerk pricing explainer](https://clerk.com/articles/clerk-pricing-explained), Feb 2026 change; verify on clerk.com/pricing). For our scale that is $0, and the cost is vendor lock-in plus a third-party processor to name in the privacy policy.

A self-built service would need every item above done *exactly right*, plus someone on call for it. Most auth bugs are silent: a missing `state` check, a token that never expires, a timing leak in code comparison, a recovery flow that skips verification. Tests pass and users notice nothing until someone abuses it. **AI agents should not hand-roll auth.** That is not because they cannot write it. It is because they write it convincingly, nobody here can audit it, and no one notices when it goes wrong. Agents should *integrate* a vendor SDK, and a human should review the integration.

## 4. Changes to current hardening (`site/_headers`)

- **Polls, done my way:** the API is same-origin (a Pages Function), so `connect-src 'self'` stays. Turnstile needs `script-src 'self' https://challenges.cloudflare.com` and a new `frame-src https://challenges.cloudflare.com` (today `default-src 'self'` blocks the iframe). `form-action 'none'` stays (use `fetch`, not forms). Add `Cache-Control: no-store` to `/api/*` write responses.
- **Odd Account on the arcade** (not recommended): `connect-src` and `form-action` would have to allow the IdP domain, and a vendor JS SDK means more third-party script on every game page. Prefer redirect-based OIDC so the games load no IdP script at all.
- **Everywhere:** add `Strict-Transport-Security: max-age=31536000; includeSubDomains` once every subdomain is confirmed HTTPS-only. Preload is a later, one-way decision. Add `Cross-Origin-Opener-Policy: same-origin`. Consider Trusted Types (`require-trusted-types-for 'script'`) since the games have no dependencies. Bring `house`, `pullbox` and `ghostframe` up to the same header baseline, because under SSO the weakest subdomain sets the security level for all of them.

## 5. Minimum bar per phase

**Phase 1: anonymous polls and ratings**
- [ ] Fixed-choice input only, with a server-side allow-list. No free text.
- [ ] Turnstile verified server-side. Cookie and storage behaviour checked against the privacy promise.
- [ ] Hash-of-IP dedupe with a daily discarded salt. No raw IP stored. Rows purged after 48 hours.
- [ ] Aggregate-only, edge-cached reads. Results rendered with `textContent`.
- [ ] Workers Free plan (fail closed), or a spending limit set before any move to Paid.
- [ ] One WAF rate rule on `/api/*`. CSP updated and tested in a browser. Privacy line updated.
- [ ] A switch to turn polls off (env flag) that any agent can flip.

**Phase 2: Odd Account (only if the owner approves)**
- [ ] Hosted IdP, OIDC + PKCE, a dedicated auth subdomain, `__Host-` host-only cookies per app.
- [ ] Passkeys + email codes. No SMS. No passwords if possible. Recovery documented.
- [ ] Phishing-resistant MFA on every owner admin account. Agents on scoped tokens only.
- [ ] Desktop and mobile flows per RFC 8252. Tokens kept in the OS secure store.
- [ ] Legal sign-off on children (age gate or no accounts for under-13s), privacy policy, DPA with the vendor.
- [ ] Incident runbook, push alerts configured, DNS takeover audit done, header baseline on all subdomains.
- [ ] Human review of every auth-touching diff. Dependabot and secret scanning on.

**Ongoing work this creates (estimate).** Phase 1 is about 1 hour a month: triage Dependabot, glance at poll totals for obvious stuffing, and rotate the HMAC secret automatically. Phase 2 is about 3 to 5 hours a month plus being reachable for incidents: vendor changes, dependency patches across four apps, a quarterly access and DNS review, yearly key rotation, and support for locked-out users. That last item is the hidden cost. Someone has to answer "I can't get into my account" without becoming the social-engineering hole.

## Open questions for the owner
1. Can a Turnstile script from Cloudflare live under the "no cookies or trackers" promise if it proves cookieless, or should we skip it?
2. Is the Odd Account a real need (users asking for cross-app identity) or an idea? If it is an idea, can it wait until one app actually needs sign-in?
3. Does Pullbox already hold user emails or passwords, and where? That data is our largest current exposure whether or not we build anything.
4. Will you put hardware keys or passkeys on the Cloudflare, GitHub, Fly and Azure accounts this month, whatever else is decided?

*Sources checked 2026-11-25: Cloudflare Turnstile plans (developers.cloudflare.com/turnstile/plans), Cloudflare WAF rate limiting rules, Cloudflare D1 free-tier enforcement changelog (2026-09-01), Cloudflare Workers spend management docs, Federal Register COPPA amended rule (2025-04-22), Clerk pricing explainer (2026). Prices and limits change; recheck before building.*

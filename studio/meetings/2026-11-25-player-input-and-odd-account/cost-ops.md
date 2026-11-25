# Cost & operations lead: position

All prices checked on **2026-11-25** from the pages linked in "Sources". Figures marked *(est.)* are my estimates. Prices marked *(unverified)* came from third parties because the vendor page doesn't print the number.

## Top 3 recommendations

1. **Build anonymous polls and star ratings first. They cost $0 to $5 a month at every scale we could reach.** Use Pages Functions, D1, Turnstile and the one free rate-limit rule. Send only `/api/*` through Functions so static pages stay free and unmetered. Move to **Workers Paid ($5/month)** on launch day. $60 a year removes the free tier's daily cap, which a single Reddit spike could hit. Don't allow free-text comments: they turn a 1-hour-a-month job into a moderation and child-safety job.
2. **Don't build our own login system.** If the owner wants the Odd Account, use a hosted provider on its free or $25 tier. The money is the same either way (under $100/month up to 100,000 users with the right vendor). The difference is risk and owner hours. Building our own means owning password-reset bugs, session security, a pen test ($5k–$15k) and incident response. The hosted vendor carries most of that.
3. **Spend the one-off money on a lawyer, not on infrastructure.** For polls with no personal data, agents can update the privacy wording at no cost. Accounts on a site children play need a real review (est. $1,000–$5,000) before launch. Limiting accounts to **13 and over** is the decision that most cuts legal cost and ops load. SMS isn't needed at all.

## 1. Anonymous polls and ratings on Cloudflare

**Prices (Workers pricing page, checked 2026-11-25):**
- **Pages Functions** are billed as Workers.
- **Workers Free:** 100,000 requests a day, 10 ms CPU per request.
- **Workers Paid:** $5/month minimum. Includes 10M requests a month (then $0.30 per million) and 30M CPU-ms (then $0.02 per million).
- **D1 free:** 5M rows read and 100k rows written per day, 5 GB storage.
- **D1 on Paid:** 25B rows read and 50M rows written per month included.
- **KV free:** 100k reads and 1k writes per day. KV's low write limit makes it a poor fit for votes. Use D1.
- **Durable Objects:** a free tier exists (100k requests a day). Polls don't need them.
- **Turnstile:** free, unlimited challenges, up to 20 widgets. The only Turnstile cost would be Enterprise, to remove Cloudflare branding.
- **WAF rate limiting, Free plan:** 1 rule, counted by IP, 10-second period, 10-second block. That is enough for one `/api/*` rule.
- **Cloudflare Pro:** $25/month, or $20/month billed annually. It adds a second rule and periods up to 1 minute. We don't need it.

**Assumptions** *(est.)*:
- A monthly player is active on 6 days a month.
- Each active day casts 1 vote or rating and makes 3 read calls (results, my-vote check, rating summary). That is 4 Function requests per active day.
- Each vote is 1–2 D1 row writes. Aggregates are cached, not recounted on every read.
- Bot and abuse traffic is modelled as ×10 on top.

| Monthly players | Function requests/month | Avg/day | D1 writes/month | Plan | Cost/month | With ×10 bot traffic |
|---|---|---|---|---|---|---|
| 1,000 | ~24k | ~800 | ~12k | Free fits | **$0** ($5 if on Paid) | $0–5 |
| 10,000 | ~240k | ~8k | ~120k | Free fits | **$0** ($5 if on Paid) | $5 |
| 100,000 | ~2.4M | ~80k | ~1.2M | Free is too close to the 100k/day cap | **$5** | ~$9 |

The main money risk isn't the bill. It's the free plan's **daily cap**. If Functions go over it, the API stops working for the rest of the UTC day; I didn't re-check exactly how it fails today. Static games keep working either way, but polls break during the very spike we want. That is why I recommend $5/month from launch. Our bill can't run away: a 10× abuse flood at 100k players adds about $4.

## 2. The Odd Account: monthly cost

Assumptions:
- Every product (arcade, Odd House, Ghostframe, Pullbox, oddvale.com) shares one tenant on `*.oddvale.com`.
- Sign-in is by email code or magic link, plus passkeys and Google/Apple sign-in.
- No SMS, no enterprise SSO.

### (a) Hosted providers

| Provider | Free tier | 1k MAU | 10k MAU | 100k MAU | What costs extra / caveats |
|---|---|---|---|---|---|
| **WorkOS AuthKit** | 1M MAU free | $0 | $0 | $0 | Custom domain $99/mo. SSO $125 per connection. |
| **Clerk** | 50k *retained* users (Hobby) | $0 | $0 | ~$1,025 (Pro $25 + 50k × $0.02) | Hobby has no MFA and shows Clerk branding; Pro ($25) adds both. Custom domain included. Satellite domains $10/mo each (we likely don't need them, all subdomains; verify). SMS $0.01 US. |
| **Supabase Auth** | 50k MAU, but free projects **pause after 1 week inactive** | $25 (Pro) | $25 | $25 (100k included) | Custom domain +$10/mo. Phone MFA +$75/mo. Best flat price if we accept Postgres. |
| **Firebase Auth / Identity Platform** | 50k MAU | $0 | $0 | ~$275 (50k × $0.0055) *(rate from cached Google page; verify)* | SMS per message. SAML/OIDC free for 50 users only. |
| **Microsoft Entra External ID** | 50k MAU | $0 | $0 | ~$1,500 *(unverified $0.03/MAU)* | Needs an Azure subscription (the owner has one). SMS per transaction. Premium add-ons have no free tier. |
| **Logto Cloud** | 50k MAU, **3 apps max** | $0 | $0–24 | ~$24 + token overage, est. $100–800 | Pro is $24 with unlimited MAU, billed by tokens ($0.08 per 100 over 50k). MFA add-on $48. 3-app limit is tight for 5 products. |
| **Kinde** | 10,500 MAU | $0 | $0 | ~$1,590 (Pro $25 + 89.5k × $0.0175) | Free plan shows branding. SMS $0.07 each. Custom domain included. |
| **Auth0** | 25k MAU | $0 | $0 | Quote needed; est. $5,000+ | No MFA on free. Paid B2C Essentials is $700/mo at 10k. Avoid. |
| **Stytch** | 10k MAU | $0 | $0 | ~$9,000 *(unverified $0.10/MAU)* | Branding removal $99 one-off. No consumer per-MAU rate published. Avoid at scale. |

The lowest-cost hosted choices across all three scales are **WorkOS AuthKit ($0, or $99 with our own domain)** and **Supabase Pro ($25–35)**. **Clerk** is the easiest to build with and is free until 50k retained users. After that its price climbs steeply, and the same is true of Kinde, Entra and Stytch.

### (b) Self-built on Cloudflare

Workers Paid ($5) plus D1 for users and sessions (inside the included quota at all three scales).

Email assumption *(est.)*: 2 sign-in emails per user per month, with 30–90-day sessions. That is 2k, 20k and 200k emails a month.

| Email service | 1k MAU | 10k MAU | 100k MAU | Notes |
|---|---|---|---|---|
| **Cloudflare Email Service** | $0 | ~$6 | ~$69 | Needs Workers Paid. 3,000 included, then $0.35 per 1,000. Same vendor, no new account. |
| **Amazon SES** | ~$0.20 | ~$2 | ~$20 | $0.10 per 1,000. A new AWS account, a sandbox-exit request and deliverability setup are owner work. |
| **Resend** | $0 | $20 | ~$125–160 | Free plan is capped at 100 a day, so a spike locks people out. Pro is $20 for 50k. |
| **Postmark** | $15 | ~$30 | ~$260 *(est., Pro overage)* | Best deliverability reputation. No usable free tier. |

**Self-built total:** about **$5 / $11 / $75 a month**. That is cheaper than most hosted options at 100k. The savings, about $0–$1,000 a month, aren't worth the one-off security cost and the ongoing risk, given that WorkOS or Supabase cost about the same.

### SMS: not needed

- SMS costs about **$0.012 per US message** on Twilio (base $0.0083 plus carrier fees), with 10DLC registration fees on top. Some vendors charge $0.01–$0.07.
- It brings SMS-pumping fraud, where bots trigger texts to premium numbers and we pay for them.
- It also means collecting phone numbers on a site children may use.
- Email codes, passkeys and Google/Apple sign-in cover recovery.
- Recommendation: **no SMS, for sign-in or for MFA.**

## 3. One-off costs

| Item | Polls/ratings only | Odd Account |
|---|---|---|
| Privacy/terms wording | $0. Agents update the privacy page ("we count anonymous votes; Cloudflare sees your IP to block abuse; no cookies"). | Templates: Termly ~$10/mo or iubenda ~€5–15/mo, but they don't handle child users or one account shared across 5 products well. |
| Lawyer review | Optional, ~$500–1,000. ContractsCounsel average flat fee for ToS and privacy review is $760. | **Recommended**, est. $1,000–2,500 for 13+-only accounts. Est. $3,000–5,000+ if under-13s may hold accounts (COPPA parental consent, UK Children's Code). The privacy lead should set the scope. |
| Security review | $0. Agent review plus abuse tests (vote flooding, replay, Turnstile bypass). | Hosted IdP: est. $0–5,000 for a scoped review of the integration. Self-built: **$5,000–15,000** pen test (typical 2026 range for a small web app with login; vendor-sourced figures). |
| Domain / email setup | $0. We own `oddvale.com` and DNS is on Cloudflare. | ~1 owner hour for SPF/DKIM/DMARC on a sending subdomain. Free support inbox through Cloudflare Email Routing. Auth custom domain: $0 (Clerk, Kinde, Logto), $10/mo (Supabase), $99/mo (WorkOS). |

## 4. Ops cost in time (hours per month, *est.*)

| Task | Polls/ratings (no free text) | Hosted accounts | Self-built accounts |
|---|---|---|---|
| Writing polls, publishing results | Agents | Agents | Agents |
| Vote-abuse watch, anomaly report | Agents (weekly) | Agents | Agents |
| Moderation | None (free text would add 2–10 h and child-safety risk) | Display names/avatars need moderation, so don't add them, or use preset names | Same |
| Locked-out users, "didn't get my code" | None | 1–3 h at 10k, 4–8 h at 100k. Agents draft replies; the owner checks identity on edge cases | Same, plus debugging our own email and session bugs |
| Data access and deletion requests (legal duty) | None | Owner approves; agents run a scripted deletion. About 0.5–2 h | Same |
| Patching, dependencies, key rotation | Small; agents | Vendor does it | 2–4 h, agents with owner review |
| Incident response, breach notification | Low stakes (rigged votes) | Owner decides; the vendor contains | Owner owns it entirely. One incident can cost tens of hours |
| Vendor/billing admin, admin MFA | 0.25 h | 0.5 h | 0.5 h |
| **Owner total** | **~1 h** | **~2–4 h at 1–10k, 5–10 h at 100k** | **~5–8 h at 1–10k, 10–15 h at 100k** |

**Owner-only tasks:**
- approving anything public or legal
- spending and vendor sign-ups
- verifying the identity of people who claim an account
- breach decisions and notifications
- final say on data deletion

Agents can do everything else, including weekly abuse and spend reports and first-draft support replies. The owner sends those replies.

## 5. Summary

| Phase | What's included | One-off | Monthly at 1k / 10k / 100k | Owner h/mo |
|---|---|---|---|---|
| **0. Measure** | Give the Cloudflare API token Analytics Read, so we know real player numbers before spending | $0 | $0 / $0 / $0 | 0.25 |
| **1. Polls and ratings** | Pages Functions + D1 + Turnstile + 1 rate-limit rule. Anonymous, no cookies, no free text | $0 (opt. $500–1,000 legal) | $0–5 / $0–5 / $5 | ~1 |
| **2a. Odd Account, cheapest sensible** | WorkOS AuthKit or Clerk Hobby. 13+ only. Email code + passkey + Google/Apple. No SMS. Template policies plus a basic lawyer review | ~$1,000–2,500 | $0 / $0 / $0 (WorkOS) or ~$1,025 (Clerk) | 2–4 → 5–10 |
| **2b. Odd Account, spend a little to save a lot of risk** | Clerk Pro ($25), Supabase Pro + domain ($35) or WorkOS + domain ($99). Lawyer review covering children. Scoped security review. Workers Paid from day one | ~$4,000–10,000 | $30–100 / $30–100 / $35–1,025 | 2–4 → 5–10 |
| *Not recommended:* self-built auth | Workers + D1 + Email Service | $6,000–17,000 (pen test + legal) | $5 / $11 / $75 | 5–8 → 10–15 |

- **Cheapest sensible path:** Phase 0 + Phase 1 now, about **$5/month and ~1 owner hour**. Decide on accounts only once analytics and poll turnout show demand.
- **Spend a little to save a lot of risk:** Phase 2b. The extra $3k–7k one-off mostly buys a lawyer and a review. That money insures against the expensive outcome: a breach or COPPA problem involving children's data.

## Risks

- **Free tiers change.** Auth0, Stytch and Clerk have all repriced in the past two years. WorkOS's 1M-free offer could shrink. Pick a vendor that lets us export users, including password-less identities.
- **Vendor lock-in across 5 products.** Moving one shared login later is painful. Pullbox likely has its own accounts already, so merging those in is extra unbudgeted work. I couldn't confirm Pullbox's auth from a code search.
- **A public promise changes.** A login session needs a cookie or token storage, which changes "no cookies". Polls don't need cookies (one vote per device via localStorage, plus Turnstile).

## Open questions for the owner

1. Are accounts for 13+ only? This decides the legal cost and the support load.
2. Do you accept $5/month (Workers Paid) as a standing cost?
3. Which matters more for the account vendor: lowest price (WorkOS), easiest build (Clerk), or a flat bill and data we control (Supabase)?
4. Does Pullbox need to merge its existing users into the Odd Account?

## Sources (all checked 2026-11-25)

- Cloudflare Workers/D1/KV/DO pricing: https://developers.cloudflare.com/workers/platform/pricing/
- WAF rate-limiting rule limits by plan: https://developers.cloudflare.com/waf/rate-limiting-rules/
- Turnstile plans: https://developers.cloudflare.com/turnstile/plans/
- Cloudflare Free/Pro/Business prices: https://www.cloudflare.com/plans/network-cdn.md
- Cloudflare Email Service pricing: https://developers.cloudflare.com/email-service/platform/pricing/
- Clerk: https://clerk.com/pricing
- Auth0: https://auth0.com/pricing
- WorkOS: https://workos.com/pricing
- Supabase: https://supabase.com/pricing
- Stytch: https://stytch.com/pricing; per-MAU figure from https://supertokens.com/blog/stytch-pricing *(third party)*
- Firebase: https://firebase.google.com/pricing; Identity Platform tiers: https://cloud.google.com/identity-platform/pricing *(cached copy via search)*
- Entra External ID: https://www.microsoft.com/en-us/security/pricing/microsoft-entra-external-id and https://learn.microsoft.com/en-us/entra/external-id/external-identities-pricing; per-MAU rate from Microsoft's FAQ via search *(unverified)*
- Kinde: https://kinde.com/pricing/
- Logto: https://logto.io/pricing
- Resend: https://resend.com/pricing
- Postmark: https://postmarkapp.com/pricing
- Amazon SES: https://aws.amazon.com/ses/pricing/
- Twilio US SMS: https://www.twilio.com/en-us/sms/pricing/us; carrier fees: https://dev.to/apilover/twilio-sms-api-cost-complete-pricing-breakdown-for-2026-2ok5 *(third party)*
- Lawyer review fees: https://www.contractscounsel.com/b/website-terms-of-service-and-privacy-policy-review-cost and https://www.klemchuk.com/flat-fee-website-review
- Pen-test ranges: https://www.getastra.com/blog/penetration-testing/cost/ and https://www.compassitc.com/blog/how-much-does-a-penetration-test-cost-for-a-small-business *(vendor blogs)*
- Policy templates: https://termly.io/resources/compare/termly-vs-iubenda/ *(vendor-authored)*

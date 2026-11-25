# Position: Privacy, legal & trust lead

**Meeting:** 2026-11-25, player input and the Odd Account. **Angle:** obligations, risks, trust.

I am not a lawyer and this is not legal advice. I flag below the points where the owner should pay for a real review. Laws below were checked on 2026-11-25; several are mid-change.

## Top 3 recommendations

1. **Ship votes and ratings as "anonymous counts, no IDs".** A vote adds 1 to a counter and stores nothing that identifies the voter on our side. The "you already voted" flag lives only in the player's own localStorage, the same way streaks do now. No per-device ID is sent, no IP is stored (not even hashed), and there is no free text. With that design the "no cookies, no trackers" promise stays true word for word, no consent banner is needed in the EU/UK/US, and children's law barely applies because we collect no personal data from anyone. Accept that a determined person can vote twice. For a casual arcade poll that is fine.
2. **No free-text input on the arcade while children are a likely audience.** Comments and suggestion boxes bring moderation and illegal-content duties (EU DSA notice-and-action, UK Online Safety Act children's risk assessment) and are where children post their names, ages and schools. Keep the GitHub issue form for suggestions (GitHub is the host and moderator there, and it requires users to be 13+), or offer fixed-choice "what should we build next?" polls instead.
3. **Do not build the Odd Account now. If the owner wants it later, make it a separate, opt-in, adults-only (or 13+/16+) service with its own privacy policy, and never require it for the arcade.** One account across a kids-friendly arcade, a comic collection with AI cover scanning, a 24/7 AI reality show and a desktop app is the biggest legal and trust risk in this meeting. It turns Oddvale from "we collect nothing" into a cross-app identity holder, triggers the full GDPR/COPPA/state-law stack, and it needs a lawyer review before launch (estimate USD 1,500-5,000; sources below).

Separately, a gap that exists **today**: games.oddvale.com has no privacy page at all (I searched the hub repo: the only mentions are in README and GAME_GUIDE). Even a "we collect nothing" site should say so in one plain page, including that Cloudflare, as host, processes IP addresses in its logs. This costs nothing and should ship before any phase.

## 1. Anonymous polls and ratings

**localStorage is not exempt just because it is not a cookie.** EU ePrivacy Art. 5(3) (and UK PECR reg. 6) cover *any* storing of or access to information on the user's device. What saves us is the "strictly necessary for a service the user asked for" exemption: saving game progress, and saving "I voted on this poll" so the button greys out, are both functions the player asked for and never leave the device. A random device ID that is **sent to our server** to deduplicate votes is different: it is a persistent identifier, which is personal data under GDPR and under COPPA's definition (16 CFR 312.2), and its necessity is arguable. Some regulators would call it fine (anti-abuse), others would not. Avoid the argument by not sending it.

**Hashed IPs are still personal data for us.** The CJEU in *EDPS v SRB* (C-413/23 P, 4 Sept 2025) held that pseudonymised data may be non-personal for a *recipient* who cannot re-identify it, but stays personal for the controller who can. If we hash IPs with a salt we hold, the hashes are personal data in our hands. A daily-rotating salt that is thrown away (Plausible-style) shrinks the risk but does not make the "no tracking" claim cleanly true. Cloudflare already sees IPs as our host; rate limiting at Cloudflare's edge (no storage by us) is the cleaner way to stop floods.

**Bot protection.** If abuse becomes real, Cloudflare Turnstile is generally treated as strictly necessary (no consent needed), but it sets a cookie (`cf.turnstile.u` reported by Cookiebot users) and Cloudflare acts as a controller for bot-detection data under its legitimate interests (Cloudflare Turnstile Privacy Addendum). That would make "no cookies" false. Wording fix if adopted: "No tracking cookies. One security check from our host to stop vote spam, used for nothing else."

**What is changing:** UK Data (Use and Access) Act 2025 added a consent exemption for purely statistical storage, with notice and a free opt-out (in force 5 Feb 2026 per DLA Piper / gov.uk commencement plans). The EU Digital Omnibus would add similar exemptions to ePrivacy, but on 21 Oct 2026 only the Council mandate was agreed; trilogues are open and the text is not law. Do not design around either; they help analytics, not votes.

**US:** CCPA/CPRA applies only to businesses over USD 26,625,000 revenue, or that buy/sell/share data of 100,000+ Californians, or earn half their revenue from selling data (CPPA threshold table). Oddvale is far below. Other state laws have similar thresholds. Anonymous counters are outside all of them.

**Promise wording:** with recommendation 1, no change needed. I'd add one honest line on the privacy page: "Votes are counted, not tied to you. Your browser remembers that you voted so the button stays pressed."

**Free text (if the owner insists):**
- **EU DSA:** any host of user content must run notice-and-action (Art. 16), give reasons when removing content (Art. 17) and report suspected serious crimes (Art. 18). Micro and small enterprises (under 50 staff, under EUR 10m turnover) are exempt from most *online platform* duties (Art. 19), but not from the hosting-provider duties. Small providers also skip transparency reports.
- **UK Online Safety Act:** a site with user-to-user content likely to be accessed by children must do an illegal-content risk assessment and a children's access and risk assessment, reviewed yearly (Ofcom guidance). Ofcom says it will not penalise small, low-risk services acting in good faith, but the paperwork is still owed.
- **US Section 230** shields us from liability for most user posts and protects good-faith moderation. It does not cover federal criminal law, IP, or CSAM reporting duties (18 USC 2258A). It is a liability shield, not a reason to skip moderation.
- **COPPA:** free text from a child often *is* personal information (name, school). The pre-moderation or "strip before posting" burden is real.

## 2. Children

- **COPPA (US, under 13).** The amended rule took effect 23 June 2025, with compliance due 22 April 2026 (Federal Register, 22 Apr 2025). New: a written information security program, a written retention policy, separate verifiable parental consent for third-party disclosure, and notices that explain any persistent identifier collected under the "support for internal operations" exception. A colourful casual arcade is plausibly "directed to children" or "mixed audience" under the FTC's factors. **(a) Anonymous counters with no identifier: COPPA not triggered.** A server-side device ID is a persistent identifier; it may fit the internal-operations exception (fraud prevention), but then the new notice rules apply. **(b) Accounts for under-13s need verifiable parental consent.** Do not offer that; gate it.
- **UK Children's Code (AADC).** Applies to services "likely to be accessed" by under-18s in the UK. Requires high privacy by default, data minimisation, no nudges, a DPIA. Self-declared age is acceptable only for low-risk processing; ICO says it is not enough to show children are excluded (ICO age assurance opinion). Anonymous counters are low risk. An account system is not.
- **GDPR Art. 8.** Where consent is the basis for an online service offered to a child, parental consent is needed under 16 (member states may lower to 13). If the account uses contract as the basis instead, Art. 8 is avoided but the child-protection expectations remain.

**Age gate:** none needed for anonymous counters. For accounts: a neutral age question ("What year were you born?", no default, no hint of the cut-off), refuse under 13 (or 16 for the EU if we use consent), do not store the birth year after the check, only an "adult" flag. Pair it with design: no profiles, no public names, no messaging, no free text. That is "low risk" under the ICO's framing and keeps the gate proportionate.

## 3. The Odd Account

- **Jurisdiction:** GDPR reaches a non-EU operator who offers services to people in the EU (Art. 3(2)), free services included. A worldwide English site with accounts is likely in scope. Enforcement against a tiny studio is unlikely; the brand risk is the real cost.
- **Lawful basis:** contract (Art. 6(1)(b)) for the account itself; consent for anything optional (newsletter). **Purpose limitation:** a single login is fine; **a shared profile is not.** Using comic collection data or watch history in the games, or vice versa, is a new purpose that needs its own basis and disclosure. Design: identity only (sign-in) is shared; each app keeps its own data, its own consent toggles, and the user picks which apps to connect.
- **Minimum data:** an email address (or passkey) and an opaque user ID. No real name, no birthday kept, no avatar upload, no location.
- **Rights:** export and deletion must work across every connected app with one request. That needs a written deletion runbook and an "account deleted" event every app honours (including Pullbox's existing .NET API, which likely holds its own user table). Respond within one month (GDPR Art. 12).
- **Retention:** delete inactive accounts after a stated period (e.g. 24 months, with an email warning); purge logs at 30 days.
- **Processors and transfers:** a hosted identity provider (Auth0, Clerk, Cloudflare, Azure Entra External ID) is a processor: sign its DPA, list it in the policy. US vendors on the EU-US Data Privacy Framework are lawful today, but the Latombe appeal (C-703/25 P) is pending at the CJEU; pick a vendor that also offers Standard Contractual Clauses as a fallback.
- **Breach notification:** GDPR: notify the regulator within 72 hours unless low risk (Art. 33), users if high risk (Art. 34). Every US state has a breach law; email plus password hash is a notifiable combination in many states. COPPA now requires a written security program. Use passkeys/magic links so we hold no passwords.
- **Trust:** "No sign-up" and "no trackers" are core promises. A cross-app account is, by definition, a way to recognise one person across services. It can be done honestly ("optional, sign-in only, we never combine what you do in different apps"), but it changes the promise and the owner must decide that.

## 4. Documents before each phase, and cost

| Phase | Needed | Cost (estimate) |
|---|---|---|
| Now (no change) | One-page privacy notice: what we store (localStorage only), host logs (Cloudflare), contact address | USD 0, written in-house |
| Anonymous polls/ratings | Update notice; record of processing (one paragraph); confirm no IDs/IPs stored | USD 0 |
| Free text (not recommended) | Terms with content rules, report button, DSA notice-and-action process, OSA risk assessments, moderation log | USD 0-15/month template + 2-6 hours/month moderation |
| Odd Account | Privacy policy, terms, DPIA (UK code), record of processing, vendor DPA, retention schedule, deletion runbook, breach plan, written security program (COPPA), age-gate design | Lawyer review USD 1,500-5,000 (estimate) |

Cost sources: generator templates run free to about USD 10-15/month (Termly Starter USD 10/month, Pro+ USD 15/month, per Termly's comparison page, 2026; iubenda from about EUR 5-10/month). Lawyer review of a simple ToS plus privacy policy averages about USD 770, drafting about USD 1,130 (ContractsCounsel marketplace data); flat-fee firms list USD 500-1,500 (Klemchuk, Chester Law). A multi-app account with a child audience is more complex than "simple", so my USD 1,500-5,000 range is an estimate, not a quote.

## Risks

- A "temporary" device ID or hashed IP added later for anti-cheat quietly breaks the promise. Make "no identifiers sent" a written rule in GAME_GUIDE.
- An account that starts optional becomes required for "the good features": that is the moment the arcade stops being kid-safe and sign-up-free.
- Pullbox already has accounts; folding it into an Odd Account means migrating real user data and re-noticing those users.

## Open questions for the owner

1. Which country is Oddvale run from, and is it a company or a sole trader? This decides the lead regulator and who is liable.
2. Is losing a little vote accuracy acceptable to keep "no identifiers, no cookies" true?
3. Would you accept the promise wording change an Odd Account needs?
4. Does Pullbox have a privacy policy and a deletion process today?

## Sources (checked 2026-11-25)
- FTC amended COPPA Rule, Federal Register, 22 Apr 2025: federalregister.gov/documents/2025/04/22/2025-05904
- CJEU C-413/23 P EDPS v SRB, 4 Sept 2025 (curia.europa.eu; Clifford Chance, Sept 2025)
- UK DUAA commencement: gov.uk "Data (Use and Access) Act 2025: plans for commencement"; DLA Piper, Feb 2026; ICO DUAA page, updated 19 Jun 2026
- EU Digital Omnibus Council mandate 21 Oct 2026: Heuking, 23 Oct 2026; Council doc ST-9773-2026
- CCPA thresholds: cppa.ca.gov/regulations/cpi_adjustment.html
- DSA Art. 16-19: Regulation (EU) 2022/2065, OJ L 277, 27 Oct 2022
- Ofcom children's access and risk assessment guidance; "Helping small services navigate the Online Safety Act" (ofcom.org.uk, 2025-2026)
- ICO "Likely to be accessed" guidance; ICO age assurance opinion (2021, updated 2024)
- DPF: General Court T-553/23, 3 Sept 2025; appeal C-703/25 P filed 31 Oct 2025 (WilmerHale, 1 Dec 2025)
- Cloudflare Turnstile Privacy Addendum (cloudflare.com/turnstile-privacy-policy)
- Costs: termly.io/resources/compare/termly-vs-iubenda; contractscounsel.com (ToS and privacy policy review/drafting cost); klemchuk.com/flat-fee-privacy-policy; chester-law.com

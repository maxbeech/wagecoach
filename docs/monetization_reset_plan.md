# WageCoach — monetization reset plan

First execution step: copy this file to `docs/monetization_reset_plan.md`, and keep that copy updated as the work proceeds.

## Context — why nobody is converting
The data (pulled 2026-10-20) says the cause is upstream of the offer. It is not mainly the Pro report's quality.

- **Almost no traffic.** GA4 (`properties/553356497`, last 90 days) shows about 340 users.
  - 145 sessions are Singapore "Direct", which looks like bots. Real US organic is about 100 sessions.
  - Funnel: 9 `calculator_used`, 1 `backpay_calculator_used`, 1 `begin_checkout`, which ended in `begin_checkout_failed`. There is no sample big enough to judge any offer on.
- **Search visibility collapsed on 2026-08-18.**
  - GSC impressions fell from about 400–1,000/day to about 5/day. That date is the start of Google's August 2026 spam update, which focuses on scaled-content and doorway abuse.
  - Sitemap: 198 submitted, 0 indexed.
  - The site launched with about 200 templated URLs within two weeks of 2026-06-15:
    - state pages, about 620 words each
    - city pages, about 455 words
    - 51 wage-claim pages, which overlap the 51 state pages
    - 59 blog posts in 4 months
- **The Pro report is weak in its own right.**
  - It repackages free state-page data and is linked only from `/pricing`.
  - It fires no `purchase` event.
  - Its buyer's searches are tiny: "multi state payroll compliance" ~20/mo, "wage and hour compliance" ~50/mo.

**User decisions:** retire Pro and pivot, no paid ad spend, drop attorney lead-gen, aim for subscription revenue.

**Assumption challenged:** "change the persona because no upsell is feasible" is untested. Nobody has reached the upsell yet. Because organic is the only channel, every pivot depends on Phase 0.

## Research summary (sources are kept in the docs copy)
Keyword Planner via the Google Ads API works through the MCP. All numbers below are US average monthly searches.

| Opportunity | Demand | Competition / pricing | Verdict |
|---|---|---|---|
| Better Pro report (employer, multi-state) | 20–50 | n/a | **Kill** |
| Worker "Shift Log" subscription (standalone) | Calculators are huge (time card 201k, hours worked 135k). Paid-intent terms are tiny (shift tracker 140, work hours tracker app 320, overtime tracker app 20). | The free DOL Timesheet app and free WageWatch already cover paycheck checks against wage law. Trackers cost $20–40/yr, with complaints about price rises. Calculator SERPs belong to SaaS lead magnets (Hubstaff, Clockify). | **Not standalone.** Reuse it as a free tool that feeds the Claim Kit. |
| Attorney lead-gen | High CPCs ($13–30) | Bar-regulated | Dropped (user) |
| Labor-law posters | 880 for "labor law poster 2026", HIGH competition | PosterElite $8.99 per location per month, incumbents offer fine warranties | Only as an add-on |
| Wage-law data API | No search demand | Symmetry, APIVerve; enterprise sales | Not feasible with organic only |
| Tip-pool tool | 590 for "tip pool calculator" | Tiplo $44.99/mo | Later free calculator; legal nuance is risky |
| Gig tax/mileage tracker | Real (self-employment tax calculator 9.9k) | Everlance, Gridwise, Stride; needs a GPS app | Off-asset |
| Pay-stub generator | 27k | n/a | **Reject**: often used for fraudulent stubs |
| **Employer wage-change alerts per location** | Rides the "minimum wage by state" (18k) and "minimum wage 2027" (390) traffic, with a Jan-1 spike | Per-location pricing proven by PosterElite; Workstream is custom/enterprise | **Recommended subscription.** It reuses the dated, cited 50-state and city data and the existing `lib/pro-report.ts` renderer. |

## Recommended approach (phased and gated; nothing paid ships before traffic exists)

### Phase 0 — Spam-update recovery (prerequisite for everything else)
1. **Manual checks for the user.** Look in the GSC UI under Manual actions and Pages → "Why pages aren't indexed". The URL Inspection API rejects this property's permission, so these can't be checked through the API.
2. **One page per state instead of two.** Merge the `/wage-claim/[slug]` content into `/states/[slug]` as a "Recover unpaid wages" section, and 301 the old URLs.
   - Keep `/wage-claim` as a single hub with the back-pay calculator.
   - Add the redirects in `next.config` from a single map derived from `lib/states.ts`.
3. **City pages.** Keep only cities with a genuinely distinct local ordinance and enrich those: local enforcement office, scheduled increases, tipped rules. Noindex the rest and drop them from `app/sitemap.ts`. The criteria live in `lib/cities.ts` as a flag, not as hand-picked edits.
4. **Blog audit.** Produce a script-backed audit table (word count, intent overlap, self-promo) in the docs file.
   - Merge posts with duplicate intent and 301 them.
   - Delete self-promotional posts such as `is-the-wage-claim-kit-worth-it` and `free-paycheck-calculators-compared`.
   - Rewrite the surviving top posts in a human voice, with first-hand worked examples.
5. **Analytics.** Filter the Singapore bot traffic out of reporting (a GA4 data filter or segment). Keep only the `553356497` property. `552911439` is a stale duplicate.
6. **Checkpoint.** Measure GSC impressions 6 and 10 weeks after deploy, recorded in the docs file.
   - **Kill criterion:** under 100 impressions/day at week 10 means stop product investment and treat the domain as burned.

### Phase 1 — Retire Pro and lead-gen, fix the Kit checkout
**Remove:**
- Pro CTAs: `components/SiteHeader.tsx:41,64`, `components/SiteFooter.tsx:31`, `app/page.tsx:241`, and the Pro tier on `app/pricing/page.tsx`.
- `components/ProReportBuy.tsx`, `ReportStatePicker`, and `StateChecklist` if it's unused elsewhere.
- The `report` product from `app/api/checkout/route.ts`.
- The `STRIPE_PRICE_ID` usage.

**Keep:**
- `/pro-report?session_id=` delivery working (noindex) for any past buyers, because `lib/report-purchase.ts` and the webhook still verify them.
- The `lib/pro-report.ts` engine, which Phase 2 reuses.

**Lead-gen:**
- Delete `app/free-case-review`, `app/api/lead`, `components/CaseReviewForm.tsx`, `lib/lead-email.ts`, the `LEAD_*` vars in `.env.example`, and the `case_review_viewed` and `generate_lead*` events in `lib/analytics-events.ts`.
- 301 `/free-case-review` to `/wage-claim`.
- Make the Claim Kit the primary CTA in `components/BackPayResults.tsx` and `app/claim-kit/page.tsx:105`.

**Checkout and copy:**
- Investigate and fix the `begin_checkout_failed` path: `components/CheckoutButton.tsx` → `app/api/checkout/route.ts`, checking that production Stripe price IDs exist on Helm7.
- Pricing page becomes two tiers: Free and the $29 Claim Kit.
- Update `CLAUDE.md`, `README.md` and `CHANGELOG.md` to match the new funnel.

### Phase 2 — Validate the alerts subscription for free before building it
**"Wage-change alerts" free signup** (email only, no account):
- The user picks state(s) and optional cities and gets an email when a rate changes.
- It is surfaced on the state and city pages and in the minimum-wage calculator result, with one quiet module next to the rate.

**Storage and sending:**
- Subscribers live in Helm7 Postgres (one table: email, locations[], confirmed_at, unsubscribe token). It uses double opt-in through the existing `lib/openhelm-mail.ts`.
- New `lib/alerts.ts` holds pure logic (diffing scheduled changes per location) with tests. A new `app/api/alerts/{subscribe,confirm,unsubscribe}` route set wraps it.

**Data:**
- Add **future-dated, cited** rate schedules (2027 increases) to `lib/states-data.ts` and `lib/cities.ts` as a single `scheduled: [{effective, value, source}]` field. Pages, the calculators, the alerts and the report all read that one field.
- No numbers are added without a source.

**Gate to Phase 3:** at least 50 confirmed signups, with at least 15 tracking 2 or more locations, within 8 weeks of the Phase 0 recovery checkpoint. If the gate isn't met, stop at the free list and don't build billing.

### Phase 3 — Paid tier (only if the gate passes)
**What it is:** "WageCoach Watch", about $9/mo for up to 3 locations plus $3 per extra location (to confirm at gate time). It includes:
- multi-location change alerts with 60/30/7-day lead times
- a per-location compliance sheet rendered by the existing `lib/pro-report.ts` (minimum wage, tipped, OT, final pay, breaks, citations), refreshed when the data changes
- an annual "what changes Jan 1" brief

**How it's built:**
- Stripe subscriptions and the Customer Portal, extending `lib/stripe-purchase.ts`, `lib/stripe-webhook.ts` and `lib/event-ledger.ts` for `customer.subscription.*` events.
- Magic-link access tied to the subscriber email, so no passwords are needed.
- A Helm7 scheduled job sends the daily diff.

## Free worker tool (in parallel, low cost)
- Add a `time-card-calculator` to `lib/calculators.ts`, built on `lib/overtime.ts` for state daily and weekly OT.
- It handles lunch breaks and biweekly periods, and does URL hydration plus `replaceState` per convention.
- It feeds the back-pay calculator, which leads to the Kit.
- Target the long tail ("time card calculator with lunch" 6.6k, "biweekly time card calculator" 1.3k, "time card calculator california overtime"). Don't expect to rank for the head term.
- The sitemap picks it up automatically through the calculators registry.

## Verification
- `npm test` must pass. New tests:
  - redirect map (every old wage-claim and free-case-review URL resolves to a 301 to a live page)
  - sitemap excludes noindexed cities
  - pricing has no Pro tier
  - checkout rejects `report`
  - the `alerts.ts` diff (fuzz + hand cases)
  - the time-card engine (fuzz, with lunch/overnight edge cases)
  - the scheduled-rate field (every entry has a source and an ISO date)
- `npm run build` plus lint.
- A Haiku subagent runs E2E checks in the browser pane against the dev server:
  - the header has no Pro link
  - `/free-case-review` redirects
  - state page → back-pay → Kit checkout reaches Stripe test mode
  - alerts signup → confirm → unsubscribe works, with mail in a test inbox
  - the time-card calculator round-trips through the URL
  - mobile and dark mode render cleanly
- After deploy:
  - curl the 301s on production
  - resubmit the sitemap in GSC
  - record the baseline impressions in the docs file
- **Manual tests for the user:**
  - GSC Manual actions and Pages report
  - any real past Pro buyer link still opening
  - live-mode Stripe checkout once

---

## Execution status (2026-10-20)

All phases were built in one pass at the user's request ("carry out all phases now"), so the
Phase 2 → 3 signup gate was **not** applied: the paid tier shipped alongside the free one. The
gate numbers (50 confirmed signups, 15 multi-location in 8 weeks) remain the bar for judging it.

| Item | Status |
| --- | --- |
| Pro report retired, Claim Kit sole worker CTA | Done. Past buyers' `/pro-report` links still work |
| Attorney lead-gen removed | Done. `/free-case-review` → `/wage-claim` (308) |
| `/wage-claim/[state]` merged into `/states/[state]#wage-claim` | Done, 51 redirects |
| City pages | **Kept all 20 indexed** (each has its own ordinance). Enriched with a dated, sourced next-change notice and alerts signup instead of noindexing |
| Blog pruning | Done. 57 → 29 posts, 28 redirects (`docs/blog_audit.md`) |
| Time card calculator | Done |
| Cited 2026–27 schedule | Done. 50 entries; stale AK/DC/FL/OR/Portland rates fixed |
| Wage Watch free + paid | Done. Helm7 Postgres, Stripe subscription, cron route |
| GA4 bot filter (Singapore "Direct") | **Manual**: GA4 Admin → Data filters (no API for it here) |
| GSC manual-actions and Pages checks | **Manual**: Search Console UI |
| Stripe webhook registration + billing portal | **Manual**: see the README "Stripe webhook" section |

### Checkpoints to record here

- Week 6 and week 10 after deploy: GSC impressions per day (baseline about 5/day on 2026-10-18).
- Kill criterion: under 100 impressions a day at week 10 means stop product investment.
- Wage Watch: confirmed signups, multi-location share, paid conversions (GA4 `sign_up`, `purchase` with `item_id: wage_watch`).

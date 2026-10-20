# WageCoach — project context

**Check your pay. Recover what you're owed.** WageCoach is a U.S. wage & hour site that
helps workers find and recover unpaid wages. Next.js 16 (App Router) + React 19 +
Tailwind 4. Calculation engines are 100% client-side; no database.

## Positioning & strategy (the "why")

The free calculators attract a large **employee** audience (e.g. "overtime calculator",
"paycheck calculator" — hundreds of thousands of searches/mo). The paid offering monetizes
*that* audience at its highest-intent moment — **"am I owed back pay?"** — instead of the
low-volume employer buyer. Grounded in keyword research: wage theft ~5.4k/mo, back pay
calculator ~390, department of labor complaint ~2.4k, "wage claim [state]" (CA ~1.3k,
$11–18 CPC). Growth is **SEO + GEO** (answer-engine citations), which is why state pages
ship extractable answers + `HowTo`/`FAQPage` JSON-LD.

**The funnel (reset 2026-10-20, `docs/monetization_reset_plan.md`):** free calculator →
back-pay verdict → **$29 Claim Kit** (pre-filled demand letter + filing guide on a
Stripe-verified `/claim-kit` page). For employers, **Wage Watch**: minimum-wage change
alerts (free for 1 place, $9/mo for 10 + a compliance sheet), built on the cited schedule.
The $19 Pro report and the attorney lead-gen were retired; don't reintroduce them.

**Real constraint:** traffic, not offer. Google impressions fell ~99% on 2026-08-18 (August
spam update) after ~200 templated pages shipped in two weeks. Prefer fewer, stronger pages;
don't mass-generate programmatic content.

## Architecture map

- **Engines (`lib/`)** — cited, fuzz-tested, bulletproof against bad input:
  `federal.ts` (FLSA constants), `overtime.ts` (weekly + state daily OT, CA double time),
  `wage.ts` (tip credit, exempt test, PTO), `salary.ts`, `states-data.ts` / `state-extras.ts`
  / `states.ts` (50 states + DC), `cities.ts`.
- **Paid verification (`lib/`)**: `stripe-purchase.ts` is the one place a Checkout session is judged
  (paid + `payment` mode + that product's price); `kit-purchase.ts` and `report-purchase.ts` wrap it.
  The webhook is `stripe-webhook.ts` + `stripe-signature.ts` + `event-ledger.ts`.
- **Wage Watch (`lib/`)**: `wage-schedule-data.ts` (cited announced changes, the single source
  for upcoming-change notices and alerts), `wage-schedule.ts`, `locations.ts`, `watch-plan.ts`
  (plans/prices), `watch-store.ts` (Postgres + memory), `watch-service.ts`, `watch-billing.ts`
  (Stripe subscription), `watch-email.ts`. Postgres on Helm7; schema in `db/schema.sql`.
- **Redirects:** every permanent redirect lives in `lib/redirects.ts` (tested).
- **Back-pay offering (`lib/`)** — `backpay.ts` (inverse of the OT engine; FLSA 2/3-yr
  window + liquidated damages), `case-score.ts` (triage signal), `wage-claim-data.ts`
  (per-state filing agency/route/penalties), `backpay-url.ts` (case = shareable URL, no DB),
  `demand-letter.ts` (Claim Kit deliverable).
- **Routes (`app/`)** — `/` (recovery-led home), `/calculators/[slug]` (11 tools incl.
  `back-pay-calculator`, `time-card-calculator`), `/wage-claim` (estimator hub),
  `/states/[slug]` (rate sheet + `#wage-claim` filing guide), `/cities/[slug]`, `/wage-watch`
  (+ `/confirm`, `/manage`, dynamic/noindex), `/claim-kit` and `/pro-report` (force-dynamic,
  noindex, server-verified), `/pricing`, `/blog/[slug]`, `/methodology`, `api/checkout`,
  `api/stripe/webhook`, `api/watch/*`, `api/cron/watch-alerts`.

## Conventions

- Money math goes through `cents()`/`dollars()`; hours through `qty()`. Engines clamp all
  inputs (URL/API/fuzz safe) — never trust raw numbers.
- Shared UI: `components/ui.tsx` (Field/NumberField/Segmented/StateSelect) and
  `components/primitives.tsx` (Eyebrow/SectionHeading/Chip/MoreLink/LedgerTick). Reuse them.
- Design = payroll ledger: paper/ink-green/brass, Fraunces headings, Geist Mono for figures.
  Tokens in `app/globals.css`. No decorative `→` arrows; the one "read more" is `MoreLink`.
- Calculators hydrate inputs from the URL on mount and `replaceState` on change (shareable
  results); follow that pattern for new tools.
- **Tests are mandatory** (`npm test`): hand-written + a fuzz suite. Add engine tests for any
  new engine (`test/*.test.mts`, zero-dep `_assert.mts`). Keep files ≤ ~225 lines.

## Guardrails

- Everything is **general information / self-help, not legal advice**; the site is **not a
  law firm**. Keep that disclaimer on every estimate, the kit, and lead-gen. Back-pay figures
  are conservative estimates.
- Never commit secrets. Stripe/webhook keys live in `.env.local` (gitignored) and the Helm7 product's variables.
- Wage Watch alerts are a statement of fact to employers: only add schedule entries with an
  official source, never an estimated indexed figure.
- Wage figures are current for **2026** and cited; update with sources, not guesses.

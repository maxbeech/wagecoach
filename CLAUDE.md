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

**The funnel:** free calculator → back-pay verdict (estimate + case-strength signal) → two
CTAs: **$29 Claim Kit** (pre-filled demand letter + filing guide, delivered on a
Stripe-verified `/claim-kit` page) and a **free attorney case review** (`/free-case-review`
→ `LEAD_WEBHOOK_URL` lead-gen). Legacy **$19 employer report** is a secondary product.

A suggested future second act (not built) is a recurring employer **labor-law-poster**
compliance product reusing the 50-state dataset.

## Architecture map

- **Engines (`lib/`)** — cited, fuzz-tested, bulletproof against bad input:
  `federal.ts` (FLSA constants), `overtime.ts` (weekly + state daily OT, CA double time),
  `wage.ts` (tip credit, exempt test, PTO), `salary.ts`, `states-data.ts` / `state-extras.ts`
  / `states.ts` (50 states + DC), `cities.ts`.
- **Back-pay offering (`lib/`)** — `backpay.ts` (inverse of the OT engine; FLSA 2/3-yr
  window + liquidated damages), `case-score.ts` (triage signal), `wage-claim-data.ts`
  (per-state filing agency/route/penalties), `backpay-url.ts` (case = shareable URL, no DB),
  `demand-letter.ts` (Claim Kit deliverable).
- **Routes (`app/`)** — `/` (recovery-led home), `/calculators/[slug]` (9 tools incl.
  `back-pay-calculator`), `/wage-claim` + `/wage-claim/[state]` (51 programmatic guides),
  `/free-case-review`, `/claim-kit` (force-dynamic, noindex, server-verified), `/pricing`,
  `/states/[slug]`, `/cities/[slug]`, `/blog/[slug]`, `/methodology`,
  `api/checkout` (Stripe), `api/lead` (lead forward).

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
- **Attorney lead-gen is bar-regulated** (referral-fee/advertising rules vary by state) —
  confirm the model with counsel before scaling Phase 2.
- Never commit secrets. Stripe/webhook keys live in `.env.local` (gitignored) and Vercel env.
- Wage figures are current for **2026** and cited; update with sources, not guesses.

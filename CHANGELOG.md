# Changelog

## Unreleased — Production readiness + Claim Kit improvements

- **Rebrand:** WageCalc HQ → **WageCoach** across all public copy, code, wordmark
  (`Logo`, favicon, OG image), `package.json`, emails (`hello@wagecoach.com`) and
  the canonical host (`wagecoach.vercel.app`). Repo + Vercel project renamed.
- **Positioning:** home, OG image, `lib/site.ts`, README and `CLAUDE.md` reframed
  to recovery-led — "Are you owed back pay? Find out to the cent." — with a new
  back-pay band on the homepage. The calculators remain the top-of-funnel.
- **Offering live:** Stripe products/prices created (test + live); the $29 Claim
  Kit now delivers — `app/claim-kit/page.tsx` verifies the Checkout session
  server-side (no DB) and renders a pre-filled demand letter + state filing guide
  from `lib/demand-letter.ts`. Checkout carries the case into the success URL.
- Env documented: `STRIPE_SECRET_KEY`, `STRIPE_KIT_PRICE_ID`, `STRIPE_PRICE_ID`,
  `NEXT_PUBLIC_SITE_URL`, `LEAD_WEBHOOK_URL`. Test keys in gitignored `.env.local`.
- **Demand-letter personalisation** (`components/ClaimKitPersonaliser.tsx`) — an
  interactive form on the Claim Kit success page lets the buyer fill in their name,
  address, phone, email, employer details and dates. The letter updates live in the
  browser; `personaliseLetter()` in `lib/demand-letter.ts` handles substitution.
  Zero-bracket counter shows how many placeholders remain before printing.
- **Analytics + Speed Insights** wired into `app/layout.tsx` — `@vercel/analytics`
  and `@vercel/speed-insights` were already in `package.json` but unused.
- **Vercel production env vars** set via CLI: `NEXT_PUBLIC_SITE_URL`,
  `STRIPE_KIT_PRICE_ID`, `STRIPE_PRICE_ID` (production environment).

## Earlier — Wage-claim / back-pay offering

A new paid direction: monetize the high-intent employee traffic the calculators
already attract ("I think I'm underpaid") rather than the low-volume employer
buyer. Grounded in keyword research (wage theft 5.4k/mo, back pay calculator
390/mo, department of labor complaint 2.4k/mo, "wage claim [state]" — CA 1.3k).

### Added

- **Back-pay engine** (`lib/backpay.ts`) — the inverse of the overtime engine.
  Estimates unpaid wages from what you earned vs. what you were paid, anchored to
  the FLSA recovery window (2 years, 3 if willful) plus equal liquidated damages.
- **Case-strength signal** (`lib/case-score.ts`) — a transparent triage score
  from the size, duration and recoverability of the shortfall.
- **Per-state wage-claim data** (`lib/wage-claim-data.ts`) — filing agency,
  official route and notable state penalties for all 50 states + DC.
- **Shareable case file** (`lib/backpay-url.ts`) — the estimate encodes to the URL,
  so a case is a link (no account/DB), matching the pay-calculator pattern.
- **Back-pay calculator** (`/calculators/back-pay-calculator`) with a verdict that
  surfaces the estimate, the case-strength signal, and CTAs to the Claim Kit and a
  free attorney review (`components/BackPayCalculator.tsx`, `BackPayResults.tsx`).
- **`/wage-claim` + `/wage-claim/[state]`** — index plus 51 programmatic state
  guides with an extractable answer, filing route, and `HowTo` / `FAQPage` /
  `BreadcrumbList` JSON-LD for SEO/GEO.
- **Free attorney case review** (`/free-case-review`, `components/CaseReviewForm.tsx`)
  posting to `app/api/lead/route.ts` (forwards to `LEAD_WEBHOOK_URL`, no storage).
- **$29 Claim Kit** as a second Stripe product; `app/api/checkout/route.ts` now
  takes `POST { product: "kit" | "report" }` (`STRIPE_KIT_PRICE_ID`).
- `test/backpay.test.mts` — 32 checks across the engine, score, URL and data.

### Changed

- Pricing page now shows three tiers: Free, Claim Kit ($29, workers), Pro ($19,
  employers). Header nav gains "Unpaid wages"; sitemap covers the new routes.

### Notes

- All figures are estimates / general information, not legal advice. Attorney
  lead-gen is bar-regulated; confirm the model with counsel before going live.

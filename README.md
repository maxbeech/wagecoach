# WageCalc HQ

Free U.S. **wage & hour calculators** — overtime and time-and-a-half pay, minimum
wage by state, tipped-wage checks, exempt-salary tests, PTO payout and
final-paycheck deadlines. Built on the federal **FLSA** and **2026** state rules
for all 50 states and DC.

Live: https://wagecalchq.vercel.app

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- 100% client-side calculation engines (no DB needed for the free tools)
- tsx unit tests

## What's real

The engines are real and cited, not rules of thumb:

- **`lib/federal.ts`** — FLSA constants ($7.25 min wage, $2.13 tipped cash wage,
  1.5× overtime over 40, $35,568 exempt threshold).
- **`lib/overtime.ts`** — FLSA weekly overtime + state daily overtime (CA/AK/NV/CO),
  California double time and the 7th-consecutive-day rule, with weekly reconciliation.
- **`lib/states-data.ts`** — 2026 minimum & tipped wages and daily-overtime rules,
  cross-checked across the U.S. DOL, GovDocs, Paycom and Paycor.
- **`lib/state-extras.ts`** — final-paycheck deadlines and meal/rest-break rules,
  compiled from state labor departments and reputable compliance references.
- **`lib/wage.ts`** — tip-credit check, exempt salary test, PTO payout.

Every figure is current for 2026 and surfaced with a "confirm with your state labor
department" disclaimer. See `/methodology` for sources.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # engine + data + URL tests
npm run lint
```

## Pro tier

A one-time **$19 multi-state compliance report** PDF. The Stripe checkout route
(`app/api/checkout/route.ts`) degrades gracefully when `STRIPE_SECRET_KEY` /
`STRIPE_PRICE_ID` env vars are absent.

> General information, not legal or tax advice.

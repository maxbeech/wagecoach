# WageCoach

**Check your pay. Recover what you're owed.** WageCoach helps U.S. workers find
unpaid wages and get them back. It pairs free **wage & hour calculators** — overtime
and time-and-a-half pay, minimum wage by state, tipped-wage checks, exempt-salary
tests, PTO payout and final-paycheck deadlines — with a **back-pay estimator** and
step-by-step **wage-claim** help for every state, all built on the federal **FLSA**
and **2026** state rules for all 50 states and DC.

**Positioning (reset 2026-10-20, see `docs/monetization_reset_plan.md`):** the free
calculators bring workers in; the paid step for them is the **$29 Claim Kit** (a pre-filled
demand letter + filing guide) at the "am I owed back pay?" moment. For employers there is
**Wage Watch**: email alerts before the minimum wage changes in their states and cities,
free for one place and **$9 a month** for up to 10 with a printable compliance sheet. The
$19 Pro report and the free attorney case review (lead-gen) were retired.

Live: https://www.wagecoach.com

## Content maintenance

Blog guides are defined in `lib/posts.ts`. Substantive refreshes should preserve the post schema, use primary sources for time-sensitive wage-law claims, and update the post date only when the reader-facing content materially changes.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- 100% client-side calculation engines (no DB needed for the free tools)
- tsx unit tests

## Design

The identity is a working payroll ledger: warm paper, ink-green, a brass accent,
hairline rules and tabular figures. Headings use **Fraunces** (an editorial
serif), with **Geist** for UI and **Geist Mono** for every dollar figure (loaded
via `next/font`). Design tokens live in `app/globals.css` (`paper`, `ink`,
`muted`, `faint`, the `brand-*` green scale, `forest`, `gold-*`, plus the
`ledger-grid`, `leader` and `shadow-card` utilities). Shared presentational
atoms are in `components/primitives.tsx`; the homepage hero is a live,
draggable paystub (`components/HeroPaystub.tsx`) that runs the real overtime
engine, so even the illustration shows genuine numbers.

The page is composed to break the "metronome" of equal-weight sections: an
annotated **interactive overtime bar** (`components/illustrations/OvertimeBar.tsx`,
drag the week past 40 and the premium lights up), a ledger-style index of the
calculators, and a full-bleed dark **wage spectrum**
(`components/illustrations/WageSpectrum.tsx`, every state plotted by its real 2026
minimum wage with a live rate sheet). Both illustrations are driven by the actual
engines, never mock data. Motion is opt-out aware: `components/Reveal.tsx` adds
scroll-entrance fades and `useCountUp` tallies dollar figures, both disabled under
`prefers-reduced-motion`. The single "read more" affordance is `MoreLink` (a
chevron + underline reveal) — there are no decorative `→` arrows anywhere.

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
- **`lib/wage.ts`** — tip-credit check, exempt salary test, PTO payout. The
  exempt test applies the **higher state thresholds** (CA/AK/ME by formula; NY,
  WA and CO by their verified 2026 figures) and returns a neutral "confirm"
  verdict where the answer is location-dependent (e.g. NY between the
  rest-of-state and downstate figures) rather than a false "exempt".
- **`lib/salary.ts`** — salary↔hourly converter (annual / monthly / biweekly / hourly).
- **`docs/seo_recovery_2026_10.md`** — the spam-update diagnosis, family verdicts and change log.
- **`lib/cities.ts`** — 2026 minimum wage for 20 major cities (Seattle, NYC, LA, SF, Chicago…), each cited.
- **`lib/backpay.ts`** — back-pay estimator. The inverse of the overtime engine: given
  what you should have earned and what you were paid, it estimates the unpaid wages and
  the FLSA recovery window (2 years, or 3 if willful) plus equal liquidated damages.
- **`lib/case-score.ts`** — a transparent "case-strength" triage signal from the size,
  duration and recoverability of the shortfall (not a legal opinion).
- **`lib/wage-claim-data.ts`** — per-state wage-claim agency, official filing route and
  notable state penalties, used by the `#wage-claim` section of each state page.

The engines are covered by hand-written unit tests **plus a fuzz suite** that sweeps every
state × rate × hours combination (33k+ cases / 150k+ assertions) to guarantee no NaN, no
negative pay, and that totals always reconcile.

Every figure is current for 2026 and surfaced with a "confirm with your state labor
department" disclaimer. See `/methodology` for sources.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # engine + data + URL tests
npm run lint
```

## Analytics

GA4 through `lib/openhelm-analytics.tsx` (the shared `openhelm-analytics` service). An unset
`NEXT_PUBLIC_GA_MEASUREMENT_ID` means no script and no events. There are no accounts, so no
`oh_user_ref`: a visitor is the anonymous GA client. Event names and failure reasons live in
`lib/analytics-events.ts`. Browser requests to `/api/checkout` and `/api/watch/*` give up after
`CLIENT_REQUEST_TIMEOUT_MS` (20 s) and report `reason: timeout`, so a hung request never leaves the
button stuck. To check a change, open GA DebugView on a build with the id set and walk
a calculator edit, the back-pay estimate, Claim Kit checkout and a Wage Watch signup (`sign_up`); each step
should show its event and no `*_failed` sibling. `purchase` is sent from `/claim-kit`, and from
`/wage-watch/manage` after an upgrade, once Stripe confirms the session. `session_id` appears in that page's URL, so add it under GA Admin, Data
collection, Data redaction, URL query parameter keys.

## Monitoring

Errors, logs and user feedback go to the Sentry project `wagecoach_web` (org `maxed-labs`) when
`NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` are set (see `.env.example`; `NEXT_PUBLIC_` is read at build time).

- One shared options helper, `lib/sentry-options.ts`, feeds the browser, server and edge inits.
- `lib/scrub.ts` scrubs events, logs, breadcrumbs and transactions: emails, phone numbers, tokens, API keys,
  secret-looking fields and query strings. It is linear-time, truncates long text, and fails closed (drops the
  item if scrubbing throws). Feedback is scrubbed too; only the reporter's own name and email are kept.
- Server code reports through `lib/observability.ts`; context is ids, codes and counts only.
- The "Feedback" control (header, mobile menu, footer) opens Sentry's form. Reports tunnel through a random route.
- The old crawler filter (`lib/sentry-client-filter.ts`) still drops the synthetic `script.js` parse error.

The Sentry scrubber (`lib/scrub.ts`) redacts secrets of any length, backs up to a clean boundary when it truncates, and fails closed; its regression tests are in `test/scrub-hardening.test.mts`.

## Paid offering

Two things are sold, both through `app/api/checkout/route.ts` (`POST { product }`):

- **Claim Kit, $29 one-time** (`product: "kit"`, `STRIPE_KIT_PRICE_ID`). For workers. The
  funnel is the free back-pay estimator (`/wage-claim`, `/calculators/back-pay-calculator`,
  each state page's `#wage-claim` section): the verdict shows the estimate, a case-strength
  signal and one CTA, the Kit. After payment Stripe returns to **`/claim-kit`**, a
  `force-dynamic`, noindex page that verifies the session server-side (paid, `mode: payment`,
  the Kit's price; `lib/stripe-purchase.ts`) and renders `lib/demand-letter.ts`.
- **Wage Watch, $9 a month** (`product: "watch"` + the subscriber's manage-link `token`). For
  employers. Plans, limits and price live in `lib/watch-plan.ts` and are sent to Stripe as
  `price_data`, so no dashboard price has to match. See "Wage Watch" below.

The **Pro report** ($19) is no longer sold. `/pro-report` and the webhook's report branch stay
so past buyers' links keep working; `lib/pro-report.ts` now also renders the Wage Watch
compliance sheet. The free attorney case review is gone (`/free-case-review` 308s to `/wage-claim`).

When Stripe or a price is missing, `/api/checkout` answers **503** with `reason: "not_configured"`
and a message naming the product; the server log says which variable is missing.

### Wage Watch

- **Data.** `lib/wage-schedule-data.ts` holds every announced, cited minimum-wage and tipped-wage
  change (states and the 20 cities) from 2026-07-01 to 2027-12-31. Only official figures; an
  inflation-indexed rate that hasn't been published is left out. `lib/wage-schedule.ts` answers
  "what's next here", "what is due today" and which reminder bucket applies.
- **Signup.** `/wage-watch` (and a compact form on every state and city page) posts to
  `/api/watch/subscribe`. Double opt-in: the email links to `/wage-watch/confirm`, which needs a
  button press (mail scanners pre-open links). A signup for an already-active email changes
  nothing; it mails that person a fresh link instead, and signups are throttled to one mail a minute.
- **Account.** No passwords. Each email carries a manage link with a random token; only its sha256
  is stored (`lib/watch-store.ts`). `/wage-watch/manage` edits places (capped by plan), upgrades,
  opens the Stripe billing portal and unsubscribes.
- **Billing.** Subscription Checkout tagged `wagecoach_product=wage_watch`. On return the manage
  page activates the plan; the webhook does the same and mirrors `customer.subscription.updated/deleted`.
  The plan always follows the subscription's live status read from Stripe, so an old session
  can't re-activate a cancelled plan.
- **Alerts.** `GET /api/cron/watch-alerts` (Bearer `CRON_SECRET`), called daily by a Helm7 cron
  service. Reminder buckets per plan (free: 30 days and day-of; paid: 60/30/7 and day-of); a
  late subscriber gets one timely notice, not a burst. `watch_alerts_sent` makes each alert go
  out once; a failed send is given back for the next run. `?date=YYYY-MM-DD` re-runs a day.
- **Storage.** Helm7 Postgres (`db_krt6c38e741vwez01m4k`, `DATABASE_URL`). Schema: `db/schema.sql`,
  applied through the Helm7 MCP `database_execute`.

### Environment

| Var | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe API key (test `sk_test_…` for dev, live in prod). |
| `STRIPE_KIT_PRICE_ID` | Price id for the $29 Claim Kit. |
| `STRIPE_PRICE_ID` | Retired Pro report price; only for past buyers' delivery. Unset = report events ignored. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret (`whsec_…`) of the webhook endpoint below. Without it the webhook answers 503. |
| `NEXT_PUBLIC_SITE_URL` | Base for Stripe return URLs and links in email. |
| `DATABASE_URL` | Postgres for Wage Watch (Helm7 sets it). Unset = signups answer "not configured". |
| `CRON_SECRET` | Bearer secret for `/api/cron/watch-alerts` (created by Helm7 with the cron service). |
| `OPENHELM_API_KEY`, `OPENHELM_MAIL_INBOX_ID` | OpenHelm Mail, for confirmation and alert emails. |

Local dev: keys in `.env.local` (gitignored), Stripe **test** keys there; live values only in the
Helm7 product's variables.

### Local database

```bash
docker run -d --name wagecoach-dev-pg -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=wagecoach -p 127.0.0.1:55491:5432 postgres:18-alpine
```

Apply `db/schema.sql`, set `DATABASE_URL=postgres://postgres:devpass@127.0.0.1:55491/wagecoach`
in `.env.local`, and run `TEST_DATABASE_URL=… npm test` to include the Postgres store tests.

### Stripe webhook

`POST /api/stripe/webhook` (`lib/stripe-webhook.ts`). Register it in Stripe at
`https://www.wagecoach.com/api/stripe/webhook` for `checkout.session.completed`,
`checkout.session.async_payment_succeeded`, `customer.subscription.updated` and
`customer.subscription.deleted`, then set that endpoint's signing secret as `STRIPE_WEBHOOK_SECRET`.

Per event: verify the signature on the raw body (5 minute window); route Wage Watch objects (by
metadata tag) to `lib/watch-billing.ts`; otherwise, if `STRIPE_PRICE_ID` is set, run the Pro report
safety net (re-read the session, check paid + one-time + that price, email the report link). Any
failure answers 500 so Stripe retries. Event ids are claimed in the `stripe_events` table
(`pgLedger` in `lib/event-ledger.ts`) when `DATABASE_URL` is set, so repeats are skipped across
restarts; without a database it falls back to process memory.

### SEO/GEO

After the August 2026 spam update (impressions fell from about 500 to about 5 a day on 2026-08-18),
the site was consolidated: the 51 `/wage-claim/[state]` pages merged into `/states/[state]#wage-claim`
(one page per state, with `HowTo` + `FAQPage` JSON-LD), the blog went from 57 posts to 29
(`docs/blog_audit.md`), and every removed URL 308s through `lib/redirects.ts`
(`test/redirects.test.mts` checks each target is live). State and city pages now carry dated,
sourced "next change" notices from the schedule.

> Self-help information, not legal advice, and not a law firm.

## Canonical host

`lib/site.ts` sets `SITE.url` to `https://www.wagecoach.com` — the wired custom
domain, which is what actually serves the site. It drives every canonical tag,
the sitemap, robots and all JSON-LD URLs. The apex `wagecoach.com` 308-redirects
to `www.wagecoach.com`.

## GEO surfaces (AI answer engines)

- `public/llms.txt` — machine-readable overview of the product and its real
  routes, per the [llms.txt](https://llmstxt.org/) convention.
- `app/robots.ts` allows all user agents (including GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot) by not restricting anything.
- JSON-LD: `Organization` + `WebSite` on the homepage, `SoftwareApplication`
  on every calculator and `/pricing` (with `Offer`s matching the visible $0 /
  $29 / $19 prices), `Article` on blog posts, `FAQPage` wherever `Faq` is used,
  `HowTo` + `BreadcrumbList` on `/wage-claim/[state]`, `BreadcrumbList` on
  `/calculators/[slug]`, `/states/[slug]` and `/cities/[slug]`.

> General information, not legal or tax advice.

## Hosting

Runs on Helm7 (`wagecoach` product, Falkenstein), built from `master` on every push. There is no Vercel project any more; `npm test` fails if a `@vercel/*` package or a `vercel` CLI script comes back.

# Changelog

## 2026-10-20: Official sources only, webhook live

- Final-pay and break rules in `lib/state-extras.ts` now cite U.S. DOL and state `.gov` pages only
  (Rippling, Patriot Software, TimeClick, Winthrop and minimum-wage.org removed; Vermont cites 21
  V.S.A. § 304). `test/state-extras-sources.test.mts` fails if a non-official source returns.
- `STRIPE_WEBHOOK_SECRET` set on Helm7 production (live-mode endpoint).

## 2026-10-20: Monetization reset (Pro report and lead-gen out, Wage Watch in)

Why: nobody converted to Pro, but the data said the offer wasn't the main problem. GA4 showed about
100 real US organic sessions in 90 days and one checkout attempt (it failed). Google impressions
fell from about 500 a day to about 5 on 2026-08-18, the start of the August spam update. Keyword
Planner put the Pro report's buyer at 20 to 50 searches a month. Full analysis:
`docs/monetization_reset_plan.md`.

- **Retired:** the $19 Pro report (no longer sold; past buyers' `/pro-report` links still work) and
  the free attorney case review (`/free-case-review`, `/api/lead`, `CaseReviewForm`, `lead-email`).
  The back-pay verdict now has one CTA, the $29 Claim Kit. Header CTA is "Check my pay".
- **Wage Watch (new):** minimum-wage change alerts for employers. Free for one place, $9 a month for
  up to 10 with 60/30/7-day reminders and a printable compliance sheet (reuses `lib/pro-report.ts`).
  Double opt-in, token manage links (only hashes stored), Stripe subscription with live-status
  checks, billing portal, daily cron with an idempotent sent-log. Helm7 Postgres added; schema in
  `db/schema.sql`. Signup on `/wage-watch` and on every state and city page.
- **Cited schedule:** `lib/wage-schedule-data.ts` lists 50 announced changes (37 state, 13 city)
  from July 2026 to December 2027, each with an official source. It also caught stale current
  rates, now fixed: AK $14.00, DC $18.40 (tipped $10.30), FL $15.00 (tipped $11.98), OR $15.55,
  Portland Metro $16.80, and Nevada's note (fixed in statute, not indexed).
- **Time card calculator (new):** `/calculators/time-card-calculator`, built on the overtime engine,
  weekly or biweekly, lunch breaks, overnight shifts, state daily OT and CA double time.
- **Spam-update recovery:** `/wage-claim/[state]` merged into `/states/[state]#wage-claim` (one page
  per state), the blog cut from 57 posts to 29 with merges and rewrites (`docs/blog_audit.md`), and
  every removed URL 308s through `lib/redirects.ts`.
- **Webhook:** routes Wage Watch events by metadata tag and mirrors subscription changes. Event ids
  now go to a durable `stripe_events` table when `DATABASE_URL` is set. `STRIPE_PRICE_ID` is no longer
  required.
- **Analytics:** `generate_lead*` and `case_review_viewed` replaced by `sign_up` / `sign_up_failed`.
- **Tests:** new `watch`, `watch-pg` (Postgres, opt-in via `TEST_DATABASE_URL`), `redirects`,
  `timecard` and `posts` suites. Checkout, webhook, analytics and data tests follow the changes.

## 2026-10-19: Journey instrumentation, stall and lead-delivery fixes

Audit of the User journeys table against the code. All nine work-list events were already sent from the right components; this release closes the gaps found while checking them.

- **Stalls.** The Claim Kit button and the case-review submit had no request limit, so a hung `/api/checkout` or `/api/lead` left the button on "Starting…" or "Sending…" for ever with no event. Both now abort after 20 s and report `reason: timeout` on `begin_checkout_failed` / `generate_lead_failed` and to Sentry.
- **Lead delivery.** `/api/lead` ran the email and the partner webhook in one `Promise.all`. A webhook that threw discarded an email that had already been sent, so the user was told to email support. Each channel now settles on its own and the partner webhook has a 15 s limit.
- **Not sent, and why.** WageCoach has no accounts and no internal user id, so `oh_user_ref`, `oh_plan` and `oh_is_test` are not set. There is also no consent mechanism in the product, so nothing can be gated on consent. Both are product decisions, not instrumentation.
- **Tests.** `test/journey-instrumentation.test.mts` pins the event list to the User journeys table, checks the timeout reason against a real `AbortSignal.timeout`, and drives the real `/api/lead` handler through each channel outcome. `observability` assertions follow the new scope names.

## 2026-10-10: Pro report delivery

The $19 Pro report charged buyers and delivered nothing: checkout returned to `/pricing?status=success`, which nothing handled, and there was no webhook.

- **Verified delivery.** Checkout now returns to `/pro-report?session_id=...`, a `force-dynamic`, noindex page. It asks Stripe for the session and unlocks only when it is `paid`, `mode: payment` and holds `STRIPE_PRICE_ID`. Anything else, or an unconfigured Stripe, stays locked with a plain reason (`lockedCopy`). Not added to the sitemap, the same as `/claim-kit`.
- **The report is real output.** `lib/pro-report.ts` builds it from the same state data as the free pages: per state, minimum wage, weekly and daily overtime, tipped rules, final pay and meal/rest breaks, with numbered sources. The buyer picks states on `/pricing`; they travel in the Stripe session's `metadata[states]`, so the link is the session id alone. Print / Save as PDF is the download. Sessions paid before this change have no states, so the page asks for them once.
- **One verification module.** `lib/stripe-purchase.ts` now holds the rules the Claim Kit used (paid, price) and adds `mode === "payment"`. `lib/kit-purchase.ts` is a thin wrapper, so the kit also refuses non-payment sessions. A malformed session id is refused before it reaches Stripe.
- **Webhook.** `POST /api/stripe/webhook` handles `checkout.session.completed` and `checkout.session.async_payment_succeeded`: signature on the raw body (hand-rolled, checked against a vector from the official Stripe library), session re-read from Stripe, ownership by price id, then the buyer is emailed their report link. Failures answer 500 so Stripe retries. Event-id dedupe is in-process only; the durable table is proposed in the README, not created. The email carries an idempotency key from the session id.
- **Checkout, not configured.** `/api/checkout` now answers 503 with `reason: "not_configured"` and a message naming the product, instead of a 200 that read as success. The server log names the missing variable. The report needs at least one state (400 otherwise).
- **New env var:** `STRIPE_WEBHOOK_SECRET`. Stripe vars are now listed in `.env.example`.
- **Tests.** Added `stripe-purchase`, `pro-report`, `pro-report-page`, `stripe-signature`, `stripe-webhook`, `stripe-webhook-route` and `checkout-route`; the kit and observability tests follow the moved code.
- Not done: a GA `purchase` event for the report (it can now be added, since the session is verified), and revoking a link after a refund.

## 2026-10-07: Blog authorship signals
- Blog posts now show a visible byline and publish date, carry author meta, and emit
  og:url, og:site_name, article:published_time and article:author. Article JSON-LD still
  names an Organization author until a real Person is chosen.

## 2026-10-07: GEO machine-readability

- robots.txt now names GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended and CCBot with an explicit allow.
- Blog posts emit `BreadcrumbList` JSON-LD alongside `Article`.
- Sitemap `lastmod` (`SITE.updated`) bumped from 2026-06-15 to 2026-10-07.

## 2026-10-07: Sentry scrubber security pass

- **Long secrets.** JWTs, bearer tokens, vendor keys (`sk_`, `whsec_`, `hlm_sk_`, `sntrys_`) and `key=value` secrets of any length are now redacted whole. The old bounded patterns left the tail of anything longer than their limit.
- **Truncation.** The 10k cut backs up to the previous delimiter, so half a secret can never survive at the boundary.
- **Encodings, URLs and key names.** URL queries and fragments (OAuth and magic-link tokens), percent-encoded emails, `Bearer%20...`, `token%3D...`, escaped JSON, `Authorization: Basic ...`, connection-string credentials and keys such as `passwd`, `pwd`, `jwt` and `Set-Cookie` are covered at any depth.
- **Fail closed, no bypass.** Events, transactions, breadcrumbs and logs are dropped if scrubbing throws. A second deep pass scrubs stack-frame vars, spans, contexts and tags, feedback events included (only the reporter's own `contexts.feedback` and user are kept).
- **Tests.** `test/scrub-hardening.test.mts` covers long JWTs, varied key lengths, secrets straddling the truncation boundary, hostile 20k strings, key variants and fail-closed behaviour.

## Unreleased — Sentry feedback events no longer bypass the scrubber

- Feedback events are now scrubbed like any other event; only the reporter's own `contexts.feedback` and user fields are kept. Tests added for it and for throwing scrubbers dropping transactions, logs and breadcrumbs.

## Unreleased — Sentry to the Maxed Labs standard

- Logs on (`enableLogs`, console forwarded), one shared fail-closed scrubber for events, logs, breadcrumbs and transactions, with tests including an adversarial long string.
- Errors become Issues: `global-error`, a segment `error.tsx`, `onRequestError`, and the checkout, lead, Stripe-verification and form catch blocks now report through `captureServerError` / `captureClientError` (ids only).
- A visible Feedback control in the header and footer replaces the floating Sentry button; reports go through a tunnel route. Source maps upload when `SENTRY_AUTH_TOKEN` is set.

## Unreleased — instrumented user journeys for OpenHelm

- **Refreshed the shared client** (`lib/openhelm-analytics*`). The old copy pushed plain arrays into `dataLayer`, which gtag.js silently ignores, so no event or page view was ever sent. The current one pushes `arguments` objects and adds `identify()` (unused here: there are no accounts).
- Events, all named in `lib/analytics-events.ts` and sent through `lib/analytics-track.ts`: `calculator_used` (first edit of any calculator, with the tool), `backpay_calculator_used`, `begin_checkout`, `checkout_cancelled`, `purchase`, `case_review_viewed`, `generate_lead`, and the failure siblings `begin_checkout_failed`, `purchase_confirmation_failed`, `generate_lead_failed`, each with a short code `reason` and never free text.
- `purchase` fires on `/claim-kit` only after the server has asked Stripe and confirmed a paid session holding the Kit price. `value` is what Stripe charged, and `transaction_id` is a one-way hash, not the Stripe session id. The verification moved from the page into `lib/kit-purchase.ts` unchanged in behaviour, so its rules and failure reasons are tested.
- The $19 report has no purchase event: its return URL (`/pricing?status=success`) is not verified against Stripe, so a `purchase` there would count anyone who typed the URL.
- The existing server-side `lead_delivered` Measurement Protocol event is unchanged.
- No Content-Security-Policy exists in this repo (`next.config.ts`, no middleware), so nothing blocks googletagmanager.com or google-analytics.com from here.

## Unreleased — moved from Vercel to Helm7

- Removed `@vercel/analytics` and `@vercel/speed-insights`: they report nothing off Vercel and shipped dead script to every visitor. Traffic is measured by the GA4 tag that was already there. Removed the `deploy` script that ran the Vercel CLI. `test/no-vercel.test.mts` keeps both out.

## Unreleased — Sentry synthetic crawler error filtering

- Ignore the exact `SyntaxError: Invalid or unexpected token` signature emitted
  by crawler-owned `script.js` files (`app:///…/script.js:1:2`). This keeps
  Sentry focused on actionable application errors while preserving other
  JavaScript failures, including application `SyntaxError`s.

## 2026-08-26

- Refreshed the unpaid-wage demand-letter guide with a records checklist, settlement cautions, retaliation guidance, and current U.S. Department of Labor sources.
- Refreshed the on-call-pay guide with a direct answer and the DOL's current hours-worked guidance.

## Unreleased — GEO audit fixes

- **`llms.txt` added** (`public/llms.txt`): a machine-readable summary of what
  WageCoach is, plus links to every real route (tools, wage-claim guides,
  state/city data, blog, pricing, methodology) for AI answer engines. Was
  previously 404.
- **Machine-readable pricing (`/pricing`):** added a `SoftwareApplication` +
  `Offer[]` JSON-LD block with the free ($0), Claim Kit ($29) and Pro report
  ($19) tiers, matching the prices rendered on the page. This was the gap
  flagged by the 2026-07-10 SEO audit ("missing SoftwareApplication schema") —
  calculators and the homepage already emitted a $0 `Offer`, but nothing
  reflected the two paid products.
- **Site identity JSON-LD:** added `Organization` and `WebSite` schema to the
  homepage so answer engines can resolve "WageCoach" as an entity, alongside
  the existing `WebApplication` block.
- **Blog `Article` schema:** added `image` (the post's real hero image) and
  `mainEntityOfPage`.
- **README:** corrected the stale "apex not connected" canonical-host note
  (the custom domain has been wired for a while — `wagecoach.com` 308s to
  `www.wagecoach.com`) and documented the GEO surfaces above.

## Unreleased — Production readiness + Claim Kit improvements

- **Canonical host live:** `lib/site.ts` now points at `www.wagecoach.com` (the
  wired custom domain) instead of the Vercel host, so canonical tags, sitemap,
  robots and JSON-LD all reference the public domain. Checkout fallback host
  updated to match.
- **Lead delivery via Resend:** `app/api/lead/route.ts` now emails each
  free-case-review lead through Resend (`RESEND_API_KEY`, no SDK — raw `fetch`),
  with `reply_to` set to the worker. The `LEAD_WEBHOOK_URL` path is preserved, so
  both can run. New optional env: `RESEND_API_KEY`, `LEAD_TO` (default
  `hello@wagecoach.com`), `LEAD_FROM` (default `leads@wagecoach.com`). If a
  configured channel fails the user gets a clear fallback instead of a silent drop.

- **Blog imagery:** `components/BlogImage.tsx` — a dependency-free, ledger-styled
  SVG hero/thumbnail generated per post from its category (`lib/blog-images.ts`
  maps slug → `BlogCategory`). The blog index is now a two-column card grid with
  cropped thumbnails; each post renders a full-width hero. No external image
  fetches, so it adds zero runtime/network cost.
- **8 wage-recovery blog posts** added (`lib/posts.ts`, "WEEK3") — wage theft,
  filing a wage claim, DOL complaint, back pay, statute of limitations, demand
  letter, hiring an attorney, reporting wage theft — feeding the recovery funnel.
- **Deploy:** `npm run deploy` added (mirrors controlbook) — pulls production env,
  builds locally, and ships the prebuilt output with `vercel deploy --prebuilt --prod`.
- Lint clean: annotated the intentional hydration-safe client-only date effect in
  `ClaimKitPersonaliser.tsx` (`react-hooks/set-state-in-effect`).

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

// The swallow sites must report through the central helper, and the feedback
// control and boundaries must be wired. Source-level checks keep this fast and
// need no browser; the real behaviour is covered by the Playwright UX run.
import { readFileSync } from "node:fs";
import { ok, report } from "./_assert.mts";

const read = (p: string) => readFileSync(p, "utf8");

const lead = read("app/api/lead/route.ts");
// Each channel reports its own thrown error through `settle` (scope is lead_email or lead_webhook), so one failing channel cannot hide another's success.
ok(/channel\.catch\(\(err\) => \{\s*captureServerError\(err, \{ scope \}\)/.test(lead), "lead route reports delivery exceptions per channel");
ok(/captureServerMessage\("Lead email send failed"/.test(lead), "lead route reports a failed email send");
ok(/captureServerMessage\("Lead webhook rejected"/.test(lead), "lead route reports a rejected webhook");
const checkout = read("app/api/checkout/route.ts");
ok(/captureServerError\(err, \{ scope: "checkout"/.test(checkout), "checkout reports exceptions");
ok(/captureServerMessage\("Stripe checkout session creation failed"/.test(checkout), "checkout reports Stripe failures");
// Kit and Pro report verification share one lookup (lib/stripe-purchase.ts); each reports under its own scope.
const purchase = read("lib/stripe-purchase.ts");
ok(/captureServerError\(err, \{ scope \}\)/.test(purchase), "purchase verification reports unreachable Stripe");
ok(/kit: \{ priceEnv: "STRIPE_KIT_PRICE_ID", scope: "kit_purchase" \}/.test(purchase), "kit lookups report under kit_purchase");
ok(/report: \{ priceEnv: "STRIPE_PRICE_ID", scope: "report_purchase" \}/.test(purchase), "report lookups report under report_purchase");
const webhook = read("lib/stripe-webhook.ts");
ok(/captureServerError\(err, \{ scope: "stripe_webhook"/.test(webhook), "webhook reports handler exceptions");
ok(/captureServerMessage\("Pro report email was not sent"/.test(webhook), "webhook reports a failed email");
ok(/captureServerMessage\("Stripe webhook is not configured"/.test(webhook), "webhook reports being unconfigured");
ok(/captureServerMessage\("Checkout is not configured"/.test(checkout), "checkout reports being unconfigured");
ok(/captureClientError\(err, \{ scope: "case_review_submit"/.test(read("components/CaseReviewForm.tsx")), "case review form reports");
ok(/captureClientError\(err, \{ scope: "checkout_start"/.test(read("components/CheckoutButton.tsx")), "checkout button reports");

ok(/Sentry\.captureException\(error\)/.test(read("app/global-error.tsx")), "global-error captures");
ok(/Sentry\.captureException\(error\)/.test(read("app/error.tsx")), "segment error boundary captures");
ok(/export const onRequestError = Sentry\.captureRequestError/.test(read("instrumentation.ts")), "onRequestError wired");

for (const f of ["instrumentation-client.ts", "instrumentation.ts"]) {
  ok(read(f).includes("sharedSentryOptions()"), `${f} uses the shared options`);
}
const opts = read("lib/sentry-options.ts");
for (const k of ["enableLogs: true", "beforeSendLog", "beforeSend,", "beforeBreadcrumb", "beforeSendTransaction", "consoleLoggingIntegration"]) {
  ok(opts.includes(k), `shared options include ${k}`);
}
const client = read("instrumentation-client.ts");
ok(client.includes("autoInject: false") && client.includes("application/x-sentry-envelope"), "feedback: own button + tunnel content-type fix");
ok(read("next.config.ts").includes("tunnelRoute: true") && read("next.config.ts").includes("wagecoach_web"), "tunnel route and project slug");

const fb = read("components/FeedbackButton.tsx");
ok(fb.includes("createForm()") && fb.includes("getFeedback()"), "feedback button opens Sentry's form");
ok(read("components/SiteHeader.tsx").includes("<FeedbackButton"), "header carries the feedback control");
ok(read("components/SiteFooter.tsx").includes("<FeedbackButton"), "footer carries the feedback control");

report("observability");

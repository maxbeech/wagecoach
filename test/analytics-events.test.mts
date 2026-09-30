import {
  analyticsEvents, analyticsFailureReason, beginCheckoutParams, calculatorUseEvents,
  checkoutFailureReason, checkoutItems, leadParams, CHECKOUT_PRODUCTS,
} from "../lib/analytics-events.ts";
import { eq, ok, report } from "./_assert.mts";

// Event names: unique, snake_case, within GA4's 40 character limit.
const names = Object.values(analyticsEvents);
eq(new Set(names).size, names.length, "event names are unique");
for (const n of names) ok(/^[a-z][a-z0-9_]{0,39}$/.test(n), `${n} is a valid GA4 event name`);
for (const n of ["begin_checkout", "purchase", "generate_lead"]) ok(names.includes(n as never), `uses the GA4 recommended name ${n}`);
for (const n of names.filter((x) => x.endsWith("_failed"))) {
  ok(names.includes(n.replace(/_failed$/, "") as never) || n === "purchase_confirmation_failed", `${n} has a step it belongs to`);
}

// Failure reasons are short codes, never free text.
eq(analyticsFailureReason(502), "http_502", "a status becomes http_<status>");
eq(analyticsFailureReason("Rate-Limited"), "rate_limited", "a code is lowercased and hyphens become underscores");
eq(analyticsFailureReason("jane@example.com"), "unknown", "an email never survives as a reason");
eq(analyticsFailureReason("Something went wrong. Please try again."), "unknown", "free text never survives as a reason");
eq(analyticsFailureReason(undefined), "unknown", "missing input is unknown");
eq(analyticsFailureReason("a".repeat(80)).length, 40, "reasons are capped at 40 characters");

// /api/checkout answers 200 with a message (no url) when Stripe is not configured.
eq(checkoutFailureReason(200, true), null, "a 200 with a url is not a failure");
eq(checkoutFailureReason(200, false), "unavailable", "a 200 without a url is unavailable");
eq(checkoutFailureReason(502, false), "http_502", "a Stripe error is http_502");

// begin_checkout params carry list price, product and one item.
const kit = beginCheckoutParams("kit");
eq(kit.value, 29, "kit begin_checkout value is $29");
eq(kit.currency, "USD", "currency is USD");
eq(kit.product, "kit", "product is named");
eq(JSON.stringify(checkoutItems("report")), JSON.stringify([{ item_id: "pro_report", item_name: "WageCoach Pro report", quantity: 1 }]), "report item shape");
eq(CHECKOUT_PRODUCTS.report.priceUsd, 19, "report is $19");

// A first use of the back-pay estimator is also its own step event; others are not.
eq(calculatorUseEvents("pay").map((e) => e.name).join(), "calculator_used", "pay calculator sends calculator_used only");
eq(calculatorUseEvents("backpay").map((e) => e.name).join(), "calculator_used,backpay_calculator_used", "back-pay sends both");
eq(calculatorUseEvents("backpay")[0].params.calculator, "backpay", "calculator_used names the tool");

// Lead params hold the claim type and state, nothing the person typed.
const lead = leadParams("off_the_clock", "ca");
eq(lead.claim_type, "off_the_clock", "claim type is kept");
eq(lead.state, "CA", "state is upper-cased");
eq(leadParams("overtime", "").state, "none", "no state is 'none'");
eq(Object.keys(lead).sort().join(), "claim_type,state", "lead params carry only claim_type and state");

report("analytics-events");

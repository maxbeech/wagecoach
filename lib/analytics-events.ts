/**
 * Every GA event this product sends, in one place, so no call site carries a
 * string literal. snake_case, at most 40 characters (GA4's limit), enforced by
 * test/analytics-events.test.ts. GA4 recommended names are kept where one fits
 * (`begin_checkout`, `purchase`, `generate_lead`).
 *
 * WageCoach has no accounts, so there is no `oh_user_ref` to send: a visitor is
 * only the anonymous GA client. The free step is using a calculator, the paid
 * step is a verified Claim Kit purchase.
 *
 * Each step that can fail has a `*_failed` sibling carrying a short, non-PII
 * `reason`, so a stuck step with no error reads differently from a failing one.
 *
 * This file is pure (no browser or GA imports) so tests can load it. Sending
 * goes through `trackEvent` in ./analytics-track.
 */
export const analyticsEvents = {
  // Acquisition: visit -> free use of a calculator -> paid Claim Kit.
  calculatorUsed: "calculator_used",
  backpayCalculatorUsed: "backpay_calculator_used",
  // Upgrade: Stripe Checkout for the Claim Kit ($29) or the Pro report ($19).
  beginCheckout: "begin_checkout",
  beginCheckoutFailed: "begin_checkout_failed",
  checkoutCancelled: "checkout_cancelled",
  purchase: "purchase",
  purchaseConfirmationFailed: "purchase_confirmation_failed",
  // Free attorney case review (lead generation).
  caseReviewViewed: "case_review_viewed",
  generateLead: "generate_lead",
  generateLeadFailed: "generate_lead_failed",
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export type Primitive = string | number | boolean;
export type EventParams = Record<string, Primitive | Record<string, Primitive>[]>;

export type CheckoutProduct = "kit" | "report";

/** List prices, used only for `begin_checkout`. `purchase` carries the amount Stripe charged. */
export const CHECKOUT_PRODUCTS: Record<CheckoutProduct, { id: string; name: string; priceUsd: number }> = {
  kit: { id: "claim_kit", name: "WageCoach Claim Kit", priceUsd: 29 },
  report: { id: "pro_report", name: "WageCoach Pro report", priceUsd: 19 },
};

/** GA4 ecommerce items for one checkout product. */
export function checkoutItems(product: CheckoutProduct) {
  const p = CHECKOUT_PRODUCTS[product];
  return [{ item_id: p.id, item_name: p.name, quantity: 1 }];
}

/** GA4 params for starting checkout. */
export function beginCheckoutParams(product: CheckoutProduct): EventParams {
  return { currency: "USD", value: CHECKOUT_PRODUCTS[product].priceUsd, product, items: checkoutItems(product) };
}

/**
 * A short, non-PII `reason` for a `*_failed` event: `http_<status>` for a
 * status, or a lowercase `[a-z0-9_]` code of at most 40 characters. Free text
 * (which could carry an email address or a Stripe message) never survives:
 * anything that is not already one code-shaped token becomes `unknown`.
 */
export function analyticsFailureReason(input: string | number | null | undefined): string {
  if (typeof input === "number" && Number.isInteger(input)) return `http_${input}`;
  if (typeof input !== "string") return "unknown";
  const code = input.trim().toLowerCase().replace(/-/g, "_");
  if (!/^[a-z0-9_]+$/.test(code)) return "unknown";
  return code.slice(0, 40);
}

/**
 * Why `/api/checkout` gave the browser nothing to redirect to. The route answers
 * 200 with a message (and no url) when Stripe is not configured, so a 200 without
 * a url is "unavailable" rather than a success.
 */
export function checkoutFailureReason(status: number, hasUrl: boolean): string | null {
  if (status >= 200 && status < 300) return hasUrl ? null : "unavailable";
  return analyticsFailureReason(status);
}

/** Calculators that fire `calculator_used`; the back-pay estimator also has its own step event. */
export type CalculatorTool = "pay" | "salary" | "minwage" | "tipped" | "exempt" | "pto" | "backpay";

/** The events one first use of a calculator produces. */
export function calculatorUseEvents(tool: CalculatorTool): { name: AnalyticsEventName; params: EventParams }[] {
  const events: { name: AnalyticsEventName; params: EventParams }[] = [
    { name: analyticsEvents.calculatorUsed, params: { calculator: tool } },
  ];
  if (tool === "backpay") events.push({ name: analyticsEvents.backpayCalculatorUsed, params: {} });
  return events;
}

/** `generate_lead` params: the claim type key and the state, never the person's details. */
export function leadParams(claimType: string, stateAbbr: string): EventParams {
  return { claim_type: analyticsFailureReason(claimType), state: stateAbbr ? stateAbbr.toUpperCase().slice(0, 2) : "none" };
}

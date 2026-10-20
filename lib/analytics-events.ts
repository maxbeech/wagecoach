/**
 * Every GA event this product sends, in one place, so no call site carries a
 * string literal. snake_case, at most 40 characters (GA4's limit), enforced by
 * test/analytics-events.test.ts. GA4 recommended names are kept where one fits
 * (`begin_checkout`, `purchase`, `sign_up`).
 *
 * WageCoach has no accounts, so there is no `oh_user_ref` to send: a visitor is
 * only the anonymous GA client. The free steps are using a calculator and
 * signing up for Wage Watch alerts; the paid steps are a verified Claim Kit
 * purchase and a Wage Watch subscription.
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
  // Upgrade: Stripe Checkout for the Claim Kit ($29) or Wage Watch ($9/mo).
  beginCheckout: "begin_checkout",
  beginCheckoutFailed: "begin_checkout_failed",
  checkoutCancelled: "checkout_cancelled",
  purchase: "purchase",
  purchaseConfirmationFailed: "purchase_confirmation_failed",
  // Wage Watch: free email alerts when a tracked location's wage changes.
  watchSignup: "sign_up",
  watchSignupFailed: "sign_up_failed",
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export type Primitive = string | number | boolean;
export type EventParams = Record<string, Primitive | Record<string, Primitive>[]>;

export type CheckoutProduct = "kit" | "watch";

/** List prices, used only for `begin_checkout`. `purchase` carries the amount Stripe charged. */
export const CHECKOUT_PRODUCTS: Record<CheckoutProduct, { id: string; name: string; priceUsd: number }> = {
  kit: { id: "claim_kit", name: "WageCoach Claim Kit", priceUsd: 29 },
  watch: { id: "wage_watch", name: "WageCoach Wage Watch", priceUsd: 9 },
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
 * How long a browser request to `/api/checkout` or `/api/watch/*` may hang. Without a
 * limit a request that never answers leaves the button on "Starting…" or
 * "Sending…" for ever, with no event and no Sentry report, which is the stall
 * this guards against. See https://developer.mozilla.org/docs/Web/API/AbortSignal/timeout_static
 */
export const CLIENT_REQUEST_TIMEOUT_MS = 20_000;

/**
 * The `reason` for a browser request that threw: `timeout` when it hit
 * `CLIENT_REQUEST_TIMEOUT_MS` (AbortSignal.timeout rejects with a `TimeoutError`),
 * otherwise `request_failed` (a network error or a body that was not JSON).
 */
export function requestFailureReason(err: unknown): "timeout" | "request_failed" {
  const name = typeof err === "object" && err !== null && "name" in err ? String(err.name) : "";
  return name === "TimeoutError" ? "timeout" : "request_failed";
}

/**
 * Why `/api/checkout` gave the browser nothing to redirect to. When Stripe is not
 * configured the route answers 503 (`http_503`). A 2xx without a url is still
 * "unavailable" rather than a success.
 */
export function checkoutFailureReason(status: number, hasUrl: boolean): string | null {
  if (status >= 200 && status < 300) return hasUrl ? null : "unavailable";
  return analyticsFailureReason(status);
}

/** Calculators that fire `calculator_used`; the back-pay estimator also has its own step event. */
export type CalculatorTool = "pay" | "salary" | "minwage" | "tipped" | "exempt" | "pto" | "backpay" | "timecard";

/** The events one first use of a calculator produces. */
export function calculatorUseEvents(tool: CalculatorTool): { name: AnalyticsEventName; params: EventParams }[] {
  const events: { name: AnalyticsEventName; params: EventParams }[] = [
    { name: analyticsEvents.calculatorUsed, params: { calculator: tool } },
  ];
  if (tool === "backpay") events.push({ name: analyticsEvents.backpayCalculatorUsed, params: {} });
  return events;
}

/** `sign_up` params: how many locations were picked, never the email. */
export function watchSignupParams(locationCount: number): EventParams {
  const n = Number.isFinite(locationCount) ? Math.max(0, Math.min(99, Math.trunc(locationCount))) : 0;
  return { method: "email", locations: n };
}

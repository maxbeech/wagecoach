import { captureServerError, captureServerMessage } from "./observability";
import { analyticsFailureReason } from "./analytics-events";

// The one place that decides whether a Stripe Checkout session is a paid purchase
// of a given product. The Claim Kit page, the Pro report page and the Stripe
// webhook all go through here, so the rules cannot drift apart.
//
// No database: the session id is the proof. A session only counts when it is
//   1. paid (payment_status === "paid"),
//   2. a one-time payment (mode === "payment"), and
//   3. holds THIS product's price, otherwise the cheaper report would unlock the
//      kit, or any paid session in a shared Stripe account would unlock either.
// If Stripe or the price is not configured we cannot verify, so we refuse.
// Field names: https://docs.stripe.com/api/checkout/sessions/object

export type PurchaseProduct = "kit" | "report";
export type Env = Record<string, string | undefined>;

/** The env var holding each product's price id, and the Sentry scope its lookups report under. */
export const PURCHASE_PRODUCTS = {
  kit: { priceEnv: "STRIPE_KIT_PRICE_ID", scope: "kit_purchase" },
  report: { priceEnv: "STRIPE_PRICE_ID", scope: "report_purchase" },
} as const;

export interface StripeSession {
  mode?: string;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
  customer_details?: { email?: string | null } | null;
  line_items?: { data?: Array<{ price?: { id?: string } }> };
}

export type SessionJudgement = { ok: true; session: StripeSession } | { ok: false; reason: string };
export type PurchaseResult = SessionJudgement;

/** Stripe session ids look like cs_test_a1B2... Anything else never reaches the API. */
const SESSION_ID = /^cs_[A-Za-z0-9_]{8,200}$/;

/** Judge a fetched session against a product's price. `reason` feeds `purchase_confirmation_failed`. */
export function judgeSession(session: StripeSession | null | undefined, price: string): SessionJudgement {
  if (session?.payment_status !== "paid") return { ok: false, reason: "not_paid" };
  if (session.mode !== "payment") return { ok: false, reason: "wrong_mode" };
  const lines = session.line_items?.data ?? [];
  if (!lines.some((li) => li.price?.id === price)) return { ok: false, reason: "wrong_product" };
  return { ok: true, session };
}

/** What Stripe actually charged, so a promotion code lowers the reported value. */
export function chargedAmount(session: StripeSession): { value: number; currency: string } {
  return { value: Math.round(session.amount_total ?? 0) / 100, currency: (session.currency ?? "usd").toUpperCase() };
}

/**
 * Ask Stripe about a session, with line items expanded so the price can be checked.
 * Never throws. `timeoutMs` matters on the webhook path: Checkout holds the buyer's
 * redirect for up to 10 seconds while it waits for our reply.
 */
export async function lookupSession(
  sessionId: string,
  secret: string,
  scope: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Promise<{ ok: true; session: StripeSession } | { ok: false; reason: string }> {
  try {
    const res = await fetchImpl(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store", signal: AbortSignal.timeout(timeoutMs) },
    );
    if (!res.ok) {
      if (res.status >= 500 || res.status === 401 || res.status === 403) {
        captureServerMessage("Stripe session lookup failed", { scope, status: res.status });
      }
      return { ok: false, reason: analyticsFailureReason(res.status) };
    }
    return { ok: true, session: (await res.json()) as StripeSession };
  } catch (err) {
    captureServerError(err, { scope });
    return { ok: false, reason: "unreachable" };
  }
}

/** Is this session id a paid, one-time purchase of `product`? Never throws. */
export async function verifyPurchase(
  product: PurchaseProduct,
  sessionId: string | undefined,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Promise<PurchaseResult> {
  const { priceEnv, scope } = PURCHASE_PRODUCTS[product];
  const secret = env.STRIPE_SECRET_KEY;
  const price = env[priceEnv];
  if (!sessionId) return { ok: false, reason: "no_session" };
  if (!SESSION_ID.test(sessionId)) return { ok: false, reason: "bad_session" };
  if (!secret || !price) return { ok: false, reason: "not_configured" };
  const found = await lookupSession(sessionId, secret, scope, fetchImpl, timeoutMs);
  return found.ok ? judgeSession(found.session, price) : found;
}

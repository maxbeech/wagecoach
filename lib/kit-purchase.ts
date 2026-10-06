import { captureServerError, captureServerMessage } from "./observability";
import { userRefFor } from "./openhelm-analytics-mp";
import { analyticsFailureReason } from "./analytics-events";

// Decides whether a Stripe Checkout session is a paid Claim Kit. Kept out of the
// page so the rules, and the reason a purchase was not confirmed, are testable.
// No database: the session id in the success URL is the proof, and we check both
// that it is paid AND that it holds the Kit's price, otherwise the cheaper report
// or any other paid session in the account would unlock the Kit.

export interface KitPurchase {
  /** Amount Stripe charged, in whole currency units. */
  value: number;
  currency: string;
  /** One-way reference for GA's transaction_id; the Stripe session id itself is not sent. */
  transactionId: string;
}

export type KitVerification = { ok: true; purchase: KitPurchase } | { ok: false; reason: string };

interface StripeSession {
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  line_items?: { data?: Array<{ price?: { id?: string } }> };
}

/** The GA transaction id for a session: `kit_` plus the first 16 hex of its SHA-256. */
export async function kitTransactionId(sessionId: string): Promise<string> {
  return `kit_${await userRefFor(sessionId)}`;
}

/** Judge a fetched session. `reason` is what `purchase_confirmation_failed` reports. */
export async function judgeKitSession(session: StripeSession, kitPrice: string, sessionId: string): Promise<KitVerification> {
  if (session?.payment_status !== "paid") return { ok: false, reason: "not_paid" };
  const lines = session.line_items?.data ?? [];
  if (!lines.some((li) => li.price?.id === kitPrice)) return { ok: false, reason: "wrong_product" };
  return {
    ok: true,
    purchase: {
      value: Math.round(session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
      transactionId: await kitTransactionId(sessionId),
    },
  };
}

/** Ask Stripe about the session in the success URL. Never throws. */
export async function verifyKitPurchase(
  sessionId: string | undefined,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<KitVerification> {
  const secret = env.STRIPE_SECRET_KEY;
  const kitPrice = env.STRIPE_KIT_PRICE_ID;
  if (!sessionId) return { ok: false, reason: "no_session" };
  if (!secret || !kitPrice) return { ok: false, reason: "not_configured" };
  try {
    // Expand line_items so we can confirm the purchased price, not just "paid".
    const res = await fetchImpl(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
    );
    if (!res.ok) {
      if (res.status >= 500 || res.status === 401 || res.status === 403) {
        captureServerMessage("Stripe session lookup failed", { scope: "kit_purchase", status: res.status });
      }
      return { ok: false, reason: analyticsFailureReason(res.status) };
    }
    return await judgeKitSession(await res.json(), kitPrice, sessionId);
  } catch (err) {
    captureServerError(err, { scope: "kit_purchase" });
    return { ok: false, reason: "unreachable" };
  }
}

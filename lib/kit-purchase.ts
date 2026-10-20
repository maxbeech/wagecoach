import { userRefFor } from "./openhelm-analytics-mp";
import { chargedAmount, judgeSession, verifyPurchase, type Env, type StripeSession } from "./stripe-purchase";

// Decides whether a Stripe Checkout session is a paid Claim Kit. The rules
// (paid, one-time payment, the Kit's price) live in ./stripe-purchase and are
// shared with the Pro report; this file adds what only the Kit needs, the GA
// purchase summary. Kept out of the page so the reason a purchase was not
// confirmed is testable.

export interface KitPurchase {
  /** Amount Stripe charged, in whole currency units. */
  value: number;
  currency: string;
  /** One-way reference for GA's transaction_id; the Stripe session id itself is not sent. */
  transactionId: string;
}

export type KitVerification = { ok: true; purchase: KitPurchase } | { ok: false; reason: string };

/** The GA transaction id for a session: `kit_` plus the first 16 hex of its SHA-256. */
export async function kitTransactionId(sessionId: string): Promise<string> {
  return `kit_${await userRefFor(sessionId)}`;
}

async function kitPurchaseOf(session: StripeSession, sessionId: string): Promise<KitPurchase> {
  return { ...chargedAmount(session), transactionId: await kitTransactionId(sessionId) };
}

/** Judge a fetched session. `reason` is what `purchase_confirmation_failed` reports. */
export async function judgeKitSession(session: StripeSession, kitPrice: string, sessionId: string): Promise<KitVerification> {
  const judged = judgeSession(session, kitPrice);
  return judged.ok ? { ok: true, purchase: await kitPurchaseOf(judged.session, sessionId) } : judged;
}

/** Ask Stripe about the session in the success URL. Never throws. */
export async function verifyKitPurchase(
  sessionId: string | undefined,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<KitVerification> {
  const verified = await verifyPurchase("kit", sessionId, env, fetchImpl);
  return verified.ok ? { ok: true, purchase: await kitPurchaseOf(verified.session, sessionId as string) } : verified;
}

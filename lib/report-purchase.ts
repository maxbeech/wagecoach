import { verifyPurchase, type Env } from "./stripe-purchase";

// Decides whether a Stripe Checkout session is a paid Pro report, and what to
// say when it is not. The rules are shared with the Claim Kit (./stripe-purchase).
// The link to the report is the session id, so it is tied to one payment and
// there is nothing to store. The states the buyer picked travel in the session's
// own metadata, which is how the page rebuilds the same report from the session
// alone, including when the buyer comes back from an email instead of the redirect.

export interface ReportPurchase {
  /** Raw `metadata.states` as set at checkout, e.g. "CA,NY". Empty for sessions that predate state selection. */
  statesParam: string;
}

export type ReportVerification = { ok: true; purchase: ReportPurchase } | { ok: false; reason: string };

/** Ask Stripe about the session in the report link. Never throws. */
export async function verifyReportPurchase(
  sessionId: string | undefined,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<ReportVerification> {
  const verified = await verifyPurchase("report", sessionId, env, fetchImpl);
  if (!verified.ok) return verified;
  return { ok: true, purchase: { statesParam: verified.session.metadata?.states ?? "" } };
}

export interface LockedCopy {
  title: string;
  body: string;
  /** Offer a way back to the pricing page. */
  buy: boolean;
}

/** Plain words for each reason the report stays locked. Short on purpose. */
export function lockedCopy(reason: string): LockedCopy {
  switch (reason) {
    case "no_session":
      return { title: "Open your report from your link", body: "This page opens from the link we send after you pay. You have not bought the Pro report yet, or the link was cut short.", buy: true };
    case "bad_session":
      return { title: "That link does not look right", body: "Copy the full link from your receipt or email. If it still fails, write to us and we will send the report.", buy: false };
    case "not_configured":
      return { title: "Report delivery is not switched on yet", body: "This site cannot open paid reports right now. If you paid, your payment is safe. Write to us with your receipt and we will send the report by hand.", buy: false };
    case "not_paid":
      return { title: "Your payment has not cleared yet", body: "Stripe has not marked this payment as paid. Bank payments can take a few days. Refresh later, or write to us.", buy: false };
    case "wrong_product":
    case "wrong_mode":
      return { title: "This link is for a different purchase", body: "It does not match the Pro report. If you bought the Claim Kit, open it from the link in your receipt.", buy: true };
    case "http_404":
      return { title: "We cannot find that purchase", body: "Check that you copied the whole link. If you paid, write to us and we will sort it out.", buy: false };
    case "unreachable":
      return { title: "We could not reach our payment provider", body: "Wait a minute and refresh. If it keeps failing, write to us and we will send the report.", buy: false };
    default:
      return { title: "We could not confirm your purchase", body: "If you just paid, give it a minute and refresh. Otherwise write to us and we will send the report.", buy: false };
  }
}

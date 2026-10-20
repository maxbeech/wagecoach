import { createHmac, timingSafeEqual } from "node:crypto";

// Verifies a Stripe webhook signature by hand, so the site needs no Stripe SDK
// (it talks to Stripe with plain fetch everywhere else). The scheme is Stripe's
// documented one, https://docs.stripe.com/webhooks (Verify manually):
//   header   Stripe-Signature: t=<unix seconds>,v1=<hex>[,v1=<hex>][,v0=<hex>]
//   signed   `${t}.${raw request body}`
//   check    HMAC-SHA256 of that string, keyed with the endpoint secret (whsec_...)
// Only v1 counts (v0 is a fake scheme Stripe adds for tests, ignoring it blocks
// downgrade attacks), several v1 values appear while a secret is being rolled,
// the comparison is constant-time, and a timestamp more than five minutes away
// from now is refused so a captured request cannot be replayed later.
// The body must be the exact bytes Stripe sent. Never re-serialise parsed JSON.

export const SIGNATURE_TOLERANCE_SECONDS = 300;

export type SignatureCheck =
  | { ok: true }
  | { ok: false; reason: "missing_header" | "malformed_header" | "no_match" | "stale_timestamp" };

export function verifyStripeSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string,
  nowSeconds: number,
  toleranceSeconds = SIGNATURE_TOLERANCE_SECONDS,
): SignatureCheck {
  if (!header) return { ok: false, reason: "missing_header" };

  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const at = part.indexOf("=");
    if (at < 0) continue;
    const key = part.slice(0, at).trim();
    const value = part.slice(at + 1).trim();
    if (key === "t") timestamp = value;
    else if (key === "v1") signatures.push(value);
  }
  if (!/^\d{1,12}$/.test(timestamp) || signatures.length === 0) return { ok: false, reason: "malformed_header" };

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest();
  const matches = signatures.some(
    (sig) => /^[0-9a-f]{64}$/i.test(sig) && timingSafeEqual(Buffer.from(sig, "hex"), expected),
  );
  if (!matches) return { ok: false, reason: "no_match" };

  // Checked after the signature, so a stale-but-genuine request is told apart from a forged one.
  if (Math.abs(nowSeconds - Number(timestamp)) > toleranceSeconds) return { ok: false, reason: "stale_timestamp" };
  return { ok: true };
}

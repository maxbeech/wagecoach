import { NextResponse } from "next/server";
import { captureServerError, captureServerMessage } from "@/lib/observability";
import { publicBaseUrl, SITE } from "@/lib/site";
import { PURCHASE_PRODUCTS } from "@/lib/stripe-purchase";
import { startWatchCheckout } from "@/lib/watch-billing";
import { defaultDeps, lookup, manageLink } from "@/lib/watch-service";

// Stripe Checkout for the two things WageCoach sells:
//   - "kit": the $29 Claim Kit, a one-time payment (price id in STRIPE_KIT_PRICE_ID).
//   - "watch": the Wage Watch subscription, started from a subscriber's manage link
//     (the body carries its token). Priced in lib/watch-plan.ts.
// Anything unconfigured answers 503 with `reason: "not_configured"` and a message
// naming the product, never a 200 that looks like success. The server log says
// which variable is missing; the browser is not told.

const KIT = { path: "/wage-claim", label: "The Claim Kit" };

const unavailable = (product: string, label: string) =>
  NextResponse.json(
    { ok: false, reason: "not_configured", product, message: `${label} is not on sale yet. Email ${SITE.email} and we will tell you when it is.` },
    { status: 503 },
  );

export async function POST(req: Request) {
  let input: { product?: unknown; caseQuery?: unknown; token?: unknown } = {};
  try { input = await req.json(); } catch { /* handled below */ }

  if (input?.product === "watch") return watch(input.token);
  if (input?.product !== "kit") {
    return NextResponse.json({ ok: false, reason: "unknown_product", message: "That product isn't sold here." }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const priceEnv = PURCHASE_PRODUCTS.kit.priceEnv;
  const price = process.env[priceEnv];
  if (!secret || !price) {
    captureServerMessage("Checkout is not configured", { scope: "checkout", product: "kit", missing: !secret ? "STRIPE_SECRET_KEY" : priceEnv });
    return unavailable("kit", KIT.label);
  }
  const caseQuery = typeof input.caseQuery === "string" ? input.caseQuery.replace(/^\?/, "").slice(0, 500) : "";
  const base = publicBaseUrl();

  try {
    // The kit returns to a server-verified page that asks Stripe whether the session
    // was paid for THIS product before it shows anything. {CHECKOUT_SESSION_ID} is
    // Stripe's literal template; the case rides along so the letter is pre-filled.
    const params = new URLSearchParams({
      "mode": "payment",
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      "success_url": `${base}/claim-kit?session_id={CHECKOUT_SESSION_ID}${caseQuery ? `&${caseQuery}` : ""}`,
      "cancel_url": `${base}${KIT.path}?status=cancel`,
      "allow_promotion_codes": "true",
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const session = await res.json();
    if (!res.ok) {
      captureServerMessage("Stripe checkout session creation failed", { scope: "checkout", product: "kit", status: res.status, stripeErrorCode: session?.error?.code });
      return NextResponse.json({ message: session?.error?.message ?? "Stripe error" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    captureServerError(err, { scope: "checkout", product: "kit" });
    return NextResponse.json({ message: "Could not reach Stripe. Please try again." }, { status: 502 });
  }
}

/** Upgrade a Wage Watch subscriber. The manage-link token is the proof of who they are. */
async function watch(token: unknown) {
  const d = defaultDeps();
  const found = await lookup(token, d);
  if (!found.ok) {
    if (found.reason === "not_configured") return unavailable("watch", "Wage Watch");
    return NextResponse.json({ ok: false, reason: found.reason, message: "That link has expired. Use the newest email from us, or sign up again to get a fresh one." }, { status: 400 });
  }
  if (found.view.plan.id === "watch") {
    return NextResponse.json({ ok: false, reason: "already_subscribed", message: "You're already on Wage Watch." }, { status: 409 });
  }
  const res = await startWatchCheckout(found.view.watcher, manageLink(d.baseUrl, String(token)));
  if (!res.ok) {
    if (res.reason === "not_configured") return unavailable("watch", "Wage Watch");
    return NextResponse.json({ message: "Could not reach Stripe. Please try again." }, { status: res.status });
  }
  return NextResponse.json({ url: res.url });
}

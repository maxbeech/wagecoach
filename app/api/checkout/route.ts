import { NextResponse } from "next/server";
import { captureServerError, captureServerMessage } from "@/lib/observability";
import { parseStates, statesParam } from "@/lib/pro-report";
import { publicBaseUrl, SITE } from "@/lib/site";
import { PURCHASE_PRODUCTS } from "@/lib/stripe-purchase";

// Stripe Checkout for the one-time products: the $19 Pro report and the $29 wage
// Claim Kit. Keys are env vars on the host (STRIPE_SECRET_KEY plus STRIPE_PRICE_ID
// and STRIPE_KIT_PRICE_ID, named in lib/stripe-purchase.ts). When Stripe or the
// product's price is not configured the route answers 503 with a message naming
// the product and a `reason` of "not_configured", never a 200 that looks like
// success. The server log says which variable is missing; the browser is not told.

const PRODUCTS = {
  report: { path: "/pricing", label: "The Pro report" },
  kit: { path: "/wage-claim", label: "The Claim Kit" },
} as const;

type ProductKey = keyof typeof PRODUCTS;

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const base = publicBaseUrl();

  let product: ProductKey = "report";
  let caseQuery = "";
  let rawStates: unknown;
  try {
    const input = await req.json();
    if (input?.product === "kit") product = "kit";
    if (typeof input?.caseQuery === "string") caseQuery = input.caseQuery.replace(/^\?/, "").slice(0, 500);
    rawStates = input?.states;
  } catch { /* no body → default report */ }

  const priceEnv = PURCHASE_PRODUCTS[product].priceEnv;
  const price = process.env[priceEnv];
  const missing = !secret ? "STRIPE_SECRET_KEY" : !price ? priceEnv : null;
  if (missing || !secret || !price) {
    captureServerMessage("Checkout is not configured", { scope: "checkout", product, missing: missing ?? "unknown" });
    return NextResponse.json(
      {
        ok: false,
        reason: "not_configured",
        product,
        message: `${PRODUCTS[product].label} is not on sale yet. Email ${SITE.email} and we will tell you when it is.`,
      },
      { status: 503 },
    );
  }

  // The report is built for the buyer's states, so checkout needs at least one.
  const states = product === "report" ? parseStates(Array.isArray(rawStates) ? rawStates.map(String) : typeof rawStates === "string" ? rawStates : "") : [];
  if (product === "report" && states.length === 0) {
    return NextResponse.json({ ok: false, reason: "no_states", message: "Pick at least one state first." }, { status: 400 });
  }

  try {
    const ret = `${base}${PRODUCTS[product].path}`;
    // Both products return to a server-verified page that asks Stripe whether the
    // session was paid for THAT product before it shows anything.
    // {CHECKOUT_SESSION_ID} is Stripe's literal template. The Kit also carries the
    // buyer's case so the letter is pre-filled; the report carries its states in
    // session metadata, so the link is the session id alone.
    const successUrl = product === "kit"
      ? `${base}/claim-kit?session_id={CHECKOUT_SESSION_ID}${caseQuery ? `&${caseQuery}` : ""}`
      : `${base}/pro-report?session_id={CHECKOUT_SESSION_ID}`;
    const params = new URLSearchParams({
      "mode": "payment",
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      "success_url": successUrl,
      "cancel_url": `${ret}?status=cancel`,
      "allow_promotion_codes": "true",
    });
    if (product === "report") params.set("metadata[states]", statesParam(states));
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const session = await res.json();
    if (!res.ok) {
      captureServerMessage("Stripe checkout session creation failed", {
        scope: "checkout",
        product,
        status: res.status,
        stripeErrorCode: session?.error?.code,
      });
      return NextResponse.json({ message: session?.error?.message ?? "Stripe error" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    captureServerError(err, { scope: "checkout", product });
    return NextResponse.json({ message: "Could not reach Stripe. Please try again." }, { status: 502 });
  }
}

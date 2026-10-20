import { NextResponse } from "next/server";
import { handleStripeWebhook } from "@/lib/stripe-webhook";

// Stripe webhook endpoint. All logic lives in lib/stripe-webhook.ts so it can be
// tested without a server; this file only hands over the RAW body, because the
// signature covers the exact bytes Stripe sent and any re-serialisation breaks it.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const { status, body } = await handleStripeWebhook(rawBody, req.headers.get("stripe-signature"));
  return NextResponse.json(body, { status });
}

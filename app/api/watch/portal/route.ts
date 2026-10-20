import { NextResponse } from "next/server";
import { openBillingPortal } from "@/lib/watch-billing";
import { defaultDeps, lookup, manageLink } from "@/lib/watch-service";

// Opens Stripe's billing portal (cancel, change card, invoices) for a paying subscriber.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { token?: unknown } = {};
  try { body = await req.json(); } catch { /* validated below */ }
  const d = defaultDeps();
  const found = await lookup(body.token, d);
  if (!found.ok) return NextResponse.json({ ok: false, reason: found.reason, message: "That link has expired. Use the newest email from us." }, { status: found.reason === "not_configured" ? 503 : 400 });
  const res = await openBillingPortal(found.view.watcher, manageLink(d.baseUrl, String(body.token)));
  if (!res.ok) return NextResponse.json({ ok: false, reason: res.reason, message: "Billing isn't available right now. Please try again." }, { status: res.status });
  return NextResponse.json({ url: res.url });
}

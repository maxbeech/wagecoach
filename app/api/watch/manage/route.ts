import { NextResponse } from "next/server";
import { defaultDeps, manage } from "@/lib/watch-service";

// Change watched places or unsubscribe. The manage-link token is the only credential.
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, [number, string]> = {
  bad_token: [400, "That link has expired. Use the newest email from us."],
  not_found: [404, "That link has expired. Use the newest email from us."],
  no_locations: [400, "Keep at least one place, or unsubscribe instead."],
  too_many: [400, "That's more places than your plan covers."],
  not_configured: [503, "Alerts aren't switched on yet."],
  error: [500, "Something went wrong on our side. Please try again."],
};

export async function POST(req: Request) {
  let body: { token?: unknown; action?: unknown; locations?: unknown } = {};
  try { body = await req.json(); } catch { /* validated below */ }
  const res = await manage(body, defaultDeps());
  if (res.ok) {
    const { watcher, places, plan } = res.view;
    return NextResponse.json({ ok: true, places: places.map((p) => p.key), plan: plan.id, unsubscribed: Boolean(watcher.unsubscribedAt) });
  }
  const [status, message] = MESSAGES[res.reason] ?? MESSAGES.error;
  return NextResponse.json({ ok: false, reason: res.reason, message }, { status });
}

import { NextResponse } from "next/server";
import { captureServerMessage } from "@/lib/observability";
import { todayIso } from "@/lib/wage-schedule";
import { defaultDeps, runAlerts } from "@/lib/watch-service";

// Daily Wage Watch run, called by the Helm7 cron service with
// `Authorization: Bearer $CRON_SECRET`. Safe to call twice: the sent-log in
// Postgres means an alert only ever goes out once.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    captureServerMessage("Wage Watch cron is not configured", { scope: "watch_alerts", missing: "CRON_SECRET" });
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const today = new URL(req.url).searchParams.get("date") ?? todayIso();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) return NextResponse.json({ ok: false, reason: "bad_date" }, { status: 400 });
  const summary = await runAlerts(today, defaultDeps());
  if ("error" in summary) {
    captureServerMessage("Wage Watch cron is not configured", { scope: "watch_alerts", missing: "DATABASE_URL" });
    return NextResponse.json({ ok: false, reason: summary.error }, { status: 503 });
  }
  if (summary.failed) captureServerMessage("Wage Watch alerts failed to send", { scope: "watch_alerts", failed: summary.failed });
  return NextResponse.json({ ok: true, today, ...summary });
}
export const POST = GET;

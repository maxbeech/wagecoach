import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { defaultDeps, subscribe } from "@/lib/watch-service";

// Free Wage Watch signup: store the email + place, send a double opt-in email.
// Answers with a real state every time; the failure messages are what the form shows.
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, [number, string]> = {
  bad_email: [400, "That email address doesn't look right."],
  no_locations: [400, "Pick a state or city to watch."],
  not_configured: [503, `Alerts aren't switched on yet. Email ${SITE.email} and we'll add you by hand.`],
  mail_failed: [502, `We couldn't send the confirmation email. Try again, or write to ${SITE.email}.`],
  error: [500, "Something went wrong on our side. Please try again."],
};

export async function POST(req: Request) {
  let body: { email?: unknown; locations?: unknown } = {};
  try { body = await req.json(); } catch { /* validated below */ }
  const res = await subscribe({ email: body.email, locations: body.locations }, defaultDeps());
  if (res.ok) return NextResponse.json({ ok: true });
  const [status, message] = MESSAGES[res.reason] ?? MESSAGES.error;
  return NextResponse.json({ ok: false, reason: res.reason, message }, { status });
}

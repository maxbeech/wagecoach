import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

// Free-case-review intake. A submitted lead is delivered to whichever channels
// are configured — Resend email (RESEND_API_KEY) and/or a partner webhook
// (LEAD_WEBHOOK_URL, e.g. an attorney-network intake, CRM or Zapier hook).
// Nothing is stored here: the site is otherwise database-free, so delivery is
// the single integration point. If a channel is configured but fails, we tell
// the user to email us directly rather than silently dropping the lead. If no
// channel is configured at all, the route still accepts the submission so the
// form works in every environment.
//
// Lead-gen to attorneys is regulated and varies by state bar (referral-fee and
// advertising rules). This forwards an inquiry the user initiated; it is not a
// referral-fee arrangement. Confirm the model with counsel before going live.

interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  claimType?: string;
  amount?: number;
  summary?: string;
}

function validEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// Escape user-supplied values before embedding them in the notification email.
function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function leadRows(lead: Lead): Array<[string, string]> {
  const amount = typeof lead.amount === "number" && isFinite(lead.amount)
    ? `$${Math.round(lead.amount).toLocaleString("en-US")}`
    : "";
  return ([
    ["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone],
    ["State", lead.state], ["Claim type", lead.claimType],
    ["Estimated amount", amount], ["Summary", lead.summary],
  ] as Array<[string, string | undefined]>)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => [k, String(v)]);
}

// Deliver via Resend's REST API (no SDK dependency, matching the Stripe call).
async function sendEmail(lead: Lead): Promise<boolean | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null; // not configured
  const to = process.env.LEAD_TO || SITE.email;
  const from = process.env.LEAD_FROM || `WageCoach Leads <leads@${SITE.domain}>`;
  const rows = leadRows(lead)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("");
  const html = `<h2 style="font-family:Georgia,serif">New free-case-review lead</h2>`
    + `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`
    + `<p style="color:#888;font-size:12px;margin-top:16px">Source: wagecoach/free-case-review. General information, not legal advice.</p>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [to], subject: `New case review — ${lead.state || "lead"}${lead.name ? ` (${lead.name})` : ""}`,
      html, reply_to: lead.email,
    }),
  });
  return res.ok;
}

async function sendWebhook(lead: Lead): Promise<boolean | null> {
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (!hook) return null; // not configured
  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, source: "wagecoach/free-case-review", at: new Date().toISOString() }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  let lead: Lead;
  try {
    lead = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid submission." }, { status: 400 });
  }

  if (!lead.email || !validEmail(lead.email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  // Attempt every configured channel. `null` = channel not configured.
  let results: Array<boolean | null>;
  try {
    results = await Promise.all([sendEmail(lead), sendWebhook(lead)]);
  } catch {
    results = [false];
  }
  const configured = results.filter((r) => r !== null);
  // If at least one channel is configured and none of them succeeded, surface
  // a clear fallback so the lead is never silently lost.
  if (configured.length > 0 && !configured.some((r) => r === true)) {
    return NextResponse.json(
      { message: "We couldn't submit that just now. Please email hello@wagecoach.com and we'll connect you." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks — your details are on their way to a wage attorney who can review your case for free. Expect to hear back by email.",
  });
}

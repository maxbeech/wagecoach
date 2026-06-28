import { NextResponse } from "next/server";

// Free-case-review intake. A submitted lead is forwarded to the partner endpoint
// (LEAD_WEBHOOK_URL — an attorney-network intake, CRM or Zapier hook). Nothing is
// stored here: the site is otherwise database-free, so the webhook is the single
// integration point. When the webhook isn't configured yet, the route still
// accepts the submission and returns a clear confirmation, so the form works in
// every environment and we capture nothing we can't deliver.
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

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, source: "wagecoach/free-case-review", at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      return NextResponse.json(
        { message: "We couldn't submit that just now. Please email hello@wagecoach.com and we'll connect you." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks — your details are on their way to a wage attorney who can review your case for free. Expect to hear back by email.",
  });
}

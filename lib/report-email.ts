import { esc } from "./lead-email";
import { SITE } from "./site";

// The email that carries a buyer's report link. Sent by the Stripe webhook, so a
// buyer who closes the tab before the redirect still gets the report. Plain on
// purpose: one link, what it opens, how to keep it. Pure, so the markup is tested
// without a network call.

export interface ReportEmailInput {
  /** Absolute link to the report page, session id included. */
  link: string;
  /** State abbreviations the buyer picked, if the session recorded them. */
  states: string[];
}

export function buildReportEmail({ link, states }: ReportEmailInput): { subject: string; text: string; html: string } {
  const covers = states.length
    ? `It covers ${states.join(", ")}.`
    : "Pick your states on the page and the report builds right there.";
  const keep = "Keep this email. The link opens your report. Use Print / Save as PDF on that page to share it with your team.";
  const legal = "WageCoach is general information, not legal or tax advice, and is not a law firm.";

  const text = [
    "Your Pro report is ready.",
    "",
    "Open it here:",
    link,
    "",
    covers,
    keep,
    "",
    `Questions? Write to ${SITE.email}.`,
    "",
    legal,
  ].join("\n");

  const p = (s: string) => `<p style="margin:0 0 14px;font:15px/1.55 Arial,Helvetica,sans-serif;color:#16201b">${esc(s)}</p>`;
  const html =
    `<div style="max-width:520px;padding:24px;background:#ffffff">` +
    `<p style="margin:0 0 14px;font:600 20px Georgia,serif;color:#0a3429">Your Pro report is ready.</p>` +
    `<p style="margin:0 0 18px"><a href="${esc(link)}" style="display:inline-block;padding:11px 20px;border-radius:999px;background:#0d543f;color:#ffffff;font:600 15px Arial,Helvetica,sans-serif;text-decoration:none">Open the report</a></p>` +
    p(covers) + p(keep) +
    p(`Questions? Write to ${SITE.email}.`) +
    `<p style="margin:18px 0 0;font:12px/1.5 Arial,Helvetica,sans-serif;color:#636b64">${esc(legal)}</p>` +
    `</div>`;

  return { subject: "Your WageCoach Pro report", text, html };
}

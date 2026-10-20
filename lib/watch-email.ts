import { esc } from "./html";
import { SITE } from "./site";
import { changeLocationKey, type DueAlert } from "./wage-schedule";
import { resolveLocation } from "./locations";

// Wage Watch emails: the double opt-in confirmation and the change alert. Pure,
// so the wording and escaping are tested without a network call. Plain and short:
// what changed, where, when, and the one link that manages everything.

export interface Email { subject: string; text: string; html: string }

const LEGAL = "WageCoach is general information, not legal or tax advice, and is not a law firm.";
const money = (n: number) => `$${n.toFixed(2)}`;

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function wrap(heading: string, body: string[], cta: { href: string; label: string }, footer: string[]): string {
  const p = (s: string) => `<p style="margin:0 0 14px;font:15px/1.55 Arial,Helvetica,sans-serif;color:#16201b">${esc(s)}</p>`;
  const small = (s: string) => `<p style="margin:0 0 6px;font:12px/1.5 Arial,Helvetica,sans-serif;color:#636b64">${esc(s)}</p>`;
  return `<div style="max-width:520px;padding:24px;background:#ffffff">` +
    `<p style="margin:0 0 14px;font:600 20px Georgia,serif;color:#0a3429">${esc(heading)}</p>` +
    body.map(p).join("") +
    `<p style="margin:4px 0 20px"><a href="${esc(cta.href)}" style="display:inline-block;padding:11px 20px;border-radius:999px;background:#0d543f;color:#ffffff;font:600 15px Arial,Helvetica,sans-serif;text-decoration:none">${esc(cta.label)}</a></p>` +
    footer.map(small).join("") + small(LEGAL) + `</div>`;
}

export function buildConfirmEmail(confirmLink: string, places: string[]): Email {
  const what = places.length ? `You asked to hear when the minimum wage changes in ${places.join(", ")}.` : "You asked for wage-change alerts.";
  const text = [what, "", "Confirm it here:", confirmLink, "", "If this wasn't you, ignore this email and nothing will be sent.", "", LEGAL].join("\n");
  const html = wrap("Confirm your wage alerts", [what], { href: confirmLink, label: "Confirm alerts" }, ["If this wasn't you, ignore this email and nothing will be sent."]);
  return { subject: "Confirm your WageCoach wage alerts", text, html };
}

/** For someone already subscribed who signed up again: their link, and nothing changed. */
export function buildLinkEmail(manageLink: string): Email {
  const what = "You're already getting WageCoach wage alerts. Here's a fresh link to your settings, where you can change places or upgrade.";
  const note = "Nothing has changed. If you didn't ask for this, ignore it.";
  const text = [what, "", manageLink, "", note, "", LEGAL].join("\n");
  const html = wrap("Your wage alerts", [what], { href: manageLink, label: "Open settings" }, [note]);
  return { subject: "Your WageCoach alerts link", text, html };
}

function alertLine(a: DueAlert): string {
  const what = a.change.field === "tippedCashWage" ? "tipped cash wage" : "minimum wage";
  // Name the place the change belongs to: a city watcher can be told about its state's change.
  const where = resolveLocation(changeLocationKey(a.change))?.label ?? a.change.key;
  const when = a.leadDays === 0 ? `is now ${money(a.change.value)} (from ${formatDate(a.change.effective)})` : `rises to ${money(a.change.value)} on ${formatDate(a.change.effective)}`;
  const note = a.change.note ? ` ${a.change.note}.` : "";
  return `${where}: the ${what} ${when}.${note}`;
}

export function buildAlertEmail(alerts: DueAlert[], manageLink: string): Email {
  const lines = alerts.map(alertLine);
  const soonest = Math.min(...alerts.map((a) => a.leadDays));
  const subject = soonest === 0
    ? "A minimum wage change takes effect today"
    : `Minimum wage change in ${soonest} day${soonest === 1 ? "" : "s"}`;
  const sources = alerts.map((a) => `Source: ${a.change.source}`);
  const todo = "Update pay rates, posters and any tipped-wage math before the date.";
  const text = [...lines, "", todo, "", ...sources, "", `Manage your alerts: ${manageLink}`, "", LEGAL].join("\n");
  const html = wrap(subject, [...lines, todo], { href: manageLink, label: "See your places" }, [...sources, `Questions? Write to ${SITE.email}.`]);
  return { subject, text, html };
}

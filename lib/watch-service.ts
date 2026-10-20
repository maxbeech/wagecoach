import { captureServerError, captureServerMessage } from "./observability";
import { parseLocations, resolveLocation, type WatchLocation } from "./locations";
import { sendEmail } from "./openhelm-mail";
import { publicBaseUrl } from "./site";
import { changeKey, dueAlerts, type DueAlert } from "./wage-schedule";
import { buildAlertEmail, buildConfirmEmail } from "./watch-email";
import { effectivePlan, WATCH_PLANS } from "./watch-plan";
import { isTokenShape, pgStore, type Watcher, type WatchStore } from "./watch-store";

// Wage Watch rules, independent of HTTP. Routes call these; tests call them with
// a memory store and a fake mailer. Every function returns a typed outcome
// instead of throwing, so a route can always answer with a real state.

export interface WatchDeps {
  store: WatchStore | null;
  sendMail: typeof sendEmail;
  baseUrl: string;
}

export function defaultDeps(): WatchDeps {
  return { store: pgStore(), sendMail: sendEmail, baseUrl: publicBaseUrl() };
}

export const manageLink = (base: string, token: string) => `${base}/wage-watch/manage?t=${encodeURIComponent(token)}`;
const confirmLink = (base: string, token: string) => `${base}/wage-watch/confirm?t=${encodeURIComponent(token)}`;

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[A-Za-z]{2,24}$/;
export const isEmail = (v: unknown): v is string => typeof v === "string" && v.length <= 254 && EMAIL.test(v.trim());

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "bad_email" | "no_locations" | "not_configured" | "mail_failed" | "error" };

/** Start (or restart) a free subscription and send the confirmation email. */
export async function subscribe(input: { email: unknown; locations: unknown }, d: WatchDeps): Promise<SubscribeResult> {
  if (!isEmail(input.email)) return { ok: false, reason: "bad_email" };
  const locations = parseLocations(input.locations, WATCH_PLANS.free.maxLocations);
  if (!locations.length) return { ok: false, reason: "no_locations" };
  if (!d.store) {
    captureServerMessage("Wage Watch is not configured", { scope: "watch_subscribe", missing: "DATABASE_URL" });
    return { ok: false, reason: "not_configured" };
  }
  try {
    const { watcher, token } = await d.store.upsert(input.email.trim(), locations.map((l) => l.key));
    const mail = buildConfirmEmail(confirmLink(d.baseUrl, token), locations.map((l) => l.label));
    const sent = await d.sendMail({ to: watcher.email, ...mail });
    if (!sent.sent) {
      captureServerMessage("Wage Watch confirmation email was not sent", { scope: "watch_subscribe", reason: sent.reason });
      return { ok: false, reason: "mail_failed" };
    }
    return { ok: true };
  } catch (err) {
    captureServerError(err, { scope: "watch_subscribe" });
    return { ok: false, reason: "error" };
  }
}

export type WatcherView = {
  watcher: Watcher;
  places: WatchLocation[];
  plan: (typeof WATCH_PLANS)[keyof typeof WATCH_PLANS];
};

export type LookupResult = { ok: true; view: WatcherView } | { ok: false; reason: "bad_token" | "not_found" | "not_configured" | "error" };

/** Resolve a manage/confirm link to its subscriber. */
export async function lookup(token: unknown, d: WatchDeps): Promise<LookupResult> {
  if (!isTokenShape(token)) return { ok: false, reason: "bad_token" };
  if (!d.store) return { ok: false, reason: "not_configured" };
  try {
    const watcher = await d.store.byToken(token);
    if (!watcher) return { ok: false, reason: "not_found" };
    return { ok: true, view: viewOf(watcher) };
  } catch (err) {
    captureServerError(err, { scope: "watch_lookup" });
    return { ok: false, reason: "error" };
  }
}

export function viewOf(watcher: Watcher): WatcherView {
  const places = watcher.locations.map(resolveLocation).filter((l): l is WatchLocation => l !== null);
  return { watcher, places, plan: effectivePlan(watcher.plan, watcher.subscriptionStatus) };
}

export async function confirm(token: unknown, d: WatchDeps): Promise<LookupResult> {
  const found = await lookup(token, d);
  if (!found.ok || !d.store) return found;
  await d.store.confirm(found.view.watcher.id);
  return lookup(token, d);
}

export type ManageResult = LookupResult | { ok: false; reason: "too_many" | "no_locations" };

/** Change places (capped by plan) or unsubscribe, authorised by the link token. */
export async function manage(input: { token?: unknown; action?: unknown; locations?: unknown }, d: WatchDeps): Promise<ManageResult> {
  const found = await lookup(input.token, d);
  if (!found.ok || !d.store) return found;
  const { watcher, plan } = found.view;
  try {
    if (input.action === "unsubscribe") {
      await d.store.unsubscribe(watcher.id);
    } else if (input.action === "locations") {
      const requested = Array.isArray(input.locations) ? input.locations.length : 0;
      const locations = parseLocations(input.locations, plan.maxLocations);
      if (!locations.length) return { ok: false, reason: "no_locations" };
      if (requested > plan.maxLocations) return { ok: false, reason: "too_many" };
      await d.store.setLocations(watcher.id, locations.map((l) => l.key));
    }
    return lookup(input.token, d);
  } catch (err) {
    captureServerError(err, { scope: "watch_manage" });
    return { ok: false, reason: "error" };
  }
}

export interface RunSummary { watchers: number; due: number; sent: number; failed: number; skipped: number }

/**
 * The daily job. For each confirmed subscriber, find alerts due today under
 * their plan, claim each one in the sent-log, then send one email per person.
 * A failed send gives its claims back so tomorrow's run retries them.
 */
export async function runAlerts(today: string, d: WatchDeps): Promise<RunSummary | { error: "not_configured" }> {
  if (!d.store) return { error: "not_configured" };
  const summary: RunSummary = { watchers: 0, due: 0, sent: 0, failed: 0, skipped: 0 };
  for (const watcher of await d.store.listActive()) {
    summary.watchers++;
    const { places, plan } = viewOf(watcher);
    const due = dueAlerts(places, plan.leadDays, today);
    summary.due += due.length;
    const claimed: DueAlert[] = [];
    for (const a of due) {
      if (await d.store.markSent(watcher.id, changeKey(a.change), a.leadDays)) claimed.push(a);
      else summary.skipped++;
    }
    if (!claimed.length) continue;
    try {
      // Only a hash is stored, so each alert carries a fresh link; the newest email's link is the live one.
      const fresh = await d.store.rotateToken(watcher.id);
      const mail = buildAlertEmail(claimed, manageLink(d.baseUrl, fresh));
      const res = await d.sendMail({ to: watcher.email, ...mail, clientId: `watch-${watcher.id}-${today}` });
      if (!res.sent) throw new Error(`mail ${res.reason}`);
      summary.sent++;
    } catch (err) {
      summary.failed++;
      for (const a of claimed) await d.store.unmarkSent(watcher.id, changeKey(a.change), a.leadDays);
      captureServerError(err, { scope: "watch_alerts" });
    }
  }
  return summary;
}

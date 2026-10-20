import { createHmac } from "node:crypto";
import { ALL_LOCATIONS, affectingKeys, parseLocations, resolveLocation } from "../lib/locations.ts";
import { SCHEDULED_CHANGES, type ScheduledChange } from "../lib/wage-schedule-data.ts";
import { changeKey, daysUntil, dueAlerts, dueBucket, isRedundant, nextChange, todayIso, upcomingFor } from "../lib/wage-schedule.ts";
import { buildAlertEmail, buildConfirmEmail } from "../lib/watch-email.ts";
import { effectivePlan, WATCH_PLANS } from "../lib/watch-plan.ts";
import { isTokenShape, memoryStore } from "../lib/watch-store.ts";
import { confirm, lookup, manage, runAlerts, subscribe, type WatchDeps } from "../lib/watch-service.ts";
import { activateFromSession, applySubscriptionEvent, watchCheckoutForm } from "../lib/watch-billing.ts";
import { handleStripeWebhook } from "../lib/stripe-webhook.ts";
import { memoryLedger } from "../lib/event-ledger.ts";
import { eq, ok, report } from "./_assert.mts";

// Wage Watch end to end, with a memory store, a fake mailer and a stubbed Stripe.

const realConsole = { log: console.log, warn: console.warn, error: console.error };
for (const m of ["log", "warn", "error"] as const) console[m] = () => {};

// --- the cited schedule itself -------------------------------------------------------
for (const c of SCHEDULED_CHANGES) {
  const id = `${c.scope}:${c.key} ${c.field} ${c.effective}`;
  ok(/^\d{4}-\d{2}-\d{2}$/.test(c.effective) && !Number.isNaN(Date.parse(c.effective)), `${id}: ISO date`);
  ok(/^https:\/\//.test(c.source), `${id}: has an https source`);
  ok(c.value >= 2.13 && c.value <= 40, `${id}: plausible dollar value`);
  ok(resolveLocation(c.scope === "state" ? `state:${c.key}` : `city:${c.key}`) !== null, `${id}: names a real place`);
}
for (const c of SCHEDULED_CHANGES) ok(!/\d{4}-\d{2}-\d{2}|CPI|DOL|CDLE|poster|statute \(/.test(c.note ?? ""), `${changeKey(c)}: note is plain language`);
eq(new Set(SCHEDULED_CHANGES.map(changeKey)).size, SCHEDULED_CHANGES.length, "no duplicate scheduled changes");

// --- locations -----------------------------------------------------------------------
eq(resolveLocation("state:ca")?.key, "state:CA", "state keys normalise case");
eq(resolveLocation("city:seattle-wa")?.label, "Seattle, WA", "city label");
eq(resolveLocation("state:ZZ"), null, "unknown state is rejected");
eq(resolveLocation("city:atlantis"), null, "unknown city is rejected");
eq(resolveLocation("<script>"), null, "garbage is rejected");
eq(parseLocations(["state:CA", "state:CA", "city:nope", "state:NY"], 10).map((l) => l.key).join(), "state:CA,state:NY", "dedupes and drops unknowns");
eq(parseLocations(["state:CA", "state:NY"], 1).length, 1, "caps at max");
eq(parseLocations("state:CA,state:TX", 5).length, 2, "accepts a comma string");
eq(parseLocations(42, 5).length, 0, "non-list input is empty");
eq(affectingKeys(resolveLocation("city:seattle-wa")!).join(), "city:seattle-wa,state:WA", "a city also hears its state's changes");
eq(ALL_LOCATIONS.length, 51 + 20, "51 states/DC plus 20 cities are watchable");

// --- schedule maths -------------------------------------------------------------------
eq(daysUntil("2027-01-01", "2026-12-31"), 1, "one day out");
eq(daysUntil("2026-12-31", "2027-01-01"), -1, "passed");
eq(Number.isNaN(daysUntil("nope", "2026-01-01")), true, "bad date is NaN");
const LEADS = [60, 30, 7, 0];
eq(dueBucket(61, LEADS), null, "61 days: nothing due");
eq(dueBucket(60, LEADS), 60, "60 days: 60-day reminder");
eq(dueBucket(45, LEADS), 60, "45 days: still the 60-day bucket (a late signup gets that one)");
eq(dueBucket(5, LEADS), 7, "5 days: the 7-day bucket");
eq(dueBucket(0, LEADS), 0, "the day it starts");
eq(dueBucket(-1, LEADS), null, "after it starts: nothing");
eq(dueBucket(NaN, LEADS), null, "NaN: nothing");

const FAKE: ScheduledChange[] = [
  { scope: "state", key: "WA", field: "minWage", value: 17.13, effective: "2027-01-01", source: "https://lni.wa.gov/x" },
  { scope: "city", key: "seattle-wa", field: "minWage", value: 21.97, effective: "2027-01-01", source: "https://seattle.gov/x", note: "all employers" },
  { scope: "state", key: "CA", field: "minWage", value: 16.90, effective: "2027-01-01", source: "https://dir.ca.gov/x" },
];
const seattle = resolveLocation("city:seattle-wa")!;
eq(upcomingFor(seattle, "2026-12-01", Infinity, FAKE).length, 2, "Seattle watcher sees city and state changes");
eq(upcomingFor(seattle, "2027-01-02", Infinity, FAKE).length, 0, "nothing upcoming after the date");
eq(nextChange("city:seattle-wa", "2026-12-01", FAKE)?.value, 21.97, "a city page shows its own change, not the state's");
eq(nextChange("state:TX", "2026-12-01", FAKE), null, "no announced change is null");
eq(isRedundant({ scope: "state", key: "WA", field: "tippedCashWage", value: 17.13, effective: "2027-01-01", source: "https://x" }, FAKE), true, "a tipped rate equal to the minimum is redundant");
eq(dueAlerts([seattle], LEADS, "2026-12-25", FAKE).map((a) => a.leadDays).join(), "7,7", "both changes due in the 7-day bucket");
eq(dueAlerts([seattle, resolveLocation("state:WA")!], LEADS, "2026-12-25", FAKE).length, 2, "the WA change is not sent twice to someone watching both");
ok(/^\d{4}-\d{2}-\d{2}$/.test(todayIso(new Date("2026-10-20T03:00:00Z"))), "todayIso is YYYY-MM-DD");
eq(todayIso(new Date("2027-01-01T03:00:00Z")), "2026-12-31", "todayIso uses U.S. Eastern time");

// --- plans ---------------------------------------------------------------------------
eq(effectivePlan("watch", "active").id, "watch", "active subscription is paid");
eq(effectivePlan("watch", "past_due").id, "free", "past_due falls back to free");
eq(effectivePlan("watch", "canceled").id, "free", "canceled is free");
eq(effectivePlan("free", "active").id, "free", "free row is free");
ok(WATCH_PLANS.watch.maxLocations > WATCH_PLANS.free.maxLocations, "paid covers more places");

// --- emails --------------------------------------------------------------------------
const ce = buildConfirmEmail("https://x.test/wage-watch/confirm?t=abc", ["Seattle, WA"]);
ok(ce.text.includes("https://x.test/wage-watch/confirm?t=abc") && ce.html.includes("Confirm alerts"), "confirm email carries the link");
ok(!/[—]/.test(ce.text + ce.html), "confirm email has no em dash");
const evil = buildConfirmEmail(`https://x.test/"><script>`, ["<b>x</b>"]);
ok(!evil.html.includes("<script>") && !evil.html.includes("<b>x</b>"), "confirm email escapes input");
const ae = buildAlertEmail(dueAlerts([seattle], LEADS, "2026-12-25", FAKE), "https://x.test/wage-watch/manage?t=abc");
eq(ae.subject, "Minimum wage change in 7 days", "alert subject names the lead time");
ok(ae.text.includes("Seattle, WA: the minimum wage rises to $21.97 on January 1, 2027. all employers."), "city line");
ok(ae.text.includes("Washington: the minimum wage rises to $17.13 on January 1, 2027."), "state line names the state");
ok(ae.text.includes("Source: https://seattle.gov/x"), "alert cites its source");
eq(buildAlertEmail(dueAlerts([seattle], LEADS, "2027-01-01", FAKE), "https://x").subject, "A minimum wage change takes effect today", "day-of subject");

// --- service: subscribe -> confirm -> manage -> alerts ---------------------------------
let clock = 1_000_000;
const later = () => { clock += 120_000; };
const store = memoryStore(() => clock);
const mails: Array<Record<string, unknown>> = [];
let mailOk = true;
const deps: WatchDeps = {
  store,
  baseUrl: "https://x.test",
  sendMail: (async (m: Record<string, unknown>) => { mails.push(m); return mailOk ? { sent: true, id: "m", status: "sent", threadId: null, replyTo: null, suppressed: [] } : { sent: false, reason: "error", error: "down" }; }) as unknown as WatchDeps["sendMail"],
};
eq((await subscribe({ email: "nope", locations: ["state:CA"] }, deps)).ok, false, "bad email refused");
eq(JSON.stringify(await subscribe({ email: "a@b.co", locations: ["state:ZZ"] }, deps)), JSON.stringify({ ok: false, reason: "no_locations" }), "no real place refused");
eq((await subscribe({ email: "a@b.co", locations: ["state:CA"] }, { ...deps, store: null })).ok, false, "no database is not_configured");
eq((await subscribe({ email: "Owner@Diner.com", locations: ["city:seattle-wa", "state:CA"] }, deps)).ok, true, "subscribe ok");
eq(store.rows.size, 1, "one row");
eq([...store.rows.values()][0].locations.join(), "city:seattle-wa", "free signup keeps only one place");
const confirmUrl = String(mails.at(-1)?.text).match(/https:\/\/x\.test\/wage-watch\/confirm\?t=([A-Za-z0-9_-]+)/);
ok(Boolean(confirmUrl), "confirm email links to the confirm page");
const token = decodeURIComponent(confirmUrl![1]);
ok(isTokenShape(token), "token has the expected shape");
ok(![...store.rows.values()].some((w) => JSON.stringify(w).includes(token)), "the raw token is never stored");
eq((await lookup("A".repeat(32), deps)).ok, false, "unknown token not found");
eq((await runAlerts("2026-12-25", deps) as { sent: number }).sent, 0, "unconfirmed subscribers get nothing");
eq((await confirm(token, deps)).ok, true, "confirm ok");

mailOk = false;
eq((await subscribe({ email: "x@y.co", locations: ["state:TX"] }, deps)).ok, false, "mail failure is reported, not hidden");
mailOk = true;

// The signup form is unauthenticated: it must never change an active subscriber.
const mailsBefore = mails.length;
eq((await subscribe({ email: "OWNER@diner.com", locations: ["state:FL"] }, deps)).ok, true, "same answer for an existing email (no enumeration)");
eq(mails.length, mailsBefore, "a repeat within a minute is throttled: no mail");
later();
await subscribe({ email: "owner@diner.com", locations: ["state:FL"] }, deps);
ok(String(mails.at(-1)?.subject).includes("alerts link"), "an active subscriber gets their link, not a confirmation");
eq((await lookup(token, deps)).ok && (await lookup(token, deps) as { ok: true; view: { places: { key: string }[] } }).view.places[0].key, "city:seattle-wa", "a stranger's signup changed nothing");

const tooMany = await manage({ token, action: "locations", locations: ["state:CA", "state:NY"] }, deps);
eq(tooMany.ok ? "ok" : tooMany.reason, "too_many", "free plan can't add a second place");
eq((await manage({ token, action: "locations", locations: [] }, deps)).ok, false, "can't save zero places");
const swapped = await manage({ token, action: "locations", locations: ["state:WA"] }, deps);
eq(swapped.ok && swapped.view.places[0].key, "state:WA", "swap place");

// Alerts run against the real schedule wrapper only via FAKE-like data: inject by watching WA and using a date
// before a real WA change if there is one; otherwise assert the summary shape.
const before = mails.length;
const sum = await runAlerts("2026-12-25", deps) as { watchers: number; sent: number; failed: number };
eq(sum.watchers, 1, "one active watcher");
const again = await runAlerts("2026-12-25", deps) as { sent: number };
eq(again.sent, 0, "a second run the same day sends nothing new");
ok(mails.length - before === sum.sent, "one email per subscriber with due alerts");

// Each alert carries a fresh link and the old one stops working; use the newest.
let live = token;
if (sum.sent) {
  const m = String(mails.at(-1)?.text).match(/wage-watch\/manage\?t=([A-Za-z0-9_%-]+)/);
  ok(Boolean(m), "alert email carries a manage link");
  live = decodeURIComponent(m![1]);
  eq((await lookup(token, deps)).ok, false, "the previous link stops working after an alert");
}
// Re-subscribe after unsubscribing must be confirmed again (nobody can re-subscribe someone else).
eq((await manage({ token: live, action: "unsubscribe" }, deps)).ok, true, "unsubscribe ok");
later();
await subscribe({ email: "owner@diner.com", locations: ["state:TX"] }, deps);
const owners = [...store.rows.values()].filter((r) => r.email.toLowerCase() === "owner@diner.com");
eq(owners.length, 1, "same email (any case) is the same subscriber");
const row = owners[0];
eq(row.confirmedAt, null, "re-subscribing after unsubscribe needs a fresh confirmation");

// --- billing ---------------------------------------------------------------------------
const w = (await store.byId(row.id))!;
const form = watchCheckoutForm(w, "https://x.test/wage-watch/manage?t=TOK");
eq(form.get("mode"), "subscription", "subscription mode");
eq(form.get("line_items[0][price_data][unit_amount]"), String(WATCH_PLANS.watch.priceUsd * 100), "price comes from the plan");
eq(form.get("line_items[0][price_data][recurring][interval]"), "month", "monthly");
eq(form.get("client_reference_id"), w.id, "ties the session to the subscriber");
eq(form.get("metadata[wagecoach_product]"), "wage_watch", "tags the session as ours");
eq(form.get("subscription_data[metadata][wagecoach_product]"), "wage_watch", "tags the subscription as ours");
eq(form.get("customer_email"), w.email, "prefills email for a new customer");
eq(form.get("success_url"), "https://x.test/wage-watch/manage?t=TOK&session_id={CHECKOUT_SESSION_ID}", "returns to manage with the session");

const session = (over: Record<string, unknown> = {}) => ({ id: "cs_test_watch12345", mode: "subscription", status: "complete", payment_status: "paid", client_reference_id: w.id, customer: "cus_1", subscription: "sub_1", metadata: { wagecoach_product: "wage_watch" }, ...over });
let subStatus = "active";
const stripeWith = (s: unknown) => (async (url: string) => new Response(JSON.stringify(
  String(url).includes("/subscriptions/") ? { id: "sub_1", status: subStatus, metadata: { wagecoach_product: "wage_watch" } } : s,
), { status: 200 })) as unknown as typeof fetch;
const env = { STRIPE_SECRET_KEY: "sk_test_x" };
eq(JSON.stringify(await activateFromSession("cs_test_watch12345", store, env, stripeWith(session({ metadata: {} })))), JSON.stringify({ ok: false, reason: "not_watch" }), "someone else's session is not ours");
eq((await activateFromSession("cs_test_watch12345", store, env, stripeWith(session({ payment_status: "unpaid" })))).ok, false, "unpaid does not activate");
eq((await activateFromSession("cs_test_watch12345", store, env, stripeWith(session()), "other-id")).ok, false, "a session for another subscriber is refused");
eq((await activateFromSession("bad", store, env, stripeWith(session()))).ok, false, "malformed session id refused");
subStatus = "canceled";
eq(JSON.stringify(await activateFromSession("cs_test_watch12345", store, env, stripeWith(session()), w.id)), JSON.stringify({ ok: false, reason: "subscription_inactive" }), "an old session for a cancelled subscription does not re-activate");
eq(effectivePlan((await store.byId(w.id))!.plan, (await store.byId(w.id))!.subscriptionStatus).id, "free", "replay leaves the plan free");
subStatus = "active";
eq((await activateFromSession("cs_test_watch12345", store, env, stripeWith(session()), w.id)).ok, true, "paid session with a live subscription activates");
const paid = (await store.byId(w.id))!;
eq(effectivePlan(paid.plan, paid.subscriptionStatus).id, "watch", "now on Wage Watch");
eq(paid.stripeSubscription, "sub_1", "subscription id stored");

eq(await applySubscriptionEvent({ id: "sub_1", status: "active", metadata: {} }, store), false, "untagged subscription ignored");
eq(await applySubscriptionEvent({ id: "sub_1", status: "canceled", customer: "cus_1", metadata: { wagecoach_product: "wage_watch" } }, store), true, "cancel applied");
const canceled = (await store.byId(w.id))!;
eq(effectivePlan(canceled.plan, canceled.subscriptionStatus).id, "free", "canceled drops to free");

// --- webhook routes Wage Watch events ---------------------------------------------------
const SECRET = "whsec_watch";
const NOW = 1_800_000_000;
const sign = (body: string) => `t=${NOW},v1=${createHmac("sha256", SECRET).update(`${NOW}.${body}`).digest("hex")}`;
const hook = (body: string, s: unknown, over: Record<string, unknown> = {}) => handleStripeWebhook(body, sign(body), {
  env: { STRIPE_WEBHOOK_SECRET: SECRET, STRIPE_SECRET_KEY: "sk_test_x" }, nowSeconds: () => NOW, ledger: memoryLedger(),
  watchStore: store, fetchImpl: stripeWith(s), stripeMs: 50, mailMs: 50, ...over,
});
const subEvt = JSON.stringify({ id: "evt_s1", type: "customer.subscription.updated", data: { object: { id: "sub_1", status: "active", customer: "cus_1", metadata: { wagecoach_product: "wage_watch" } } } });
eq((await hook(subEvt, {})).body.watch, "updated", "subscription update mirrored");
eq(effectivePlan((await store.byId(w.id))!.plan, "active").id, "watch", "back on Wage Watch");
const coEvt = JSON.stringify({ id: "evt_c1", type: "checkout.session.completed", data: { object: { id: "cs_test_watch12345", metadata: { wagecoach_product: "wage_watch" } } } });
eq((await hook(coEvt, session())).body.watch, "activated", "checkout completion activates");
eq((await hook(coEvt, session(), { watchStore: null })).status, 503, "no database: explicit 503");
const kitEvt = JSON.stringify({ id: "evt_k1", type: "checkout.session.completed", data: { object: { id: "cs_test_kit1234567" } } });
eq((await hook(kitEvt, {})).body.ignored, "not_report", "a Kit purchase is not Wage Watch, and with no report price it is ignored");
const otherSub = JSON.stringify({ id: "evt_o1", type: "customer.subscription.deleted", data: { object: { id: "sub_x", metadata: {} } } });
eq((await hook(otherSub, {})).body.ignored, "not_ours", "another product's subscription is ignored");

Object.assign(console, realConsole);
report("watch");

import { createHmac } from "node:crypto";
import { handleStripeWebhook, type WebhookDeps } from "../lib/stripe-webhook.ts";
import { memoryLedger } from "../lib/event-ledger.ts";
import { eq, ok, report } from "./_assert.mts";

// The Stripe webhook that emails a paid buyer their Pro report link. Every outside
// thing (Stripe, the mailer, the event ledger, the clock) is injected.

const SECRET = "whsec_test_secret_value";
const NOW = 1_800_000_000;
const SESSION = "cs_test_a1B2c3D4e5F6g7H8";
const env = { STRIPE_WEBHOOK_SECRET: SECRET, STRIPE_SECRET_KEY: "sk_test_x", STRIPE_PRICE_ID: "price_report", STRIPE_KIT_PRICE_ID: "price_kit", NEXT_PUBLIC_SITE_URL: "https://example.test" };

const sign = (body: string, t = NOW) => `t=${t},v1=${createHmac("sha256", SECRET).update(`${t}.${body}`).digest("hex")}`;
const event = (id = "evt_1", type = "checkout.session.completed", sessionId = SESSION) => JSON.stringify({ id, object: "event", type, data: { object: { id: sessionId, object: "checkout.session" } } });
const session = (over: Record<string, unknown> = {}) => ({
  id: SESSION, mode: "payment", payment_status: "paid", amount_total: 1900, currency: "usd", metadata: { states: "CA,NY" },
  customer_details: { email: "buyer@example.test" }, line_items: { data: [{ price: { id: "price_report" } }] }, ...over,
});

// Collect everything printed, so we can prove secrets and emails never reach a log.
const printed: string[] = [];
const realConsole = { log: console.log, warn: console.warn, error: console.error };
for (const m of ["log", "warn", "error"] as const) console[m] = (...a: unknown[]) => { printed.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ")); };

function rig(opts: { stripe?: () => Response | Promise<Response>; mail?: () => unknown } = {}) {
  const calls = { stripe: [] as string[], mail: [] as Array<Record<string, unknown>> };
  const deps: Partial<WebhookDeps> = {
    env,
    nowSeconds: () => NOW,
    ledger: memoryLedger(),
    stripeMs: 50,
    mailMs: 50,
    fetchImpl: (async (url: string) => { calls.stripe.push(url); return opts.stripe ? opts.stripe() : new Response(JSON.stringify(session()), { status: 200 }); }) as unknown as typeof fetch,
    sendMail: (async (input: Record<string, unknown>) => {
      calls.mail.push(input);
      return opts.mail ? opts.mail() : { sent: true, id: "m1", status: "sent", threadId: null, replyTo: null, suppressed: [] };
    }) as unknown as WebhookDeps["sendMail"],
  };
  const run = (body: string, header: string | null = sign(body), over: Partial<WebhookDeps> = {}) => handleStripeWebhook(body, header, { ...deps, ...over });
  return { calls, deps, run };
}
const stripeJson = (s: unknown, status = 200) => () => new Response(JSON.stringify(s), { status });
const shape = (r: { status: number; body: Record<string, unknown> }) => `${r.status} ${JSON.stringify(r.body)}`;

// --- configuration: unconfigured is an explicit 503, nothing is called ---------------
for (const missing of ["STRIPE_WEBHOOK_SECRET", "STRIPE_SECRET_KEY", "STRIPE_PRICE_ID"]) {
  const t = rig();
  const r = await t.run(event(), sign(event()), { env: { ...env, [missing]: undefined } });
  eq(shape(r), `503 ${JSON.stringify({ ok: false, reason: "not_configured" })}`, `503 when ${missing} is missing`);
  eq(t.calls.stripe.length + t.calls.mail.length, 0, `no Stripe or mail call when ${missing} is missing`);
}

// --- signature: checked on the raw body before anything else -------------------------
{
  const t = rig();
  const body = event();
  for (const [label, header] of [["no header", null], ["wrong secret", `t=${NOW},v1=${createHmac("sha256", "whsec_nope").update(`${NOW}.${body}`).digest("hex")}`], ["stale", sign(body, NOW - 600)], ["garbage", "nonsense"]] as const) {
    eq(shape(await t.run(body, header)), `400 ${JSON.stringify({ ok: false, reason: "bad_signature" })}`, `400 for ${label}`);
  }
  eq((await t.run(body.replace("evt_1", "evt_9"), sign(body))).status, 400, "400 when the body was altered after signing");
  eq(t.calls.stripe.length + t.calls.mail.length, 0, "a bad signature triggers no Stripe lookup and no mail");
  const pretty = JSON.stringify(JSON.parse(body), null, 4) + "\n";
  eq((await t.run(pretty, sign(pretty))).status, 200, "the body is verified as raw bytes, so unusual whitespace still passes");
}

// --- payload shape --------------------------------------------------------------------
{
  const t = rig();
  eq((await t.run("not json", sign("not json"))).status, 400, "400 for a signed body that is not JSON");
  const noId = JSON.stringify({ type: "checkout.session.completed", data: { object: { id: SESSION } } });
  eq((await t.run(noId, sign(noId))).status, 400, "400 for an event with no id");
  const noSession = JSON.stringify({ id: "evt_2", type: "checkout.session.completed", data: { object: {} } });
  eq(shape(await t.run(noSession, sign(noSession))), `400 ${JSON.stringify({ ok: false, reason: "bad_payload" })}`, "400 for an event with no session id");
  eq(t.calls.mail.length, 0, "nothing mailed for bad payloads");
}

// --- event types ----------------------------------------------------------------------
{
  const t = rig();
  for (const type of ["payment_intent.succeeded", "checkout.session.async_payment_failed", "checkout.session.expired", "customer.created"]) {
    const b = event("evt_t", type);
    eq(shape(await t.run(b)), `200 ${JSON.stringify({ received: true, ignored: "event_type" })}`, `${type} is ignored with 200`);
  }
  eq(t.calls.stripe.length, 0, "ignored types cost no Stripe call");
}

// --- the happy path: paid report -> one email with the right link --------------------
{
  const t = rig();
  const r = await t.run(event());
  eq(shape(r), `200 ${JSON.stringify({ received: true, delivered: true })}`, "paid report: 200 delivered");
  eq(t.calls.mail.length, 1, "exactly one email");
  const m = t.calls.mail[0];
  eq(m.to, "buyer@example.test", "sent to the address Stripe collected");
  eq(m.subject, "Your WageCoach Pro report", "subject");
  ok(String(m.text).includes(`https://example.test/pro-report?session_id=${SESSION}`), "email links to the report page for this session");
  ok(String(m.text).includes("CA, NY"), "email names the states from session metadata");
  ok(/^pro-report-[0-9a-f]{16}$/.test(String(m.clientId)), "email carries an idempotency key");
  ok(!String(m.clientId).includes("cs_"), "the idempotency key does not contain the session id");
  ok(t.calls.stripe[0].includes(`/checkout/sessions/${SESSION}`) && t.calls.stripe[0].includes("expand[]=line_items"), "the session is re-read from Stripe with line items");

  const legacy = rig({ stripe: stripeJson(session({ metadata: {} })) });
  await legacy.run(event());
  ok(String(legacy.calls.mail[0].text).includes("Pick your states"), "a session with no states tells the buyer to pick them on the page");

  const async_ = rig();
  eq((await async_.run(event("evt_a", "checkout.session.async_payment_succeeded"))).status, 200, "async_payment_succeeded is handled");
  eq(async_.calls.mail.length, 1, "a delayed payment that settles gets its email");
}

// --- ownership on a shared Stripe account: only OUR report price is acted on ---------
{
  const cases: Array<[string, Record<string, unknown>, string]> = [
    ["a Claim Kit sale", { line_items: { data: [{ price: { id: "price_kit" } }] } }, "not_report"],
    ["another product's sale", { line_items: { data: [{ price: { id: "price_tablehelm_pro" } }] } }, "not_report"],
    ["an unpaid report (delayed method, still pending)", { payment_status: "unpaid" }, "not_paid"],
    ["a subscription", { mode: "subscription" }, "not_payment_mode"],
  ];
  for (const [label, over, why] of cases) {
    const t = rig({ stripe: stripeJson(session(over)) });
    eq(shape(await t.run(event())), `200 ${JSON.stringify({ received: true, ignored: why })}`, `${label} is ignored (${why})`);
    eq(t.calls.mail.length, 0, `${label}: no email`);
  }
}

// --- idempotency: dedupe on the event id ---------------------------------------------
{
  const t = rig();
  const b = event("evt_dup");
  eq((await t.run(b)).body.delivered, true, "first delivery sends the email");
  eq(shape(await t.run(b)), `200 ${JSON.stringify({ received: true, duplicate: true })}`, "the same event again is a 200 duplicate");
  await t.run(b);
  eq(t.calls.mail.length, 1, "three deliveries of one event send one email");
  eq((await t.run(event("evt_other"))).status, 200, "a different event id is still processed");
  eq(t.calls.mail.length, 2, "a new event id sends its own mail");
  eq(t.calls.mail[0].clientId, t.calls.mail[1].clientId, "two events for one session share one mail key, so the mailer drops the repeat");
}

// --- failure returns 500 and gives the claim back, so Stripe's retry works -----------
{
  let attempt = 0;
  const t = rig({ mail: () => (++attempt === 1 ? { sent: false, reason: "error", error: "boom" } : { sent: true, id: "m2", status: "sent", threadId: null, replyTo: null, suppressed: [] }) });
  const b = event("evt_retry");
  eq(shape(await t.run(b)), `500 ${JSON.stringify({ ok: false, reason: "mail_failed" })}`, "a mail failure answers 500");
  const again = await t.run(b);
  eq(shape(again), `200 ${JSON.stringify({ received: true, delivered: true })}`, "the retry is processed, not swallowed as a duplicate");
  eq(t.calls.mail.length, 2, "one failed send, one good send");
  eq((await t.run(b)).body.duplicate, true, "after success the event is a duplicate again");
}
{
  const t = rig({ mail: () => ({ sent: false, reason: "not_configured" }) });
  eq(shape(await t.run(event())), `500 ${JSON.stringify({ ok: false, reason: "mail_not_configured" })}`, "mail not configured is a loud 500, so Stripe keeps retrying");
}
{
  const t = rig({ mail: () => ({ sent: true, id: "m3", status: "pending_approval", threadId: null, replyTo: null, suppressed: [] }) });
  eq((await t.run(event())).body.reason, "mail_pending_approval", "a message held for approval is not reported as delivered");
}
{
  const t = rig({ mail: () => { throw new Error("mailer crashed"); } });
  const b = event("evt_crash");
  eq(shape(await t.run(b)), `500 ${JSON.stringify({ ok: false, reason: "handler_error" })}`, "a thrown error answers 500");
  eq((await t.run(b, sign(b), { sendMail: (async () => ({ sent: true, id: "m", status: "sent", threadId: null, replyTo: null, suppressed: [] })) as unknown as WebhookDeps["sendMail"] })).body.delivered, true, "and the claim was released for the retry");
}
{
  const t = rig({ mail: () => new Promise(() => {}) });
  eq((await t.run(event())).body.reason, "handler_error", "a mailer that never answers is cut off, not awaited forever");
}
{
  const down = rig({ stripe: () => { throw new Error("offline"); } });
  eq(shape(await down.run(event())), `500 ${JSON.stringify({ ok: false, reason: "unreachable" })}`, "Stripe unreachable answers 500");
  const err = rig({ stripe: stripeJson({}, 500) });
  eq((await err.run(event())).body.reason, "http_500", "Stripe 500 answers 500");
  eq(down.calls.mail.length + err.calls.mail.length, 0, "no email when the purchase could not be confirmed");
  const b = event("evt_after_outage");
  const flaky = rig({ stripe: stripeJson({}, 500) });
  await flaky.run(b);
  eq((await flaky.run(b, sign(b), { fetchImpl: (async () => new Response(JSON.stringify(session()), { status: 200 })) as unknown as typeof fetch })).body.delivered, true, "once Stripe recovers, the retry delivers");
}
{
  const t = rig({ stripe: stripeJson(session({ customer_details: { email: null } })) });
  eq(shape(await t.run(event())), `200 ${JSON.stringify({ received: true, delivered: false })}`, "no email address on the session is reported, not retried forever");
  eq(t.calls.mail.length, 0, "and nothing is mailed");
}

// --- nothing sensitive is ever printed -----------------------------------------------
Object.assign(console, realConsole);
const log = printed.join("\n");
ok(printed.length > 5 && log.includes("stripe_webhook"), "the failure paths did log, so the checks below are not vacuous");
ok(!log.includes(SECRET) && !log.includes("sk_test_x"), "no secret appears in any log line");
ok(!log.includes("buyer@example.test"), "no buyer email appears in any log line");
ok(!log.includes(SESSION), "no Stripe session id appears in any log line");

report("stripe-webhook");

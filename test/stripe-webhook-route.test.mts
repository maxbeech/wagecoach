import { createHmac } from "node:crypto";
import * as route from "../app/api/stripe/webhook/route.ts";
import { eq, ok, report } from "./_assert.mts";

// The real route handler, with a real Request, driven through process.env and a
// stubbed global fetch that answers both Stripe and the OpenHelm Mail API.

const SECRET = "whsec_route_test_secret";
const SESSION = "cs_test_Zz9Yy8Xx7Ww6Vv5U";
process.env.STRIPE_WEBHOOK_SECRET = SECRET;
process.env.STRIPE_SECRET_KEY = "sk_test_route";
process.env.STRIPE_PRICE_ID = "price_report";
process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
process.env.OPENHELM_API_KEY = "ohk_test";
process.env.OPENHELM_MAIL_INBOX_ID = "inbox_1";
const realConsole = { log: console.log, warn: console.warn, error: console.error };
for (const m of ["log", "warn", "error"] as const) console[m] = () => {};

const mailBodies: Array<Record<string, unknown>> = [];
let stripePaid = true;
globalThis.fetch = (async (url: string, init?: RequestInit) => {
  if (String(url).startsWith("https://api.stripe.com/v1/checkout/sessions/")) {
    return new Response(JSON.stringify({
      id: SESSION, mode: "payment", payment_status: stripePaid ? "paid" : "unpaid", amount_total: 1900, currency: "usd",
      metadata: { states: "TX,WA" }, customer_details: { email: "route-buyer@example.test" }, line_items: { data: [{ price: { id: "price_report" } }] },
    }), { status: 200 });
  }
  if (String(url).includes("/inboxes/inbox_1/messages")) {
    mailBodies.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ message_id: "m_1", status: "sent" }), { status: 200 });
  }
  return new Response("unexpected", { status: 500 });
}) as typeof fetch;

const now = () => Math.floor(Date.now() / 1000);
const eventBody = (id: string, type = "checkout.session.completed") => JSON.stringify({ id, type, data: { object: { id: SESSION } } });
const post = (body: string, header?: string | null) => route.POST(new Request("https://example.test/api/stripe/webhook", {
  method: "POST",
  headers: header === null ? {} : { "stripe-signature": header ?? `t=${now()},v1=${createHmac("sha256", SECRET).update(`${now()}.${body}`).digest("hex")}` },
  body,
}));

eq(Object.keys(route).filter((k) => ["GET", "PUT", "PATCH", "DELETE"].includes(k)).length, 0, "only POST is exposed, so other methods get a 405");
eq(route.runtime, "nodejs", "runs on the Node runtime (node:crypto)");
eq(route.dynamic, "force-dynamic", "never cached");

// Valid, signed, paid: 200 and one mail with the report link.
let res = await post(eventBody("evt_route_1"));
eq(res.status, 200, "signed paid event: 200");
eq(JSON.stringify(await res.json()), JSON.stringify({ received: true, delivered: true }), "body says delivered");
eq(mailBodies.length, 1, "one mail request reached the mail API");
const sent = mailBodies[0];
eq(JSON.stringify(sent.to), JSON.stringify(["route-buyer@example.test"]), "mail goes to the buyer");
ok(String(sent.text).includes(`https://example.test/pro-report?session_id=${SESSION}`), "mail carries the report link");
ok(String(sent.text).includes("TX, WA"), "mail names the states");
ok(/^pro-report-[0-9a-f]{16}$/.test(String(sent.client_id)), "mail carries the idempotency key the mailer dedupes on");

// The same event again: duplicate, no second mail.
res = await post(eventBody("evt_route_1"));
eq(JSON.stringify(await res.json()), JSON.stringify({ received: true, duplicate: true }), "same event id again: duplicate");
eq(mailBodies.length, 1, "still one mail");

// Signature problems: 400 and no mail.
const before = mailBodies.length;
eq((await post(eventBody("evt_route_2"), "t=1,v1=00")).status, 400, "bad signature: 400");
eq((await post(eventBody("evt_route_3"), null)).status, 400, "no signature header: 400");
eq(mailBodies.length, before, "no mail on a bad signature");

// Unpaid (a delayed payment still pending): acknowledged, nothing sent.
stripePaid = false;
res = await post(eventBody("evt_route_4"));
eq(JSON.stringify(await res.json()), JSON.stringify({ received: true, ignored: "not_paid" }), "unpaid: ignored");
eq(mailBodies.length, before, "no mail for an unpaid session");

// Unconfigured: an explicit 503.
const saved = process.env.STRIPE_WEBHOOK_SECRET;
delete process.env.STRIPE_WEBHOOK_SECRET;
res = await post(eventBody("evt_route_5"));
eq(res.status, 503, "no webhook secret: 503");
eq(JSON.stringify(await res.json()), JSON.stringify({ ok: false, reason: "not_configured" }), "503 says not_configured");
process.env.STRIPE_WEBHOOK_SECRET = saved;

Object.assign(console, realConsole);
report("stripe-webhook-route");

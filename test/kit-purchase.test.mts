import { judgeKitSession, kitTransactionId, verifyKitPurchase } from "../lib/kit-purchase.ts";
import { userRefFor } from "../lib/openhelm-analytics-mp.ts";
import { eq, ok, report } from "./_assert.mts";

eq(await userRefFor("00000000-0000-0000-0000-000000000000"), "12b9377cbe7e5c94", "userRefFor pinned test vector");

const SESSION = "cs_live_a1B2c3D4e5F6";
const paidKit = { payment_status: "paid", amount_total: 2900, currency: "usd", line_items: { data: [{ price: { id: "price_kit" } }] } };

const tx = await kitTransactionId(SESSION);
ok(/^kit_[0-9a-f]{16}$/.test(tx), "transaction id is kit_ plus 16 hex");
ok(!tx.includes(SESSION) && !tx.includes("cs_"), "transaction id does not contain the Stripe session id");
eq(await kitTransactionId(SESSION), tx, "transaction id is stable, so a reload de-duplicates");

const good = await judgeKitSession(paidKit, "price_kit", SESSION);
ok(good.ok, "a paid session with the kit price is confirmed");
if (good.ok) {
  eq(good.purchase.value, 29, "value is what Stripe charged");
  eq(good.purchase.currency, "USD", "currency is upper-cased");
  eq(good.purchase.transactionId, tx, "transaction id matches");
}
const discounted = await judgeKitSession({ ...paidKit, amount_total: 1450 }, "price_kit", SESSION);
ok(discounted.ok && discounted.purchase.value === 14.5, "a promotion code lowers value to the amount charged");
eq(JSON.stringify(await judgeKitSession({ ...paidKit, payment_status: "unpaid" }, "price_kit", SESSION)), JSON.stringify({ ok: false, reason: "not_paid" }), "unpaid is refused");
eq(JSON.stringify(await judgeKitSession({ ...paidKit, line_items: { data: [{ price: { id: "price_report" } }] } }, "price_kit", SESSION)), JSON.stringify({ ok: false, reason: "wrong_product" }), "the $19 report does not unlock the kit");
eq(JSON.stringify(await judgeKitSession({ payment_status: "paid" }, "price_kit", SESSION)), JSON.stringify({ ok: false, reason: "wrong_product" }), "no line items is refused");

const env = { STRIPE_SECRET_KEY: "sk_test_x", STRIPE_KIT_PRICE_ID: "price_kit" };
const reply = (status: number, body: unknown) => (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;
eq(JSON.stringify(await verifyKitPurchase(undefined, env, reply(200, paidKit))), JSON.stringify({ ok: false, reason: "no_session" }), "no session id");
eq(JSON.stringify(await verifyKitPurchase(SESSION, {}, reply(200, paidKit))), JSON.stringify({ ok: false, reason: "not_configured" }), "Stripe not configured");
eq(JSON.stringify(await verifyKitPurchase(SESSION, env, reply(404, {}))), JSON.stringify({ ok: false, reason: "http_404" }), "Stripe 404");
eq(JSON.stringify(await verifyKitPurchase(SESSION, env, (async () => { throw new Error("offline"); }) as unknown as typeof fetch)), JSON.stringify({ ok: false, reason: "unreachable" }), "Stripe unreachable");
const viaFetch = await verifyKitPurchase(SESSION, env, reply(200, paidKit));
ok(viaFetch.ok, "a paid kit session verifies through fetch");

let asked = "";
await verifyKitPurchase(SESSION, env, (async (url: string) => { asked = url; return new Response("{}", { status: 200 }); }) as unknown as typeof fetch);
ok(asked.includes(`/checkout/sessions/${SESSION}`) && asked.includes("expand[]=line_items"), "asks Stripe for the session with its line items");

report("kit-purchase");

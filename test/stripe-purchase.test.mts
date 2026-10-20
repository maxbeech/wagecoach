import { chargedAmount, judgeSession, PURCHASE_PRODUCTS, verifyPurchase } from "../lib/stripe-purchase.ts";
import { verifyReportPurchase } from "../lib/report-purchase.ts";
import { eq, ok, report } from "./_assert.mts";

// Shared Stripe session verification, used by the Claim Kit page, the Pro report
// page and the webhook. Session shapes follow https://docs.stripe.com/api/checkout/sessions/object

const SESSION = "cs_test_a1B2c3D4e5F6g7H8";
const line = (price: string) => ({ data: [{ price: { id: price } }] });
const paid = (price: string, over: Record<string, unknown> = {}) => ({
  mode: "payment", payment_status: "paid", amount_total: 1900, currency: "usd", line_items: line(price), ...over,
});
const json = (o: unknown) => JSON.stringify(o);
const reply = (status: number, body: unknown) => (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

// --- judgeSession: paid, unpaid, wrong price, wrong mode ----------------------------
eq(judgeSession(paid("price_report"), "price_report").ok, true, "paid + payment mode + right price is accepted");
eq(json(judgeSession(paid("price_report", { payment_status: "unpaid" }), "price_report")), json({ ok: false, reason: "not_paid" }), "unpaid is refused");
eq(json(judgeSession(paid("price_report", { payment_status: "no_payment_required" }), "price_report")), json({ ok: false, reason: "not_paid" }), "no_payment_required is not 'paid'");
eq(json(judgeSession(paid("price_other"), "price_report")), json({ ok: false, reason: "wrong_product" }), "a different price is refused");
eq(json(judgeSession(paid("price_report", { mode: "subscription" }), "price_report")), json({ ok: false, reason: "wrong_mode" }), "subscription mode is refused");
eq(json(judgeSession(paid("price_report", { mode: "setup" }), "price_report")), json({ ok: false, reason: "wrong_mode" }), "setup mode is refused");
eq(json(judgeSession(paid("price_report", { mode: undefined }), "price_report")), json({ ok: false, reason: "wrong_mode" }), "no mode is refused");
eq(json(judgeSession({ mode: "payment", payment_status: "paid" }, "price_report")), json({ ok: false, reason: "wrong_product" }), "no line items is refused");
eq(json(judgeSession(paid("price_report", { line_items: { data: [] } }), "price_report")), json({ ok: false, reason: "wrong_product" }), "empty line items is refused");
eq(json(judgeSession(null, "price_report")), json({ ok: false, reason: "not_paid" }), "null session is refused");
eq(json(judgeSession(undefined, "price_report")), json({ ok: false, reason: "not_paid" }), "undefined session is refused");
ok(judgeSession({ ...paid("price_x"), line_items: { data: [{ price: { id: "price_x" } }, { price: { id: "price_report" } }] } }, "price_report").ok, "the price may be one of several lines");
eq(json(chargedAmount(paid("p", { amount_total: 950 }))), json({ value: 9.5, currency: "USD" }), "charged amount follows what Stripe took");
eq(json(chargedAmount({})), json({ value: 0, currency: "USD" }), "missing amount reads as zero USD");

// --- verifyPurchase: configuration and Stripe responses -----------------------------
eq(PURCHASE_PRODUCTS.report.priceEnv, "STRIPE_PRICE_ID", "report price env var");
eq(PURCHASE_PRODUCTS.kit.priceEnv, "STRIPE_KIT_PRICE_ID", "kit price env var");

const env = { STRIPE_SECRET_KEY: "sk_test_x", STRIPE_PRICE_ID: "price_report", STRIPE_KIT_PRICE_ID: "price_kit" };
const verdict = async (p: "kit" | "report", id: string | undefined, e: Record<string, string | undefined>, f: typeof fetch) => json(await verifyPurchase(p, id, e, f));
eq(await verdict("report", undefined, env, reply(200, paid("price_report"))), json({ ok: false, reason: "no_session" }), "no session id");
eq(await verdict("report", "", env, reply(200, paid("price_report"))), json({ ok: false, reason: "no_session" }), "empty session id");
for (const bad of ["abc", "pi_123456789", "cs_", "cs_a b c d e f g h", "../etc/passwd", `cs_${"a".repeat(300)}`]) {
  eq(await verdict("report", bad, env, reply(200, paid("price_report"))), json({ ok: false, reason: "bad_session" }), `malformed id "${bad.slice(0, 16)}" never reaches Stripe`);
}
eq(await verdict("report", SESSION, { ...env, STRIPE_SECRET_KEY: undefined }, reply(200, paid("price_report"))), json({ ok: false, reason: "not_configured" }), "no Stripe key");
eq(await verdict("report", SESSION, { ...env, STRIPE_PRICE_ID: undefined }, reply(200, paid("price_report"))), json({ ok: false, reason: "not_configured" }), "no report price id");
eq(await verdict("kit", SESSION, { ...env, STRIPE_KIT_PRICE_ID: undefined }, reply(200, paid("price_kit"))), json({ ok: false, reason: "not_configured" }), "no kit price id");
eq(await verdict("report", SESSION, { ...env, STRIPE_KIT_PRICE_ID: undefined }, reply(200, paid("price_report"))).then((v) => JSON.parse(v).ok), true, "the kit price is not needed to verify the report");

eq(await verdict("report", SESSION, env, reply(404, {})), json({ ok: false, reason: "http_404" }), "Stripe 404");
eq(await verdict("report", SESSION, env, reply(401, {})), json({ ok: false, reason: "http_401" }), "Stripe 401 (bad key)");
eq(await verdict("report", SESSION, env, reply(500, {})), json({ ok: false, reason: "http_500" }), "Stripe 500");
eq(await verdict("report", SESSION, env, (async () => { throw new Error("offline"); }) as unknown as typeof fetch), json({ ok: false, reason: "unreachable" }), "Stripe unreachable");
eq(await verdict("report", SESSION, env, reply(200, paid("price_report", { payment_status: "unpaid" }))), json({ ok: false, reason: "not_paid" }), "unpaid through fetch");
eq(await verdict("report", SESSION, env, reply(200, paid("price_report", { mode: "subscription" }))), json({ ok: false, reason: "wrong_mode" }), "wrong mode through fetch");

// A paid session for one product must not open the other.
eq(await verdict("report", SESSION, env, reply(200, paid("price_kit"))), json({ ok: false, reason: "wrong_product" }), "a paid KIT does not unlock the report");
eq(await verdict("kit", SESSION, env, reply(200, paid("price_report"))), json({ ok: false, reason: "wrong_product" }), "a paid REPORT does not unlock the kit");
const good = await verifyPurchase("report", SESSION, env, reply(200, paid("price_report", { metadata: { states: "CA,NY" } })));
ok(good.ok, "a paid report session verifies");

// What we ask Stripe: the session, with line items expanded, using the secret key, uncached.
let askedUrl = "";
let askedInit: RequestInit | undefined;
await verifyPurchase("report", SESSION, env, (async (u: string, init?: RequestInit) => { askedUrl = u; askedInit = init; return new Response("{}", { status: 200 }); }) as unknown as typeof fetch);
ok(askedUrl.startsWith(`https://api.stripe.com/v1/checkout/sessions/${SESSION}`) && askedUrl.includes("expand[]=line_items"), "asks Stripe for the session with its line items");
eq((askedInit?.headers as Record<string, string>)?.Authorization, "Bearer sk_test_x", "authenticates with the secret key");
eq(askedInit?.cache, "no-store", "never cached");
ok(askedInit?.signal instanceof AbortSignal, "the lookup is time-bounded");

// Both products report an unreachable Stripe, each under its own Sentry scope.
const seenErrors: string[] = [];
const realError = console.error;
console.error = (...a: unknown[]) => { seenErrors.push(a.map(String).join(" ")); };
const offline = (async () => { throw new Error("offline"); }) as unknown as typeof fetch;
await verifyPurchase("kit", SESSION, env, offline);
await verifyPurchase("report", SESSION, env, offline);
console.error = realError;
ok(seenErrors.some((l) => l.includes("kit_purchase")), "an unreachable Stripe is reported under kit_purchase");
ok(seenErrors.some((l) => l.includes("report_purchase")), "an unreachable Stripe is reported under report_purchase");

// --- verifyReportPurchase: what the page gets ---------------------------------------
const rv = await verifyReportPurchase(SESSION, env, reply(200, paid("price_report", { metadata: { states: "CA,NY" } })));
eq(json(rv), json({ ok: true, purchase: { statesParam: "CA,NY" } }), "report purchase carries the states from session metadata");
const rvLegacy = await verifyReportPurchase(SESSION, env, reply(200, paid("price_report")));
eq(json(rvLegacy), json({ ok: true, purchase: { statesParam: "" } }), "a session from before state selection has no states");
eq(json(await verifyReportPurchase(SESSION, env, reply(200, paid("price_kit")))), json({ ok: false, reason: "wrong_product" }), "report purchase refuses a kit session");
ok(!JSON.stringify(rv).includes("@"), "the purchase handed to the page holds no email");

report("stripe-purchase");

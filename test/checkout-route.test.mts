import { POST } from "../app/api/checkout/route.ts";
import { checkoutFailureReason } from "../lib/analytics-events.ts";
import { publicBaseUrl } from "../lib/site.ts";
import { eq, ok, report } from "./_assert.mts";

// POST /api/checkout, the real handler, with Stripe stubbed.

const realConsole = { log: console.log, warn: console.warn, error: console.error };
for (const m of ["log", "warn", "error"] as const) console[m] = () => {};

const KEYS = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID", "STRIPE_KIT_PRICE_ID", "NEXT_PUBLIC_SITE_URL", "DATABASE_URL"] as const;
const setEnv = (vals: Partial<Record<(typeof KEYS)[number], string>>) => { for (const k of KEYS) { if (vals[k] === undefined) delete process.env[k]; else process.env[k] = vals[k]; } };
const full = { STRIPE_SECRET_KEY: "sk_test_x", STRIPE_PRICE_ID: "price_report", STRIPE_KIT_PRICE_ID: "price_kit", NEXT_PUBLIC_SITE_URL: "https://example.test" };

let stripeCalls: Array<{ url: string; auth: string; form: URLSearchParams }> = [];
let stripeReply: () => Response | Promise<Response> = () => new Response(JSON.stringify({ url: "https://checkout.stripe.com/c/pay/cs_test_abc" }), { status: 200 });
globalThis.fetch = (async (url: string, init?: RequestInit) => {
  stripeCalls.push({ url, auth: (init?.headers as Record<string, string>).Authorization, form: new URLSearchParams(String(init?.body)) });
  return stripeReply();
}) as typeof fetch;

const call = (body: unknown) => POST(new Request("https://example.test/api/checkout", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }));
const read = async (r: Response) => ({ status: r.status, body: await r.json() as Record<string, unknown> });

// --- not configured: an explicit 503, never a 200 -----------------------------------
for (const [label, vals] of [
  ["no Stripe key", { ...full, STRIPE_SECRET_KEY: undefined }],
  ["no kit price", { ...full, STRIPE_KIT_PRICE_ID: undefined }],
  ["nothing set", {}],
] as const) {
  setEnv(vals);
  stripeCalls = [];
  const { status, body } = await read(await call({ product: "kit" }));
  eq(status, 503, `${label}: 503`);
  eq(body.reason, "not_configured", `${label}: reason is not_configured`);
  eq(body.ok, false, `${label}: ok is false`);
  eq(body.product, "kit", `${label}: names the product`);
  ok(String(body.message).startsWith("The Claim Kit is not on sale yet"), `${label}: message names what is unavailable`);
  ok(String(body.message).includes("hello@mail.wagecoach.com") && !/[—–]/.test(String(body.message)), `${label}: message gives the contact and has no em dash`);
  ok(!JSON.stringify(body).includes("STRIPE_"), `${label}: the browser is not told which variable is missing`);
  eq(stripeCalls.length, 0, `${label}: Stripe is not called`);
}
eq(checkoutFailureReason(503, false), "http_503", "the button reports an unconfigured checkout as http_503");

// --- the retired Pro report and unknown products are refused ---------------------------
setEnv(full);
stripeCalls = [];
for (const body of [{ product: "report", states: ["CA"] }, {}, "not json"]) {
  const r = await read(await call(body));
  eq(r.status, 400, `${JSON.stringify(body)}: 400`);
  eq(r.body.reason, "unknown_product", `${JSON.stringify(body)}: unknown_product`);
}
eq(stripeCalls.length, 0, "no Stripe call for a product we do not sell");

// --- watch: needs a valid manage-link token; without a database it is unavailable ------
const w1 = await read(await call({ product: "watch", token: "not-a-token" }));
eq(w1.status, 400, "watch with a malformed token: 400");
eq(w1.body.reason, "bad_token", "watch with a malformed token: bad_token");
const w2 = await read(await call({ product: "watch", token: "A".repeat(32) }));
eq(w2.status, 503, "watch with no DATABASE_URL: 503");
eq(w2.body.reason, "not_configured", "watch with no DATABASE_URL: not_configured");
eq(stripeCalls.length, 0, "no Stripe call for watch without a subscriber");

// --- kit: unchanged contract ---------------------------------------------------------
stripeCalls = [];
await call({ product: "kit", caseQuery: "?rate=20&hrs=45" });
const kit = stripeCalls[0].form;
eq(kit.get("line_items[0][price]"), "price_kit", "kit price");
eq(kit.get("success_url"), "https://example.test/claim-kit?session_id={CHECKOUT_SESSION_ID}&rate=20&hrs=45", "kit success URL carries the case");
eq(kit.get("cancel_url"), "https://example.test/wage-claim?status=cancel", "kit cancel URL");
eq(kit.get("metadata[states]"), null, "kit sends no states");
eq(kit.get("mode"), "payment", "kit is a one-time payment");

// --- Stripe failures stay 502 --------------------------------------------------------
stripeReply = () => new Response(JSON.stringify({ error: { code: "x", message: "Invalid price" } }), { status: 400 });
eq((await read(await call({ product: "kit" }))).status, 502, "Stripe rejects the session: 502");
stripeReply = () => { throw new Error("offline"); };
eq((await read(await call({ product: "kit" }))).status, 502, "Stripe unreachable: 502");

// --- base URL repair (shared with the webhook email) ---------------------------------
eq(publicBaseUrl({}), "https://www.wagecoach.com", "defaults to the canonical host");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "" }), "https://www.wagecoach.com", "empty falls back");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "  " }), "https://www.wagecoach.com", "blank falls back");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "preview.example.test/" }), "https://preview.example.test", "adds the scheme, drops the trailing slash");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000///" }), "http://localhost:3000", "keeps http for local dev");

Object.assign(console, realConsole);
report("checkout-route");

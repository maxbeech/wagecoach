import { POST } from "../app/api/checkout/route.ts";
import { checkoutFailureReason } from "../lib/analytics-events.ts";
import { publicBaseUrl } from "../lib/site.ts";
import { eq, ok, report } from "./_assert.mts";

// POST /api/checkout, the real handler, with Stripe stubbed.

const realConsole = { log: console.log, warn: console.warn, error: console.error };
for (const m of ["log", "warn", "error"] as const) console[m] = () => {};

const KEYS = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID", "STRIPE_KIT_PRICE_ID", "NEXT_PUBLIC_SITE_URL"] as const;
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
for (const [label, vals, product, expectMsg] of [
  ["no Stripe key (report)", { ...full, STRIPE_SECRET_KEY: undefined }, "report", "The Pro report is not on sale yet"],
  ["no report price", { ...full, STRIPE_PRICE_ID: undefined }, "report", "The Pro report is not on sale yet"],
  ["no kit price", { ...full, STRIPE_KIT_PRICE_ID: undefined }, "kit", "The Claim Kit is not on sale yet"],
  ["nothing set", {}, "report", "The Pro report is not on sale yet"],
] as const) {
  setEnv(vals);
  stripeCalls = [];
  const { status, body } = await read(await call({ product, states: ["CA"] }));
  eq(status, 503, `${label}: 503`);
  eq(body.reason, "not_configured", `${label}: reason is not_configured`);
  eq(body.ok, false, `${label}: ok is false`);
  eq(body.product, product, `${label}: names the product`);
  ok(String(body.message).startsWith(expectMsg), `${label}: message names what is unavailable`);
  ok(String(body.message).includes("hello@mail.wagecoach.com") && !/[—–]/.test(String(body.message)), `${label}: message gives the contact and has no em dash`);
  ok(!JSON.stringify(body).includes("STRIPE_"), `${label}: the browser is not told which variable is missing`);
  eq(stripeCalls.length, 0, `${label}: Stripe is not called`);
}
setEnv({ ...full, STRIPE_PRICE_ID: undefined });
eq((await read(await call({ product: "kit", caseQuery: "?rate=20" }))).status, 200, "the kit still works when only the report price is missing");
eq(checkoutFailureReason(503, false), "http_503", "the button reports an unconfigured checkout as http_503");

// --- report: needs states, carries them through Stripe -------------------------------
setEnv(full);
stripeCalls = [];
eq((await read(await call({ product: "report" }))).status, 400, "report with no states: 400");
eq((await read(await call({ product: "report", states: [] }))).status, 400, "report with an empty list: 400");
eq((await read(await call({ product: "report", states: ["ZZ", "nope"] }))).body.reason, "no_states", "report with only unknown states: no_states");
eq((await read(await call("not json"))).status, 400, "no body defaults to the report, which needs states: 400");
eq(stripeCalls.length, 0, "no Stripe call without states");

const ok1 = await read(await call({ product: "report", states: ["ny", "CA", "ca", "xx"] }));
eq(ok1.status, 200, "report with states: 200");
eq(ok1.body.url, "https://checkout.stripe.com/c/pay/cs_test_abc", "returns the Stripe Checkout URL");
const sent = stripeCalls[0];
eq(sent.url, "https://api.stripe.com/v1/checkout/sessions", "creates a Checkout Session");
eq(sent.auth, "Bearer sk_test_x", "with the secret key");
eq(sent.form.get("mode"), "payment", "one-time payment mode");
eq(sent.form.get("line_items[0][price]"), "price_report", "the report price");
eq(sent.form.get("line_items[0][quantity]"), "1", "quantity one");
eq(sent.form.get("metadata[states]"), "CA,NY", "states ride in session metadata, cleaned and ordered");
eq(sent.form.get("success_url"), "https://example.test/pro-report?session_id={CHECKOUT_SESSION_ID}", "success returns to the verified report page with Stripe's session template");
eq(sent.form.get("cancel_url"), "https://example.test/pricing?status=cancel", "cancel returns to pricing");
ok(!(sent.form.get("success_url") ?? "").includes("status=success"), "the old unhandled /pricing?status=success redirect is gone");
const allStates = await read(await call({ product: "report", states: "AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY" }));
eq(allStates.status, 200, "a comma string of all 51 works");
ok((stripeCalls[1].form.get("metadata[states]") ?? "").length <= 500, "all 51 states fit Stripe's 500 character metadata value limit");

// --- kit: unchanged contract ---------------------------------------------------------
stripeCalls = [];
await call({ product: "kit", caseQuery: "?rate=20&hrs=45" });
const kit = stripeCalls[0].form;
eq(kit.get("line_items[0][price]"), "price_kit", "kit price");
eq(kit.get("success_url"), "https://example.test/claim-kit?session_id={CHECKOUT_SESSION_ID}&rate=20&hrs=45", "kit success URL carries the case");
eq(kit.get("cancel_url"), "https://example.test/wage-claim?status=cancel", "kit cancel URL");
eq(kit.get("metadata[states]"), null, "kit sends no states");

// --- Stripe failures stay 502 --------------------------------------------------------
stripeReply = () => new Response(JSON.stringify({ error: { code: "x", message: "Invalid price" } }), { status: 400 });
eq((await read(await call({ product: "report", states: ["CA"] }))).status, 502, "Stripe rejects the session: 502");
stripeReply = () => { throw new Error("offline"); };
eq((await read(await call({ product: "report", states: ["CA"] }))).status, 502, "Stripe unreachable: 502");

// --- base URL repair (shared with the webhook email) ---------------------------------
eq(publicBaseUrl({}), "https://www.wagecoach.com", "defaults to the canonical host");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "" }), "https://www.wagecoach.com", "empty falls back");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "  " }), "https://www.wagecoach.com", "blank falls back");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "preview.example.test/" }), "https://preview.example.test", "adds the scheme, drops the trailing slash");
eq(publicBaseUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000///" }), "http://localhost:3000", "keeps http for local dev");

Object.assign(console, realConsole);
report("checkout-route");

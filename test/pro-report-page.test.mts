import { renderToStaticMarkup } from "react-dom/server";
import * as pageModule from "../app/pro-report/page.tsx";
import * as sitemapModule from "../app/sitemap.ts";
import { SITE } from "../lib/site.ts";
import { eq, ok, report } from "./_assert.mts";

// tsx loads these as CommonJS, so a default export can arrive one level down.
// Next itself does not do this; it only affects how the test imports them.
const unwrap = <T,>(m: { default: unknown }): T => (typeof m.default === "function" ? m.default : (m.default as { default: unknown }).default) as T;
const Page = unwrap<(p: { searchParams: Promise<Record<string, string | string[] | undefined>> }) => Promise<React.ReactElement>>(pageModule);
const sitemap = unwrap<() => Array<{ url: string }>>(sitemapModule);
const { dynamic, metadata } = pageModule;

// The delivery page, rendered for real with Stripe stubbed. Locked unless Stripe
// says the session is paid, a one-time payment, and holds the report's price.

const realConsole = { log: console.log, warn: console.warn, error: console.error };
for (const m of ["log", "warn", "error"] as const) console[m] = () => {};

const SESSION = "cs_test_a1B2c3D4e5F6g7H8";
const EMAIL = "page-buyer@example.test";
const full = { STRIPE_SECRET_KEY: "sk_test_x", STRIPE_PRICE_ID: "price_report", STRIPE_KIT_PRICE_ID: "price_kit" };
const setEnv = (vals: Record<string, string | undefined>) => { for (const k of Object.keys(full)) { if (vals[k] === undefined) delete process.env[k]; else process.env[k] = vals[k]; } };
const session = (over: Record<string, unknown> = {}) => ({
  id: SESSION, mode: "payment", payment_status: "paid", amount_total: 1900, currency: "usd", metadata: { states: "CA,NY" },
  customer_details: { email: EMAIL }, line_items: { data: [{ price: { id: "price_report" } }] }, ...over,
});

let lookups = 0;
const stripe = (respond: () => Response | Promise<Response>) => { globalThis.fetch = (async () => { lookups++; return respond(); }) as typeof fetch; };
const stripeJson = (s: unknown, status = 200) => stripe(() => new Response(JSON.stringify(s), { status }));
const render = async (sp: Record<string, string | string[] | undefined>) => renderToStaticMarkup(await Page({ searchParams: Promise.resolve(sp) }));

// Words that only appear once the report is unlocked.
const REPORT_MARKERS = ["At a glance", "State by state", "Federal baseline", "$16.90", "Print / Save as PDF"];
const showsReport = (html: string) => REPORT_MARKERS.some((m) => html.includes(m));
// The "Change the states" picker lists every state, so check the report part on its own.
const reportPart = (html: string) => html.split("Change the states")[0];

// --- locked: every way Stripe can say no --------------------------------------------
setEnv(full);
const locked: Array<[string, () => void, Record<string, string | undefined>, string]> = [
  ["no session id", () => stripeJson(session()), {}, "Open your report from your link"],
  ["a made-up session id", () => stripeJson(session()), { session_id: "hello" }, "That link does not look right"],
  ["an unpaid session", () => stripeJson(session({ payment_status: "unpaid" })), { session_id: SESSION }, "Your payment has not cleared yet"],
  ["a paid Claim Kit", () => stripeJson(session({ line_items: { data: [{ price: { id: "price_kit" } }] } })), { session_id: SESSION }, "This link is for a different purchase"],
  ["another product's price", () => stripeJson(session({ line_items: { data: [{ price: { id: "price_other" } }] } })), { session_id: SESSION }, "This link is for a different purchase"],
  ["a subscription-mode session", () => stripeJson(session({ mode: "subscription" })), { session_id: SESSION }, "This link is for a different purchase"],
  ["a session Stripe cannot find", () => stripeJson({}, 404), { session_id: SESSION }, "We cannot find that purchase"],
  ["Stripe unreachable", () => stripe(() => { throw new Error("offline"); }), { session_id: SESSION }, "We could not reach our payment provider"],
  ["Stripe error", () => stripeJson({}, 500), { session_id: SESSION }, "We could not confirm your purchase"],
];
for (const [label, arm, sp, title] of locked) {
  arm();
  const html = await render(sp);
  ok(html.includes(title), `locked for ${label}: says "${title}"`);
  ok(!showsReport(html), `locked for ${label}: shows none of the report`);
  ok(!html.includes(EMAIL) && !html.includes("sk_test"), `locked for ${label}: leaks no email or key`);
  ok(!/[—–]/.test(html.replace(/<[^>]*>/g, " ")), `locked for ${label}: no em or en dash in the words`);
}
// Without a session id nothing should even be asked of Stripe.
lookups = 0;
stripeJson(session());
await render({});
await render({ session_id: "hello" });
eq(lookups, 0, "a missing or malformed session id never reaches Stripe");

// Unconfigured: explicit and specific.
for (const [label, vals] of [["no Stripe key", { ...full, STRIPE_SECRET_KEY: undefined }], ["no report price", { ...full, STRIPE_PRICE_ID: undefined }]] as const) {
  setEnv(vals);
  stripeJson(session());
  const html = await render({ session_id: SESSION });
  ok(html.includes("Report delivery is not switched on yet"), `${label}: says delivery is not switched on`);
  ok(html.includes("write to us") || html.includes("Write to"), `${label}: tells the buyer what to do`);
  ok(!showsReport(html), `${label}: stays locked`);
}
setEnv(full);

// A cheaper claim cannot be turned into a report by adding states to the URL.
stripeJson(session({ line_items: { data: [{ price: { id: "price_kit" } }] } }));
ok(!showsReport(await render({ session_id: SESSION, states: "CA,NY" })), "a kit session with ?states= stays locked");
stripeJson(session({ payment_status: "unpaid" }));
ok(!showsReport(await render({ session_id: SESSION, states: "CA,NY" })), "an unpaid session with ?states= stays locked");

// --- unlocked: paid, one-time, the report price --------------------------------------
stripeJson(session());
let html = await render({ session_id: SESSION });
ok(showsReport(html), "a paid report session shows the report");
ok(html.includes("Your multi-state compliance report"), "headline");
ok(html.includes("You paid for the Pro report. It is on this page. It covers 2 states: CA, NY."), "success copy says what, where and which states, in short sentences");
ok(html.includes("California") && html.includes("New York"), "covers the purchased states");
ok(!reportPart(html).includes("Texas") && !reportPart(html).includes("Alabama"), "does not include states that were not bought");
ok(html.includes("$16.90") && html.includes("$16.00"), "real minimum wages for CA and NY");
ok(html.includes("Immediately, at the time of termination"), "real California final-pay rule");
ok(html.includes("not legal or tax advice") && html.includes("not a law firm"), "disclaimer on the report");
ok(html.includes("https://www.dol.gov/agencies/whd/minimum-wage") && html.includes('rel="noopener noreferrer"'), "cited sources link out safely");
ok(html.includes("Change the states") && html.includes(`name="session_id" value="${SESSION}"`), "the buyer can change states, and the form carries the session");
ok(!html.includes(EMAIL), "the buyer's email is not on the page");

// A states query overrides the session's states, and works with repeated values.
html = await render({ session_id: SESSION, states: "TX" });
ok(reportPart(html).includes("Texas") && !reportPart(html).includes("California"), "?states= rebuilds the report for the chosen states");
ok(html.includes("covers 1 state: TX."), "singular copy for one state");
html = await render({ session_id: SESSION, states: ["TX", "WA"] });
ok(reportPart(html).includes("Texas") && reportPart(html).includes("Washington") && html.includes("covers 2 states: TX, WA."), "repeated ?states= values work");
html = await render({ session_id: SESSION, states: "ZZ" });
ok(reportPart(html).includes("California") && reportPart(html).includes("New York") && html.includes("covers 2 states: CA, NY."), "junk ?states= falls back to the states in the session");

// Sessions from before state selection: verified, so offer the picker instead of a dead end.
stripeJson(session({ metadata: {} }));
html = await render({ session_id: SESSION });
ok(html.includes("Pick your states") && html.includes("Your payment is confirmed"), "a paid session with no states asks for them");
ok(!showsReport(html), "and builds nothing until they are chosen");
eq(html.split('type="checkbox"').length - 1, 51, "the picker lists all 50 states plus DC");
ok(html.includes(`name="session_id" value="${SESSION}"`) && html.includes('method="get"'), "the picker form is a GET that carries the session id");
html = await render({ session_id: SESSION, states: "NV,WA" });
ok(html.includes("Nevada") && html.includes("Washington"), "choosing states from the picker builds the report");
stripeJson(session({ metadata: null }));
ok((await render({ session_id: SESSION })).includes("Pick your states"), "null metadata is handled");

// --- page contract: dynamic, noindex, no referrer, not in the sitemap ---------------
eq(dynamic, "force-dynamic", "never cached");
eq(JSON.stringify(metadata.robots), JSON.stringify({ index: false, follow: false }), "noindex, nofollow");
eq(metadata.referrer, "no-referrer", "the session id in the URL is not sent to source sites");
const urls = sitemap().map((u) => u.url);
ok(urls.includes(`${SITE.url}/pricing`), "the sitemap still lists /pricing");
ok(!urls.some((u) => u.includes("/pro-report")), "the noindex report page is not in the sitemap");
ok(!urls.some((u) => u.includes("/claim-kit")), "and neither is the Claim Kit page, the pattern it follows");
eq(new Set(urls).size, urls.length, "no duplicate sitemap URLs");
ok(urls.every((u) => u.startsWith(SITE.url)), "every sitemap URL is on the canonical host");

Object.assign(console, realConsole);
report("pro-report-page");

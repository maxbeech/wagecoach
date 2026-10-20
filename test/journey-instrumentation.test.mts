import { analyticsEvents, CLIENT_REQUEST_TIMEOUT_MS, requestFailureReason } from "../lib/analytics-events.ts";
import { eq, ok, report } from "./_assert.mts";

// User journeys (OpenHelm "User journeys" table, reviewed 2026-10-19): the event names
// each journey step sends. Any drift between this list and analyticsEvents fails here.
// `first_visit` is GA's automatic event and `lead_delivered` is server-side (Measurement
// Protocol, app/api/lead/route.ts), so neither is in analyticsEvents.
const JOURNEY_EVENTS = [
  "calculator_used", "backpay_calculator_used",
  "begin_checkout", "begin_checkout_failed", "checkout_cancelled",
  "purchase", "purchase_confirmation_failed",
  "case_review_viewed", "generate_lead", "generate_lead_failed",
].sort();
eq(Object.values(analyticsEvents).slice().sort().join(), JOURNEY_EVENTS.join(), "analyticsEvents matches the User journeys event list");

// Browser timeout: the limit is finite and in a sane band (not a hang, not a false failure).
ok(CLIENT_REQUEST_TIMEOUT_MS >= 5_000 && CLIENT_REQUEST_TIMEOUT_MS <= 60_000, `browser request timeout is ${CLIENT_REQUEST_TIMEOUT_MS} ms`);

// A TimeoutError maps to `timeout`; a network error or a non-JSON body is `request_failed`.
eq(requestFailureReason(Object.assign(new Error("aborted"), { name: "TimeoutError" })), "timeout", "a TimeoutError is reason timeout");
eq(requestFailureReason(new TypeError("Failed to fetch")), "request_failed", "a network TypeError is reason request_failed");
eq(requestFailureReason(new SyntaxError("Unexpected token <")), "request_failed", "a non-JSON body is reason request_failed");
eq(requestFailureReason("TimeoutError"), "request_failed", "a bare string is not mistaken for a timeout");
eq(requestFailureReason(undefined), "request_failed", "missing input is reason request_failed");

// A hung request, with the same signal shape the components use, rejects with a
// TimeoutError that maps to `timeout`. This runs the real AbortSignal, not a stand-in.
const hangingFetch = (_url: string, init: RequestInit) =>
  new Promise<Response>((_resolve, reject) => {
    init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
  });
// The timeout timer is unref'd in Node, so a keep-alive keeps the process up while we wait.
const keepAlive = setTimeout(() => {}, 1_000);
try {
  await hangingFetch("https://example.test/api/checkout", { signal: AbortSignal.timeout(10) });
  ok(false, "a hung request must not resolve");
} catch (err) {
  eq(requestFailureReason(err), "timeout", "a hung request that hits its timeout is reason timeout");
} finally {
  clearTimeout(keepAlive);
}

// --- /api/lead: each channel settles on its own ------------------------------------
// The handler is the real POST, with OpenHelm Mail and the partner webhook stubbed at fetch.
const realConsole = { log: console.log, warn: console.warn, error: console.error };
for (const m of ["log", "warn", "error"] as const) console[m] = () => {};

const KEYS = ["OPENHELM_API_KEY", "OPENHELM_MAIL_INBOX_ID", "LEAD_WEBHOOK_URL", "GA_API_SECRET", "NEXT_PUBLIC_GA_MEASUREMENT_ID"] as const;
const setEnv = (vals: Partial<Record<(typeof KEYS)[number], string>>) => {
  for (const k of KEYS) { if (vals[k] === undefined) delete process.env[k]; else process.env[k] = vals[k]; }
};
const HOOK = "https://partner.example.test/hook";

type Mode = { mail: "ok" | "fail"; hook: "ok" | "throw" | "500" };
let mode: Mode = { mail: "ok", hook: "ok" };
let calls: Array<{ url: string; signal: boolean }> = [];
const realFetch = globalThis.fetch;
globalThis.fetch = (async (url: string, init?: RequestInit) => {
  const u = String(url);
  calls.push({ url: u, signal: init?.signal instanceof AbortSignal });
  if (u.includes("/messages")) {
    if (mode.mail === "fail") return new Response(JSON.stringify({ error: "daily cap reached" }), { status: 429 });
    return new Response(JSON.stringify({ message_id: "msg_1", status: "sent" }), { status: 200 });
  }
  if (u === HOOK) {
    if (mode.hook === "throw") throw new TypeError("fetch failed");
    return new Response("", { status: mode.hook === "500" ? 500 : 200 });
  }
  return new Response("{}", { status: 404 });
}) as typeof fetch;

const { POST } = await import("../app/api/lead/route.ts");
const lead = { name: "Test Worker", email: "worker@example.test", phone: "", state: "CA", claimType: "Overtime", amount: 1200, summary: "" };
const submit = () => POST(new Request("https://example.test/api/lead", { method: "POST", body: JSON.stringify(lead) }));
const read = async (r: Response) => ({ status: r.status, body: (await r.json()) as Record<string, unknown> });

const cases: Array<[string, Partial<Record<(typeof KEYS)[number], string>>, Mode, number, boolean]> = [
  ["email sent, webhook throws: the lead is still delivered", { OPENHELM_API_KEY: "k", OPENHELM_MAIL_INBOX_ID: "i", LEAD_WEBHOOK_URL: HOOK }, { mail: "ok", hook: "throw" }, 200, true],
  ["email not configured, webhook ok: delivered", { LEAD_WEBHOOK_URL: HOOK }, { mail: "ok", hook: "ok" }, 200, true],
  ["email not configured, webhook throws: 502 with a fallback", { LEAD_WEBHOOK_URL: HOOK }, { mail: "ok", hook: "throw" }, 502, false],
  ["email sent, webhook 500: delivered by the other channel", { OPENHELM_API_KEY: "k", OPENHELM_MAIL_INBOX_ID: "i", LEAD_WEBHOOK_URL: HOOK }, { mail: "ok", hook: "500" }, 200, true],
  ["email fails, webhook 500: 502 with a fallback", { OPENHELM_API_KEY: "k", OPENHELM_MAIL_INBOX_ID: "i", LEAD_WEBHOOK_URL: HOOK }, { mail: "fail", hook: "500" }, 502, false],
];
for (const [label, env, m, expectStatus, expectOk] of cases) {
  setEnv(env);
  mode = m;
  calls = [];
  const { status, body } = await read(await submit());
  eq(status, expectStatus, `${label}: status`);
  eq(body.ok === true, expectOk, `${label}: ok`);
  if (!expectOk) ok(String(body.message).includes("hello@mail.wagecoach.com"), `${label}: fallback names the contact`);
  if (env.LEAD_WEBHOOK_URL) ok(calls.some((c) => c.url === HOOK && c.signal), `${label}: webhook call carries a timeout signal`);
}
setEnv({});
globalThis.fetch = realFetch;
console.log = realConsole.log; console.warn = realConsole.warn; console.error = realConsole.error;

report("journey-instrumentation");

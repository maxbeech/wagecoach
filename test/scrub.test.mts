/* eslint-disable @typescript-eslint/no-explicit-any -- tests poke at loosely typed Sentry payloads */
import { scrubText, scrubValue, scrubEvent, scrubLog, scrubBreadcrumb, scrubTransaction, stripQuery, failClosed, MAX_TEXT } from "../lib/scrub.ts";
import { safeContext } from "../lib/observability.ts";
import { ok, eq, report } from "./_assert.mts";

const SAMPLES = [
  "jane.doe+claims@example.co.uk",
  "+1 (415) 555-0134",
  "415-555-0134",
  "Bearer abcdef1234567890abcdef",
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dBjftJeZ4CVPmB92K27uhbUJU1p1rwW",
  "sk_live_51HabcdEFGHijkl123456",
  "pk_test_abcdefghijklmnop",
  "whsec_abcdefghijklmnopqrstuv",
  "hlm_sk_abcdefghijklmnopqrstuv",
  "sntrys_abcdefghijklmnopqrstuv",
  "cs_live_a1B2c3D4e5F6g7H8",
  "postgres://admin:hunter2pass@db.internal:5432/app",
  "password=correcthorsebattery",
  '{"api_key":"abc123xyz789"}',
  "STRIPE_SECRET_KEY=whatever1234",
];
for (const s of SAMPLES) {
  const out = scrubText(`context ${s} trailing`);
  ok(out.includes("[redacted"), `redacts: ${s} → ${out}`);
  ok(!out.includes(s), `raw secret gone: ${s}`);
}
ok(scrubText("Overtime owed for 12 hours in Ohio").includes("Overtime owed for 12 hours in Ohio"), "leaves ordinary text alone");

// Objects: sensitive keys by name, strings by content.
const v = scrubValue({ email: "a@b.com", authorization: "x", nested: { password: "p", note: "mail me at a@b.com" }, count: 3 }) as Record<string, any>;
eq(v.email, "[redacted]", "email key");
eq(v.authorization, "[redacted]", "authorization key");
eq(v.nested.password, "[redacted]", "nested password");
ok(!String(v.nested.note).includes("a@b.com"), "email inside a free-text value");
eq(v.count, 3, "numbers survive");

// Query strings.
eq(stripQuery("https://x.test/claim-kit?session_id=cs_live_abc#frag"), "https://x.test/claim-kit", "strips ?query and #fragment");

// Events, breadcrumbs, transactions, logs.
const ev: any = scrubEvent({
  type: undefined,
  request: { url: "https://x.test/p?email=a@b.com", headers: { Authorization: "Bearer abcdefgh12345678" }, cookies: { a: "b" }, data: { summary: "hi" } },
  exception: { values: [{ type: "Error", value: "failed for jane@example.com", stacktrace: { frames: [{ vars: { a: 1 } } as any] } }] },
  user: { id: "u1", email: "a@b.com", ip_address: "1.2.3.4" },
  breadcrumbs: [{ message: "GET /x?token=abc", data: { url: "/y?z=1", to: "/a?b=2", from: "/c?d=3" } }],
} as any);
eq(ev.request.url, "https://x.test/p", "event url stripped");
eq(ev.request.headers.Authorization, "[redacted]", "event header");
ok(ev.request.cookies === undefined, "cookies dropped");
ok(!ev.exception.values[0].value.includes("jane@example.com"), "exception message scrubbed");
ok(ev.exception.values[0].stacktrace.frames[0].vars === undefined, "frame vars dropped");
eq(JSON.stringify(ev.user), '{"id":"u1"}', "user reduced to id");
eq(ev.breadcrumbs[0].data.url, "/y", "breadcrumb url");
eq(ev.breadcrumbs[0].data.to, "/a", "breadcrumb to");
eq(ev.breadcrumbs[0].data.from, "/c", "breadcrumb from");
ok(!ev.breadcrumbs[0].message.includes("token"), "breadcrumb message query stripped");

const fbOut: any = scrubEvent({
  type: "feedback",
  contexts: { feedback: { name: "Jane", contact_email: "jane@example.com", message: "hi" }, other: { email: "z@z.co" } },
  user: { email: "jane@example.com" },
  breadcrumbs: [{ message: "see q@q.co?x=1" }],
  request: { url: "https://x.test/p?token=1" },
  tags: { token: "t" },
  extra: { password: "p" },
} as any);
eq(fbOut.contexts.feedback.contact_email, "jane@example.com", "feedback keeps reporter email");
eq(fbOut.contexts.feedback.name, "Jane", "feedback keeps reporter name");
eq(fbOut.user.email, "jane@example.com", "feedback keeps reporter user");
eq(fbOut.contexts.other.email, "[redacted]", "feedback other contexts scrubbed");
ok(!JSON.stringify(fbOut.breadcrumbs).includes("q@q.co"), "feedback breadcrumbs scrubbed");
eq(fbOut.request.url, "https://x.test/p", "feedback request url stripped");
eq(fbOut.tags.token, "[redacted]", "feedback tags scrubbed");
eq(fbOut.extra.password, "[redacted]", "feedback extra scrubbed");

const crumb: any = scrubBreadcrumb({ message: "mail a@b.com", data: { url: "https://x.test/a?b=1" } });
eq(crumb.data.url, "https://x.test/a", "breadcrumb fn strips url query");
ok(!crumb.message.includes("a@b.com"), "breadcrumb fn scrubs message");

const tx: any = scrubTransaction({
  type: "transaction",
  request: { url: "https://x.test/a?secret=1" },
  spans: [{ description: "GET https://x.test/api?token=abc", data: { "http.url": "https://x.test/api?token=abc", "url.query": "token=abc", "http.query": "?token=abc" } }],
} as any);
eq(tx.request.url, "https://x.test/a", "transaction url");
eq(tx.spans[0].data["http.url"], "https://x.test/api", "span http.url");
ok(!("url.query" in tx.spans[0].data) && !("http.query" in tx.spans[0].data), "span query data dropped");
ok(!tx.spans[0].description.includes("token"), "span description query stripped");

const lg: any = scrubLog({ level: "info", message: "user a@b.com sk_live_abcdefghijkl", attributes: { token: "t", orderId: "o1" } } as any);
ok(!lg.message.includes("a@b.com") && !lg.message.includes("sk_live"), "log message");
eq(lg.attributes.token, "[redacted]", "log attribute secret");
eq(lg.attributes.orderId, "o1", "log attribute id survives");

// Fail closed: a throwing scrubber drops the item.
const origError = console.error; console.error = () => {};
const boom = failClosed("x", () => { throw new Error("boom"); });
eq(boom({}), null, "throwing scrubber returns null");
const hostile: any = { type: undefined, get request() { throw new Error("hostile getter"); } };
eq(scrubEvent(hostile), null, "event with a throwing property is dropped, not sent raw");
eq(scrubTransaction({ type: "transaction", get request() { throw new Error("x"); } } as any), null, "throwing transaction dropped");
eq(scrubLog({ level: "info", get message() { throw new Error("x"); } } as any), null, "throwing log dropped");
eq(scrubBreadcrumb({ get message() { throw new Error("x"); } } as any), null, "throwing breadcrumb dropped");
console.error = origError;

// Linear time: adversarial strings must finish quickly and be truncated.
const attacks = [
  "a".repeat(200_000),
  "a@".repeat(100_000),
  "eyJ" + "A".repeat(100_000),
  "eyJ".repeat(50_000),
  "1".repeat(100_000),
  "1 ".repeat(100_000),
  "password".repeat(30_000),
  "Bearer " + " ".repeat(100_000),
  "x".repeat(40) + "@" + "a.".repeat(100_000),
  "sk_" + "_".repeat(100_000),
  "a://" + "b:".repeat(100_000),
];
for (const atk of attacks) {
  const t0 = performance.now();
  const out = scrubText(atk);
  const ms = performance.now() - t0;
  ok(ms < 250, `adversarial string (${atk.slice(0, 12)}…, ${atk.length} chars) scrubbed in ${ms.toFixed(0)}ms`);
  ok(out.length <= MAX_TEXT + 200, "output is truncated");
}

// Capture context: ids only.
const ctx = safeContext({ scope: "lead", status: 502, ok: false, email: "a@b.com", note: "free text with spaces", product: "kit", body: { a: 1 }, id: "cs_123" });
eq(JSON.stringify(ctx), JSON.stringify({ scope: "lead", status: 502, ok: false, product: "kit", id: "cs_123" }), "context keeps ids/codes/counts only");

report("scrub");

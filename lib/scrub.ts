import type { Breadcrumb, ErrorEvent, Log } from "@sentry/nextjs";

type TransactionEvent = Parameters<NonNullable<NonNullable<Parameters<typeof import("@sentry/nextjs").init>[0]>["beforeSendTransaction"]>>[0];
type Span = NonNullable<TransactionEvent["spans"]>[number];

/**
 * The one scrubber for everything that leaves this process for Sentry: error
 * events, logs, breadcrumbs and transactions/spans.
 *
 * Rules (see Products/_plans/SENTRY_STANDARD.md):
 *  - FAIL CLOSED. If scrubbing throws, the event/log/breadcrumb is dropped,
 *    never sent raw.
 *  - LINEAR TIME. Every pattern uses bounded repetition and no nested or
 *    overlapping quantifiers, and text is truncated to MAX_TEXT before any
 *    matching, so hostile log text cannot trigger catastrophic backtracking.
 *  - Feedback events are the one exception: they keep the name and email the
 *    person typed in, because that is the point of them.
 */

export const REDACTED = "[redacted]";
/** Longer strings are cut before matching, so work per string is bounded. */
export const MAX_TEXT = 10_000;
const MAX_NODES = 5_000;
const MAX_DEPTH = 8;

// Keys whose values never leave the process, matched as case-insensitive substrings.
const SECRET_KEYS = [
  "key", "token", "secret", "password", "passwd", "authorization", "cookie", "session",
  "signature", "credential", "dsn", "bearer",
];
// Customer and visitor content: contact details and anything free-text typed in.
const PII_KEYS = ["email", "phone", "address", "summary", "firstname", "lastname", "fullname", "first_name", "last_name", "full_name"];
const PII_EXACT_KEYS = new Set(["name", "username", "message", "body", "data", "claimtype", "amount"]);

function isSensitiveKey(key: string): boolean {
  const k = key.toLowerCase();
  return PII_EXACT_KEYS.has(k) || SECRET_KEYS.some((s) => k.includes(s)) || PII_KEYS.some((s) => k.includes(s));
}

// Every quantifier below is bounded, and no two adjacent quantifiers can match
// the same characters in a way that multiplies the work.
const PATTERNS: Array<[RegExp, string]> = [
  // user:pass@ inside a connection string or URL
  [/[a-z][a-z0-9+.-]{1,20}:\/\/[^\s/@:]{1,100}:[^\s/@]{1,100}@/gi, "[redacted-url-credentials]"],
  // JWTs
  [/eyJ[A-Za-z0-9_-]{5,2000}\.[A-Za-z0-9_-]{5,2000}\.[A-Za-z0-9_-]{0,2000}/g, "[redacted-jwt]"],
  // Authorization header values
  [/\b(?:Bearer|Basic)\s{1,5}[A-Za-z0-9._~+/=-]{8,512}/gi, "[redacted-auth]"],
  // Provider keys: Stripe, Helm7, Sentry, GitHub, Slack, Anthropic/OpenAI style, Stripe checkout session ids
  [/\b(?:sk|pk|rk|whsec|hlm_sk|sntrys|sntryu|ghp|gho|ghs|xox[abps]|cs)_[A-Za-z0-9_-]{8,200}/g, "[redacted-key]"],
  [/\bsk-[A-Za-z0-9_-]{16,200}/g, "[redacted-key]"],
  [/\bAKIA[0-9A-Z]{16}\b/g, "[redacted-key]"],
  // name=value / "name":"value" where the name looks sensitive
  [
    /[A-Za-z0-9_-]{0,30}(?:password|passwd|secret|token|authorization|api[_-]?key|cookie|session|signature)[A-Za-z0-9_-]{0,30}["']?\s{0,3}[:=]\s{0,3}["']?[^\s"',&;]{1,200}/gi,
    "[redacted-field]",
  ],
  // Email addresses
  [/[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,255}\.[A-Za-z]{2,24}/g, "[redacted-email]"],
  // Phone numbers: 10 to 20 digits with the usual separators
  [/(?<![\w.])\+?\d[\d ().-]{8,18}\d(?![\w])/g, "[redacted-phone]"],
];

/** Redact secrets and personal data from free text. Truncates first. */
export function scrubText(text: string): string {
  let out = text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}…[truncated]` : text;
  for (const [re, replacement] of PATTERNS) out = out.replace(re, replacement);
  return out;
}

/** Drop the query string and fragment from a URL or path. Linear: one indexOf pass. */
export function stripQuery(url: string): string {
  const q = url.indexOf("?");
  const h = url.indexOf("#");
  const cut = q === -1 ? h : h === -1 ? q : Math.min(q, h);
  return cut === -1 ? url : url.slice(0, cut);
}

/** Free text that may embed URLs (span descriptions, messages): remove `?query` runs. */
function stripQueriesInText(text: string): string {
  return text.replace(/\?[^\s]{0,2000}/g, "");
}

/** Recursively redact: sensitive keys by name, every string by content. */
export function scrubValue(value: unknown, budget = { n: MAX_NODES }, depth = 0): unknown {
  if (value == null) return value;
  if (typeof value === "string") return scrubText(value);
  if (typeof value !== "object") return typeof value === "function" ? undefined : value;
  if (depth > MAX_DEPTH || budget.n-- <= 0) return "[truncated]";
  if (Array.isArray(value)) return value.map((v) => scrubValue(v, budget, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = isSensitiveKey(k) ? REDACTED : scrubValue(v, budget, depth + 1);
  }
  return out;
}

const URL_KEYS = new Set(["url", "to", "from", "http.url", "url.full", "http.target", "request.url"]);
const DROPPED_DATA_KEYS = new Set(["url.query", "http.query", "http.fragment", "url.fragment", "query", "query_string"]);

/** scrubValue plus URL handling for breadcrumb and span data. */
function scrubUrlData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (DROPPED_DATA_KEYS.has(k)) continue;
    cleaned[k] = URL_KEYS.has(k) && typeof v === "string" ? stripQuery(v) : v;
  }
  return scrubValue(cleaned) as Record<string, unknown>;
}

function isFeedback(event: { type?: string; contexts?: unknown }): boolean {
  return event.type === "feedback" || Boolean((event.contexts as { feedback?: unknown } | undefined)?.feedback);
}

function scrubRequest(request: NonNullable<ErrorEvent["request"]>): void {
  if (request.url) request.url = scrubText(stripQuery(request.url));
  delete request.cookies;
  request.query_string = undefined;
  if (request.headers) request.headers = scrubValue(request.headers) as Record<string, string>;
  if (request.data) request.data = scrubValue(request.data);
}

function scrubBaseEvent(event: ErrorEvent | TransactionEvent): void {
  if (event.request) scrubRequest(event.request);
  if (event.extra) event.extra = scrubValue(event.extra) as Record<string, unknown>;
  if (event.contexts) {
    // Feedback is the one place the reporter's own name/email/message are kept.
    const fb = isFeedback(event) ? event.contexts.feedback : undefined;
    event.contexts = scrubValue(event.contexts) as typeof event.contexts;
    if (fb) event.contexts.feedback = fb;
  }
  if (event.tags) event.tags = scrubValue(event.tags) as typeof event.tags;
  // The reporter's own user fields are kept on feedback; otherwise ids only.
  if (event.user && !isFeedback(event)) event.user = { id: event.user.id };
  if (typeof event.message === "string") event.message = scrubText(event.message);
  if (event.logentry?.message) event.logentry.message = scrubText(event.logentry.message);
  if (event.transaction) event.transaction = scrubText(stripQuery(event.transaction));
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((b: Breadcrumb) => scrubCrumb(b));
  }
}

function scrubCrumb(b: Breadcrumb): Breadcrumb {
  return {
    ...b,
    message: typeof b.message === "string" ? scrubText(stripQueriesInText(b.message)) : b.message,
    data: b.data ? scrubUrlData(b.data) : b.data,
  };
}

function scrubEventUnsafe(event: ErrorEvent): ErrorEvent | null {
  // Feedback events are NOT exempt: only contexts.feedback / user survive as-is.
  scrubBaseEvent(event);
  for (const ex of event.exception?.values ?? []) {
    if (typeof ex.value === "string") ex.value = scrubText(ex.value);
    for (const frame of ex.stacktrace?.frames ?? []) delete frame.vars;
  }
  return event;
}

function scrubTransactionUnsafe(event: TransactionEvent): TransactionEvent | null {
  scrubBaseEvent(event);
  if (event.spans) {
    event.spans = event.spans.map((span: Span) => ({
      ...span,
      description: typeof span.description === "string" ? scrubText(stripQueriesInText(span.description)) : span.description,
      data: span.data ? (scrubUrlData(span.data) as typeof span.data) : span.data,
    }));
  }
  return event;
}

function scrubLogUnsafe(log: Log): Log | null {
  return {
    ...log,
    message: typeof log.message === "string" ? scrubText(log.message) : log.message,
    attributes: log.attributes ? (scrubValue(log.attributes) as Log["attributes"]) : log.attributes,
  };
}

function scrubBreadcrumbUnsafe(b: Breadcrumb): Breadcrumb | null {
  return scrubCrumb(b);
}

/** Wrap a scrubber so any throw drops the item instead of leaking it. */
export function failClosed<A extends unknown[], T, R>(label: string, fn: (item: T, ...rest: A) => R | null) {
  return (item: T, ...rest: A): R | null => {
    try {
      return fn(item, ...rest);
    } catch (err) {
      // Never log the item itself; it is exactly what we could not clean.
      console.error(`[sentry] scrubbing ${label} failed, dropped:`, err instanceof Error ? err.name : "unknown");
      return null;
    }
  };
}

export const scrubEvent = failClosed("event", scrubEventUnsafe);
export const scrubTransaction = failClosed("transaction", scrubTransactionUnsafe);
export const scrubLog = failClosed("log", scrubLogUnsafe);
export const scrubBreadcrumb = failClosed("breadcrumb", scrubBreadcrumbUnsafe);

// Exposed for tests: the unwrapped versions, so a test can force a throw.
export const __unsafe = { scrubEventUnsafe, scrubLogUnsafe };

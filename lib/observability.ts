import * as Sentry from "@sentry/nextjs";

/**
 * The one way server code reports a problem.
 *
 * Everything funnels through here so scope and tag conventions stay consistent
 * across routes and webhooks, and so a deployment with no DSN degrades to a
 * console line rather than throwing inside an error handler.
 *
 * CONTEXT IS IDS ONLY. Callers may pass ids, codes, counts, booleans and short
 * enum-like strings. Anything else (names, emails, free text, request or
 * response bodies) is dropped here, whatever the caller meant, so a careless
 * call site cannot ship a customer's words to a third party.
 */

const SAFE_STRING = /^[A-Za-z0-9_.:-]{1,64}$/;

export function safeContext(context: Record<string, unknown>): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(context)) {
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "boolean") out[k] = v;
    else if (typeof v === "string" && SAFE_STRING.test(v)) out[k] = v;
  }
  return out;
}

function hasDsn(): boolean {
  return Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
}

export function captureServerError(err: unknown, context: Record<string, unknown> = {}): void {
  const safe = safeContext(context);
  const scope = typeof safe.scope === "string" ? safe.scope : "server";
  try {
    if (hasDsn()) {
      Sentry.withScope((s) => {
        s.setTag("scope", scope);
        for (const [k, v] of Object.entries(safe)) if (k !== "scope") s.setExtra(k, v);
        s.captureException(err instanceof Error ? err : new Error(String(err)));
      });
      return;
    }
  } catch {
    // Never let reporting an error become an error.
  }
  console.error(`[${scope}]`, err instanceof Error ? err.name : "error", safe);
}

/** A handled failure that is not an exception, such as a rejected upstream response. */
export function captureServerMessage(message: string, context: Record<string, unknown> = {}): void {
  const safe = safeContext(context);
  const scope = typeof safe.scope === "string" ? safe.scope : "server";
  try {
    if (hasDsn()) {
      Sentry.withScope((s) => {
        s.setTag("scope", scope);
        s.setLevel("warning");
        for (const [k, v] of Object.entries(safe)) if (k !== "scope") s.setExtra(k, v);
        s.captureMessage(message);
      });
      return;
    }
  } catch {
    /* see above */
  }
  console.warn(`[${scope}]`, message, safe);
}

/** Browser-side equivalent for caught client failures: report, do not swallow. */
export function captureClientError(err: unknown, context: Record<string, unknown> = {}): void {
  const safe = safeContext(context);
  try {
    Sentry.withScope((s) => {
      s.setTag("scope", typeof safe.scope === "string" ? safe.scope : "client");
      for (const [k, v] of Object.entries(safe)) if (k !== "scope") s.setExtra(k, v);
      s.captureException(err instanceof Error ? err : new Error(String(err)));
    });
  } catch {
    console.error("[client]", err instanceof Error ? err.name : "error");
  }
}

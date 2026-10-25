type SentryEvent = {
  request?: { method?: string; headers?: Record<string, unknown> | Array<[string, unknown]> };
  exception?: {
    values?: Array<{
      type?: string;
      value?: string;
      stacktrace?: {
        frames?: Array<{
          filename?: string;
          lineno?: number;
          colno?: number;
        }>;
      };
    }>;
  };
};

// Render bots can execute their own malformed `script.js` while crawling a page.
// This signature has no application frame, so retaining it would only obscure
// actionable visitor errors in Sentry.
//
// The column number is NOT part of the signature: different bots/browsers
// report colno 1 or 2 (sometimes others) for the same synthetic parse of an
// effectively empty/foreign script, and the filename hash changes per crawl.
// WAGECOACH_WEB-1 regressed after the original fix (colno === 2 only) because
// the same bot traffic started reporting colno 1, which slipped straight
// through. What actually identifies this as synthetic is: a SyntaxError with
// this exact message, at line 1, in a file whose path is just a hash plus
// `script.js` — i.e. it never appears in our own bundle. Matching on lineno
// alone (not colno) is the fix.
export function isSyntheticScriptParseError(event: SentryEvent): boolean {
  return event.exception?.values?.some((exception) =>
    exception.type === "SyntaxError"
    && exception.value === "Invalid or unexpected token"
    && exception.stacktrace?.frames?.some((frame) =>
      /\/script\.js$/.test(frame.filename ?? "")
      && frame.lineno === 1,
    ),
  ) ?? false;
}

// Real Server Action ids are long hex strings Next generates at build time.
const REAL_ACTION_ID = /^[0-9a-f]{40,64}$/i;

function requestHeader(event: SentryEvent, name: string): string | undefined {
  const headers = event.request?.headers;
  if (!headers) return undefined;
  const entries: Array<[string, unknown]> = Array.isArray(headers) ? headers : Object.entries(headers);
  const hit = entries.find(([key]) => key.toLowerCase() === name);
  return hit === undefined ? undefined : String(hit[1]);
}

// Security-scanner probes (ClaudeBot, Googlebot look-alikes) POST to a real
// page with `Accept: text/x-component`, a made-up `Next-Action` such as
// "cachefn" and the CVE-2025-29927 `X-Middleware-Subrequest` header. Next
// already refuses them, but it throws "Expected RSC response" on the way, which
// would be reported as an app bug (WAGECOACH_WEB-9).
//
// Deliberately narrow so it cannot hide a genuine exception: the event is
// dropped only when ALL hold: it is a POST, the request carries a probe header
// (build-generated action ids are hex; the subrequest header is internal to
// Next), and the exception is one of the two known refusal messages. Any other
// exception on a probe request is still reported.
const PROBE_NOISE = /^(Invariant: Expected RSC response|Failed to find Server Action)/;

export function isScannerProbe(event: SentryEvent): boolean {
  if (event.request?.method?.toUpperCase() !== "POST") return false;
  const action = requestHeader(event, "next-action");
  const probeHeader = requestHeader(event, "x-middleware-subrequest") !== undefined
    || (action !== undefined && !REAL_ACTION_ID.test(action));
  if (!probeHeader) return false;
  return event.exception?.values?.some((e) => PROBE_NOISE.test(e.value ?? "")) ?? false;
}

type SentryEvent = {
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

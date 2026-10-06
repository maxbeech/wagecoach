import * as Sentry from "@sentry/nextjs";
import { isSyntheticScriptParseError } from "@/lib/sentry-client-filter";
import { failClosed, scrubBreadcrumb, scrubEvent, scrubLog, scrubTransaction } from "@/lib/scrub";

/**
 * The one place the options shared by every Sentry.init live (browser in
 * instrumentation-client.ts, server and edge in instrumentation.ts), so the
 * scrubbing, sampling and log forwarding cannot drift between runtimes.
 */

// Drop crawler noise first, then scrub. Both steps fail closed.
const beforeSend = failClosed("event", (event: Sentry.ErrorEvent) =>
  isSyntheticScriptParseError(event) ? null : scrubEvent(event),
);

export function sharedSentryOptions() {
  return {
    environment: process.env.NODE_ENV,
    // Errors are the point; traces are sampled lightly to stay inside quota.
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    beforeSend,
    beforeSendTransaction: scrubTransaction,
    beforeBreadcrumb: scrubBreadcrumb,
    // Structured logs, plus every console call forwarded as a log line.
    enableLogs: true,
    beforeSendLog: scrubLog,
    integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "info", "warn", "error"] })],
  };
}

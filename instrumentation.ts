import * as Sentry from "@sentry/nextjs";
import { sharedSentryOptions } from "@/lib/sentry-options";

/**
 * Server and edge error reporting. Next calls `register()` once per runtime.
 * Without a DSN the site runs normally but says so in the console.
 */
export async function register() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn("[sentry] SENTRY_DSN is not set: server errors are not being reported.");
    return;
  }
  Sentry.init({ dsn, ...sharedSentryOptions() });
}

// Reports errors thrown while rendering a server component or route handler.
export const onRequestError = Sentry.captureRequestError;

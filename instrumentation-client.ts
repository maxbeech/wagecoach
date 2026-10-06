import * as Sentry from "@sentry/nextjs";
import { sharedSentryOptions } from "@/lib/sentry-options";

/**
 * Browser error reporting, loaded by Next at boot.
 *
 * The feedback integration backs our own "Send feedback" control (header and
 * footer), so a note from a visitor lands in the same Sentry project as the
 * exceptions from the code.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  const shared = sharedSentryOptions();
  Sentry.init({
    dsn,
    ...shared,
    // Requests go through our own tunnel route (next.config.ts). It is required,
    // not cosmetic: when a feedback report includes a screenshot the browser
    // sends the envelope as a raw ArrayBuffer with NO Content-Type, the tunnel
    // then receives an empty body and the submit silently fails.
    // See getsentry/sentry-javascript#16112.
    transportOptions: {
      headers: { "content-type": "application/x-sentry-envelope" },
    },
    integrations: [
      ...shared.integrations,
      Sentry.feedbackIntegration({
        colorScheme: "system",
        // Opened by our own control; no floating Sentry button over the page.
        autoInject: false,
        showBranding: false,
        formTitle: "Send feedback",
        submitButtonLabel: "Send",
        messagePlaceholder: "What happened, or what would make this better?",
        successMessageText: "Thanks, that's with us now.",
      }),
    ],
  });
} else if (process.env.NODE_ENV !== "test") {
  console.warn("[sentry] NEXT_PUBLIC_SENTRY_DSN is not set: errors and feedback are not being reported.");
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

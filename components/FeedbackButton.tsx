"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Opens Sentry's feedback form, so a note from a visitor lands in the same
 * Sentry project as the exceptions from the code. The SDK is imported lazily so
 * a footer link does not drag it into every page's first load.
 */
export default function FeedbackButton({
  variant = "header",
  className = "",
  onOpen,
}: {
  variant?: "header" | "link" | "menu";
  className?: string;
  onOpen?: () => void;
}) {
  const [unavailable, setUnavailable] = useState(false);

  async function open() {
    onOpen?.();
    try {
      const Sentry = await import("@sentry/nextjs");
      const feedback = Sentry.getFeedback();
      if (!feedback) {
        setUnavailable(true);
        return;
      }
      const form = await feedback.createForm();
      form.appendToDom();
      form.open();
    } catch (err) {
      console.error("[feedback] could not open the form:", err instanceof Error ? err.name : "unknown");
      setUnavailable(true);
    }
  }

  if (unavailable) {
    return (
      <span className={`text-xs text-muted ${className}`}>
        Feedback is not available right now. Email{" "}
        <a className="underline underline-offset-2" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </span>
    );
  }

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={open}
        data-testid="feedback-button"
        className={`hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink transition hover:border-brand-600 hover:text-brand-700 sm:inline-flex ${className}`}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" />
        </svg>
        Feedback
      </button>
    );
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={open}
        data-testid="feedback-button-menu"
        className={`border-b border-line/60 py-2.5 text-left text-sm text-muted ${className}`}
      >
        Send feedback
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      data-testid="feedback-button-footer"
      className={`text-muted transition-colors hover:text-brand-700 ${className}`}
    >
      Send feedback
    </button>
  );
}

"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

// Segment boundary: keeps the header and footer on screen and makes the
// failure a Sentry Issue instead of a blank page nobody hears about.
export default function SegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-3 text-muted">We have been told about it. Please try again.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white">
          Try again
        </button>
        <Link href="/" className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink">
          Home
        </Link>
      </div>
    </div>
  );
}

"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// The last-resort boundary: a render error that escaped every page boundary.
// Report it before showing the fallback, otherwise the crashes that matter
// most are the only ones we never hear about.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f6f3ec", color: "#1a2a22", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ maxWidth: 440 }}>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
            <p style={{ color: "#5b6b62", marginBottom: "1.5rem" }}>
              We have been told about it. Please try again.
            </p>
            {error.digest && (
              <p style={{ fontSize: "0.75rem", color: "#8a978f", fontFamily: "monospace" }}>Reference: {error.digest}</p>
            )}
            <button
              onClick={reset}
              style={{ padding: "0.6rem 1.4rem", background: "#1f4d3a", color: "#fff", border: 0, borderRadius: 999, fontWeight: 600, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

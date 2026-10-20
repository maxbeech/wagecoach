"use client";

import { useState } from "react";
import { CLIENT_REQUEST_TIMEOUT_MS, analyticsEvents, beginCheckoutParams, checkoutFailureReason, requestFailureReason } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/analytics-track";
import { captureClientError } from "@/lib/observability";

// Starts a Stripe Checkout session via /api/checkout. If Stripe isn't configured
// the route answers 503 with a plain message naming the product, and that message
// is shown here instead of a broken redirect. `product` selects what to buy: the
// $29 Claim Kit, or the Wage Watch subscription (which needs the subscriber's
// manage-link `token`, since that is who is upgrading).
export default function CheckoutButton({
  className,
  product = "kit",
  label,
  token,
}: {
  className?: string;
  product?: "kit" | "watch";
  label?: string;
  token?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true); setError(null);
    trackEvent(analyticsEvents.beginCheckout, beginCheckoutParams(product));
    try {
      // For the kit, carry the back-pay case (it lives in the page URL) so the
      // post-purchase page can render the demand letter pre-filled.
      const caseQuery = product === "kit" && typeof window !== "undefined" ? window.location.search : "";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, caseQuery, token }),
        signal: AbortSignal.timeout(CLIENT_REQUEST_TIMEOUT_MS),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      const reason = checkoutFailureReason(res.status, false);
      trackEvent(analyticsEvents.beginCheckoutFailed, { product, reason: reason ?? "unavailable" });
      setError(data.message ?? "Checkout is not available yet. Please check back soon.");
    } catch (err) {
      // A hung request is reported as `timeout`, so it reads differently from a network error.
      const reason = requestFailureReason(err);
      captureClientError(err, { scope: "checkout_start", product, reason });
      trackEvent(analyticsEvents.beginCheckoutFailed, { product, reason });
      setError(reason === "timeout"
        ? "Checkout is taking too long to start. Please try again."
        : "Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fallbackLabel = product === "kit" ? "Build my Claim Kit, $29" : "Upgrade to Wage Watch";
  return (
    <div>
      <button onClick={go} disabled={loading}
        className={className ?? "rounded-full bg-forest px-6 py-3 font-semibold text-white shadow-card transition hover:bg-brand-800 disabled:opacity-60"}>
        {loading ? "Starting…" : (label ?? fallbackLabel)}
      </button>
      {error && <p className="mt-2 text-sm text-amber-800">{error}</p>}
    </div>
  );
}

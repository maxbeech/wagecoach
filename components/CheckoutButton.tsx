"use client";

import { useState } from "react";

// Starts a Stripe Checkout session via /api/checkout. The route degrades
// gracefully: if Stripe isn't configured (no env keys) it returns a clear
// "not yet available" message instead of a broken redirect. `product` selects
// which item to buy — the multi-state "report" ($19) or the wage "kit" ($29).
export default function CheckoutButton({
  className,
  product = "report",
  label,
}: {
  className?: string;
  product?: "report" | "kit";
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true); setError(null);
    try {
      // For the kit, carry the back-pay case (it lives in the page URL) so the
      // post-purchase page can render the demand letter pre-filled.
      const caseQuery = product === "kit" && typeof window !== "undefined" ? window.location.search : "";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, caseQuery }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      setError(data.message ?? "Checkout is not available yet. Please check back soon.");
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fallbackLabel = product === "kit" ? "Build my Claim Kit, $29" : "Get the Pro report, $19";
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

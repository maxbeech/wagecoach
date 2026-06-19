"use client";

import { useState } from "react";

// Starts a Stripe Checkout session via /api/checkout. The route degrades
// gracefully: if Stripe isn't configured (no env keys) it returns a clear
// "not yet available" message instead of a broken redirect.
export default function CheckoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      setError(data.message ?? "Checkout is not available yet. Please check back soon.");
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={go} disabled={loading}
        className={className ?? "rounded-full bg-forest px-6 py-3 font-semibold text-white shadow-card transition hover:bg-brand-800 disabled:opacity-60"}>
        {loading ? "Starting…" : "Get the Pro report, $19"}
      </button>
      {error && <p className="mt-2 text-sm text-amber-800">{error}</p>}
    </div>
  );
}

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
      setError(data.message ?? "Checkout isn't available yet — check back soon.");
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={go} disabled={loading}
        className={className ?? "rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"}>
        {loading ? "Starting…" : "Get the Pro report — $19"}
      </button>
      {error && <p className="mt-2 text-sm text-amber-700">{error}</p>}
    </div>
  );
}

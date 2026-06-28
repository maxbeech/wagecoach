"use client";

import { useState } from "react";

// Print + copy controls for the Claim Kit deliverable (the page itself is a
// server component that renders the verified, pre-filled letter).
export default function ClaimKitActions({ letter }: { letter: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button onClick={() => window.print()} className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800">Print / Save as PDF</button>
      <button onClick={copy} className="rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-brand-300 hover:bg-brand-50">{copied ? "Letter copied ✓" : "Copy letter text"}</button>
      <span role="status" aria-live="polite" className="sr-only">{copied ? "Letter copied to clipboard" : ""}</span>
    </div>
  );
}

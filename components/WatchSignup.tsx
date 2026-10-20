"use client";

import { useState } from "react";
import { inputCls } from "./ui";
import { ALL_LOCATIONS } from "@/lib/locations";
import { CLIENT_REQUEST_TIMEOUT_MS, analyticsEvents, analyticsFailureReason, requestFailureReason, watchSignupParams } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/analytics-track";
import { captureClientError } from "@/lib/observability";

// Free Wage Watch signup: one place + an email, then a double opt-in email.
// `defaultLocation` pre-selects the place a state or city page is about.
// `compact` is the one-row version that sits under a rate on those pages.

const STATES = ALL_LOCATIONS.filter((l) => l.key.startsWith("state:"));
const CITIES = ALL_LOCATIONS.filter((l) => l.key.startsWith("city:"));

export default function WatchSignup({ defaultLocation = "", compact = false }: { defaultLocation?: string; compact?: boolean }) {
  const [place, setPlace] = useState(defaultLocation);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!place) { setError("Pick a state or city to watch."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setError("That email address doesn't look right."); return; }
    setState("sending"); setError(null);
    try {
      const res = await fetch("/api/watch/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locations: [place] }),
        signal: AbortSignal.timeout(CLIENT_REQUEST_TIMEOUT_MS),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        trackEvent(analyticsEvents.watchSignup, watchSignupParams(1));
        setState("sent");
        return;
      }
      trackEvent(analyticsEvents.watchSignupFailed, { reason: analyticsFailureReason(data.reason ?? res.status) });
      setError(data.message ?? "Something went wrong. Please try again.");
    } catch (err) {
      const reason = requestFailureReason(err);
      captureClientError(err, { scope: "watch_signup", reason });
      trackEvent(analyticsEvents.watchSignupFailed, { reason });
      setError("We couldn't reach the server. Please try again.");
    }
    setState("idle");
  }

  if (state === "sent") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800 settle-in">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="mt-0.5 shrink-0">
          <circle cx="10" cy="10" r="10" fill="#0d543f" /><path d="M6 10.4l2.6 2.6L14 7.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p><span className="font-semibold">Check your inbox.</span> Click the link we sent to {email} and your alerts start.</p>
      </div>
    );
  }

  const select = (
    <select className={inputCls} value={place} aria-label="Place to watch" onChange={(e) => { setPlace(e.target.value); setError(null); }}>
      <option value="" disabled>Pick a state or city</option>
      <optgroup label="States">{STATES.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}</optgroup>
      <optgroup label="Cities and counties">{CITIES.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}</optgroup>
    </select>
  );
  const emailInput = (
    <input type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" aria-label="Email" className={inputCls}
      value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} />
  );
  const button = (
    <button type="submit" disabled={state === "sending"}
      className="mt-1 shrink-0 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800 disabled:opacity-60">
      {state === "sending" ? "Sending…" : "Get alerts"}
    </button>
  );

  return (
    <form onSubmit={submit} noValidate className={compact ? "" : "space-y-3"}>
      {compact ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          {!defaultLocation && <div className="sm:w-56">{select}</div>}
          <div className="flex-1">{emailInput}</div>
          {button}
        </div>
      ) : (
        <>
          <label className="block"><span className="block text-sm font-medium text-ink">Where</span>{select}</label>
          <label className="block"><span className="block text-sm font-medium text-ink">Email</span>{emailInput}</label>
          <div className="pt-1">{button}</div>
        </>
      )}
      {error && <p className="mt-2 text-sm text-amber-800" role="alert">{error}</p>}
      <p className="mt-2 text-xs text-faint">Free for one place. One email when a rate is about to change. Unsubscribe in one click.</p>
    </form>
  );
}

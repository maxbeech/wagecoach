"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputCls } from "./ui";
import { ALL_LOCATIONS, resolveLocation } from "@/lib/locations";
import { CLIENT_REQUEST_TIMEOUT_MS } from "@/lib/analytics-events";
import { captureClientError } from "@/lib/observability";

// Edit the places a subscriber watches, unsubscribe, or open billing. All
// changes go through /api/watch/* with the manage-link token; the page re-renders
// from the server afterwards, so what you see is what is stored.

export default function WatchManage({ token, places, maxLocations, paid }: { token: string; places: string[]; maxLocations: number; paid: boolean }) {
  const router = useRouter();
  const [list, setList] = useState<string[]>(places);
  const [adding, setAdding] = useState("");
  const [busy, setBusy] = useState<null | "save" | "unsub" | "billing">(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const dirty = list.join() !== places.join();
  const full = list.length >= maxLocations;
  // On a one-place plan the picker replaces the place instead of adding one.
  const swap = maxLocations === 1;

  async function post(path: string, body: Record<string, unknown>, kind: "save" | "unsub" | "billing") {
    setBusy(kind); setMsg(null);
    try {
      const res = await fetch(path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...body }), signal: AbortSignal.timeout(CLIENT_REQUEST_TIMEOUT_MS),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      if (!res.ok || data.ok === false) { setMsg({ tone: "err", text: data.message ?? "Something went wrong. Please try again." }); return; }
      setMsg({ tone: "ok", text: kind === "unsub" ? "You're unsubscribed. No more emails." : "Saved." });
      router.refresh();
    } catch (err) {
      captureClientError(err, { scope: `watch_${kind}` });
      setMsg({ tone: "err", text: "We couldn't reach the server. Please try again." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-ink">Your places</h2>
        <span className="text-xs text-faint">{list.length} of {maxLocations}</span>
      </div>
      <ul className="mt-3 space-y-2">
        {list.map((k) => (
          <li key={k} className="flex items-center justify-between rounded-xl border border-line bg-paper/40 px-3.5 py-2.5 text-sm">
            <span className="text-ink">{resolveLocation(k)?.label ?? k}</span>
            {list.length > 1 && (
              <button type="button" onClick={() => setList(list.filter((x) => x !== k))} className="text-xs font-medium text-muted transition hover:text-ink" aria-label={`Remove ${resolveLocation(k)?.label ?? k}`}>Remove</button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-2">
        <select className={inputCls} value={adding} aria-label={swap ? "Switch place" : "Add a place"} disabled={full && !swap} onChange={(e) => setAdding(e.target.value)}>
          <option value="">{swap ? "Switch to another state or city" : full ? "Place limit reached" : "Add a state or city"}</option>
          {ALL_LOCATIONS.filter((l) => !list.includes(l.key)).map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
        </select>
        <button type="button" disabled={!adding || (full && !swap)} onClick={() => { setList(swap ? [adding] : [...list, adding]); setAdding(""); }}
          className="mt-1 shrink-0 rounded-lg border border-line px-4 text-sm font-medium text-ink transition hover:border-brand-300 disabled:opacity-50">{swap ? "Switch" : "Add"}</button>
      </div>
      {!paid && (
        <p className="mt-2 text-xs text-muted">
          The free plan covers one place. <a href="#upgrade" className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2">Wage Watch</a> covers up to 10.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {dirty && (
          <button type="button" disabled={busy !== null} onClick={() => post("/api/watch/manage", { action: "locations", locations: list }, "save")}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60">
            {busy === "save" ? "Saving…" : "Save changes"}
          </button>
        )}
        {paid && (
          <button type="button" disabled={busy !== null} onClick={() => post("/api/watch/portal", {}, "billing")}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:border-brand-300 disabled:opacity-60">
            {busy === "billing" ? "Opening…" : "Billing and cancel"}
          </button>
        )}
        <button type="button" disabled={busy !== null} onClick={() => post("/api/watch/manage", { action: "unsubscribe" }, "unsub")}
          className="ml-auto text-xs font-medium text-muted underline decoration-line underline-offset-2 transition hover:text-ink disabled:opacity-60">
          {busy === "unsub" ? "Unsubscribing…" : "Unsubscribe from emails"}
        </button>
      </div>
      {msg && <p role="status" className={`settle-in mt-3 text-sm ${msg.tone === "ok" ? "text-brand-700" : "text-amber-800"}`}>{msg.text}</p>}
    </div>
  );
}

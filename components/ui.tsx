"use client";

import { useState } from "react";
import { STATES } from "@/lib/states";

// Shared form primitives — single source for input styling, the editable number
// field and the segmented toggle used across every calculator on the site.
export const inputCls =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink shadow-sm transition focus:border-brand-500 focus:outline-none";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-faint">{hint}</span>}
    </label>
  );
}

// Editable number field: keeps a raw string while typing, clamps on blur (so you
// can clear and retype). Resync uses the React "adjust state during render" pattern.
export function NumberField({ value, min, max, step = 1, onChange, ariaLabel }:
  { value: number; min: number; max: number; step?: number; onChange: (n: number) => void; ariaLabel?: string }) {
  const [raw, setRaw] = useState(String(value));
  const [last, setLast] = useState(value);
  if (value !== last) { setLast(value); setRaw(String(value)); }
  return (
    <input type="number" inputMode="decimal" min={min} max={max} step={step} className={`${inputCls} font-mono tabular-nums`} value={raw}
      aria-label={ariaLabel}
      onChange={(e) => {
        setRaw(e.target.value);
        if (e.target.value === "") return;
        const n = Number(e.target.value);
        if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      onBlur={() => {
        const n = raw === "" ? min : Math.min(max, Math.max(min, Number(raw) || min));
        setRaw(String(n)); onChange(n);
      }} />
  );
}

export function StateSelect({ value, onChange, includeFederal = false, ariaLabel = "State" }:
  { value: string; onChange: (abbr: string) => void; includeFederal?: boolean; ariaLabel?: string }) {
  return (
    <select className={inputCls} value={value} aria-label={ariaLabel} onChange={(e) => onChange(e.target.value)}>
      {includeFederal && <option value="">Federal (FLSA)</option>}
      {STATES.map((s) => (
        <option key={s.abbr} value={s.abbr}>{s.name}</option>
      ))}
    </select>
  );
}

// Segmented toggle — a premium replacement for a two-or-three option select.
export function Segmented<T extends string | number>({ options, value, onChange, ariaLabel }:
  { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; ariaLabel: string }) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex gap-1 rounded-xl border border-line bg-brand-50/50 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={String(o.value)} type="button" aria-pressed={active} onClick={() => onChange(o.value)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink"}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

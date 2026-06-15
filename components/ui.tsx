"use client";

import { useState } from "react";
import { STATES } from "@/lib/states";

// Shared form primitives — single source for input styling and the editable
// number field used by every calculator on the site.
export const inputCls =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-200 focus:outline-none";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
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
    <input type="number" inputMode="decimal" min={min} max={max} step={step} className={inputCls} value={raw}
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

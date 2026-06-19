"use client";

import { useState } from "react";
import { dollars, qty } from "@/lib/federal";
import { effectiveMinWage } from "@/lib/states";
import type { PayBreakdown, PayInputs } from "@/lib/overtime";
import { useCountUp } from "./use-count-up";

function Row({ label, hours, rate, pay, strong }: { label: string; hours: number; rate: string; pay: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline py-2 text-sm ${strong ? "font-semibold text-ink" : "text-muted"}`}>
      <span className="shrink-0">{label}</span>
      {rate !== "" && <span className="ml-2 shrink-0 font-mono text-xs text-faint">{qty(hours)} hrs × {rate}</span>}
      <span className="leader" />
      <span className="shrink-0 font-mono tabular-nums text-ink">{pay}</span>
    </div>
  );
}

export default function PayResults({ inp, r }: { inp: PayInputs; r: PayBreakdown }) {
  const [copied, setCopied] = useState(false);
  const gross = useCountUp(r.gross);
  const minWage = inp.state ? effectiveMinWage(inp.state) : 7.25;
  const belowMin = inp.hourlyRate > 0 && inp.hourlyRate < minWage;

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink">Your pay this week</h2>
        {r.otHours > 0 && (
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-mono text-xs font-medium text-brand-700">
            OT {dollars(r.otRate)}/hr
          </span>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-forest">
        <div className="h-0.5 w-full bg-gold-500/70" />
        <div className="px-5 py-4 text-white">
          <div className="text-xs uppercase tracking-wider text-white/55">Gross pay</div>
          <div className="font-mono text-[2.1rem] font-semibold leading-tight tabular-nums">{dollars(gross)}</div>
          <div className="mt-0.5 text-xs text-white/55">before taxes and deductions</div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-line">
        <Row label="Regular" hours={r.regularHours} rate={dollars(r.regularRate)} pay={dollars(r.regularPay)} />
        {r.otHours > 0 && <Row label={`Overtime (${(r.otRate / r.regularRate || 1.5).toFixed(2)}×)`} hours={r.otHours} rate={dollars(r.otRate)} pay={dollars(r.otPay)} />}
        {r.doubleHours > 0 && <Row label="Double time (2×)" hours={r.doubleHours} rate={dollars(r.doubleRate)} pay={dollars(r.doublePay)} />}
        <Row label="Total gross" hours={r.regularHours + r.otHours + r.doubleHours} rate="" pay={dollars(r.gross)} strong />
      </div>

      <p className="mt-4 rounded-lg border border-line bg-brand-50/40 p-3 text-xs leading-relaxed text-muted">{r.rule}</p>

      {belowMin && (
        <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          {dollars(inp.hourlyRate)}/hr is below the {inp.state ? inp.state.name : "federal"} minimum wage of {dollars(minWage)}/hr. Non-exempt employees must be paid at least the minimum wage.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        <button onClick={() => window.print()} className="rounded-lg border border-line bg-card px-3.5 py-2 text-sm font-medium text-ink transition hover:border-brand-300 hover:bg-brand-50">Print / Save PDF</button>
        <button onClick={share} className="rounded-lg border border-line bg-card px-3.5 py-2 text-sm font-medium text-ink transition hover:border-brand-300 hover:bg-brand-50">{copied ? "Link copied ✓" : "Share link"}</button>
        <span role="status" aria-live="polite" className="sr-only">{copied ? "Link copied to clipboard" : ""}</span>
      </div>
    </div>
  );
}

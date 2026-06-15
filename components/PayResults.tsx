"use client";

import { useState } from "react";
import { dollars } from "@/lib/federal";
import { effectiveMinWage } from "@/lib/states";
import type { PayBreakdown, PayInputs } from "@/lib/overtime";

function Row({ label, hours, rate, pay, strong }: { label: string; hours: number; rate: string; pay: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-1.5 text-sm ${strong ? "font-semibold text-slate-900" : "text-slate-600"}`}>
      <span>{label}</span>
      <span className="text-right tabular-nums">
        <span className="text-slate-400">{hours} hrs × {rate}</span>
        <span className="ml-3 text-slate-900">{pay}</span>
      </span>
    </div>
  );
}

export default function PayResults({ inp, r }: { inp: PayInputs; r: PayBreakdown }) {
  const [copied, setCopied] = useState(false);
  const minWage = inp.state ? effectiveMinWage(inp.state) : 7.25;
  const belowMin = inp.hourlyRate > 0 && inp.hourlyRate < minWage;

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Your pay this week</h2>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          OT rate {dollars(r.otRate)}/hr
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-slate-900 px-5 py-4 text-white">
        <div className="text-xs uppercase tracking-wide text-slate-400">Gross pay</div>
        <div className="text-3xl font-bold tabular-nums">{dollars(r.gross)}</div>
        <div className="mt-0.5 text-xs text-slate-400">before taxes and deductions</div>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        <Row label="Regular" hours={r.regularHours} rate={dollars(r.regularRate)} pay={dollars(r.regularPay)} />
        {r.otHours > 0 && <Row label={`Overtime (${(r.otRate / r.regularRate || 1.5).toFixed(2)}×)`} hours={r.otHours} rate={dollars(r.otRate)} pay={dollars(r.otPay)} />}
        {r.doubleHours > 0 && <Row label="Double time (2×)" hours={r.doubleHours} rate={dollars(r.doubleRate)} pay={dollars(r.doublePay)} />}
        <Row label="Total gross" hours={r.regularHours + r.otHours + r.doubleHours} rate="" pay={dollars(r.gross)} strong />
      </div>

      <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{r.rule}</p>

      {belowMin && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          ⚠ {dollars(inp.hourlyRate)}/hr is below the {inp.state ? inp.state.name : "federal"} minimum wage of {dollars(minWage)}/hr. Non-exempt employees must be paid at least the minimum wage.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button onClick={() => window.print()} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Print / Save PDF</button>
        <button onClick={share} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{copied ? "Link copied ✓" : "Share"}</button>
      </div>
    </div>
  );
}

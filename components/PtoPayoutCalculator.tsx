"use client";

import { useMemo, useState } from "react";
import { dollars } from "@/lib/federal";
import { getStateByAbbr } from "@/lib/states";
import { ptoPayout } from "@/lib/wage";
import { Field, NumberField, StateSelect } from "./ui";

export default function PtoPayoutCalculator({ seedAbbr = "" }: { seedAbbr?: string }) {
  const [abbr, setAbbr] = useState(seedAbbr);
  const [hours, setHours] = useState(80);
  const [rate, setRate] = useState(25);
  const state = abbr ? getStateByAbbr(abbr) ?? null : null;
  const r = useMemo(() => ptoPayout(hours, rate, state), [hours, rate, state]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Your PTO</h2>
        <div className="mt-3 space-y-3">
          <Field label="Accrued unused PTO (hours)" hint="Hours of vacation/PTO on your balance.">
            <NumberField value={hours} min={0} max={2000} step={1} onChange={setHours} ariaLabel="Accrued PTO hours" />
          </Field>
          <Field label="Hourly rate ($)" hint="Salaried? Divide annual salary by 2,080.">
            <NumberField value={rate} min={0} max={5000} step={0.25} onChange={setRate} ariaLabel="Hourly rate" />
          </Field>
          <Field label="State" hint="Sets whether payout is required on separation.">
            <StateSelect value={abbr} onChange={setAbbr} includeFederal ariaLabel="State" />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">PTO payout value</h2>
        <div className="mt-3 rounded-xl bg-slate-900 px-5 py-4 text-white">
          <div className="text-xs uppercase tracking-wide text-slate-400">Gross payout</div>
          <div className="text-3xl font-bold tabular-nums">{dollars(r.payout)}</div>
          <div className="mt-0.5 text-xs text-slate-400">{hours} hrs × {dollars(rate)}/hr, before taxes</div>
        </div>
        <p className={`mt-3 rounded-lg p-3 text-xs ${r.payoutRequired ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-600"}`}>
          {r.payoutRequired ? "✓ " : ""}{r.note}
        </p>
      </div>
    </div>
  );
}

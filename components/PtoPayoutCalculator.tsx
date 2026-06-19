"use client";

import { useMemo, useState } from "react";
import { dollars, qty } from "@/lib/federal";
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
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">Your PTO</h2>
        <div className="mt-4 space-y-4">
          <Field label="Accrued unused PTO (hours)" hint="Hours of vacation or PTO on your balance.">
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

      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">PTO payout value</h2>
        <div className="mt-4 overflow-hidden rounded-xl bg-forest text-white">
          <div className="h-0.5 w-full bg-gold-500/70" />
          <div className="px-5 py-4">
            <div className="text-xs uppercase tracking-wider text-white/55">Gross payout</div>
            <div className="font-mono text-[2.1rem] font-semibold leading-tight tabular-nums">{dollars(r.payout)}</div>
            <div className="mt-0.5 text-xs text-white/55">{qty(hours)} hrs × {dollars(rate)}/hr, before taxes</div>
          </div>
        </div>
        <p className={`mt-4 rounded-lg p-3 text-xs leading-relaxed ${r.payoutRequired ? "border border-brand-200 bg-brand-50 text-brand-800" : "border border-line bg-brand-50/40 text-muted"}`}>
          {r.payoutRequired ? "Required. " : ""}{r.note}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { dollars } from "@/lib/federal";
import { getStateByAbbr } from "@/lib/states";
import { exemptCheck } from "@/lib/wage";
import { Field, NumberField, StateSelect } from "./ui";

export default function ExemptChecker({ seedAbbr = "" }: { seedAbbr?: string }) {
  const [abbr, setAbbr] = useState(seedAbbr);
  const [salary, setSalary] = useState(45000);
  const state = abbr ? getStateByAbbr(abbr) ?? null : null;
  const r = useMemo(() => exemptCheck(salary, state), [salary, state]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Salary details</h2>
        <div className="mt-3 space-y-3">
          <Field label="Annual salary ($)" hint="Gross annual salary, before bonuses.">
            <NumberField value={salary} min={0} max={1000000} step={500} onChange={setSalary} ariaLabel="Annual salary" />
          </Field>
          <Field label="State" hint="Some states set a higher salary threshold than federal.">
            <StateSelect value={abbr} onChange={setAbbr} includeFederal ariaLabel="State" />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Salary-threshold test</h2>
        <div className={`mt-3 rounded-xl px-5 py-4 ${r.meetsSalary ? "bg-emerald-600" : "bg-slate-900"} text-white`}>
          <div className="text-xs uppercase tracking-wide opacity-80">{r.meetsSalary ? "Clears the salary threshold" : "Below the salary threshold"}</div>
          <div className="text-2xl font-bold tabular-nums">{dollars(salary)} vs {dollars(r.threshold)}</div>
          <div className="mt-0.5 text-sm opacity-90">{r.meetsSalary ? "Salary test met — but the duties test must also pass." : "Likely non-exempt — owed overtime over 40 hrs/week."}</div>
        </div>

        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{r.basis}</p>
        {r.stateNote && <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">{r.stateNote}</p>}
        <p className="mt-2 text-xs text-slate-400">
          Salary is only one half of the exemption. The employee must ALSO perform exempt executive,
          administrative or professional duties. Salary alone never makes someone exempt.
        </p>
      </div>
    </div>
  );
}

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
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">Salary details</h2>
        <div className="mt-4 space-y-4">
          <Field label="Annual salary ($)" hint="Gross annual salary, before bonuses.">
            <NumberField value={salary} min={0} max={1000000} step={500} onChange={setSalary} ariaLabel="Annual salary" />
          </Field>
          <Field label="State" hint="Some states set a higher salary threshold than federal.">
            <StateSelect value={abbr} onChange={setAbbr} includeFederal ariaLabel="State" />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">Salary-threshold test</h2>
        {r.meetsSalary === "confirm" ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-amber-300 bg-amber-50">
            <div className="h-0.5 w-full bg-gold-500/70" />
            <div className="px-5 py-4">
              <div className="text-xs uppercase tracking-wider text-amber-900">Verify against your state&apos;s threshold</div>
              <div className="mt-0.5 font-mono text-2xl font-semibold tabular-nums text-amber-900">{dollars(salary)} <span className="text-amber-900/70">vs</span> {dollars(r.threshold)}</div>
              <div className="mt-1 text-sm text-amber-900/90">The applicable figure depends on the work location, so confirm before relying on this.</div>
            </div>
          </div>
        ) : (
          <div className={`mt-4 overflow-hidden rounded-xl ${r.meetsSalary ? "bg-brand-600" : "bg-forest"} text-white`}>
            <div className="h-0.5 w-full bg-gold-500/70" />
            <div className="px-5 py-4">
              <div className="text-xs uppercase tracking-wider text-white/90">{r.meetsSalary ? "Clears the salary threshold" : "Below the salary threshold"}</div>
              <div className="mt-0.5 font-mono text-2xl font-semibold tabular-nums">{dollars(salary)} <span className="text-white/75">vs</span> {dollars(r.threshold)}</div>
              <div className="mt-1 text-sm text-white/90">{r.meetsSalary ? "Salary test met, but the duties test must also pass." : "Likely non-exempt, and owed overtime over 40 hrs/week."}</div>
            </div>
          </div>
        )}

        <p className="mt-4 rounded-lg border border-line bg-brand-50/40 p-3 text-xs leading-relaxed text-muted">{r.basis}</p>
        {r.stateNote && <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">{r.stateNote}</p>}
        <p className="mt-3 text-xs leading-relaxed text-faint">
          Salary is only one half of the exemption. The employee must also perform exempt executive,
          administrative or professional duties. Salary alone never makes someone exempt.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { dollars } from "@/lib/federal";
import { getStateByAbbr } from "@/lib/states";
import { tipCredit } from "@/lib/wage";
import { Field, NumberField, StateSelect } from "./ui";

export default function TippedWageCalculator({ seedAbbr = "" }: { seedAbbr?: string }) {
  const [abbr, setAbbr] = useState(seedAbbr);
  const [cashWage, setCashWage] = useState(2.13);
  const [hours, setHours] = useState(30);
  const [tips, setTips] = useState(250);

  const state = abbr ? getStateByAbbr(abbr) ?? null : null;
  const r = useMemo(() => tipCredit({ cashWage, hours, tips, state }), [cashWage, hours, tips, state]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">Your tipped pay</h2>
        <div className="mt-4 space-y-4">
          <Field label="State" hint="Sets the minimum wage you must reach.">
            <StateSelect value={abbr} onChange={setAbbr} includeFederal ariaLabel="State" />
          </Field>
          <Field label="Cash wage paid ($/hr)" hint="The hourly wage your employer pays before tips.">
            <NumberField value={cashWage} min={0} max={100} step={0.01} onChange={setCashWage} ariaLabel="Cash wage per hour" />
          </Field>
          <Field label="Hours worked" hint="In the pay period.">
            <NumberField value={hours} min={0} max={300} step={0.5} onChange={setHours} ariaLabel="Hours worked" />
          </Field>
          <Field label="Total tips received ($)" hint="Across the same period.">
            <NumberField value={tips} min={0} max={100000} step={5} onChange={setTips} ariaLabel="Total tips" />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">Does it meet the minimum wage?</h2>
        <div className={`mt-4 overflow-hidden rounded-xl ${r.meetsMinimum ? "bg-brand-600" : "bg-rose-700"} text-white`}>
          <div className="h-0.5 w-full bg-white/25" />
          <div className="px-5 py-4">
            <div className="text-xs uppercase tracking-wider text-white/90">Effective hourly</div>
            <div className="font-mono text-[2.1rem] font-semibold leading-tight tabular-nums">{dollars(r.effectiveHourly)}</div>
            <div className="mt-0.5 text-sm text-white/90">{r.meetsMinimum ? "Meets" : "Below"} the {dollars(r.minWage)}/hr minimum wage</div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-line text-sm">
          <div className="flex justify-between py-2 text-muted"><span>Cash wage</span><span className="font-mono tabular-nums text-ink">{dollars(cashWage)}/hr</span></div>
          <div className="flex justify-between py-2 text-muted"><span>Tips per hour</span><span className="font-mono tabular-nums text-ink">{dollars(r.tipsPerHour)}/hr</span></div>
          {!r.meetsMinimum && (
            <div className="flex justify-between py-2 font-semibold text-amber-800"><span>Employer must make up</span><span className="font-mono tabular-nums">{dollars(r.makeUpTotal)}</span></div>
          )}
        </div>

        {!r.tipCreditAllowed && state && (
          <p className="mt-4 rounded-lg border border-brand-200 bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">
            {state.name} does not allow a tip credit. You must be paid the full {dollars(r.minWage)}/hr minimum wage in cash, with tips on top.
          </p>
        )}
        {r.tipCreditAllowed && state && state.tippedCashWage === null && state.tippedNote && (
          <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            {state.tippedNote} This tool checks against the full {dollars(r.minWage)}/hr minimum, so enter your actual cash wage to see any shortfall.
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-faint">
          Federal law lets employers pay a $2.13 cash wage and take a tip credit, but cash plus tips must reach the minimum wage every hour.
        </p>
      </div>
    </div>
  );
}

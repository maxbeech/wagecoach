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
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Your tipped pay</h2>
        <div className="mt-3 space-y-3">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Does it meet the minimum wage?</h2>
        <div className={`mt-3 rounded-xl px-5 py-4 ${r.meetsMinimum ? "bg-emerald-700" : "bg-rose-700"} text-white`}>
          <div className="text-xs uppercase tracking-wide">Effective hourly</div>
          <div className="text-3xl font-bold tabular-nums">{dollars(r.effectiveHourly)}</div>
          <div className="mt-0.5 text-sm">{r.meetsMinimum ? "Meets" : "Below"} the {dollars(r.minWage)}/hr minimum wage</div>
        </div>

        <div className="mt-3 divide-y divide-slate-100 text-sm">
          <div className="flex justify-between py-1.5 text-slate-600"><span>Cash wage</span><span className="tabular-nums text-slate-900">{dollars(cashWage)}/hr</span></div>
          <div className="flex justify-between py-1.5 text-slate-600"><span>Tips per hour</span><span className="tabular-nums text-slate-900">{dollars(r.tipsPerHour)}/hr</span></div>
          {!r.meetsMinimum && (
            <div className="flex justify-between py-1.5 font-semibold text-amber-700"><span>Employer must make up</span><span className="tabular-nums">{dollars(r.makeUpTotal)}</span></div>
          )}
        </div>

        {!r.tipCreditAllowed && state && (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            {state.name} does not allow a tip credit — you must be paid the full {dollars(r.minWage)}/hr minimum wage in cash, with tips on top.
          </p>
        )}
        {r.tipCreditAllowed && state && state.tippedCashWage === null && state.tippedNote && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            {state.tippedNote} This tool checks against the full {dollars(r.minWage)}/hr minimum — enter your actual cash wage to see any shortfall.
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Federal law lets employers pay a $2.13 cash wage and take a tip credit, but cash + tips must reach the minimum wage every hour.
        </p>
      </div>
    </div>
  );
}

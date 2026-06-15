"use client";

import { useEffect, useState } from "react";
import { dollars } from "@/lib/federal";
import { effectiveMinWage, getStateByAbbr, STATES } from "@/lib/states";
import { Field, StateSelect } from "./ui";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-xl font-bold text-slate-900 tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

// Wage / overtime / final-pay / break lookup for a state. `focus` decides which
// block leads; all data is shown either way. Used by the minimum-wage and
// final-paycheck calculators and embeddable on state pages.
export default function StateWageLookup({ seedAbbr = "CA", focus = "minwage" }: { seedAbbr?: string; focus?: "minwage" | "finalpay" }) {
  const [abbr, setAbbr] = useState(seedAbbr);
  useEffect(() => {
    const u = new URLSearchParams(window.location.search).get("st");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (u && getStateByAbbr(u)) setAbbr(u.toUpperCase());
  }, []);
  const onChange = (a: string) => {
    setAbbr(a);
    window.history.replaceState(null, "", `${window.location.pathname}?st=${a}`);
  };

  const s = getStateByAbbr(abbr) ?? STATES[0];
  const min = effectiveMinWage(s);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Field label="State">
        <StateSelect value={s.abbr} onChange={onChange} />
      </Field>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {focus === "finalpay" ? (
          <>
            <Stat label="Final pay — if fired" value={s.finalPayFired} />
            <Stat label="Final pay — if you quit" value={s.finalPayQuit} />
            <Stat label="2026 minimum wage" value={`${dollars(min)}/hr`} sub={s.minWageNote} />
            <Stat label="Daily overtime" value={s.dailyOt ? `Over ${s.dailyOt.afterHours} hrs/day` : "None (weekly only)"} />
          </>
        ) : (
          <>
            <Stat label="2026 minimum wage" value={`${dollars(min)}/hr`} sub={s.minWageNote} />
            <Stat label="Tipped cash wage" value={s.tipCreditAllowed ? (s.tippedCashWage !== null ? `${dollars(s.tippedCashWage)}/hr` : "Varies") : "No tip credit"} sub={s.tipCreditAllowed ? (s.tippedNote ?? "Cash wage + tips must reach the minimum wage.") : "Full minimum wage paid in cash before tips."} />
            <Stat label="Overtime" value={s.dailyOt ? `Daily over ${s.dailyOt.afterHours} hrs + 40/wk` : "Over 40 hrs/week"} sub={s.dailyOt?.note} />
            <Stat label="Final paycheck (fired)" value={s.finalPayFired} />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="font-semibold text-slate-900">Meal break</div>
          <p className="mt-1 text-slate-600">{s.mealBreak}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="font-semibold text-slate-900">Rest break</div>
          <p className="mt-1 text-slate-600">{s.restBreak}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        General guidance for {s.name}, current for 2026. Local ordinances and industry rules vary —
        confirm with your state labor department before relying on this for payroll or a legal decision.
      </p>
    </div>
  );
}

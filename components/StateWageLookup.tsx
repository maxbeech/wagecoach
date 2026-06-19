"use client";

import { useEffect, useState } from "react";
import { dollars } from "@/lib/federal";
import { effectiveMinWage, getStateByAbbr, STATES } from "@/lib/states";
import { Field, StateSelect } from "./ui";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="text-[0.7rem] font-medium uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 font-semibold tabular-nums text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-xs leading-snug text-faint">{sub}</div>}
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
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
      <Field label="State">
        <StateSelect value={s.abbr} onChange={onChange} />
      </Field>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {focus === "finalpay" ? (
          <>
            <Stat label="Final pay if fired" value={s.finalPayFired} />
            <Stat label="Final pay if you quit" value={s.finalPayQuit} />
            <Stat label="2026 minimum wage" value={`${dollars(min)}/hr`} sub={s.minWageNote} />
            <Stat label="Daily overtime" value={s.dailyOt ? `Over ${s.dailyOt.afterHours} hrs/day` : "None (weekly only)"} />
          </>
        ) : (
          <>
            <Stat label="2026 minimum wage" value={`${dollars(min)}/hr`} sub={s.minWageNote} />
            <Stat label="Tipped cash wage" value={s.tipCreditAllowed ? (s.tippedCashWage !== null ? `${dollars(s.tippedCashWage)}/hr` : "Varies") : "No tip credit"} sub={s.tipCreditAllowed ? (s.tippedNote ?? "Cash wage plus tips must reach the minimum wage.") : "Full minimum wage paid in cash before tips."} />
            <Stat label="Overtime" value={s.dailyOt ? `Daily over ${s.dailyOt.afterHours} hrs + 40/wk` : "Over 40 hrs/week"} sub={s.dailyOt?.note} />
            <Stat label="Final paycheck (fired)" value={s.finalPayFired} />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-brand-50/30 p-3.5">
          <div className="font-semibold text-ink">Meal break</div>
          <p className="mt-1 leading-relaxed text-muted">{s.mealBreak}</p>
        </div>
        <div className="rounded-xl border border-line bg-brand-50/30 p-3.5">
          <div className="font-semibold text-ink">Rest break</div>
          <p className="mt-1 leading-relaxed text-muted">{s.restBreak}</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-faint">
        General guidance for {s.name}, current for 2026. Local ordinances and industry rules vary, so
        confirm with your state labor department before relying on this for payroll or a legal decision.
      </p>
    </div>
  );
}

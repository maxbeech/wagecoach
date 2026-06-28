"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_BACKPAY, estimateBackPay, type BackPayInputs, type ClaimType } from "@/lib/backpay";
import { decodeBackPay, encodeBackPay } from "@/lib/backpay-url";
import { getStateByAbbr } from "@/lib/states";
import { dollars } from "@/lib/federal";
import { Field, NumberField, StateSelect, inputCls } from "./ui";
import BackPayResults from "./BackPayResults";

const CLAIM_OPTIONS: { value: ClaimType; label: string }[] = [
  { value: "overtime", label: "Unpaid overtime (paid straight time, no premium)" },
  { value: "misclassification", label: "Salaried, but I think I'm owed overtime" },
  { value: "off_the_clock", label: "Off-the-clock work (unpaid hours)" },
  { value: "minimum_wage", label: "Paid below the minimum wage" },
];

export default function BackPayCalculator({ seed }: { seed?: Partial<BackPayInputs> }) {
  const [inp, setInp] = useState<BackPayInputs>(() => ({ ...DEFAULT_BACKPAY, ...seed }));
  const hydrated = useRef(false);

  useEffect(() => {
    const loaded = decodeBackPay(window.location.search, seed);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInp(loaded);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.history.replaceState(null, "", `${window.location.pathname}?${encodeBackPay(inp)}`);
  }, [inp]);

  const r = useMemo(() => estimateBackPay(inp), [inp]);
  const set = <K extends keyof BackPayInputs>(k: K, v: BackPayInputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const straightTime = Math.round(inp.hourlyRate * inp.hoursPerWeek * 100) / 100;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6 print:hidden">
        <h2 className="font-display text-base font-semibold text-ink">Your situation</h2>
        <div className="mt-4 space-y-4">
          <Field label="What happened?" hint="Pick the closest description of the underpayment.">
            <select className={inputCls} value={inp.claimType}
              onChange={(e) => set("claimType", e.target.value as ClaimType)}>
              {CLAIM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>

          <Field label="State" hint="Sets the minimum wage and the agency you'd file with.">
            <StateSelect includeFederal value={inp.state?.abbr ?? ""}
              onChange={(abbr) => set("state", abbr ? (getStateByAbbr(abbr) ?? null) : null)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Hourly rate ($)" hint="Your regular rate.">
              <NumberField value={inp.hourlyRate} min={0} max={10000} step={0.25} onChange={(n) => set("hourlyRate", n)} ariaLabel="Hourly rate in dollars" />
            </Field>
            <Field label="Hours per week" hint="In an affected week.">
              <NumberField value={inp.hoursPerWeek} min={0} max={168} step={0.5} onChange={(n) => set("hoursPerWeek", n)} ariaLabel="Hours per week" />
            </Field>
          </div>

          <Field label="What you were actually paid per week ($)" hint="Gross for a typical affected week, before taxes.">
            <NumberField value={inp.paidWeekly} min={0} max={1000000} step={1} onChange={(n) => set("paidWeekly", n)} ariaLabel="Actual weekly pay in dollars" />
            <button type="button" onClick={() => set("paidWeekly", straightTime)}
              className="mt-1.5 text-xs font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600">
              Use straight-time pay ({dollars(straightTime)}) — the common &ldquo;no overtime premium&rdquo; case
            </button>
          </Field>

          <Field label="How many weeks did this run?" hint="Federal law lets you recover up to 2 years (3 if willful).">
            <NumberField value={inp.weeksAffected} min={0} max={520} step={1} onChange={(n) => set("weeksAffected", n)} ariaLabel="Weeks affected" />
          </Field>

          <label className="flex items-start gap-2.5 rounded-lg border border-line bg-brand-50/40 px-3 py-2.5 text-sm text-ink">
            <input type="checkbox" checked={inp.willful} className="mt-0.5 h-4 w-4 accent-brand-600"
              onChange={(e) => set("willful", e.target.checked)} />
            <span>The employer knew or was warned and kept underpaying (a <strong>willful</strong> violation extends the window to 3 years).</span>
          </label>
        </div>
      </div>

      <BackPayResults inp={inp} r={r} />
    </div>
  );
}

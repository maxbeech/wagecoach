"use client";

import { useMemo, useState } from "react";
import { dollars } from "@/lib/federal";
import { computeSalary, DEFAULT_SALARY, type SalaryMode } from "@/lib/salary";
import { Field, NumberField } from "./ui";

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-600">{label}{hint && <span className="ml-1 text-xs text-slate-500">{hint}</span>}</span>
      <span className="font-semibold tabular-nums text-slate-900">{value}</span>
    </div>
  );
}

export default function SalaryConverter() {
  const [mode, setMode] = useState<SalaryMode>(DEFAULT_SALARY.mode);
  const [amount, setAmount] = useState(DEFAULT_SALARY.amount);
  const [hpw, setHpw] = useState(40);
  const [wpy, setWpy] = useState(52);
  const r = useMemo(() => computeSalary({ mode, amount, hoursPerWeek: hpw, weeksPerYear: wpy }), [mode, amount, hpw, wpy]);

  const isSalary = mode === "salaryToHourly";
  const swap = (m: SalaryMode) => {
    // Carry the headline figure across so the result doesn't jump nonsensically.
    setAmount(m === "salaryToHourly" ? r.annual : r.hourly);
    setMode(m);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 text-sm">
          <button onClick={() => swap("salaryToHourly")} aria-pressed={isSalary}
            className={`rounded-md px-3 py-1.5 font-medium ${isSalary ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
            Salary → hourly
          </button>
          <button onClick={() => swap("hourlyToSalary")} aria-pressed={!isSalary}
            className={`rounded-md px-3 py-1.5 font-medium ${!isSalary ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
            Hourly → salary
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <Field label={isSalary ? "Annual salary ($)" : "Hourly rate ($)"}>
            <NumberField value={amount} min={0} max={isSalary ? 10000000 : 10000} step={isSalary ? 1000 : 0.25}
              onChange={setAmount} ariaLabel={isSalary ? "Annual salary" : "Hourly rate"} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Hours / week" hint="Usually 40 for full-time.">
              <NumberField value={hpw} min={1} max={168} step={1} onChange={setHpw} ariaLabel="Hours per week" />
            </Field>
            <Field label="Weeks / year" hint="52 = paid all year.">
              <NumberField value={wpy} min={1} max={53} step={1} onChange={setWpy} ariaLabel="Weeks per year" />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Your pay, every which way</h2>
        <div className="mt-3 rounded-xl bg-slate-900 px-5 py-4 text-white">
          <div className="text-xs uppercase tracking-wide text-slate-300">{isSalary ? "Equivalent hourly rate" : "Equivalent annual salary"}</div>
          <div className="text-3xl font-bold tabular-nums">{isSalary ? `${dollars(r.hourly)}/hr` : dollars(r.annual)}</div>
          <div className="mt-0.5 text-xs text-slate-300">at {hpw} hrs/week, {wpy} weeks/year, before taxes</div>
        </div>
        <div className="mt-3">
          <Row label="Hourly" value={`${dollars(r.hourly)}/hr`} />
          <Row label="Weekly" value={dollars(r.weekly)} />
          <Row label="Biweekly" value={dollars(r.biweekly)} hint="(every 2 weeks)" />
          <Row label="Semi-monthly" value={dollars(r.semiMonthly)} hint="(twice a month)" />
          <Row label="Monthly" value={dollars(r.monthly)} />
          <Row label="Annual" value={dollars(r.annual)} />
        </div>
        <p className="mt-3 text-xs text-slate-500">Gross figures before taxes and deductions. Biweekly = annual ÷ 26; semi-monthly = annual ÷ 24.</p>
      </div>
    </div>
  );
}

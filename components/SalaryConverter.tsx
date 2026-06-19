"use client";

import { useMemo, useState } from "react";
import { dollars } from "@/lib/federal";
import { computeSalary, DEFAULT_SALARY, type SalaryMode } from "@/lib/salary";
import { Field, NumberField, Segmented } from "./ui";

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline py-2 text-sm">
      <span className="shrink-0 text-muted">{label}{hint && <span className="ml-1 text-xs text-faint">{hint}</span>}</span>
      <span className="leader" />
      <span className="shrink-0 font-mono font-semibold tabular-nums text-ink">{value}</span>
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
    if (m === mode) return;
    // Carry the headline across at full precision so a round-trip is stable. The
    // displayed hourly is rounded to cents, but feeding that rounded figure back
    // would drift the salary by several dollars (28.85 x 2080 != 60,000), so we
    // carry the exact hourly = annual / (hours per year) instead.
    setAmount(m === "salaryToHourly" ? r.annual : r.annual / (hpw * wpy));
    setMode(m);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6 print:hidden">
        <Segmented<SalaryMode>
          ariaLabel="Conversion direction"
          value={mode}
          onChange={swap}
          options={[{ value: "salaryToHourly", label: "Salary → hourly" }, { value: "hourlyToSalary", label: "Hourly → salary" }]}
        />

        <div className="mt-4 space-y-4">
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

      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">Your pay, every which way</h2>
        <div className="mt-4 overflow-hidden rounded-xl bg-forest">
          <div className="h-0.5 w-full bg-gold-500/70" />
          <div className="px-5 py-4 text-white">
            <div className="text-xs uppercase tracking-wider text-white/55">{isSalary ? "Equivalent hourly rate" : "Equivalent annual salary"}</div>
            <div className="font-mono text-[2.1rem] font-semibold leading-tight tabular-nums">{isSalary ? `${dollars(r.hourly)}/hr` : dollars(r.annual)}</div>
            <div className="mt-0.5 text-xs text-white/55">at {hpw} hrs/week, {wpy} weeks/year, before taxes</div>
          </div>
        </div>
        <div className="mt-4 divide-y divide-line">
          <Row label="Hourly" value={`${dollars(r.hourly)}/hr`} />
          <Row label="Weekly" value={dollars(r.weekly)} />
          <Row label="Biweekly" value={dollars(r.biweekly)} hint="(every 2 weeks)" />
          <Row label="Semi-monthly" value={dollars(r.semiMonthly)} hint="(twice a month)" />
          <Row label="Monthly" value={dollars(r.monthly)} />
          <Row label="Annual" value={dollars(r.annual)} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-faint">Gross figures before taxes and deductions. Biweekly = annual ÷ 26; semi-monthly = annual ÷ 24.</p>
      </div>
    </div>
  );
}

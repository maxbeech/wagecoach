"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { computePay, DEFAULT_PAY, type PayInputs } from "@/lib/overtime";
import { decodeInputs, encodeInputs } from "@/lib/pay-url";
import { STATES } from "@/lib/states";
import { Field, NumberField, inputCls } from "./ui";
import PayResults from "./PayResults";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PayCalculator({ seed }: { seed?: Partial<PayInputs> }) {
  const [inp, setInp] = useState<PayInputs>(() => ({ ...DEFAULT_PAY, ...seed }));
  const [daily, setDaily] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    // Hydrate inputs from the URL on mount (window is client-only). The one-time
    // setState here is intentional — justified disables.
    const loaded = decodeInputs(window.location.search, seed);
    const startDaily = Boolean(loaded.dailyHours?.some((h) => h > 0));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInp(loaded);
    setDaily(startDaily);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.history.replaceState(null, "", `${window.location.pathname}?${encodeInputs(inp)}`);
  }, [inp]);

  const r = useMemo(() => computePay(inp), [inp]);
  const set = <K extends keyof PayInputs>(k: K, v: PayInputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const days = inp.dailyHours ?? [0, 0, 0, 0, 0, 0, 0];
  const setDay = (i: number, v: number) =>
    setInp((p) => {
      const d = [...(p.dailyHours ?? [0, 0, 0, 0, 0, 0, 0])];
      d[i] = v;
      return { ...p, dailyHours: d };
    });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
        <h2 className="text-sm font-semibold text-slate-900">Your pay</h2>
        <div className="mt-3 space-y-3">
          <Field label="Hourly rate ($)" hint="Your regular (base) hourly wage.">
            <NumberField value={inp.hourlyRate} min={0} max={10000} step={0.25} onChange={(n) => set("hourlyRate", n)} ariaLabel="Hourly rate in dollars" />
          </Field>

          <Field label="State" hint="Sets the minimum wage and any daily-overtime rule.">
            <select className={inputCls} value={inp.state?.abbr ?? ""}
              onChange={(e) => {
                const st = STATES.find((s) => s.abbr === e.target.value) ?? null;
                setInp((p) => ({ ...p, state: st }));
                if (!st || !st.dailyOt) setDaily(false);
              }}>
              <option value="">Federal (FLSA) — no daily overtime</option>
              {STATES.map((s) => (
                <option key={s.abbr} value={s.abbr}>{s.name}</option>
              ))}
            </select>
          </Field>

          {!daily && (
            <Field label="Overtime multiplier" hint="1.5× is standard. Use 2× for double time / holiday policies.">
              <select className={inputCls} value={inp.otMultiplier} onChange={(e) => set("otMultiplier", Number(e.target.value))}>
                <option value={1.5}>1.5× — time and a half (standard)</option>
                <option value={2}>2× — double time / holiday</option>
              </select>
            </Field>
          )}

          {!daily && (
            <Field label="Hours worked this week" hint="Total hours in the workweek.">
              <NumberField value={inp.hoursThisWeek} min={0} max={168} step={0.5} onChange={(n) => set("hoursThisWeek", n)} ariaLabel="Hours worked this week" />
            </Field>
          )}

          {inp.state?.dailyOt && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={daily} className="h-4 w-4 rounded border-slate-300 text-emerald-700"
                onChange={(e) => {
                  setDaily(e.target.checked);
                  if (!e.target.checked) setInp((p) => ({ ...p, dailyHours: undefined }));
                }} />
              Calculate {inp.state.name} daily overtime (enter hours per day)
            </label>
          )}

          {daily && (
            <>
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                {DAYS.map((d, i) => (
                  <label key={d} className="block text-center">
                    <span className="block text-[11px] font-medium text-slate-500">{d}</span>
                    <NumberField value={days[i] ?? 0} min={0} max={24} step={0.5} onChange={(n) => setDay(i, n)} ariaLabel={`Hours on ${d}`} />
                  </label>
                ))}
              </div>
              {!r.dailyApplied && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                  {inp.state?.abbr === "NV"
                    ? `Nevada daily overtime only applies to employees earning under 1.5× the minimum wage. At ${"$"}${inp.hourlyRate}/hr it doesn't apply, so the weekly (over-40) calculation is shown.`
                    : "Daily overtime doesn't apply here — showing the weekly (over-40) calculation."}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <PayResults inp={inp} r={r} />
    </div>
  );
}

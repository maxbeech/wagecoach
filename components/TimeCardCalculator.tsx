"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { computeTimeCard, MAX_ROWS, type TimeRow } from "@/lib/timecard";
import { DEFAULT_TIMECARD, blankRow, decodeTimeCard, encodeTimeCard, type TimeCardState } from "@/lib/timecard-url";
import { getStateByAbbr } from "@/lib/states";
import { Field, NumberField, Segmented, StateSelect, inputCls } from "./ui";
import TimeCardResults from "./TimeCardResults";
import { useCalculatorUse } from "./use-calculator-use";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const linkCls = "text-xs font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600";

export default function TimeCardCalculator() {
  const [inp, setInp] = useState<TimeCardState>(DEFAULT_TIMECARD);
  const hydrated = useRef(false);

  useEffect(() => {
    // Hydrate from the URL on mount (window is client-only); one-time setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInp(decodeTimeCard(window.location.search));
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.history.replaceState(null, "", `${window.location.pathname}?${encodeTimeCard(inp)}`);
  }, [inp]);

  const r = useMemo(() => computeTimeCard(inp), [inp]);
  const count = inp.period === "biweekly" ? MAX_ROWS : 7;
  const set = <K extends keyof TimeCardState>(k: K, v: TimeCardState[K]) => setInp((p) => ({ ...p, [k]: v }));
  const setRow = (i: number, patch: Partial<TimeRow>) =>
    setInp((p) => ({ ...p, rows: p.rows.map((row, j) => (j === i ? { ...row, ...patch } : row)) }));

  // Copy the first Monday onto every other weekday in the period.
  const copyMonday = () =>
    setInp((p) => ({ ...p, rows: p.rows.map((row, i) => (i > 0 && i < count && i % 7 < 5 ? { ...p.rows[0] } : row)) }));
  // Give every shift a 30-minute unpaid lunch.
  const addLunch = () =>
    setInp((p) => ({ ...p, rows: p.rows.map((row) => (row.in && row.out ? { ...row, breakMin: 30 } : row)) }));
  const clear = () => setInp((p) => ({ ...p, rows: p.rows.map(blankRow) }));

  const calcRef = useCalculatorUse<HTMLDivElement>("timecard");
  return (
    <div ref={calcRef} className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6 print:hidden">
        <h2 className="font-display text-base font-semibold text-ink">Your time card</h2>
        <div className="mt-4 space-y-4">
          <Field label="Pay period">
            <Segmented ariaLabel="Pay period" value={inp.period} onChange={(v) => set("period", v)}
              options={[{ value: "weekly", label: "Weekly" }, { value: "biweekly", label: "Biweekly" }]} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="State" hint="For daily overtime rules.">
              <StateSelect includeFederal value={inp.state?.abbr ?? ""}
                onChange={(abbr) => set("state", abbr ? (getStateByAbbr(abbr) ?? null) : null)} />
            </Field>
            <Field label="Hourly rate ($)" hint="Optional. Adds gross pay.">
              <NumberField value={inp.hourlyRate} min={0} max={10000} step={0.25}
                onChange={(n) => set("hourlyRate", n)} ariaLabel="Hourly rate in dollars" />
            </Field>
          </div>

          <div>
            <div className="grid grid-cols-[2.75rem_1fr_1fr_4.25rem] items-end gap-2 text-[11px] font-medium uppercase tracking-wide text-faint">
              <span /><span>In</span><span>Out</span><span>Break (min)</span>
            </div>
            <div className="mt-1 space-y-1.5">
              {inp.rows.slice(0, count).map((row, i) => (
                <div key={i}>
                  {i === 7 && <div className="mb-1 mt-3 text-xs font-medium text-muted">Week 2</div>}
                  <div className="grid grid-cols-[2.75rem_1fr_1fr_4.25rem] items-center gap-2">
                    <span className="text-sm font-medium text-ink">{DAYS[i % 7]}</span>
                    <input type="time" className={`${inputCls} mt-0 font-mono`} value={row.in}
                      aria-label={`${DAYS[i % 7]} clock in`} onChange={(e) => setRow(i, { in: e.target.value })} />
                    <input type="time" className={`${inputCls} mt-0 font-mono`} value={row.out}
                      aria-label={`${DAYS[i % 7]} clock out`} onChange={(e) => setRow(i, { out: e.target.value })} />
                    <NumberField value={row.breakMin} min={0} max={600} step={5}
                      onChange={(n) => setRow(i, { breakMin: n })} ariaLabel={`${DAYS[i % 7]} unpaid break in minutes`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              <button type="button" onClick={copyMonday} className={linkCls}>Copy Monday to weekdays</button>
              <button type="button" onClick={addLunch} className={linkCls}>Add 30 min lunch to every shift</button>
              <button type="button" onClick={clear} className={linkCls}>Clear</button>
            </div>
            <p className="mt-2 text-xs text-faint">Clock out earlier than clock in? We count it as a shift past midnight.</p>
          </div>
        </div>
      </div>

      <TimeCardResults inp={inp} r={r} count={count} />
    </div>
  );
}

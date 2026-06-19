"use client";

import { useMemo, useState } from "react";
import { computePay } from "@/lib/overtime";
import { dollars } from "@/lib/federal";
import { useCountUp } from "../use-count-up";

// An abstract-but-real diagram of the one rule the whole site turns on: pay is
// flat up to 40 hours, then overtime lights up at 1.5x past the line. Drag the
// week longer and the overtime band grows and glows. Every figure comes from the
// actual computePay engine, at a fixed illustrative rate, so it mirrors the app.
const RATE = 26;
const MAX = 60;
const TICKS = [0, 10, 20, 30, 40, 50, 60];

export default function OvertimeBar() {
  const [hours, setHours] = useState(48);
  const r = useMemo(
    () => computePay({ hourlyRate: RATE, hoursThisWeek: hours, otMultiplier: 1.5, state: null }),
    [hours],
  );
  const gross = useCountUp(r.gross);
  const otPay = useCountUp(r.otPay);

  const regPct = (Math.min(hours, 40) / MAX) * 100;
  const otPct = (Math.max(0, hours - 40) / MAX) * 100;
  const linePct = (40 / MAX) * 100;
  const hasOt = r.otHours > 0;

  return (
    <div>
      {/* The bar */}
      <div className="relative">
        <div className="flex items-end justify-between pb-2 font-mono text-[0.65rem] text-faint">
          {TICKS.map((t) => (
            <span key={t} className={t === 40 ? "font-semibold text-brand-700" : ""}>{t}</span>
          ))}
        </div>

        <div className="relative h-16 overflow-hidden rounded-xl bg-paper ring-1 ring-line">
          {/* regular zone */}
          <div
            className="absolute inset-y-0 left-0 bg-ink/85 transition-[width] duration-500 ease-out"
            style={{ width: `${regPct}%` }}
          />
          {/* overtime zone */}
          <div
            className="absolute inset-y-0 bg-brand-500 transition-[width,left,box-shadow] duration-500 ease-out"
            style={{
              left: `${regPct}%`,
              width: `${otPct}%`,
              boxShadow: hasOt ? "0 0 24px 2px rgba(31,125,96,0.55)" : "none",
            }}
          />
          {/* the 40-hour line */}
          <div className="absolute inset-y-0 w-px bg-gold-500" style={{ left: `${linePct}%` }} aria-hidden />
          <div
            className="absolute top-1.5 -translate-x-1/2 rounded-full bg-gold-500 px-2 py-0.5 font-mono text-[0.6rem] font-semibold text-white"
            style={{ left: `${linePct}%` }}
          >
            40 hrs
          </div>
        </div>

        {/* zone labels */}
        <div className="mt-2 flex text-[0.68rem] font-medium">
          <span style={{ width: `${linePct}%` }} className="text-faint">Regular · paid at {dollars(RATE)}</span>
          <span className={hasOt ? "text-brand-700" : "text-faint/60"}>Overtime · 1.5x = {dollars(r.otRate)}</span>
        </div>
      </div>

      {/* Scrub control */}
      <label className="mt-6 block">
        <span className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Hours worked this week</span>
          <span className="font-mono text-lg font-semibold tabular-nums text-ink">{hours} hrs</span>
        </span>
        <input
          type="range"
          min={35}
          max={MAX}
          step={1}
          value={hours}
          aria-label="Hours worked this week"
          onChange={(e) => setHours(Number(e.target.value))}
          className="range-brass mt-3 w-full"
        />
      </label>

      {/* Live tally */}
      <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line text-center">
        <Cell label="Regular hours" value={`${r.regularHours}`} />
        <Cell label="Overtime hours" value={`${r.otHours}`} accent={hasOt} />
        <Cell label="Gross pay" value={dollars(gross)} strong sub={hasOt ? `incl. ${dollars(otPay)} OT` : "no overtime"} />
      </dl>
    </div>
  );
}

function Cell({ label, value, sub, accent, strong }: { label: string; value: string; sub?: string; accent?: boolean; strong?: boolean }) {
  return (
    <div className="bg-card px-3 py-3">
      <div className="text-[0.62rem] font-medium uppercase tracking-wider text-faint">{label}</div>
      <div className={`mt-0.5 font-mono tabular-nums ${strong ? "text-lg font-semibold text-ink" : accent ? "text-base font-semibold text-brand-700" : "text-base text-ink"}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[0.62rem] text-faint">{sub}</div>}
    </div>
  );
}

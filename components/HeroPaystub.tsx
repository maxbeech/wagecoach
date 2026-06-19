"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { computePay } from "@/lib/overtime";
import { dollars } from "@/lib/federal";
import { useCountUp } from "./use-count-up";

// The hero illustration: a live, draggable paystub. It is an abstract take on
// the real result panel and uses the actual overtime engine, so every figure a
// visitor sees is genuine, not mocked. Drag either slider and it recomputes.
export default function HeroPaystub() {
  const [rate, setRate] = useState(24);
  const [hours, setHours] = useState(47);
  const r = useMemo(() => computePay({ hourlyRate: rate, hoursThisWeek: hours, otMultiplier: 1.5, state: null }), [rate, hours]);
  const gross = useCountUp(r.gross);

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2rem] bg-brand-100/40 blur-2xl" />
      <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-float">
        {/* Statement header */}
        <div className="flex items-center justify-between border-b border-line px-6 pt-5 pb-4">
          <div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint">Pay statement</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-16 rounded bg-line" />
              <span className="h-2 w-10 rounded bg-line/70" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[0.7rem] font-medium text-brand-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            Live
          </span>
        </div>

        {/* Itemised lines */}
        <div className="px-6 py-5">
          <Line label="Regular" detail={`${trim(r.regularHours)} hrs × ${dollars(r.regularRate)}`} amount={dollars(r.regularPay)} />
          {r.otHours > 0 ? (
            <Line label="Overtime 1.5×" detail={`${trim(r.otHours)} hrs × ${dollars(r.otRate)}`} amount={dollars(r.otPay)} accent />
          ) : (
            <div className="flex items-center py-2 text-sm text-faint">No overtime under 40 hours this week</div>
          )}

          {/* perforation */}
          <div aria-hidden className="my-3 border-t border-dashed border-line" />

          <div className="overflow-hidden rounded-xl bg-forest px-5 py-4 text-white">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[0.7rem] uppercase tracking-wider text-white/55">Gross this week</div>
                <div className="font-mono text-3xl font-semibold tabular-nums sm:text-[2.1rem]">{dollars(gross)}</div>
              </div>
              <div className="mb-1 text-right text-[0.7rem] leading-tight text-white/55">
                before taxes<br />Federal FLSA
              </div>
            </div>
          </div>
        </div>

        {/* Drag controls */}
        <div className="space-y-4 border-t border-line bg-brand-50/30 px-6 py-5">
          <Slider label="Hourly rate" value={rate} min={12} max={60} step={1} display={`${dollars(rate)}/hr`} onChange={setRate} />
          <Slider label="Hours this week" value={hours} min={35} max={60} step={0.5} display={`${trim(hours)} hrs`} onChange={setHours} />
          <Link href="/calculators/overtime-calculator" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:gap-2 transition-all">
            Open the full calculator
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Line({ label, detail, amount, accent }: { label: string; detail: string; amount: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline py-2 text-sm">
      <span className={`shrink-0 font-medium ${accent ? "text-brand-700" : "text-ink"}`}>{label}</span>
      <span className="ml-2 shrink-0 text-xs text-faint">{detail}</span>
      <span className="leader" />
      <span className="shrink-0 font-mono tabular-nums text-ink">{amount}</span>
    </div>
  );
}

function Slider({ label, value, min, max, step, display, onChange }:
  { label: string; value: number; min: number; max: number; step: number; display: string; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono font-semibold tabular-nums text-ink">{display}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-brand-600" />
    </label>
  );
}

// Trim a possibly-fractional hour count to a clean label (47 not 47.0, 4.5 kept).
function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

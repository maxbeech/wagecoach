"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STATES, effectiveMinWage } from "@/lib/states";
import { dollars } from "@/lib/federal";

// The 2026 minimum-wage spectrum, on dark. Every state is a tick plotted by its
// real effective minimum wage between the $7.25 federal floor and the top rate.
// Pick a tick (or the select, for touch/keyboard) to pull up that state's live
// rate sheet. Pure real data from lib/states — no mock numbers.
const sorted = [...STATES].sort((a, b) => effectiveMinWage(a) - effectiveMinWage(b));
const lo = effectiveMinWage(sorted[0]);
const hi = effectiveMinWage(sorted[sorted.length - 1]);
const QUICK = ["DC", "CA", "NY", "TX"]; // highest, big-state daily-OT, region-set, federal floor

export default function WageSpectrum() {
  const [abbr, setAbbr] = useState("CA");
  const sel = useMemo(() => STATES.find((s) => s.abbr === abbr) ?? STATES[0], [abbr]);
  const pos = (w: number) => ((w - lo) / (hi - lo)) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      {/* Spectrum */}
      <div>
        <div className="flex items-baseline justify-between font-mono text-xs text-white/70">
          <span>{dollars(lo)} federal floor</span>
          <span>{dollars(hi)} top rate</span>
        </div>

        <div className="relative mt-4 h-24">
          {/* axis */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
          {sorted.map((s) => {
            const active = s.abbr === sel.abbr;
            return (
              <button
                key={s.abbr}
                type="button"
                onClick={() => setAbbr(s.abbr)}
                aria-label={`${s.name}, ${dollars(effectiveMinWage(s))} per hour`}
                aria-pressed={active}
                className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 px-1 py-3"
                style={{ left: `${pos(effectiveMinWage(s))}%` }}
              >
                <span
                  className={`block w-px transition-all duration-200 ${
                    active ? "h-12 bg-gold-500" : "h-6 bg-white/30 group-hover:h-9 group-hover:bg-white/70"
                  }`}
                />
              </button>
            );
          })}
          {/* selected pin */}
          <div
            className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-gold-500 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-white shadow-float transition-[left] duration-300"
            style={{ left: `${pos(effectiveMinWage(sel))}%` }}
          >
            {sel.abbr} · {dollars(effectiveMinWage(sel))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-white/65">Jump to</span>
          {QUICK.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAbbr(a)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                sel.abbr === a ? "bg-white text-forest" : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {STATES.find((s) => s.abbr === a)?.name ?? a}
            </button>
          ))}
          <label className="ml-auto">
            <span className="sr-only">Choose a state</span>
            <select
              value={abbr}
              onChange={(e) => setAbbr(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-sm text-white outline-none focus:border-white/50 [&>option]:text-ink"
            >
              {STATES.map((s) => (
                <option key={s.abbr} value={s.abbr}>{s.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Live rate sheet */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-5">
        <div className="font-display text-lg font-semibold text-white">{sel.name}</div>
        <div className="mt-1 font-mono text-4xl font-semibold tabular-nums text-white">{dollars(effectiveMinWage(sel))}<span className="text-lg text-white/65">/hr</span></div>
        <dl className="mt-4 space-y-2.5 text-sm">
          <SheetRow label="Overtime" value={sel.dailyOt ? `Daily, over ${sel.dailyOt.afterHours} hrs` : "Weekly, over 40 hrs"} />
          <SheetRow label="Tip credit" value={sel.tipCreditAllowed ? "Allowed" : "Not allowed"} />
          <SheetRow label="Tipped cash wage" value={sel.tippedCashWage === null ? "Set by state" : `${dollars(sel.tippedCashWage)}/hr`} />
          <SheetRow label="Final paycheck" value={sel.finalPayFired} />
        </dl>
        <Link href={`/states/${sel.slug}`} className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-forest transition hover:bg-brand-50">
          {sel.name} labor law
        </Link>
      </div>
    </div>
  );
}

function SheetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-white/10 pb-2.5">
      <dt className="shrink-0 text-white/70">{label}</dt>
      <span className="leader !border-white/15" />
      <dd className="shrink-0 text-right font-medium text-white">{value}</dd>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { dollars } from "@/lib/federal";
import { CLAIM_LABELS, type BackPayInputs, type BackPayResult } from "@/lib/backpay";
import { scoreCase, type ScoreTone } from "@/lib/case-score";
import { encodeBackPay } from "@/lib/backpay-url";
import CheckoutButton from "./CheckoutButton";
import { useCountUp } from "./use-count-up";

const TONE: Record<ScoreTone, { bar: string; text: string }> = {
  strong: { bar: "bg-brand-600", text: "text-brand-700" },
  moderate: { bar: "bg-brand-500", text: "text-brand-700" },
  look: { bar: "bg-gold-500", text: "text-gold-700" },
  limited: { bar: "bg-faint", text: "text-faint" },
  none: { bar: "bg-faint", text: "text-faint" },
};

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline py-2 text-sm ${strong ? "font-semibold text-ink" : "text-muted"}`}>
      <span className="shrink-0">{label}</span>
      <span className="leader" />
      <span className="shrink-0 font-mono tabular-nums text-ink">{value}</span>
    </div>
  );
}

export default function BackPayResults({ inp, r }: { inp: BackPayInputs; r: BackPayResult }) {
  const [copied, setCopied] = useState(false);
  const total = useCountUp(r.backPay);
  const score = scoreCase(inp, r);
  const tone = TONE[score.tone];
  const owed = r.weeklyShortfall > 0;

  // Carry the estimate into the free attorney review and the kit, so the next
  // step starts pre-filled from the figures the person already entered.
  const reviewHref = `/free-case-review?${encodeBackPay(inp)}&amt=${Math.round(r.backPay)}`;

  const share = async () => {
    try {
      window.history.replaceState(null, "", `${window.location.pathname}?${encodeBackPay(inp)}`);
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">{CLAIM_LABELS[inp.claimType]} estimate</h2>

      <div className="mt-4 overflow-hidden rounded-xl bg-forest">
        <div className="h-0.5 w-full bg-gold-500/70" />
        <div className="px-5 py-4 text-white">
          <div className="text-xs uppercase tracking-wider text-white/55">
            {owed ? "You may be owed about" : "Estimated unpaid wages"}
          </div>
          <div className="font-mono text-[2.1rem] font-semibold leading-tight tabular-nums">{dollars(total)}</div>
          <div className="mt-0.5 text-xs text-white/55">
            {owed
              ? `in unpaid wages over ${r.recoverableWeeks} week${r.recoverableWeeks === 1 ? "" : "s"} — up to ${dollars(r.totalPotential)} with liquidated damages`
              : "from the figures entered, you were paid at or above what these rules require"}
          </div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-line">
        <Row label="Correct pay (typical week)" value={dollars(r.owedWeekly)} />
        <Row label="What you were paid" value={dollars(r.paidWeekly)} />
        <Row label="Unpaid per week" value={dollars(r.weeklyShortfall)} />
        <Row label={`Recoverable weeks (${r.lookbackYears}-yr window)`} value={String(r.recoverableWeeks)} />
        <Row label="Estimated back pay" value={dollars(r.backPay)} strong />
        {owed && <Row label="Possible liquidated damages" value={dollars(r.liquidatedDamages)} />}
      </div>

      {owed && (
        <>
          {/* Case-strength triage signal. */}
          <div className="mt-4 rounded-xl border border-line bg-paper/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-faint">Case-strength signal</span>
              <span className={`text-sm font-semibold ${tone.text}`}>{score.band}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${score.score}%` }} />
            </div>
            <ul className="mt-3 space-y-1.5">
              {score.factors.map((f, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted">
                  <span aria-hidden className={f.positive ? "text-brand-600" : "text-faint"}>{f.positive ? "▲" : "–"}</span>
                  <span><span className="font-medium text-ink">{f.label}.</span> {f.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-col gap-2.5 print:hidden">
            <Link href={reviewHref}
              className="rounded-full bg-forest px-5 py-3 text-center font-semibold text-white shadow-card transition hover:bg-brand-800">
              Get a free case review from a wage attorney
            </Link>
            <CheckoutButton product="kit" label="Build my Claim Kit — $29"
              className="rounded-full border border-brand-300 bg-card px-5 py-3 text-center font-semibold text-brand-700 transition hover:bg-brand-50" />
            <p className="text-xs leading-relaxed text-faint">
              The Claim Kit is a printable demand letter pre-filled with your figures, your state&apos;s filing route,
              and a step-by-step complaint guide. The case review is free and carries no obligation.
            </p>
          </div>
        </>
      )}

      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        <button onClick={() => window.print()} className="rounded-lg border border-line bg-card px-3.5 py-2 text-sm font-medium text-ink transition hover:border-brand-300 hover:bg-brand-50">Print / Save PDF</button>
        <button onClick={share} className="rounded-lg border border-line bg-card px-3.5 py-2 text-sm font-medium text-ink transition hover:border-brand-300 hover:bg-brand-50">{copied ? "Case link copied ✓" : "Save / share case"}</button>
        <span role="status" aria-live="polite" className="sr-only">{copied ? "Case link copied to clipboard" : ""}</span>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-faint">
        This is an estimate from the figures you entered, not legal advice or a guarantee of recovery. Wage law has
        local exceptions and strict deadlines — confirm with your state labor department or an employment attorney.
      </p>
    </div>
  );
}

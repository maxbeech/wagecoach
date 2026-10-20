import Link from "next/link";
import { dollars, qty } from "@/lib/federal";
import { DEFAULT_BACKPAY } from "@/lib/backpay";
import { encodeBackPay } from "@/lib/backpay-url";
import { fmtHm, type TimeCardResult } from "@/lib/timecard";
import type { TimeCardState } from "@/lib/timecard-url";

function Row({ label, hours, strong }: { label: string; hours: number; strong?: boolean }) {
  return (
    <div className={`flex items-baseline py-2 text-sm ${strong ? "font-semibold text-ink" : "text-muted"}`}>
      <span className="shrink-0">{label}</span>
      <span className="leader" />
      <span className="shrink-0 font-mono tabular-nums text-ink">{fmtHm(hours * 60)} <span className="text-faint">({qty(hours)})</span></span>
    </div>
  );
}

export default function TimeCardResults({ inp, r, count }: { inp: TimeCardState; r: TimeCardResult; count: number }) {
  const worked = r.weeks.filter((w) => w.minutes > 0);
  // Back-pay handoff: average hours of the weeks actually worked, at the entered rate.
  const avg = worked.length ? Math.round((r.hours / worked.length) * 100) / 100 : 0;
  const backPayHref = `/calculators/back-pay-calculator?${encodeBackPay({
    ...DEFAULT_BACKPAY,
    hoursPerWeek: avg,
    hourlyRate: inp.hourlyRate > 0 ? inp.hourlyRate : DEFAULT_BACKPAY.hourlyRate,
    paidWeekly: inp.hourlyRate > 0 ? Math.round(inp.hourlyRate * avg * 100) / 100 : DEFAULT_BACKPAY.paidWeekly,
    state: inp.state,
  })}`;

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">
        {inp.period === "biweekly" ? "Your pay period" : "Your week"}
      </h2>

      <div className="mt-4 overflow-hidden rounded-xl bg-forest">
        <div className="h-0.5 w-full bg-gold-500/70" />
        <div className="px-5 py-4 text-white">
          <div className="text-xs uppercase tracking-wider text-white/55">Total hours</div>
          <div className="font-mono text-[2.1rem] font-semibold leading-tight tabular-nums">{r.hm}</div>
          <div className="mt-0.5 font-mono text-xs text-white/55">{qty(r.hours)} decimal hours</div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-line">
        <Row label="Regular" hours={r.regular} />
        {r.ot > 0 && <Row label="Overtime (1.5×)" hours={r.ot} />}
        {r.double > 0 && <Row label="Double time (2×)" hours={r.double} />}
        {r.gross !== null && (
          <div className="flex items-baseline py-2 text-sm font-semibold text-ink">
            <span>Gross pay</span><span className="leader" />
            <span className="font-mono tabular-nums">{dollars(r.gross)}</span>
          </div>
        )}
      </div>

      {inp.period === "biweekly" && (
        <div className="mt-4 rounded-lg border border-line bg-brand-50/40 p-3 text-xs text-muted">
          {r.weeks.map((w, i) => (
            <div key={i} className="flex justify-between py-0.5">
              <span>Week {i + 1}: {w.hm} ({qty(w.hours)}){w.ot + w.double > 0 ? `, ${qty(w.ot + w.double)} overtime` : ""}</span>
              {w.gross !== null && <span className="font-mono tabular-nums">{dollars(w.gross)}</span>}
            </div>
          ))}
        </div>
      )}

      <ul className="mt-4 grid grid-cols-7 gap-1 text-center">
        {r.days.slice(0, count).map((d, i) => (
          <li key={i} className="rounded-md bg-brand-50/40 py-1 font-mono text-[11px] tabular-nums text-muted">{d.minutes ? d.hm : "-"}</li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-faint">
        {(worked[0] ?? r.weeks[0]).rule} General information, not legal advice.
      </p>

      {worked.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          Think your paycheck came up short?{" "}
          <Link href={backPayHref} className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600">
            Check your back pay
          </Link>
        </p>
      )}
    </div>
  );
}

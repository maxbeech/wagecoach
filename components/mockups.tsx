import { dollars } from "@/lib/federal";
import { getStateByAbbr } from "@/lib/states";
import { SCHEDULED_CHANGES } from "@/lib/wage-schedule-data";
import { changeKey, daysUntil, todayIso } from "@/lib/wage-schedule";
import { formatDate } from "@/lib/watch-email";

// A thumbnail of a Wage Watch alert email, built from the real cited schedule (the
// next few announced changes), so the employer CTA shows the actual product.
const alertRows = SCHEDULED_CHANGES
  .filter((c) => c.field === "minWage" && c.scope === "state")
  .filter((c) => daysUntil(c.effective, todayIso()) >= 0)
  .sort((a, b) => a.effective.localeCompare(b.effective))
  .slice(0, 3);

export function MockAlert() {
  return (
    <div className="rounded-xl bg-card p-4 text-ink shadow-float">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="font-display text-sm font-semibold">Minimum wage changes ahead</span>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-faint">Wage Watch</span>
      </div>
      <div className="mt-1 grid grid-cols-[1fr_auto_auto] gap-x-3 text-[0.72rem]">
        <div className="py-1.5 font-medium uppercase tracking-wide text-faint">Where</div>
        <div className="py-1.5 text-right font-medium uppercase tracking-wide text-faint">New rate</div>
        <div className="py-1.5 text-right font-medium uppercase tracking-wide text-faint">From</div>
        {alertRows.map((c) => (
          <div key={changeKey(c)} className="contents">
            <div className="border-t border-line py-1.5 text-ink">{getStateByAbbr(c.key)?.name ?? c.key}</div>
            <div className="border-t border-line py-1.5 text-right font-mono tabular-nums text-ink">{dollars(c.value)}</div>
            <div className="border-t border-line py-1.5 text-right text-muted">{formatDate(c.effective).replace(/, \d{4}$/, "")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

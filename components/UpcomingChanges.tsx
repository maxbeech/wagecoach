import { changeLocationKey, daysUntil, type ScheduledChange } from "@/lib/wage-schedule";
import { resolveLocation } from "@/lib/locations";
import { formatDate } from "@/lib/watch-email";

// A dated list of announced wage changes, each with its source. Server-rendered
// from lib/wage-schedule-data.ts; shows an explicit empty state rather than nothing.

export default function UpcomingChanges({ changes, today, empty = "No announced changes yet." }: { changes: ScheduledChange[]; today: string; empty?: string }) {
  if (!changes.length) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card shadow-card">
      {changes.map((c) => {
        const where = resolveLocation(changeLocationKey(c))?.label ?? c.key;
        const d = daysUntil(c.effective, today);
        return (
          <li key={`${c.scope}:${c.key}:${c.field}:${c.effective}`} className="flex items-start justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <div className="text-sm font-medium text-ink">{where}</div>
              <div className="mt-0.5 text-xs text-muted">
                {c.field === "tippedCashWage" ? "Tipped cash wage" : "Minimum wage"} · {formatDate(c.effective)}
                {c.note ? ` · ${c.note}` : ""} · <a href={c.source} rel="nofollow noopener" target="_blank" className="underline decoration-line underline-offset-2 hover:text-ink">source</a>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-sm font-semibold tabular-nums text-ink">${c.value.toFixed(2)}</div>
              <div className="text-[0.7rem] text-faint">{d === 0 ? "today" : d > 0 ? `in ${d} day${d === 1 ? "" : "s"}` : "in effect"}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import { dollars } from "@/lib/federal";
import { STATES, effectiveMinWage } from "@/lib/states";

// A thumbnail of the Pro multi-state report: a few real states, ruled like the
// printable deliverable, so the CTA sells the artifact rather than a feature
// list. Every figure comes from the live state dataset, not a mock.
const reportStates = ["California", "Texas", "New York"]
  .map((n) => STATES.find((s) => s.name === n))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

export function MockReport() {
  return (
    <div className="rounded-xl bg-card p-4 text-ink shadow-float">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="font-display text-sm font-semibold">Multi-state wage report</span>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-faint">2026</span>
      </div>
      <div className="mt-1 grid grid-cols-[1fr_auto_auto] gap-x-3 text-[0.72rem]">
        <div className="py-1.5 font-medium uppercase tracking-wide text-faint">State</div>
        <div className="py-1.5 text-right font-medium uppercase tracking-wide text-faint">Min</div>
        <div className="py-1.5 text-right font-medium uppercase tracking-wide text-faint">Overtime</div>
        {reportStates.map((s) => (
          <div key={s.abbr} className="contents">
            <div className="border-t border-line py-1.5 text-ink">{s.name}</div>
            <div className="border-t border-line py-1.5 text-right font-mono tabular-nums text-ink">{dollars(effectiveMinWage(s)).replace(".00", "")}</div>
            <div className="border-t border-line py-1.5 text-right text-muted">{s.dailyOt ? "Daily" : "Weekly"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

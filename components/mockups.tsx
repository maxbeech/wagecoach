import { computePay } from "@/lib/overtime";
import { tipCredit } from "@/lib/wage";
import { dollars } from "@/lib/federal";
import { STATES, effectiveMinWage } from "@/lib/states";

// Abstract-but-real preview tiles of each tool, shown in the "what's inside"
// section. Every number is produced by the live engine or the real state data,
// so these mirror the actual product instead of faking a screenshot.

const pay = computePay({ hourlyRate: 22, hoursThisWeek: 46, otMultiplier: 1.5, state: null });
const tip = tipCredit({ cashWage: 2.13, hours: 30, tips: 288, state: null });
const topStates = [...STATES].sort((a, b) => effectiveMinWage(b) - effectiveMinWage(a)).slice(0, 4);

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-line bg-paper/60 p-3.5 text-[0.78rem]">{children}</div>;
}

export function MockPaystub() {
  return (
    <Frame>
      <div className="flex items-baseline justify-between text-muted">
        <span>Regular</span>
        <span className="font-mono tabular-nums text-ink">{dollars(pay.regularPay)}</span>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between text-brand-700">
        <span>Overtime 1.5×</span>
        <span className="font-mono tabular-nums">{dollars(pay.otPay)}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-lg bg-forest px-3 py-2 text-white">
        <span className="text-[0.7rem] uppercase tracking-wide text-white/55">Gross</span>
        <span className="font-mono text-base font-semibold tabular-nums">{dollars(pay.gross)}</span>
      </div>
    </Frame>
  );
}

export function MockStateTable() {
  return (
    <Frame>
      <div className="flex justify-between pb-1.5 text-[0.66rem] uppercase tracking-wide text-faint">
        <span>State</span><span>2026 minimum</span>
      </div>
      <div className="divide-y divide-line">
        {topStates.map((s) => (
          <div key={s.abbr} className="flex items-center justify-between py-1.5">
            <span className="text-muted">{s.name}</span>
            <span className="font-mono tabular-nums text-ink">{dollars(effectiveMinWage(s))}/hr</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function MockTipped() {
  return (
    <Frame>
      <div className={`rounded-lg px-3 py-2.5 text-white ${tip.meetsMinimum ? "bg-brand-600" : "bg-forest"}`}>
        <div className="text-[0.7rem] uppercase tracking-wide text-white/90">Effective hourly</div>
        <div className="font-mono text-lg font-semibold tabular-nums">{dollars(tip.effectiveHourly)}</div>
      </div>
      <div className="mt-2 flex items-center justify-between text-muted">
        <span>Cash {dollars(2.13)} + tips</span>
        <span className={tip.meetsMinimum ? "font-medium text-brand-700" : "font-medium text-rose-700"}>
          {tip.meetsMinimum ? "Meets minimum" : "Below minimum"}
        </span>
      </div>
    </Frame>
  );
}

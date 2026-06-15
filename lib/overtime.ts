import { FEDERAL, cents } from "./federal";
import { effectiveMinWage, type StateLaw } from "./states";

// Overtime / time-and-a-half pay engine.
//
// FLSA (29 USC 207): overtime is 1.5× the regular rate for hours over 40 in a
// workweek. There is no federal DAILY overtime — but several states require it,
// and California also has double time and a 7th-consecutive-day rule. When the
// user enters hours-per-day for a daily-OT state, we compute the precise daily
// result; otherwise we apply the universal weekly rule.

export interface PayInputs {
  hourlyRate: number;
  hoursThisWeek: number; // total hours worked in the workweek (weekly mode)
  dailyHours?: number[]; // optional per-day hours (enables daily OT / 7th day)
  otMultiplier: number; // 1.5 standard; 2 for "double time"/holiday presets
  state: StateLaw | null; // null = federal-only
}

export interface PayBreakdown {
  regularHours: number;
  otHours: number;
  doubleHours: number;
  regularRate: number;
  otRate: number;
  doubleRate: number;
  regularPay: number;
  otPay: number;
  doublePay: number;
  gross: number;
  dailyApplied: boolean;
  rule: string;
}

export const DEFAULT_PAY: PayInputs = {
  hourlyRate: 20,
  hoursThisWeek: 45,
  otMultiplier: 1.5,
  state: null,
};

// Should this state apply daily overtime for an employee at this pay rate?
function dailyThresholds(state: StateLaw, rate: number) {
  if (!state.dailyOt) return null;
  // Nevada: daily OT only for employees earning less than 1.5× the minimum wage.
  if (state.abbr === "NV" && rate >= 1.5 * effectiveMinWage(state)) return null;
  return {
    otAfter: state.dailyOt.afterHours,
    dtAfter: state.doubleTime ? 12 : Infinity, // only CA has explicit double time
    seventhDay: Boolean(state.doubleTime), // CA 7th-consecutive-day rule
  };
}

function computeDaily(inp: PayInputs, state: StateLaw): PayBreakdown {
  const rate = inp.hourlyRate;
  const th = dailyThresholds(state, rate)!;
  const days = inp.dailyHours!.filter((h) => h > 0);
  const allSevenWorked = inp.dailyHours!.length >= 7 && inp.dailyHours!.slice(0, 7).every((h) => h > 0);

  let reg = 0, ot = 0, dt = 0;
  inp.dailyHours!.forEach((h, i) => {
    if (h <= 0) return;
    if (th.seventhDay && allSevenWorked && i === 6) {
      // CA 7th consecutive day: first 8 hrs at 1.5×, beyond 8 at 2×.
      ot += Math.min(h, 8);
      dt += Math.max(0, h - 8);
      return;
    }
    reg += Math.min(h, th.otAfter);
    if (h > th.dtAfter) {
      ot += th.dtAfter - th.otAfter;
      dt += h - th.dtAfter;
    } else if (h > th.otAfter) {
      ot += h - th.otAfter;
    }
  });

  // Weekly reconciliation: regular hours beyond 40 become weekly OT (no pyramiding —
  // hours already paid as daily OT/DT are not recounted).
  if (reg > FEDERAL.weeklyOtThreshold) {
    ot += reg - FEDERAL.weeklyOtThreshold;
    reg = FEDERAL.weeklyOtThreshold;
  }

  return finish(reg, ot, dt, rate, 1.5, true,
    `${state.name} daily overtime: ${state.dailyOt!.note}${state.doubleTime ? " " + state.doubleTime : ""} (${days.length} day${days.length === 1 ? "" : "s"} worked).`);
}

function computeWeekly(inp: PayInputs, state: StateLaw | null): PayBreakdown {
  const h = inp.hoursThisWeek;
  const reg = Math.min(h, FEDERAL.weeklyOtThreshold);
  const ot = Math.max(0, h - FEDERAL.weeklyOtThreshold);
  const name = state ? state.name : "Federal";
  const mult = inp.otMultiplier;
  const label = mult >= 2 ? "double time (2×)" : mult > 1 ? `${mult}× the regular rate` : "the regular rate";
  return finish(reg, ot, 0, inp.hourlyRate, mult, false,
    `${name} follows the FLSA weekly rule: ${label} for hours over 40 in a workweek.`);
}

function finish(reg: number, ot: number, dt: number, rate: number, otMult: number, daily: boolean, rule: string): PayBreakdown {
  const otRate = rate * otMult;
  const doubleRate = rate * 2;
  const regularPay = cents(reg * rate);
  const otPay = cents(ot * otRate);
  const doublePay = cents(dt * doubleRate);
  return {
    regularHours: reg, otHours: ot, doubleHours: dt,
    regularRate: cents(rate), otRate: cents(otRate), doubleRate: cents(doubleRate),
    regularPay, otPay, doublePay,
    gross: cents(regularPay + otPay + doublePay),
    dailyApplied: daily, rule,
  };
}

// Clamp to a sane range; non-finite (NaN/Infinity) collapses to the low bound.
// Makes the engine bulletproof against bad input from any source (URL, API, fuzz).
const clamp = (n: number, lo: number, hi: number) =>
  Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;

export function computePay(inp: PayInputs): PayBreakdown {
  const rate = clamp(inp.hourlyRate, 0, 100000);
  const dailyHours = Array.isArray(inp.dailyHours)
    ? inp.dailyHours.map((h) => clamp(h, 0, 24))
    : undefined;
  const clean: PayInputs = {
    ...inp,
    hourlyRate: rate,
    hoursThisWeek: clamp(inp.hoursThisWeek, 0, 168),
    dailyHours,
  };
  const useDaily =
    clean.state &&
    clean.state.dailyOt &&
    dailyHours &&
    dailyHours.some((h) => h > 0) &&
    dailyThresholds(clean.state, rate) !== null;
  return useDaily ? computeDaily(clean, clean.state!) : computeWeekly(clean, clean.state);
}

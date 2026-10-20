import { cents } from "./federal";
import { computePay } from "./overtime";
import type { StateLaw } from "./states";

// Time card engine: clock-in / clock-out / unpaid break per day -> hours, then
// regular / overtime / double time. The overtime rules are NOT re-implemented
// here: each workweek's daily hours are handed to computePay (lib/overtime.ts),
// so state daily OT (CA, AK, NV, CO) and CA double time stay in one place.

export const MAX_ROWS = 14;
export type Period = "weekly" | "biweekly";

export interface TimeRow {
  in: string; // "HH:MM" (24h) or "9:00 am"
  out: string;
  breakMin: number; // unpaid break, minutes
}

export interface TimeCardInputs {
  rows: TimeRow[]; // row i is day i of the pay period (Mon first); max 14
  period: Period;
  hourlyRate: number; // 0 = not given
  state: StateLaw | null;
}

export interface Hours {
  minutes: number;
  hours: number; // decimal, 2 places
  hm: string; // "8:30"
}

export interface WeekResult extends Hours {
  regular: number;
  ot: number;
  double: number;
  gross: number | null;
  daysWorked: number;
  rule: string;
}

export interface TimeCardResult extends Hours {
  days: Hours[];
  weeks: WeekResult[];
  regular: number;
  ot: number;
  double: number;
  gross: number | null; // null when no rate was given
}

const clamp = (n: number, lo: number, hi: number) =>
  Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;

// "17:30", "5:30pm", "5 pm", "0900" -> minutes since midnight, or null if invalid.
export function parseTime(s: unknown): number | null {
  if (typeof s !== "string") return null;
  const m = /^\s*(\d{1,2})(?::?(\d{2}))?\s*([ap])?\.?m?\.?\s*$/i.exec(s);
  if (!m) return null;
  let h = Number(m[1]);
  const min = m[2] === undefined ? 0 : Number(m[2]);
  if (min > 59) return null;
  if (m[3]) {
    if (h < 1 || h > 12) return null;
    h = (h % 12) + (m[3].toLowerCase() === "p" ? 12 : 0);
  } else if (h > 23) return null;
  return h * 60 + min;
}

// Paid minutes for one row. Out earlier than in rolls past midnight; equal
// times, unparseable times or a break that eats the shift all give 0 (skipped).
export function shiftMinutes(row: TimeRow): number {
  if (!row) return 0;
  const a = parseTime(row.in);
  const b = parseTime(row.out);
  if (a === null || b === null || a === b) return 0;
  const span = b > a ? b - a : b + 1440 - a;
  return Math.max(0, span - Math.round(clamp(row.breakMin, 0, 1440)));
}

export function fmtHm(minutes: number): string {
  const m = Math.max(0, Math.round(Number.isFinite(minutes) ? minutes : 0));
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}

const toHours = (minutes: number): Hours => ({
  minutes, hours: cents(minutes / 60), hm: fmtHm(minutes),
});

export function computeTimeCard(inp: TimeCardInputs): TimeCardResult {
  const weekCount = inp.period === "biweekly" ? 2 : 1;
  const rows = Array.isArray(inp.rows) ? inp.rows.slice(0, MAX_ROWS) : [];
  const rate = clamp(inp.hourlyRate, 0, 100000);
  const mins = Array.from({ length: weekCount * 7 }, (_, i) => shiftMinutes(rows[i]));

  const weeks: WeekResult[] = [];
  for (let w = 0; w < weekCount; w++) {
    const wk = mins.slice(w * 7, w * 7 + 7);
    const minutes = wk.reduce((a, b) => a + b, 0);
    const pay = computePay({
      hourlyRate: rate, hoursThisWeek: minutes / 60, dailyHours: wk.map((m) => m / 60),
      otMultiplier: 1.5, state: inp.state,
    });
    weeks.push({
      ...toHours(minutes),
      regular: pay.regularHours, ot: pay.otHours, double: pay.doubleHours,
      gross: rate > 0 ? pay.gross : null,
      daysWorked: wk.filter((m) => m > 0).length,
      rule: pay.rule,
    });
  }

  const sum = (f: (w: WeekResult) => number) => weeks.reduce((a, w) => a + f(w), 0);
  return {
    ...toHours(sum((w) => w.minutes)),
    days: mins.map(toHours),
    weeks,
    regular: sum((w) => w.regular),
    ot: sum((w) => w.ot),
    double: sum((w) => w.double),
    gross: rate > 0 ? cents(sum((w) => w.gross ?? 0)) : null,
  };
}

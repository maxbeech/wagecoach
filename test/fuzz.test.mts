import { computePay, type PayInputs } from "../lib/overtime.ts";
import { computeSalary } from "../lib/salary.ts";
import { STATES } from "../lib/states.ts";
import { ok, report } from "./_assert.mts";

// Sweep every state × a range of rates, hours and daily patterns and assert the
// engine invariants hold — no NaN/Infinity, no negative pay, totals reconcile.
const rates = [0, 7.25, 12, 20, 50, 1000, -5, NaN];
const hoursList = [0, 39.5, 40, 40.5, 60, 80, 168, NaN];
const dailyPatterns = [
  undefined,
  [10, 10, 10, 10, 0, 0, 0],
  [8, 8, 8, 8, 8, 8, 8],
  [14, 0, 0, 0, 0, 0, 0],
  [13, 13, 13, 0, 0, 0, 0],
];
const mults = [1.5, 2];

const finite = (n: number) => Number.isFinite(n);
let cases = 0;

for (const state of [null, ...STATES]) {
  for (const rate of rates) {
    for (const hours of hoursList) {
      for (const mult of mults) {
        for (const dh of dailyPatterns) {
          cases++;
          const inp: PayInputs = { hourlyRate: rate, hoursThisWeek: hours, otMultiplier: mult, state, dailyHours: dh };
          const r = computePay(inp);
          const tag = `${state?.abbr ?? "FED"} rate=${rate} hrs=${hours} mult=${mult} daily=${dh ? "y" : "n"}`;
          const all = [r.regularHours, r.otHours, r.doubleHours, r.regularPay, r.otPay, r.doublePay, r.gross, r.otRate];
          if (!all.every(finite)) { ok(false, `[${tag}] non-finite output`); continue; }
          ok(r.gross >= 0, `[${tag}] gross non-negative`);
          ok(r.regularPay >= 0 && r.otPay >= 0 && r.doublePay >= 0, `[${tag}] no negative components`);
          ok(Math.abs(r.gross - (r.regularPay + r.otPay + r.doublePay)) < 0.02, `[${tag}] gross == sum of parts`);
          ok(r.regularHours <= 40.0001, `[${tag}] regular hours never exceed 40`);
          if (finite(rate) && rate > 0) ok(r.otRate >= r.regularRate - 1e-9, `[${tag}] OT rate >= regular rate`);
        }
      }
    }
  }
}

// Salary converter fuzz
for (const amt of [0, 25, 60000, 1e7, -100, NaN]) {
  for (const hpw of [0, 40, 168]) {
    for (const wpy of [0, 1, 52, 53]) {
      for (const mode of ["salaryToHourly", "hourlyToSalary"] as const) {
        const s = computeSalary({ mode, amount: amt, hoursPerWeek: hpw, weeksPerYear: wpy });
        const fin = [s.hourly, s.weekly, s.biweekly, s.monthly, s.annual].every(finite);
        ok(fin, `salary[${mode} amt=${amt} hpw=${hpw} wpy=${wpy}] all finite`);
        ok(s.annual >= 0 && s.hourly >= 0, `salary[${mode} amt=${amt}] non-negative`);
      }
    }
  }
}

console.log(`(fuzz swept ${cases} overtime cases)`);
report("fuzz");

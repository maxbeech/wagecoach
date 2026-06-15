import { cents } from "./federal";

// Salary <-> hourly converter. Pure arithmetic, no data. The annual figure is the
// canonical value and every pay-period amount is derived from it so the breakdown
// is internally consistent (biweekly × 26 = annual exactly, etc.).

export type SalaryMode = "salaryToHourly" | "hourlyToSalary";

export interface SalaryInputs {
  mode: SalaryMode;
  amount: number; // annual salary (salaryToHourly) OR hourly rate (hourlyToSalary)
  hoursPerWeek: number;
  weeksPerYear: number;
}

export interface SalaryBreakdown {
  hourly: number;
  weekly: number;
  biweekly: number;
  semiMonthly: number;
  monthly: number;
  annual: number;
}

export const DEFAULT_SALARY: SalaryInputs = {
  mode: "salaryToHourly",
  amount: 60000,
  hoursPerWeek: 40,
  weeksPerYear: 52,
};

const fin = (n: number, d = 0) => (Number.isFinite(n) ? n : d);

export function computeSalary(inp: SalaryInputs): SalaryBreakdown {
  const hpw = Math.max(0, fin(inp.hoursPerWeek));
  const wpy = Math.min(53, Math.max(1, fin(inp.weeksPerYear) || 52));
  const amount = Math.max(0, fin(inp.amount));

  const annual = inp.mode === "hourlyToSalary" ? amount * hpw * wpy : amount;
  const weekly = annual / wpy;
  const hourly = hpw > 0 ? weekly / hpw : 0;

  return {
    hourly: cents(hourly),
    weekly: cents(weekly),
    biweekly: cents(annual / 26),
    semiMonthly: cents(annual / 24),
    monthly: cents(annual / 12),
    annual: cents(annual),
  };
}

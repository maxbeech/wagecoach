import { computeSalary } from "../lib/salary.ts";
import { approx, report } from "./_assert.mts";

// salary -> hourly (default 40 hrs × 52 weeks = 2,080 hrs/year)
let r = computeSalary({ mode: "salaryToHourly", amount: 60000, hoursPerWeek: 40, weeksPerYear: 52 });
approx(r.annual, 60000, "60k: annual");
approx(r.hourly, 28.85, "60k → $28.85/hr (÷2080)");
approx(r.weekly, 1153.85, "60k: weekly (÷52)");
approx(r.biweekly, 2307.69, "60k: biweekly (÷26)");
approx(r.semiMonthly, 2500, "60k: semi-monthly (÷24)");
approx(r.monthly, 5000, "60k: monthly (÷12)");

// hourly -> salary
r = computeSalary({ mode: "hourlyToSalary", amount: 25, hoursPerWeek: 40, weeksPerYear: 52 });
approx(r.annual, 52000, "$25/hr → $52,000/yr");
approx(r.hourly, 25, "$25/hr round-trips");
approx(r.weekly, 1000, "$25/hr: weekly");
approx(r.biweekly, 2000, "$25/hr: biweekly");

// part-time / seasonal
r = computeSalary({ mode: "hourlyToSalary", amount: 20, hoursPerWeek: 20, weeksPerYear: 50 });
approx(r.annual, 20000, "$20 × 20h × 50wk = $20,000");

// robustness: zero hours -> no divide-by-zero, hourly 0
r = computeSalary({ mode: "salaryToHourly", amount: 50000, hoursPerWeek: 0, weeksPerYear: 52 });
approx(r.hourly, 0, "0 hrs/week → $0/hr (no NaN)");
approx(r.annual, 50000, "0 hrs: annual preserved");

// weeks/year 0 falls back to 52
r = computeSalary({ mode: "hourlyToSalary", amount: 10, hoursPerWeek: 40, weeksPerYear: 0 });
approx(r.annual, 20800, "weeks=0 → fallback 52 (10×40×52)");

report("salary");

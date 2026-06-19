import { computeSalary } from "../lib/salary.ts";
import { qty } from "../lib/federal.ts";
import { approx, eq, report } from "./_assert.mts";

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

// BUG 3 regression: swapping direction must round-trip the salary, not drift.
// The converter carries the EXACT hourly (annual / hours-per-year), not the
// cents-rounded display figure, so salary -> hourly -> salary is stable.
{
  const hpw = 40, wpy = 52;
  const s2h = computeSalary({ mode: "salaryToHourly", amount: 60000, hoursPerWeek: hpw, weeksPerYear: wpy });
  const carried = s2h.annual / (hpw * wpy); // what swap() now feeds back
  const back = computeSalary({ mode: "hourlyToSalary", amount: carried, hoursPerWeek: hpw, weeksPerYear: wpy });
  approx(back.annual, 60000, "swap round-trip: $60,000 stays $60,000 (no $8 drift)", 0.01);
  // The naive old behaviour (carry the rounded $28.85) would have drifted to $60,008.
  const naive = computeSalary({ mode: "hourlyToSalary", amount: s2h.hourly, hoursPerWeek: hpw, weeksPerYear: wpy });
  approx(naive.annual, 60008, "(sanity) carrying the rounded hourly really does drift");
}

// qty(): clean hour labels, no float noise.
eq(qty(40), "40", "qty: whole stays whole");
eq(qty(4.5), "4.5", "qty: half kept");
eq(qty(40 + 5 + 0), "45", "qty: integer sum clean");
eq(qty(0.1 + 0.2), "0.3", "qty: kills 0.1+0.2 float drift");

report("salary");

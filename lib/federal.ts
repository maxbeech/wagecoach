// Federal Fair Labor Standards Act (FLSA) constants — the single source of truth.
// Verified against the U.S. Department of Labor (dol.gov/agencies/whd) as of June 2026.
//
//  - Federal minimum wage has been $7.25/hr since July 24, 2009 (29 USC 206).
//  - Tipped employees: employer may take a tip credit so the required CASH wage is
//    $2.13/hr, with a maximum tip credit of $5.12/hr ($7.25 − $2.13). Tips + cash
//    wage must still reach $7.25; otherwise the employer makes up the difference.
//  - Overtime (29 USC 207): time-and-a-half (1.5×) the regular rate for hours worked
//    over 40 in a workweek. The FLSA has no daily overtime requirement — some states do.
//  - White-collar exemption salary threshold: the 2024 DOL rule that would have raised
//    it to $844 then $1,128/week was VACATED nationwide on Nov 15, 2024 (Texas v. DOL),
//    reverting to the 2019 level of $684/week = $35,568/year. Highly-compensated
//    employees: $107,432/year. (Duties tests also apply.)

export const FEDERAL = {
  minWage: 7.25,
  tippedCashWage: 2.13,
  maxTipCredit: 5.12,
  otMultiplier: 1.5,
  weeklyOtThreshold: 40,
  exemptWeeklySalary: 684,
  exemptAnnualSalary: 35568,
  highlyCompensatedAnnual: 107432,
  source: "https://www.dol.gov/agencies/whd/minimum-wage",
} as const;

export const dollars = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Round to cents for money math (avoids 0.1+0.2 float drift in displayed totals).
export const cents = (n: number) => Math.round(n * 100) / 100;

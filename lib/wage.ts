import { FEDERAL, cents } from "./federal";
import { effectiveMinWage, type StateLaw } from "./states";

// ---- Tip credit: does cash wage + tips reach the applicable minimum wage? ----

export interface TipInputs {
  cashWage: number; // hourly cash wage the employer pays
  hours: number; // hours worked in the period
  tips: number; // total tips received in the period
  state: StateLaw | null;
}

export interface TipResult {
  minWage: number;
  tipsPerHour: number;
  effectiveHourly: number; // cash wage + tips/hr
  meetsMinimum: boolean;
  shortfallPerHour: number; // employer must make up this much per hour
  makeUpTotal: number; // total the employer owes for the period
  tipCreditAllowed: boolean;
}

export function tipCredit(inp: TipInputs): TipResult {
  const minWage = inp.state ? effectiveMinWage(inp.state) : FEDERAL.minWage;
  const allowed = inp.state ? inp.state.tipCreditAllowed : true;
  const hours = Math.max(0, inp.hours);
  const tipsPerHour = hours > 0 ? inp.tips / hours : 0;
  const effective = inp.cashWage + tipsPerHour;
  const shortfall = Math.max(0, minWage - effective);
  return {
    minWage: cents(minWage),
    tipsPerHour: cents(tipsPerHour),
    effectiveHourly: cents(effective),
    meetsMinimum: effective + 1e-9 >= minWage,
    shortfallPerHour: cents(shortfall),
    makeUpTotal: cents(shortfall * hours),
    tipCreditAllowed: allowed,
  };
}

// ---- Exempt (salaried) vs non-exempt salary-threshold check ----

// Several states set a HIGHER salaried-exempt threshold than the federal $35,568.
// 2026 figures verified against state agencies and 2026 employer trackers (see
// per-state comments below). Two shapes:
//  - Clean formula (CA / AK / ME): derive the threshold from the state minimum
//    wage already in the dataset and test the salary against it for a true result.
//  - Region-specific (NY): the threshold differs WITHIN the state, so a salary
//    that clears one region but not the other is "confirm", not a false pass.
//  - Indexed / set figure (WA / CO): the 2026 annual figure is confirmed, so we
//    carry it and test against it. (Both also have a clean formula for WA, but we
//    pin the published figure to stay honest if the multiplier changes.)

// A flat confirmed 2026 annual threshold for a genuinely-indexed/set state.
interface SetThreshold {
  amount: number;
  basis: string;
}

// 2026 annual exempt-salary thresholds that are SET/indexed (not a clean formula).
// Sources are 2026 employer trackers cross-checked across two independent firms.
const SET_2026: Record<string, SetThreshold> = {
  // Washington: 2.25 × state min ($17.13) × 2,080 = $80,168.40, effective Jan 1, 2026.
  // The multiplier steps up annually (reaches 2.5× in 2028), so we pin the figure.
  // Source: WA L&I salary-threshold schedule; Seyfarth/Ogletree 2026 trackers.
  WA: {
    amount: 80168.4,
    basis: "Washington requires 2.25× the state minimum wage for 2026: 2.25 × $17.13 × 2,080 hrs = $80,168.40/yr (effective Jan 1, 2026; the multiplier rises each year).",
  },
  // Colorado: CDLE 2026 PAY CALC Order, $1,111.23/week = $57,784/yr, effective Jan 1, 2026.
  // Source: CDLE 2026 COMPS/PAY CALC Order; Rocky Mountain Employer / Symmetry 2026 trackers.
  CO: {
    amount: 57784,
    basis: "Colorado's 2026 CDLE PAY CALC Order sets the EAP exempt salary at $1,111.23/week = $57,784/yr (effective Jan 1, 2026; indexed to CPI each year).",
  },
};

// New York is region-specific within the state (effective Jan 1, 2026).
// Downstate = NYC + Nassau, Suffolk and Westchester counties: $1,275/wk = $66,300/yr.
// Rest of state: $1,199.10/wk = $62,353.20/yr.
// Source: NY DOL 2026 wage orders; Seyfarth / Harris Beach 2026 trackers.
const NY_DOWNSTATE = 66300; // higher of the two regions
const NY_UPSTATE = 62353.2;

// "confirm" means a known higher state threshold applies but the precise figure
// is region-dependent and the salary falls in the band where the answer differs.
export type SalaryVerdict = true | false | "confirm";

export interface ExemptResult {
  threshold: number; // applicable annual threshold used for the test
  federalThreshold: number;
  meetsSalary: SalaryVerdict;
  basis: string; // how the threshold was derived
  stateNote?: string;
}

const FED_BASIS = `Federal FLSA salary threshold of ${FEDERAL.exemptAnnualSalary.toLocaleString("en-US", { style: "currency", currency: "USD" })}/yr ($684/week).`;

export function exemptCheck(annualSalary: number, state: StateLaw | null): ExemptResult {
  const fed = FEDERAL.exemptAnnualSalary;

  // New York: test against both regional thresholds. Clear pass/fail only when the
  // salary is above both or below both; otherwise it depends on the work location.
  if (state?.abbr === "NY") {
    let meetsSalary: SalaryVerdict;
    let stateNote: string | undefined;
    if (annualSalary + 1e-9 >= NY_DOWNSTATE) meetsSalary = true;
    else if (annualSalary + 1e-9 < NY_UPSTATE) meetsSalary = false;
    else {
      meetsSalary = "confirm";
      stateNote = "This salary clears New York's rest-of-state threshold but not the higher downstate one. Confirm which applies to the work location.";
    }
    return {
      threshold: NY_DOWNSTATE,
      federalThreshold: fed,
      meetsSalary,
      basis: "New York sets region-specific exempt thresholds for 2026 (effective Jan 1, 2026): $66,300/yr ($1,275/week) in NYC, Nassau, Suffolk and Westchester; $62,353.20/yr ($1,199.10/week) in the rest of the state.",
      stateNote,
    };
  }

  // Clean formula states: derive the threshold from the state minimum wage.
  let threshold: number = fed;
  let basis = FED_BASIS;
  if (state?.abbr === "CA") {
    threshold = Math.round(2 * state.minWage * 2080);
    basis = `California requires at least 2× the state minimum wage for full-time work: 2 × $${state.minWage.toFixed(2)} × 2,080 hrs = $${threshold.toLocaleString("en-US")}/yr (effective Jan 1, 2026).`;
  } else if (state?.abbr === "AK") {
    // Alaska Ballot Measure 1 ties the exempt salary to 2× the state minimum wage
    // for a 40-hour week. Source: AK DOL; Ogletree/Symmetry 2026 trackers.
    threshold = Math.round(2 * state.minWage * 2080);
    basis = `Alaska requires 2× the state minimum wage for a 40-hour week: 2 × $${state.minWage.toFixed(2)} × 2,080 hrs = $${threshold.toLocaleString("en-US")}/yr. Note: Alaska's minimum wage rises to $14.00 on July 1, 2026, raising this to $58,240/yr.`;
  } else if (state?.abbr === "ME") {
    // Maine statute: 3,000 × the state minimum hourly wage. Source: 26 MRS §663(3)(K).
    threshold = Math.round(3000 * state.minWage);
    basis = `Maine sets the exempt salary at 3,000× the state minimum hourly wage: 3,000 × $${state.minWage.toFixed(2)} = $${threshold.toLocaleString("en-US")}/yr (effective Jan 1, 2026).`;
  } else if (state && SET_2026[state.abbr]) {
    threshold = SET_2026[state.abbr].amount;
    basis = SET_2026[state.abbr].basis;
  }

  return {
    threshold,
    federalThreshold: fed,
    meetsSalary: annualSalary + 1e-9 >= threshold,
    basis,
  };
}

// ---- PTO / vacation payout on separation ----

// The four states where earned vacation is treated as wages that MUST be paid out
// on separation (use-it-or-lose-it is prohibited). Elsewhere it depends on company
// policy and state nuances — we say so rather than assert a per-state rule.
const PAYOUT_REQUIRED = new Set(["CA", "CO", "MT", "NE"]);

export interface PtoResult {
  payout: number;
  payoutRequired: boolean;
  note: string;
}

export function ptoPayout(accruedHours: number, hourlyRate: number, state: StateLaw | null): PtoResult {
  const payout = cents(Math.max(0, accruedHours) * Math.max(0, hourlyRate));
  const required = state ? PAYOUT_REQUIRED.has(state.abbr) : false;
  const note = required
    ? `${state!.name} treats earned vacation as wages. Unused, accrued PTO generally must be paid out on separation.`
    : "Payout of unused PTO depends on your state and your employer's written policy. California, Colorado, Montana and Nebraska require payout of earned vacation; many states leave it to company policy. Confirm with your state labor department.";
  return { payout, payoutRequired: required, note };
}

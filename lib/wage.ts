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

// States that set a higher salaried-exempt threshold than the federal $35,568.
// California's is a clean formula (2× the state minimum wage, full-time); the
// others change yearly, so we flag them and tell the user to confirm the figure.
const HIGHER_EXEMPT: Record<string, string> = {
  NY: "New York sets a higher exempt salary threshold (e.g. ~$64,350/yr in NYC, Long Island and Westchester; ~$60,405/yr upstate).",
  WA: "Washington sets a higher exempt salary threshold tied to a multiple of its minimum wage (well above the federal figure).",
  CO: "Colorado sets a higher exempt salary threshold that is indexed each year.",
  AK: "Alaska's exempt threshold is 2× the state minimum wage for a 40-hour week.",
  ME: "Maine sets a higher exempt salary threshold (3,000× the state minimum hourly wage).",
};

export interface ExemptResult {
  threshold: number; // applicable annual threshold used for the test
  federalThreshold: number;
  meetsSalary: boolean;
  basis: string; // how the threshold was derived
  stateNote?: string;
}

export function exemptCheck(annualSalary: number, state: StateLaw | null): ExemptResult {
  let threshold: number = FEDERAL.exemptAnnualSalary;
  let basis = `Federal FLSA salary threshold of ${FEDERAL.exemptAnnualSalary.toLocaleString("en-US", { style: "currency", currency: "USD" })}/yr ($684/week).`;
  let stateNote: string | undefined;

  if (state?.abbr === "CA") {
    threshold = Math.round(2 * state.minWage * 2080);
    basis = `California requires at least 2× the state minimum wage for full-time work: 2 × $${state.minWage.toFixed(2)} × 2,080 hrs.`;
  } else if (state && HIGHER_EXEMPT[state.abbr]) {
    stateNote = HIGHER_EXEMPT[state.abbr];
  }

  return {
    threshold,
    federalThreshold: FEDERAL.exemptAnnualSalary,
    meetsSalary: annualSalary + 1e-9 >= threshold,
    basis,
    stateNote,
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
    ? `${state!.name} treats earned vacation as wages — unused, accrued PTO generally must be paid out on separation.`
    : "Whether unused PTO must be paid out depends on your state and your employer's written policy. California, Colorado, Montana and Nebraska require payout of earned vacation; many states leave it to company policy. Confirm with your state labor department.";
  return { payout, payoutRequired: required, note };
}

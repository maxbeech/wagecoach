import { cents, FEDERAL } from "./federal";
import { computePay } from "./overtime";
import { effectiveMinWage, type StateLaw } from "./states";

// Back-pay estimator: the inverse of the overtime engine. Given what an employee
// *should* have earned (computed by the real FLSA engine) and what they were
// actually paid, it estimates the unpaid wages they may be owed and how far back
// federal law lets them recover it.
//
// The recoverable window is anchored to the FLSA (29 USC 255): 2 years of back
// wages, or 3 if the violation was willful. That federal floor applies in every
// state, so the dollar figure never depends on a state-specific number. Many
// states allow a longer look-back or extra penalties on top — surfaced separately
// (lib/wage-claim-data.ts), never folded into this estimate. The FLSA also allows
// an equal amount in liquidated damages, so the realistic *potential* recovery is
// up to double the back pay.
//
// This is an estimate from the figures entered, not legal advice or a guarantee.

export type ClaimType = "overtime" | "minimum_wage" | "off_the_clock" | "misclassification";

export interface BackPayInputs {
  claimType: ClaimType;
  hourlyRate: number; // regular/agreed hourly rate
  hoursPerWeek: number; // typical hours worked in an affected week
  paidWeekly: number; // gross actually received in a typical affected week
  weeksAffected: number; // how many weeks the underpayment ran
  willful: boolean; // employer knew or showed reckless disregard → 3-year window
  state: StateLaw | null;
}

export interface BackPayResult {
  correctRate: number; // the regular rate that should have applied
  owedWeekly: number; // correct gross for a typical week
  paidWeekly: number; // what they actually got (clamped)
  weeklyShortfall: number; // owed − paid, never negative
  lookbackYears: number; // 2 or 3 (FLSA)
  maxWeeks: number; // lookbackYears × 52
  recoverableWeeks: number; // min(weeksAffected, maxWeeks)
  weeksCapped: boolean; // claim runs past the federal window
  backPay: number; // weeklyShortfall × recoverableWeeks
  liquidatedDamages: number; // equal-amount FLSA liquidated damages
  totalPotential: number; // backPay + liquidatedDamages
}

export const DEFAULT_BACKPAY: BackPayInputs = {
  claimType: "overtime",
  hourlyRate: 20,
  hoursPerWeek: 50,
  paidWeekly: 1000, // 50 hrs × $20 straight time — i.e. no overtime premium paid
  weeksAffected: 26,
  willful: false,
  state: null,
};

const clamp = (n: number, lo: number, hi: number) =>
  Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;

// What a week *should* have paid, using the real overtime engine. For a
// minimum-wage claim the correct regular rate is at least the applicable minimum;
// for every other claim type the employee's own agreed rate is the floor, and the
// engine adds the time-and-a-half premium for hours over 40 (and state daily OT).
export function correctWeeklyPay(inp: BackPayInputs): { rate: number; gross: number } {
  const rate = clamp(inp.hourlyRate, 0, 100000);
  const floor = inp.state ? effectiveMinWage(inp.state) : FEDERAL.minWage;
  const correctRate = inp.claimType === "minimum_wage" ? Math.max(rate, floor) : rate;
  const gross = computePay({
    hourlyRate: correctRate,
    hoursThisWeek: clamp(inp.hoursPerWeek, 0, 168),
    otMultiplier: 1.5,
    state: inp.state,
  }).gross;
  return { rate: cents(correctRate), gross };
}

export function estimateBackPay(inp: BackPayInputs): BackPayResult {
  const { rate: correctRate, gross: owedWeekly } = correctWeeklyPay(inp);
  const paidWeekly = cents(clamp(inp.paidWeekly, 0, 1_000_000));
  const weeklyShortfall = cents(Math.max(0, owedWeekly - paidWeekly));

  const lookbackYears = inp.willful ? 3 : 2;
  const maxWeeks = lookbackYears * 52;
  const weeksAffected = Math.round(clamp(inp.weeksAffected, 0, 520));
  const recoverableWeeks = Math.min(weeksAffected, maxWeeks);

  const backPay = cents(weeklyShortfall * recoverableWeeks);
  const liquidatedDamages = backPay; // FLSA equal-amount liquidated damages
  return {
    correctRate,
    owedWeekly,
    paidWeekly,
    weeklyShortfall,
    lookbackYears,
    maxWeeks,
    recoverableWeeks,
    weeksCapped: weeksAffected > maxWeeks,
    backPay,
    liquidatedDamages,
    totalPotential: cents(backPay + liquidatedDamages),
  };
}

export const CLAIM_LABELS: Record<ClaimType, string> = {
  overtime: "Unpaid overtime",
  minimum_wage: "Below minimum wage",
  off_the_clock: "Off-the-clock work",
  misclassification: "Salaried but owed overtime",
};

import { estimateBackPay, DEFAULT_BACKPAY, type BackPayInputs } from "../lib/backpay.ts";
import { scoreCase } from "../lib/case-score.ts";
import { encodeBackPay, decodeBackPay } from "../lib/backpay-url.ts";
import { wageClaim, FEDERAL_WHD } from "../lib/wage-claim-data.ts";
import { getStateByAbbr } from "../lib/states.ts";
import { approx, eq, ok, report } from "./_assert.mts";

const CA = getStateByAbbr("CA")!;

// --- Back-pay engine ---
// Default: 50 hrs/wk at $20, paid straight time ($1000), 26 wks, not willful.
// Correct week = 40×$20 + 10×$30 = $1,100, so the OT premium of $100/wk is unpaid.
let r = estimateBackPay(DEFAULT_BACKPAY);
approx(r.owedWeekly, 1100, "default: correct weekly pay is $1,100");
approx(r.weeklyShortfall, 100, "default: $100/wk unpaid overtime premium");
eq(r.lookbackYears, 2, "default: 2-year FLSA window (not willful)");
eq(r.recoverableWeeks, 26, "default: all 26 weeks recoverable");
approx(r.backPay, 2600, "default: $2,600 back pay");
approx(r.liquidatedDamages, 2600, "default: equal liquidated damages");
approx(r.totalPotential, 5200, "default: up to $5,200 potential recovery");
eq(r.weeksCapped, false, "default: nothing capped");

// Willful extends the window to 3 years.
r = estimateBackPay({ ...DEFAULT_BACKPAY, willful: true });
eq(r.lookbackYears, 3, "willful: 3-year window");
eq(r.maxWeeks, 156, "willful: 156-week cap");

// Claim older than the window is capped at the federal floor.
r = estimateBackPay({ ...DEFAULT_BACKPAY, weeksAffected: 200 });
eq(r.recoverableWeeks, 104, "non-willful: capped at 104 weeks");
eq(r.weeksCapped, true, "200 weeks flagged as capped");
approx(r.backPay, 10400, "capped back pay = $100 × 104");

// Minimum-wage claim lifts the regular rate to the applicable minimum.
const mw: BackPayInputs = { claimType: "minimum_wage", hourlyRate: 14, hoursPerWeek: 40, paidWeekly: 560, weeksAffected: 10, willful: false, state: CA };
r = estimateBackPay(mw);
approx(r.correctRate, 16.9, "CA min-wage claim: correct rate is $16.90");
approx(r.owedWeekly, 676, "CA min-wage: owed $676/wk");
approx(r.weeklyShortfall, 116, "CA min-wage: $116/wk short");
approx(r.backPay, 1160, "CA min-wage: $1,160 back pay");

// No shortfall when paid correctly.
r = estimateBackPay({ ...DEFAULT_BACKPAY, paidWeekly: 1100 });
eq(r.weeklyShortfall, 0, "paid correctly: no shortfall");
eq(r.backPay, 0, "paid correctly: no back pay");

// --- Case score ---
let s = scoreCase(DEFAULT_BACKPAY, estimateBackPay(DEFAULT_BACKPAY));
eq(s.tone, "look", "default scores 'worth a closer look'");
ok(s.score > 0 && s.score < 45, `default score in range (got ${s.score})`);

const strong: BackPayInputs = { ...DEFAULT_BACKPAY, hoursPerWeek: 60, paidWeekly: 1200, weeksAffected: 100, willful: true };
s = scoreCase(strong, estimateBackPay(strong));
eq(s.tone, "strong", "long willful underpayment scores 'strong'");
ok(s.score >= 70, `strong case score >= 70 (got ${s.score})`);

s = scoreCase({ ...DEFAULT_BACKPAY, paidWeekly: 1100 }, estimateBackPay({ ...DEFAULT_BACKPAY, paidWeekly: 1100 }));
eq(s.tone, "none", "no shortfall scores 'none'");
eq(s.score, 0, "no shortfall scores 0");

// --- URL round-trip ---
const round = decodeBackPay("?" + encodeBackPay(mw));
eq(round.claimType, "minimum_wage", "url: claim type survives");
approx(round.hourlyRate, 14, "url: rate survives");
eq(round.state?.abbr, "CA", "url: state survives");
const wf = decodeBackPay("?" + encodeBackPay({ ...DEFAULT_BACKPAY, willful: true }));
eq(wf.willful, true, "url: willful flag survives");

// --- Wage-claim data ---
eq(wageClaim("CA").fileUrl?.includes("dir.ca.gov"), true, "CA filing link present");
eq(wageClaim("ZZ").agency, FEDERAL_WHD.agency, "unknown state falls back to federal WHD");
ok(Boolean(wageClaim("NY").statePlus), "NY has a state-plus remedy note");

report("backpay");

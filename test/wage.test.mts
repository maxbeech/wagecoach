import { tipCredit, exemptCheck, ptoPayout } from "../lib/wage.ts";
import { getStateByAbbr, STATES, effectiveMinWage } from "../lib/states.ts";
import { STATE_CORE } from "../lib/states-data.ts";
import { FEDERAL } from "../lib/federal.ts";
import { approx, eq, ok, report } from "./_assert.mts";

// --- Tip credit ---
let t = tipCredit({ cashWage: 2.13, hours: 40, tips: 300, state: null });
eq(t.meetsMinimum, true, "fed tipped, $300 tips/40h: meets $7.25");
approx(t.effectiveHourly, 9.63, "fed tipped: $2.13 + $7.50/hr tips");

t = tipCredit({ cashWage: 2.13, hours: 40, tips: 100, state: null });
eq(t.meetsMinimum, false, "fed tipped, $100 tips/40h: below minimum");
approx(t.shortfallPerHour, 2.62, "fed tipped: $2.62/hr shortfall");
approx(t.makeUpTotal, 104.8, "fed tipped: employer makes up $104.80");

const CA = getStateByAbbr("CA")!;
t = tipCredit({ cashWage: 16.9, hours: 30, tips: 0, state: CA });
eq(t.tipCreditAllowed, false, "CA: no tip credit allowed");
approx(t.minWage, 16.9, "CA: minimum wage $16.90");

// --- Exempt salary check ---
// Federal-only state behaves as before.
let e = exemptCheck(40000, null);
eq(e.meetsSalary, true, "fed: $40k meets $35,568 threshold");
e = exemptCheck(30000, null);
eq(e.meetsSalary, false, "fed: $30k below threshold");
e = exemptCheck(40000, getStateByAbbr("TX")!);
eq(e.threshold, 35568, "TX (federal-only): threshold stays federal $35,568");
eq(e.meetsSalary, true, "TX: $40k meets federal threshold");

// California: clean formula, unchanged.
e = exemptCheck(60000, CA);
eq(e.threshold, 70304, "CA exempt threshold = 2×$16.90×2080 = $70,304");
eq(e.meetsSalary, false, "CA: $60k below $70,304");
e = exemptCheck(71000, CA);
eq(e.meetsSalary, true, "CA: $71k meets $70,304");

// New York: region-specific. $50k is below BOTH 2026 region thresholds → clear fail,
// NOT a false green pass (this is the bug being fixed).
e = exemptCheck(50000, getStateByAbbr("NY")!);
eq(e.meetsSalary, false, "NY: $50k is below both 2026 region thresholds (not a clear pass)");
// A salary between rest-of-state ($62,353.20) and downstate ($66,300) is "confirm".
e = exemptCheck(64000, getStateByAbbr("NY")!);
eq(e.meetsSalary, "confirm", "NY: $64k clears rest-of-state but not downstate → confirm");
ok(Boolean(e.stateNote), "NY: confirm case surfaces a state note");
e = exemptCheck(70000, getStateByAbbr("NY")!);
eq(e.meetsSalary, true, "NY: $70k clears the higher downstate threshold");

// Alaska: 2 × state min ($13.00) × 2080 = $54,080.
e = exemptCheck(40000, getStateByAbbr("AK")!);
eq(e.threshold, 54080, "AK exempt threshold = 2×$13.00×2080 = $54,080");
eq(e.meetsSalary, false, "AK: $40k below $54,080");
e = exemptCheck(55000, getStateByAbbr("AK")!);
eq(e.meetsSalary, true, "AK: $55k meets $54,080");

// Maine: 3,000 × state min ($15.10) = $45,300.
e = exemptCheck(45300, getStateByAbbr("ME")!);
eq(e.threshold, 45300, "ME exempt threshold = 3000×$15.10 = $45,300");
eq(e.meetsSalary, true, "ME: $45,300 meets the threshold");
e = exemptCheck(45000, getStateByAbbr("ME")!);
eq(e.meetsSalary, false, "ME: $45k below $45,300");

// Washington / Colorado: carried 2026 figures, tested against directly.
e = exemptCheck(70000, getStateByAbbr("WA")!);
eq(e.threshold, 80168.4, "WA exempt threshold = $80,168.40 (2.25×$17.13×2080)");
eq(e.meetsSalary, false, "WA: $70k below $80,168.40");
e = exemptCheck(50000, getStateByAbbr("CO")!);
eq(e.threshold, 57784, "CO exempt threshold = $57,784 (2026 PAY CALC)");
eq(e.meetsSalary, false, "CO: $50k below $57,784");

// --- PTO payout ---
let p = ptoPayout(80, 25, CA);
approx(p.payout, 2000, "PTO 80h × $25 = $2,000");
eq(p.payoutRequired, true, "CA: PTO payout required");
p = ptoPayout(80, 25, getStateByAbbr("TX")!);
eq(p.payoutRequired, false, "TX: PTO payout not state-required");

// --- Data integrity across all 51 jurisdictions ---
eq(STATE_CORE.length, 51, "51 jurisdictions (50 states + DC)");
eq(STATES.length, 51, "51 merged state records");
const slugs = new Set(STATES.map((s) => s.slug));
eq(slugs.size, 51, "all slugs unique");
const abbrs = new Set(STATES.map((s) => s.abbr));
eq(abbrs.size, 51, "all abbreviations unique");

for (const s of STATES) {
  ok(s.minWage >= 0, `${s.abbr}: minWage non-negative`);
  ok(effectiveMinWage(s) >= FEDERAL.minWage, `${s.abbr}: effective wage never below federal $7.25`);
  ok(s.finalPayFired.length > 0 && s.finalPayQuit.length > 0, `${s.abbr}: final-pay rules present`);
  ok(s.mealBreak.length > 0 && s.restBreak.length > 0, `${s.abbr}: break rules present`);
  if (!s.tipCreditAllowed) {
    eq(s.tippedCashWage, s.minWage, `${s.abbr}: no-tip-credit state pays full min wage in cash`);
  }
}

report("wage + data");

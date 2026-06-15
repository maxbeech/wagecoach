import { computePay, type PayInputs } from "../lib/overtime.ts";
import { getStateByAbbr } from "../lib/states.ts";
import { approx, eq, report } from "./_assert.mts";

const base: PayInputs = { hourlyRate: 20, hoursThisWeek: 45, otMultiplier: 1.5, state: null };

// --- Weekly FLSA (federal, no daily OT) ---
let r = computePay(base);
approx(r.regularPay, 800, "fed 45h: regular pay 40×$20");
approx(r.otPay, 150, "fed 45h: OT pay 5×$30");
approx(r.gross, 950, "fed 45h: gross");
eq(r.dailyApplied, false, "fed: weekly mode");

r = computePay({ ...base, hourlyRate: 25, hoursThisWeek: 50 });
approx(r.gross, 1375, "$25 × 50h: gross (1000 + 375)");

// time-and-a-half exactly at 40 = no OT
r = computePay({ ...base, hoursThisWeek: 40 });
approx(r.otPay, 0, "exactly 40h: no OT");
approx(r.gross, 800, "exactly 40h: gross");

// --- Double time multiplier (holiday / double-time preset) ---
r = computePay({ ...base, otMultiplier: 2 });
approx(r.otPay, 200, "double-time 45h: OT 5×$40");
approx(r.gross, 1000, "double-time 45h: gross");

// --- California daily OT (>8 = 1.5×, >12 = 2×) ---
const CA = getStateByAbbr("CA")!;
r = computePay({ hourlyRate: 20, hoursThisWeek: 40, otMultiplier: 1.5, state: CA, dailyHours: [10, 10, 10, 10, 0, 0, 0] });
eq(r.dailyApplied, true, "CA: daily mode applied");
approx(r.regularPay, 640, "CA 4×10h: regular 32×$20");
approx(r.otPay, 240, "CA 4×10h: OT 8×$30");
approx(r.gross, 880, "CA 4×10h: gross (daily OT even though weekly=40)");

// CA double time over 12 in a day
r = computePay({ hourlyRate: 30, hoursThisWeek: 14, otMultiplier: 1.5, state: CA, dailyHours: [14, 0, 0, 0, 0, 0, 0] });
approx(r.regularPay, 240, "CA 14h day: regular 8×$30");
approx(r.otPay, 180, "CA 14h day: OT 4×$45 (hrs 8–12)");
approx(r.doublePay, 120, "CA 14h day: double 2×$60 (>12)");
approx(r.gross, 540, "CA 14h day: gross");

// CA 7th consecutive day rule + weekly reconciliation (7×8 = 56h)
r = computePay({ hourlyRate: 20, hoursThisWeek: 56, otMultiplier: 1.5, state: CA, dailyHours: [8, 8, 8, 8, 8, 8, 8] });
approx(r.regularHours, 40, "CA 7×8h: 40 regular hours");
approx(r.otHours, 16, "CA 7×8h: 16 OT (8 weekly + 8 on 7th day)");
approx(r.gross, 1280, "CA 7×8h: gross 800 + 480");

// --- Alaska daily OT (>8, no double time) ---
const AK = getStateByAbbr("AK")!;
r = computePay({ hourlyRate: 20, hoursThisWeek: 20, otMultiplier: 1.5, state: AK, dailyHours: [10, 10, 0, 0, 0, 0, 0] });
approx(r.regularPay, 320, "AK 2×10h: regular 16×$20");
approx(r.otPay, 120, "AK 2×10h: OT 4×$30");
eq(r.doubleHours, 0, "AK: no double time");

// --- Nevada conditional daily OT ---
const NV = getStateByAbbr("NV")!;
// rate $20 ≥ 1.5 × $12 = $18 → NO daily OT → weekly only
r = computePay({ hourlyRate: 20, hoursThisWeek: 20, otMultiplier: 1.5, state: NV, dailyHours: [10, 10, 0, 0, 0, 0, 0] });
eq(r.dailyApplied, false, "NV high earner: daily OT does NOT apply");
approx(r.gross, 400, "NV high earner 20h: weekly, no OT");
// rate $10 < $18 → daily OT applies
r = computePay({ hourlyRate: 10, hoursThisWeek: 20, otMultiplier: 1.5, state: NV, dailyHours: [10, 10, 0, 0, 0, 0, 0] });
eq(r.dailyApplied, true, "NV low earner: daily OT applies");
approx(r.gross, 220, "NV low earner: 16×$10 + 4×$15");

// --- Colorado (>12/day) ---
const CO = getStateByAbbr("CO")!;
r = computePay({ hourlyRate: 20, hoursThisWeek: 13, otMultiplier: 1.5, state: CO, dailyHours: [13, 0, 0, 0, 0, 0, 0] });
approx(r.regularPay, 240, "CO 13h day: regular 12×$20");
approx(r.otPay, 30, "CO 13h day: OT 1×$30 (>12)");

// --- Robustness: negative rate clamps to 0, garbage stays finite ---
r = computePay({ ...base, hourlyRate: -5 });
approx(r.gross, 0, "negative rate clamps to $0");

report("overtime");

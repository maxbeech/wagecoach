import { encodeInputs, decodeInputs } from "../lib/pay-url.ts";
import { getStateByAbbr } from "../lib/states.ts";
import { type PayInputs } from "../lib/overtime.ts";
import { approx, eq, report } from "./_assert.mts";

const CA = getStateByAbbr("CA")!;

// Round-trip a weekly-mode input
let inp: PayInputs = { hourlyRate: 22.5, hoursThisWeek: 48, otMultiplier: 1.5, state: CA };
let out = decodeInputs("?" + encodeInputs(inp));
approx(out.hourlyRate, 22.5, "round-trip rate");
approx(out.hoursThisWeek, 48, "round-trip hours");
eq(out.state?.abbr, "CA", "round-trip state");

// Double-time multiplier survives
inp = { hourlyRate: 20, hoursThisWeek: 45, otMultiplier: 2, state: null };
out = decodeInputs("?" + encodeInputs(inp));
approx(out.otMultiplier, 2, "round-trip double-time multiplier");
eq(out.state, null, "round-trip null state");

// Daily hours survive (capped at 7)
inp = { hourlyRate: 20, hoursThisWeek: 50, otMultiplier: 1.5, state: CA, dailyHours: [10, 10, 10, 10, 10, 0, 0] };
out = decodeInputs("?" + encodeInputs(inp));
eq(JSON.stringify(out.dailyHours), JSON.stringify([10, 10, 10, 10, 10, 0, 0]), "round-trip daily hours");

// Garbage params fall back to seed defaults
out = decodeInputs("?rate=abc&hrs=&st=ZZ", { hourlyRate: 15, hoursThisWeek: 40 });
approx(out.hourlyRate, 15, "garbage rate -> seed default");
approx(out.hoursThisWeek, 40, "empty hours -> seed default");
eq(out.state, null, "unknown state code -> null");

// Unknown state code keeps the seed's state if provided
out = decodeInputs("?st=ZZ", { state: CA });
eq(out.state?.abbr, "CA", "unknown state code -> seed state");

report("pay-url");

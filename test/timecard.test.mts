import { computeTimeCard, parseTime, shiftMinutes, fmtHm, type TimeRow } from "../lib/timecard.ts";
import { encodeTimeCard, decodeTimeCard, DEFAULT_TIMECARD } from "../lib/timecard-url.ts";
import { getStateByAbbr } from "../lib/states.ts";
import { approx, eq, ok, report } from "./_assert.mts";

const row = (i: string, o: string, b = 0): TimeRow => ({ in: i, out: o, breakMin: b });
const blank = row("", "");
const card = (rows: TimeRow[], st: string | null = null, period: "weekly" | "biweekly" = "weekly", rate = 0) =>
  computeTimeCard({ rows, period, hourlyRate: rate, state: st ? getStateByAbbr(st)! : null });

// --- parsing ---
eq(parseTime("17:30"), 1050, "24h parse");
eq(parseTime("5:30 pm"), 1050, "am/pm parse");
eq(parseTime("12:00 am"), 0, "12am is midnight");
eq(parseTime("12pm"), 720, "12pm is noon");
eq(parseTime("25:00"), null, "bad hour");
eq(parseTime("banana"), null, "garbage");

// --- hand cases ---
eq(shiftMinutes(row("09:00", "17:30", 30)), 480, "9:00-17:30 with 30 lunch = 8h");
eq(shiftMinutes(row("22:00", "06:00")), 480, "overnight 22:00-06:00 = 8h");
eq(shiftMinutes(row("09:00", "09:00")), 0, "same in/out skipped");
eq(shiftMinutes(row("09:00", "10:00", 120)), 0, "break larger than shift = 0");
eq(fmtHm(465), "7:45", "h:mm format");

let r = card([row("08:00", "20:30", 30)], "CA", "weekly", 20); // 12h day
approx(r.regular, 8, "CA 12h: 8 regular");
approx(r.ot, 4, "CA 12h: 4 OT");
approx(r.double, 0, "CA 12h: exactly 12 is not double time");
r = card([row("06:00", "19:00", 0)], "CA", "weekly", 20); // 13h
approx(r.ot, 4, "CA 13h: 4 OT");
approx(r.double, 1, "CA 13h: 1 double time");
approx(r.gross ?? 0, 8 * 20 + 4 * 30 + 1 * 40, "CA 13h gross");

// weekly 45h in TX: five 9h days
r = card([0, 1, 2, 3, 4].map(() => row("08:00", "17:00")), "TX", "weekly", 20);
approx(r.hours, 45, "TX 45h total");
approx(r.ot, 5, "TX 45h: 5 OT");
approx(r.gross ?? 0, 950, "TX 45h gross");
eq(r.hm, "45:00", "h:mm total");
eq(card([row("09:00", "17:00")]).gross, null, "no rate = no gross");

// --- biweekly splits per week ---
const wk = (n: number) => Array.from({ length: 7 }, (_, i) => (i < n ? row("08:00", "16:00") : blank)); // n 8h days
const two = [...wk(3), ...wk(6)]; // 24h then 48h
r = card(two, "TX", "biweekly");
eq(r.weeks.length, 2, "two weeks");
approx(r.weeks[0].ot, 0, "week 1 no OT");
approx(r.weeks[1].ot, 8, "week 2: 8 OT");
approx(r.ot, 8, "OT not averaged across weeks");
eq(card(two, "TX", "weekly").weeks.length, 1, "weekly ignores week 2 rows");

// --- invalid rows never NaN ---
r = card([row("xx", "yy"), row("", "5pm"), blank, { in: "09:00", out: "10:00", breakMin: NaN }]);
approx(r.hours, 1, "bad rows skipped, NaN break = 0");
ok(computeTimeCard({ rows: undefined as never, period: "weekly", hourlyRate: NaN, state: null }).hours === 0, "empty/undefined rows");

// --- URL round trip ---
const dec = decodeTimeCard(encodeTimeCard({ ...DEFAULT_TIMECARD, period: "biweekly", hourlyRate: 22.5, state: getStateByAbbr("CA")! }));
eq(dec.period, "biweekly", "url period");
eq(dec.hourlyRate, 22.5, "url rate");
eq(dec.state?.abbr, "CA", "url state");
eq(dec.rows[0].out, "17:30", "url row");
eq(dec.rows[0].breakMin, 30, "url break");

// --- fuzz ---
const abbrs = [null, "CA", "TX", "NV", "AK", "CO", "NY"];
const junk = ["", "xx", "9", "24:00", "7pm", "-1", "12:60"];
const rnd = (n: number) => Math.floor(Math.random() * n);
const rt = () => (Math.random() < 0.1 ? junk[rnd(junk.length)] : `${String(rnd(24)).padStart(2, "0")}:${String(rnd(60)).padStart(2, "0")}`);
for (let n = 0; n < 5000; n++) {
  const rows = Array.from({ length: rnd(16) }, () => row(rt(), rt(), Math.random() < 0.1 ? NaN : rnd(200) - 20));
  const abbr = abbrs[rnd(abbrs.length)];
  const rate = Math.random() < 0.3 ? 0 : Math.random() * 100;
  const x = card(rows, abbr, Math.random() < 0.5 ? "weekly" : "biweekly", rate);
  const vals = [x.hours, x.regular, x.ot, x.double, ...x.weeks.flatMap((w) => [w.hours, w.regular, w.ot, w.double])];
  ok(vals.every((v) => Number.isFinite(v) && v >= 0), `fuzz ${n}: finite and non-negative`);
  ok(x.gross === null || (Number.isFinite(x.gross) && x.gross >= 0), `fuzz ${n}: gross sane`);
  ok(Math.abs(x.regular + x.ot + x.double - x.minutes / 60) < 1e-6, `fuzz ${n}: parts equal total`);
  ok(x.minutes === x.days.reduce((a, d) => a + d.minutes, 0), `fuzz ${n}: total equals days`);
  ok(x.minutes === x.weeks.reduce((a, w) => a + w.minutes, 0), `fuzz ${n}: total equals weeks`);
}

report("timecard");

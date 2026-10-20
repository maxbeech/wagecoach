import { buildProReport, parseStates, statesParam, WAGE_SOURCES } from "../lib/pro-report.ts";
import { lockedCopy } from "../lib/report-purchase.ts";
import { buildReportEmail } from "../lib/report-email.ts";
import { effectiveMinWage, getStateByAbbr, STATES } from "../lib/states.ts";
import { FEDERAL } from "../lib/federal.ts";
import { approx, eq, ok, report } from "./_assert.mts";

// Fixture states are the ones the repo's own engine tests already use
// (overtime, wage, pay-url, backpay): CA, NY, AK, TX, ME, CO, WA, NV.
const FIXTURE = "CA,NY,AK,TX,ME,CO,WA,NV";
const states = parseStates(FIXTURE);
eq(states.length, 8, "all eight fixture states parse");
const r = buildProReport(states);
const row = (abbr: string) => r.rows.find((x) => x.abbr === abbr)!;

// --- parseStates --------------------------------------------------------------------
eq(statesParam(parseStates("ny, ca")), "CA,NY", "result follows state order, not input order");
eq(statesParam(parseStates("CA,CA,ca,California,california")), "CA", "duplicates and case collapse");
eq(statesParam(parseStates("new-york texas")), "NY,TX", "slugs and spaces work");
eq(statesParam(parseStates(["CA", "tx,ny"])), "CA,NY,TX", "repeated query values work");
eq(statesParam(parseStates("ZZ,XX,,  ,not-a-state")), "", "unknown entries are dropped");
eq(statesParam(parseStates("DC")), "DC", "DC is a valid entry");
eq(parseStates(undefined).length, 0, "undefined gives no states");
eq(parseStates(null).length, 0, "null gives no states");
eq(parseStates("").length, 0, "empty gives no states");
eq(parseStates(STATES.map((s) => s.abbr).join(",")).length, 51, "all 50 states plus DC");
eq(parseStates(`CA,${"x".repeat(5000)}`).length, 1, "a huge junk token is ignored, not fatal");
eq(parseStates("a,".repeat(5000) + "CA").length, 0, "more tokens than the cap are cut off");

// --- the report is the engine data, row for row -------------------------------------
eq(r.dataYear, 2026, "data year");
eq(r.rows.length, 8, "one row per state");
approx(row("CA").minWage, 16.9, "California minimum wage");
eq(row("CA").minWageBasis, "state", "California uses its own rate");
ok(row("CA").overtime.daily?.includes("8 hours/day") === true, "California daily overtime after 8");
ok(row("CA").overtime.doubleTime?.includes("12 hours") === true, "California double time");
eq(row("CA").tipped.creditAllowed, false, "California has no tip credit");
eq(row("CA").finalPay.fired, "Immediately, at the time of termination", "California final pay when fired");
approx(row("TX").minWage, 7.25, "Texas minimum wage");
eq(row("TX").minWageBasis, "federal", "Texas follows the federal floor");
eq(row("TX").overtime.daily, null, "Texas has no daily overtime");
eq(row("TX").tipped.cashWage, 2.13, "Texas tipped cash wage");
eq(row("NY").tipped.cashWage, null, "New York tipped cash wage varies");
ok((row("NY").minWageNote ?? "").includes("NYC"), "New York keeps its NYC note");
approx(row("AK").minWage, 13, "Alaska minimum wage");
eq(row("AK").tipped.creditAllowed, false, "Alaska has no tip credit");
approx(row("ME").tipped.cashWage as number, 7.55, "Maine tipped cash wage");
ok(row("CO").overtime.daily?.includes("12 hours/day") === true, "Colorado daily overtime after 12");
approx(row("WA").minWage, 17.13, "Washington minimum wage");
approx(row("NV").minWage, 12, "Nevada minimum wage");
ok(row("NV").overtime.daily !== null, "Nevada daily overtime");
eq(r.rows.map((x) => x.abbr).join(","), "AK,CA,CO,ME,NV,NY,TX,WA", "rows are alphabetical by state name");

eq(r.highlights.lowestMinWage.wage, 7.25, "lowest minimum wage");
eq(r.highlights.lowestMinWage.states.join(","), "Texas", "lowest minimum wage state");
approx(r.highlights.highestMinWage.wage, 17.13, "highest minimum wage");
eq(r.highlights.highestMinWage.states.join(","), "Washington", "highest minimum wage state");
eq(r.highlights.aboveFederal, 7, "seven of the eight sit above the federal floor");
eq(r.highlights.dailyOvertime.join(","), "Alaska,California,Colorado,Nevada", "daily overtime states");
eq(r.highlights.noTipCredit.join(","), "Alaska,California,Nevada,Washington", "no-tip-credit states");
eq(r.federal.minWage, FEDERAL.minWage, "federal baseline minimum wage comes from lib/federal");
ok(r.federal.exemptSalary.includes("35,568"), "federal exempt salary shown");
ok(r.disclaimer.includes("not legal or tax advice") && r.disclaimer.includes("not a law firm"), "disclaimer present");
ok(r.effectiveNote.includes("January 1, 2026"), "effective date note present");

// --- every one of the 51 rows matches the data behind the free pages ----------------
const all = buildProReport(STATES);
eq(all.rows.length, 51, "full report has 51 rows");
for (const s of STATES) {
  const x = all.rows.find((y) => y.abbr === s.abbr)!;
  approx(x.minWage, effectiveMinWage(s), `${s.abbr} minimum wage matches the engine`);
  eq(x.finalPay.fired, getStateByAbbr(s.abbr)!.finalPayFired, `${s.abbr} final pay (fired) matches`);
  eq(x.finalPay.quit, s.finalPayQuit, `${s.abbr} final pay (quit) matches`);
  eq(x.breaks.meal, s.mealBreak, `${s.abbr} meal break matches`);
  eq(x.breaks.rest, s.restBreak, `${s.abbr} rest break matches`);
  eq(x.tipped.creditAllowed, s.tipCreditAllowed, `${s.abbr} tip credit flag matches`);
  eq(x.overtime.daily, s.dailyOt?.note ?? null, `${s.abbr} daily overtime matches`);
  ok(Number.isFinite(x.minWage) && x.minWage >= FEDERAL.minWage, `${s.abbr} minimum wage is finite and not below federal`);
  ok([x.finalPay.fired, x.finalPay.quit, x.breaks.meal, x.breaks.rest, x.overtime.weekly].every((t) => t.trim().length > 0), `${s.abbr} has no empty rule text`);
  ok(x.refs.finalPayAndBreaks.length > 0, `${s.abbr} cites a source for final pay and breaks`);
}
const numbers = new Set(all.sources.map((s) => s.n));
eq(numbers.size, all.sources.length, "source numbers are unique");
ok(all.sources.every((s, i) => s.n === i + 1 && s.url.startsWith("https://")), "sources are numbered in order and are https");
ok(all.rows.every((x) => [...x.refs.wage, ...x.refs.overtime, ...x.refs.finalPayAndBreaks].every((n) => numbers.has(n))), "every cited number resolves to a source");
eq(new Set(all.sources.map((s) => s.url)).size, all.sources.length, "no source is listed twice");
ok(all.rows.every((x) => x.refs.finalPayAndBreaks.every((n, i, a) => i === 0 || n > a[i - 1])), "each row lists its source numbers in ascending order with no repeats");
ok(!r.federal.overtime.includes("("), "the federal overtime line carries no stray parenthetical");
eq(all.sources[0].url, WAGE_SOURCES.minWage.url, "source 1 is the DOL minimum wage page");
eq(all.sources[1].url, WAGE_SOURCES.overtime.url, "source 2 is the DOL overtime page");

// --- deterministic and safe on empty input ------------------------------------------
eq(JSON.stringify(buildProReport(parseStates("NY,CA"))), JSON.stringify(buildProReport(parseStates("CA,NY"))), "same states in any order build the same report");
const empty = buildProReport([]);
eq(empty.rows.length, 0, "no states gives no rows");
eq(empty.highlights.lowestMinWage.wage, 0, "empty report has no NaN");

// --- locked-state copy: every reason has plain words, no em dashes ------------------
const reasons = ["no_session", "bad_session", "not_configured", "not_paid", "wrong_product", "wrong_mode", "http_404", "unreachable", "http_500", "something_new"];
for (const reason of reasons) {
  const c = lockedCopy(reason);
  ok(c.title.length > 0 && c.body.length > 0, `locked copy for ${reason} is filled in`);
  ok(!/[—–]/.test(c.title + c.body), `locked copy for ${reason} has no em or en dash`);
}
ok(lockedCopy("not_configured").body.includes("not switched on") || lockedCopy("not_configured").title.includes("not switched on"), "the not-configured state says so plainly");
eq(lockedCopy("no_session").buy, true, "a visitor with no session is offered the pricing page");
eq(lockedCopy("not_paid").buy, false, "an unpaid session is not told to buy again");

// --- buyer email ---------------------------------------------------------------------
const link = "https://www.wagecoach.com/pro-report?session_id=cs_test_a1B2c3D4e5F6g7H8";
const mail = buildReportEmail({ link, states: ["CA", "NY"] });
ok(mail.text.includes(link) && mail.html.includes(link), "email carries the report link in text and html");
ok(mail.text.includes("CA, NY"), "email names the states");
ok(buildReportEmail({ link, states: [] }).text.includes("Pick your states"), "email without states says to pick them on the page");
ok(!/[—–]/.test(mail.text + mail.html + mail.subject), "email has no em or en dash");
ok(mail.text.includes("not legal or tax advice"), "email keeps the disclaimer");
ok(!buildReportEmail({ link: 'https://x.test/?a="><script>', states: [] }).html.includes("<script>"), "email escapes the link in html");

report("pro-report");

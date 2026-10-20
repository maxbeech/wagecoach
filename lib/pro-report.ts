import { FEDERAL } from "./federal";
import { SITE } from "./site";
import { STATES, effectiveMinWage, type StateLaw } from "./states";

// The $19 Pro report: a multi-state wage & hour compliance report for an employer.
// Built only from the same data the free state pages and calculators use
// (lib/states-data.ts, lib/state-extras.ts, lib/federal.ts), so nothing here is
// written by hand per state. The buyer's one input is the list of states.

export const REPORT_DISCLAIMER =
  "General information, not legal or tax advice. WageCoach is not a law firm. Many cities and counties set higher minimums, and some industries have their own rules. Confirm with your state labor department or an employment attorney before a payroll or legal decision.";

/** Wage sources the repo already cites on /methodology. */
export const WAGE_SOURCES = {
  minWage: { label: "U.S. DOL: Minimum Wage", url: FEDERAL.source },
  overtime: { label: "U.S. DOL: Overtime Pay (FLSA)", url: "https://www.dol.gov/agencies/whd/overtime" },
  stateRates: { label: "GovDocs: 2026 State Minimum Wage Rates", url: "https://www.govdocs.com/state-minimum-wage-rates/" },
} as const;

const MAX_TOKENS = 120;
const MAX_TOKEN_LENGTH = 40;

/**
 * Read a list of states from user or Stripe input: "CA,NY", "ca ny", "new-york", or
 * repeated query values. Unknown entries are dropped, duplicates collapse, and the
 * result follows STATES order (alphabetical), so the same choice always builds the
 * same report.
 */
export function parseStates(input: string | string[] | null | undefined): StateLaw[] {
  const parts = Array.isArray(input) ? input : [input ?? ""];
  const wanted = new Set(
    parts
      .flatMap((p) => String(p).split(/[\s,]+/))
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && t.length <= MAX_TOKEN_LENGTH)
      .slice(0, MAX_TOKENS),
  );
  return STATES.filter((s) => wanted.has(s.abbr.toLowerCase()) || wanted.has(s.slug));
}

/** The compact form stored in Stripe metadata and used in URLs: "CA,NY,TX". */
export function statesParam(states: StateLaw[]): string {
  return states.map((s) => s.abbr).join(",");
}

export interface ReportRow {
  slug: string;
  name: string;
  abbr: string;
  minWage: number;
  /** "federal" when the state has no minimum-wage law or does not exceed the federal floor. */
  minWageBasis: "state" | "federal";
  minWageNote?: string;
  tipped: { creditAllowed: boolean; cashWage: number | null; note?: string };
  overtime: { weekly: string; daily: string | null; doubleTime: string | null };
  finalPay: { fired: string; quit: string };
  breaks: { meal: string; rest: string };
  /** Numbers into ProReport.sources, one list per rule group. */
  refs: { wage: number[]; overtime: number[]; finalPayAndBreaks: number[] };
}

export interface ReportSource { n: number; label: string; url: string }

export interface ProReport {
  dataYear: number;
  effectiveNote: string;
  federal: { minWage: number; tippedCashWage: number; maxTipCredit: number; overtime: string; exemptSalary: string };
  rows: ReportRow[];
  highlights: {
    lowestMinWage: { wage: number; states: string[] };
    highestMinWage: { wage: number; states: string[] };
    aboveFederal: number;
    dailyOvertime: string[];
    noTipCredit: string[];
  };
  sources: ReportSource[];
  disclaimer: string;
}

function hostLabel(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

/** Build the report for these states. Pure: same states in, same report out. */
export function buildProReport(states: StateLaw[]): ProReport {
  const sources: ReportSource[] = [];
  // Numbers sources in the order they are first cited, and reuses a number for a repeat.
  const refFor = (url: string, label: string = hostLabel(url)): number => {
    const known = sources.find((s) => s.url === url);
    if (known) return known.n;
    sources.push({ n: sources.length + 1, label, url });
    return sources.length;
  };
  // The wage sources are registered first so they are always numbered 1 to 3.
  const wageRef = refFor(WAGE_SOURCES.minWage.url, WAGE_SOURCES.minWage.label);
  const overtimeRef = refFor(WAGE_SOURCES.overtime.url, WAGE_SOURCES.overtime.label);
  const ratesRef = refFor(WAGE_SOURCES.stateRates.url, WAGE_SOURCES.stateRates.label);

  const overtimeWeekly = `${FEDERAL.otMultiplier}× the regular rate over ${FEDERAL.weeklyOtThreshold} hours in a workweek`;

  const rows: ReportRow[] = states.map((s) => ({
    slug: s.slug,
    name: s.name,
    abbr: s.abbr,
    minWage: effectiveMinWage(s),
    minWageBasis: s.noStateLaw || s.minWage <= FEDERAL.minWage ? "federal" : "state",
    minWageNote: s.minWageNote,
    tipped: { creditAllowed: s.tipCreditAllowed, cashWage: s.tippedCashWage, note: s.tippedNote },
    overtime: { weekly: overtimeWeekly, daily: s.dailyOt?.note ?? null, doubleTime: s.doubleTime ?? null },
    finalPay: { fired: s.finalPayFired, quit: s.finalPayQuit },
    breaks: { meal: s.mealBreak, rest: s.restBreak },
    refs: { wage: [wageRef, ratesRef], overtime: [overtimeRef], finalPayAndBreaks: [...new Set(s.extraSources.map((url) => refFor(url)))].sort((a, b) => a - b) },
  }));

  const wages = rows.map((r) => r.minWage);
  const low = wages.length ? Math.min(...wages) : 0;
  const high = wages.length ? Math.max(...wages) : 0;

  return {
    dataYear: SITE.dataYear,
    effectiveNote: `Rates are the ${SITE.dataYear} statewide figures, effective January 1, ${SITE.dataYear} unless a note gives another date.`,
    federal: {
      minWage: FEDERAL.minWage,
      tippedCashWage: FEDERAL.tippedCashWage,
      maxTipCredit: FEDERAL.maxTipCredit,
      overtime: overtimeWeekly,
      exemptSalary: `$${FEDERAL.exemptWeeklySalary} per week ($${FEDERAL.exemptAnnualSalary.toLocaleString("en-US")} per year), plus a duties test`,
    },
    rows,
    highlights: {
      lowestMinWage: { wage: low, states: rows.filter((r) => r.minWage === low).map((r) => r.name) },
      highestMinWage: { wage: high, states: rows.filter((r) => r.minWage === high).map((r) => r.name) },
      aboveFederal: rows.filter((r) => r.minWage > FEDERAL.minWage).length,
      dailyOvertime: rows.filter((r) => r.overtime.daily).map((r) => r.name),
      noTipCredit: rows.filter((r) => !r.tipped.creditAllowed).map((r) => r.name),
    },
    sources,
    disclaimer: REPORT_DISCLAIMER,
  };
}

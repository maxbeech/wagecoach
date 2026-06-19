import type { FaqItem } from "./faq";
import type { PayInputs } from "./overtime";

// The calculator catalog. Each entry powers a /calculators/[slug] page and the
// homepage tool grid. `tool` selects which interactive component renders.
export type ToolKind = "pay" | "salary" | "minwage" | "tipped" | "exempt" | "pto" | "finalpay";

export interface CalcDef {
  slug: string;
  name: string; // short label for grids
  keyword: string; // primary target keyword
  h1: string;
  meta: string;
  intro: string;
  focus: string; // what's distinct about this page (shown as a chip)
  tool: ToolKind;
  seed?: Partial<PayInputs>; // preset for the pay tool
  notes: string[];
  faqs: FaqItem[];
}

const f = (q: string, a: string): FaqItem => ({ q, a });

export const CALCULATORS: CalcDef[] = [
  {
    slug: "overtime-calculator",
    name: "Overtime calculator",
    keyword: "overtime calculator",
    h1: "Overtime Pay Calculator",
    meta: "Free overtime calculator. Enter your hourly rate and hours worked to see your regular pay, time-and-a-half overtime and total gross, with federal FLSA and state daily-overtime rules applied.",
    intro: "Work out your overtime pay from your hourly rate and hours worked this week. Overtime is 1.5× your regular rate over 40 hours under federal law; pick your state for daily-overtime and double-time rules.",
    focus: "Federal 40-hour rule plus state daily overtime",
    tool: "pay",
    seed: { hourlyRate: 20, hoursThisWeek: 48, otMultiplier: 1.5 },
    notes: [
      "Federal overtime is 1.5× the regular rate for hours over 40 in a single workweek (29 USC 207).",
      "California, Alaska, Nevada and Colorado also require daily overtime. Switch on \"hours per day\" after choosing the state.",
      "Overtime is based on the regular rate, which can be higher than the base hourly rate if you earn nondiscretionary bonuses or shift differentials.",
    ],
    faqs: [
      f("How do I calculate overtime for 45 hours at $20/hour?", "40 hours at $20 = $800, plus 5 overtime hours at $30 (1.5×) = $150, for $950 gross before taxes."),
      f("Does overtime start after 8 hours a day?", "Only in daily-overtime states (California, Alaska, Nevada, Colorado). Everywhere else, federal overtime starts after 40 hours in a week regardless of daily hours."),
    ],
  },
  {
    slug: "time-and-a-half-calculator",
    name: "Time and a half",
    keyword: "time and a half calculator",
    h1: "Time and a Half Calculator",
    meta: "Time and a half calculator: multiply your hourly rate by 1.5 and see your overtime and total pay for the hours you worked. Free, with state rules.",
    intro: "Time and a half is 1.5× your hourly rate. Enter your wage and hours to see your overtime rate and what you should be paid for the week.",
    focus: "The 1.5× overtime premium, shown per hour and per week",
    tool: "pay",
    seed: { hourlyRate: 18, hoursThisWeek: 46, otMultiplier: 1.5 },
    notes: [
      "Time and a half = hourly rate × 1.5. At $18/hr that is $27 per overtime hour.",
      "It applies to hours over 40 in a workweek under the FLSA (and over 8/day in daily-overtime states).",
    ],
    faqs: [
      f("What is time and a half for $15 an hour?", "$15 × 1.5 = $22.50 per overtime hour."),
      f("Is time and a half required for weekends or holidays?", "Not under federal law. There is no federal requirement for extra pay on weekends or holidays unless those hours push you over 40 for the week. Holiday premium pay is set by your employer's policy or contract."),
    ],
  },
  {
    slug: "double-time-calculator",
    name: "Double time",
    keyword: "double time calculator",
    h1: "Double Time Pay Calculator",
    meta: "Double time calculator: work out pay at 2× your hourly rate for overtime, holidays or California's over-12-hours rule.",
    intro: "Double time is 2× your regular rate. Use this for employer holiday/double-time policies, or California's daily double-time rule (over 12 hours in a day, or over 8 on the 7th straight day).",
    focus: "Pay at 2× the regular rate",
    tool: "pay",
    seed: { hourlyRate: 25, hoursThisWeek: 45, otMultiplier: 2 },
    notes: [
      "Double time = hourly rate × 2. Federal law does not require it; California is the only state that mandates daily double time.",
      "In California, hours over 12 in a workday are 2×, and on the 7th consecutive workday, hours beyond 8 are 2×. Pick California and use hours-per-day to apply it.",
    ],
    faqs: [
      f("When is double time required?", "Only California requires it (over 12 hrs/day, or beyond 8 hrs on a 7th straight workday). Otherwise double time is an employer policy or union contract term."),
    ],
  },
  {
    slug: "salary-to-hourly-calculator",
    name: "Salary ↔ hourly",
    keyword: "salary to hourly calculator",
    h1: "Salary to Hourly Calculator",
    meta: "Convert an annual salary to an hourly rate (or hourly to salary), with weekly, biweekly, semi-monthly, monthly and annual pay shown. Free, instant.",
    intro: "Convert between an annual salary and an hourly wage, and see your pay across every common pay period. Adjust hours per week and weeks per year for part-time or seasonal work.",
    focus: "Salary ↔ hourly, plus every pay period",
    tool: "salary",
    notes: [
      "Annual ÷ (hours per week × weeks per year) = hourly rate. The default 40 hrs × 52 weeks = 2,080 hours a year.",
      "Biweekly pay = annual ÷ 26; semi-monthly = annual ÷ 24; monthly = annual ÷ 12.",
      "These are gross figures before taxes. This is not a take-home/withholding calculator.",
    ],
    faqs: [
      f("What is $60,000 a year per hour?", "At 40 hours a week for 52 weeks (2,080 hours), $60,000 a year is about $28.85 an hour."),
      f("How do I convert hourly pay to salary?", "Multiply your hourly rate by the hours you work per week, then by the weeks you work per year. $25/hr × 40 × 52 = $52,000 a year."),
      f("Is this my take-home pay?", "No. These are gross amounts before income tax, Social Security, Medicare and other deductions are withheld."),
    ],
  },
  {
    slug: "minimum-wage-calculator",
    name: "Minimum wage by state",
    keyword: "minimum wage by state",
    h1: "2026 Minimum Wage by State",
    meta: "2026 minimum wage by state. Look up your state's minimum wage, tipped-employee cash wage and overtime rules. Updated for January 2026.",
    intro: "Pick your state to see the 2026 minimum wage, the tipped cash wage, and the overtime, final-paycheck and break rules that go with it.",
    focus: "2026 state minimum and tipped wages",
    tool: "minwage",
    notes: [
      "The federal minimum wage is $7.25/hour. Thirty states plus DC are higher.",
      "Many cities and counties set a higher local minimum than their state, so confirm your locality.",
    ],
    faqs: [
      f("Which state has the highest minimum wage in 2026?", "Washington, D.C. at $17.95/hour, followed by Washington State ($17.13) and Connecticut ($16.94)."),
      f("Can my city's minimum wage be higher than my state's?", "Yes. Cities like Seattle, Denver, New York City, West Hollywood and many others set higher local minimums. The highest applicable rate is the one that applies to you."),
    ],
  },
  {
    slug: "tipped-wage-calculator",
    name: "Tipped wage check",
    keyword: "tipped minimum wage",
    h1: "Tipped Minimum Wage Calculator",
    meta: "Check whether your cash wage plus tips meets the minimum wage. Tip-credit calculator for all 50 states, with the no-tip-credit states flagged.",
    intro: "Tipped employees must still earn at least the full minimum wage once tips are counted. Enter your cash wage, hours and tips to see your effective hourly rate and any make-up pay your employer owes.",
    focus: "Cash wage + tips vs. the minimum wage",
    tool: "tipped",
    notes: [
      "Federally, the tipped cash wage can be as low as $2.13/hr, but cash wage + tips must reach $7.25. If not, the employer makes up the difference.",
      "Seven states do not allow a tip credit: California, Oregon, Washington, Nevada, Montana, Minnesota and Alaska. In those states the full minimum wage must be paid in cash before tips.",
    ],
    faqs: [
      f("What happens if my tips don't bring me to minimum wage?", "Your employer must make up the difference so your total reaches at least the applicable minimum wage for every hour worked."),
    ],
  },
  {
    slug: "exempt-salary-calculator",
    name: "Exempt salary check",
    keyword: "exempt vs non-exempt calculator",
    h1: "Exempt vs Non-Exempt Salary Calculator",
    meta: "Check whether a salary meets the federal (or your state's) overtime-exemption threshold. 2026 FLSA salary test with state thresholds flagged.",
    intro: "To be exempt from overtime, an employee must clear a salary threshold AND pass a duties test. Enter an annual salary to check it against the 2026 federal threshold and your state's.",
    focus: "The $35,568 federal salary test (and higher state thresholds)",
    tool: "exempt",
    notes: [
      "The federal salary threshold is $684/week = $35,568/year. The 2024 increase was struck down in court in November 2024, reverting to this level.",
      "Salary is only half the test. The employee must also perform exempt executive, administrative or professional duties.",
      "California, New York, Washington, Colorado, Alaska and Maine set higher salary thresholds.",
    ],
    faqs: [
      f("Does meeting the salary threshold make me exempt?", "No. You must also pass the duties test. Many salaried employees are still non-exempt and owed overtime."),
    ],
  },
  {
    slug: "pto-payout-calculator",
    name: "PTO payout",
    keyword: "pto payout calculator",
    h1: "PTO Payout Calculator",
    meta: "Calculate the cash value of unused PTO or vacation hours, and see whether your state requires payout on separation.",
    intro: "Estimate what your accrued, unused PTO is worth, and check whether your state requires it to be paid out when you leave a job.",
    focus: "Cash value of accrued PTO + state payout rules",
    tool: "pto",
    notes: [
      "PTO payout = accrued unused hours × your hourly rate.",
      "California, Colorado, Montana and Nebraska treat earned vacation as wages that must be paid out. Most other states leave it to company policy.",
    ],
    faqs: [
      f("Does my employer have to pay out unused vacation?", "It depends on your state and your employer's written policy. Four states (CA, CO, MT, NE) require payout of earned vacation; elsewhere it follows company policy."),
    ],
  },
  {
    slug: "final-paycheck-calculator",
    name: "Final paycheck deadline",
    keyword: "final paycheck laws by state",
    h1: "Final Paycheck Laws by State",
    meta: "When is your final paycheck due? Look up the final-paycheck deadline for being fired or quitting in any state.",
    intro: "The deadline to receive your last paycheck depends on your state and whether you were fired or quit. Pick your state to see both deadlines.",
    focus: "Final-pay deadlines for fired vs. quit",
    tool: "finalpay",
    notes: [
      "Some states require immediate payment when you're fired (California, Colorado, Massachusetts, Montana).",
      "Many states default to the next regular payday for both fired and quit.",
    ],
    faqs: [
      f("When do I get my last paycheck if I'm fired?", "It varies by state, from immediately (California) to the next regular payday. Select your state to see the exact deadline."),
    ],
  },
];

export function getCalc(slug: string): CalcDef | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

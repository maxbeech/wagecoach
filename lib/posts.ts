// SEO guides. Each post renders as headings + paragraphs (no markdown dep).
// Content is original, accurate, cites the FLSA / state rules, and links to the
// relevant calculator via `related` (single-source slugs from lib/calculators).
export interface PostSection { h?: string; p: string[] }
export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMins: number;
  keyword: string;
  related?: string[];
  body: PostSection[];
}

const D = "2026-06-15";

export const POSTS: Post[] = [
  {
    slug: "how-to-calculate-overtime-pay",
    title: "How to Calculate Overtime Pay (2026 Guide)",
    description: "A step-by-step guide to calculating overtime under the FLSA: the 40-hour rule, the regular rate, time and a half, and the states that require daily overtime.",
    date: D, readMins: 6, keyword: "how to calculate overtime pay", related: ["overtime-calculator", "time-and-a-half-calculator"],
    body: [
      { p: ["Overtime pay is extra wages for working long hours. Under the federal Fair Labor Standards Act (FLSA), most hourly (non-exempt) employees must be paid 1.5 times their regular rate for every hour over 40 in a single workweek. Here is how to work it out."] },
      { h: "Step 1 — Find your regular rate", p: ["Start with your regular hourly rate. If you only earn a flat hourly wage, that is your regular rate. If you also earn nondiscretionary bonuses, commissions or shift differentials, those are added in and the regular rate can be higher than your base wage — overtime is calculated on the higher figure."] },
      { h: "Step 2 — Count hours over 40 in the workweek", p: ["Overtime is based on a single, fixed seven-day workweek — not a pay period. Add up the hours you worked in that week. Anything over 40 is overtime. Paid time off and holidays you didn't work don't count toward the 40."] },
      { h: "Step 3 — Multiply overtime hours by 1.5× the rate", p: ["Overtime hours are paid at 1.5 × your regular rate. Example: at $20/hour for 46 hours, you earn 40 × $20 = $800 plus 6 × $30 = $180, for $980 gross. Use the overtime calculator to do this instantly and apply your state's rules."] },
      { h: "Watch for daily overtime states", p: ["California, Alaska, Nevada and Colorado require overtime based on hours per DAY, not just per week — and California adds double time. In those states you may earn overtime even in a week under 40 hours. Pick your state in the calculator and enter your daily hours."] },
    ],
  },
  {
    slug: "what-is-time-and-a-half",
    title: "What Is Time and a Half? (And How to Calculate It)",
    description: "Time and a half means 1.5× your hourly rate. Learn when it applies, how to calculate it for any wage, and common myths about weekends and holidays.",
    date: D, readMins: 4, keyword: "what is time and a half", related: ["time-and-a-half-calculator", "overtime-calculator"],
    body: [
      { p: ["\"Time and a half\" is the everyday name for the standard overtime premium: 1.5 times your regular hourly rate. It is what the FLSA requires for hours worked over 40 in a workweek."] },
      { h: "How to calculate it", p: ["Multiply your hourly rate by 1.5. At $16/hour, time and a half is $24/hour. At $22/hour it is $33/hour. For a week with overtime, pay the first 40 hours at the regular rate and the rest at time and a half."] },
      { h: "When does time and a half apply?", p: ["Federally, only for hours over 40 in a week. There is no federal rule requiring extra pay just because you worked a weekend, a holiday, or a night shift — unless those hours push you past 40. Some employers and union contracts pay a premium for holidays or weekends voluntarily, and a few states have daily overtime rules."] },
    ],
  },
  {
    slug: "minimum-wage-2026-by-state",
    title: "2026 Minimum Wage by State: The Complete List",
    description: "Every state's 2026 minimum wage, from the federal $7.25 floor up to $17.95 in Washington, D.C. — plus which states raised pay in January 2026.",
    date: D, readMins: 6, keyword: "minimum wage 2026 by state", related: ["minimum-wage-calculator", "overtime-calculator"],
    body: [
      { p: ["The federal minimum wage is $7.25/hour and has not changed since 2009. But 30 states plus Washington, D.C. set a higher minimum, and 19 states raised their rate on January 1, 2026. Here is how the country looks in 2026."] },
      { h: "The highest minimum wages", p: ["Washington, D.C. leads at $17.95/hour, followed by Washington State ($17.13), Connecticut ($16.94), California ($16.90) and New York ($17.00 in the NYC area, $16.00 upstate). Many cities go even higher than their state."] },
      { h: "States still at $7.25", p: ["Twenty states use the federal $7.25 minimum, including Texas, Pennsylvania, Wisconsin, Georgia and most of the South. Georgia and Wyoming have a state rate of $5.15 on the books, but the federal $7.25 applies to covered employers."] },
      { h: "Mid-year increases to watch", p: ["A few states raise wages later in 2026: Alaska reaches $14.00 on July 1, Oregon and Nevada re-index on July 1, and Florida climbs to $15.00 on September 30. Pick your state for the exact current figure and the tipped-wage rules."] },
    ],
  },
  {
    slug: "exempt-vs-non-exempt-employees",
    title: "Exempt vs Non-Exempt: Who Gets Overtime?",
    description: "The difference between exempt and non-exempt employees, the 2026 salary threshold, and why a salary alone doesn't make you exempt from overtime.",
    date: D, readMins: 5, keyword: "exempt vs non exempt", related: ["exempt-salary-calculator", "overtime-calculator"],
    body: [
      { p: ["Whether you get overtime comes down to one word: exempt. Non-exempt employees must be paid overtime; exempt employees are not entitled to it. Many people are misclassified, so it pays to understand the test."] },
      { h: "The two-part test", p: ["To be exempt from overtime under the FLSA, an employee must (1) be paid a fixed salary of at least $684/week — $35,568/year — and (2) actually perform exempt executive, administrative or professional duties. Both parts must be met. The 2024 rule that would have raised the salary line was struck down in court in November 2024, so the threshold is back to $35,568."] },
      { h: "Salary alone is not enough", p: ["A common myth is that any salaried worker is automatically exempt. Not true. If your duties are routine, or you don't manage others or exercise independent judgment on significant matters, you are likely non-exempt and owed overtime — even on a salary."] },
      { h: "Higher state thresholds", p: ["California, New York, Washington, Colorado, Alaska and Maine set salary thresholds higher than the federal figure. California's is 2× the state minimum wage for full-time work — $70,304/year in 2026. Check a salary against both with the exempt-salary calculator."] },
    ],
  },
  {
    slug: "final-paycheck-laws-by-state",
    title: "Final Paycheck Laws: When Is Your Last Check Due?",
    description: "Final-paycheck deadlines by state for employees who are fired versus those who quit — from immediate payment to the next regular payday.",
    date: D, readMins: 5, keyword: "final paycheck laws", related: ["final-paycheck-calculator"],
    body: [
      { p: ["When your job ends, your employer can't sit on your last paycheck indefinitely. State law sets a deadline — and it often depends on whether you were fired or quit."] },
      { h: "Fired or laid off", p: ["Several states require your final pay immediately or within a day or two of termination — California (immediately), Colorado, Massachusetts and Montana are the strictest. Many other states require it by the next regular payday."] },
      { h: "If you quit", p: ["Deadlines for quitting are usually more relaxed — commonly the next regular payday. California gives 72 hours (or immediately if you gave 72 hours' notice). Giving notice can speed up your final check in some states."] },
      { h: "What counts as final pay", p: ["Final pay includes earned wages and, in states like California, Colorado, Montana and Nebraska, any accrued unused vacation, which is treated as wages. Look up your state's exact deadline with the final-paycheck calculator."] },
    ],
  },
  {
    slug: "tipped-minimum-wage-and-tip-credit",
    title: "Tipped Minimum Wage & the Tip Credit Explained",
    description: "How the tip credit works, the $2.13 federal cash wage, and the seven states that ban the tip credit and require the full minimum wage before tips.",
    date: D, readMins: 5, keyword: "tipped minimum wage", related: ["tipped-wage-calculator", "minimum-wage-calculator"],
    body: [
      { p: ["Tipped workers are covered by the minimum wage too — but the rules let employers count tips toward it. Understanding the tip credit helps you check you're being paid legally."] },
      { h: "The federal tip credit", p: ["Federally, an employer can pay a cash wage as low as $2.13/hour and take a \"tip credit\" of up to $5.12 for the tips you earn. But your cash wage plus tips must reach at least $7.25 for every hour. If your tips fall short, the employer must make up the difference."] },
      { h: "States that ban the tip credit", p: ["Seven states do not allow any tip credit: California, Oregon, Washington, Nevada, Montana, Minnesota and Alaska. There, you must be paid the full state minimum wage in cash, and tips are on top. Other states set their own tipped cash wage between $2.13 and the full minimum."] },
      { h: "Check your pay", p: ["Enter your cash wage, hours and tips into the tipped-wage calculator. It works out your effective hourly rate and flags any make-up pay your employer owes to reach the minimum wage."] },
    ],
  },
  {
    slug: "california-overtime-rules",
    title: "California Overtime Rules: Daily OT, Double Time & the 7th Day",
    description: "California's overtime rules go beyond the federal 40-hour week: 1.5× over 8 hours a day, 2× over 12, and special pay on the 7th consecutive workday.",
    date: D, readMins: 6, keyword: "california overtime rules", related: ["overtime-calculator", "double-time-calculator"],
    body: [
      { p: ["California has the most generous overtime rules in the country. If you work in California, you can earn overtime even in a week under 40 hours, because California counts hours per day."] },
      { h: "Daily overtime and double time", p: ["You earn 1.5× your regular rate for hours over 8 in a workday, and 2× (double time) for hours over 12 in a single day. You also earn 1.5× for hours over 40 in the week, whichever produces more pay — without double-counting the same hours."] },
      { h: "The 7th consecutive day", p: ["If you work all seven days in a workweek, the 7th day is special: the first 8 hours are paid at 1.5×, and any hours beyond 8 that day are paid at 2×."] },
      { h: "Calculate it", p: ["Pick California in the overtime calculator and switch on \"hours per day\" to apply the daily, double-time and 7th-day rules automatically. Alaska, Nevada and Colorado also have daily overtime, though only California has double time."] },
    ],
  },
  {
    slug: "do-salaried-employees-get-overtime",
    title: "Do Salaried Employees Get Overtime?",
    description: "Yes — many salaried workers are owed overtime. Learn when salaried employees qualify for overtime and how to check your own classification.",
    date: D, readMins: 4, keyword: "do salaried employees get overtime", related: ["exempt-salary-calculator", "overtime-calculator"],
    body: [
      { p: ["A salary does not automatically remove your right to overtime. Whether a salaried employee gets overtime depends on whether they are exempt or non-exempt — and a surprising number of salaried workers are non-exempt."] },
      { h: "When salaried workers are owed overtime", p: ["If your salary is below $684/week ($35,568/year), you are non-exempt and owed overtime no matter your title. Even above that, if your duties don't meet the executive, administrative or professional tests, you are still non-exempt and entitled to 1.5× pay over 40 hours."] },
      { h: "How to check", p: ["Use the exempt-salary calculator to test your salary against the federal threshold and your state's. Remember it is only the first half of the test — your actual duties decide the rest."] },
    ],
  },
  {
    slug: "how-to-calculate-double-time",
    title: "How to Calculate Double Time Pay",
    description: "Double time means 2× your hourly rate. Learn when it's required (mostly California), when it's just employer policy, and how to calculate it.",
    date: D, readMins: 4, keyword: "how to calculate double time", related: ["double-time-calculator", "overtime-calculator"],
    body: [
      { p: ["Double time is exactly what it sounds like: twice your regular hourly rate. At $25/hour, double time is $50/hour. It is much rarer than time and a half."] },
      { h: "When double time is required", p: ["Federal law does not require double time at all. California is the only state that mandates it: for hours over 12 in a workday, and for hours beyond 8 on the 7th consecutive day in a week. Everywhere else, double time only applies if your employer's policy or union contract provides it — often for holidays."] },
      { h: "Calculating it", p: ["Multiply your rate by 2 for each double-time hour. In the calculator, choose the 2× multiplier for an employer holiday policy, or pick California and enter daily hours to apply the legal double-time rule automatically."] },
    ],
  },
  {
    slug: "pto-payout-use-it-or-lose-it",
    title: "PTO Payout & 'Use It or Lose It': What Your State Requires",
    description: "Whether unused PTO must be paid out when you leave a job — the four states that require it, and how to value your accrued vacation.",
    date: D, readMins: 4, keyword: "pto payout by state", related: ["pto-payout-calculator", "final-paycheck-calculator"],
    body: [
      { p: ["When you leave a job with unused vacation, do you get paid for it? It depends on your state and your employer's policy."] },
      { h: "States that require payout", p: ["California, Colorado, Montana and Nebraska treat earned vacation as wages — it cannot be forfeited, and unused, accrued PTO must be paid out when you leave. California, Colorado and Montana also ban true \"use it or lose it\" policies that wipe out earned time."] },
      { h: "Everywhere else", p: ["Most states leave PTO payout to company policy. If your handbook says unused PTO is paid out, that promise is generally enforceable. Value your balance with the PTO payout calculator (hours × hourly rate)."] },
    ],
  },
  {
    slug: "multi-state-overtime-compliance",
    title: "Overtime & Wage Compliance for Multi-State and Remote Teams",
    description: "Remote teams trigger the wage and hour laws of every state employees work in. A practical guide to staying compliant across jurisdictions.",
    date: D, readMins: 6, keyword: "multi state labor law compliance", related: ["minimum-wage-calculator", "overtime-calculator", "final-paycheck-calculator"],
    body: [
      { p: ["Hire someone in another state and you take on that state's wage and hour rules — minimum wage, overtime, final-pay deadlines, breaks and PTO payout. For remote teams spread across the country, that's a lot to track."] },
      { h: "The wage applies where the employee works", p: ["Pay is generally governed by the laws of the state (and city) where the employee physically works, not where the company is based. A New York company with a worker in Seattle owes Washington's $17.13 minimum and Washington's no-tip-credit and break rules."] },
      { h: "Overtime varies too", p: ["Most states follow the federal 40-hour week, but California, Alaska, Nevada and Colorado have daily overtime and California has double time. A single payroll policy can under- or over-pay depending on the state."] },
      { h: "Build a per-state reference", p: ["Use the per-state pages to capture each employee's minimum wage, overtime rule, final-pay deadline and breaks in one place. The Pro multi-state report compiles them for your whole team."] },
    ],
  },
  {
    slug: "january-2026-minimum-wage-increases",
    title: "January 2026 Minimum Wage Increases: Who Got a Raise",
    description: "Nineteen states raised their minimum wage on January 1, 2026. See the new rates and what they mean for workers and employers.",
    date: D, readMins: 5, keyword: "2026 minimum wage increase", related: ["minimum-wage-calculator"],
    body: [
      { p: ["On January 1, 2026, 19 states raised their minimum wage, lifting pay for millions of workers. Most increases are tied to inflation; a few came from ballot measures phasing toward $15 or higher."] },
      { h: "Notable 2026 rates", p: ["Among the January increases: Arizona $15.15, California $16.90, Colorado $15.16, Connecticut $16.94, Missouri $15.00, Nebraska $15.00, New Jersey $15.92, Rhode Island $16.00 and Washington $17.13. Washington, D.C. remains highest at $17.95."] },
      { h: "More raises later in 2026", p: ["Alaska rises to $14.00 on July 1, Florida to $15.00 on September 30, and Oregon and Nevada re-index mid-year. Check your state for the exact current figure and effective date."] },
      { h: "What employers should do", p: ["If you employ workers in any state that raised its minimum, update payroll, re-check tipped-employee cash wages, and confirm exempt salaries still clear the threshold. The state pages and calculators here are built for exactly that."] },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

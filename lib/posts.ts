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
      { h: "Step 1: Find your regular rate", p: ["Start with your regular hourly rate. If you only earn a flat hourly wage, that is your regular rate. If you also earn nondiscretionary bonuses, commissions or shift differentials, those are added in and the regular rate can be higher than your base wage. Overtime is calculated on the higher figure."] },
      { h: "Step 2: Count hours over 40 in the workweek", p: ["Overtime is based on a single, fixed seven-day workweek, not a pay period. Add up the hours you worked in that week. Anything over 40 is overtime. Paid time off and holidays you didn't work don't count toward the 40."] },
      { h: "Step 3: Multiply overtime hours by 1.5× the rate", p: ["Overtime hours are paid at 1.5 × your regular rate. Example: at $20/hour for 46 hours, you earn 40 × $20 = $800 plus 6 × $30 = $180, for $980 gross. Use the overtime calculator to do this instantly and apply your state's rules."] },
      { h: "Watch for daily overtime states", p: ["California, Alaska, Nevada and Colorado require overtime based on hours per DAY, not just per week, and California adds double time. In those states you may earn overtime even in a week under 40 hours. Pick your state in the calculator and enter your daily hours."] },
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
      { h: "When does time and a half apply?", p: ["Federally, only for hours over 40 in a week. There is no federal rule requiring extra pay just because you worked a weekend, a holiday, or a night shift, unless those hours push you past 40. Some employers and union contracts pay a premium for holidays or weekends voluntarily, and a few states have daily overtime rules."] },
    ],
  },
  {
    slug: "minimum-wage-2026-by-state",
    title: "2026 Minimum Wage by State: The Complete List",
    description: "Every state's 2026 minimum wage, from the federal $7.25 floor up to $17.95 in Washington, D.C., plus which states raised pay in January 2026.",
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
      { h: "The two-part test", p: ["To be exempt from overtime under the FLSA, an employee must (1) be paid a fixed salary of at least $684/week ($35,568/year) and (2) actually perform exempt executive, administrative or professional duties. Both parts must be met. The 2024 rule that would have raised the salary line was struck down in court in November 2024, so the threshold is back to $35,568."] },
      { h: "Salary alone is not enough", p: ["A common myth is that any salaried worker is automatically exempt. Not true. If your duties are routine, or you don't manage others or exercise independent judgment on significant matters, you are likely non-exempt and owed overtime, even on a salary."] },
      { h: "Higher state thresholds", p: ["California, New York, Washington, Colorado, Alaska and Maine set salary thresholds higher than the federal figure. California's is 2× the state minimum wage for full-time work, or $70,304/year in 2026. Check a salary against both with the exempt-salary calculator."] },
    ],
  },
  {
    slug: "final-paycheck-laws-by-state",
    title: "Final Paycheck Laws: When Is Your Last Check Due?",
    description: "Final-paycheck deadlines by state for employees who are fired versus those who quit, from immediate payment to the next regular payday.",
    date: D, readMins: 5, keyword: "final paycheck laws", related: ["final-paycheck-calculator"],
    body: [
      { p: ["When your job ends, your employer can't sit on your last paycheck indefinitely. State law sets a deadline, and it often depends on whether you were fired or quit."] },
      { h: "Fired or laid off", p: ["Several states require your final pay immediately or within a day or two of termination. California (immediately), Colorado, Massachusetts and Montana are the strictest. Many other states require it by the next regular payday."] },
      { h: "If you quit", p: ["Deadlines for quitting are usually more relaxed, commonly the next regular payday. California gives 72 hours (or immediately if you gave 72 hours' notice). Giving notice can speed up your final check in some states."] },
      { h: "What counts as final pay", p: ["Final pay includes earned wages and, in states like California, Colorado, Montana and Nebraska, any accrued unused vacation, which is treated as wages. Look up your state's exact deadline with the final-paycheck calculator."] },
    ],
  },
  {
    slug: "tipped-minimum-wage-and-tip-credit",
    title: "Tipped Minimum Wage & the Tip Credit Explained",
    description: "How the tip credit works, the $2.13 federal cash wage, and the seven states that ban the tip credit and require the full minimum wage before tips.",
    date: D, readMins: 5, keyword: "tipped minimum wage", related: ["tipped-wage-calculator", "minimum-wage-calculator"],
    body: [
      { p: ["Tipped workers are covered by the minimum wage too, but the rules let employers count tips toward it. Understanding the tip credit helps you check you're being paid legally."] },
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
      { h: "Daily overtime and double time", p: ["You earn 1.5× your regular rate for hours over 8 in a workday, and 2× (double time) for hours over 12 in a single day. You also earn 1.5× for hours over 40 in the week, whichever produces more pay, without double-counting the same hours."] },
      { h: "The 7th consecutive day", p: ["If you work all seven days in a workweek, the 7th day is special: the first 8 hours are paid at 1.5×, and any hours beyond 8 that day are paid at 2×."] },
      { h: "Calculate it", p: ["Pick California in the overtime calculator and switch on \"hours per day\" to apply the daily, double-time and 7th-day rules automatically. Alaska, Nevada and Colorado also have daily overtime, though only California has double time."] },
    ],
  },
  {
    slug: "do-salaried-employees-get-overtime",
    title: "Do Salaried Employees Get Overtime?",
    description: "Yes, many salaried workers are owed overtime. Learn when salaried employees qualify for overtime and how to check your own classification.",
    date: D, readMins: 4, keyword: "do salaried employees get overtime", related: ["exempt-salary-calculator", "overtime-calculator"],
    body: [
      { p: ["A salary does not automatically remove your right to overtime. Whether a salaried employee gets overtime depends on whether they are exempt or non-exempt, and a surprising number of salaried workers are non-exempt."] },
      { h: "When salaried workers are owed overtime", p: ["If your salary is below $684/week ($35,568/year), you are non-exempt and owed overtime no matter your title. Even above that, if your duties don't meet the executive, administrative or professional tests, you are still non-exempt and entitled to 1.5× pay over 40 hours."] },
      { h: "How to check", p: ["Use the exempt-salary calculator to test your salary against the federal threshold and your state's. Remember it is only the first half of the test. Your actual duties decide the rest."] },
    ],
  },
  {
    slug: "how-to-calculate-double-time",
    title: "How to Calculate Double Time Pay",
    description: "Double time means 2× your hourly rate. Learn when it's required (mostly California), when it's just employer policy, and how to calculate it.",
    date: D, readMins: 4, keyword: "how to calculate double time", related: ["double-time-calculator", "overtime-calculator"],
    body: [
      { p: ["Double time is exactly what it sounds like: twice your regular hourly rate. At $25/hour, double time is $50/hour. It is much rarer than time and a half."] },
      { h: "When double time is required", p: ["Federal law does not require double time at all. California is the only state that mandates it: for hours over 12 in a workday, and for hours beyond 8 on the 7th consecutive day in a week. Everywhere else, double time only applies if your employer's policy or union contract provides it, often for holidays."] },
      { h: "Calculating it", p: ["Multiply your rate by 2 for each double-time hour. In the calculator, choose the 2× multiplier for an employer holiday policy, or pick California and enter daily hours to apply the legal double-time rule automatically."] },
    ],
  },
  {
    slug: "pto-payout-use-it-or-lose-it",
    title: "PTO Payout & 'Use It or Lose It': What Your State Requires",
    description: "Whether unused PTO must be paid out when you leave a job: the four states that require it, and how to value your accrued vacation.",
    date: D, readMins: 4, keyword: "pto payout by state", related: ["pto-payout-calculator", "final-paycheck-calculator"],
    body: [
      { p: ["When you leave a job with unused vacation, do you get paid for it? It depends on your state and your employer's policy."] },
      { h: "States that require payout", p: ["California, Colorado, Montana and Nebraska treat earned vacation as wages. It cannot be forfeited, and unused, accrued PTO must be paid out when you leave. California, Colorado and Montana also ban true \"use it or lose it\" policies that wipe out earned time."] },
      { h: "Everywhere else", p: ["Most states leave PTO payout to company policy. If your handbook says unused PTO is paid out, that promise is generally enforceable. Value your balance with the PTO payout calculator (hours × hourly rate)."] },
    ],
  },
  {
    slug: "multi-state-overtime-compliance",
    title: "Overtime & Wage Compliance for Multi-State and Remote Teams",
    description: "Remote teams trigger the wage and hour laws of every state employees work in. A practical guide to staying compliant across jurisdictions.",
    date: D, readMins: 6, keyword: "multi state labor law compliance", related: ["minimum-wage-calculator", "overtime-calculator", "final-paycheck-calculator"],
    body: [
      { p: ["Hire someone in another state and you take on that state's wage and hour rules: minimum wage, overtime, final-pay deadlines, breaks and PTO payout. For remote teams spread across the country, that's a lot to track."] },
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
  {
    slug: "how-to-convert-salary-to-hourly",
    title: "How to Convert a Salary to an Hourly Rate (and Back)",
    description: "The simple formula to convert an annual salary to an hourly wage, why 2,080 hours is the standard year, and how to handle part-time and seasonal work.",
    date: D, readMins: 4, keyword: "convert salary to hourly", related: ["salary-to-hourly-calculator", "overtime-calculator"],
    body: [
      { p: ["Comparing a salaried offer to an hourly one, or budgeting from a salary, is easier once you can convert between the two. The math is straightforward."] },
      { h: "The formula", p: ["Hourly rate = annual salary ÷ (hours per week × weeks per year). For a standard full-time job that's 40 × 52 = 2,080 hours. So a $60,000 salary is $60,000 ÷ 2,080 ≈ $28.85 per hour. To go the other way, multiply: $25/hr × 2,080 = $52,000 a year."] },
      { h: "Why 2,080 hours", p: ["2,080 is the standard full-time work year (40 hours × 52 weeks) and is what most employers and the federal government use. If you take unpaid weeks off, use fewer weeks; if you work part-time, lower the hours per week. Our converter lets you change both."] },
      { h: "Pay periods", p: ["From the annual figure: biweekly = ÷ 26, semi-monthly = ÷ 24, monthly = ÷ 12, weekly = ÷ 52. Remember these are gross amounts; taxes and deductions come out on top."] },
    ],
  },
  {
    slug: "city-vs-state-minimum-wage",
    title: "City vs State Minimum Wage: Which One Applies?",
    description: "When a city or county sets a minimum wage above the state's, the higher local rate wins. How local minimum wages work in Seattle, NYC, LA, Chicago and more.",
    date: D, readMins: 4, keyword: "city minimum wage", related: ["minimum-wage-calculator"],
    body: [
      { p: ["Minimum wage isn't just a federal or state number. Many cities and counties set their own, and where they do, the highest applicable rate is the one you must be paid."] },
      { h: "The highest rate wins", p: ["Federal, state, and local minimum wages stack: an employer must pay whichever is highest. Seattle ($21.30), Tukwila and several California and Colorado cities run well above their state minimum, which is already above the federal $7.25."] },
      { h: "Local rates change often, including mid-year", p: ["Many local minimums re-index to inflation, some on January 1 and others on July 1. Los Angeles, San Francisco, Chicago, Portland and Montgomery County all step up on July 1. Always confirm the current local figure."] },
      { p: ["See our city pages for the 2026 local rate, how far it sits above the state minimum, and a pay calculator pre-set to that state."] },
    ],
  },
];

const WEEK2_POSTS: Post[] = [
  {
    slug: "gross-pay-vs-net-pay",
    title: "Gross Pay vs Net Pay: What's the Difference?",
    description:
      "Gross pay is what you earn; net pay is what you take home. The deductions that bridge the gap — FICA, withholding, and benefits — explained in plain terms.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "gross pay vs net pay",
    related: ["overtime-calculator", "salary-to-hourly-calculator"],
    body: [
      { p: ["Every paycheck shows two totals. Gross pay is the full amount earned before anything is taken out. Net pay — the amount deposited or printed on the check — is what remains after all deductions. The gap can be 20–35% for a typical W-2 employee."] },
      { h: "What comes out of gross pay", p: ["Deductions fall into two buckets: mandatory and voluntary. Mandatory deductions include federal income tax (based on your W-4), Social Security (6.2% on wages up to the annual cap), Medicare (1.45%, plus an additional 0.9% above $200,000), and any state or local income tax. Voluntary deductions include health insurance premiums, 401(k) contributions, FSA/HSA contributions, and union dues."] },
      { h: "Calculating it yourself", p: ["To estimate net pay: start with gross, subtract pre-tax deductions (401k, health premiums), apply the federal and state tax withholding rates from your W-4, and subtract FICA (7.65% total). A net pay that is dramatically lower than expected is usually explained by a high W-4 withholding election or a large voluntary deduction."] },
      { h: "Why it matters for overtime", p: ["Overtime under the FLSA is calculated on your regular rate, which is a gross figure. If you work extra hours your gross pay rises but so do your FICA taxes and income tax withholding. Use the overtime calculator to see both gross and approximate net for any number of overtime hours."] },
    ],
  },
  {
    slug: "how-to-read-a-pay-stub",
    title: "How to Read a Pay Stub: A Field-by-Field Guide",
    description:
      "Every line on a pay stub has a meaning. Here's what gross pay, net pay, FICA, federal and state withholding, YTD, and deduction codes all mean.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "how to read a pay stub",
    related: ["overtime-calculator"],
    body: [
      { p: ["Pay stubs vary by employer and payroll system, but they all contain the same core information. Once you know the categories, any stub becomes readable."] },
      { h: "Earnings section", p: ["Look for 'Regular' (straight-time hours × base rate), 'OT' or 'Overtime' (hours over 40 × 1.5× rate), and any supplemental pay like bonuses, commissions, or shift differentials. The sum of these lines is your gross pay for the period. Year-to-date (YTD) next to each line shows the running total since January 1."] },
      { h: "Tax withholding lines", p: ["'Federal Income Tax' or 'FIT' is withheld based on your W-4 elections and the IRS tables. 'State Income Tax' or 'SIT' applies if your state has income tax. 'OASDI' or 'Social Security' is 6.2% of gross wages up to the taxable wage base (which re-sets each January). 'Med' or 'Medicare' is 1.45%. These four together make up most of the gap between gross and net."] },
      { h: "Deduction codes", p: ["Pre-tax deductions (health insurance, dental, 401k, FSA) reduce your taxable gross before income tax is calculated, which is why they appear above the tax lines. Post-tax deductions (Roth 401k, life insurance, wage garnishments) are taken from after-tax income. A code you don't recognize is usually explained in your employee handbook or HR portal."] },
      { h: "Checking for errors", p: ["Compare your regular hours to what you actually worked. Check that overtime hours match. Verify the correct state appears on the stub, especially if you worked remotely from a different state than usual — that can trigger an incorrect state withholding. If something looks wrong, ask payroll within the same pay period if possible."] },
    ],
  },
  {
    slug: "independent-contractor-vs-employee",
    title: "Independent Contractor vs Employee: Key Differences",
    description:
      "Key differences between independent contractors and employees: who controls the work, who pays taxes, and how to spot worker misclassification.",
    date: "2026-06-20",
    readMins: 5,
    keyword: "independent contractor vs employee",
    related: ["exempt-salary-calculator"],
    body: [
      { p: ["Whether you are an employee or an independent contractor affects your taxes, benefits, and legal protections — including your right to overtime. The label a company puts on you does not control the outcome; the actual facts of the working relationship do."] },
      { h: "The IRS common law test", p: ["The IRS evaluates three categories: behavioral control (does the company control how the work is done?), financial control (is the worker free to work for others, invest in their own tools, profit or lose money?), and type of relationship (written contracts, benefits, permanency). A worker who is told when, where, and how to work — even if paid as a 1099 — looks like an employee under this test."] },
      { h: "The FLSA economic reality test", p: ["For wage and hour purposes, the Department of Labor applies the 'economic reality' test. It asks whether the worker is economically dependent on the company or truly in business for themselves. Courts look at factors like opportunity for profit or loss, permanency of the relationship, and whether the work is integral to the employer's business."] },
      { h: "Why misclassification matters", p: ["An employee misclassified as a contractor loses FLSA overtime protections, minimum wage protections, employer FICA contributions, unemployment insurance, and workers' compensation. For employers, misclassification can result in back wages, back taxes with penalties, and liquidated damages equal to the unpaid overtime."] },
      { h: "What to do if you think you're misclassified", p: ["File a complaint with the Wage and Hour Division (WHD) at dol.gov. The WHD investigates and can order back pay for up to 2 years of unpaid overtime (3 years if the violation was willful). Many states have stricter tests — California's ABC test, for example — that make it even harder to classify workers as independent contractors."] },
    ],
  },
  {
    slug: "break-laws-by-state",
    title: "Break Laws by State: Meal & Rest Breaks Explained",
    description:
      "Federal law does not require rest or meal breaks for adults, but many states do. A state-by-state summary of meal periods and paid rest-break rules.",
    date: "2026-06-20",
    readMins: 5,
    keyword: "break laws by state",
    related: ["overtime-calculator"],
    body: [
      { p: ["The FLSA does not require employers to give adult workers any breaks. But it does say that short breaks of 20 minutes or less must be paid, while a bona fide meal period of 30 minutes or more need not be paid — as long as the employee is fully relieved of duty. Many states go further and actually require breaks."] },
      { h: "States that require meal breaks", p: ["California, New York, Oregon, Washington, Illinois, Colorado, and many other states require a meal period (usually 30 minutes, unpaid) for shifts over a certain length — commonly 5 or 6 hours. California also requires a second meal period for shifts over 10 hours. Missing the break can trigger premium pay obligations equal to one hour of additional wages per missed break."] },
      { h: "States that require paid rest breaks", p: ["California, Washington, Colorado, and a handful of other states require paid rest breaks of at least 10 minutes for every 4 hours worked. These breaks must be uninterrupted and cannot be combined with the meal period. Federal law has no equivalent requirement."] },
      { h: "What happens if breaks are missed", p: ["In states that mandate breaks, failing to provide them creates a wage claim. In California, the penalty is one additional hour of pay at the employee's regular rate for each missed rest break and each missed meal break, per day. In Washington and Colorado similar penalty structures exist."] },
    ],
  },
  {
    slug: "wage-garnishment-rules",
    title: "Wage Garnishment: How Much Can Be Taken?",
    description:
      "Wage garnishment lets a creditor collect a debt directly from your paycheck. Federal law caps the amount; some states cap it lower. Here's how it works.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "wage garnishment rules",
    related: ["final-paycheck-calculator"],
    body: [
      { p: ["Wage garnishment is a court-ordered deduction from your paycheck that goes directly to a creditor. Common sources include unpaid debts, child support, back taxes, and student loan defaults. Federal law sets a ceiling; some states set lower caps."] },
      { h: "Federal limits under the CCPA", p: ["The Consumer Credit Protection Act (CCPA) limits garnishment for ordinary debts (credit cards, medical bills, most civil judgments) to the lesser of: (1) 25% of disposable earnings, or (2) the amount by which disposable earnings exceed 30 times the federal minimum wage ($7.25 × 30 = $217.50/week). Disposable earnings means gross pay minus legally required deductions like FICA and state taxes."] },
      { h: "Child support and spousal maintenance", p: ["Garnishments for child support or alimony have higher limits: up to 50% of disposable earnings if you are supporting another spouse or child, and up to 60% if you are not. An additional 5% may be withheld if payments are more than 12 weeks in arrears."] },
      { h: "State rules can be stricter", p: ["Many states set caps lower than federal law. Texas, for example, exempts wages from most garnishments entirely (other than child support, student loans, and taxes). Pennsylvania, South Carolina, and North Carolina similarly restrict wage garnishment. In these states, creditors typically pursue garnishment of bank accounts instead."] },
    ],
  },
  {
    slug: "travel-time-pay-rules",
    title: "Travel Time Pay: When Are You Owed for Commuting?",
    description:
      "Travel time pay depends on whether travel is before or during your workday. FLSA rules for commuting, day travel, overnight travel, and emergency call-outs.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "travel time pay",
    related: ["overtime-calculator"],
    body: [
      { p: ["Not all time spent traveling for work is compensable under the FLSA. The type of travel and when it occurs determines whether it counts as hours worked toward overtime."] },
      { h: "Ordinary commuting is not paid time", p: ["Travel from home to your regular workplace and back is not compensable, even if you drive a long distance. This holds even if you travel to a different job site each day, as long as you start and end at home — with one exception: if your employer requires you to report to a central location first and then travel to a job site, the travel from the central location to the site is paid time."] },
      { h: "Day travel to another city", p: ["If you travel away from home during your regular working hours — on the day of travel — that time is compensable. If you travel outside your regular hours (e.g., on a Saturday when you do not normally work, or late at night), only the portion that falls within your regular hours must be paid."] },
      { h: "Overnight travel", p: ["For overnight trips, compensable time includes travel that takes place during your regular working hours, on any day of the week including weekends. Time spent sleeping or in personal activities (dining, recreation) is not counted. Time spent driving or on duty during off-hours is generally not compensable unless your employer's policy says otherwise."] },
      { h: "Emergency call-outs", p: ["If you are called back to work after hours, the travel time is compensable if you are traveling a substantial distance or the call-back is unforeseeable and outside regular hours. Travel from home to the worksite in a company-provided vehicle is compensable if it is part of an irregular, out-of-the-ordinary commute."] },
    ],
  },
  {
    slug: "payroll-taxes-explained",
    title: "Payroll Taxes: FICA, Social Security & Medicare",
    description:
      "FICA taxes fund Social Security and Medicare. Employers and employees each pay 7.65% — 6.2% Social Security and 1.45% Medicare — on every paycheck.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "payroll tax calculator",
    related: ["salary-to-hourly-calculator", "overtime-calculator"],
    body: [
      { p: ["FICA stands for the Federal Insurance Contributions Act. Every paycheck from a W-2 job includes two FICA taxes: Social Security (officially OASDI) and Medicare. Both the employee and the employer pay half, so the combined rate on each dollar of wages is 15.3%."] },
      { h: "Employee Social Security tax", p: ["Employees pay 6.2% of gross wages into Social Security, up to the annual taxable wage base (which adjusts annually — in 2026 it is $176,100). Once your wages exceed that cap, no more Social Security tax is owed for the year. High earners effectively pay a lower effective Social Security rate because of the cap."] },
      { h: "Employee Medicare tax", p: ["Employees pay 1.45% of gross wages for Medicare, with no cap. High earners pay an additional 0.9% on wages above $200,000 ($250,000 for married filing jointly) — this Additional Medicare Tax is withheld by the employer on the employee side only; the employer does not match it."] },
      { h: "Self-employed workers pay both sides", p: ["If you are self-employed, you pay the full 15.3% (12.4% Social Security + 2.9% Medicare) on net self-employment income as the SE tax. You can deduct half of SE tax from your federal income tax."] },
      { h: "Employer FICA obligations", p: ["Employers match the employee 6.2% Social Security and 1.45% Medicare contributions, depositing the combined 15.3% (on the employee's wages) to the IRS. Failing to withhold or remit these taxes triggers Trust Fund Recovery Penalties, one of the more serious small-business liabilities."] },
    ],
  },
  {
    slug: "on-call-pay-rules",
    title: "On-Call Pay: Do You Get Paid While on Standby?",
    description:
      "On-call pay depends on whether you are restricted or unrestricted while waiting. The FLSA tests that determine when standby time counts as compensable hours.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "on call pay rules",
    related: ["overtime-calculator"],
    body: [
      { p: ["Whether on-call time is compensable under the FLSA comes down to whether you are 'engaged to wait' (paid) or 'waiting to be engaged' (not paid). The distinction is how restricted you are during the standby period."] },
      { h: "When on-call time is paid", p: ["If you must stay on or near the premises, respond within a very short time window (minutes), cannot use the time effectively for personal activities, and are frequently called back, courts have generally found the on-call time to be hours worked. A nurse required to stay in the break room between calls, for example, is likely compensated for the full standby period."] },
      { h: "When on-call time is not paid", p: ["If you are simply required to carry a phone and respond within a reasonable time (typically 30 minutes or more), can use the time freely, and are rarely actually called in, on-call time is generally not compensable. The actual time spent responding to and performing the call-out is always paid, however."] },
      { h: "Policies can be more generous", p: ["Many employers pay a flat standby stipend per on-call shift even if the time would not be legally required to be paid. This is lawful and common in healthcare, utilities, and IT. An employer cannot, however, pay less than minimum wage for all hours actually worked during a callback, even if the standby time itself is unpaid."] },
    ],
  },
  {
    slug: "tip-pooling-rules",
    title: "Tip Pooling Rules: Who Can Share in the Tip Pool?",
    description:
      "Tip pooling lets employers distribute tips among employees. Under the FLSA, back-of-house staff can join a valid tip pool — but only under certain conditions.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "tip pooling rules",
    related: ["tipped-wage-calculator", "minimum-wage-calculator"],
    body: [
      { p: ["A tip pool is an arrangement in which employees contribute a portion of their tips to a shared pot that is redistributed among a group of workers. The FLSA's tip pooling rules changed in 2018 and again in 2021; the current rules depend on whether the employer takes a tip credit."] },
      { h: "When the employer takes a tip credit", p: ["If the employer pays tipped employees a cash wage below the full minimum (the federal tip credit allows a $2.13 cash wage), only employees who 'customarily and regularly receive tips' may participate in the pool — typically servers, bartenders, bussers, and food runners. Back-of-house employees (cooks, dishwashers) cannot participate in a tip credit pool."] },
      { h: "When the employer pays the full minimum wage", p: ["If the employer does not take a tip credit and pays at least the full minimum wage in cash, the 2021 rule allows back-of-house workers to participate in the tip pool. The employer may also keep tips in this scenario only if no tip credit is used. Supervisors and managers cannot participate in any tip pool regardless of the structure."] },
      { h: "State rules vary", p: ["Seven states ban the tip credit entirely (California, Oregon, Washington, Nevada, Montana, Minnesota, Alaska), which means all tipped workers receive the full state minimum wage in cash plus tips. In those states, back-of-house staff can participate in a tip pool under the 2021 rule. Several states have even stricter tip-pooling rules; always check your state law."] },
    ],
  },
  {
    slug: "regular-rate-of-pay",
    title: "Regular Rate of Pay: The Overtime Calculation Base",
    description:
      "The regular rate of pay is the base for overtime calculations, not just your hourly wage. How bonuses, commissions, and shift differentials raise the rate.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "regular rate of pay overtime",
    related: ["overtime-calculator", "time-and-a-half-calculator"],
    body: [
      { p: ["Overtime under the FLSA is paid at 1.5 times the 'regular rate of pay' — not simply 1.5 times the base hourly wage. The regular rate includes almost all compensation paid to an employee for hours worked in a workweek, and it can be higher than the stated wage."] },
      { h: "What's included in the regular rate", p: ["The regular rate includes: base hourly wages, nondiscretionary bonuses (bonuses employees can reasonably expect to receive based on a formula or performance metric), shift differentials, piece-rate pay, commissions, and most other forms of compensation tied to hours worked or production."] },
      { h: "What's excluded from the regular rate", p: ["The FLSA explicitly excludes from the regular rate: gifts (including discretionary bonuses given with no prior commitment), vacation pay, holiday pay, overtime premiums already paid, travel expense reimbursements, and benefit plan contributions. Pure discretionary bonuses — those where the employer has full discretion over the amount and timing and announces them after the fact — do not need to be included."] },
      { h: "How to calculate it", p: ["Divide total compensation for the workweek (excluding exclusions) by total hours worked. The result is the regular rate for that week. If that week included overtime, the half-time premium owed on overtime hours is 0.5 × regular rate × OT hours (since the straight-time portion was already included in total compensation). The overtime calculator does this automatically for blended-rate scenarios."] },
    ],
  },
  {
    slug: "biweekly-vs-semimonthly-pay",
    title: "Biweekly vs Semi-Monthly Pay: What's the Difference?",
    description:
      "Biweekly pay means 26 paychecks a year; semi-monthly means 24. The difference affects benefit deductions, overtime calculations, and paycheck size.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "biweekly vs semimonthly payroll",
    related: ["salary-to-hourly-calculator", "overtime-calculator"],
    body: [
      { p: ["Biweekly and semi-monthly pay schedules are often confused. They look similar — you receive a paycheck roughly every two weeks — but they are structurally different in ways that affect overtime calculation, benefit deductions, and monthly cash flow."] },
      { h: "Biweekly: 26 paychecks per year", p: ["Biweekly means you are paid every two weeks on the same day (usually Friday). There are exactly 26 pay periods per year. This aligns naturally with the FLSA workweek (a fixed 7-day period), making overtime calculation straightforward — each pay period covers exactly two workweeks. Two months per year contain three paychecks."] },
      { h: "Semi-monthly: 24 paychecks per year", p: ["Semi-monthly means you are paid twice a month — typically on the 1st and 15th, or the 15th and last day. There are exactly 24 pay periods per year. Semi-monthly schedules don't align cleanly with the 7-day workweek, which can complicate overtime calculation: a pay period may straddle two workweeks, requiring employers to split hours across weeks when determining OT liability."] },
      { h: "Impact on benefits and budgeting", p: ["Health insurance and 401(k) deductions are typically split across all pay periods. With biweekly pay, monthly benefit costs are spread across 2.167 periods on average (26 ÷ 12); with semi-monthly pay, it's always exactly 2. Semi-monthly is therefore simpler for monthly benefit accounting. But for employees, biweekly creates predictable two-payday months with occasional three-payday months — good for saving."] },
    ],
  },
  {
    slug: "overtime-for-tipped-employees",
    title: "Overtime for Tipped Employees: How It Works",
    description:
      "Tipped employees are owed overtime on the full minimum wage, not the cash wage. How to calculate overtime correctly for tipped workers under the FLSA.",
    date: "2026-06-20",
    readMins: 4,
    keyword: "overtime for tipped employees",
    related: ["overtime-calculator", "tipped-wage-calculator"],
    body: [
      { p: ["Tipped employees are entitled to overtime just like any other non-exempt worker. But the tip credit creates a common source of wage violations: employers who calculate overtime on the cash wage ($2.13/hour) instead of the full minimum wage. That is illegal."] },
      { h: "The correct overtime calculation", p: ["When an employer uses the federal tip credit, the overtime rate for a tipped employee is 1.5 × the full federal minimum wage ($7.25), minus the tip credit ($5.12). The result is $10.88 - $5.12 = $5.76 per hour for the overtime hours — not $2.13 × 1.5 = $3.20."] },
      { h: "Why the full minimum wage is the base", p: ["The tip credit is a mechanism that lets tips satisfy part of the minimum wage obligation. Overtime is computed on the employee's actual regular rate, and for a tipped employee the full minimum wage is the floor, not the cash wage. The DOL has consistently enforced this interpretation and courts have upheld it."] },
      { h: "State rules can raise the floor further", p: ["Seven states do not allow the tip credit — workers receive the full state minimum wage in cash. In those states, the overtime regular rate is the state minimum or the employee's actual cash wage (whichever is higher), and there is no tip credit to subtract. In California, which has daily overtime, tipped employees can earn daily overtime even in weeks under 40 hours."] },
      { h: "Watch for dual jobs", p: ["If a tipped employee spends more than 20% of their time in a workweek doing non-tipped work (cleaning, prep, stocking), the tip credit cannot apply to those hours. The DOL's '80/20' rule means the employer owes the full minimum wage for the non-tipped portion. Use the tipped-wage calculator to check compliance for split-duty employees."] },
    ],
  },
];
POSTS.push(...WEEK2_POSTS);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

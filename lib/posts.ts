// SEO guides. Each post renders as headings + paragraphs.
// Links in paragraph strings use [label](url) syntax — rendered by the blog page.
export interface PostSection { h?: string; p: string[]; table?: { headers: string[]; rows: string[][] } }
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

export const POSTS: Post[] = [
  {
    slug: "how-to-calculate-overtime-pay",
    title: "How to Calculate Overtime Pay (2026 Guide)",
    description: "Step-by-step overtime math under the FLSA: the regular rate, which hours count toward 40, time and a half with real paychecks, salaried non-exempt pay, holidays, and daily-overtime states.",
    date: "2026-06-15", readMins: 8, keyword: "how to calculate overtime pay", related: ["overtime-calculator"],
    body: [
      { p: [
          "Most overtime mistakes on a paycheck come from one of three places: the wrong regular rate, the wrong count of hours, or a premium that was never added at all. The rule itself fits in a sentence. Under the federal Fair Labor Standards Act (FLSA), a non-exempt employee must be paid at least 1.5 times their regular rate for every hour worked over 40 in a workweek.",
          "The FLSA covers businesses with at least $500,000 a year in gross revenue, plus any employee whose own work touches interstate commerce, which in practice reaches nearly every private employer. Most hourly workers are non-exempt. The rest of this guide is the arithmetic, applied to real paychecks, so you can check your own."
        ] },
      { h: "Step 1: Find your regular rate", p: [
          "Your regular rate is your total pay for the week divided by the hours you worked. If you earn a flat $20 an hour and nothing else, it is $20. It stops being your hourly wage the moment you add pay that was promised or expected: production bonuses, attendance bonuses, shift differentials, commissions.",
          "Take a $20 an hour worker who puts in 50 hours and earns a $100 production bonus. Straight-time pay for all 50 hours is $1,000, plus the $100 bonus, so $1,100. Divide by 50 hours and the regular rate is $22. The employee has already been paid straight time for every hour, so what is still owed is the extra half: 10 overtime hours x $11 = $110. The correct week is $1,210. A payroll system that ignores the bonus pays 40 x $20 + 10 x $30 + $100 = $1,200, which is $10 short. That is small for one week and real money over a year."
        ] },
      { h: "Step 2: Count hours worked in the workweek", p: [
          "Overtime is measured per workweek, which is a fixed, recurring period of seven consecutive days that your employer chooses (say, Sunday 12:00 a.m. to Saturday 11:59 p.m.). It is not your pay period and it is not a calendar week. Hours cannot be averaged across weeks. Thirty hours one week and fifty the next is ten overtime hours in the second week, not eighty hours over two weeks with nothing owed.",
          "Only hours you actually worked count toward the 40. Paid time off, sick days and holidays you did not work are paid, but they do not count. If you took Monday off as PTO and worked 36 hours the rest of the week, your check may show 44 paid hours, yet you worked 36 and no overtime is due."
        ] },
      { h: "Step 3: Multiply the overtime hours by 1.5", p: [
          "A worker at $20 an hour who works 46 hours earns 40 x $20 = $800 plus 6 x $30 = $180, for $980. If the employer paid all 46 hours at straight time, the check was $920 and the shortfall is $60 for that single week.",
          "At $28 an hour for 52 hours the numbers are 40 x $28 = $1,120 plus 12 x $42 = $504, for $1,624. Straight time on all 52 hours would be $1,456, so the missing premium is $168. A worker who has weeks like that twice a month is short about $4,000 a year.",
          "To check a week without doing it by hand, use the [overtime calculator](/calculators/overtime-calculator), which applies your state's rules. The same page shows the premium rate per hour."
        ] },
      { h: "What time and a half does not mean", p: [
          "Federal law requires it for one reason: hours over 40 in a workweek. Not weekends, not holidays, not nights, not hours over 8 in a day. A worker who does four 10-hour days (40 hours) has no federal overtime, while a worker on six 7-hour days (42 hours) has two overtime hours because the weekly line was crossed. Weekend or holiday premiums exist only where an employer, union contract or state law adds them. A shift differential is not overtime either, but it does feed into the regular rate described above.",
          "One more example at $18 an hour and 47 hours: 40 x $18 = $720 plus 7 x $27 = $189, so $909. Those seven hours earned $63 more than they would have at straight time. That $63 is the entire legal difference between a correct week and a short one."
        ] },
      { h: "Holidays and paid time off", p: [
          "There is no federal rule that holiday work earns extra pay. A promise of holiday premium pay in your handbook, offer letter or union contract is enforceable like any other term of your wages, but the FLSA itself does not require it. What the FLSA does cover is the hours: holiday hours you work count toward the 40. If you work 32 hours Monday through Thursday and 10 on a Friday holiday, that is 42 hours and the last two are overtime at 1.5x.",
          "The reverse also holds. A paid holiday you did not work adds paid hours but not worked hours, so it never pushes you into overtime on its own. Federal civilian employees are the exception, since they have their own statutory holiday rules (5 U.S.C. 6103)."
        ] },
      { h: "Salaried but non-exempt", p: [
          "A salary does not by itself make you exempt. If you are paid a salary and do not meet both the salary test and the duties test, you are owed overtime like an hourly worker. Divide the weekly salary by the hours it is meant to cover, usually 40. A $48,000 salary is $923.08 a week, or $23.08 an hour. At 48 hours the eight extra hours are paid at $34.62, which is about $277 on top of the salary.",
          "The exemption tests are covered in [exempt vs non-exempt employees](/blog/exempt-vs-non-exempt-employees)."
        ] },
      { h: "Daily-overtime states", p: [
          "Four states count hours per day as well as per week: California, Alaska, Nevada and Colorado, each with its own thresholds. In California, over 8 hours in a day is time and a half and over 12 is double time, so a week under 40 hours can still contain overtime. The details are in [California overtime rules](/blog/california-overtime-rules), and the state-by-state differences are in [overtime rules by state](/blog/overtime-rules-by-state). Enter daily hours, not just the weekly total, when you check one of these states."
        ] },
      { h: "What happens when an employer gets it wrong", p: [
          "When the Wage and Hour Division finds a violation, it can order back wages for up to two years, or three if the violation was willful, plus an equal amount in liquidated damages. Civil money penalties can reach $2,515 per willful or repeated violation, a figure the DOL held flat for 2026 because the CPI-U data needed for the annual adjustment was never published. A worker who sues under section 216(b) can also recover attorney fees from the employer if they win."
        ] },
      { h: "Frequently asked questions", p: [
          "Does my employer have to pay overtime I did not get approved? Yes, if you worked the hours and the employer knew or should have known. A no-unapproved-overtime rule is something they can discipline you for, but it does not erase the wages.",
          "Can my boss give me comp time instead of overtime pay? Not in the private sector. Only state and local government employers can substitute time off for cash, under strict limits. See [comp time vs overtime](/blog/comp-time-vs-overtime).",
          "Is double time required? Not under federal law, ever. California is the only state that requires it, after 12 hours in a day and for some seventh-day work.",
          "How far back can I claim unpaid overtime? Two years under the FLSA, three if the violation was willful, with each underpaid payday running its own clock. Many states reach further."
        ] },
      { h: "Check your last few paychecks", p: [
          "Pull your three most recent stubs and any week where you passed 40 hours. Run each one through the [overtime calculator](/calculators/overtime-calculator) and compare the overtime line to what you were paid.",
          "If the gap shows up across many weeks, the [back-pay calculator](/calculators/back-pay-calculator) totals it, including liquidated damages. The $29 Claim Kit then turns that estimate into a demand letter pre-filled with your figures and a filing guide for your state. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "minimum-wage-2026-by-state",
    title: "2026 Minimum Wage by State: The Complete List",
    description: "Every state's 2026 minimum wage, from the $7.25 federal floor up to $17.95 in Washington, D.C., plus which states raised pay in January and which raise it mid-year.",
    date: "2026-06-15", readMins: 8, keyword: "minimum wage 2026 by state", related: ["minimum-wage-calculator","overtime-calculator"],
    body: [
      { p: [
          "The federal minimum wage is still $7.25 an hour, and it hasn't budged since July 2009. That's more than sixteen years without a raise, the longest stretch in the law's history. If the federal floor had kept pace with inflation, it would be well over $10 today.",
          "But the federal number tells you almost nothing about what workers actually earn, because 30 states plus Washington, D.C. set a higher minimum, and many cities go higher still. In 2026, where you live can mean a $10-plus swing in the legal floor for the exact same job. Here's the full picture."
        ] },
      { h: "The highest minimum wages in 2026", p: [
          "Washington, D.C. leads the country at $17.95 an hour. Right behind it: Washington State at $17.13, Connecticut at $16.94, California at $16.90 (with many cities far higher), and New York at $17.00 in the NYC, Long Island, and Westchester area and $16.00 upstate.",
          "These aren't outliers anymore. New Jersey, Massachusetts, [Arizona](/states/arizona), Colorado, and Maryland all sit comfortably above $15. The $15 minimum, once a rallying cry, is now the baseline across a large chunk of the country. Some cities go higher still, such as [Oakland at $17.34 an hour in 2026](/cities/oakland-ca).",
          "And remember, these are state floors. Cities like Seattle, Denver, and the California Bay Area set their own higher rates, which are covered in the city and county section below."
        ] },
      { h: "States still at the $7.25 federal floor", p: [
          "Twenty states still use the federal $7.25 minimum, including Texas, Pennsylvania, North Carolina, Tennessee, Indiana, Wisconsin, and most of the South. In these states, a full-time worker earning the minimum makes about $15,080 a year before taxes, which is below the poverty line for a family.",
          "A few states are stranger than that. Georgia and Wyoming have a state minimum of just $5.15 on the books, but because the federal $7.25 applies to most employers, that's the rate workers actually get. Five states, Alabama, Louisiana, Mississippi, South Carolina, and Tennessee, have no state minimum wage law at all, so the federal floor governs by default."
        ] },
      { h: "States that raised pay on January 1, 2026", p: [
          "Nineteen states raised their minimum wage on January 1, 2026, many through automatic inflation indexing. That includes big economies like California, New York, Colorado, Washington, and Arizona, plus Ohio, Michigan, Missouri, Montana, and others.",
          "Indexing matters because it means the raise happens every year without a new law. If your state indexes to inflation, expect another bump every January."
        ] },
      { h: "Mid-year increases in 2026", p: [
          "Not every raise lands on January 1, so the rate that applied in February is not always the rate in October. Alaska went from $13.00 to $14.00 on July 1, 2026, the next step in a schedule set by a 2024 ballot measure, and it rises to $15.00 on July 1, 2027. Alaska has no tip credit, so tipped workers get the full minimum in cash.",
          "Oregon runs three regional rates that all moved on July 1, 2026 and are indexed to inflation: $16.80 in the Portland metro area, $15.55 standard, and $14.55 in non-urban counties. The tier depends on the county where you work, not where you live. Nevada did not raise its minimum in July 2026. Sources: [Alaska Department of Labor](https://labor.alaska.gov/lss/whn.htm) and [Oregon BOLI](https://www.oregon.gov/boli/workers/pages/minimum-wage.aspx).",
          "Florida reached $15.00 on September 30, 2026, the last step of Amendment 2, which voters approved in 2020. The path was $10 in 2021, then $11, $12, $13 and $14 in September 2025. The tipped cash wage rose to $11.98, and employers must still top up any week where cash plus tips falls below $15.00. Florida generally bars cities from setting a higher local minimum, and from 2027 the state rate is indexed to inflation. When you review back pay, use the rate that was in effect in the week you are checking, not today's."
        ] },
      { h: "Minimum wage and overtime are connected", p: [
          "Your minimum wage doesn't just set your base pay, it sets the floor for your overtime too. Overtime is 1.5x your regular rate, and your regular rate can never be below the applicable minimum. So a higher state minimum means a higher overtime premium.",
          "It also affects exemptions. In California, the salary threshold to be exempt from overtime is tied to the state minimum wage (2x full-time minimum), which is why it rises every year. We cover that link in [exempt vs non-exempt employees](/blog/exempt-vs-non-exempt-employees)."
        ] },
      { h: "City and county minimums", p: [
          "Dozens of cities and counties set minimums above their state's, and the rule is simple: whichever of the federal, state and local rates is highest is the one you are owed. If the federal rate is $7.25, the state's is $16.00 and the city's is $19.00, the floor is $19.00. Local rates are common in California, Washington, Colorado and New Mexico, and some apply only to certain industries or employer sizes.",
          "Seattle is around $21.30 an hour in 2026 against Washington State's $17.13, and parts of the California Bay Area are above $18. Many local rates adjust on July 1 rather than January 1, so a figure you saw in January can be out of date by August. The [minimum wage calculator](/calculators/minimum-wage-calculator) includes city and county rates, and the [city pages](/cities) list them. Tipped workers still need cash plus tips to reach the highest applicable minimum, which is covered in [tipped minimum wage and the tip credit](/blog/tipped-minimum-wage-and-tip-credit)."
        ] },
      { h: "Did your raise actually show up?", p: [
          "If you were at or near the old minimum on the day a new rate took effect and your hourly rate did not change, the difference is unpaid wages from that date. A worker paid $1.00 an hour below the new minimum for 400 hours is owed $400 before any overtime or penalties. Pull a stub from after the effective date, compare the rate, and if it is short use the [back-pay calculator](/calculators/back-pay-calculator) to total it."
        ] },
      { h: "Frequently asked questions", p: [
          "Which minimum wage applies to me, federal, state, or city? Whichever is highest. If your city requires $18, your state requires $16, and the feds require $7.25, you're entitled to $18. The law always favors the worker on this one.",
          "Can my employer pay me less than minimum wage if I get tips? Only in states that allow a \"tip credit,\" and only if your tips plus the lower cash wage add up to at least the full minimum. Seven states ban the tip credit entirely. See [tipped minimum wage and tip credit](/blog/tipped-minimum-wage-and-tip-credit).",
          "What if I'm being paid below my state's minimum? That's a wage violation, and the unpaid difference is recoverable, often with penalties. Start by confirming the correct rate for your state and the weeks in question.",
          "Does a higher local minimum replace the state one? Yes. You are always entitled to the highest applicable rate, so a city minimum above the state's is your legal floor and paying only the state rate underpays you.",
          "My employer is in a $7.25 state but I work remotely in a higher-rate state. Which minimum applies? The rate where you physically work. See [overtime for remote and hybrid workers](/blog/overtime-for-remote-hybrid-workers)."
        ] },
      { h: "Confirm your rate and check for shortfalls", p: [
          "Use the [minimum wage calculator](/calculators/minimum-wage-calculator) to confirm the exact 2026 rate for your state and city, then compare it against your actual pay stub. If you're tipped, hourly, or salaried, the same floor logic applies.",
          "If you find you've been paid below the legal minimum, the [back-pay calculator](/calculators/back-pay-calculator) estimates what you're owed, and you can file a complaint with the [DOL Wage and Hour Division](https://www.dol.gov/agencies/whd). This is general information, not legal advice, but a quick check costs you nothing."
        ] }
    ]
  },
  {
    slug: "exempt-vs-non-exempt-employees",
    title: "Exempt vs Non-Exempt: Do Salaried Employees Get Overtime?",
    description: "Whether you get overtime depends on exempt status, not salary. The 2026 federal threshold and how it got here, the duties tests, salaried non-exempt overtime math, and common misclassification.",
    date: "2026-06-15", readMins: 9, keyword: "exempt vs non exempt", related: ["exempt-salary-calculator","overtime-calculator"],
    body: [
      { p: [
          "Whether you get overtime comes down to a single word: exempt. Non-exempt employees must be paid overtime. Exempt employees are not entitled to it. That one classification can be worth thousands of dollars a year.",
          "And here's the uncomfortable truth: misclassification is everywhere. Employers routinely slap an \"exempt\" label on workers who legally don't qualify, sometimes by mistake and sometimes to dodge overtime. If you're salaried and working long weeks, this is the most important thing you can understand about your pay."
        ] },
      { h: "The two-part test, and you have to pass both", p: [
          "To be legally exempt from overtime under the FLSA, an employee must clear two hurdles. First, the salary test: you have to be paid a fixed salary of at least $684 a week, which is $35,568 a year. Second, the duties test: your actual job has to involve genuine executive, administrative, or professional responsibilities.",
          "Both parts must be met. Fail either one and you're non-exempt, which means you're owed overtime no matter what your title or pay structure says. A 2024 rule that would have raised the salary line to about $58,656 was struck down in federal court in November 2024, so for 2026 the threshold is back at $35,568."
        ] },
      { h: "Salary alone is never enough", p: [
          "This is the single biggest myth in employment pay: \"I'm salaried, so I'm exempt.\" Wrong. Being paid a salary satisfies only the first half of the test. If your day-to-day duties don't qualify, you're owed overtime even with a salary.",
          "Picture an \"assistant manager\" who spends 90% of the shift running a register, stocking shelves, and cleaning, with no real authority to hire, fire, or make independent decisions. That person is very likely non-exempt despite the manager title and the salary. Job duties are what count, not the label on the org chart."
        ] },
      { h: "What the duties test actually requires", p: [
          "The executive exemption generally requires that you manage the business or a department, regularly direct at least two other full-time employees, and have real authority over hiring and firing (or meaningful input into it).",
          "The administrative exemption requires office or non-manual work directly related to management or general business operations, plus the exercise of independent judgment on significant matters. The professional exemption covers work requiring advanced knowledge, typically a degree, in a field of science or learning.",
          "If your job is routine, closely supervised, or doesn't involve real discretion, you probably don't fit any of these, regardless of how you're paid."
        ] },
      { h: "States set higher bars than the feds", p: [
          "Several states require a much higher salary to be exempt than the federal $35,568. California, New York, Washington, Colorado, Alaska, and Maine all set their own, steeper thresholds.",
          "California is the headline: the exempt salary floor is 2x the state minimum wage for full-time work, which works out to about $70,304 a year in 2026. So a California employee earning $60,000 on salary cannot be exempt under state law, full stop, and is owed overtime. You can test any salary against both the federal and state lines with the [exempt salary calculator](/calculators/exempt-salary-calculator)."
        ] },
      { h: "Why misclassification is worth real money", p: [
          "When an employer wrongly classifies you as exempt, every overtime hour you worked goes unpaid. For someone regularly putting in 50-hour weeks, that's 10 unpaid overtime hours a week, which over a year can run well into five figures.",
          "The FLSA lets you recover up to two years of back pay, or three years for willful violations, often doubled as liquidated damages. If you think you've been misclassified, the [back-pay calculator](/calculators/back-pay-calculator) gives you a conservative estimate of the total. Salaried workers should also read the salaried non-exempt section below."
        ] },
      { h: "Salaried but non-exempt: the overtime math", p: [
          "A salaried non-exempt employee is normal and legal, and is owed time and a half for every hour over 40 like an hourly worker. Find the regular rate by dividing the weekly salary by the hours it is meant to cover, usually 40. A $45,000 salary is about $865.38 a week, or $21.63 an hour. At 50 hours, the 10 overtime hours are paid at $32.45, which is about $325 on top of the salary that week. Over a year of 50-hour weeks that is more than $16,000 that an assumption of no overtime on salary simply gives away. The [overtime calculator](/calculators/overtime-calculator) does this for you."
        ] },
      { h: "The three white-collar exemptions in practice", p: [
          "The executive exemption covers an employee whose primary duty is managing the business or a recognized department, who regularly directs at least two full-time employees, and who has real say over hiring and firing. The administrative exemption covers office work directly related to management or business operations that involves discretion and independent judgment on significant matters. Following a script or applying a fixed company policy is not that, even when the job is skilled. The professional exemption covers work that requires advanced knowledge in a field of science or learning, usually through a specialized degree, or creative work in a recognized artistic field.",
          "A few narrower exemptions exist. Outside sales employees have their own exemption. Computer professionals can be exempt at $684 a week on salary or $27.63 an hour. Highly compensated employees earning at least $107,432 a year are exempt under a lighter duties test, but they still must regularly perform at least one exempt duty, so a high salary alone is not enough."
        ] },
      { h: "Mistakes that cost workers money", p: [
          "Assistant managers who spend most of the shift on a register, shelves or food prep, with only occasional supervisory tasks, are frequently non-exempt whatever the title says. Giving someone a salary and the power to approve a coworker's day off once a month does not create managerial authority. The computer exemption is narrow, and help desk and QA testing roles are often classified under it when they should not be. The honest test is a plain description of a normal week: who decides what gets done, who can be overruled, and how much of the job is judgment versus execution."
        ] },
      { h: "Where the federal threshold stands in 2026", p: [
          "The Department of Labor's 2024 rule would have raised the salary line to $844 a week in July 2024 and $1,128 a week ($58,656 a year) in January 2025, with automatic updates after that. In November 2024 a federal court in the Eastern District of Texas vacated the rule nationwide, finding the DOL had overstepped by using salary level to override the duties test. The Fifth Circuit dismissed the government's appeal on May 5, 2026 without ruling on the merits, and the DOL then confirmed the rule is rescinded. The thresholds in force are the 2019 ones: $684 a week ($35,568 a year), and $107,432 for highly compensated employees. No replacement rule has finished the notice-and-comment process. Sources: [DOL overtime rulemaking](https://www.dol.gov/agencies/whd/overtime/rulemaking) and [SHRM](https://www.shrm.org/topics-tools/employment-law-compliance/expanded-overtime-rule-dies-court).",
          "If your employer raised salaries in anticipation of the 2024 rule and later rolled them back, a prospective reduction is legal, but wages already earned cannot be clawed back. State thresholds were not affected, and California, New York and Washington keep their own higher ones. The salary fight gets the headlines. The duties test is where most misclassification actually happens."
        ] },
      { h: "Frequently asked questions", p: [
          "I'm paid a salary and have a fancy title. Doesn't that settle it? No. Titles and pay structure don't decide exemption, your actual duties and salary level do. \"Director of First Impressions\" is still a receptionist.",
          "Can my employer make me exempt just by paying me a salary above $35,568? Only if your duties also qualify. Plenty of salaried workers above the threshold are still non-exempt because their jobs don't involve management, independent judgment, or advanced knowledge.",
          "What if my employer deducts pay when I leave early? That can actually break the exemption. Exempt employees must generally receive their full salary in any week they work, with narrow exceptions. Improper deductions can convert an \"exempt\" worker into a non-exempt one owed overtime.",
          "I make $40,000 on salary and work 55-hour weeks. Am I owed overtime? Quite possibly. You clear the federal salary line, so it comes down to duties. If your job does not involve genuine management or independent judgment, you are non-exempt and owed overtime for the 15 hours over 40.",
          "Does a raise above the salary threshold make me exempt? No. Clearing the salary line is necessary but not sufficient, and every exemption also needs a duties test.",
          "Can my employer reclassify me from exempt to non-exempt? Yes, going forward. It does not fix unpaid overtime from the period you were wrongly classified."
        ] },
      { h: "Test your classification today", p: [
          "Start with the salary test: run your weekly or annual pay through the [exempt salary calculator](/calculators/exempt-salary-calculator) to see if you even clear the federal and state thresholds. Then honestly assess your duties against the executive, administrative, and professional standards above.",
          "If you fall short on either, you may be owed overtime. Estimate it with the [overtime calculator](/calculators/overtime-calculator), and read about your filing options at the [DOL Wage and Hour Division](https://www.dol.gov/agencies/whd). This is general information, not legal advice, but classifying yourself correctly is the first step to getting paid right."
        ] }
    ]
  },
  {
    slug: "final-paycheck-laws-by-state",
    title: "Final Paycheck Laws: When Is Your Last Check Due?",
    description: "When your last paycheck is due if you quit or were fired, what it must include, what an employer can deduct, California's waiting-time penalty with a worked example, and how severance fits in.",
    date: "2026-06-15", readMins: 5, keyword: "final paycheck laws", related: ["final-paycheck-calculator"],
    body: [
      { p: [
          "A final paycheck is where employers cut corners most often, and where the deadline depends almost entirely on your state. Federal law has no deadline for final pay. The FLSA only requires that you eventually be paid for all hours worked, so the timing comes from state law and ranges from the same day to the next regular payday."
        ] },
      { h: "Fired versus quit", p: [
          "Many states set a shorter deadline when the employer ends the job. Texas gives a fired employee six calendar days, while an employee who quits is paid by the next regular payday. New York generally requires final pay by the next regular payday either way. Check both situations for your state, because assuming the wrong one can cost you weeks."
        ] },
      { h: "California: same day", p: [
          "California has the strictest rule. A fired or laid-off employee must be paid all wages, including accrued unused vacation, immediately on the last day. An employee who quits without notice must be paid within 72 hours. If you give at least 72 hours' notice, the check is due on your last day. Filing details are in the [California wage-claim guide](/states/california#wage-claim).",
          "If a California employer willfully pays late, it owes a waiting-time penalty of one day of wages for each day the check is late, up to 30 days. At $200 a day, a check that arrives two weeks late carries about $2,800 in penalties on top of the wages. A check that never arrives hits the 30-day cap, which at the same rate is $6,000."
        ] },
      { h: "What the final check must include", p: [
          "All wages earned through your last day, including overtime. In California, Colorado, Montana and Nebraska it also includes accrued unused vacation, because those states treat it as earned wages. Elsewhere, payout follows your employer's written policy. A worker with 60 unused hours at $30 an hour is owed $1,800 in a payout state. [PTO payout by state](/blog/pto-payout-use-it-or-lose-it) has the full map.",
          "Earned commissions and nondiscretionary bonuses that had already vested also belong in the final check. A bonus you were promised and earned is wages, whatever the offer letter calls it."
        ] },
      { h: "Deductions and held checks", p: [
          "Employers often try to dock a final check for a laptop that was not returned, a register shortage or a uniform. In most states that is restricted or illegal without your written authorization, and any deduction that drops you below minimum wage for the hours worked is unlawful almost everywhere. Withholding the whole check until you return equipment is a violation in many states. The employer can pursue the equipment separately, but it generally cannot hold earned wages hostage."
        ] },
      { h: "Severance is not final pay", p: [
          "No federal law requires severance. You are entitled to it only if a contract or written policy promises it, or in a mass layoff where the WARN Act applies. WARN requires employers with 100 or more employees to give 60 days of written notice before a layoff of 50 or more workers or a plant closing, and missing notice means back pay and benefits for each missing day up to 60.",
          "Severance usually comes with a release of claims. Workers over 40 must be given at least 21 days to consider it (45 in a group layoff) and 7 days to revoke after signing. Use that time. Before you sign, check whether you have unpaid overtime or a misclassification claim, because the release waives them and they can be worth more than the severance. Your final wages are owed regardless of whether you sign anything."
        ] },
      { h: "Frequently asked questions", p: [
          "My employer is holding my last check until I return my equipment. Is that legal? In most states, no. They can pursue the property separately, but withholding earned pay is itself a violation in many states.",
          "I never received my final paycheck. What now? Write down your last day, your rate and your hours, send a short written request, and if it does not arrive, file a wage claim with your state labor agency or the [DOL Wage and Hour Division](https://www.dol.gov/agencies/whd/contact/complaints).",
          "Does unused PTO have to be paid out? It depends on your state and your employer's written policy. In California it must be paid. In other states the policy decides, and a promise of payout is enforceable."
        ] },
      { h: "Work out what your last check should be", p: [
          "Add your unpaid hours, any overtime and accrued PTO, then run the totals through the [final paycheck calculator](/calculators/final-paycheck-calculator) to see the amount and your state's deadline.",
          "If the check is late or short, the [back-pay calculator](/calculators/back-pay-calculator) estimates the total, and the $29 Claim Kit builds a demand letter and a state filing guide from it. Your state labor department can help you recover it. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "tipped-minimum-wage-and-tip-credit",
    title: "Tipped Minimum Wage and the Tip Credit, Explained",
    description: "How the tip credit works, the $2.13 federal tipped wage, the seven states that ban tip credits, and how to check whether your tips are actually making up the difference.",
    date: "2026-06-15", readMins: 7, keyword: "tipped minimum wage", related: ["tipped-wage-calculator","minimum-wage-calculator"],
    body: [
      { p: [
          "If you work for tips, your paycheck math is more complicated than almost anyone else's, and that complexity is exactly where money goes missing. Servers, bartenders, bussers, nail techs, and delivery drivers lose wages every year to tip-credit errors most of them never catch.",
          "The core idea is simple to state but easy to abuse: your employer can pay you a lower cash wage as long as your tips make up the rest of the minimum. Here's how that's supposed to work, and how to tell when it isn't."
        ] },
      { h: "What the tip credit actually is", p: [
          "Under federal law, an employer can pay tipped workers a cash wage as low as $2.13 an hour and count your tips toward the rest of the minimum wage. The difference between that $2.13 and the full federal $7.25 is the \"tip credit,\" up to $5.12 an hour.",
          "The catch, and it's a big one, is that your cash wage plus your tips must reach at least the full minimum wage for every hour. If they don't, your employer is legally required to make up the difference. That obligation is non-negotiable, and it's the rule employers most often ignore."
        ] },
      { h: "The seven states that ban the tip credit", p: [
          "Seven states have abolished the tip credit entirely: California, Washington, Oregon, Nevada, Montana, Minnesota, and Alaska. In these states, tipped workers must be paid the full state minimum wage in cash before tips, and the tips are pure extra.",
          "That's a huge difference. A California server earns at least $16.90 an hour in cash and keeps every tip on top. A server in a tip-credit state might see just a few dollars an hour in cash and depend entirely on tips to reach the minimum. Use the [minimum wage calculator](/calculators/minimum-wage-calculator) to confirm your state's rule."
        ] },
      { h: "How to check whether you're being shorted", p: [
          "Here's a real example. Say you're paid $2.13 an hour cash and the full minimum where you work is $7.25. In a slow week you work 30 hours and earn only $120 in tips. Your tips work out to $4 an hour, so your total is $6.13 an hour, $1.12 short of the minimum.",
          "Your employer owes you that $1.12 per hour, or about $33.60 for the week. They don't get to say \"tough luck, it was slow.\" The minimum wage is a floor, and slow shifts are the employer's problem to cover, not yours. The [tipped wage calculator](/calculators/tipped-wage-calculator) runs this comparison for you."
        ] },
      { h: "Tip pools, tip theft, and managers", p: [
          "Tip pooling among employees who customarily get tips (servers, bartenders, bussers) is generally legal. What's not legal: managers, supervisors, and owners keeping any portion of employee tips. Federal law flatly prohibits it, regardless of whether the employer takes a tip credit.",
          "If your manager dips into the tip pool, or the house keeps a cut beyond legitimate credit card processing fees, that's tip theft, and it's recoverable. Forcing tipped workers to share tips with the kitchen is only allowed in limited situations and never when the employer claims a tip credit."
        ] },
      { h: "The 80/20 rule and side work", p: [
          "Tipped workers often do non-tipped \"side work,\" like rolling silverware, cleaning, or prepping. There are limits on how much of that an employer can pay at the tipped rate. As a rule of thumb, if you spend a substantial chunk of your shift on work that doesn't directly produce tips, you may be owed the full minimum wage for that time.",
          "This gets technical and the regulations have shifted, but the principle holds: you can't be paid a tipped sub-minimum wage for hours where you have no real opportunity to earn tips. If your job is half cleaning and prep, question the math."
        ] },
      { h: "Overtime for tipped employees", p: [
          "Tipped overtime is where the tip credit is most often misapplied. Overtime is built on the full minimum wage, not the reduced cash wage. Start with $7.25, multiply by 1.5 to get $10.88, then subtract the maximum $5.12 tip credit. The cash overtime rate is $5.76 an hour, and tips come on top. An employer that multiplies the $2.13 cash wage by 1.5 pays $3.20, which is $2.56 an hour too little. At 10 overtime hours a week that is $25.60, or more than $1,300 a year.",
          "The order matters. The tip credit is a fixed dollar amount, not a percentage, so it comes off once, after the overtime rate is built on the full minimum. Any method that lets the credit grow with overtime is illegal. State rules change the numbers. A higher state minimum raises the base, a lower allowed tip credit raises the cash rate, and in the states that ban the tip credit overtime is simply 1.5 times the full state minimum. A pay stub showing an overtime rate near $3 an hour in a federal-minimum state is a red flag, and the [tipped wage calculator](/calculators/tipped-wage-calculator) will confirm it.",
          "Side work interacts with this too. If more than 20% of your time goes to tasks that do not produce tips, that excess time must be paid at the full minimum, which raises your regular rate and your overtime with it. The dual-jobs standard has shifted in recent years, so check the current rule with the DOL's [Wage and Hour Division](https://www.dol.gov/agencies/whd) or your state agency."
        ] },
      { h: "Frequently asked questions", p: [
          "Can my boss keep my tips if business is bad? Never. Tips belong to the employee. Owners and managers cannot keep employee tips under any circumstances, and they must make up any shortfall between your cash wage plus tips and the full minimum.",
          "Do I have to share tips with the kitchen staff? Only in limited cases, and generally only if your employer pays the full minimum wage in cash and doesn't take a tip credit. If your employer takes a tip credit, back-of-house tip sharing is not allowed.",
          "What if I'm in a no-tip-credit state but still got paid the sub-minimum? That's a clear violation. In California, Washington, Oregon, Nevada, Montana, Minnesota, and Alaska you're owed the full state minimum in cash, and the difference is back pay.",
          "My pay stub shows an overtime rate of about $3 an hour. Is that wrong? Almost certainly, if you are in a state at the federal minimum. The cash overtime rate there should be about $5.76, and more in states with a higher minimum. A rate near $3 is the signature of the illegal method of multiplying the cash wage by 1.5, and it usually means back pay is owed."
        ] },
      { h: "Run your tipped pay through the numbers", p: [
          "Pull a few recent shifts and add up your cash wage plus tips per hour. Compare that to your state's full minimum using the [tipped wage calculator](/calculators/tipped-wage-calculator). If you ever fall below the minimum and your employer didn't top you up, you've found unpaid wages.",
          "The [back-pay calculator](/calculators/back-pay-calculator) estimates the total across many shifts, and you can file a complaint with the [DOL Wage and Hour Division](https://www.dol.gov/agencies/whd/contact/complaints) if you confirm a violation. This is general information, not legal advice, but tipped workers are owed money more often than almost anyone, so it's worth checking."
        ] }
    ]
  },
  {
    slug: "california-overtime-rules",
    title: "California Overtime Rules: Daily OT, Double Time, and the 7th Day",
    description: "California counts overtime by the day as well as the week: time and a half after 8 hours, double time after 12, and special seventh-day pay. Worked examples with real numbers, and the federal double-time myth.",
    date: "2026-06-15", readMins: 5, keyword: "california overtime rules", related: ["overtime-calculator","double-time-calculator"],
    body: [
      { p: [
          "California counts hours per day, not just per week. That one difference produces overtime in weeks that never reach 40 hours, double time that federal law never requires, and a premium on the seventh straight day. If you only know the federal rule of 1.5x after 40 hours a week, you are likely missing some of what you earned."
        ] },
      { h: "Daily overtime: time and a half after 8 hours", p: [
          "A non-exempt employee earns time and a half for every hour over 8 in a workday, whatever the weekly total. Four 10-hour days at $30 an hour add up to 40 hours, so the federal rule produces no overtime and a $1,200 check. California counts 8 daily overtime hours, so each day is 8 x $30 + 2 x $45 = $330, for $1,320. That is $120 for a week with no federal overtime in it.",
          "The weekly rule still applies on top. Hours over 40 in a week are overtime too, but an hour is never paid twice as overtime. Payroll should work out the daily overtime first, then check the weekly total for any extra hours not already counted. Enter daily hours, not just the weekly sum, in the [overtime calculator](/calculators/overtime-calculator)."
        ] },
      { h: "Double time after 12 hours", p: [
          "California is the only state that requires double time. Every hour past 12 in a workday is paid at 2x the regular rate. A 14-hour day at $25 an hour is 8 x $25 = $200, plus 4 x $37.50 = $150, plus 2 x $50 = $100, for $450. If the employer paid time and a half for the last two hours, the day is $25 short.",
          "Federal law never requires double time, for any reason. If you are paid double time outside California it is because your employer, handbook or union contract promises it, and a written promise is enforceable as part of your wages. A holiday double-time rate that turns into straight time on the check is unpaid wages. The [double time calculator](/calculators/double-time-calculator) handles the tiers."
        ] },
      { h: "The seventh consecutive day", p: [
          "If you work seven days in a row in a single workweek, the first 8 hours on the seventh day are paid at time and a half and any hours past 8 are paid at double time. At $24 an hour, a 10-hour seventh day is 8 x $36 = $288 plus 2 x $48 = $96, for $384 compared with $240 at straight time. The rule exists for workers who are scheduled without a day off, and it applies from the first hour of that day, not after 40 weekly hours."
        ] },
      { h: "How the rules combine", p: [
          "Apply whichever rule gives the higher pay for each hour, and never stack two premiums on the same hour. A worker with long days and a six or seven day week can be owed daily overtime, double time, weekly overtime and a seventh-day premium in the same pay period. That layering is where payroll systems and hand calculations both go wrong."
        ] },
      { h: "Meal and rest break premiums", p: [
          "Long California shifts often come with missed breaks. Employees are owed a 30-minute meal period before the end of the fifth hour and a paid 10-minute rest break for every four hours worked. When a break is denied, the employer owes one extra hour of pay at the regular rate for meal violations and another for rest violations, up to two premium hours per day. The rules and examples are in [break laws by state](/blog/break-laws-by-state), and the filing process is in the [California wage-claim guide](/states/california#wage-claim)."
        ] },
      { h: "Frequently asked questions", p: [
          "Do California's daily overtime rules apply if I am salaried? Only if you are non-exempt. The California exempt salary floor is about $70,304 in 2026, which is twice the state minimum wage for full-time work, and you must also pass the duties test. Many salaried Californians are non-exempt.",
          "My employer says only hours over 40 count. Is that right? Not in California. Overtime after 8 hours in a day applies regardless of the weekly total, and an employer using only the federal weekly rule is likely underpaying you.",
          "How far back can I claim California overtime? Generally three years under the Labor Code and up to four under the Unfair Competition Law, which is longer than the federal window."
        ] },
      { h: "Add up your California overtime", p: [
          "Go through your schedule and list every day over 8 hours, every day over 12, and any week where you worked seven days. Run them through the [overtime calculator](/calculators/overtime-calculator) and the [double time calculator](/calculators/double-time-calculator) and compare the totals to your stubs.",
          "If your stubs only reflect weekly overtime, estimate the total with the [back-pay calculator](/calculators/back-pay-calculator). The $29 Claim Kit turns the result into a demand letter and a California filing guide, and the [California Labor Commissioner](/states/california#wage-claim) and the [DOL Wage and Hour Division](https://www.dol.gov/agencies/whd) are the agencies that take complaints. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "pto-payout-use-it-or-lose-it",
    title: "PTO Payout by State: Use It or Lose It, Explained",
    description: "Which states require employers to pay out accrued vacation when you leave, where use-it-or-lose-it policies are legal, and how to value the PTO in your final paycheck.",
    date: "2026-06-15", readMins: 5, keyword: "pto payout by state", related: ["pto-payout-calculator","final-paycheck-calculator"],
    body: [
      { p: [
          "When you leave a job with unused vacation days banked, one question matters more than any other: do they have to pay you for it? The answer depends almost entirely on your state, and the differences are stark enough that the same situation can be worth hundreds or thousands of dollars in one state and nothing in another.",
          "There's no federal law requiring PTO payout, or even requiring paid time off at all. It's governed by state law and your employer's written policy. Here's how to figure out where you stand."
        ] },
      { h: "States that require PTO payout", p: [
          "A handful of states treat accrued, unused vacation as earned wages that must be paid out when you leave, no matter what the employer's policy says. California, Colorado, Montana, and Nebraska are the clearest examples.",
          "In these states, the logic is simple: you earned that time, so it's your money. An employer can't make it disappear when you quit or get fired. California is especially strict, treating vacation like wages that are owed on your final paycheck, with the same timing penalties for paying late."
        ] },
      { h: "Where use-it-or-lose-it is legal", p: [
          "In most other states, employers can run \"use-it-or-lose-it\" policies, meaning unused vacation expires (often at year-end) and isn't paid out at separation, as long as the policy is clearly written and communicated in advance.",
          "But here's the nuance: even in these states, if your employer's policy says vacation will be paid out, that promise is generally enforceable. So the controlling question becomes what your written policy says. If it promises a payout and you didn't get one, that's recoverable. If it clearly states no payout, you may be out of luck."
        ] },
      { h: "PTO bans on forfeiting earned time", p: [
          "Some states sit in the middle: they allow caps on accrual but prohibit outright forfeiture of time you've already earned. The distinction matters. A cap that stops you from banking more than, say, 1.5x your annual accrual is often legal. A policy that wipes out vacation you already earned may not be.",
          "Because the rules are this granular, always read your handbook alongside your state's rule. The combination of state law plus written policy is what decides your payout, which is why two coworkers in different states can get very different final checks."
        ] },
      { h: "How to value your PTO payout", p: [
          "When a payout is owed, it's usually calculated at your current rate of pay. Multiply your accrued unused hours by your hourly rate. If you're salaried, convert your salary to an hourly figure first (annual salary divided by 2,080 for a full-time worker), which we explain in [how to convert salary to hourly](/calculators/salary-to-hourly-calculator).",
          "Example: a worker earning $30 an hour with 60 hours of accrued, unused PTO is owed 60 x $30 = $1,800 at separation in a state that requires payout. Run your own numbers with the [PTO payout calculator](/calculators/pto-payout-calculator)."
        ] },
      { h: "PTO and your final paycheck", p: [
          "Where payout is required, the PTO is part of your final wages, which means it's subject to your state's final-paycheck timing rules. In California, for instance, a fired employee's accrued vacation is due immediately, on the last day, and late payment can trigger waiting-time penalties.",
          "So a missing PTO payout isn't just a missing perk, it can be unpaid wages plus penalties. Check the timing rules in [final paycheck laws by state](/blog/final-paycheck-laws-by-state) and total everything with the [final paycheck calculator](/calculators/final-paycheck-calculator)."
        ] },
      { h: "Frequently asked questions", p: [
          "My employer has a use-it-or-lose-it policy. Can they really keep my vacation? In most states, yes, if the policy is clearly written and you were notified. But in California, Colorado, Montana, and Nebraska, accrued vacation generally can't be forfeited and must be paid out.",
          "Does sick leave get paid out like vacation? Usually not. Most states that require vacation payout don't extend that to sick leave, which is typically treated differently. Check your state and policy, but don't assume sick time converts to cash.",
          "What if my policy promised a payout and I didn't get one? That's likely recoverable as unpaid wages, even in a state that allows use-it-or-lose-it, because the employer bound itself by its own policy. File a wage claim with your state labor agency."
        ] },
      { h: "Calculate what you're owed at separation", p: [
          "Figure out your accrued unused hours and your rate, then run them through the [PTO payout calculator](/calculators/pto-payout-calculator) to see the dollar value. Combine it with your other final wages using the [final paycheck calculator](/calculators/final-paycheck-calculator).",
          "If you're in a payout state, or your policy promised a payout you never received, you may be owed that money plus penalties. The [back-pay calculator](/calculators/back-pay-calculator) helps estimate the total, and the [DOL Wage and Hour Division](https://www.dol.gov/agencies/whd) and your state labor department can point you to the right complaint process. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "how-to-read-a-pay-stub",
    title: "How to Read a Pay Stub (And Spot the Errors That Cost You Money)",
    description: "A line-by-line guide to your pay stub: earnings, hours, tax withholding, deduction codes, and the four checks that reveal whether your employer is shorting you.",
    date: "2026-06-20", readMins: 9, keyword: "how to read a pay stub", related: ["overtime-calculator"],
    body: [
      { p: [
          "Most people glance at the take-home number on their pay stub and file it away. That's a mistake. Your pay stub is a receipt for your labor, and like any receipt, it can be wrong. Wage theft costs U.S. workers billions of dollars a year, and a huge share of it is sitting in plain sight on stubs nobody reads carefully.",
          "The good news: a pay stub follows a predictable layout. Once you know what each block means, you can audit your own pay in about five minutes. Here's how to read every section and exactly what to check."
        ] },
      { h: "The header: who, when, and which period", p: [
          "The top of the stub identifies your employer, you, and the pay period. Two dates matter here. The \"pay period\" is the range of days you're being paid for. The \"pay date\" is when the money is issued. They're different, and the gap is normal.",
          "Check that the pay period length matches what you expect. If you're paid every two weeks, the period should cover 14 days. A short or overlapping period can mean hours got dropped. Also confirm your name, the last four digits of your Social Security number, and your filing status are correct, because errors there ripple into your tax withholding."
        ] },
      { h: "The earnings section: where your money is made", p: [
          "This is the most important block. It lists each type of pay separately: regular hours, overtime hours, holiday pay, bonus, commission, and so on. Each line shows a rate, the number of hours or units, and a total. Add the line totals and you get your gross pay for the period.",
          "Look specifically for a separate overtime line. If you worked more than 40 hours in a week and there's no overtime line, or the overtime rate equals your regular rate instead of 1.5 times it, that's a red flag. The overtime rate on a $20/hour job should read $30.00, not $20.00. You can confirm the correct figure with the [overtime calculator](/calculators/overtime-calculator).",
          "Most stubs also show year-to-date (YTD) totals next to current totals. The YTD column is useful for catching a problem that's been repeating for months rather than just this check."
        ] },
      { h: "The tax withholding lines", p: [
          "Below earnings you'll find taxes withheld. Federal income tax depends on your W-4 elections and your earnings. Then come the two FICA taxes, which are fixed percentages: Social Security at 6.2% of wages (up to the annual wage cap) and Medicare at 1.45%. These two you can check with simple multiplication.",
          "Most workers also see state income tax, and some see local or city tax. Nine states, including Texas, Florida, Washington, and Nevada, have no state income tax, so those lines will be blank or absent. If you see a state tax for a state you don't live or work in, flag it, because that's a setup error that can take months to refund.",
          "Federal withholding is harder to verify by hand because it's based on tables and your W-4. But Social Security and Medicare should always foot to 6.2% and 1.45% of your gross. If they don't, something is off."
        ] },
      { h: "Deduction codes: decoding the alphabet soup", p: [
          "After taxes come deductions, and this is where stubs get cryptic. You'll see abbreviations like MED or MEDICAL (health insurance), DEN (dental), 401K or RET (retirement), HSA or FSA (pre-tax health/childcare accounts), LIFE (life insurance), and sometimes GARN (a court-ordered wage garnishment).",
          "Pre-tax deductions (like 401(k), HSA, and most health premiums) come out before income tax is calculated, which lowers your taxable wages. Post-tax deductions come out after. The distinction explains why your taxable wages on the stub can be lower than your gross.",
          "Match every deduction to something you actually signed up for. An unexplained deduction, a benefit you cancelled, or a union due you never authorized is money leaving your pocket. Employers in many states can't lawfully deduct for things like cash-register shortages, broken equipment, or uniforms if doing so drops you below minimum wage."
        ] },
      { h: "The four checks that catch wage theft", p: [
          "First, check hours. Compare the regular and overtime hours on the stub to your own record of when you clocked in and out. If you don't keep a record, start now, even a notes app works, because in a dispute your records can carry real weight.",
          "Second, check the overtime rate. Anything over 40 hours in a workweek should be paid at 1.5 times your regular rate, and that regular rate has to include nondiscretionary bonuses and commissions. A bonus week with no bump to the overtime rate means you were underpaid.",
          "Third, check minimum wage. Divide your gross by your total hours. If the result is below your state or local minimum wage, you have a problem, and this is the most common way tipped workers get cheated. Fourth, check the math across the whole stub: earnings minus taxes minus deductions should equal your net pay exactly. If the lines don't add up, ask payroll for a written explanation."
        ] },
      { h: "Gross versus net: check the gross", p: [
          "Most people look at take-home pay, but every wage calculation starts with gross. Minimum wage compliance, overtime and back-pay claims are all measured on gross earnings, because two workers with the same gross can have very different net pay depending on filing status and benefit elections. Net is almost useless for spotting underpayment.",
          "Gross must include the overtime premium. At $25 an hour and 46 hours, gross is 40 x $25 + 6 x $37.50 = $1,225. A stub showing $1,150, which is 46 x $25, shorted the worker $75. Nondiscretionary bonuses and commissions also belong in gross, and they raise the regular rate on which overtime is figured. Assume that taxes and deductions on a $1,000 gross week total $241.50, with Social Security at $62 and Medicare at $14.50 included. Net is then $758.50. If the same worker had missed 8 overtime hours at $37.50, gross would be $300 lower and the net would be lower too, but nothing on the net line would explain why.",
          "The usual ways gross comes out wrong are a missing overtime premium, off-the-clock work that never reaches the timesheet, minutes trimmed by rounding, a bonus left out of the regular rate, and a tip credit that leaves tipped workers below the minimum. When you compare a check to what you think you earned, compare gross to gross. The [overtime calculator](/calculators/overtime-calculator) will show what the gross should have been."
        ] },
      { h: "Frequently asked questions", p: [
          "Does my employer have to give me a pay stub? Federal law doesn't require one, but most states do, and many require specific details like hours, rates, and deductions. California, New York, and others impose penalties for stubs that are missing required information, so a vague or incomplete stub can itself be a violation.",
          "What if my pay stub doesn't show my hours? For non-exempt (hourly) workers that's a warning sign, and in many states it's illegal. Without hours on the stub, neither you nor anyone reviewing your pay can confirm overtime was paid correctly. Request an itemized statement in writing and keep the response.",
          "How long should I keep my pay stubs? At least two to three years. Federal wage claims under the FLSA reach back two years, or three for willful violations, so a stack of old stubs is exactly the evidence you'd need to prove a back-pay claim.",
          "Is gross or net pay used for overtime? Gross. Overtime is a premium on the regular rate, which is built from gross earnings before taxes, so deductions never reduce what you are owed.",
          "Why is my net so much lower than my gross? Taxes, Social Security, Medicare and voluntary deductions such as insurance and retirement all come out in between. A gap of 20% to 30% is common for a middle-income worker."
        ] },
      { h: "Audit your next stub", p: [
          "The next time you're paid, don't just check the deposit amount. Spend five minutes running the four checks: hours, overtime rate, minimum wage, and whether the lines add up. Keep a copy of every stub and a simple log of your hours.",
          "If the overtime rate looks wrong or the hours don't match what you worked, plug your real numbers into the [overtime calculator](/calculators/overtime-calculator) to see what you should have been paid. A pay stub you actually read is one of the cheapest forms of financial protection you have. For the rules in your state, the U.S. Department of Labor's [Wage and Hour Division](https://www.dol.gov/agencies/whd) is the authoritative starting point."
        ] }
    ]
  },
  {
    slug: "independent-contractor-vs-employee",
    title: "Independent Contractor vs Employee: Are You Misclassified?",
    description: "The IRS common-law test, the FLSA economic-reality test, and the real cost of being called a 1099 contractor when you're legally an employee owed overtime and minimum wage.",
    date: "2026-06-20", readMins: 9, keyword: "independent contractor vs employee", related: ["exempt-salary-calculator"],
    body: [
      { p: [
          "If your boss hands you a 1099 instead of a W-2, calls you a \"contractor,\" but tells you when to show up, how to do the job, and won't let you work for anyone else, you may be misclassified. And misclassification isn't a harmless paperwork quirk. It can strip you of overtime, minimum wage, unemployment insurance, and workers' comp, while quietly shifting thousands of dollars in taxes onto your shoulders.",
          "The label your employer puts on you doesn't decide your rights. Federal and state agencies use specific legal tests to determine whether you're truly an independent contractor or an employee. Here's how those tests work and what to do if you've been put in the wrong box."
        ] },
      { h: "Why the distinction matters so much", p: [
          "Employees are covered by the Fair Labor Standards Act. That means minimum wage and time-and-a-half overtime for hours over 40 a week. Independent contractors get none of that, no overtime, no minimum wage floor, no meal-break protections in states that require them.",
          "There's a tax hit too. Employees split Social Security and Medicare taxes with their employer, each paying 7.65%. Contractors pay the entire 15.3% themselves as self-employment tax. A misclassified worker earning $40,000 effectively eats an extra few thousand dollars a year the employer should have covered.",
          "And the safety net disappears. Contractors generally can't collect unemployment if they're let go, aren't covered by workers' compensation if they're injured, and don't get employer health insurance or protection under many anti-discrimination and family-leave laws. The stakes are real."
        ] },
      { h: "The IRS common-law test: three categories of control", p: [
          "The IRS looks at the relationship through three lenses. Behavioral control asks whether the company directs how you do your work: setting your hours, requiring specific procedures, providing training, supervising you. The more control, the more you look like an employee.",
          "Financial control asks who runs the economics of the work. Do you have a meaningful investment in your own tools and equipment? Can you realize a profit or take a loss? Do you offer your services to the general market, or work for just this one company? Are you paid a steady wage rather than per project or by invoice? Steady pay and no real business of your own point toward employee status.",
          "The third category is the type of relationship: written contracts, whether you get benefits like insurance or paid leave, how permanent the arrangement is, and whether your work is a core part of the company's business. A long-term worker doing the company's central work, who gets benefits, is almost certainly an employee no matter what the contract says."
        ] },
      { h: "The FLSA economic-reality test", p: [
          "For wage and overtime claims, the U.S. Department of Labor doesn't use the IRS test. It uses the \"economic reality\" test, which asks one core question: as a matter of economic reality, are you in business for yourself, or are you economically dependent on this employer for work?",
          "Courts weigh several factors: the degree of control the employer has over the work, your opportunity for profit or loss based on your own managerial skill, your investment compared to the employer's, whether the work requires special skill and initiative, how permanent the relationship is, and whether your work is an integral part of the employer's business.",
          "No single factor decides it, and you can't waive your rights by signing a contract that calls you a contractor. The Department of Labor's [Wage and Hour Division](https://www.dol.gov/agencies/whd) enforces this, and a worker who's economically dependent on one company is an employee entitled to minimum wage and overtime, full stop."
        ] },
      { h: "Some states make it even harder to be a contractor", p: [
          "Several states, led by California, use the stricter \"ABC test\" for many wage and unemployment purposes. Under the ABC test, you're presumed to be an employee unless the company proves all three of these: (A) you're free from its control, (B) your work is outside the company's usual business, and (C) you're customarily engaged in an independent trade of the same kind.",
          "That middle prong is the killer. If you drive for a delivery company, or cook in a restaurant, or clean for a cleaning service, your work is the company's usual business, so prong B fails and you're an employee. Massachusetts, New Jersey, and others use versions of this test.",
          "Because state tests can be tougher than the federal ones, you can be a legitimate contractor under the IRS rules and still an employee under your state's wage law. Always check your own state's standard."
        ] },
      { h: "Misclassification and the overtime you're owed", p: [
          "Here's the practical upshot: if you've been misclassified as a contractor but you're legally an employee, you're likely owed unpaid overtime for every week you worked more than 40 hours, plus the difference if your effective pay fell below minimum wage.",
          "Some workers are reclassified and then told they're \"exempt\" salaried employees instead, which is just a second way to dodge overtime. Being salaried doesn't automatically make you exempt; you have to meet both a salary threshold and specific duties tests. The [exempt-salary calculator](/calculators/exempt-salary-calculator) helps you check whether a salaried role actually qualifies as exempt or is overtime-eligible.",
          "Back pay in these cases can be substantial because it compounds across months. Federal claims reach back two years, or three if the violation was willful, and many states allow even longer windows with extra penalties."
        ] },
      { h: "Eight signs of misclassification", p: [
          "You work fixed hours set by someone else, and the company controls how you do the work, not just what you deliver: a manager reviews your method, mandates software or corrects your approach in real time. Contractors are hired for an outcome, employees for their time.",
          "You cannot take other clients, formally or because your workload eats all your working time. You use company equipment, an email address and internal tools, where a contractor normally supplies their own.",
          "The arrangement has run indefinitely, with no real renegotiation, and your work is central to what the company sells. You have a supervisor, reviews and write-ups rather than a client who accepts or rejects deliverables.",
          "Your only way to earn more is to log more hours at a rate the company sets. That is economic dependence, the core marker of employee status under the DOL's test. Two or more of these is reason to run the numbers."
        ] },
      { h: "What misclassification can cost, and how to challenge it", p: [
          "Suppose a worker paid a flat $25 an hour for 50 hours a week is really an employee. The missing half-time premium is 10 hours x $12.50 = $125 a week, or $6,500 a year, and $19,500 over a three-year lookback, before liquidated damages. In some states there are added penalties, and the employer's share of payroll taxes may be owed as well.",
          "You can file a Wage and Hour Division complaint, file IRS Form SS-8 to request an official tax-classification ruling (slow, but definitive), or consult an employment attorney. Many attorneys take these cases on contingency. Retaliation for raising the issue is illegal. A contract that calls you a contractor does not settle the question, and neither does receiving a 1099 instead of a W-2. Estimate the damage with the [back-pay calculator](/calculators/back-pay-calculator)."
        ] },
      { h: "Frequently asked questions", p: [
          "I signed a contract agreeing I'm an independent contractor. Does that settle it? No. Your status is determined by the actual working relationship, not by the label in a contract. You cannot legally waive your right to minimum wage and overtime, and agencies routinely find \"contractors\" to be employees despite signed agreements.",
          "I get a 1099 instead of a W-2. Am I automatically a contractor? No. The tax form reflects how the employer chose to treat you, not your legal status. Many misclassification cases involve workers who got 1099s for years while functioning exactly like employees.",
          "What should I do if I think I'm misclassified? Document everything: your schedule, who directs your work, your pay, and the tools you use. Then you can file a complaint with the [Department of Labor](https://www.dol.gov/agencies/whd/contact/complaints) or your state labor agency, or consult an employment attorney. There are anti-retaliation protections for workers who raise these claims."
        ] },
      { h: "Figure out where you really stand", p: [
          "Start by writing down the facts: who controls your hours and methods, whether you work for other companies, whether your job is the core of the business, and how you're paid. Compare those facts to the economic-reality and ABC tests above. If the picture is one of dependence and control, you're probably an employee, regardless of your 1099.",
          "If you've been treated as exempt or as a contractor, run the numbers with the [exempt-salary calculator](/calculators/exempt-salary-calculator) to see whether you should have been getting overtime all along. Then estimate the back pay with the [back-pay calculator](/calculators/back-pay-calculator). Misclassification is one of the most common and most lucrative wage claims there is, precisely because it hides in plain sight."
        ] }
    ]
  },
  {
    slug: "break-laws-by-state",
    title: "Break Laws by State: When You're Owed Meal and Rest Breaks (2026)",
    description: "Federal law doesn't require breaks, but many states do. Here's which states mandate paid rest breaks and unpaid meal breaks, when short breaks must be paid, and the penalties for missed breaks.",
    date: "2026-06-20", readMins: 10, keyword: "break laws by state", related: ["overtime-calculator"],
    body: [
      { p: [
          "You worked an eight-hour shift, never got a real break, and ate lunch standing at your station while still answering customers. Were you owed that break? It depends entirely on what state you're in, and on whether that \"lunch\" was truly free of work.",
          "There's a widespread myth that federal law guarantees you a lunch break or two fifteen-minute breaks a day. It doesn't. But that's only half the story, because break rules are mostly set by states, and the rules about which breaks must be paid can put real money back in your pocket."
        ] },
      { h: "What federal law actually says about breaks", p: [
          "The Fair Labor Standards Act does not require employers to provide meal breaks or rest breaks at all. An employer can legally make an adult work an eight-hour shift with no break, as far as federal law is concerned. State law is where break rights come from.",
          "But federal law does govern whether breaks you do get are paid. Short breaks, generally those lasting 5 to 20 minutes, are considered part of the workday and must be paid. You can't be docked for a quick coffee or bathroom break, and that paid time counts toward your hours, including toward overtime.",
          "Bona fide meal breaks, usually 30 minutes or more, can be unpaid, but only if you're completely relieved of duty. If you're eating at your desk while taking calls, or you have to jump up the moment a customer walks in, you weren't relieved of duty and the time has to be paid. The U.S. Department of Labor's [Wage and Hour Division](https://www.dol.gov/agencies/whd) enforces this distinction."
        ] },
      { h: "States that require meal breaks", p: [
          "More than 20 states require a meal break for adult workers, typically a 30-minute break for shifts of a certain length. California requires a 30-minute meal period for shifts over five hours and a second meal period for shifts over ten hours. New York requires meal breaks that vary by shift timing and industry, often 30 to 60 minutes.",
          "Other meal-break states include Washington, Oregon, Colorado, Illinois, Minnesota, Nevada, Kentucky, and several more. The exact trigger length and duration vary, so a six-hour shift might earn a break in one state and not in another.",
          "Crucially, in most of these states the meal break is unpaid only if you're fully relieved of duty. If your employer keeps you on the clock in practice, you're owed for that time, and across many shifts it adds up. Those extra paid minutes can also push your weekly total past 40, triggering overtime you can check with the [overtime calculator](/calculators/overtime-calculator)."
        ] },
      { h: "States that require paid rest breaks", p: [
          "A smaller group of states goes further and mandates paid rest breaks during the shift. California is the standard-bearer: workers are entitled to a paid 10-minute rest break for roughly every four hours worked, on the clock, and these breaks cannot be skipped to leave early or lumped into lunch.",
          "Washington, Oregon, Colorado, Nevada, Kentucky, and Minnesota also require paid rest periods of around 10 minutes per four hours (the details differ by state). Because these breaks are paid, missing them isn't just inconvenient, it can mean you worked through time you should have been compensated for or owed a penalty.",
          "Most states, including Texas, Florida, and much of the South and Midwest, have no rest-break requirement for adults at all. In those states your break rights may come only from your employer's policy or a union contract, not from the law."
        ] },
      { h: "The penalties for missed breaks", p: [
          "This is where break law turns into money. California is the most generous: if your employer denies a required meal or rest break, you're owed one extra hour of pay at your regular rate for each day a meal break was missed, and a separate hour for each day a rest break was missed. That's potentially two premium hours per day, and it adds up fast across weeks and months.",
          "Other states handle it differently. Some treat a worked-through meal break as unpaid time worked, meaning you're owed the wages (and overtime, if applicable) for those minutes rather than a flat penalty. Either way, the employer owes you, and a pattern of missed breaks can become a sizable claim.",
          "Penalty rules and lookback windows vary, but California break-premium claims can reach back three years (or four under the state's unfair-competition law), which is why missed-break cases are often filed alongside unpaid-overtime claims."
        ] },
      { h: "How to document a missed break", p: [
          "If you're regularly losing breaks, start keeping your own record today. Note the date, your shift length, whether you got a meal break, whether you got rest breaks, and whether you actually performed work during any break that was supposed to be off the clock. A simple phone note with dates is far better than relying on memory later.",
          "Watch for the common tricks: auto-deducting 30 minutes for lunch even when you worked through it, requiring you to stay on premises or keep your radio on during \"unpaid\" breaks, or pressuring you to clock out and keep working. Each of these can turn a supposedly unpaid break into compensable time.",
          "Your own time records carry real weight in a wage dispute, especially when the employer's records are sloppy or missing, which they often are in exactly the workplaces that skip breaks."
        ] },
      { h: "Auto-deducted lunches", p: [
          "A large share of unpaid-lunch disputes come from timekeeping systems that deduct 30 minutes every shift whether or not you took the break. If you regularly worked through lunch covering a register, answering calls or finishing a task, that time was compensable work and should have been paid. It is common in retail, healthcare and warehouses, where coverage gaps make a real break hard to schedule, and it is checkable: the stub shows a lunch deduction for a day you know you worked through. Workers under 18 are often covered by mandatory meal-break rules even where adults are not, so check minor labor rules separately."
        ] },
      { h: "California in detail: how the premium works", p: [
          "California requires a 30-minute meal break for a shift over five hours, starting before the end of the fifth hour, and a second one for a shift over ten hours. The first can be waived only if the shift is six hours or less, and the second only if the shift is under 12 hours, the first break was taken, and the waiver is voluntary. Rest breaks are paid, 10 minutes per four hours or major fraction.",
          "The penalty is one extra hour of pay at the regular rate for each workday a required meal break is missed, late or interrupted, and a separate hour for each workday a rest break is missed. The maximum is two premium hours a day. A $22 an hour warehouse worker who skips lunch on every one of 20 shifts in a month is owed 20 x $22 = $440 in premiums, separate from any pay for the time actually worked during the break.",
          "These premiums are treated as wages, so the limitations period is three years, or four under the Unfair Competition Law. They are owed whether or not you complained at the time, and California employers must keep their own meal-break records, so a mismatch with your log is useful evidence. Exempt employees are generally not covered, which is why [exempt vs non-exempt employees](/blog/exempt-vs-non-exempt-employees) matters so much there. Long California shifts with missed breaks often also have unpaid daily overtime, covered in [California overtime rules](/blog/california-overtime-rules)."
        ] },
      { h: "Frequently asked questions", p: [
          "Does federal law require lunch breaks? No. The FLSA doesn't require meal or rest breaks for adult workers. It only requires that short breaks (5 to 20 minutes) be paid and that you be fully relieved of duty for a meal break to be unpaid. Mandatory breaks come from state law.",
          "My employer auto-deducts 30 minutes for lunch even when I work through it. Is that legal? No. If you perform any work during that period, or aren't fully relieved of duty, the time is compensable and the auto-deduction is unlawful. Document the days it happens, because this is one of the most common wage violations there is.",
          "Which states have the strongest break laws? California is the strongest, with required paid rest breaks, required meal breaks, and a one-hour pay penalty for each missed break. Washington, Oregon, Colorado, and Nevada also mandate paid rest breaks. Most other states require little or nothing for adults.",
          "Do I have to complain at the time for a California meal break premium to apply? No. The premium is owed for each violation whether or not you raised it when it happened.",
          "If my state does not require a lunch break, can I still take one? Nothing stops an employer from offering one, but in most states with no meal-break law it is a policy, not a right you can enforce."
        ] },
      { h: "Add up what your missed breaks are worth", p: [
          "Look up your state's specific meal and rest break rules, then compare them to what actually happens on your shifts. If you're routinely working through unpaid lunches or never getting the rest breaks your state requires, you're likely owed wages, a penalty, or both.",
          "Because worked-through breaks add paid minutes to your week, they can also tip you over 40 hours and trigger overtime. Run your real hours, breaks included, through the [overtime calculator](/calculators/overtime-calculator), then estimate the total with the [back-pay calculator](/calculators/back-pay-calculator). A few missed breaks a week, multiplied across a year, is rarely the small amount it feels like in the moment."
        ] }
    ]
  },
  {
    slug: "wage-garnishment-rules",
    title: "Wage Garnishment Rules: How Much of Your Paycheck Can Be Taken?",
    description: "Federal CCPA limits cap most garnishments at 25% of disposable income or 30 times the minimum wage. Here's how the rules work for ordinary debts, child support, taxes, and how state law can protect more.",
    date: "2026-06-20", readMins: 10, keyword: "wage garnishment rules", related: ["final-paycheck-calculator"],
    body: [
      { p: [
          "A wage garnishment is a court or agency order that forces your employer to withhold part of your paycheck and send it to a creditor. If you've ever seen a deduction labeled GARN on your stub and felt your stomach drop, the most important thing to know is this: there are hard legal limits on how much can be taken, and many people are garnished for more than the law allows.",
          "Federal law sets a floor of protection that applies everywhere, and many states protect even more of your wages. Understanding both can keep you from being squeezed past what's legal."
        ] },
      { h: "The federal CCPA limits for ordinary debts", p: [
          "The federal Consumer Credit Protection Act (CCPA) caps how much of your pay can be garnished for ordinary debts, things like credit cards, medical bills, personal loans, and most court judgments. The cap is the lesser of two numbers: 25% of your disposable earnings, or the amount by which your disposable earnings exceed 30 times the federal minimum wage.",
          "\"Disposable earnings\" means your pay after legally required deductions, federal and state taxes, Social Security, and Medicare, but not voluntary deductions like health insurance or retirement contributions. At the federal minimum wage of $7.25, that 30-times figure works out to $217.50 a week. If you earn $217.50 or less in disposable weekly pay, you can't be garnished for ordinary debt at all.",
          "Above that floor, the 25% cap usually controls. If your disposable weekly pay is $600, the most an ordinary creditor can take is 25%, or $150. An employer or creditor taking more than that for a credit card judgment is breaking federal law."
        ] },
      { h: "Higher limits for child support and alimony", p: [
          "Family support obligations get tougher treatment because the law prioritizes them. For child support and alimony, the CCPA allows up to 50% of disposable earnings to be garnished if you're supporting another spouse or child, and up to 60% if you're not.",
          "Those percentages climb another 5%, to 55% and 65%, when you're more than 12 weeks behind on payments. These orders also take priority over ordinary garnishments, so if you have both, the support order gets paid first up to its limit.",
          "Child-support withholding is extremely common and usually handled through an income-withholding order sent directly to your employer, so it shows up automatically on your stub without a separate lawsuit."
        ] },
      { h: "Taxes and student loans play by their own rules", p: [
          "Federal tax levies aren't governed by the 25% CCPA cap. Instead, the IRS uses tables based on your filing status and number of dependents to leave you a certain exempt amount, and it can take the rest. The exempt amount is often far less generous than the CCPA percentage, so a tax levy can bite much harder than a credit-card garnishment.",
          "Defaulted federal student loans can be subject to administrative wage garnishment of up to 15% of disposable pay, without the lender first having to win a lawsuit. State tax debts follow their own state rules, which vary widely.",
          "The takeaway: not all garnishments are capped at 25%. The type of debt determines the limit, and government debts (taxes, student loans, child support) generally allow more to be taken than private debts do."
        ] },
      { h: "State law can protect more of your pay", p: [
          "Federal limits are a floor, not a ceiling on your protection. States are free to shield more of your wages, and many do. A handful of states, including Texas, Pennsylvania, North Carolina, and South Carolina, prohibit wage garnishment for most ordinary consumer debts entirely, allowing it only for things like child support, taxes, and student loans.",
          "Other states tie the protected amount to a higher state minimum wage, which raises the floor below which nothing can be taken. Because the law requires using whichever rule protects you more, a worker in a high-minimum-wage state often keeps more of their check than the bare federal formula would allow.",
          "Always check your own state's rules before assuming the 25% federal figure applies, because in many places the real protection is greater."
        ] },
      { h: "Your rights, and what's off limits", p: [
          "Federal law bars your employer from firing you because of a single garnishment for one debt. (Protection for multiple garnishments is weaker, so a second order can change things.) If you were fired solely over one wage garnishment, that itself may be a violation worth raising.",
          "Garnishments also can't reach into money that's already legally protected, and they generally apply to earned wages, not to exempt benefits like Social Security, disability, or certain public assistance, though the protection can be lost if those funds are commingled in a bank account and separately levied.",
          "If you believe you're being garnished beyond the legal limit, you can challenge it. You typically have the right to claim exemptions and contest the amount, and the U.S. Department of Labor's Wage and Hour Division enforces the CCPA's garnishment limits and the anti-firing rule."
        ] },
      { h: "Worked example: which limit actually applies?", p: [
          "Take a worker with $250 in disposable weekly pay and a credit-card judgment. The 25% cap would allow $62.50. The other test asks how much disposable pay exceeds $217.50 (30 times $7.25): $250 minus $217.50 is $32.50. The cap is the lesser of the two, so no more than $32.50 can be taken that week, not $62.50.",
          "Now take the $600 case from above. Twenty-five percent is $150, while $600 minus $217.50 is $382.50. Here 25% is the smaller number, so $150 is the ceiling. The crossover sits at roughly $290 of disposable weekly pay: below it the 30-times test controls, above it the 25% test does.",
          "Remember the figures are per pay period and scale with it. For a biweekly check, the protected floor is twice the weekly figure. If your state sets a higher minimum wage and protects more, use that more protective rule instead."
        ] },
      { h: "A quick checklist before you accept a deduction", p: [
          "1. Identify the type of debt: ordinary consumer debt, child support, tax levy, or student loan, because each has a different cap. 2. Work out disposable earnings from your stub: gross pay minus legally required deductions only. 3. Apply the lesser-of test for ordinary debt, or the support percentages if it is a support order. 4. Check whether your state bars or limits garnishment for that kind of debt. 5. If the amount withheld is higher than every limit allows, raise it with your payroll department in writing and keep copies, then contact the court that issued the order or the Department of Labor's Wage and Hour Division."
        ] },
      { h: "The same paycheck, different debts", p: [
          "Take a worker with $1,000 in weekly disposable earnings and no other dependents. A credit card judgment can take up to 25%, which is $250, because that is less than the $782.50 by which pay exceeds 30 times the minimum wage. A defaulted federal student loan is capped at 15%, or $150. A child support order can take up to 60%, or $600, rising to 65%, or $650, if payments are more than 12 weeks behind.",
          "When a support order and a consumer garnishment both exist, the support order takes priority and takes its share first. A consumer creditor can reach only what is left, still under the overall limit. This is why the question of how much can be garnished needs a debt-by-debt answer. Some states restrict or bar wage garnishment for ordinary consumer debt altogether, including Texas, Pennsylvania, North Carolina and South Carolina. An employer also cannot deduct more than the legal cap whatever the order says, and must figure disposable earnings after legally required deductions only, not after voluntary ones such as a 401(k) contribution."
        ] },
      { h: "Frequently asked questions", p: [
          "What's the maximum that can be garnished from my paycheck? For ordinary debts, federal law caps it at the lesser of 25% of disposable earnings or the amount over 30 times the federal minimum wage ($217.50/week in 2026). Child support can go up to 50 to 65%, and taxes and student loans follow separate rules. Your state may protect more.",
          "Can my employer fire me for a wage garnishment? Not for a single garnishment over one debt, that's protected by federal law. The protection weakens once there are garnishments for multiple separate debts, but being fired over your first garnishment may itself be illegal.",
          "Does the garnishment limit apply to my final paycheck? Yes, the same percentage caps apply to your disposable earnings in a final check. If you're leaving a job and want to confirm your last check, including any owed wages or PTO, is calculated correctly before deductions, the [final-paycheck calculator](/calculators/final-paycheck-calculator) can help you check the math.",
          "How much can be garnished if I have more than one debt? The combined total still generally cannot exceed the federal caps, and support orders take priority over consumer garnishments."
        ] },
      { h: "Make sure your garnishment is legal", p: [
          "Pull your pay stub and find the disposable earnings, your pay after taxes and Social Security and Medicare. Apply the 25% rule for an ordinary debt, then check whether your state protects more. If the amount being withheld is higher than both limits allow, your paycheck is being garnished beyond what the law permits.",
          "Garnishment errors compound, because they repeat every pay period, so catching an over-withholding early can save you real money. Confirm your final check is right before you leave a job with the [final-paycheck calculator](/calculators/final-paycheck-calculator), and if you think you've been garnished or short-changed unlawfully, the [Department of Labor](https://www.dol.gov/agencies/whd) is the place to start. None of this is legal advice, but knowing the limits is the difference between accepting a deduction and challenging one that shouldn't be there."
        ] }
    ]
  },
  {
    slug: "travel-time-pay-rules",
    title: "Travel Time Pay: When Your Employer Has to Pay You to Travel",
    description: "The FLSA rules on travel time pay in 2026: why your commute isn't paid, when day trips and overnight travel are, and how unpaid travel can hide thousands in back pay.",
    date: "2026-06-20", readMins: 8, keyword: "travel time pay", related: ["overtime-calculator"],
    body: [
      { p: [
          "Here's a question that costs American workers real money every single week: when does your employer have to pay you for time spent traveling? Not the day you spend on a plane for a conference, not the drive between two job sites, not the late-night call-out to fix a broken machine. The Fair Labor Standards Act has clear answers, and a lot of employers either don't know them or quietly hope you don't.",
          "If you're non-exempt (hourly, or salaried under the exempt threshold), unpaid travel time is one of the most common ways wages get shaved off your check. And because it repeats week after week, the unpaid amount adds up fast. Let's walk through exactly when travel time is on the clock."
        ] },
      { h: "Your normal commute is not paid (and that's the law)", p: [
          "Start with the rule that disappoints everyone: your ordinary home-to-work commute is not compensable. Driving 45 minutes to the office and 45 minutes back is your own time under the federal Portal-to-Portal Act, even if it's a brutal slog. The same goes if you take a company van home for convenience.",
          "This holds even when the commute is long. A roofer who drives an hour to the day's job site generally isn't owed for that drive. The logic is that getting yourself to work is a normal cost of having a job, not work itself.",
          "But, and this is where money starts changing hands, the commute rule has hard edges. The moment travel stops looking like a normal commute and starts looking like part of the workday, the FLSA flips it to paid time."
        ] },
      { h: "Travel between job sites during the day is paid", p: [
          "If you report to one location and then travel to another during the workday, that travel is paid. A home-health aide driving from one client's house to the next, an electrician moving from a morning job to an afternoon job, a service tech bouncing between three stores, all of that drive time is hours worked.",
          "This is enormous for trades and field workers. Say you visit four sites a day and spend 90 minutes total driving between them. That's 7.5 unpaid hours a week if your employer only pays \"door to door\" at each stop. Over a year that's roughly 390 hours, and if any of it pushed you over 40 in a week, it should have been paid at time and a half.",
          "Those between-site miles also count toward your 40-hour overtime threshold. Run your real weekly hours, travel included, through the [overtime calculator](/calculators/overtime-calculator) to see whether you crossed into overtime once the driving is added back in."
        ] },
      { h: "A one-day trip to another city is paid (minus the commute)", p: [
          "When your employer sends you on a special one-day assignment to another city, the FLSA treats almost all of that travel as work time. Fly out in the morning, work the event, fly back at night, the travel counts. The Department of Labor lets the employer subtract the time you'd have spent on your normal commute, but the rest is paid.",
          "Example: you normally commute 30 minutes. Your boss sends you to a city two hours away for a one-day job. The drive there and back is roughly four hours; subtract your usual one hour of round-trip commute and you're owed about three hours of travel pay on top of the work itself. Many employers \"forget\" this entirely."
        ] },
      { h: "Overnight travel: the workday-hours rule", p: [
          "Overnight, multi-day travel follows a quirkier rule. Travel that cuts across your normal working hours is paid, even on a Saturday or Sunday, and even if you're just a passenger on a plane or train. If you normally work 9 to 5 and you're flying from 1 p.m. to 4 p.m. on a Sunday, those three hours are paid because they fall within your usual working hours.",
          "Travel completely outside your normal hours as a passenger generally isn't paid. So a red-eye that boards at 11 p.m. when you'd normally be asleep usually isn't compensable. But if you're actually working during that travel, answering emails, doing required tasks, that work time is always paid, day or night.",
          "The DOL spells this out in its [travel time guidance](https://www.dol.gov/agencies/whd). When in doubt, write down the clock times of every leg of the trip and compare them to your normal schedule."
        ] },
      { h: "Emergency call-outs and the 'special errand' rule", p: [
          "Get called back to work after hours for an emergency? That return trip is usually paid. Under the \"special errand\" rule, when you've gone home and your employer calls you back for something outside your regular schedule, the travel to handle it is compensable, it's substantially different from your ordinary commute.",
          "This matters a lot for on-call technicians, maintenance staff, and IT workers. If you're roused at 2 a.m. to drive 40 minutes to a facility, those 40 minutes each way are hours worked, and if you're already near 40 hours that week they may be overtime hours. Pair this with our guide on [on-call pay rules](/blog/on-call-pay-rules) if waiting by the phone is part of your job."
        ] },
      { h: "State rules can be more generous than federal", p: [
          "The FLSA is the floor, not the ceiling. California, for instance, treats travel time more broadly: any time you're under your employer's control, including required travel to a job site on company transportation, or travel where you can't use the time for your own purposes, is generally paid. Several states also require that travel time be paid at no less than the regular minimum wage.",
          "If you work in a strong wage-law state, check your state's labor department rules before assuming the federal answer applies. The federal rule might say a trip isn't paid while your state says it is. You always get the more protective rule."
        ] },
      { h: "Frequently asked questions", p: [
          "Does my employer have to pay me for the time I spend driving the company truck home? Usually no, commuting in an employer's vehicle is treated like a normal commute under federal law, as long as driving the vehicle home is for your convenience and within your normal commuting area. But if you're required to do work during that drive (picking up materials, dispatching), the picture changes.",
          "Can travel time be paid at a lower rate than my regular wage? Yes, the FLSA allows employers to set a separate, lower rate for travel time, as long as you agreed to it in advance and it's at least the minimum wage. But if travel pushes you over 40 hours, those overtime hours still have to be calculated using a blended [regular rate of pay](/blog/regular-rate-of-pay), so the travel rate can't be used to dodge overtime entirely.",
          "What if my employer never paid me for between-site driving? You may be owed back pay. Federal claims reach back two years, or three if the violation was willful, plus potential liquidated (double) damages. Document the dates and the driving you can remember, it builds the case."
        ] },
      { h: "Add up your real hours and check for back pay", p: [
          "The pattern with travel time is that it's small per day but relentless. Twenty unpaid minutes here, a special trip there, and after a year it's a serious chunk of money. The first step is just counting honestly: log every minute of compensable travel for a few representative weeks. The [time card calculator](/calculators/time-card-calculator) turns clock-in, clock-out and unpaid lunch times into daily and weekly hours.",
          "Then run those weeks through the [overtime calculator](/calculators/overtime-calculator) with travel time included to see if you crossed 40 hours. If unpaid travel has been a regular thing, use the [back-pay calculator](/calculators/back-pay-calculator) to estimate what you might be owed across the two- to three-year window. The numbers surprise people, in a good way."
        ] }
    ]
  },
  {
    slug: "on-call-pay-rules",
    title: "On-Call Pay: When Waiting by the Phone Has to Be Paid",
    description: "The FLSA test for on-call pay in 2026: engaged-to-wait vs waiting-to-be-engaged, when standby time is paid, and how restrictive on-call policies can owe you wages.",
    date: "2026-10-21", readMins: 7, keyword: "on call pay rules", related: ["overtime-calculator"],
    body: [
      { p: [
          "Short answer: on-call time is paid when your employer's restrictions keep you from using it effectively for yourself. Carrying a phone at home and answering if called usually is not paid time. Every actual call-out is always work time, and paid on-call hours can also push a non-exempt worker into overtime.",
          "The U.S. Department of Labor draws the same practical distinction: being required to remain on the employer's premises is work time, while at-home availability usually is not unless added constraints substantially limit personal freedom. The answer turns on the real restrictions and records, not the name of the shift. [Read DOL Fact Sheet #22](https://www.dol.gov/agencies/whd/fact-sheets/22-flsa-hours-worked)."
        ] },
      { h: "The core test: engaged to wait vs waiting to be engaged", p: [
          "Courts and the Department of Labor split on-call time into two buckets. If you're \"engaged to wait,\" the waiting is part of the job and it's paid. If you're \"waiting to be engaged,\" the time is your own and it isn't. The entire fight is over which bucket you fall in.",
          "Think of a delivery driver sitting in the truck between dispatches, engaged to wait, fully paid, because the employer controls the time and it's too short to use for personal purposes. Now think of a plumber who can be anywhere, do anything, and just has to answer a call within a reasonable window, that's usually waiting to be engaged, and unpaid. The label your employer uses doesn't decide it; the actual restrictions do."
        ] },
      { h: "When on-call time has to be paid", p: [
          "On-call time is generally compensable when the restrictions are so tight that you cannot effectively use the time for yourself. Relevant facts include a very short required response time, a requirement to stay on or near the employer's premises, frequent calls that repeatedly interrupt personal time, geographic limits, and rules that bar ordinary activities. No single factor decides every case.",
          "If you must remain at the workplace, the DOL treats the on-call time as hours worked. For at-home or off-premises standby, write down the exact response window, location rule, number of calls, and whether you could actually use the time. Those details are more useful than a label such as \"standby\" or \"on call.\""
        ] },
      { h: "When on-call time usually isn't paid", p: [
          "On the other end, if you can carry a phone, go about your life, and simply respond if called, the standby time itself usually isn't paid. You can be home, at a restaurant, at your kid's game. A response window measured in tens of minutes to an hour, infrequent calls, and freedom to be anywhere all point toward unpaid standby.",
          "Crucially, the actual call still gets paid the moment you start working, including, in many cases, the [travel time](/blog/travel-time-pay-rules) of a call-out under the special-errand rule. So even \"unpaid\" on-call shifts can generate paid hours every time you're actually summoned. Track every call-out; those minutes are real wages and can tip you into overtime."
        ] },
      { h: "How the restrictions stack up: a real-world picture", p: [
          "No single factor decides it, courts look at the whole picture. Imagine two IT workers, both on call one week a month. Worker A just keeps a phone on and can respond within an hour from anywhere; Worker B has to stay within 15 minutes of the data center, can't drink, and gets paged six times a night. Worker A's standby is likely unpaid; Worker B's is likely fully compensable, because the constraints have swallowed her free time.",
          "The more boxes your situation checks, short window, premises requirement, frequent interruptions, geographic leash, activity restrictions, the stronger your claim that the standby itself is hours worked. If you're somewhere in the murky middle, the frequency and length of actual call-outs often tips it."
        ] },
      { h: "On-call hours count toward overtime", p: [
          "Here's the part that turns this into serious money: if your on-call time is compensable, it counts toward your 40-hour overtime threshold. A worker who already puts in 38 regular hours and then has 10 hours of paid standby has crossed 40, and the hours over 40 are owed at time and a half on the [regular rate of pay](/blog/regular-rate-of-pay).",
          "Employers frequently miss this. They might pay a flat on-call stipend without folding the hours into the overtime math, which can shortchange you twice over. Run a week that includes compensable standby through the [overtime calculator](/calculators/overtime-calculator) to see whether you've quietly earned overtime that never showed up on your check."
        ] },
      { h: "Policies and contracts can be more generous than the law", p: [
          "The FLSA sets the legal minimum, but it doesn't stop an employer from paying more. Many companies, union contracts, and public-sector agreements voluntarily pay an on-call premium, a flat stipend per shift, a guaranteed minimum number of paid hours per call-out, or a percentage of your regular rate for standby, even when the law wouldn't strictly require it.",
          "Read your handbook and any collective bargaining agreement. If your employer promised on-call pay in writing, that promise is enforceable as a matter of contract and policy even where the FLSA alone would call the time unpaid. Promised pay that never appears is its own kind of wage claim. The DOL's [Wage and Hour Division](https://www.dol.gov/agencies/whd) handles the federal floor; your contract may give you more."
        ] },
      { h: "Frequently asked questions", p: [
          "Do I get paid for on-call time if I'm never actually called in? It depends entirely on the restrictions. If the standby conditions are tight enough that you can't use the time for yourself, yes, you're owed for the waiting whether or not the phone ever rings. If you're basically free and just carry a phone, the waiting usually isn't paid, but any actual call-out is.",
          "My employer pays a flat $50 on-call stipend per night. Is that legal? Maybe not. A flat stipend is fine if your standby isn't compensable. But if your on-call time is compensable, you're owed at least minimum wage for every hour and overtime once you pass 40, and a flat $50 may fall short. The stipend can't be used to avoid the hourly and overtime rules.",
          "Can sleeping time on an overnight on-call shift be unpaid? Sometimes. For shifts of 24 hours or more, you and your employer can agree to exclude a regularly scheduled sleep period of up to 8 hours, if the employer provides adequate sleeping facilities and you can usually sleep uninterrupted. But if you're called during that period, the interruption is paid, and if you can't get at least 5 hours of sleep the whole period becomes compensable."
        ] },
      { h: "Count your standby hours and check for overtime", p: [
          "On-call disputes turn on facts, so build a record. For a few representative weeks, write down your standby hours, the restrictions you're under (response window, where you can be, activity limits), and every call-out with its start and end time. That log is the backbone of any claim.",
          "Then test it. Add compensable standby to your regular hours and run the week through the [overtime calculator](/calculators/overtime-calculator). If unpaid on-call time has been a regular feature of your job, use the [back-pay calculator](/calculators/back-pay-calculator) to estimate what the two- to three-year window might be worth. Standby time feels like nothing while it's happening, and adds up to a lot on paper."
        ] }
    ]
  },
  {
    slug: "tip-pooling-rules",
    title: "Tip Pooling Rules: Who Can Share Your Tips (and Who Can't)",
    description: "Federal tip pooling rules for 2026: how the tip credit changes who can join the pool, why managers and owners are banned, and when back-of-house can share tips.",
    date: "2026-06-20", readMins: 8, keyword: "tip pooling rules", related: ["tipped-wage-calculator","minimum-wage-calculator"],
    body: [
      { p: [
          "Tip pooling is everywhere in restaurants and bars, and it's one of the most misunderstood, and most abused, areas of wage law. Servers, bartenders, baristas, and delivery drivers routinely have their tips redistributed under house rules that may or may not be legal. When a pool is run wrong, the money doesn't just get shared; it gets stolen, often by the very managers running the pool.",
          "The federal rules changed meaningfully in recent years, and they hinge on one thing almost nobody on the floor knows to ask about: whether the restaurant takes a tip credit. Get that one fact straight and most of the confusion clears up. This is general information, not legal advice, but it'll help you spot when something's off."
        ] },
      { h: "First, what a legal tip pool actually is", p: [
          "A valid tip pool is an arrangement where tipped employees contribute some or all of their tips into a common pot that's then redistributed among eligible workers. The key word is eligible. Federal law puts hard limits on who can be in the pool, and those limits depend on the employer's pay structure.",
          "Two things are always true under federal law: the employer must tell you in advance about any required tip pool, and the tips belong to the employees, never to the house. An employer can't keep tips for itself under any circumstances, even if it pays everyone well above minimum wage. That principle is the anchor for everything below."
        ] },
      { h: "The tip credit changes everything", p: [
          "A \"tip credit\" is when your employer pays a sub-minimum cash wage (as low as $2.13/hour federally) and counts your tips to make up the difference to the $7.25 minimum. Whether your employer does this controls who's allowed in your tip pool. This is the single most important distinction in tip law.",
          "If the employer takes a tip credit, the pool can only include employees who \"customarily and regularly\" receive tips, servers, bartenders, bussers, bellhops, the people the public tips directly. Back-of-house staff like cooks and dishwashers cannot be in a tip-credit pool. If the employer takes no tip credit and pays the full minimum wage in cash, it can run a broader pool that includes back-of-house. Use the [tipped wage calculator](/calculators/tipped-wage-calculator) to figure out whether your employer is taking a credit based on your actual cash wage."
        ] },
      { h: "With a tip credit: front-of-house only", p: [
          "When your employer pays you that reduced cash wage and leans on your tips, the law keeps the pool narrow. Only customarily tipped employees can share: servers, bartenders, bussers, food runners, barbacks, hosts who provide direct service in some cases. The idea is that if the restaurant is already discounting your wage because you're tipped, it can't then funnel those tips to non-tipped workers.",
          "So a tip-credit restaurant cannot make servers tip out the line cooks or dishwashers. If yours does, that's likely an illegal pool, and an illegal pool can invalidate the entire tip credit, meaning the employer owes you the full minimum wage for every hour plus the tips that were wrongly diverted. Run your cash wage and tips through the [minimum wage calculator](/calculators/minimum-wage-calculator) to see whether you've actually been earning the legal minimum."
        ] },
      { h: "Without a tip credit: back-of-house can join", p: [
          "If your employer pays the full minimum wage in cash and takes no tip credit, the rules loosen. A 2018 change to federal law allows these employers to run tip pools that include back-of-house workers, cooks, dishwashers, prep staff, who don't customarily get tipped by customers. The reasoning is that nobody's wage is being discounted, so the kitchen can fairly share.",
          "This is why some full-minimum-wage restaurants run \"house pools\" that spread tips across the whole team. It can be perfectly legal, as long as the cash wage really is the full minimum and no manager or owner dips in. The seven states that ban the tip credit entirely (like California, Washington, and Oregon) effectively always operate in this mode."
        ] },
      { h: "Managers and owners are banned, period", p: [
          "No matter how the pool is structured, federal law flatly prohibits managers, supervisors, and owners from keeping any portion of employee tips, including through a tip pool. This is the bright line. A manager can't take a cut, can't \"participate\" in the pool, can't have tips routed to the house.",
          "The narrow exception: a manager can keep tips a customer gave them directly for service they personally and solely provided, a bartending manager who works a shift and gets tipped at their own bar. But they can't share in the pooled tips of the staff they supervise. If a shift lead or assistant manager is pulling from your pool, that's a violation, and the penalties are stiff, employers can owe the tips taken plus an equal amount in liquidated damages. The DOL's [Wage and Hour Division](https://www.dol.gov/agencies/whd/contact/complaints) takes these complaints."
        ] },
      { h: "State rules can be stricter", p: [
          "Federal law is the floor. Many states pile on additional protections. Several states ban the tip credit entirely, so tipped workers always get the full minimum wage in cash before tips. Some states have their own rules about mandatory service charges (an automatic 18% on large parties may legally belong to the house, not you, unless state law says otherwise) versus voluntary tips.",
          "A few states cap how much can be required in a tip-out, require written tip-pool policies, or extend extra protection to specific roles. Always check your own state's labor department rules alongside the federal ones, you get whichever is more protective. If you work in a tip-credit-banned state, any sub-minimum cash wage on your stub is itself a red flag."
        ] },
      { h: "Frequently asked questions", p: [
          "Can my employer make me tip out the bar and the bussers? Yes, in a tip-credit pool, tipping out other customarily tipped employees like bartenders and bussers is allowed, as long as the total tip-out is reasonable and you still effectively keep enough of your tips. What's not allowed is tipping out the kitchen or any manager when the employer takes a tip credit.",
          "My manager works the floor sometimes and takes tips from the pool. Is that legal? Almost certainly not. A supervisor or manager can keep tips for service they personally and solely provide, but they cannot share in the employees' pooled tips. If your shift manager is drawing from the pool, that's a classic violation worth documenting.",
          "What happens if the tip pool is illegal? It can be expensive for the employer. An invalid pool can void the tip credit, exposing the employer to the full minimum wage for all hours worked, repayment of misappropriated tips, and liquidated (double) damages. That's why a wrongly run pool is one of the most valuable wage claims a tipped worker can have."
        ] },
      { h: "Check your tips and your wage floor", p: [
          "Tip violations hide in plain sight because the rules feel like inside baseball. But you don't need to be a lawyer to catch the big ones: is a manager in the pool? Is the kitchen sharing tips while you're paid a sub-minimum cash wage? Does your cash wage plus tips actually reach the minimum every hour? Any \"yes\" to the first two or \"no\" to the third is a problem.",
          "Start by confirming the basics. Run your cash wage, hours, and tips through the [tipped wage calculator](/calculators/tipped-wage-calculator), then verify you're clearing the floor with the [minimum wage calculator](/calculators/minimum-wage-calculator). If the numbers don't add up, you may be owed both the make-up wages and the diverted tips, and that's worth pursuing."
        ] }
    ]
  },
  {
    slug: "regular-rate-of-pay",
    title: "Regular Rate of Pay: The Number Your Overtime Is Really Based On",
    description: "Your overtime isn't always 1.5x your base wage. Learn what the regular rate of pay includes in 2026, bonuses, shift differentials, commissions, and what it excludes.",
    date: "2026-06-20", readMins: 7, keyword: "regular rate of pay overtime", related: ["overtime-calculator"],
    body: [
      { p: [
          "Most people think overtime is just 1.5 times their hourly wage. For a worker who earns nothing but a flat hourly rate, that's true. But the moment you add a bonus, a shift differential, a commission, or a few other forms of pay, the math changes, and a lot of employers get it wrong, usually in their favor.",
          "The Fair Labor Standards Act doesn't base overtime on your \"base rate.\" It bases it on your regular rate of pay, a specific calculated figure that can be higher than your hourly wage. If your employer calculates overtime on the lower base rate while you're also earning bonuses, you're being shortchanged on every overtime hour. Here's how the real number works."
        ] },
      { h: "Why the regular rate is not just your hourly wage", p: [
          "The regular rate is your total straight-time pay for the workweek divided by the total hours you worked that week. The key insight: \"total pay\" includes more than your hourly wage. It sweeps in most other forms of compensation you earned that week, then spreads them across your hours to find your true hourly value.",
          "So if you earned a production bonus on top of your hourly wage, that bonus inflates your regular rate, which in turn inflates your overtime rate. The FLSA is built to stop employers from paying a low base wage, piling on bonuses, and then calculating cheap overtime on the base alone. Run the corrected number through the [overtime calculator](/calculators/overtime-calculator) and compare it to what your check actually paid."
        ] },
      { h: "What gets included in the regular rate", p: [
          "The regular rate generally includes: nondiscretionary bonuses (anything promised or expected, attendance bonuses, production bonuses, bonuses for hitting goals), shift differentials (extra pay for nights or weekends), commissions, the value of certain prizes and incentives, and on-call pay. If you were promised it for working, performing, or hitting a target, it probably counts.",
          "Shift differentials trip up a lot of payroll departments. If you earn an extra $2/hour for night shifts, that $2 has to be folded into the regular rate for any overtime worked, not just paid as flat extra. Commissions are similar, a commission earned during a week of overtime raises that week's regular rate, even if the commission is paid out later."
        ] },
      { h: "What's excluded from the regular rate", p: [
          "The FLSA carves out specific exclusions. These do NOT go into the regular rate: truly discretionary bonuses (where the employer decides whether and how much to pay, with no promise in advance, think a genuine surprise holiday gift), gifts and holiday bonuses not tied to hours or performance, paid time off such as vacation, holiday, and sick pay for hours not worked, expense reimbursements, and premium pay already paid for overtime, weekends, or holidays.",
          "The discretionary-vs-nondiscretionary line is where most disputes live. Employers love to call bonuses \"discretionary\" to keep them out of the overtime math, but if a bonus is announced in advance or expected based on a formula, it's nondiscretionary and counts, regardless of what the employer labels it. The label doesn't control; the facts do."
        ] },
      { h: "How to actually calculate it: a worked example", p: [
          "Say you earn $18/hour and work 45 hours in a week. You also earn a $90 production bonus that week. Step one: straight-time pay is 45 hours × $18 = $810, plus the $90 bonus = $900 total. Step two: divide by total hours, $900 ÷ 45 = $20 regular rate. Your overtime is based on $20, not $18.",
          "Step three: you've already been paid straight time for all 45 hours, so the overtime you're owed is the extra half-time premium on the 5 overtime hours: 5 × ($20 × 0.5) = $50. If your employer instead paid overtime as 5 × ($18 × 0.5) = $45, you were underpaid $5 that week. Small per week, but multiply it across every week you earned a bonus and worked overtime, and it's real money. For a plain hourly week with no extras, the [overtime calculator](/calculators/overtime-calculator) gives the simple answer."
        ] },
      { h: "The salaried non-exempt twist", p: [
          "If you're salaried but non-exempt (you get overtime despite being on salary), the regular rate is found by dividing your weekly salary by the number of hours it's intended to cover, then layering overtime on top. A salary doesn't make overtime disappear, it just changes how the regular rate is computed.",
          "This matters because employers sometimes pay a flat salary and pretend overtime doesn't apply. If you're non-exempt, every hour over 40 still earns the overtime premium on your regular rate. Our guide to [exempt vs non-exempt employees](/blog/exempt-vs-non-exempt-employees) can help you tell which side of the line you're on; if you're misclassified, the unpaid overtime back pay can be substantial."
        ] },
      { h: "Why employers get this wrong so often", p: [
          "The regular rate is genuinely fiddly, and payroll software doesn't always handle bonuses and differentials correctly. The two most common errors: (1) paying overtime on the base hourly rate while ignoring nondiscretionary bonuses and differentials, and (2) misclassifying nondiscretionary bonuses as discretionary to keep them out of the calculation entirely.",
          "Both errors shrink your overtime, week after week. And because each individual shortfall is small, it usually goes unnoticed, which is exactly why it's worth checking. The Department of Labor explains the regular rate in detail through its [Wage and Hour Division](https://www.dol.gov/agencies/whd), and these are among the most commonly litigated wage violations."
        ] },
      { h: "Frequently asked questions", p: [
          "Does a signing bonus or a once-a-year holiday bonus raise my overtime rate? It depends on whether it's discretionary. A true year-end gift the employer wasn't obligated to pay and didn't promise is excluded. But a bonus tied to attendance, production, or hitting goals, or one announced in advance, is nondiscretionary and must be included in the regular rate for the weeks it covers.",
          "My commission is paid monthly. How does that affect weekly overtime? The commission has to be allocated back to the workweeks in which it was earned, and each of those weeks' regular rates recalculated. If you worked overtime in any of those weeks, you're owed additional overtime on the bumped-up rate. Employers frequently skip this recalculation.",
          "Can my employer exclude my shift differential from overtime? No. A shift differential for night or weekend work is part of the regular rate. Overtime worked during a differential-paying shift must be calculated on the higher rate that includes the differential."
        ] },
      { h: "Recalculate your overtime and check for a shortfall", p: [
          "If you earn anything beyond a flat hourly wage, bonuses, commissions, shift differentials, on-call pay, and you've worked overtime, there's a real chance your overtime was calculated on too low a number. The fix starts with computing your true regular rate for a few representative weeks using the example above.",
          "Then compare it to what your pay stubs actually paid. Run the corrected regular rate through the [overtime calculator](/calculators/overtime-calculator), and if you find a gap, use the [back-pay calculator](/calculators/back-pay-calculator) to estimate what's owed across the FLSA's two- to three-year window, plus potential liquidated damages. Underpaid regular-rate overtime is one of the most common, and most recoverable, wage errors out there."
        ] }
    ]
  },
  {
    slug: "biweekly-vs-semimonthly-pay",
    title: "Biweekly vs Semimonthly Pay (and How to Convert Salary to Hourly)",
    description: "Biweekly (26 checks) vs semimonthly (24 checks): how each works, why semimonthly can hide overtime, and how to convert a salary to an hourly rate with the 2,080-hour method.",
    date: "2026-06-20", readMins: 7, keyword: "biweekly vs semimonthly payroll", related: ["salary-to-hourly-calculator","overtime-calculator"],
    body: [
      { p: [
          "\"Biweekly\" and \"semimonthly\" sound like the same thing, and people swap the words constantly. They're not the same, and the difference does more than change when your check lands. For hourly workers especially, the choice between them affects how overtime gets calculated, and a sloppy semimonthly setup can quietly cheat you out of overtime pay.",
          "Here's a clear breakdown of how each schedule works, why payroll departments prefer one, and where the wage-and-hour traps hide."
        ] },
      { h: "Biweekly: every two weeks, 26 paychecks a year", p: [
          "Biweekly means you're paid every two weeks, same day of the week, usually every other Friday. Because there are 52 weeks in a year, that works out to 26 paychecks. Two months a year you'll get three paychecks instead of two, which is the famous \"extra paycheck\" month that feels like a bonus (it isn't, it's just the calendar).",
          "Each biweekly check covers exactly two seven-day workweeks. That clean alignment is the whole reason biweekly is the gold standard for hourly pay, as we'll see in a moment. If you want to translate a biweekly check back into an annual or hourly figure, the [salary-to-hourly calculator](/calculators/salary-to-hourly-calculator) handles the conversion."
        ] },
      { h: "Semimonthly: twice a month, 24 paychecks a year", p: [
          "Semimonthly means twice a month, typically on set dates like the 15th and the last day of the month. That's 24 paychecks a year, two fewer than biweekly. Each check covers half a month, but half a month isn't a clean number of weeks. Sometimes a pay period holds 10 working days, sometimes 11 or 12, and pay dates drift across the days of the week.",
          "The upside for employers and salaried workers is predictability, bills and salaries map neatly to calendar months. The downside, and it's a big one for hourly workers, is that semimonthly pay periods don't line up with the FLSA workweek. That mismatch is where overtime problems start."
        ] },
      { h: "Why semimonthly complicates overtime", p: [
          "Overtime under the FLSA is calculated on a single, fixed seven-day workweek, not a pay period. With biweekly pay, two whole workweeks fit neatly inside each check, so the employer just computes overtime for each week and you're done. With semimonthly pay, a workweek frequently straddles two pay periods: you might work Monday through Wednesday on one check and Thursday through Sunday on the next.",
          "That split forces the employer to track hours by workweek separately from the pay period and reconcile them. Done right, it's fine. Done wrong, and it often is, the employer accidentally resets your hours at the pay-period boundary, so a week where you worked 45 hours gets chopped into a 20-hour piece and a 25-hour piece, and neither piece crosses 40. Result: your overtime vanishes.",
          "If you're paid semimonthly and work variable hours, this is worth checking. Reconstruct your hours by true calendar workweek (not pay period) and run them through the [overtime calculator](/calculators/overtime-calculator). If a week topped 40 but your check showed no overtime because the hours were split across two pay dates, you may be owed back pay."
        ] },
      { h: "The impact on your benefits and budget", p: [
          "The number of paychecks changes how per-check deductions feel. Biweekly's 26 checks mean smaller per-check deductions for things spread across the year, but two months bring that \"extra\" third check. Semimonthly's 24 checks are larger and perfectly steady, which makes budgeting against monthly rent and bills easier for a lot of people.",
          "Benefits can be deducted differently too. Some employers spread health-insurance premiums across only 24 of the 26 biweekly checks, so your two \"extra\" checks each year skip the deduction and run a little larger. Retirement contributions calculated as a percentage end up the same either way, but flat-dollar deductions per check add up differently. None of this changes your annual total, it just changes the rhythm."
        ] },
      { h: "Which one is 'better'?", p: [
          "Neither is objectively better; they serve different needs. Biweekly is friendlier to hourly and overtime-earning workers because it aligns with the workweek and makes overtime straightforward. Semimonthly is tidier for salaried workers and for matching monthly expenses, but it puts more burden on payroll to handle overtime correctly.",
          "What matters for your wages isn't which schedule you're on, it's whether overtime is being computed on the true workweek regardless of schedule. A well-run semimonthly payroll pays overtime perfectly. A careless one underpays it. The schedule just changes how easy it is for an honest mistake to slip through."
        ] },
      { h: "Converting salary to hourly", p: [
          "To turn an annual salary into an hourly rate, divide by 2,080, which is 40 hours x 52 weeks. A $52,000 salary is $25 an hour, $75,000 is about $36.06, and $40,000 is about $19.23. The [salary to hourly calculator](/calculators/salary-to-hourly-calculator) does it instantly. The divisor is an assumption, not a law: if your standard week is 37.5 hours, divide by about 1,950 instead, which makes a $52,000 salary $26.67 an hour.",
          "Per-check pay is salary divided by pay periods. A $52,000 salary is $2,000 biweekly, about $2,167 semimonthly and about $4,333 monthly, all before taxes. The hourly rate matters beyond budgeting. For a salaried non-exempt employee it is the regular rate that overtime is built on, so a $50,000 salary (about $24.04 an hour) earns overtime of about $36.06 an hour. In a state that requires vacation payout, 40 unused PTO hours at $24.04 is about $962 at separation. The result is gross, not take-home."
        ] },
      { h: "Frequently asked questions", p: [
          "Can my employer pay me semimonthly if I'm hourly? Yes, the FLSA doesn't mandate a particular pay frequency (states set minimum frequency rules, and most allow semimonthly). What the FLSA does require is that overtime be calculated on each fixed seven-day workweek, no matter how the pay periods are arranged. The schedule is legal; miscalculating overtime under it is not.",
          "I'm paid on the 15th and 30th and my overtime looks low, what should I check? Rebuild your hours by actual seven-day workweek rather than by pay period. If a single workweek spanned both checks and your total for that week exceeded 40, all hours over 40 are owed at time and a half, even though they were paid across two dates. A week split at the pay-period line that erased your overtime is a classic semimonthly error.",
          "Does switching from biweekly to semimonthly cut my pay? No, your annual salary or hourly earnings don't change. You just receive them in 24 larger checks instead of 26 smaller ones. The total is the same; only the timing and per-check size differ."
        ] },
      { h: "Rebuild your workweeks and check the overtime", p: [
          "If you're hourly and paid semimonthly, do yourself a favor: ignore the pay-period boundaries and reconstruct your hours by true seven-day workweek for a few recent weeks. That's the only view the FLSA cares about for overtime, and it's the view that reveals split-week errors.",
          "Run those reconstructed weeks through the [overtime calculator](/calculators/overtime-calculator). If any week topped 40 hours but your pay didn't reflect overtime because the hours landed on two different checks, you may have a back-pay claim, and the [back-pay calculator](/calculators/back-pay-calculator) can estimate what it's worth across the FLSA's two- to three-year window."
        ] }
    ]
  },
  {
    slug: "what-is-wage-theft",
    title: "What Is Wage Theft? Types, Examples, and What You Can Recover",
    description: "Wage theft is any time an employer pays less than the law requires. The common forms, a worked off-the-clock example, how much you can recover, and where to report it.",
    date: "2026-06-22", readMins: 6, keyword: "wage theft", related: ["back-pay-calculator","overtime-calculator"],
    body: [
      { p: [
          "Wage theft is any time an employer pays you less than the law requires. It is not a fringe problem. A well-known Economic Policy Institute study estimated that minimum-wage violations alone cost workers in the ten largest states roughly $8 billion a year. Unpaid overtime, stolen tips and off-the-clock hours come on top of that.",
          "If you have ever kept working after clocking out, been paid straight time for a 50-hour week, or watched a manager take from the tip jar, you have probably seen it up close. Recovering the money is usually free to start."
        ] },
      { h: "The forms it takes", p: [
          "The usual ones: no 1.5x premium for hours over 40, pay below the federal, state or city minimum, work before you clock in or after you clock out, time rounded down (a 7:58 punch becomes 8:15), and deductions for uniforms, customer walkouts or a short register. These are separate violations and they stack. One restaurant worker can be shorted on overtime, charged for a uniform and have tips skimmed, all on the same check.",
          "For the overtime piece in detail, see [how to calculate overtime pay](/blog/how-to-calculate-overtime-pay)."
        ] },
      { h: "Off-the-clock work, with numbers", p: [
          "Off-the-clock work is the violation investigators run into most. If your employer requires or knowingly allows work that benefits the business, that time is paid time whether or not you were clocked in. A mandatory pre-shift huddle, booting a slow point-of-sale terminal, putting on required protective gear, or finishing the closing checklist after you punch out all count. The test is whether the employer knew or should have known. A 9:00 meeting on a shift that starts at 9:30 answers that question.",
          "Say you are paid $16 an hour and arrive 15 minutes early five days a week. That is 1.25 hours, or $20 a week. Over a year it is $1,040. Over the two-year federal window it is $2,080, and with equal liquidated damages the claim is $4,160. If those extra minutes push you past 40 hours in the week, they are owed at $24 instead of $16."
        ] },
      { h: "Tip theft and illegal deductions", p: [
          "Your tips belong to you. Owners, managers and supervisors cannot keep any part of them or join a tip pool, even if they personally served the table. An employer that takes a cut of card tips, or runs a pool that includes the boss, is committing wage theft. The rules on who may share tips are in [tip pooling rules](/blog/tip-pooling-rules).",
          "Deductions are the quiet version. An employer generally cannot charge you for uniforms, cash shortages, walkouts or broken equipment if that drops your pay below minimum wage or cuts into overtime. Tipped workers should also read [tipped minimum wage and the tip credit](/blog/tipped-minimum-wage-and-tip-credit), which covers overtime for tipped employees."
        ] },
      { h: "How much you can recover", p: [
          "Under the FLSA you can recover unpaid wages going back two years, or three if the violation was willful, meaning the employer knew or recklessly ignored that it was breaking the law. On top of the wages, a court awards liquidated damages equal to the wages unless the employer proves good faith. A $6,000 overtime shortfall therefore becomes a $12,000 claim, and a winning worker can also recover attorney fees from the employer under 29 U.S.C. 216(b). That fee rule is why employment lawyers take strong wage cases on contingency. See [hiring an attorney for unpaid wages](/blog/attorney-for-unpaid-wages).",
          "To see your own figure, run it through the [back-pay calculator](/calculators/back-pay-calculator)."
        ] },
      { h: "State law often goes further", p: [
          "Federal law is the floor. [California](/states/california#wage-claim) allows up to four years and adds waiting-time penalties for late final pay. [New York](/states/new-york#wage-claim) allows six years under its Wage Theft Prevention Act. [Illinois](/states/illinois#wage-claim) adds 5% monthly damages on top of wages owed. When both federal and state law apply, you pursue the one that gives the larger recovery."
        ] },
      { h: "How to report it", p: [
          "There are three routes and they are not mutually exclusive. A free complaint with the U.S. Department of Labor's [Wage and Hour Division](https://www.dol.gov/agencies/whd) puts an investigator on your employer, and your identity can be kept confidential. A state labor agency complaint can reach back further in many states. An employment attorney, usually on contingency, is the stronger path for large or complex claims.",
          "The step-by-step is in [how to file a Department of Labor complaint](/blog/file-department-of-labor-complaint) and [how to file a wage claim](/blog/how-to-file-a-wage-claim). If you want to try a written demand first, the $29 Claim Kit prepares a letter pre-filled with your back-pay figures and a filing guide for your state."
        ] },
      { h: "Retaliation is its own violation", p: [
          "The FLSA and nearly every state wage law bar an employer from firing, demoting or cutting the hours of someone who reports wage theft or cooperates in an investigation. Retaliation becomes a second claim with its own damages, often including lost wages and reinstatement. Write down the date you complained, the date of any adverse action and who delivered it."
        ] },
      { h: "Frequently asked questions", p: [
          "Is wage theft a crime or only a civil matter? It can be both. Most cases are resolved civilly through back-pay orders or lawsuits, but a growing number of states, including California, New York, Minnesota and Colorado, prosecute serious cases criminally.",
          "What if I was paid in cash and have no pay stubs? You can still file. The law requires the employer to keep accurate records, not you. When their records are missing or false, investigators and courts accept a reasonable estimate of your hours and hold the gap against the employer.",
          "How long does it take to get my money? A clean Wage and Hour Division case can resolve in a few months. A contested lawsuit can take a year or more. The limitations clock keeps running meanwhile, as explained in [the statute of limitations on unpaid wages](/blog/statute-of-limitations-unpaid-wages)."
        ] },
      { h: "Start with the number", p: [
          "Add up your real hours, your real rate and what actually reached your bank account. The [back-pay calculator](/calculators/back-pay-calculator) gives a week-by-week estimate, and the [overtime calculator](/calculators/overtime-calculator) checks a single week. This is general information, not legal advice, but it is a concrete figure you can take to an agency or an attorney."
        ] }
    ]
  },
  {
    slug: "how-to-file-a-wage-claim",
    title: "How to File a Wage Claim: A Step-by-Step Guide for 2026",
    description: "Filing a wage claim with the DOL or your state agency is free and does not need a lawyer. What to gather, a worked claim amount, how to file in five steps, and what happens after.",
    date: "2026-06-22", readMins: 5, keyword: "how to file a wage claim", related: ["back-pay-calculator"],
    body: [
      { p: [
          "A wage claim is a formal request for pay you are legally owed. You can file with the U.S. Department of Labor's Wage and Hour Division (WHD), with your state labor agency, or with both. It is free, it can be confidential, and you do not need a lawyer to start.",
          "Most people never file because they assume it is complicated. The federal form takes about fifteen minutes online, and an investigator does the legwork after that. The steps below are in the order that saves the most time."
        ] },
      { h: "Step 1: Decide which agency", p: [
          "The WHD enforces federal law: unpaid overtime, minimum-wage shortfalls, tip-credit abuse, off-the-clock work and illegal deductions. State agencies enforce state wage law, which often has higher minimums, longer lookbacks or bigger penalties. Filing with one does not block the other. Workers in [California](/states/california#wage-claim), [New York](/states/new-york#wage-claim) and [Washington](/states/washington#wage-claim) often recover more under state law. If you are unsure, start with the WHD and let the investigator tell you about jurisdiction."
        ] },
      { h: "Step 2: Work out what you think you are owed", p: [
          "You do not need an exact figure to file, but a figure makes the claim harder to dismiss. Go week by week: your rate, the hours you actually worked, and what was actually paid.",
          "Here is what that looks like. A worker paid $19 an hour is paid straight time for 46 hours a week for 30 weeks. The missing premium is 6 hours x $9.50 = $57 a week, or $1,710 over 30 weeks. With equal liquidated damages the claim is $3,420. The [back-pay calculator](/calculators/back-pay-calculator) produces this table for you, and the [overtime calculator](/calculators/overtime-calculator) checks any single week."
        ] },
      { h: "Step 3: Gather what you have", p: [
          "Collect pay stubs for the period, clock-in printouts, your own log of hours, and any texts or emails where a manager asked for work outside your scheduled shift. Note your job title, pay rate and approximate hire date. If you do not have records, file anyway. The FLSA requires employers to keep payroll records for at least three years, and when those records are incomplete, investigators and courts hold the gap against the employer."
        ] },
      { h: "Step 4: File with the Wage and Hour Division", p: [
          "Use the [WHD complaint page](https://www.dol.gov/agencies/whd/contact/complaints) or call 1-866-487-9243. You will need the employer's name and address, your job title and pay rate, the date range of the violation and a short description of what happened. You do not have to cite a section of the FLSA. You can ask that your identity be kept confidential, and you will get a reference number when you submit. Save it."
        ] },
      { h: "Step 5: File with your state agency too", p: [
          "Most states have a labor commissioner, department of labor or wage board that handles state claims. California workers file with the Labor Commissioner, [Texas](/states/texas#wage-claim) workers with the Texas Workforce Commission, and [Colorado](/states/colorado#wage-claim) workers with the Division of Labor Standards. State agencies are sometimes faster than the WHD and may reach back further. Filing both takes about thirty minutes.",
          "If you would like the filing route and forms laid out for your state, along with a demand letter to send first, that is what the $29 Claim Kit contains. The free [wage-claim guides](/wage-claim) cover every state's agency without it."
        ] },
      { h: "What happens after you file", p: [
          "The WHD assigns an investigator who reviews employer records, interviews employees, usually confidentially, and contacts the employer. You do not argue the case in person. If a violation is found, the employer is ordered to pay back wages plus liquidated damages. If it refuses, the Department of Labor can sue on your behalf. Investigations usually take two to twelve months depending on complexity. If the WHD closes your case without a result you agree with, you can still bring a private suit within the limitations period."
        ] },
      { h: "Frequently asked questions", p: [
          "Does filing cost anything? No. Agency complaints are free. You pay only if you hire a private attorney, and most wage attorneys work on contingency.",
          "Can my employer fire me for filing? No. Retaliation is illegal under the FLSA and state law. If it happens, it becomes a second claim, so file a separate retaliation complaint right away and document the timing.",
          "Should I use an agency or a lawyer? For a small, clear claim, the WHD is simplest. For large amounts, misclassification, or a problem affecting several coworkers, an [attorney for unpaid wages](/blog/attorney-for-unpaid-wages) usually recovers more."
        ] },
      { h: "Do the arithmetic before you file", p: [
          "A claim with a number in it moves faster and tells you whether a lawsuit is worth the effort. Run your hours and rate through the [back-pay calculator](/calculators/back-pay-calculator), save the result, and attach it to your complaint. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "file-department-of-labor-complaint",
    title: "How to File a Department of Labor Complaint (Wage and Hour)",
    description: "How to file a Department of Labor wage complaint: what the form asks, an example narrative, how the investigation works, FY2025 recovery figures, and state agencies to file with too.",
    date: "2026-08-20", readMins: 6, keyword: "department of labor complaint", related: ["back-pay-calculator"],
    body: [
      { p: [
          "A Department of Labor complaint is a report to the Wage and Hour Division (WHD), the part of the DOL that enforces the FLSA. It is the most accessible enforcement route for a worker who thinks they were underpaid. It is free, you can file online, and your identity is kept confidential to the extent the law allows.",
          "You do not need a lawyer, legal citations or a complete set of records. You need to describe what happened and give enough detail for an investigator to start."
        ] },
      { h: "What the WHD enforces", p: [
          "More than 180 federal labor laws. The common wage complaints are unpaid overtime, minimum-wage shortfalls, tip-credit abuse, off-the-clock work and illegal deductions. Discrimination and harassment that are unrelated to pay go to the EEOC instead. The overtime rules the WHD applies are in [how to calculate overtime pay](/blog/how-to-calculate-overtime-pay)."
        ] },
      { h: "Filing online: what to have ready", p: [
          "Use the [WHD complaint page](https://www.dol.gov/agencies/whd/contact/complaints), or call 1-866-487-9243. The form asks for the employer's name, address and approximate size, your contact details, your job title and rate, the date range of the problem and a short narrative. No attachments are required to start. Allow fifteen minutes.",
          "A narrative that works is specific and short, for example: I worked at Smith Auto Parts as a counter clerk from January 2024 to present at $17.50 an hour. Most weeks I work 45 hours but am paid for 40 at straight time. I estimate I am owed about $2,275 for the last year. My manager is Dana Reyes. I have pay stubs and my own hours log. The estimate comes from the [back-pay calculator](/calculators/back-pay-calculator): 5 hours x $8.75 half-time premium = $43.75 a week, or $2,275 over 52 weeks."
        ] },
      { h: "How the investigation works", p: [
          "A district office assigns an investigator, who contacts the employer, asks for payroll records and time logs, and may interview coworkers. If the employer's records are missing or falsified, investigators reconstruct what is owed from employee statements and reasonable estimates. The FLSA puts the recordkeeping duty on the employer, so missing records work against it. Straightforward cases can finish in a few months. Cases involving a whole workforce, such as misclassification, take longer."
        ] },
      { h: "What the agency can order", p: [
          "If a violation is found, the employer receives a back-wage finding and a deadline to pay. If it refuses, the Solicitor of Labor can file a federal suit on your behalf. The WHD can also assess civil money penalties of up to $2,515 per willful or repeated violation, a figure held flat for 2026 because the CPI-U data needed for the annual inflation adjustment was never published. Penalties go to the government, not to you. Back wages and, in most successful cases, an equal amount of liquidated damages go to the worker. See [what is back pay](/blog/what-is-back-pay) for how the doubling works."
        ] },
      { h: "Is it worth filing? The FY2025 numbers", p: [
          "The WHD reported recovering more than $259 million in back wages for nearly 177,000 workers in fiscal year 2025, about $1,465 per worker and the highest total since 2019. Healthcare had the most dollars recovered, more than $53 million across 2,370 violations. Food services had the most cases, 4,088 violations with over $42 million recovered. Civil penalties assessed were $58.7 million, up from $35.9 million the year before. Source: [DOL Wage and Hour Division FY2025 announcement](https://www.dol.gov/newsroom/releases/whd/whd20260108).",
          "The takeaway is practical: the agency recovers money regularly, especially for unpaid overtime, tip-credit errors and misclassification. It does not guarantee an investigation of every complaint, and a specific, documented one improves the odds."
        ] },
      { h: "File with your state at the same time", p: [
          "The WHD enforces federal law only. Most states have their own wage agency, and state law can have higher minimums, longer lookbacks or bigger penalties. California workers file with the Labor Commissioner, New York workers with the Division of Labor Standards, Texas workers with the Texas Workforce Commission and Colorado workers with the Division of Labor Standards. Our state guides ([California](/states/california#wage-claim), [New York](/states/new-york#wage-claim), [Illinois](/states/illinois#wage-claim)) list the routes. Filing both takes about thirty minutes and costs nothing."
        ] },
      { h: "Retaliation protection", p: [
          "It is illegal to fire, demote or cut the hours of a worker for filing a WHD complaint or cooperating in an investigation. If it happens, file a separate retaliation complaint immediately. The federal deadline is two years, three if willful, but some state retaliation statutes are much shorter, some as short as 30 days. Keep a note of the date you complained, the date of any adverse action and who delivered it."
        ] },
      { h: "Frequently asked questions", p: [
          "Is the complaint really confidential? The WHD keeps your identity confidential to the extent the law allows and often interviews several employees so that no one is singled out. In a very small workplace, total anonymity cannot always be guaranteed.",
          "What if I already quit or was fired? You can still file. The two-year FLSA clock runs from each underpaid payday, not your last day.",
          "Can the WHD recover wages for my coworkers too? Yes. Investigations often expand to everyone affected by the same pay practice.",
          "Do I have to testify in court? Generally no. Most investigations are resolved through records and confidential interviews."
        ] },
      { h: "Put a number in the complaint", p: [
          "A complaint with a figure attached gets taken more seriously. Build a week-by-week estimate with the [back-pay calculator](/calculators/back-pay-calculator) before you submit. If you want to try a written demand first, the $29 Claim Kit pre-fills the letter and includes a state filing guide. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "what-is-back-pay",
    title: "What Is Back Pay? Definition, Types, and How to Calculate It",
    description: "Back pay is wages you were legally owed but never received. Under the FLSA you can recover up to three years of it, plus liquidated damages that often double your total. Here is how it works.",
    date: "2026-06-23", readMins: 6, keyword: "what is back pay", related: ["back-pay-calculator","overtime-calculator"],
    body: [
      { p: [
          "Back pay is the gap between what an employer was legally required to pay you and what they actually paid. It is the money remedy for wage theft. Under the FLSA you can typically recover back pay going two years into the past, three years if the violation was willful, and on top of that, courts routinely award liquidated damages equal to 100% of the amount owed.",
          "Put concretely: if your employer shorted you $4,000 in overtime over two years, your real claim is usually closer to $8,000 once liquidated damages are added, with attorney fees paid by the employer on top of that. Understanding how the number is built helps you spot when you are owed it."
        ] },
      { h: "Common types of back-pay claims", p: [
          "Unpaid overtime is the most frequent claim by far: the employer either failed to pay 1.5x the regular rate for hours over 40, or paid overtime on the base wage while leaving out a bonus that should have been in the regular rate. Minimum-wage shortfalls come next, especially for tipped workers whose cash wage plus tips fell short of the applicable minimum.",
          "Back pay also arises from off-the-clock work like mandatory meetings and pre-shift tasks, unlawful deductions, failure to pay for every hour of a split shift, and unpaid final wages when a job ends. If you suspect any of these, the broader picture is laid out in [what is wage theft](/blog/what-is-wage-theft)."
        ] },
      { h: "How to calculate overtime back pay", p: [
          "For overtime, the method is consistent. Identify the correct regular rate for each affected week, count the overtime hours the employer underpaid or skipped entirely, and multiply by the underpayment rate. If you were paid straight time instead of time and a half, you are owed an extra 0.5x per hour; if you were not paid at all, you are owed the full 1.5x.",
          "Sum that across every week in the claim period. The [back-pay calculator](/calculators/back-pay-calculator) does this arithmetic automatically: enter your hourly rate, your actual hours, and the hours the employer paid, and it returns a week-by-week underpayment figure you can hand to the WHD or an attorney."
        ] },
      { h: "Don't forget the regular rate", p: [
          "Overtime is 1.5x your regular rate, not 1.5x your base wage, and the two are not always the same number. The regular rate adds in nondiscretionary bonuses, commissions and shift differentials, divided by hours worked.",
          "Example: you earn $20 an hour plus a $200 weekly production bonus and work 50 hours. Straight-time pay is 50 x $20 + $200 = $1,200, so your regular rate is $24. You were already paid straight time for every hour, so the extra owed on the 10 overtime hours is 10 x $12 = $120, and the correct week is $1,320. An employer that computed overtime on the $20 base paid 40 x $20 + 10 x $30 + $200 = $1,300, which is $20 short for that week. Most workers never catch it, and across 52 weeks it is $1,040. The [overtime calculator](/calculators/overtime-calculator) handles blended rates."
        ] },
      { h: "Liquidated damages: the doubling rule", p: [
          "Under 29 U.S.C. 216(b), workers who win an FLSA case are entitled to liquidated damages equal to the full amount of back wages owed. If you are owed $5,000 in unpaid overtime, the total recovery is usually $10,000.",
          "An employer can avoid the doubling only by proving it acted in good faith and reasonably believed its pay practice was lawful, a high bar that few clear. In practice, liquidated damages are the rule, not the exception, which is why even modest-sounding shortfalls are worth pursuing."
        ] },
      { h: "State law may give you more", p: [
          "State wage laws often allow longer lookbacks and bigger penalties. [California](/states/california#wage-claim) permits up to four years for certain claims and adds waiting-time penalties for late final pay. [New York](/states/new-york#wage-claim) allows six years with 100% liquidated damages. [Illinois](/states/illinois#wage-claim) allows up to ten years for some claims.",
          "When both federal and state claims apply, you recover under whichever theory produces the better outcome. You are never capped at the federal minimum just because the FLSA also applies."
        ] },
      { h: "How far back can you actually go", p: [
          "The lookback is rolling, not fixed: each underpaid paycheck has its own clock, so filing today reaches back two or three years from today, and waiting six months pushes the earliest weeks out of range. That is why the value of a back-pay claim quietly shrinks every month you wait.",
          "If you suspect the employer hid the violation, the clock can sometimes be paused. The full mechanics are in our guide to the [statute of limitations on unpaid wages](/blog/statute-of-limitations-unpaid-wages)."
        ] },
      { h: "Frequently asked questions", p: [
          "Is back pay taxable? Yes. Back pay for wages is treated as taxable income in the year you receive it, just like a regular paycheck. Liquidated damages may be treated differently, so it is worth asking a tax professional once you recover.",
          "Do I need a lawyer to get back pay? Not always. For a clean claim, the WHD can order back pay for free. For large or contested claims, an [attorney for unpaid wages](/blog/attorney-for-unpaid-wages) on contingency typically captures more, including liquidated damages and the longest defensible lookback.",
          "Can I get back pay if I was paid a salary? Possibly. A salary does not automatically make you exempt from overtime. If your duties and pay do not meet the exemption tests, you may be owed years of overtime back pay."
        ] },
      { h: "See your number", p: [
          "Back pay stops being abstract the moment you put a figure on it. The math is straightforward once you have your rate, your real hours, and what the employer actually paid.",
          "Run the numbers through the [back-pay calculator](/calculators/back-pay-calculator) for a week-by-week total, or the [overtime calculator](/calculators/overtime-calculator) to check a single week first. This is general information, not legal advice, but it is the number every wage claim starts from."
        ] }
    ]
  },
  {
    slug: "statute-of-limitations-unpaid-wages",
    title: "Statute of Limitations on Unpaid Wages: How Long Do You Have?",
    description: "The FLSA gives you two years to recover unpaid wages, three if the violation was willful. Many states allow four to six. Every week you wait quietly narrows your recovery.",
    date: "2026-08-20", readMins: 9, keyword: "statute of limitations unpaid wages", related: ["back-pay-calculator"],
    body: [
      { p: [
          "The statute of limitations on unpaid wages sets how far back you can reach when recovering back pay. Under the federal FLSA the window is two years, or three years if the employer's violation was willful. State laws often go further: California allows up to four years, New York up to six.",
          "The crucial detail most workers miss is that the clock starts with each underpaid paycheck, not the day you discover the problem. That makes the window rolling, and it makes timing the single biggest lever on the size of your claim."
        ] },
      { h: "The federal FLSA deadlines", p: [
          "Under the FLSA, a claim must be filed within two years of the date the wages should have been paid, which is the regular payday for that period. Each underpaid paycheck is a separate violation with its own two-year clock, so the lookback rolls forward with you. File in August 2026 and you can reach back to roughly August 2024.",
          "Wait six more months and those earliest weeks simply fall outside the window and are gone. There is no way to recover them later, which is why even a strong claim loses value the longer it sits."
        ] },
      { h: "When three years applies", p: [
          "A willful violation extends the federal period from two years to three. Courts have found willfulness where an employer ignored a prior WHD investigation, received written notice of a classification problem and did nothing, or claimed an overtime exemption it had no factual basis to use.",
          "That extra year is not trivial. On a steady violation, a three-year lookback adds roughly 50% more back pay than a two-year one. The full mechanics of how willfulness inflates a claim are covered in [unpaid overtime recovery](/blog/unpaid-overtime-recovery)."
        ] },
      { h: "State laws are often more generous", p: [
          "Many states run their own wage statutes with longer windows. [California](/states/california#wage-claim) allows three years under the Labor Code and up to four under the Unfair Competition Law. [New York](/states/new-york#wage-claim) allows six years under the Wage Theft Prevention Act. New Jersey allows six, and [Washington](/states/washington#wage-claim) allows three.",
          "[Illinois](/states/illinois#wage-claim) is a special case worth naming directly: a private lawsuit under the Illinois Wage Payment and Collection Act carries a 10-year window, one of the longest in the country, but filing an administrative complaint with the Illinois Department of Labor instead is limited to just 1 year from the underpayment. That gap between routes is easy to miss and can cost most of a decade of recovery if you default to the shorter administrative path without realizing a private claim is also on the table.",
          "When both federal and state claims are viable, you pursue the state claim to capture the longer window. That choice alone can double the reachable period, so your state is as important as the violation itself."
        ] },
      { h: "When the clock starts", p: [
          "The limitations period begins when the wages were due, on the payday they should have appeared, or by your state's deadline for final pay when a job ends. This matters most for off-the-clock claims: time you worked before your shift was owed on that week's payday, not the day you finally realize it was missing.",
          "So the question is never when did I notice. It is when should this money have been in my check. Each of those paydays anchors its own deadline."
        ] },
      { h: "Tolling: when the clock can be paused", p: [
          "The limitations period can sometimes be tolled, or paused, when an employer actively concealed the violation, for example by falsifying time records, barring employees from reviewing their hours, or flatly telling workers that no overtime was owed when it was.",
          "Courts in many circuits will toll the clock until the employee discovered, or reasonably should have discovered, the underpayment. If you suspect concealment, say so in your complaint and document it. It can meaningfully extend how far back you can reach."
        ] },
      { h: "Why waiting costs real money", p: [
          "Run two versions of your claim: one reaching back three years and one reaching back two. The difference between those totals is exactly what you forfeit for every year of inaction, and it is usually larger than people expect.",
          "Filing a WHD complaint or talking to an employment attorney costs nothing upfront. Waiting, by contrast, has a steady, compounding price. The [back-pay calculator](/calculators/back-pay-calculator) makes that gap easy to see."
        ] },
      { h: "Frequently asked questions", p: [
          "Does filing a WHD complaint stop the clock? Not automatically in a way that preserves a later private lawsuit. The statute keeps running during a WHD investigation, so if you want to lock in the full lookback, ask an [attorney for unpaid wages](/blog/attorney-for-unpaid-wages) about the filing dates before the deadline passes.",
          "What if I only just found out months later? With most overtime and minimum-wage claims, discovery does not reset the clock; it runs from each payday. The narrow exception is concealment, where tolling may apply. Either way, act quickly rather than assuming you have time.",
          "Can I still file after I leave the job? Yes. The clock runs from the paydays, not your last day, so former employees regularly recover back pay well after moving on, as long as they are inside the window."
        ] },
      { h: "Don't leave money on the table", p: [
          "The deadline is the one part of a wage claim you cannot negotiate or fix after the fact. Once a week ages past the limit, it is gone for good, no matter how clear the violation.",
          "Calculate your full claim now with the [back-pay calculator](/calculators/back-pay-calculator), then decide your route. This is general information, not legal advice, but the safest move is always to find your number before another payday slips out of reach."
        ] }
    ]
  },
  {
    slug: "demand-letter-unpaid-wages",
    title: "How to Write a Demand Letter for Unpaid Wages (With Template)",
    description: "How to write a demand letter for unpaid wages, with a fill-in template and a worked calculation. What to include, how to send it, and what to do if your employer ignores it.",
    date: "2026-08-26", readMins: 6, keyword: "demand letter for unpaid wages", related: ["back-pay-calculator"],
    body: [
      { p: [
          "A demand letter for unpaid wages is a dated, written request that names the missing pay, shows how you calculated it, and asks the employer to fix it by a stated deadline. For a clear payroll error, it can be the quickest route, because it gives the employer a chance to correct the mistake before an agency or a lawyer is involved.",
          "A good letter is evidence, not a threat. The U.S. Department of Labor says a worker can contact the Wage and Hour Division about unpaid federal minimum wage or overtime and that complaints are confidential. A letter is optional, so do not let drafting one delay a time-sensitive claim. [See the DOL complaint process](https://www.dol.gov/agencies/whd/contact/complaints)."
        ] },
      { h: "When a letter makes sense", p: [
          "Send one when the claim is documented and calculable, the amount is modest next to the cost of a lawsuit, you are still employed and want to try an internal fix first, or you suspect an honest error. It also builds the record. The employer's reply, or silence, becomes part of the file in any later complaint. If you are not sure there is a violation, read [what is wage theft](/blog/what-is-wage-theft) first."
        ] },
      { h: "What goes in it", p: [
          "Your name, job title and dates of employment. The type of pay at issue (overtime, minimum wage, off-the-clock time). The pay periods covered. The calculation, line by line. A request for written payment by a specific date. If you cite a law, make sure it fits your facts and your state. When unsure, describe the pay problem and leave the legal conclusion out.",
          "Attach or keep the records behind the number: pay stubs, schedules, time records, messages about hours and your own log. The [back-pay calculator](/calculators/back-pay-calculator) produces a week-by-week starting calculation, which you should check against your records before you send it."
        ] },
      { h: "A template you can adapt", p: [
          "Date. To: [name], Payroll [or Owner], [company], [address]. Re: Request for payment of unpaid overtime, [your name], [job title].",
          "Dear [name]: I worked for [company] as a [job title] from [start date] to [present or end date]. For the 12 workweeks from March 3 through May 23, I worked an average of 47 hours a week and was paid for 40 at $20.00 an hour. The 7 hours a week over 40 should have been paid at my regular rate of $20.00 x 1.5 = $30.00. My calculation is 7 hours x $30.00 = $210.00 a week, x 12 weeks = $2,520.00. My pay stubs and a weekly breakdown are attached.",
          "I am asking that $2,520.00 be paid to me by [date, 14 days after the letter]. Please reply in writing if you believe any figure is wrong, and tell me which records you are relying on. If this is not resolved by that date, I will consider the options available to me, including a complaint to the Department of Labor and my state labor agency. Sincerely, [name, phone, email].",
          "Swap in your own weeks, hours and rate. If part of the work was off the clock and you do not know the exact hours, say that these are your best good-faith estimates and list how you reached them. The $29 Claim Kit produces this letter pre-filled from your back-pay figures if you would rather not draft it."
        ] },
      { h: "Tone", p: [
          "State facts. Do not accuse anyone of fraud or intent, and do not argue the law. You are documenting a debt and setting a deadline. Calm, specific and short works better than angry and long, because the numbers do the persuading."
        ] },
      { h: "How to send it", p: [
          "Use a method that leaves a record: a work email you can still access, a personal email copied to yourself, or tracked mail. Keep the exact version you sent and the delivery confirmation. Address it to whoever can fix payroll: payroll, HR or the owner. Do not sign a release or cash a payment marked as full settlement until you understand which claims it covers.",
          "Put the letter, delivery record and supporting documents in one folder. For each disputed pay period, note the date, hours worked, rate paid, rate you believe applies and the difference. Do not alter originals."
        ] },
      { h: "After you send it", p: [
          "If the employer pays or proposes an agreement, get the terms in writing and confirm which pay periods and claims it covers. If it denies or ignores the letter, keep the response with your records and move to an agency complaint, using [how to file a Department of Labor complaint](/blog/file-department-of-labor-complaint). A letter does not stop the limitations clock, so do not wait indefinitely.",
          "Workers are protected from retaliation for asserting wage-and-hour rights. If your hours, schedule or pay change after you raise the issue, write down what happened and when and [review the WHD retaliation guidance](https://www.dol.gov/agencies/whd/retaliation)."
        ] },
      { h: "Frequently asked questions", p: [
          "Do I need a lawyer to send a demand letter? No. A clear letter with a solid calculation is often enough. For a large claim, a letter on an attorney's letterhead carries more weight, but it is not required.",
          "Will sending one hurt my chances with the DOL? No. If the letter fails, a complaint is your next step and the letter shows the employer knew about the dispute.",
          "What if my numbers are wrong? Send your best good-faith calculation and say so. Employers often reply with their own records, which can sharpen the figure. Being precise and reasonable protects your credibility either way."
        ] },
      { h: "Get the calculation right first", p: [
          "The letter stands or falls on the number. Build a week-by-week breakdown with the [back-pay calculator](/calculators/back-pay-calculator), attach it, and send the letter by a trackable method. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "attorney-for-unpaid-wages",
    title: "Attorney for Unpaid Wages: Cost, Contingency Fees and When You Need One",
    description: "Do you need an attorney for unpaid wages? Wage lawyers usually work on contingency (typically 25% to 40%) and the FLSA can make the employer pay your fees. A labor board comparison and a worked example.",
    date: "2026-06-24", readMins: 6, keyword: "attorney for unpaid wages", related: ["back-pay-calculator"],
    body: [
      { p: [
          "An employment attorney who handles wage-and-hour cases can recover unpaid wages, overtime, liquidated damages and attorney fees from an employer. For a small, clear claim you may not need one. For a large claim, misclassification, retaliation, or a problem shared with coworkers, a lawyer often recovers considerably more, and usually costs nothing up front.",
          "Fear of legal bills keeps people from pursuing money they are owed. Because of how the FLSA is built, that fear is usually misplaced. WageCoach is not a law firm and does not refer or match you with attorneys. The tools here help you size the claim before you make that call."
        ] },
      { h: "When you can go it alone", p: [
          "If the claim is simple, say a few weeks of missed overtime with decent records, a free complaint to the [Wage and Hour Division](https://www.dol.gov/agencies/whd) takes about fifteen minutes online, and investigators know what to look for. The agency can order back pay without you appearing in court. See [how to file a wage claim](/blog/how-to-file-a-wage-claim). A written demand first, as described in the [demand letter guide](/blog/demand-letter-unpaid-wages), is often worth trying too."
        ] },
      { h: "Labor board or attorney: how they compare", p: [
          "Cost. An agency complaint is free. An attorney typically takes 25% to 40% of what is recovered and charges nothing up front. Because the FLSA and many state laws shift fees to a losing employer, contingency works even for moderate claims.",
          "Speed. A clean WHD case can resolve in a few months, and contested ones take a year or more. A demand letter from an attorney with a clear damages calculation sometimes gets a quicker reply than waiting in an agency queue, but a case that goes to litigation can take longer than an agency complaint. Neither is reliably faster.",
          "Scope. An agency can recover back wages and, under the FLSA, an equal amount in liquidated damages. It cannot handle a related wrongful-termination or discrimination claim. An attorney can pursue all of it in one case.",
          "Group claims. If coworkers were affected by the same pay practice, an attorney can bring a collective or class action, which creates settlement leverage a single complaint does not. A WHD investigation can also cover everyone affected, but it does not create the same coordinated claim."
        ] },
      { h: "When a lawyer is worth it", p: [
          "Hire one when the amount is large, when the employer denies the violation or disputes your classification, when you were fired or retaliated against, when you believe many workers were hit by the same policy, or when you were treated as an independent contractor and are owed years of overtime. See [independent contractor vs employee](/blog/independent-contractor-vs-employee). Retaliation cases in particular benefit from counsel, because proving the link between a complaint and an adverse action takes experience and legal pressure."
        ] },
      { h: "How contingency fees work", p: [
          "Most wage attorneys take 25% to 40% of the recovery, paid only if you recover. The FLSA also lets a winning worker recover attorney fees from the employer under 29 U.S.C. 216(b), as a separate award on top of back wages. How that award is handled depends on your retainer agreement, so read that clause before you sign."
        ] },
      { h: "A worked example", p: [
          "A worker is underpaid $6,000 in overtime inside the two-year window. If the violation is willful, the lookback can reach three years, and liquidated damages can add an equal $6,000, so the claim is $12,000 before fees. That is a ceiling, not a prediction, since courts can reduce liquidated damages where the employer acted in good faith.",
          "Compare routes. A WHD complaint costs nothing, but you give up control of timing and the investigator may settle for back wages alone. A private attorney at a 33% contingency would take about $3,960 of $12,000 if the fee came out of the recovery. Court-awarded fees are often paid on top, but the retainer decides how."
        ] },
      { h: "What an attorney catches that you might not", p: [
          "A wage lawyer will rebuild the regular rate including bonuses and shift differentials, find every violation in the payroll file, choose the longest defensible lookback, press for liquidated damages in full, and in a collective action notify coworkers who may be owed too. Class recoveries can reach six or seven figures even when each person's claim is small. Having your own estimate from the [back-pay calculator](/calculators/back-pay-calculator) before the call lets the lawyer evaluate the case in minutes."
        ] },
      { h: "Finding the right one", p: [
          "Look for attorneys who list employment or wage-and-hour litigation as their practice, not general practitioners. Your state bar's referral service and the National Employment Lawyers Association are good starting points, and many attorneys offer a free initial consultation. Bring your pay stubs, schedules, time-clock exports, texts about hours, your offer letter and your own calculation."
        ] },
      { h: "Questions to ask before you sign", p: [
          "Is the fee a percentage of the recovery? Are court-awarded fees added on top? Who pays costs if you lose? Do they handle collective actions if coworkers are affected? Check any arbitration agreement or release you signed, keep copies of everything, and do not accept a settlement before the lawyer has reviewed it."
        ] },
      { h: "Frequently asked questions", p: [
          "What does it cost to talk to a wage attorney? Usually nothing. Initial consultations are typically free and the work is on contingency.",
          "Can I switch from a DOL complaint to a lawsuit later? Often yes, as long as you are within the limitations period and have not signed a settlement or release. Ask about timing before any deadline passes. See [the statute of limitations on unpaid wages](/blog/statute-of-limitations-unpaid-wages).",
          "What if I signed an arbitration agreement? You may still have a claim, but it could go to arbitration instead of court. An attorney can review the agreement and any class-action waiver.",
          "Does a WHD complaint first hurt my chances with a lawyer later? Generally no. A completed investigation can supply an independent factual record."
        ] },
      { h: "Get your number before you call", p: [
          "Run your hours and rate through the [back-pay calculator](/calculators/back-pay-calculator) and bring the breakdown. If the total is modest and your records are clean, the $29 Claim Kit's demand letter and state filing guide may be all you need, with a lawyer held in reserve. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "overtime-rules-by-state",
    title: "Overtime Rules by State: 2026 Reference Guide",
    description: "Most states follow the federal 40-hour rule, but California, Alaska, Nevada, and Colorado add daily overtime, and several states set much higher exempt salary thresholds. Know your state, or you undercount your pay.",
    date: "2026-06-26", readMins: 10, keyword: "overtime rules by state", related: ["overtime-calculator","double-time-calculator"],
    body: [
      { p: [
          "Federal law sets the baseline for overtime: 1.5x pay for hours over 40 in a workweek. But states can and do go further. Four states require overtime based on daily hours, not just weekly hours, and several have set higher salary thresholds for exempt employees.",
          "Knowing your state's rules is not a technicality. It can be the difference between a small claim and a large one, because applying only the federal rule in a daily-overtime state quietly erases hours you are legally owed."
        ] },
      { h: "States with daily overtime", p: [
          "California is the strictest: 1.5x for hours over 8 in a workday, 2x (double time) for hours over 12 in a day, 1.5x for the first 8 hours on the 7th consecutive workday, and 2x beyond that. It is the only state requiring double time. Alaska requires 1.5x for hours over 8 in a day or over 40 in a week, whichever pays more.",
          "Nevada requires 1.5x for hours over 8 in a day for employees earning less than 1.5x the state minimum wage. Colorado requires 1.5x for hours over 12 in a day, on top of the weekly 40-hour rule. If you work in any of these, switch your state in the [overtime calculator](/calculators/overtime-calculator) so the daily rule applies."
        ] },
      { h: "Why daily overtime matters so much", p: [
          "In a daily-overtime state, you can earn overtime in a week under 40 hours. An employee who works four 10-hour days, just 40 hours total, earns 8 hours of daily overtime in California because each day crossed the 8-hour line, even though the weekly total never did.",
          "That is income most workers and even many payroll departments miss. If you regularly work long days, the [double time calculator](/calculators/double-time-calculator) is worth running to capture the hours over 12 that California pays at 2x."
        ] },
      { h: "States with higher exempt salary thresholds", p: [
          "Several states require a higher salary than the federal $684 a week before an employee can be treated as exempt. California sets it at roughly $1,378 a week in 2026, tied to twice the state minimum wage. New York runs about $1,237.50 a week in New York City, Long Island, and Westchester, and somewhat less upstate.",
          "Washington is near $1,500 a week, and Colorado around $1,128 a week. The practical effect: a worker earning $55,000 in California is non-exempt and owed overtime regardless of job title, because the salary falls below the state floor. The [exempt salary calculator](/calculators/exempt-salary-calculator) checks where you land."
        ] },
      { h: "States without their own overtime law", p: [
          "Some states rely entirely on the FLSA and have no separate state overtime statute, including Alabama, [Florida](/states/florida#wage-claim), Georgia, Louisiana, Mississippi, and South Carolina. Workers there are still fully protected by the federal 40-hour rule.",
          "They simply have no extra state layer if the federal rule is satisfied. That makes the federal regular-rate and off-the-clock rules especially important in those states, since they are the whole of your protection."
        ] },
      { h: "Public-sector workers: comp time instead of cash", p: [
          "State and local government employers play by different rules. The FLSA lets public agencies offer compensatory time off at 1.5 hours per overtime hour, up to 240 accrued hours, or 480 for public-safety, emergency, and seasonal workers.",
          "Private employers have no equivalent right; they must pay overtime in cash. If a private employer offers you time off in lieu of overtime, that is a violation, explained in [comp time vs overtime](/blog/comp-time-vs-overtime)."
        ] },
      { h: "How to check your state", p: [
          "For the exact daily rules, salary thresholds, and sector-specific exceptions, use the wage-claim pages for [California](/states/california#wage-claim), [New York](/states/new-york#wage-claim), [Washington](/states/washington#wage-claim), and [Colorado](/states/colorado#wage-claim). Each lists the current minimum wage, overtime rule, and exempt threshold in one place.",
          "If you split time across state lines, your overtime is generally governed by where the work is performed, which can mean different rules for different weeks. When in doubt, apply the rule of the state where you physically worked the hours."
        ] },
      { h: "Frequently asked questions", p: [
          "Which state pays the most overtime protection? California, by a wide margin. Daily overtime after 8 hours, double time after 12, seventh-day rules, and a high exempt threshold combine to make it the strongest in the country.",
          "If my state has no overtime law, am I unprotected? No. The FLSA still covers you fully. You just do not get an extra state layer on top of the federal 40-hour rule.",
          "Which state's rules apply if I work remotely across state lines? Generally the rules of the state where you physically perform the work, not where the company is headquartered. If you regularly work in more than one state, each state's law may apply to the hours worked there."
        ] },
      { h: "Apply your state's rule to your hours", p: [
          "The federal rule is the floor, and in a daily-overtime state, treating it as the ceiling can cost you real money every single week. The only way to know is to run your actual schedule through the correct state setting.",
          "Select your state in the [overtime calculator](/calculators/overtime-calculator), and if you log long days, check the over-12 hours with the [double time calculator](/calculators/double-time-calculator). This is general information, not legal advice, but it is how you make sure no state-law hours go uncounted."
        ] }
    ]
  },
  {
    slug: "comp-time-vs-overtime",
    title: "Comp Time vs Overtime Pay: What Federal Law Actually Allows",
    description: "Private-sector employers cannot legally swap comp time for cash overtime, even if you agree to it. Only public-sector employers can, under strict FLSA limits. Here is how to tell the difference.",
    date: "2026-06-27", readMins: 9, keyword: "comp time", related: ["overtime-calculator"],
    body: [
      { p: [
          "Compensatory time off, or comp time, is time off granted in exchange for overtime hours worked. Under federal law, private-sector employers cannot offer comp time instead of cash overtime pay, even if the employee agrees to it.",
          "Only state and local government employers can substitute comp time for cash overtime, and only under specific FLSA conditions. If you work for a private company and your boss has been banking your overtime as future time off, there is a good chance you are owed money."
        ] },
      { h: "The private-sector rule: cash only", p: [
          "The FLSA requires that non-exempt private-sector employees be paid 1.5x their regular rate in cash for every overtime hour. An employee cannot waive this right, and an employer cannot ask them to.",
          "A signed agreement accepting comp time in lieu of cash overtime in the private sector is void. The employee is still owed the overtime wages, and the waiver is unenforceable. If you are a private-sector hourly or non-exempt salaried worker and your employer offers comp time instead of overtime pay, that is a wage violation, full stop."
        ] },
      { h: "The public-sector exception", p: [
          "State and local government employers may offer comp time at a rate of 1.5 hours of time off for every overtime hour worked, under FLSA Section 207(o). A public-works employee who works 44 hours in a week earns 6 hours of comp time, that is 4 overtime hours times 1.5.",
          "Conditions apply: the arrangement must be set up by agreement before the work is performed, comp time must accrue at the correct 1.5x rate, employees must be allowed to use accrued time within a reasonable period, and once an employee hits the cap, the employer must pay cash for further overtime."
        ] },
      { h: "The public-sector caps", p: [
          "The accrual caps are 240 hours of comp time for most public employees and 480 hours for public-safety officers, emergency responders, and seasonal workers. Once an employee exceeds the cap, any further overtime must be paid in cash.",
          "Public employers also cannot unreasonably deny a request to use accrued comp time. If you are a government worker sitting on a large balance you can never seem to use, that may itself be a problem worth raising."
        ] },
      { h: "Flex time is not the same as comp time", p: [
          "Flex time, meaning adjusting hours within the same workweek, is legal for private employers. If you work 10 hours Monday but leave 2 hours early Friday, the workweek total stays at 40 and no overtime is owed.",
          "The catch is that flex time only works inside the same seven-day workweek. An employer cannot ask you to work off last week's overtime by working fewer hours this week, because each workweek stands completely alone for FLSA overtime purposes. Confirm any borderline week in the [overtime calculator](/calculators/overtime-calculator)."
        ] },
      { h: "Informal comp-time arrangements are still illegal", p: [
          "The most common form of illegal comp time is informal: a manager tells an hourly employee to take it easy next week because of the overtime they put in this week. Even with no formal policy, this violates the FLSA.",
          "If the worker is ever audited or files a complaint, the employer faces back-wage liability for every underpaid week, plus liquidated damages equal to the unpaid overtime. Document any such arrangement, including who proposed it and when, because that record becomes evidence later."
        ] },
      { h: "What to do if you're offered comp time", p: [
          "If you are a private-sector non-exempt employee and your employer offers comp time instead of overtime, first calculate the cash you are owed with the [overtime calculator](/calculators/overtime-calculator). Then you have options: raise it with HR, send a [demand letter](/blog/demand-letter-unpaid-wages), file a WHD complaint at [dol.gov](https://www.dol.gov/agencies/whd), or consult an attorney.",
          "The violation accrues with each underpaid pay period, so the longer it continues, the larger the back-pay claim grows. There is no benefit to waiting, and the statute of limitations is steadily working against you."
        ] },
      { h: "Worked example: what banked comp time is worth in cash", p: [
          "Suppose a private-sector hourly worker earning $20 an hour works 44 hours in a week and is told the extra 4 hours will be \"banked\" as time off. The law requires 1.5x the regular rate in cash for those hours: 4 hours times $30 is $120 of overtime pay that should have been on that paycheck. Banking the hours instead means that $120 is unpaid.",
          "Repeat that across a year of similar weeks and the unpaid amount grows week by week, and liquidated damages can double it. A public-sector worker in the same position would instead accrue 6 hours of comp time (4 hours times 1.5), which is lawful only if the conditions above are met."
        ] },
      { h: "Is your comp-time arrangement legal? A checklist", p: [
          "1. Who is your employer: a private company, or a state or local government? If private, cash overtime is required. 2. Are you non-exempt? Exempt employees are not owed overtime in the first place, but check that the exemption genuinely applies. 3. If public sector, was the comp-time agreement made before the work was done? 4. Is comp time accruing at 1.5 hours per overtime hour? 5. Are you under the 240-hour cap (480 for public safety, emergency response, and seasonal work)? 6. Can you actually use your banked time within a reasonable period? A no to any of the public-sector questions, or any comp time at all in a private job, is worth documenting and pricing out."
        ] },
      { h: "Frequently asked questions", p: [
          "Can I agree to comp time if I prefer time off? In the private sector, no. Your agreement does not make it legal, and you remain owed the cash overtime. In the public sector, a proper agreement made before the work can allow comp time.",
          "What if my private employer has done this for years? Each underpaid week is its own violation. You can generally reach back two years, three if willful, plus liquidated damages. See [the statute of limitations on unpaid wages](/blog/statute-of-limitations-unpaid-wages).",
          "Is a four-day, 40-hour week with a long day overtime? Not under federal law if total worked hours stay at or under 40 in the week. But in daily-overtime states like California, hours over 8 in a day can trigger overtime regardless of the weekly total."
        ] },
      { h: "Convert your comp time to a number", p: [
          "If your overtime has been disappearing into a comp-time bank, the first step is to translate those banked hours into the cash the law actually requires. That number is usually larger than the time-off you were offered.",
          "Run your overtime hours through the [overtime calculator](/calculators/overtime-calculator) to see the cash value, then decide how to pursue it. This is general information, not legal advice, but for private-sector workers, comp time in place of overtime is one of the clearer violations to act on."
        ] }
    ]
  },
  {
    slug: "unpaid-overtime-recovery",
    title: "Unpaid Overtime: How to Spot It and Recover What You're Owed",
    description: "How unpaid overtime hides on a pay stub, a worked back-pay example with real numbers, and the realistic routes for recovering up to three years of wages plus liquidated damages.",
    date: "2026-06-28", readMins: 6, keyword: "unpaid overtime", related: ["back-pay-calculator","overtime-calculator"],
    body: [
      { p: [
          "Unpaid overtime is the violation the Wage and Hour Division sees most. If you worked more than 40 hours in a week and were not paid 1.5 times your regular rate for the extra hours, you are probably owed back pay. Under the FLSA you can go back two years, or three if the violation was willful, and an equal amount in liquidated damages is the default unless the employer proves it acted in good faith.",
          "The law is rarely the hard part. The hard part is noticing, because the shortfall is usually a few dollars a week hidden in a line on the stub."
        ] },
      { h: "Where the money goes missing", p: [
          "Straight time for overtime hours. The employer pays the base rate for everything, so the missing amount is the extra half on each hour over 40.",
          "Off-the-clock work. Pre-shift huddles, waiting for a terminal to boot, putting on required gear, finishing the closing checklist after punching out, answering texts at night. If the employer required it or knew about it, the time is owed.",
          "Auto-deducted lunches that you worked through, and rounding that always lands in the employer's favor.",
          "A regular rate that leaves out a bonus or shift differential. The mechanics are in [regular rate of pay](/blog/regular-rate-of-pay).",
          "Misclassification. A modest salary and a manager title do not make you exempt. If the duties do not meet the test, you are non-exempt and the unpaid overtime is recoverable. See [exempt vs non-exempt employees](/blog/exempt-vs-non-exempt-employees) and [independent contractor vs employee](/blog/independent-contractor-vs-employee)."
        ] },
      { h: "A worked example", p: [
          "Take a warehouse worker paid $18 an hour who works 48 hours a week and is paid straight time for all of them. The check is 48 x $18 = $864. It should be 40 x $18 + 8 x $27 = $936. The missing amount is the half-time premium: 8 hours x $9 = $72 a week.",
          "Over 52 weeks that is $3,744 a year. Two years back is $7,488, and with equal liquidated damages the claim is $14,976. If the violation is found willful and the lookback is three years, the wages are $11,232 and the claim doubles to $22,464. Courts can reduce liquidated damages when the employer shows good faith, so treat the doubled figure as the ceiling you plan around, not a promise.",
          "If the employer paid nothing for the overtime hours at all, the shortfall is the full 1.5x, which is $27 an hour in this example instead of $9."
        ] },
      { h: "The regular-rate version", p: [
          "Now suppose the same worker earns $20 an hour plus a $200 weekly attendance bonus and works 50 hours. Total straight-time pay is 50 x $20 + $200 = $1,200, so the regular rate is $24. The half-time premium owed on the 10 overtime hours is 10 x $12 = $120, making the correct week $1,320. If the employer calculated overtime on the $20 base, it paid 40 x $20 + 10 x $30 + $200 = $1,300 and shorted the worker $20. That is $1,040 a year, which nobody notices on a single stub."
        ] },
      { h: "Build your own number", p: [
          "For each week, write down the hours you worked, the rate on your stub, and what you were paid. Work out what the check should have been, then subtract. Do this for a handful of typical weeks to find the pattern before you try to reconstruct two years.",
          "The [back-pay calculator](/calculators/back-pay-calculator) does it week by week and applies the lookback window and liquidated damages. Keep a note of how you counted the hours. A contemporaneous log, even in a phone, carries real weight if the employer's records are thin."
        ] },
      { h: "Four routes to recovery", p: [
          "Start with a written request when the relationship is intact and the amount is modest. A short letter with the calculation attached fixes many genuine payroll errors, and the [demand letter guide](/blog/demand-letter-unpaid-wages) shows what to put in it. The $29 Claim Kit generates that letter pre-filled with your back-pay figures if you would rather not draft it.",
          "If that fails, a free complaint with the Wage and Hour Division puts an investigator on it. Details are in [how to file a Department of Labor complaint](/blog/file-department-of-labor-complaint). Your state agency may reach further back, and filing with both is allowed.",
          "For large claims, retaliation, or a problem shared with coworkers, an [attorney for unpaid wages](/blog/attorney-for-unpaid-wages) is usually worth a consultation, because fee shifting means the employer can be made to cover your legal fees."
        ] },
      { h: "What makes a violation willful", p: [
          "A violation is willful if the employer knew or showed reckless disregard for whether its pay practice was lawful. Ignoring a prior WHD finding, getting written warning of a classification problem and doing nothing, or keeping two sets of time records are the usual evidence. Willfulness moves the lookback from two years to three, which on a steady violation adds about half again to the wages. See [the statute of limitations on unpaid wages](/blog/statute-of-limitations-unpaid-wages) for how each payday's clock works."
        ] },
      { h: "Frequently asked questions", p: [
          "Can I recover overtime if I am paid a salary? Often, yes. A salary does not make you exempt unless you also clear the salary threshold and a duties test. Many salaried workers are non-exempt.",
          "What if my employer says working off the clock was against policy? A rule against unrecorded work does not erase the wages if the employer knew or should have known the work was happening.",
          "I already quit. Can I still claim? Yes. The clock runs from each underpaid payday, not from your last day."
        ] },
      { h: "Put a number on it first", p: [
          "Check one week in the [overtime calculator](/calculators/overtime-calculator), then run the full period through the [back-pay calculator](/calculators/back-pay-calculator). A figure you can defend is the starting point for every route above. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "late-or-bounced-paycheck",
    title: "My Paycheck Was Late or Bounced. What Are My Rights?",
    description: "A late or bounced paycheck is a wage violation in most states, often with penalties on top of the wages owed. Here's what to do in the first 24 hours, and how the penalties work.",
    date: "2026-07-17", readMins: 9, keyword: "late paycheck", related: ["final-paycheck-calculator","back-pay-calculator"],
    body: [
      { p: [
          "A late paycheck that doesn't show up on payday, or shows up and then bounces, isn't just an inconvenience while rent is due. In most states it's a specific wage violation with its own penalties, separate from the wages themselves. Employers sometimes treat a late payroll run as a minor administrative slip; the law in most states treats it as a real breach with real consequences.",
          "If this has happened to you, the timeline of what you do in the first day or two matters, both for getting paid faster and for preserving your right to any penalty the law provides."
        ] },
      { h: "What counts as \"late\"", p: [
          "Most states set a specific pay frequency requirement, weekly, biweekly, semimonthly, or monthly depending on the industry and state, and require wages to be paid by a defined number of days after the pay period ends. If your employer's stated payday passes with no payment, that's a violation of the payment-timing rule the moment it happens, regardless of the reason.",
          "A bounced paycheck is treated the same way: the check being physically issued doesn't satisfy the obligation if it isn't honored by the bank. From the law's perspective, an uncashable check is the same as no payment at all."
        ] },
      { h: "Why this happens", p: [
          "Payroll processing errors, a bank account running short, a change in payroll provider, or a company in genuine financial distress are the most common causes. None of these excuse the violation legally, though a good-faith processing error that gets corrected within a day or two is treated very differently in practice than a pattern of missed payroll."
        ] },
      { h: "What to do in the first 24 hours", p: [
          "Contact payroll or HR in writing (email, not just a hallway conversation) the day the payment was due, stating clearly that wages were not received and asking for the date they'll be paid. This creates a timestamped record that matters if the issue escalates.",
          "If a paper check bounced, get the bank's official notice of non-payment; that document is strong evidence for any later complaint. Keep your pay stubs and time records for the relevant period so the exact amount owed isn't in dispute.",
          "If the employer doesn't resolve it within a few days, or gives no clear answer, that's the point to escalate to your state labor agency rather than continuing to wait informally."
        ] },
      { h: "The penalties: often bigger than people expect", p: [
          "Many states impose a waiting-time or late-payment penalty on top of the wages owed. California, for example, can require an employer to pay a full day's wages for each day payment is late, up to 30 days, on top of the unpaid wages themselves, when the violation is willful. Other states use a percentage penalty or a flat statutory fee per late payment.",
          "This penalty structure exists specifically because wages are treated differently from ordinary debts. Being a week late on a vendor invoice is a business problem; being a week late on payroll is a legal violation with its own built-in cost to the employer, precisely to discourage companies from treating employee pay as a flexible line item."
        ] },
      { h: "If it happens repeatedly, it's a bigger red flag", p: [
          "A single late paycheck, corrected quickly with an apology and a clear explanation, is usually a processing hiccup. A pattern, two, three, four missed or late paydays over a few months, is a different signal entirely, often pointing to real financial trouble at the company. If that's the case, document everything and treat your own pay as the priority; don't extend informal patience past the point where you'd lose real money if the company stops operating altogether."
        ] },
      { h: "How states actually enforce the timing rule", p: [
          "Enforcement mechanics differ, but most states route a late-paycheck complaint through the same labor commissioner's office that handles other wage claims, and many let you file online with copies of pay stubs and any written correspondence attached. A few states, Texas and California among them, publish a specific pay-frequency statute you can cite by name in a complaint, which tends to speed up processing because the violation is unambiguous on its face. If your state doesn't spell out a fixed number of days, the general standard is still \"promptly,\" and a labor agency investigator will weigh how long the delay ran and whether it looks like a pattern."
        ] },
      { h: "Frequently asked questions", p: [
          "Can I refuse to keep working if I haven't been paid? This is legally complicated and state-specific; in most cases you're still expected to perform scheduled work while pursuing the wage claim through official channels, rather than unilaterally stopping. Speak with your state labor agency about your specific situation before making that call.",
          "What if my employer says they'll \"catch me up\" next payday? Get that commitment in writing with a specific date. If the promised date also passes without payment, that's a stronger pattern for a formal complaint.",
          "Does this affect my final paycheck if I quit over it? It can strengthen a claim under [final paycheck laws by state](/blog/final-paycheck-laws-by-state), since a documented pattern of late pay is relevant context if your final wages are also delayed."
        ] },
      { h: "Get the wages, then check for a penalty", p: [
          "Start with the direct, in-writing request for the missing wages, since most late-paycheck situations resolve at that stage. If they don't, your state labor agency (often the same office that handles [wage claims](/blog/how-to-file-a-wage-claim)) can process both the unpaid wages and any statutory penalty in one complaint.",
          "This is general information, not legal advice. If a bounced or missing paycheck has become a pattern rather than a one-off, it's worth calculating the total shortfall with the [back-pay calculator](/calculators/back-pay-calculator) before you file."
        ] }
    ]
  },
  {
    slug: "overtime-for-remote-hybrid-workers",
    title: "Overtime for Remote and Hybrid Workers: What Changes at Home",
    description: "Working from home doesn't change your overtime rights, but it does change how hours get tracked and missed. Here's what remote and hybrid non-exempt workers need to watch for.",
    date: "2026-07-14", readMins: 8, keyword: "overtime for remote employees", related: ["overtime-calculator"],
    body: [
      { p: [
          "Nothing about the Fair Labor Standards Act changes because you're logging in from a kitchen table instead of an office. Overtime for remote employees works exactly the same as overtime for anyone else: 1.5x your regular rate for every hour over 40 in a week, whether you worked those hours in a cubicle or on your sofa. What does change, and change a lot, is how those hours get recorded, and how easily extra time slips through unpaid when there's no manager physically watching the clock.",
          "Remote and hybrid work has quietly become one of the most common sources of unrecorded overtime, not because the law is unclear, but because the systems most companies use to track hours were built for an office, and nobody updated them for a kitchen table."
        ] },
      { h: "The rule hasn't moved; the tracking has", p: [
          "Your employer is still legally required to keep accurate records of hours worked, wherever that work happens. In practice, remote setups often rely on self-reported timesheets, laptop login data, or nothing more formal than \"trust,\" and all three are easy to undercount without anyone intending to shortchange anyone.",
          "The core legal test is unchanged: if the employer knew or should have known the work happened, the time is owed. A manager who sees Slack messages sent at 9 p.m. and says nothing, but never pays for that time, is still on the hook for it."
        ] },
      { h: "Where remote hours quietly go unpaid", p: [
          "Logging back in after hours to finish a task, answer one more email, or fix something that broke, is classic off-the-clock work if it isn't recorded. It doesn't matter that it took \"only 20 minutes\"; 20 minutes a night, five nights a week, is over eight hours a month.",
          "Blurred start and end times are another common pattern. Without a physical commute or office door to mark the boundary, the workday for many remote employees has no clear edge, and non-exempt workers can end up putting in more actual hours than a rigid 9-to-5 timesheet reflects.",
          "Mandatory software startup time matters too. If your job requires VPN connection, security software boot-up, or a specific login sequence before you can \"officially\" clock in, that setup time is generally compensable, the same principle that applies to donning required gear in a warehouse."
        ] },
      { h: "Hybrid schedules add their own wrinkle", p: [
          "Workers splitting time between home and an office sometimes end up working a full day at home and then also logging hours preparing for an in-office day, or vice versa, without either half being tracked as carefully as a single, consistent location would be. If your hybrid schedule means your actual weekly hours are harder to total than a fixed schedule would be, that's exactly the kind of situation where a personal log is worth keeping."
        ] },
      { h: "What employers get wrong about overtime for remote employees", p: [
          "The most common mistake isn't malicious; it's a policy written for an office that never got updated. A handbook that says \"no unapproved overtime\" made sense when a manager could physically see who stayed late. Applied to a remote team, the same policy often gets read as \"unapproved hours don't count,\" which isn't correct. If the work happened and the employer had reason to know, the approval process is a separate HR issue from the pay obligation, and the two shouldn't be conflated."
        ] },
      { h: "What a defensible personal log looks like", p: [
          "A simple daily note, start time, end time, and any after-hours work with a rough duration, is often the single most useful thing a remote non-exempt worker can do. It doesn't need to be elaborate; a running note in your phone is enough. If your recorded hours and your employer's timesheet ever diverge, your own contemporaneous log is strong evidence in a wage claim.",
          "Cross-check any week that looks heavy using the [overtime calculator](/calculators/overtime-calculator), since a handful of unrecorded after-hours sessions can be enough to push a week over the 40-hour line without it being obvious from the official timesheet alone."
        ] },
      { h: "Exempt status doesn't change either, and that cuts both ways", p: [
          "Working remotely doesn't make a non-exempt employee exempt, and it doesn't strip exempt status from someone who genuinely meets the duties test either. What sometimes happens is that a remote role's actual duties drift, more execution, less independent judgment, over time without a title change catching up. If your day-to-day work looks less \"managerial\" than it did when you were classified exempt, it's worth revisiting against [exempt vs non-exempt employees](/blog/exempt-vs-non-exempt-employees)."
        ] },
      { h: "Which state's law applies to you", p: [
          "Wage rights generally follow where you physically work, not where your employer is headquartered. A Washington remote worker for a New York company gets Washington's minimum wage, overtime and break rules. Someone in Colorado working for a Texas company is covered by Colorado law. A company cannot base itself in a federal-minimum state and pay remote workers in a $17 state the lower rate. The [minimum wage calculator](/calculators/minimum-wage-calculator) shows the rate for your location.",
          "If you work in more than one state, each state's rules generally apply to the hours worked there. A few long days in California can trigger California daily overtime even if your weekly total elsewhere is modest, and the more protective rule is the safe one to apply to those hours. Four states count hours per day: California, Alaska, Nevada and Colorado, covered in [overtime rules by state](/blog/overtime-rules-by-state). On the way out, the final-pay deadline usually follows the state where you did the work, as explained in [final paycheck laws by state](/blog/final-paycheck-laws-by-state)."
        ] },
      { h: "Frequently asked questions", p: [
          "Does my employer have to pay for the time I spend commuting between rooms on a hybrid day? No, moving around your own home isn't compensable travel time in the way a required trip between two employer worksites can be; see [travel time pay rules](/blog/travel-time-pay-rules) for the distinction.",
          "Can my employer require me to be \"available\" outside scheduled hours without paying for it? Not if that availability is restrictive enough to functionally prevent you from using the time for yourself. Loosely being reachable is different from being required to respond within minutes; the more restrictive the expectation, the stronger the case that it's compensable on-call time.",
          "What if my company doesn't have a formal remote time-tracking system at all? That absence doesn't remove your right to be paid accurately; it just means your own records become more important as evidence if a dispute arises.",
          "My employer is in a $7.25 state but I work from home in California. What is my minimum wage? California's, which is $16.90 statewide and higher in many cities. Your work location controls, not the employer's headquarters.",
          "I traveled to California for a few long days. Do California overtime rules apply? Generally yes, to the hours worked there. California's daily overtime can apply to those days even if the rest of your week would not reach 40 hours."
        ] },
      { h: "Keep your own record, just in case", p: [
          "Remote and hybrid work hasn't changed what you're owed, only how easily it can slip through the cracks unrecorded. A simple personal log, checked periodically against the [overtime calculator](/calculators/overtime-calculator), is the cheapest insurance against months of quietly unpaid time.",
          "If you suspect it's already happened, [unpaid overtime: how to spot it and recover what you're owed](/blog/unpaid-overtime-recovery) walks through the recovery process in full. This is general information, not legal advice."
        ] }
    ]
  },
  {
    slug: "is-overtime-mandatory",
    title: "Is Overtime Mandatory? What Your Employer Can (and Can't) Force You to Work",
    description: "Yes, in most jobs employers can require overtime and fire you for refusing. See the real exceptions, then check your pay with our free calculator.",
    date: "2026-09-10", readMins: 10, keyword: "is overtime mandatory", related: ["overtime-calculator"],
    body: [
      { p: [
          "Short answer: yes, in most jobs, your employer can legally require you to work overtime, and can fire you for refusing, as long as they pay you correctly for the extra hours. The Fair Labor Standards Act (FLSA) sets no cap on how many hours an adult can be scheduled in a week. A handful of carve-outs exist, union contracts, disability accommodations, certain family emergencies, and state-level shift-length caps for nurses, but they're narrower than most workers assume."
        ] },
      { h: "\"Mandatory overtime\" isn't a special legal category", p: [
          "It helps to drop the idea that mandatory overtime is its own defined thing with its own rulebook. Legally, there's just \"overtime\" (hours worked past 40 in a workweek, or past a state's daily threshold) and \"your schedule\" (whatever hours your employer assigns you). Nothing in federal law separates voluntary hours from assigned ones.",
          "So when a manager posts a schedule that includes a mandatory Saturday shift pushing you to 46 hours for the week, that's not a special \"forced overtime\" violation sitting apart from ordinary wage law. It's simply your scheduled hours, and the only legal question that matters is whether you're paid 1.5 times your regular rate for the six hours over 40. Get that math wrong and you have an unpaid-overtime problem worth checking with the [overtime calculator](/calculators/overtime-calculator); get it right and the schedule itself, however unwelcome, is lawful."
        ] },
      { h: "Can your employer actually force you to stay?", p: [
          "For the large majority of hourly, non-exempt workers 16 and older, yes. The U.S. Department of Labor's [Wage and Hour Division](https://www.dol.gov/agencies/whd/state/overtime) is explicit that the FLSA \"does not limit the number of hours in a day or days in a week an employer may require an employee to work,\" for any employee 16 years or older, provided the correct overtime premium is paid once hours exceed 40 in a workweek.",
          "That single sentence surprises a lot of people, because it means there's no federal \"maximum shift length,\" no mandatory rest period between shifts, and no cap on consecutive days worked, outside a few regulated industries like trucking and aviation. Your employer sets the schedule; your only guaranteed protection is the pay rate on the extra hours, not the right to skip them."
        ] },
      { h: "What happens if you say no", p: [
          "Refuse a mandatory shift in most states and, legally, your employer can discipline or fire you for it. Almost every US state (Montana is the lone exception after a probationary period) follows at-will employment, meaning either side can end the job for almost any reason, or no reason, and \"you didn't show up for the extra shift I scheduled\" clears that low bar easily.",
          "As employment attorney Eric B. Kingsley told [Super Lawyers](https://www.superlawyers.com/resources/wage-and-hour-laws/can-you-be-forced-to-work-overtime-is-it-legal/) when discussing scheduling disputes, \"one can understand the employer's perspective that you have to get the work done, but you also have to be sensitive to employees' work schedules.\" That tension is real, but sympathy for the employee's side doesn't change the legal baseline: outside the exceptions below, refusing a lawfully assigned shift is not, by itself, a protected act."
        ] },
      { h: "The real exceptions where you can push back", p: [
          "A short list of situations does give you solid legal footing to decline, and they're worth knowing precisely rather than relying on rumor.",
          "Family and Medical Leave Act (FMLA): if you or an immediate family member has a serious health condition and you qualify for FMLA leave, your employer can't force you into overtime that conflicts with that protected leave.",
          "Disability accommodation (ADA): if a reduced or capped schedule is a reasonable accommodation for a disability, mandatory overtime that violates it can be unlawful.",
          "Religious observance (Title VII): forcing a shift that conflicts with a sincerely held religious practice, when a reasonable accommodation exists, can trigger discrimination protections.",
          "A union contract or individual employment agreement: many collective bargaining agreements cap forced overtime, require advance notice, or make it voluntary past a threshold, check your contract before assuming federal law is the only rule that applies.",
          "State-specific shift caps for healthcare workers: this is the biggest and most concrete exception, and it deserves its own section."
        ] },
      { h: "Nurses and healthcare workers: the exception that actually has teeth", p: [
          "Hospital short-staffing pushed a wave of state legislatures to act specifically on nurse scheduling, and the result is a real, enforceable patchwork rather than a federal rule. At least 18 states now restrict mandatory overtime for nurses in some form: Alaska, California, Connecticut, Illinois, Maine, Maryland, Massachusetts, Minnesota, Missouri, New Hampshire, New Jersey, New York, Oregon, Pennsylvania, Rhode Island, Texas, Washington, and West Virginia.",
          "The details vary a lot by state, so the table below is a starting point, not a substitute for checking your own state's current statute."
        ], table: {"headers":["State","Core restriction","Typical emergency exception"],"rows":[["Alaska","No shift may exceed 14 consecutive hours; no forced overtime beyond the scheduled shift","None specified"],["California","Cannot require more than 12 hours in a 24-hour period","Declared disaster or unforeseeable emergency"],["Connecticut","Guaranteed predetermined schedule; can't be forced past it","Ongoing procedure or genuine emergency"],["Illinois","Overtime only for unforeseen emergencies; capped at 4 hours past the scheduled shift","Unforeseen emergency only"],["New York","Labor Law §167 bars forcing hours beyond the regular schedule","Health care disaster, state emergency, unforeseeable emergency, ongoing procedure"],["Texas","Hospitals restricted from mandating overtime for direct-care nurses","Declared disaster or catastrophic event"]]} },
      { h: "If you're a nurse or tech in a restricted state", p: [
          "Check your state's exact statute before refusing a shift, since the emergency exceptions are usually broader than workers expect and hospitals sometimes invoke \"unforeseen circumstances\" liberally. New York's own [Department of Labor guidance](https://dol.ny.gov/mandatory-overtime-nurses) on Labor Law §167 is a good model for how specific these rules get. If you believe a hospital forced a shift outside the statute's exceptions, that's a workplace-law violation worth raising with your state labor agency or an employment attorney, separate from any pay dispute."
        ] },
      { h: "Being paid correctly for the mandatory hours matters more", p: [
          "Here's the part that actually costs most workers money: it isn't usually whether the overtime was mandatory, it's whether it was calculated correctly once you worked it. Overtime in the US averaged 3.8 weekly hours in manufacturing in 2025 and ran close to 4 hours a week for much of 2026, according to [Bureau of Labor Statistics](https://www.bls.gov/opub/ted/2026/overtime-hours-in-manufacturing-industries.htm) data, and those hours, multiplied by a wrong regular rate or a missed nondiscretionary bonus, add up fast over a year.",
          "The regular rate has to include most bonuses and shift differentials, not just your base hourly wage, and the 1.5x multiplier applies to that full regular rate. If your pay stub shows overtime calculated only on your base wage, or shows straight time for hours past 40, that's a wage-and-hour problem regardless of whether the shift itself was mandatory. Run your numbers through the [overtime calculator](/calculators/overtime-calculator), which also shows the plain premium rate on its own."
        ] },
      { h: "What to actually do about it", p: [
          "If the schedule is lawful but you simply don't want to work it, your options are limited to negotiation, your union contract if you have one, or looking for another job, the law generally won't force your employer to excuse you. If you suspect the overtime pay itself is wrong, that's a different and much more actionable problem: pull your last several pay stubs, log the hours you actually worked, and compare them against what you were paid.",
          "If the numbers don't match, the [back-pay calculator](/calculators/back-pay-calculator) estimates what you may be owed across the FLSA's two- to three-year recovery window, including potential liquidated damages. For the full mechanics of a correct overtime calculation, [how to calculate overtime pay](/blog/how-to-calculate-overtime-pay) walks through it step by step, and [unpaid overtime recovery](/blog/unpaid-overtime-recovery) covers what happens after you find a shortfall."
        ] },
      { h: "Frequently asked questions", p: [
          "Can I be fired for refusing overtime in an at-will state? In most cases, yes. Outside Montana (which drops at-will status after a probationary period), employers can generally discipline or terminate you for declining a lawfully scheduled shift, unless a specific exception like FMLA, ADA, a union contract, or a state healthcare-worker law applies.",
          "Is there a federal limit on how many hours I can be scheduled? No. The FLSA sets no cap on daily or weekly hours for employees 16 and over; its only requirement is paying the correct overtime premium once weekly hours pass 40. A few regulated industries, like commercial trucking and aviation, have separate hours-of-service rules.",
          "Does salaried mean my employer can force unlimited overtime with no extra pay? Only if you're properly classified as exempt under the FLSA's salary and duties tests. A misclassified \"salaried\" worker who doesn't actually meet the exemption test is still owed overtime; check the classification carefully with [exempt vs non-exempt employees](/blog/exempt-vs-non-exempt-employees) before assuming a salary erases overtime rights.",
          "Do minors have different mandatory-overtime protections? Yes, workers under 18 fall under separate federal and state child-labor hour restrictions that cap daily and weekly hours regardless of overtime pay, and those limits apply even when the FLSA's general adult rules wouldn't restrict scheduling.",
          "What's the fastest way to check if I'm owed money from mandatory overtime shifts? Compare your actual hours worked to your pay stub's overtime line using the [overtime calculator](/calculators/overtime-calculator); a mismatch there is a far more common (and fixable) problem than the mandatory scheduling itself."
        ] }
    ]
  }
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

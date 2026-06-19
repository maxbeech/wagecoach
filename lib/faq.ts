export interface FaqItem { q: string; a: string }

export const HOME_FAQS: FaqItem[] = [
  {
    q: "How is overtime pay calculated?",
    a: "Under the federal Fair Labor Standards Act (FLSA), non-exempt employees earn 1.5× their regular hourly rate for every hour worked over 40 in a workweek. So at $20/hr, overtime is $30/hr. A few states (California, Alaska, Nevada, Colorado) also require daily overtime, and California adds double time. This calculator applies those rules when you pick the state and enter your daily hours.",
  },
  {
    q: "What is time and a half?",
    a: "Time and a half means 1.5 times your regular hourly rate. It is the standard federal overtime premium for hours over 40 in a week. To find it, multiply your hourly wage by 1.5 (for example, $18 × 1.5 = $27 per overtime hour).",
  },
  {
    q: "What is the minimum wage in 2026?",
    a: "The federal minimum wage is $7.25/hour and has not changed since 2009. Thirty states plus DC set a higher minimum, from $8.75 in West Virginia up to $17.95 in Washington, D.C. Pick your state to see its 2026 rate, the tipped-employee wage, and the overtime and final-paycheck rules.",
  },
  {
    q: "Do salaried employees get overtime?",
    a: "Only if they are non-exempt. To be exempt from overtime, an employee generally must be paid a salary of at least $684/week ($35,568/year) under federal law AND perform exempt executive, administrative or professional duties. Some states (California, New York, Washington and others) set a higher salary threshold. Salary alone does not make someone exempt.",
  },
  {
    q: "Is the data on WageCalc HQ accurate and current?",
    a: "The calculators use the federal FLSA rules and the 2026 state minimum-wage, tipped-wage, overtime, final-paycheck and break data, each cited on the methodology page. Wage and hour law changes often and has local exceptions, so always confirm with your state labor department before relying on a figure for payroll or a legal decision.",
  },
];

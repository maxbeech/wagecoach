import { dollars } from "./federal";
import { CLAIM_LABELS, type BackPayInputs, type BackPayResult } from "./backpay";
import { wageClaim } from "./wage-claim-data";
import type { StateLaw } from "./states";

// Generates the Claim Kit deliverables from a back-pay case: a fill-in-the-blanks
// demand letter with the computed figures already baked in, and a filing guide.
// Bracketed [placeholders] are the few personal details we never collect (name,
// dates, employer), so the worker completes and sends it. This is self-help
// information, not legal advice.

export interface LetterFields {
  yourName: string;
  yourAddress: string;
  yourPhone: string;
  yourEmail: string;
  employerName: string;
  employerAddress: string;
  startDate: string;
  endDate: string;
  letterDate: string;
}

// Replace [bracketed placeholders] in the generated letter with user-supplied
// values. Any field left blank keeps its placeholder so the user sees what
// still needs filling when they print.
export function personaliseLetter(template: string, f: Partial<LetterFields>): string {
  const contact = [f.yourPhone, f.yourEmail].filter(Boolean).join(" · ") || "[Your phone] · [Your email]";
  return template
    .replace("[Date]", f.letterDate || "[Date]")
    .replace("[Your full name]", f.yourName || "[Your full name]")
    .replace("[Your address]", f.yourAddress || "[Your address]")
    .replace("[Your phone] · [Your email]", contact)
    .replace("[Employer / company name]", f.employerName || "[Employer / company name]")
    .replace("[Employer address]", f.employerAddress || "[Employer address]")
    .replace("[employer name]", f.employerName || "[employer name]")
    .replace("[start date]", f.startDate || "[start date]")
    .replace("[end date]", f.endDate || "[end date]")
    .replace("[Your signature]", f.yourName || "[Your signature]")
    .replace(/\[Your name\]\s*$/, f.yourName || "[Your name]");
}

export function buildDemandLetter(inp: BackPayInputs, r: BackPayResult, state: StateLaw | null): string {
  const wc = state ? wageClaim(state.abbr) : { agency: "the U.S. Department of Labor, Wage and Hour Division", statePlus: undefined as string | undefined };
  const claim = CLAIM_LABELS[inp.claimType].toLowerCase();
  const stateClause = state ? ` and ${state.name} wage law` : "";
  const statePlus = wc.statePlus ? ` ${wc.statePlus}` : "";

  return [
    "[Date]",
    "",
    "[Your full name]",
    "[Your address]",
    "[Your phone] · [Your email]",
    "",
    "[Employer / company name]",
    "[Employer address]",
    "",
    `Re: Demand for payment of unpaid ${claim} wages`,
    "",
    "To whom it may concern,",
    "",
    `I am writing to request payment of wages I am owed for work performed while employed at [employer name]. Between [start date] and [end date] I worked approximately ${inp.hoursPerWeek} hours in a typical week at a regular rate of ${dollars(r.correctRate)} per hour, and was not paid all wages required by law.`,
    "",
    `Under the federal Fair Labor Standards Act (29 U.S.C. § 207)${stateClause}, my correct pay for a typical week was ${dollars(r.owedWeekly)}, but I received ${dollars(r.paidWeekly)} — a shortfall of ${dollars(r.weeklyShortfall)} per week. Over ${r.recoverableWeeks} weeks within the ${r.lookbackYears}-year limitations period, this totals approximately ${dollars(r.backPay)} in unpaid wages. The FLSA also provides for an equal amount in liquidated damages, which would bring the total to as much as ${dollars(r.totalPotential)}.`,
    "",
    `I request payment of ${dollars(r.backPay)} within 14 days of the date of this letter.${statePlus}`,
    "",
    `If I do not receive payment, I intend to file a wage claim with ${wc.agency} and to pursue all remedies available to me, including liquidated damages, interest, and attorney's fees. Please note that the law prohibits retaliation against an employee for asserting the right to be paid.`,
    "",
    "Please contact me at the phone number or email above to resolve this matter.",
    "",
    "Sincerely,",
    "",
    "[Your signature]",
    "[Your name]",
  ].join("\n");
}

export interface FilingGuide {
  agency: string;
  fileUrl?: string;
  statePlus?: string;
  steps: string[];
}

export function buildFilingGuide(inp: BackPayInputs, state: StateLaw | null): FilingGuide {
  const wc = state ? wageClaim(state.abbr) : { agency: "the U.S. Department of Labor, Wage and Hour Division", fileUrl: "https://www.dol.gov/agencies/whd/contact/complaints", statePlus: undefined as string | undefined };
  const where = state ? state.name : "your state";
  return {
    agency: wc.agency,
    fileUrl: wc.fileUrl,
    statePlus: wc.statePlus,
    steps: [
      "Fill in the bracketed details in the demand letter (your name, dates, employer) and keep a dated copy.",
      "Send the letter to your employer or its HR/payroll contact — email is fine; certified mail gives you proof of delivery.",
      `Gather your evidence: pay stubs, schedules, timesheets and any messages about your hours. In ${where}, your own honest records can support a claim if the employer's are missing.`,
      `If the employer does not pay within 14 days, file a wage claim with ${wc.agency}${wc.fileUrl ? "" : ", or with the U.S. Department of Labor"}.`,
      "Watch the deadline: federal claims must be filed within 2 years (3 if willful). Don't wait — older weeks drop off as time passes.",
    ],
  };
}

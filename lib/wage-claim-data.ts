// Where and how to file an unpaid-wage claim, by state.
//
// The core back-pay math (lib/backpay.ts) is anchored to the FEDERAL FLSA window
// (2 years, or 3 if the violation was willful), which applies in every state, so
// the dollar figure never depends on a state-specific number we can't stand
// behind. This table adds the *route*: which agency handles wage claims, the
// official filing channel, and any notable state penalties an employee may add on
// top of the federal back pay. `statePlus` is only set where the state rule is
// well established. Every wage-claim page tells the reader to confirm with the
// named agency, because deadlines and remedies have local exceptions.
//
// Compiled from the U.S. DOL Wage and Hour Division and state labor-department
// pages (June 2026). Re-verify the agency links periodically.

export const FEDERAL_WHD = {
  agency: "U.S. Department of Labor, Wage and Hour Division (WHD)",
  fileUrl: "https://www.dol.gov/agencies/whd/contact/complaints",
};

export interface WageClaimInfo {
  agency: string; // the state agency that takes wage claims
  fileUrl?: string; // official filing channel, when confidently known
  statePlus?: string; // notable state remedy on top of the federal back pay
}

// Keyed by state abbreviation. States with no wage-claim agency of their own
// (claims run through the federal WHD) are given the WHD agency name.
export const WAGE_CLAIM: Record<string, WageClaimInfo> = {
  AL: { agency: FEDERAL_WHD.agency, fileUrl: FEDERAL_WHD.fileUrl },
  AK: { agency: "Alaska Dept. of Labor, Wage and Hour Administration" },
  AZ: { agency: "Industrial Commission of Arizona, Labor Department", statePlus: "Arizona allows treble (3×) damages for unpaid wages." },
  AR: { agency: "Arkansas Dept. of Labor and Licensing" },
  CA: { agency: "California Labor Commissioner's Office (DLSE)", fileUrl: "https://www.dir.ca.gov/dlse/howtofilewageclaim.htm", statePlus: "California adds waiting-time penalties of up to 30 days' wages, plus liquidated damages for minimum-wage violations." },
  CO: { agency: "Colorado Dept. of Labor and Employment (CDLE), Labor Standards", fileUrl: "https://cdle.colorado.gov/dlss/file-a-complaint", statePlus: "Colorado can add penalties of up to 2× the unpaid wages when an employer fails to pay after a written demand." },
  CT: { agency: "Connecticut Dept. of Labor, Wage and Workplace Standards", statePlus: "Connecticut allows double damages plus attorney's fees for wage violations." },
  DE: { agency: "Delaware Dept. of Labor, Office of Labor Law Enforcement" },
  DC: { agency: "DC Dept. of Employment Services, Office of Wage-Hour", statePlus: "DC allows liquidated damages of up to 3× the unpaid wages." },
  FL: { agency: FEDERAL_WHD.agency, fileUrl: FEDERAL_WHD.fileUrl, statePlus: "Florida has no state wage agency; minimum-wage claims allow liquidated (double) damages." },
  GA: { agency: FEDERAL_WHD.agency, fileUrl: FEDERAL_WHD.fileUrl },
  HI: { agency: "Hawaii Dept. of Labor, Wage Standards Division" },
  ID: { agency: "Idaho Dept. of Labor, Wage and Hour" },
  IL: { agency: "Illinois Dept. of Labor, Fair Labor Standards Division", fileUrl: "https://labor.illinois.gov/about/file-a-complaint.html", statePlus: "Illinois adds 5% per month in damages on unpaid wages." },
  IN: { agency: "Indiana Dept. of Labor, Wage and Hour", statePlus: "Indiana allows liquidated damages of up to 2× the unpaid wages." },
  IA: { agency: "Iowa Division of Labor" },
  KS: { agency: "Kansas Dept. of Labor" },
  KY: { agency: "Kentucky Labor Cabinet, Division of Wages and Hours", statePlus: "Kentucky allows liquidated (double) damages plus attorney's fees." },
  LA: { agency: FEDERAL_WHD.agency, fileUrl: FEDERAL_WHD.fileUrl, statePlus: "Louisiana penalty wages can run up to 90 days' pay for unpaid final wages." },
  ME: { agency: "Maine Dept. of Labor, Wage and Hour Division", statePlus: "Maine allows up to 2× the unpaid wages plus costs and fees." },
  MD: { agency: "Maryland Dept. of Labor, Employment Standards Service", statePlus: "Maryland allows up to 3× the unpaid wages where there is no bona fide dispute." },
  MA: { agency: "Massachusetts Attorney General's Fair Labor Division", fileUrl: "https://www.mass.gov/how-to/file-a-wage-complaint", statePlus: "Massachusetts mandates treble (3×) damages plus attorney's fees for wage violations." },
  MI: { agency: "Michigan Dept. of Labor and Economic Opportunity, Wage and Hour" },
  MN: { agency: "Minnesota Dept. of Labor and Industry, Labor Standards" },
  MS: { agency: FEDERAL_WHD.agency, fileUrl: FEDERAL_WHD.fileUrl },
  MO: { agency: "Missouri Dept. of Labor, Division of Labor Standards" },
  MT: { agency: "Montana Dept. of Labor and Industry", statePlus: "Montana adds a penalty of up to 110% of the wages due." },
  NE: { agency: "Nebraska Dept. of Labor" },
  NV: { agency: "Nevada Office of the Labor Commissioner" },
  NH: { agency: "New Hampshire Dept. of Labor", statePlus: "New Hampshire allows liquidated damages where wages are wilfully withheld." },
  NJ: { agency: "New Jersey Dept. of Labor, Wage and Hour", fileUrl: "https://www.nj.gov/labor/wageandhour/", statePlus: "New Jersey allows liquidated damages of up to 200% of the unpaid wages." },
  NM: { agency: "New Mexico Dept. of Workforce Solutions, Labor Relations Division", statePlus: "New Mexico allows up to 2× the unpaid wages." },
  NY: { agency: "New York State Dept. of Labor, Division of Labor Standards", fileUrl: "https://dol.ny.gov/labor-standards-complaint", statePlus: "New York allows a 6-year look-back, liquidated (double) damages, and interest." },
  NC: { agency: "North Carolina Dept. of Labor, Wage and Hour Bureau", statePlus: "North Carolina allows liquidated (double) damages." },
  ND: { agency: "North Dakota Dept. of Labor and Human Rights" },
  OH: { agency: "Ohio Dept. of Commerce / Attorney General" },
  OK: { agency: "Oklahoma Dept. of Labor" },
  OR: { agency: "Oregon Bureau of Labor and Industries (BOLI)", fileUrl: "https://www.oregon.gov/boli/workers/Pages/wage-and-hour-complaints.aspx", statePlus: "Oregon penalty wages can run up to 30 days' pay for late final wages." },
  PA: { agency: "Pennsylvania Dept. of Labor and Industry, Labor Law Compliance", statePlus: "Pennsylvania allows liquidated damages of 25% of the wages due (or $500, whichever is greater)." },
  RI: { agency: "Rhode Island Dept. of Labor and Training", statePlus: "Rhode Island allows up to 2× the unpaid wages." },
  SC: { agency: FEDERAL_WHD.agency, fileUrl: FEDERAL_WHD.fileUrl, statePlus: "South Carolina allows treble (3×) damages for unpaid wages." },
  SD: { agency: "South Dakota Dept. of Labor and Regulation" },
  TN: { agency: "Tennessee Dept. of Labor and Workforce Development" },
  TX: { agency: "Texas Workforce Commission (TWC), Labor Law", fileUrl: "https://www.twc.texas.gov/programs/wage-and-hour/how-submit-wage-claim-under-texas-payday-law", statePlus: "A Texas Payday Law claim must generally be filed within 180 days of when the wages were due." },
  UT: { agency: "Utah Labor Commission, Wage Claim Unit" },
  VT: { agency: "Vermont Dept. of Labor" },
  VA: { agency: "Virginia Dept. of Labor and Industry (DOLI)", statePlus: "Virginia allows double (and, for knowing violations, treble) damages plus fees." },
  WA: { agency: "Washington State Dept. of Labor and Industries (L&I)", fileUrl: "https://www.lni.wa.gov/workers-rights/workplace-complaints/wage-complaints", statePlus: "Washington can add double damages where wages are willfully withheld." },
  WV: { agency: "West Virginia Division of Labor", statePlus: "West Virginia allows liquidated damages of up to 2× the unpaid wages." },
  WI: { agency: "Wisconsin Dept. of Workforce Development, Equal Rights Division" },
  WY: { agency: "Wyoming Dept. of Workforce Services, Labor Standards" },
};

export function wageClaim(abbr: string): WageClaimInfo {
  return WAGE_CLAIM[abbr.toUpperCase()] ?? { agency: FEDERAL_WHD.agency, fileUrl: FEDERAL_WHD.fileUrl };
}

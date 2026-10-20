import { STATE_CORE } from "./states-data";

// Every permanent redirect the site serves, in one place. next.config.ts reads
// REDIRECTS; test/redirects.test.mts checks each destination is a live page, so
// a redirect can never point at another redirect or a 404.
//
// Why these exist (docs/monetization_reset_plan.md):
//   - The blog was cut from 57 posts to 29 after the August 2026 spam update;
//     merged posts point at the post that now holds their content
//     (decision table in docs/blog_audit.md).
//   - /wage-claim/<state> repeated most of /states/<state>; its content moved to
//     the state page's #wage-claim section.
//   - The free attorney case review (lead generation) was retired.

export interface Redirect { source: string; destination: string; permanent: true }

/** Removed blog posts and where their content lives now. */
export const BLOG_REDIRECTS: [string, string][] = [
  ["/blog/what-is-time-and-a-half", "/blog/how-to-calculate-overtime-pay"],
  ["/blog/do-salaried-employees-get-overtime", "/blog/exempt-vs-non-exempt-employees"],
  ["/blog/how-to-calculate-double-time", "/blog/california-overtime-rules"],
  ["/blog/multi-state-overtime-compliance", "/blog/overtime-for-remote-hybrid-workers"],
  ["/blog/january-2026-minimum-wage-increases", "/blog/minimum-wage-2026-by-state"],
  ["/blog/how-to-convert-salary-to-hourly", "/calculators/salary-to-hourly-calculator"],
  ["/blog/city-vs-state-minimum-wage", "/blog/minimum-wage-2026-by-state"],
  ["/blog/gross-pay-vs-net-pay", "/blog/how-to-read-a-pay-stub"],
  ["/blog/payroll-taxes-explained", "/blog"],
  ["/blog/overtime-for-tipped-employees", "/blog/tipped-minimum-wage-and-tip-credit"],
  ["/blog/severance-pay-rules", "/blog/final-paycheck-laws-by-state"],
  ["/blog/flsa-overtime-explained", "/blog/how-to-calculate-overtime-pay"],
  ["/blog/holiday-pay-rules", "/blog/how-to-calculate-overtime-pay"],
  ["/blog/how-to-report-wage-theft", "/blog/file-department-of-labor-complaint"],
  ["/blog/1099-vs-w2-employment-classification", "/blog/independent-contractor-vs-employee"],
  ["/blog/flsa-exemptions-explained", "/blog/exempt-vs-non-exempt-employees"],
  ["/blog/signs-of-employee-misclassification", "/blog/independent-contractor-vs-employee"],
  ["/blog/child-support-vs-consumer-debt-garnishment", "/blog/wage-garnishment-rules"],
  ["/blog/lunch-break-laws-am-i-entitled", "/blog/break-laws-by-state"],
  ["/blog/california-meal-rest-break-penalties", "/blog/break-laws-by-state"],
  ["/blog/case-study-server-recovers-unpaid-tips", "/blog/tipped-minimum-wage-and-tip-credit"],
  ["/blog/minimum-wage-increases-july-2026", "/blog/minimum-wage-2026-by-state"],
  ["/blog/florida-minimum-wage-15-september-2026", "/blog/minimum-wage-2026-by-state"],
  ["/blog/overtime-salary-threshold-litigation-2026", "/blog/exempt-vs-non-exempt-employees"],
  ["/blog/dol-back-wages-recovered-2025", "/blog/file-department-of-labor-complaint"],
  ["/blog/labor-board-complaint-vs-attorney", "/blog/attorney-for-unpaid-wages"],
  ["/blog/free-paycheck-calculators-compared", "/blog"],
  ["/blog/is-the-wage-claim-kit-worth-it", "/blog"],
];

export const REDIRECTS: Redirect[] = [
  ...BLOG_REDIRECTS.map(([source, destination]) => ({ source, destination, permanent: true as const })),
  ...STATE_CORE.map((s) => ({ source: `/wage-claim/${s.slug}`, destination: `/states/${s.slug}#wage-claim`, permanent: true as const })),
  { source: "/free-case-review", destination: "/wage-claim", permanent: true },
];

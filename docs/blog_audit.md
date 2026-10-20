# Blog audit

Context: Google's August 2026 spam update (2026-08-18) cut impressions from about 500 a day to about 5. The likely cause is scaled or thin content, and the blog was a large share of it: 57 posts written in about four months. (The brief said 59; `lib/posts.ts` actually held 57.) This audit prunes and consolidates it.

Result: **57 posts down to 29.** KEEP 29, MERGE 24, DELETE 4.

How it was produced: `lib/posts.ts` was read by a script (word count, primary search intent, flags for Pro report / case review / Claim Kit mentions, em-dash density, unverifiable first-person claims). Each post was then read and classified. Surviving posts were rewritten or extended from a patch set, so the file is regenerated from data, not hand-edited. The script lives in the session scratchpad, not in the repo.

Findings that drove decisions:
- No post promoted the Pro report or the free case review / attorney matching. The only product promotion was `is-the-wage-claim-kit-worth-it`. Where a surviving post now points at a product it is the $29 Claim Kit or the back-pay calculator. `attorney-for-unpaid-wages` now states that WageCoach is not a law firm and does not refer attorneys.
- Three posts contained invented or unverifiable material: `case-study-server-recovers-unpaid-tips` (a composite case with a made-up $4,200 recovery), and `flsa-exemptions-explained` and `signs-of-employee-misclassification` ("in our experience reviewing intake forms", an invented $14,000 anecdote, an invented quote, and an unsourced 10% to 30% misclassification statistic). None of that was carried into the merge targets.
- Four posts were dated news (January, July and Florida minimum wage; the salary-threshold litigation) that duplicated the head-term post. Two of them contradicted it: the head post said Nevada re-indexes on July 1 while the July post said Nevada did not move. The July post had sources, so the head post now follows it.
- A regular-rate example repeated in `unpaid-overtime-recovery`, `flsa-overtime-explained` and `what-is-back-pay` overstated the shortfall ($36 vs $30 an hour). When the bonus is already in straight-time pay the correct gap is $2 per overtime hour, $20 for the week in that example. Fixed in the survivors.
- `regular-rate-of-pay` linked to itself where it meant the exempt post. Fixed.

## Decision table

| Original slug | Decision | Target | Words (before) | Words (after) | Reason |
|---|---|---|---|---|---|
| `how-to-calculate-overtime-pay` | KEEP |  | 1008 | 1343 | Core overtime pillar; rewritten with worked examples and absorbs three duplicates. |
| `what-is-time-and-a-half` | MERGE | `/blog/how-to-calculate-overtime-pay` | 893 |  | Same intent as the overtime pillar and the time-and-a-half calculator; weekend/holiday myths and the 47-hour example folded in. |
| `minimum-wage-2026-by-state` | KEEP |  | 803 | 1236 | Head term for the site; absorbs the January, July and Florida news posts and the city-vs-state post; Nevada contradiction fixed. |
| `exempt-vs-non-exempt-employees` | KEEP |  | 818 | 1499 | Exemption pillar; retitled to cover the salaried question; absorbs three posts. |
| `final-paycheck-laws-by-state` | KEEP |  | 786 | 780 | High-intent recovery topic; rewritten with a penalty example; absorbs severance. |
| `tipped-minimum-wage-and-tip-credit` | KEEP |  | 847 | 1179 | Distinct tipped-wage intent; absorbs tipped overtime. |
| `california-overtime-rules` | KEEP |  | 794 | 809 | Distinct state intent with commercial value; rewritten; absorbs double time. |
| `do-salaried-employees-get-overtime` | MERGE | `/blog/exempt-vs-non-exempt-employees` | 757 |  | Near-identical salary test, duties test and threshold content; the overtime math is folded in. |
| `how-to-calculate-double-time` | MERGE | `/blog/california-overtime-rules` | 742 |  | Federal law never requires double time, so the only substance is California's rule. |
| `pto-payout-use-it-or-lose-it` | KEEP |  | 784 | 784 | Distinct intent not covered by a state page; link to removed salary post updated. |
| `multi-state-overtime-compliance` | MERGE | `/blog/overtime-for-remote-hybrid-workers` | 752 |  | Employer-compliance framing close to the retired Pro report; the useful which-state-applies facts fit the remote-worker post. |
| `january-2026-minimum-wage-increases` | MERGE | `/blog/minimum-wage-2026-by-state` | 753 |  | Dated news roundup duplicating the head-term post. |
| `how-to-convert-salary-to-hourly` | MERGE | `/blog/biweekly-vs-semimonthly-pay` | 742 |  | Duplicates the salary-to-hourly calculator page; the 2,080/1,950 facts and per-check math are folded into the pay-schedule post. |
| `city-vs-state-minimum-wage` | MERGE | `/blog/minimum-wage-2026-by-state` | 734 |  | Highest-rate-wins rule and Seattle figure folded in; city pages cover the rest. |
| `gross-pay-vs-net-pay` | MERGE | `/blog/how-to-read-a-pay-stub` | 1141 |  | Generic definitional intent, high competition, no recovery angle; gross-is-what-counts section folded in. |
| `how-to-read-a-pay-stub` | KEEP |  | 1092 | 1405 | Useful audit checklist for workers; absorbs gross vs net. |
| `independent-contractor-vs-employee` | KEEP |  | 1162 | 1463 | Classification pillar; absorbs 1099 vs W-2 and the signs post. |
| `break-laws-by-state` | KEEP |  | 1149 | 1578 | Break pillar; absorbs lunch-break and California penalty posts. |
| `wage-garnishment-rules` | KEEP |  | 1382 | 1595 | Distinct intent; absorbs the child-support comparison. |
| `travel-time-pay-rules` | KEEP |  | 1276 | 1261 | Distinct hours-worked topic; em dashes removed. |
| `payroll-taxes-explained` | DELETE | `/blog` | 1080 |  | Off-topic tax explainer, not wage-and-hour; keyword (payroll tax calculator) matches no tool on the site. |
| `on-call-pay-rules` | KEEP |  | 1188 | 1176 | Distinct hours-worked topic; em dashes removed. |
| `tip-pooling-rules` | KEEP |  | 1253 | 1239 | Distinct tip-theft intent; em dashes removed. |
| `regular-rate-of-pay` | KEEP |  | 1192 | 1172 | Technical depth that supports overtime claims; self-link bug fixed; em dashes removed. |
| `biweekly-vs-semimonthly-pay` | KEEP |  | 1028 | 1173 | Unusual split-workweek overtime angle; retitled to absorb salary conversion. |
| `overtime-for-tipped-employees` | MERGE | `/blog/tipped-minimum-wage-and-tip-credit` | 1262 |  | Same audience and calculator; the $5.76 calculation is folded in. |
| `what-is-wage-theft` | KEEP |  | 1177 | 1004 | Top recovery term; rewritten with an off-the-clock example. |
| `how-to-file-a-wage-claim` | KEEP |  | 895 | 775 | Core recovery how-to; rewritten with a worked claim. |
| `file-department-of-labor-complaint` | KEEP |  | 808 | 904 | Core recovery how-to; absorbs report-wage-theft and the FY2025 recovery post. |
| `what-is-back-pay` | KEEP |  | 921 | 960 | Definitional page for the back-pay calculator; corrected a regular-rate example. |
| `statute-of-limitations-unpaid-wages` | KEEP |  | 922 | 922 | Distinct, cited, and decision-relevant. |
| `demand-letter-unpaid-wages` | KEEP |  | 1064 | 932 | Feeds the Claim Kit; rewritten with a fill-in template. |
| `attorney-for-unpaid-wages` | KEEP |  | 1160 | 1019 | Rewritten as the single attorney page; absorbs the labor board comparison; states the site does not refer attorneys. |
| `severance-pay-rules` | MERGE | `/blog/final-paycheck-laws-by-state` | 844 |  | Mostly 'not required'; WARN and release facts fit the final-pay post. |
| `flsa-overtime-explained` | MERGE | `/blog/how-to-calculate-overtime-pay` | 979 |  | Same intent as the overtime pillar; coverage, penalties and exemption facts folded in. |
| `overtime-rules-by-state` | KEEP |  | 845 | 845 | Cross-state roundup of daily-OT states and thresholds. |
| `holiday-pay-rules` | MERGE | `/blog/how-to-calculate-overtime-pay` | 863 |  | Thin; holiday hours count toward 40 and no federal premium folded into the pillar. |
| `comp-time-vs-overtime` | KEEP |  | 1108 | 1108 | Distinct, clear violation test. |
| `how-to-report-wage-theft` | MERGE | `/blog/file-department-of-labor-complaint` | 796 |  | Same intent as the DOL complaint post; state agency list folded in. |
| `1099-vs-w2-employment-classification` | MERGE | `/blog/independent-contractor-vs-employee` | 899 |  | Same classification intent; SS-8 and remedies folded in. |
| `unpaid-overtime-recovery` | KEEP |  | 913 | 952 | Highest commercial value; rewritten with worked back-pay example; wrong regular-rate example corrected. |
| `flsa-exemptions-explained` | MERGE | `/blog/exempt-vs-non-exempt-employees` | 1170 |  | Same intent; contained 'in our experience' claims with no basis, so only the legal content was carried over. |
| `signs-of-employee-misclassification` | MERGE | `/blog/independent-contractor-vs-employee` | 1168 |  | Checklist folded in; invented $14,000 anecdote, quote and unsourced 10-30% statistic dropped. |
| `child-support-vs-consumer-debt-garnishment` | MERGE | `/blog/wage-garnishment-rules` | 969 |  | Same CCPA content; the side-by-side example is folded in. |
| `lunch-break-laws-am-i-entitled` | MERGE | `/blog/break-laws-by-state` | 981 |  | Duplicate of the break post; auto-deduct section folded in. |
| `california-meal-rest-break-penalties` | MERGE | `/blog/break-laws-by-state` | 967 |  | Overlaps the California section of the break post; waiver and premium detail folded in. |
| `late-or-bounced-paycheck` | KEEP |  | 933 | 933 | Distinct wage-recovery intent. |
| `case-study-server-recovers-unpaid-tips` | DELETE | `/blog/tipped-minimum-wage-and-tip-credit` | 940 |  | Composite, invented case ($4,200 recovery) presented as a case study; the mechanics are covered in the tipped posts. |
| `overtime-for-remote-hybrid-workers` | KEEP |  | 965 | 1215 | Distinct modern intent; absorbs multi-state. |
| `minimum-wage-increases-july-2026` | MERGE | `/blog/minimum-wage-2026-by-state` | 824 |  | Dated news; Alaska and Oregon figures and sources folded in. |
| `florida-minimum-wage-15-september-2026` | MERGE | `/blog/minimum-wage-2026-by-state` | 837 |  | Dated news; a Florida state page exists; the schedule and tipped figure are folded in. |
| `overtime-salary-threshold-litigation-2026` | MERGE | `/blog/exempt-vs-non-exempt-employees` | 882 |  | News/litigation timeline; folded in with its sources. |
| `dol-back-wages-recovered-2025` | MERGE | `/blog/file-department-of-labor-complaint` | 790 |  | Cited FY2025 figures folded into the complaint post. |
| `labor-board-complaint-vs-attorney` | MERGE | `/blog/attorney-for-unpaid-wages` | 1068 |  | Same keyword and intent as the attorney post; comparison folded in. |
| `free-paycheck-calculators-compared` | DELETE | `/blog` | 945 |  | Self-promo comparison of competitor tools; the site has no net-pay calculator. |
| `is-the-wage-claim-kit-worth-it` | DELETE | `/blog` | 933 |  | Self-promo; the Claim Kit is described where it is relevant. |
| `is-overtime-mandatory` | KEEP |  | 1541 | 1537 | Longest, sourced, with a state table; em dashes removed. |

## Top posts rewritten

how-to-calculate-overtime-pay, unpaid-overtime-recovery, california-overtime-rules, final-paycheck-laws-by-state, what-is-wage-theft, how-to-file-a-wage-claim, demand-letter-unpaid-wages, file-department-of-labor-complaint, attorney-for-unpaid-wages. Edits: stock phrasing and em dashes removed; each has a worked example with its arithmetic shown; no legal figure was added that was not already on the site (the $2,515 penalty, the two and three year windows, $684 and $35,568, California's 8 and 12 hour thresholds, the FY2025 DOL figures with their source link all came from the existing posts). Em dashes were also stripped from the six other survivors that used them.

## Redirects

Paste into the `redirects()` array in `next.config.ts` (not edited here). Merge sources point at the post that now holds their content; deleted posts point at the closest surviving post, or the blog index.

```ts
{ source: "/blog/what-is-time-and-a-half", destination: "/blog/how-to-calculate-overtime-pay", permanent: true },
{ source: "/blog/do-salaried-employees-get-overtime", destination: "/blog/exempt-vs-non-exempt-employees", permanent: true },
{ source: "/blog/how-to-calculate-double-time", destination: "/blog/california-overtime-rules", permanent: true },
{ source: "/blog/multi-state-overtime-compliance", destination: "/blog/overtime-for-remote-hybrid-workers", permanent: true },
{ source: "/blog/january-2026-minimum-wage-increases", destination: "/blog/minimum-wage-2026-by-state", permanent: true },
{ source: "/blog/how-to-convert-salary-to-hourly", destination: "/blog/biweekly-vs-semimonthly-pay", permanent: true },
{ source: "/blog/city-vs-state-minimum-wage", destination: "/blog/minimum-wage-2026-by-state", permanent: true },
{ source: "/blog/gross-pay-vs-net-pay", destination: "/blog/how-to-read-a-pay-stub", permanent: true },
{ source: "/blog/payroll-taxes-explained", destination: "/blog", permanent: true },
{ source: "/blog/overtime-for-tipped-employees", destination: "/blog/tipped-minimum-wage-and-tip-credit", permanent: true },
{ source: "/blog/severance-pay-rules", destination: "/blog/final-paycheck-laws-by-state", permanent: true },
{ source: "/blog/flsa-overtime-explained", destination: "/blog/how-to-calculate-overtime-pay", permanent: true },
{ source: "/blog/holiday-pay-rules", destination: "/blog/how-to-calculate-overtime-pay", permanent: true },
{ source: "/blog/how-to-report-wage-theft", destination: "/blog/file-department-of-labor-complaint", permanent: true },
{ source: "/blog/1099-vs-w2-employment-classification", destination: "/blog/independent-contractor-vs-employee", permanent: true },
{ source: "/blog/flsa-exemptions-explained", destination: "/blog/exempt-vs-non-exempt-employees", permanent: true },
{ source: "/blog/signs-of-employee-misclassification", destination: "/blog/independent-contractor-vs-employee", permanent: true },
{ source: "/blog/child-support-vs-consumer-debt-garnishment", destination: "/blog/wage-garnishment-rules", permanent: true },
{ source: "/blog/lunch-break-laws-am-i-entitled", destination: "/blog/break-laws-by-state", permanent: true },
{ source: "/blog/california-meal-rest-break-penalties", destination: "/blog/break-laws-by-state", permanent: true },
{ source: "/blog/case-study-server-recovers-unpaid-tips", destination: "/blog/tipped-minimum-wage-and-tip-credit", permanent: true },
{ source: "/blog/minimum-wage-increases-july-2026", destination: "/blog/minimum-wage-2026-by-state", permanent: true },
{ source: "/blog/florida-minimum-wage-15-september-2026", destination: "/blog/minimum-wage-2026-by-state", permanent: true },
{ source: "/blog/overtime-salary-threshold-litigation-2026", destination: "/blog/exempt-vs-non-exempt-employees", permanent: true },
{ source: "/blog/dol-back-wages-recovered-2025", destination: "/blog/file-department-of-labor-complaint", permanent: true },
{ source: "/blog/labor-board-complaint-vs-attorney", destination: "/blog/attorney-for-unpaid-wages", permanent: true },
{ source: "/blog/free-paycheck-calculators-compared", destination: "/blog", permanent: true },
{ source: "/blog/is-the-wage-claim-kit-worth-it", destination: "/blog", permanent: true },
```

## Follow-ups outside this change

- The sitemap (`app/sitemap.ts`) reads `POSTS`, so removed slugs drop out of it automatically. Resubmit it once the redirects ship.
- `public/blog/posts/*.jpg` still holds images for the removed slugs. They are unreferenced and can be deleted.
- `how-to-convert-salary-to-hourly` is redirected to the pay-schedule post per the table, though a redirect to `/calculators/salary-to-hourly-calculator` would match the search intent more closely. Pick one when adding the redirects.
- Surviving posts that were not rewritten (travel time, on-call, tip pooling, PTO payout, break laws, garnishment, and others) keep their original voice apart from the merged sections and the em-dash cleanup. Rewrite them next if they stay flat after recovery.

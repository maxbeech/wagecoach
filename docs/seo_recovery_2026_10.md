# SEO recovery, October 2026

Change log for the August 2026 spam-update recovery. Written 2026-10-20.

## Diagnosis

Search Console impressions for `sc-domain:wagecoach.com` fell from 420 to 600 a day (470 on Aug 10, 439 on Aug 17) to 11 on **2026-08-18**, the first day of Google's August spam update (18 to 21 Aug), and have stayed at 5 to 21 a day since. The site had shipped about 200 templated pages in two weeks, which fits two spam policies: scaled content abuse (57 blog posts in four months) and doorway abuse (51 `/wage-claim/<state>` pages on the same state axis as 51 `/states/<state>` pages, plus 20 city pages). Nothing here shows a manual action; this is an algorithmic demotion, and recovery takes months.

Impressions 1 Jul to 17 Aug 2026 (about 23,000 in total, roughly 15 clicks):

| Family | Pattern | URLs then | Impressions | Verdict | Reason |
|---|---|---|---|---|---|
| State rate sheets | `/states/<state>` | 51 + index | about 5,000 | keep | Distinct per-state rates, tip credit, daily overtime, final-pay and break rules, plus the filing guide for that state. |
| Wage-claim by state | `/wage-claim/<state>` | 51 | about 590 | merge (done 2026-10-20, commit b3652ea) | Same axis as `/states`. Agency, filing route and back-pay window now sit in the `#wage-claim` section of each state page; every old URL 308s there. |
| Wage-claim hub | `/wage-claim` | 1 | 18 | keep | It is the back-pay estimator the header, home page, Claim Kit and Stripe cancel URL all point at. Not a doorway: one page, one tool. |
| City minimum wages | `/cities/<city>` | 20 + index | about 11,500 (index 289) | keep | Every city has its own rate, effective date, note and official source, and the rate differs from its state's. The pages are short; see "Left as is". |
| Blog | `/blog/<slug>` | 57 | about 3,100 | consolidate (done 2026-10-20) | 57 posts cut to 29, merged posts 308 to the survivor (`docs/blog_audit.md`). Re-read: the remaining 29 each answer a distinct question, so no further cuts. |
| Calculators | `/calculators/<slug>` | 11 + index | about 2,560 | keep | The tools. Untouched. |

## What changed in this pass

The consolidation above was already on master (commit b3652ea, earlier the same day). This pass finishes the job:

- Removed the doorway-style cross-linking added on 2026-10-14 (commits f3e6ca6, 0bef57a):
  - "Other states" on a state page links to 12 states again, not all 50.
  - A city page links only to other localities in the same state, not to all 19 other cities.
  - Footer no longer links to individual cities (New York City, Chicago, Denver); it links to the `/cities` index.
  - Blog "related guides" lists only guides that share a calculator with the post, at most 4. The wrap-around filler that gave every post six links to arbitrary neighbours is gone.
  - The state-to-wage-claim and wage-claim-to-state cross-links from 0bef57a already went with the merge.
- Added `test/seo-structure.test.mts`: old wage-claim state URLs redirect to their state page, kept pages are in the sitemap on the single canonical host, no individual city or state in the footer, no all-X grids.

## Duplicate sitemap submission

Search Console held two sitemaps: `https://www.wagecoach.com/sitemap.xml` (current, 120 URLs) and a stale `http://wagecoach.com/sitemap.xml` last submitted 2026-06-30 (198 URLs, now describing pages that no longer exist). The canonical host is `https://www.wagecoach.com` (`lib/site.ts`); the sitemap, robots and every canonical tag are built from it, and the apex and http hosts 308 to it. Nothing in the code produces the duplicate. Submit only the www sitemap; the http entry should be removed in the Search Console UI (the API tools available here can submit but not delete).

## Left as is

- Cities: all 20 qualify (own rate and source). The pages are thin: a rate, one note, a source and a calculator. If the site still does not recover, the weakest are the state-set tiers (Portland Metro, New York City) and small localities (Tucson, Flagstaff); folding those into their state pages is the next step. Portland Metro is also a Wage Watch location key, so removing it needs a migration of stored subscriptions.
- Blog: no further consolidation. Overlaps (`overtime-rules-by-state`, `how-to-file-a-wage-claim`, `file-department-of-labor-complaint`) each target a different query and carry different specifics.

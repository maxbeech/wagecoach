import type { BlogCategory } from "@/components/BlogImage";

const SLUG_CATEGORY: Record<string, BlogCategory> = {
  // Overtime
  "how-to-calculate-overtime-pay":      "overtime",
  "what-is-time-and-a-half":            "overtime",
  "california-overtime-rules":          "overtime",
  "do-salaried-employees-get-overtime": "overtime",
  "how-to-calculate-double-time":       "overtime",
  "overtime-for-tipped-employees":      "overtime",
  "flsa-overtime-explained":            "overtime",
  "overtime-rules-by-state":            "overtime",
  "comp-time-vs-overtime":              "overtime",
  "unpaid-overtime-recovery":           "overtime",
  "holiday-pay-rules":                  "overtime",

  // Minimum wage
  "minimum-wage-2026-by-state":         "minimum-wage",
  "january-2026-minimum-wage-increases":"minimum-wage",
  "city-vs-state-minimum-wage":         "minimum-wage",

  // Tipped wages
  "tipped-minimum-wage-and-tip-credit": "tipped",
  "tip-pooling-rules":                  "tipped",

  // Worker classification
  "exempt-vs-non-exempt-employees":         "classification",
  "independent-contractor-vs-employee":     "classification",
  "1099-vs-w2-employment-classification":   "classification",

  // Paycheck
  "gross-pay-vs-net-pay":             "paycheck",
  "how-to-read-a-pay-stub":           "paycheck",
  "payroll-taxes-explained":          "paycheck",
  "how-to-convert-salary-to-hourly":  "paycheck",
  "biweekly-vs-semimonthly-pay":      "paycheck",
  "regular-rate-of-pay":              "paycheck",

  // Leave & final pay
  "final-paycheck-laws-by-state": "time-off",
  "pto-payout-use-it-or-lose-it": "time-off",
  "break-laws-by-state":          "time-off",
  "on-call-pay-rules":            "time-off",
  "travel-time-pay-rules":        "time-off",
  "wage-garnishment-rules":       "time-off",
  "severance-pay-rules":          "time-off",

  // Compliance
  "multi-state-overtime-compliance": "compliance",

  // Wage recovery
  "what-is-wage-theft":                 "recovery",
  "how-to-file-a-wage-claim":           "recovery",
  "file-department-of-labor-complaint": "recovery",
  "what-is-back-pay":                   "recovery",
  "statute-of-limitations-unpaid-wages":"recovery",
  "demand-letter-unpaid-wages":         "recovery",
  "attorney-for-unpaid-wages":          "recovery",
  "how-to-report-wage-theft":           "recovery",
};

export function getPostCategory(slug: string): BlogCategory {
  return SLUG_CATEGORY[slug] ?? "paycheck";
}

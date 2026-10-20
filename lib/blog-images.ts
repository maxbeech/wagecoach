import type { BlogCategory } from "@/components/BlogImage";

const SLUG_CATEGORY: Record<string, BlogCategory> = {
  // Overtime
  "how-to-calculate-overtime-pay":      "overtime",
  "california-overtime-rules":          "overtime",
  "overtime-rules-by-state":            "overtime",
  "comp-time-vs-overtime":              "overtime",
  "unpaid-overtime-recovery":           "overtime",
  "is-overtime-mandatory":              "overtime",

  // Minimum wage
  "minimum-wage-2026-by-state":         "minimum-wage",

  // Tipped wages
  "tipped-minimum-wage-and-tip-credit": "tipped",
  "tip-pooling-rules":                  "tipped",

  // Worker classification
  "exempt-vs-non-exempt-employees":         "classification",
  "independent-contractor-vs-employee":     "classification",

  // Paycheck
  "how-to-read-a-pay-stub":           "paycheck",
  "biweekly-vs-semimonthly-pay":      "paycheck",
  "regular-rate-of-pay":              "paycheck",

  // Leave & final pay
  "final-paycheck-laws-by-state": "time-off",
  "pto-payout-use-it-or-lose-it": "time-off",
  "break-laws-by-state":          "time-off",
  "on-call-pay-rules":            "time-off",
  "travel-time-pay-rules":        "time-off",
  "wage-garnishment-rules":       "time-off",

  // Compliance

  // Wage recovery
  "what-is-wage-theft":                 "recovery",
  "how-to-file-a-wage-claim":           "recovery",
  "file-department-of-labor-complaint": "recovery",
  "what-is-back-pay":                   "recovery",
  "statute-of-limitations-unpaid-wages":"recovery",
  "demand-letter-unpaid-wages":         "recovery",
  "attorney-for-unpaid-wages":          "recovery",
};

export function getPostCategory(slug: string): BlogCategory {
  return SLUG_CATEGORY[slug] ?? "paycheck";
}

import type { BackPayInputs, BackPayResult } from "./backpay";

// A transparent "how strong does this look" score for a potential wage claim.
// This is a triage signal — it helps someone decide whether the back pay is worth
// the time of filing or talking to an attorney. It is NOT a legal opinion and says
// nothing about the merits; it reads the size, duration and recoverability of the
// estimated shortfall and nothing else.

export type ScoreTone = "strong" | "moderate" | "look" | "limited" | "none";

export interface ScoreFactor {
  label: string;
  detail: string;
  positive: boolean;
}

export interface CaseScore {
  score: number; // 0–100
  band: string; // human label
  tone: ScoreTone;
  factors: ScoreFactor[];
}

export function scoreCase(inp: BackPayInputs, r: BackPayResult): CaseScore {
  const factors: ScoreFactor[] = [];

  if (r.weeklyShortfall <= 0 || r.recoverableWeeks <= 0) {
    return {
      score: 0,
      band: "No shortfall found",
      tone: "none",
      factors: [
        {
          label: "No gap detected",
          detail: "From the figures entered, you were paid at or above what these rules require.",
          positive: false,
        },
      ],
    };
  }

  let score = 0;

  // Size of the per-week gap relative to what was owed (a deep gap is a clearer signal).
  const gapPct = r.owedWeekly > 0 ? r.weeklyShortfall / r.owedWeekly : 0;
  const sizePts = Math.min(30, Math.round(gapPct * 100));
  score += sizePts;
  factors.push({
    label: "Size of the weekly gap",
    detail: `About ${Math.round(gapPct * 100)}% of a typical week's correct pay looks unpaid.`,
    positive: gapPct >= 0.1,
  });

  // Total dollars at stake — bigger totals clear filing/attorney thresholds.
  const totalPts = Math.min(30, Math.round(r.backPay / 250));
  score += totalPts;
  factors.push({
    label: "Total back pay at stake",
    detail: r.backPay >= 1000
      ? "The amount is large enough that most wage attorneys will take a look."
      : "The amount is modest; a state labor-board claim or small-claims filing may fit best.",
    positive: r.backPay >= 1000,
  });

  // Duration — a long-running pattern is harder for an employer to wave off.
  const durationPts = Math.min(20, Math.round(r.recoverableWeeks / 5));
  score += durationPts;
  factors.push({
    label: "How long it ran",
    detail: `${r.recoverableWeeks} recoverable week${r.recoverableWeeks === 1 ? "" : "s"} within the federal ${r.lookbackYears}-year window.`,
    positive: r.recoverableWeeks >= 12,
  });

  // Willfulness — extends the window to 3 years and makes liquidated damages likelier.
  if (inp.willful) {
    score += 20;
    factors.push({
      label: "Possible willful violation",
      detail: "A willful violation extends the look-back to 3 years and strengthens a claim for double damages.",
      positive: true,
    });
  } else {
    factors.push({
      label: "Standard 2-year window",
      detail: "No willful-violation signal entered, so the federal look-back is 2 years.",
      positive: false,
    });
  }

  if (r.weeksCapped) {
    factors.push({
      label: "Some weeks fall outside the window",
      detail: "The underpayment ran longer than federal law lets you recover, so older weeks were excluded.",
      positive: false,
    });
  }

  score = Math.max(0, Math.min(100, score));
  const { band, tone } = bandFor(score);
  return { score, band, tone, factors };
}

function bandFor(score: number): { band: string; tone: ScoreTone } {
  if (score >= 70) return { band: "Strong signal", tone: "strong" };
  if (score >= 45) return { band: "Moderate signal", tone: "moderate" };
  if (score >= 20) return { band: "Worth a closer look", tone: "look" };
  return { band: "Limited signal", tone: "limited" };
}

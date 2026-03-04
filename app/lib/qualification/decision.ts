import type { Answers, BusinessContext, QualificationResult } from "@/app/lib/qualification/types";

function parseLeadType(score: number): QualificationResult["leadType"] {
  if (score >= 80) return "hot";
  if (score >= 60) return "warm";
  return "cold";
}

function parseNextAction(
  score: number,
  stage: QualificationResult["buyingStage"]
): QualificationResult["nextAction"] {
  if (score >= 80) return "book";
  if (score >= 60) return "apply";
  if (score >= 40) return stage === "exploring" ? "download" : "email";
  return "reject";
}

function parsePackage(
  budgetBand: QualificationResult["budgetBand"],
  score: number
): QualificationResult["recommendedPackage"] {
  if (score < 40) return "none";
  if (budgetBand === "high") return "pro";
  if (budgetBand === "mid") return "business";
  if (budgetBand === "low") return "starter";
  return score >= 70 ? "business" : "starter";
}

function normalizeBand(value: unknown): QualificationResult["budgetBand"] {
  if (value === "high") return "high";
  if (value === "mid") return "mid";
  if (value === "low") return "low";
  return "unknown";
}

function normalizeUrgency(value: unknown): QualificationResult["urgency"] {
  if (value === "high") return "high";
  if (value === "mid") return "mid";
  return "low";
}

function normalizeStage(value: unknown): QualificationResult["buyingStage"] {
  if (value === "ready") return "ready";
  if (value === "comparing") return "comparing";
  return "exploring";
}

export function buildQualificationResult(args: {
  score: number;
  answers: Answers;
  context: BusinessContext;
  keySignals: string[];
  redFlags: string[];
}): QualificationResult {
  const buyingStage = normalizeStage(args.answers.buyingStage);
  const budgetBand = normalizeBand(args.answers.budget);
  const urgency = normalizeUrgency(args.answers.urgency);
  const leadType = parseLeadType(args.score);
  const nextAction = parseNextAction(args.score, buyingStage);
  const recommendedPackage = parsePackage(budgetBand, args.score);

  const rationaleShort =
    leadType === "hot"
      ? "Strong fit with clear buying intent and near-term action."
      : leadType === "warm"
      ? "Good fit with positive signals; needs structured follow-up."
      : "Early-stage or low-fit lead; nurture before sales push.";

  return {
    fitScore: args.score,
    leadType,
    buyingStage,
    budgetBand,
    urgency,
    nextAction,
    recommendedPackage,
    rationaleShort,
    keySignals: args.keySignals.slice(0, 8),
    redFlags: args.redFlags.slice(0, 8),
    answers: args.answers,
    context: args.context,
  };
}


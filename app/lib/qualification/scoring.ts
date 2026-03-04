import type {
  Answers,
  BusinessContext,
  QualificationTemplate,
} from "@/app/lib/qualification/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function scoreAnswers(
  template: QualificationTemplate,
  answers: Answers,
  context: BusinessContext
) {
  let score = 0;
  const keySignals: string[] = [];
  const redFlags: string[] = [];

  for (const q of template.questions) {
    const raw = answers[q.id];
    if (typeof raw !== "string") continue;
    const selected = q.options.find((opt) => opt.value === raw);
    if (!selected) continue;
    score += selected.points;
    if (selected.signal) keySignals.push(selected.signal);
    if (selected.redFlag) redFlags.push(`${q.label}: ${selected.label}`);
  }

  if (context.industry === "saas_b2b" && answers.buyingStage === "ready") {
    score += 5;
    keySignals.push("industry-fit-saas");
  }
  if (context.industry === "agency_services" && answers.timeline === "soon") {
    score += 4;
    keySignals.push("agency-fast-launch");
  }

  if (redFlags.length > 0) score -= redFlags.length * 6;
  return clamp(score, 0, 100);
}


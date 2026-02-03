// app/generator/page.tsx
import GeneratorClient from "./generator-client";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { saveAnswersBySlug } from "@/app/lib/answers-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function saveLandingAction(slug: string, answers: QuestionnaireAnswers) {
  "use server";
  await saveAnswersBySlug(slug, answers);
  return { ok: true, slug };
}

export default function GeneratorPage() {
  return <GeneratorClient onSave={saveLandingAction} />;
}

"use client";

import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export default function CustomerPreviewClient({
  answers,
  slug,
}: {
  answers: QuestionnaireAnswers;
  slug: string;
}) {
  return (
    <LandingPagePreview
      answers={answers}
      slug={slug}
      mode="export"
      onEdit={() => {}}
    />
  );
}

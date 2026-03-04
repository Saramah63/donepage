"use client";

import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export default function CustomerPreviewClient({
  answers,
  slug,
  publishHint = null,
}: {
  answers: QuestionnaireAnswers;
  slug: string;
  publishHint?: "custom" | "subdomain" | null;
}) {
  return (
    <LandingPagePreview
      answers={answers}
      slug={slug}
      mode="preview"
      onEdit={() => {}}
      autoOpenPublish={publishHint === "custom" || publishHint === "subdomain"}
      publishHint={publishHint}
    />
  );
}

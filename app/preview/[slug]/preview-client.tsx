"use client";

import * as React from "react";
import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export default function PreviewClient({
  slug,
  version,
  answers,
}: {
  slug: string;
  version: number;
  answers: QuestionnaireAnswers;
}) {
  return (
    <div>
      {/* no action bar => mode="export" */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-gray-700">
          Preview: <span className="font-semibold">/{slug}</span> · Version{" "}
          <span className="font-semibold">v{version}</span>
        </div>
      </div>

      <LandingPagePreview answers={answers} onEdit={() => {}} mode="export" />
    </div>
  );
}

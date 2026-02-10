"use client";

import * as React from "react";
import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 text-sm text-gray-700">
          <div>
            Preview: <span className="font-semibold">/{slug}</span> · Version{" "}
            <span className="font-semibold">v{version}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/preview/${slug}?mode=draft`}>Preview Draft</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/preview/${slug}?mode=published`}>Preview Published</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/proposal/${slug}`}>View Proposal</Link>
            </Button>
          </div>
        </div>
      </div>

      <LandingPagePreview answers={answers} onEdit={() => {}} mode="export" />
    </div>
  );
}

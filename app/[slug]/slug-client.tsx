// app/[slug]/slug-client.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { LandingPagePreview } from "@/app/components/landing-page-preview";

export default function SlugClient({
  slug,
  initialAnswers,
}: {
  slug: string;
  initialAnswers: QuestionnaireAnswers | null;
}) {
  const router = useRouter();
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers | null>(initialAnswers);

  React.useEffect(() => {
    if (answers) return;

    const raw = localStorage.getItem(`landing:${slug}`);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { answers?: QuestionnaireAnswers };
      if (parsed?.answers) setAnswers(parsed.answers);
    } catch {
      // اگر JSON خراب بود، پاکش کن تا loop نشه
      try {
        localStorage.removeItem(`landing:${slug}`);
      } catch {}
    }
  }, [answers, slug]);

  if (!answers) {
    return (
      <div className="p-8">
        <p>Landing not found.</p>
        <button onClick={() => router.push("/generator")}>Back to generator</button>
      </div>
    );
  }

  return (
    <LandingPagePreview
      answers={answers}
      onEdit={() => router.push("/generator")}
      mode="preview"
    />
  );
}

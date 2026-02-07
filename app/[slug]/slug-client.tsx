// app/[slug]/slug-client.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { LandingPagePreview } from "@/app/components/landing-page-preview";

type ViewInfo = {
  mode: "published" | "draft" | "version";
  status: "draft" | "published";
  version: number | null;
};

export default function SlugClient({
  slug,
  initialAnswers,
  view,
}: {
  slug: string;
  initialAnswers: QuestionnaireAnswers | null;
  view: ViewInfo;
}) {
  const router = useRouter();
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers | null>(
    initialAnswers
  );

  // Fallback: localStorage only if nothing from server
  React.useEffect(() => {
    if (answers) return;

    const raw = localStorage.getItem(`landing:${slug}`);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { answers?: QuestionnaireAnswers };
      if (parsed?.answers) setAnswers(parsed.answers);
    } catch {
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

  const badge =
    view.mode === "published"
      ? `Published (v${view.version ?? "-"})`
      : view.mode === "draft"
      ? `Draft Preview${view.version ? ` (v${view.version})` : ""}`
      : `Version Preview (v${view.version ?? "-"})`;

  return (
    <div>
      {/* Minimal banner for clarity */}
      {view.mode !== "published" ? (
        <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
            <div className="text-xs font-medium text-gray-700">{badge}</div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => router.push(`/${slug}`)}
              >
                View Published
              </button>

              <button
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => router.push(`/generator?edit=${slug}`)}
              >
                Edit Draft
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <LandingPagePreview
        answers={answers}
        onEdit={() => router.push(`/generator?edit=${slug}`)}
        mode={view.mode === "published" ? "export" : "preview"}
      />
    </div>
  );
}

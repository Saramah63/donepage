"use client";

import * as React from "react";
import Link from "next/link";
import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { Button } from "@/app/components/ui/button";

export default function ProjectPreviewClient({
  projectId,
  token,
  plan,
  revisionsRemaining,
  portalUrl,
  answers,
}: {
  projectId: string;
  token: string;
  plan: "launch" | "growth";
  revisionsRemaining: number;
  portalUrl: string;
  answers: QuestionnaireAnswers;
}) {
  const [approving, setApproving] = React.useState(false);

  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("dp_instant_draft_opened", { detail: { projectId } })
    );
  }, [projectId]);

  const approvePublish = async () => {
    setApproving(true);
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, token }),
      });
      const data = await res.json();
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("dp_published", { detail: { projectId } }));
        if (data?.publishedUrl) window.location.href = data.publishedUrl;
      }
    } finally {
      setApproving(false);
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 px-4 py-3 text-sm text-gray-700 backdrop-blur dark:border-gray-700 dark:bg-slate-950/80 dark:text-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            Instant Draft · Plan: <span className="font-semibold capitalize">{plan}</span> · Revisions remaining: {revisionsRemaining}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`${portalUrl}#revision`}>Request revision</Link>
            </Button>
            <Button size="sm" onClick={approvePublish} disabled={approving}>
              {approving ? "Publishing..." : "Approve & publish"}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={portalUrl}>Back to portal</Link>
            </Button>
          </div>
        </div>
      </div>

      <LandingPagePreview
        answers={answers}
        onEdit={() => {}}
        mode="export"
        slug={projectId}
      />
    </div>
  );
}

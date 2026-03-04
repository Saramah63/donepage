"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Questionnaire,
  type QuestionnaireAnswers,
} from "@/app/components/questionnaire";

type Plan = "launch" | "growth";

export default function StartClient() {
  const params = useSearchParams();
  const router = useRouter();
  const plan =
    ((params.get("plan") || "launch").toLowerCase() === "growth"
      ? "growth"
      : "launch") as Plan;

  const [submitting, setSubmitting] = React.useState(false);

  const handleGenerate = async (answers: QuestionnaireAnswers) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("dp_questionnaire_submitted", {
            detail: { plan, projectId: data.projectId },
          })
        );
      }

      const next = data.submittedUrl || `/submitted?plan=${plan}&projectId=${data.projectId}&token=${encodeURIComponent(data.token)}`;
      router.push(next);
    } catch (error: any) {
      toast.error(error?.message || "Could not submit brief.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Questionnaire initialAnswers={{ language: "English" }} onGenerate={handleGenerate} />
      {submitting ? <div className="sr-only">Submitting</div> : null}
    </div>
  );
}

// app/App.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Questionnaire, type QuestionnaireAnswers } from "@/app/components/questionnaire";
import { LandingPagePreview } from "@/app/components/landing-page-preview";
import { Toaster } from "@/app/components/ui/sonner";
import { toast } from "sonner";
import { setPlan } from "@/app/lib/plan-store";

export default function App() {
  const [step, setStep] = useState<"form" | "preview">("form");

  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    serviceType: "consulting",
    targetAudience: "individuals",
    businessStage: "starting",
    primaryGoal: "leads",
    experienceLevel: "new",
    pricingApproach: "competitive",
    keyDifferentiator: "expertise",
    trustFactor: "certifications",
    includeAbout: "yes",
  });

  const normalize = (a: QuestionnaireAnswers): QuestionnaireAnswers => ({
    ...a,
    experienceLevel: a.experienceLevel as QuestionnaireAnswers["experienceLevel"],
    pricingApproach: a.pricingApproach as QuestionnaireAnswers["pricingApproach"],
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");
    if (!session_id) return;

    (async () => {
      try {
        const r = await fetch("/api/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id }),
        });

        if (!r.ok) {
          toast.error("Payment verification failed.");
          return;
        }

        const data = (await r.json()) as { ok?: boolean; plan?: "starter" | "business" | "pro" };

        if (data?.plan) setPlan(data.plan);

        // پاک کردن session_id از URL
        window.history.replaceState({}, "", "/");

        toast.success("Payment verified. Plan activated.");
      } catch {
        toast.error("Payment verification failed.");
      }
    })();
  }, []);

  const canPreview = useMemo(() => {
    // حداقل شرط منطقی برای اینکه preview ارزش داشته باشه
    return Boolean(answers?.serviceType && answers?.targetAudience && answers?.primaryGoal);
  }, [answers]);

  const langRaw = (answers as any)?.language?.toLowerCase?.() ?? "";
  const isRTL = langRaw.includes("arabic") || langRaw.includes("persian") || langRaw.includes("farsi");

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster richColors />

      {step === "form" && (
        <Questionnaire
          initialAnswers={answers}
          onChange={(a) => setAnswers(normalize(a))}
          onGenerate={(a) => {
            setAnswers(normalize(a));
            setStep("preview");
            toast.success("Landing page generated.");
          }}
        />
      )}

      {step === "preview" && canPreview && (
        <LandingPagePreview
          answers={answers}
          onEdit={() => setStep("form")}
          mode="preview"
        />
      )}
    </div>
  );
}

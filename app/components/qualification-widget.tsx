"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import type {
  Answers,
  BusinessContext,
  QualificationQuestion,
  QualificationResult,
} from "@/app/lib/qualification/types";
import { getTemplateByIndustry } from "@/app/lib/qualification/templates";
import { toast } from "sonner";

function saveDraft(slug: string, answers: Answers) {
  try {
    localStorage.setItem(`dq:qualify:${slug}:draft`, JSON.stringify(answers));
  } catch {}
}

function loadDraft(slug: string): Answers {
  try {
    const raw = localStorage.getItem(`dq:qualify:${slug}:draft`);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveResultHistory(slug: string, result: QualificationResult) {
  try {
    const key = "dq:qualify:history";
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const next = [{ slug, result, at: Date.now() }, ...(Array.isArray(list) ? list : [])].slice(0, 50);
    localStorage.setItem(key, JSON.stringify(next));
    localStorage.setItem(`dq:qualify:${slug}:lastResult`, JSON.stringify(result));
  } catch {}
}

function summaryText(result: QualificationResult) {
  return [
    `Fit score: ${result.fitScore}`,
    `Lead type: ${result.leadType}`,
    `Buying stage: ${result.buyingStage}`,
    `Budget: ${result.budgetBand}`,
    `Urgency: ${result.urgency}`,
    `Recommended package: ${result.recommendedPackage}`,
    `Next action: ${result.nextAction}`,
    `Why: ${result.rationaleShort}`,
  ].join("\n");
}

function downloadJson(slug: string, result: QualificationResult) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qualification-${slug}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyText(value: string) {
  navigator.clipboard.writeText(value).then(
    () => toast.success("Summary copied"),
    () => toast.error("Copy failed")
  );
}

function StepRenderer({
  question,
  value,
  onChange,
}: {
  question: QualificationQuestion;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{question.label}</div>
      <div className="space-y-2">
        {question.options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "w-full rounded-xl border px-3 py-2 text-left text-sm",
                selected
                  ? "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-200"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:border-blue-700 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultView({
  slug,
  result,
}: {
  slug: string;
  result: QualificationResult;
}) {
  const summary = summaryText(result);
  const subject = encodeURIComponent(`Qualification summary for ${slug}`);
  const body = encodeURIComponent(summary);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-900">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Qualification Result</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-200">
          <div>Fit Score: {result.fitScore}</div>
          <div>Lead: {result.leadType}</div>
          <div>Stage: {result.buyingStage}</div>
          <div>Budget: {result.budgetBand}</div>
          <div>Urgency: {result.urgency}</div>
          <div>Package: {result.recommendedPackage}</div>
        </div>
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-300">{result.rationaleShort}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => copyText(summary)}>
          Copy summary
        </Button>
        <Button size="sm" variant="outline" onClick={() => downloadJson(slug, result)}>
          Download JSON
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a href={`mailto:?subject=${subject}&body=${body}`}>Send via email</a>
        </Button>
      </div>
    </div>
  );
}

export function QualificationTrigger({
  slug,
  context,
}: {
  slug: string;
  context: BusinessContext;
}) {
  const template = React.useMemo(() => getTemplateByIndustry(context.industry), [context.industry]);
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<QualificationResult | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setAnswers(loadDraft(slug));
    setResult(null);
    setStep(0);
  }, [open, slug]);

  const current = template.questions[step];
  const currentValue = typeof answers[current?.id] === "string" ? (answers[current.id] as string) : "";
  const canNext = Boolean(currentValue);
  const lastStep = step >= template.questions.length - 1;

  const updateAnswer = (id: string, value: string) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    saveDraft(slug, next);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          context,
          answers,
          email: email || undefined,
          consentToStore: consent,
          visitor: { userAgent: navigator.userAgent },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Qualification failed");
      setResult(data.result as QualificationResult);
      saveResultHistory(slug, data.result as QualificationResult);
    } catch (e: any) {
      toast.error(e?.message || "Qualification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="lg" variant="outline" onClick={() => setOpen(true)} className="card-lift">
        Check fit in 60 seconds
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{template.title}</DialogTitle>
          </DialogHeader>

          {result ? (
            <ResultView slug={slug} result={result} />
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Step {step + 1} / {template.questions.length}
              </div>

              <StepRenderer
                question={current}
                value={currentValue}
                onChange={(value) => updateAnswer(current.id, value)}
              />

              {lastStep ? (
                <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-slate-900">
                  <div className="text-xs text-gray-700 dark:text-gray-200">Email (optional)</div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    I agree to store my email for follow-up.
                  </label>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0 || loading}
                >
                  Back
                </Button>

                {lastStep ? (
                  <Button type="button" onClick={submit} disabled={!canNext || loading}>
                    {loading ? "Calculating..." : "Submit & get result"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setStep((s) => Math.min(template.questions.length - 1, s + 1))}
                    disabled={!canNext || loading}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

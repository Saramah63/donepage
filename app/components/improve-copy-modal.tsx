"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

type ImproveField = "headline" | "subheadline" | "benefits" | "cta";

type Suggestion = {
  headline?: string;
  subheadline?: string;
  benefits?: string[];
  ctaText?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  token: string;
  original: {
    headline: string;
    subheadline: string;
    benefits: { title: string; description: string }[];
    ctaText: string;
  };
  onApply: (patch: {
    headline?: string;
    subheadline?: string;
    benefits?: { title: string; description: string }[];
    ctaText?: string;
  }) => void;
};

export default function ImproveCopyModal({
  open,
  onClose,
  projectId,
  token,
  original,
  onApply,
}: Props) {
  const [fields, setFields] = React.useState<ImproveField[]>([
    "headline",
    "subheadline",
    "benefits",
    "cta",
  ]);
  const [loading, setLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<Suggestion | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setSuggestion(null);
    setLoading(false);
    setFields(["headline", "subheadline", "benefits", "cta"]);
  }, [open]);

  const toggleField = (field: ImproveField) => {
    setFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const generate = async () => {
    if (fields.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/improve-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, token, fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to improve copy");
      setSuggestion(data);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    originalText: React.ReactNode,
    suggestedText: React.ReactNode,
    onUse: () => void
  ) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <div className="font-semibold">{label}</div>
      <div className="mt-2 text-xs text-gray-500">Original</div>
      <div className="mt-1">{originalText}</div>
      <div className="mt-3 text-xs text-gray-500">Suggested</div>
      <div className="mt-1">{suggestedText}</div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={onUse}>
          Use suggestion
        </Button>
        <Button size="sm" variant="outline">
          Keep original
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Improve your landing page copy</DialogTitle>
          <DialogDescription>
            Donepage can refine your headline, benefits, and call-to-action to make your page
            clearer and more persuasive.
          </DialogDescription>
        </DialogHeader>

        {!suggestion ? (
          <div className="space-y-4">
            <div className="grid gap-2 text-sm">
              {(["headline", "subheadline", "benefits", "cta"] as ImproveField[]).map((f) => (
                <label key={f} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={fields.includes(f)}
                    onChange={() => toggleField(f)}
                  />
                  <span>
                    {f === "cta" ? "Improve CTA" : `Improve ${f}`}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={generate} disabled={loading || fields.length === 0}>
                {loading ? "Generating…" : "Generate improvements"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestion.headline
              ? renderField(
                  "Headline",
                  original.headline,
                  suggestion.headline,
                  () => onApply({ headline: suggestion.headline })
                )
              : null}
            {suggestion.subheadline
              ? renderField(
                  "Subheadline",
                  original.subheadline,
                  suggestion.subheadline,
                  () => onApply({ subheadline: suggestion.subheadline })
                )
              : null}
            {suggestion.benefits
              ? renderField(
                  "Benefits",
                  <ul className="list-disc pl-5">
                    {original.benefits.map((b, i) => (
                      <li key={`${b.title}-${i}`}>{b.description}</li>
                    ))}
                  </ul>,
                  <ul className="list-disc pl-5">
                    {suggestion.benefits.map((b, i) => (
                      <li key={`${b}-${i}`}>{b}</li>
                    ))}
                  </ul>,
                  () =>
                    onApply({
                      benefits: original.benefits.map((b, i) => ({
                        title: b.title,
                        description: suggestion.benefits?.[i] || b.description,
                      })),
                    })
                )
              : null}
            {suggestion.ctaText
              ? renderField(
                  "CTA",
                  original.ctaText,
                  suggestion.ctaText,
                  () => onApply({ ctaText: suggestion.ctaText })
                )
              : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { Button } from "@/app/components/ui/button";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function PreviewClient({
  slug,
  version,
  answers,
  requestedMode = "draft",
  usedDraftFallback = false,
}: {
  slug: string;
  version: number;
  answers: QuestionnaireAnswers;
  requestedMode?: "draft" | "published";
  usedDraftFallback?: boolean;
}) {
  const searchParams = useSearchParams();
  const [token, setToken] = React.useState(searchParams.get("token") || "");
  const publishMode = searchParams.get("publish");
  const langRaw = (answers as any)?.language?.toLowerCase?.() ?? "";
  const isRTL = langRaw.includes("arabic") || langRaw.includes("persian") || langRaw.includes("farsi");
  const [draftAnswers, setDraftAnswers] = React.useState<QuestionnaireAnswers>(answers);
  const [saving, setSaving] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<
    "hero" | "services" | "trust" | "about" | "contact" | "cta" | "portfolio"
  >("hero");

  React.useEffect(() => {
    setDraftAnswers(answers);
  }, [answers]);

  React.useEffect(() => {
    const urlToken = searchParams.get("token") || "";
    if (urlToken) {
      setToken(urlToken);
      try {
        localStorage.setItem(`dp:edit-token:${slug}`, urlToken);
      } catch {}
      return;
    }
    try {
      const localToken = localStorage.getItem(`dp:edit-token:${slug}`) || "";
      if (localToken) setToken(localToken);
    } catch {}
  }, [searchParams, slug]);

  const update = <K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) => {
    setDraftAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveDraftChanges = async () => {
    setSaving(true);
    try {
      // Always keep a local fallback.
      localStorage.setItem(
        `landing:${slug}`,
        JSON.stringify({
          answers: draftAnswers,
          updatedAt: Date.now(),
          createdAt: Date.now(),
        })
      );

      if (token) {
        const res = await fetch("/api/versions/save-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            token,
            answers: draftAnswers,
            note: "Quick edit from preview draft",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Save failed");
        toast.success(`Draft saved as v${data.version}`);
      } else {
        toast.error("No edit token found. Regenerate once to enable direct server save.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save draft changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {requestedMode === "published" && usedDraftFallback ? (
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
            Published version not found. Showing latest draft fallback for now.
          </div>
        </div>
      ) : null}

      {showEditor ? (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-slate-900">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Edit answers (changes update the preview below)
              </div>
              <Button
                size="sm"
                onClick={saveDraftChanges}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "hero", label: "Hero" },
                { id: "services", label: "Services" },
                { id: "trust", label: "Trust" },
                { id: "about", label: "About" },
                { id: "contact", label: "Contact" },
                { id: "cta", label: "CTA" },
                { id: "portfolio", label: "Portfolio" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id as typeof activeSection)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    activeSection === s.id
                      ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-200 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200">
            <div className="mb-2 font-semibold">Jump to section in preview</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => scrollToSection("hero")}>Hero</Button>
              <Button size="sm" variant="outline" onClick={() => scrollToSection("why-choose-us")}>Why Choose Us</Button>
              <Button size="sm" variant="outline" onClick={() => scrollToSection("services")}>Services</Button>
              <Button size="sm" variant="outline" onClick={() => scrollToSection("packages")}>Packages</Button>
              <Button size="sm" variant="outline" onClick={() => scrollToSection("portfolio")}>Portfolio</Button>
              <Button size="sm" variant="outline" onClick={() => scrollToSection("contact")}>Contact</Button>
            </div>
          </div>

          {activeSection === "hero" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={draftAnswers.businessName ?? ""}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="Business name"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.primaryOffer ?? ""}
                onChange={(e) => update("primaryOffer", e.target.value)}
                placeholder="Primary offer"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <textarea
                value={draftAnswers.problemStatement ?? ""}
                onChange={(e) => update("problemStatement", e.target.value)}
                placeholder="Problem statement"
                className="min-h-[90px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <textarea
                value={draftAnswers.outcomeStatement ?? ""}
                onChange={(e) => update("outcomeStatement", e.target.value)}
                placeholder="Outcome statement"
                className="min-h-[90px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
            </div>
          ) : null}

          {activeSection === "services" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <textarea
                value={draftAnswers.customServices ?? ""}
                onChange={(e) => update("customServices", e.target.value)}
                placeholder="Service/package lines (Title | Description | Metric)"
                className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <div className="grid gap-3">
                <input
                  value={draftAnswers.processStep1 ?? ""}
                  onChange={(e) => update("processStep1", e.target.value)}
                  placeholder="Process step 1"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
                />
                <input
                  value={draftAnswers.processStep2 ?? ""}
                  onChange={(e) => update("processStep2", e.target.value)}
                  placeholder="Process step 2"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
                />
                <input
                  value={draftAnswers.processStep3 ?? ""}
                  onChange={(e) => update("processStep3", e.target.value)}
                  placeholder="Process step 3"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
                />
              </div>
            </div>
          ) : null}

          {activeSection === "trust" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={draftAnswers.proofLine ?? ""}
                onChange={(e) => update("proofLine", e.target.value)}
                placeholder="Proof line"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.ratingValue ?? ""}
                onChange={(e) => update("ratingValue", e.target.value)}
                placeholder="Rating value (e.g. 4.9/5)"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.clientsCount ?? ""}
                onChange={(e) => update("clientsCount", e.target.value)}
                placeholder="Clients count (e.g. 120+)"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.yearsExp ?? ""}
                onChange={(e) => update("yearsExp", e.target.value)}
                placeholder="Years experience (e.g. 8)"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
            </div>
          ) : null}

          {activeSection === "about" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={draftAnswers.includeAbout ?? "yes"}
                onChange={(e) => update("includeAbout", e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              >
                <option value="yes">Include About section</option>
                <option value="no">Hide About section</option>
              </select>
              <input
                value={draftAnswers.niche ?? ""}
                onChange={(e) => update("niche", e.target.value)}
                placeholder="Niche / industry"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <textarea
                value={draftAnswers.aboutText ?? ""}
                onChange={(e) => update("aboutText", e.target.value)}
                placeholder="About text"
                className="min-h-[110px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.aboutImageUrl ?? ""}
                onChange={(e) => update("aboutImageUrl", e.target.value)}
                placeholder="About image/video URL"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
            </div>
          ) : null}

          {activeSection === "contact" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={draftAnswers.contactEmail ?? ""}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="Contact email"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.bookingLink ?? ""}
                onChange={(e) => update("bookingLink", e.target.value)}
                placeholder="Booking link"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.whatsApp ?? ""}
                onChange={(e) => update("whatsApp", e.target.value)}
                placeholder="WhatsApp number"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
            </div>
          ) : null}

          {activeSection === "cta" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={draftAnswers.ctaPrimaryLabel ?? ""}
                onChange={(e) => update("ctaPrimaryLabel", e.target.value)}
                placeholder="Primary CTA label"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <input
                value={draftAnswers.ctaSecondaryLabel ?? ""}
                onChange={(e) => update("ctaSecondaryLabel", e.target.value)}
                placeholder="Secondary CTA label"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
            </div>
          ) : null}

          {activeSection === "portfolio" ? (
            <div className="grid gap-3">
              <textarea
                value={draftAnswers.portfolioItemsJson ?? ""}
                onChange={(e) => update("portfolioItemsJson", e.target.value)}
                placeholder='Portfolio JSON array with title/description/metric/imageUrl'
                className="min-h-[130px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Example: [{`{"title":"Project A","description":"...","metric":"4.9/5","imageUrl":"https://..."}`}]
              </div>
            </div>
          ) : null}
        </div>
      </div>
      ) : null}

      <LandingPagePreview
        answers={draftAnswers}
        onEdit={() => setShowEditor(true)}
        mode="preview"
        slug={slug}
        autoOpenPublish={publishMode === "custom" || publishMode === "subdomain"}
        publishHint={
          publishMode === "custom" ? "custom" : publishMode === "subdomain" ? "subdomain" : null
        }
      />
    </div>
  );
}

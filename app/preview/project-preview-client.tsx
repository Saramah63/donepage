"use client";

import * as React from "react";
import Link from "next/link";
import { TemplateRenderer } from "@/app/components/landing-page-templates";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { Button } from "@/app/components/ui/button";
import PublishGateModal from "@/app/components/publish-gate-modal";
import ImproveCopyModal from "@/app/components/improve-copy-modal";
import TemplateChooserModal from "@/app/components/template-chooser-modal";
import type { DraftContent, DraftBenefit, DraftFaqItem } from "@/app/lib/draft-content";
import { draftToOverrides } from "@/app/lib/draft-content";

type Project = {
  id: string;
  plan: "launch" | "growth";
  paymentStatus: "unpaid" | "paid";
  publishStatus: "draft" | "approved" | "publishing" | "published";
  publishTarget?: "subdomain" | "custom_domain" | null;
  dnsStatus: "not_started" | "pending" | "verified";
  templateId?: "A" | "B" | "C";
  previewUrl: string;
  publishedUrl?: string | null;
  domain?: string | null;
  humanEtaDate: string;
  revisionsAllowed: number;
  revisionsUsed: number;
  draftContent?: DraftContent | null;
};

export default function ProjectPreviewClient({
  project,
  token,
  revisionsRemaining,
  portalUrl,
  answers,
}: {
  project: Project;
  token: string;
  revisionsRemaining: number;
  portalUrl: string;
  answers: QuestionnaireAnswers;
}) {
  const [showPublish, setShowPublish] = React.useState(false);
  const [showImprove, setShowImprove] = React.useState(false);
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [activeTemplate, setActiveTemplate] = React.useState<"A" | "B" | "C">(
    project.templateId || "A"
  );
  const [savedTemplate, setSavedTemplate] = React.useState<"A" | "B" | "C">(
    project.templateId || "A"
  );
  const [draft, setDraft] = React.useState<DraftContent>(() => ({
    answers: (project.draftContent?.answers || answers) as QuestionnaireAnswers,
    hero: project.draftContent?.hero,
    benefits: project.draftContent?.benefits,
    cta: project.draftContent?.cta,
    contact: project.draftContent?.contact,
    faq: project.draftContent?.faq,
  }));
  const overrides = React.useMemo(
    () => draftToOverrides(draft, project.draftContent?.overrides),
    [draft, project.draftContent?.overrides]
  );
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);
  const pendingRef = React.useRef(
    new Map<
      string,
      { section: string; field: string; value: any; index?: number }
    >()
  );
  const [saveNonce, setSaveNonce] = React.useState(0);

  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("dp_instant_draft_opened", { detail: { projectId: project.id } })
    );
  }, [project.id]);

  React.useEffect(() => {
    setDraft({
      answers: (project.draftContent?.answers || answers) as QuestionnaireAnswers,
      hero: project.draftContent?.hero,
      benefits: project.draftContent?.benefits,
      cta: project.draftContent?.cta,
      contact: project.draftContent?.contact,
      faq: project.draftContent?.faq,
    });
    const nextTemplate = project.templateId || "A";
    setActiveTemplate(nextTemplate);
    setSavedTemplate(nextTemplate);
  }, [project.id, project.draftContent, answers]);

  const baseAnswers = (draft.answers || answers) as QuestionnaireAnswers;

  const queueUpdate = (section: string, field: string, value: any, index?: number) => {
    const key = `${section}:${field}:${index ?? ""}`;
    pendingRef.current.set(key, { section, field, value, index });
    setSaveNonce((n) => n + 1);
  };

  const updateDraft = (section: string, field: string, value: any, index?: number) => {
    setDraft((prev) => {
      const next: DraftContent = { ...prev };
      if (section === "hero") {
        next.hero = { ...(next.hero || {}) };
        (next.hero as any)[field] = value;
      } else if (section === "cta") {
        next.cta = { ...(next.cta || {}) };
        (next.cta as any)[field] = value;
      } else if (section === "contact") {
        next.contact = { ...(next.contact || {}) };
        (next.contact as any)[field] = value;
      } else if (section === "benefits") {
        const list = (next.benefits || []).slice() as DraftBenefit[];
        if (field === "items" && Array.isArray(value)) {
          next.benefits = value;
        } else {
          const idx = typeof index === "number" ? index : 0;
          list[idx] = {
            title: field === "title" ? value : list[idx]?.title || "",
            description: field === "description" ? value : list[idx]?.description || "",
          };
          next.benefits = list;
        }
      } else if (section === "faq") {
        const list = (next.faq || []).slice() as DraftFaqItem[];
        if (field === "items" && Array.isArray(value)) {
          next.faq = value;
        } else {
          const idx = typeof index === "number" ? index : 0;
          list[idx] = {
            question: field === "question" ? value : list[idx]?.question || "",
            answer: field === "answer" ? value : list[idx]?.answer || "",
          };
          next.faq = list;
        }
      }
      return next;
    });

    queueUpdate(section, field, value, index);
    window.dispatchEvent(
      new CustomEvent("dp_draft_edited", { detail: { projectId: project.id, field } })
    );
  };

  React.useEffect(() => {
    if (pendingRef.current.size === 0) return;
    const handler = setTimeout(async () => {
      setSaving(true);
      const updates = Array.from(pendingRef.current.values());
      pendingRef.current.clear();
      try {
        for (const update of updates) {
          await fetch("/api/draft/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId: project.id,
              token,
              ...update,
            }),
          });
        }
        setSavedAt(new Date().toLocaleTimeString());
      } finally {
        setSaving(false);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [saveNonce, project.id, token]);

  const resetSection = (section: "hero" | "benefits" | "cta" | "contact" | "faq") => {
    setDraft((prev) => {
      const next: DraftContent = { ...prev };
      if (section === "hero") delete next.hero;
      if (section === "benefits") delete next.benefits;
      if (section === "cta") delete next.cta;
      if (section === "contact") delete next.contact;
      if (section === "faq") delete next.faq;
      return next;
    });
    queueUpdate(section, "__reset__", null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map((v) => Number(v));
    if (!y || !m || !d) return dateStr;
    const date = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Helsinki",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 px-4 py-3 text-sm text-gray-700 backdrop-blur dark:border-gray-700 dark:bg-slate-950/80 dark:text-gray-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Preview Mode</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              This page is currently a draft and not publicly accessible.
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowImprove(true)}>
              Improve My Page
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowTemplates(true)}>
              Try another layout
            </Button>
            <Button size="sm" onClick={() => setShowPublish(true)}>
              Publish
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={portalUrl}>Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6">
        <div className="min-w-0 flex-1">
          <TemplateRenderer
            answers={baseAnswers}
            onEdit={() => {}}
            mode="export"
            slug={project.id}
            overrides={overrides}
            onInlineEdit={updateDraft}
            templateId={activeTemplate}
          />
        </div>

        <aside className="hidden w-[280px] flex-shrink-0 md:block">
          <div className="sticky top-20 space-y-4 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200">
            <div className="text-sm font-semibold">Project</div>
            <div>Plan: <span className="font-semibold capitalize">{project.plan}</span></div>
            <div>Revisions remaining: <span className="font-semibold">{revisionsRemaining}</span></div>
            <div>Human polish ETA: <span className="font-semibold">{formatDate(project.humanEtaDate)}</span></div>
            <div>Payment: <span className={project.paymentStatus === "paid" ? "font-semibold text-green-600" : "font-semibold text-amber-600"}>{project.paymentStatus}</span></div>
            <div className="text-xs text-gray-500">{saving ? "Saving..." : savedAt ? `Saved ${savedAt}` : "Autosave enabled"}</div>

            <div className="mt-3 space-y-2">
              <Button size="sm" variant="outline" asChild className="w-full">
                <Link href={`${portalUrl}#revision`}>Request revision</Link>
              </Button>
              <Button size="sm" className="w-full" onClick={() => setShowPublish(true)}>
                Publish
              </Button>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="text-xs font-semibold text-gray-500">Reset sections</div>
              <div className="mt-2 grid gap-2">
                <Button size="sm" variant="outline" onClick={() => resetSection("hero")}>Reset hero</Button>
                <Button size="sm" variant="outline" onClick={() => resetSection("benefits")}>Reset benefits</Button>
                <Button size="sm" variant="outline" onClick={() => resetSection("cta")}>Reset CTA</Button>
                <Button size="sm" variant="outline" onClick={() => resetSection("contact")}>Reset contact</Button>
                <Button size="sm" variant="outline" onClick={() => resetSection("faq")}>Reset FAQ</Button>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="text-xs font-semibold text-gray-500">Quick edits</div>
              <div className="mt-2 space-y-2 text-xs">
                <label className="block">
                  CTA link
                  <input
                    value={draft.cta?.buttonLink || ""}
                    onChange={(e) => updateDraft("cta", "buttonLink", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  Contact email
                  <input
                    value={draft.contact?.email || ""}
                    onChange={(e) => updateDraft("contact", "email", e.target.value)}
                    placeholder="hello@domain.com"
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  Booking link
                  <input
                    value={draft.contact?.bookingLink || ""}
                    onChange={(e) => updateDraft("contact", "bookingLink", e.target.value)}
                    placeholder="https://cal.com/..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  WhatsApp link
                  <input
                    value={draft.contact?.whatsapp || ""}
                    onChange={(e) => updateDraft("contact", "whatsapp", e.target.value)}
                    placeholder="https://wa.me/..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  Phone
                  <input
                    value={draft.contact?.phone || ""}
                    onChange={(e) => updateDraft("contact", "phone", e.target.value)}
                    placeholder="+358..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  Telegram
                  <input
                    value={draft.contact?.telegram || ""}
                    onChange={(e) => updateDraft("contact", "telegram", e.target.value)}
                    placeholder="https://t.me/..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  Instagram
                  <input
                    value={draft.contact?.instagram || ""}
                    onChange={(e) => updateDraft("contact", "instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
              </div>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateDraft("faq", "items", [
                      ...(draft.faq || []),
                      { question: "FAQ question", answer: "FAQ answer" },
                    ])
                  }
                >
                  Add FAQ item
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateDraft("benefits", "items", [
                      ...(draft.benefits || []),
                      { title: "Benefit title", description: "Benefit description" },
                    ])
                  }
                >
                  Add benefit
                </Button>
              </div>
              <div className="mt-2 grid gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!draft.faq || draft.faq.length === 0}
                  onClick={() =>
                    updateDraft("faq", "items", (draft.faq || []).slice(0, -1))
                  }
                >
                  Remove last FAQ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!draft.benefits || draft.benefits.length === 0}
                  onClick={() =>
                    updateDraft("benefits", "items", (draft.benefits || []).slice(0, -1))
                  }
                >
                  Remove last benefit
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <PublishGateModal
        open={showPublish}
        onClose={() => setShowPublish(false)}
        token={token}
        project={project}
        draftContent={draft}
        onPublished={(url) => {
          window.dispatchEvent(new CustomEvent("dp_published", { detail: { projectId: project.id } }));
          if (url) window.location.href = url;
        }}
      />

      <ImproveCopyModal
        open={showImprove}
        onClose={() => setShowImprove(false)}
        projectId={project.id}
        token={token}
        original={{
          headline: draft.hero?.headline || "",
          subheadline: draft.hero?.subheadline || "",
          benefits: draft.benefits || [],
          ctaText: draft.hero?.ctaText || draft.cta?.buttonText || "",
        }}
        onApply={(patch) => {
          if (patch.headline) updateDraft("hero", "headline", patch.headline);
          if (patch.subheadline) updateDraft("hero", "subheadline", patch.subheadline);
          if (patch.ctaText) updateDraft("hero", "ctaText", patch.ctaText);
          if (patch.benefits) updateDraft("benefits", "items", patch.benefits);
          setShowImprove(false);
        }}
      />

      <TemplateChooserModal
        open={showTemplates}
        onClose={() => {
          setActiveTemplate(savedTemplate);
          setShowTemplates(false);
        }}
        current={activeTemplate}
        onPreview={(id) => setActiveTemplate(id)}
        onUse={async (id) => {
          setActiveTemplate(id);
          await fetch("/api/template/set", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId: project.id, token, templateId: id }),
          });
          setSavedTemplate(id);
          setShowTemplates(false);
        }}
      />
    </div>
  );
}

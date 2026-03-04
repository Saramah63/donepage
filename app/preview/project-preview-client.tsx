"use client";

import * as React from "react";
import Link from "next/link";
import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import { Button } from "@/app/components/ui/button";
import PublishGateModal from "@/app/components/publish-gate-modal";
import type { DraftContent, DraftOverrides, DraftBenefit, DraftFaqItem } from "@/app/lib/draft-content";

type Project = {
  id: string;
  plan: "launch" | "growth";
  paymentStatus: "unpaid" | "paid";
  publishStatus: "draft" | "approved" | "publishing" | "published";
  publishTarget?: "subdomain" | "custom_domain" | null;
  dnsStatus: "not_started" | "pending" | "verified";
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
  const [overrides, setOverrides] = React.useState<DraftOverrides>(
    project.draftContent?.overrides || {}
  );
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("dp_instant_draft_opened", { detail: { projectId: project.id } })
    );
  }, [project.id]);

  const baseAnswers = (project.draftContent?.answers || answers) as QuestionnaireAnswers;

  const updateOverride = (field: string, value: string, index?: number) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (field.startsWith("benefits.")) {
        const list = (prev.benefits ? [...prev.benefits] : []) as DraftBenefit[];
        const idx = typeof index === "number" ? index : 0;
        list[idx] = {
          title: field.endsWith(".title") ? value : list[idx]?.title || "",
          description: field.endsWith(".description") ? value : list[idx]?.description || "",
        };
        next.benefits = list;
        return next;
      }
      if (field.startsWith("faq.")) {
        const list = (prev.faq ? [...prev.faq] : []) as DraftFaqItem[];
        const idx = typeof index === "number" ? index : 0;
        list[idx] = {
          question: field.endsWith(".question") ? value : list[idx]?.question || "",
          answer: field.endsWith(".answer") ? value : list[idx]?.answer || "",
        };
        next.faq = list;
        return next;
      }
      (next as any)[field] = value;
      return next;
    });

    window.dispatchEvent(
      new CustomEvent("dp_draft_edited", { detail: { projectId: project.id, field } })
    );
  };

  React.useEffect(() => {
    const handler = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch("/api/draft/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: project.id,
            token,
            patch: { overrides },
          }),
        });
        setSavedAt(new Date().toLocaleTimeString());
      } finally {
        setSaving(false);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [overrides, project.id, token]);

  const resetSection = (section: "hero" | "benefits" | "cta" | "contact" | "faq") => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (section === "hero") {
        delete next.heroHeadline;
        delete next.heroSubheadline;
        delete next.heroPrimaryCTA;
        delete next.heroSecondaryCTA;
      }
      if (section === "benefits") {
        delete next.benefits;
      }
      if (section === "cta") {
        delete next.ctaHeadline;
        delete next.ctaSubheadline;
        delete next.ctaButtonText;
        delete next.ctaButtonUrl;
      }
      if (section === "contact") {
        delete next.contactTitle;
        delete next.contactSubtitle;
        delete next.contactEmail;
        delete next.contactPhone;
        delete next.contactWhatsApp;
        delete next.contactBookingLink;
      }
      if (section === "faq") {
        delete next.faq;
      }
      return next;
    });
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
          <LandingPagePreview
            answers={baseAnswers}
            onEdit={() => {}}
            mode="export"
            slug={project.id}
            overrides={overrides}
            onInlineEdit={updateOverride}
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
                    value={overrides.ctaButtonUrl || ""}
                    onChange={(e) => updateOverride("ctaButtonUrl", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  Contact email
                  <input
                    value={overrides.contactEmail || ""}
                    onChange={(e) => updateOverride("contactEmail", e.target.value)}
                    placeholder="hello@domain.com"
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  Booking link
                  <input
                    value={overrides.contactBookingLink || ""}
                    onChange={(e) => updateOverride("contactBookingLink", e.target.value)}
                    placeholder="cal.com/..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
                <label className="block">
                  WhatsApp link
                  <input
                    value={overrides.contactWhatsApp || ""}
                    onChange={(e) => updateOverride("contactWhatsApp", e.target.value)}
                    placeholder="wa.me/..."
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100"
                  />
                </label>
              </div>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setOverrides((prev) => ({
                      ...prev,
                      faq: [...(prev.faq || []), { question: "FAQ question", answer: "FAQ answer" }],
                    }))
                  }
                >
                  Add FAQ item
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
        onPublished={(url) => {
          window.dispatchEvent(new CustomEvent("dp_published", { detail: { projectId: project.id } }));
          if (url) window.location.href = url;
        }}
      />
    </div>
  );
}

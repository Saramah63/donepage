"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Questionnaire, type QuestionnaireAnswers } from "@/app/components/questionnaire";
import { Button } from "@/app/components/ui/button";

type VersionMeta = {
  version: number;
  status: "draft" | "published";
  createdAt: number;
  publishedAt?: number;
  note?: string;
};

export default function EditClient({
  slug,
  token,
  initialAnswers,
}: {
  slug: string;
  token: string;
  initialAnswers: QuestionnaireAnswers;
}) {
  const router = useRouter();

  const [answers, setAnswers] = React.useState<QuestionnaireAnswers>(initialAnswers);
  const [loadingVersions, setLoadingVersions] = React.useState(false);
  const [savingDraft, setSavingDraft] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [rolling, setRolling] = React.useState(false);

  const [versions, setVersions] = React.useState<VersionMeta[]>([]);
  const [pointers, setPointers] = React.useState<{ draftVersion: number | null; publishedVersion: number | null }>({
    draftVersion: null,
    publishedVersion: null,
  });

  const [selectedVersion, setSelectedVersion] = React.useState<number | null>(null);

  async function fetchVersions() {
    setLoadingVersions(true);
    try {
      const res = await fetch(`/api/versions/list?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load versions");
      setVersions(data.versions || []);
      setPointers(data.pointers || { draftVersion: null, publishedVersion: null });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load versions");
    } finally {
      setLoadingVersions(false);
    }
  }

  React.useEffect(() => {
    fetchVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function saveDraft(note?: string) {
    setSavingDraft(true);
    try {
      const res = await fetch("/api/versions/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token, answers, note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Save draft failed");

      setPointers(data.pointers);
      setVersions(data.versions);
      toast.success(`Draft saved as v${data.version}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Save draft failed");
    } finally {
      setSavingDraft(false);
    }
  }

  async function publish(version?: number) {
    setPublishing(true);
    try {
      const res = await fetch("/api/versions/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token, version }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Publish failed");

      setPointers(data.pointers);
      setVersions(data.versions);
      toast.success(`Published v${data.version}`);
      router.push(`/${slug}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  async function rollback(version: number, publishAlso: boolean) {
    setRolling(true);
    try {
      const res = await fetch("/api/versions/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token, version, publishAlso }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Rollback failed");

      setPointers(data.pointers);
      toast.success(
        publishAlso ? `Rolled back and published v${version}` : `Draft set to v${version}`
      );

      // open preview of that version to confirm
      window.open(`/preview/${slug}?token=${encodeURIComponent(token)}&v=${version}`, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Rollback failed");
    } finally {
      setRolling(false);
    }
  }

  function openDraftPreview() {
    window.open(`/preview/${slug}?token=${encodeURIComponent(token)}&mode=draft`, "_blank");
  }

  function openPublishedPreview() {
    window.open(`/preview/${slug}?token=${encodeURIComponent(token)}&mode=published`, "_blank");
  }

  const draftV = pointers.draftVersion;
  const publishedV = pointers.publishedVersion;

  return (
    <div>
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="text-sm">
            <div className="font-semibold text-gray-900">Editing: /{slug}</div>
            <div className="text-xs text-gray-500">
              Draft: {draftV ? `v${draftV}` : "—"} · Published: {publishedV ? `v${publishedV}` : "—"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => router.push(`/${slug}`)} className="border-gray-300 bg-white hover:bg-gray-50">
              Public Page
            </Button>

            <Button variant="outline" onClick={openDraftPreview} className="border-gray-300 bg-white hover:bg-gray-50">
              Preview Draft
            </Button>

            <Button variant="outline" onClick={openPublishedPreview} className="border-gray-300 bg-white hover:bg-gray-50">
              Preview Published
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open(`/proposal/${slug}/edit?token=${encodeURIComponent(token)}`, "_blank")}
              className="border-gray-300 bg-white hover:bg-gray-50"
            >
              Create Proposal
            </Button>

            <Button
              onClick={() => saveDraft("Manual draft save")}
              disabled={savingDraft}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
            >
              {savingDraft ? "Saving…" : "Save Draft"}
            </Button>

            <Button
              onClick={() => publish()} // publish current draft pointer
              disabled={publishing || !draftV}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
            >
              {publishing ? "Publishing…" : "Publish Draft"}
            </Button>
          </div>
        </div>

        {/* Versions strip */}
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Button
              variant="outline"
              onClick={fetchVersions}
              disabled={loadingVersions}
              className="h-8 border-gray-300 bg-white hover:bg-gray-50"
            >
              {loadingVersions ? "Loading…" : "Refresh Versions"}
            </Button>

            {versions.slice(0, 10).map((v) => {
              const isDraft = v.version === draftV;
              const isPub = v.version === publishedV;
              const active = selectedVersion === v.version;

              return (
                <button
                  key={v.version}
                  onClick={() => setSelectedVersion(v.version)}
                  className={[
                    "h-8 rounded-full border px-3",
                    active ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white",
                  ].join(" ")}
                >
                  v{v.version}
                  {isPub ? " · published" : ""}
                  {isDraft ? " · draft" : ""}
                </button>
              );
            })}

            {selectedVersion ? (
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`/preview/${slug}?token=${encodeURIComponent(token)}&v=${selectedVersion}`, "_blank")}
                  className="h-8 border-gray-300 bg-white hover:bg-gray-50"
                >
                  Preview v{selectedVersion}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => rollback(selectedVersion, false)}
                  disabled={rolling}
                  className="h-8 border-gray-300 bg-white hover:bg-gray-50"
                >
                  {rolling ? "…" : `Set Draft = v${selectedVersion}`}
                </Button>

                <Button
                  onClick={() => rollback(selectedVersion, true)}
                  disabled={rolling}
                  className="h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                >
                  {rolling ? "…" : `Rollback + Publish v${selectedVersion}`}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Questionnaire — Generate in edit == Save Draft */}
      <Questionnaire
        initialAnswers={answers}
        onChange={(a) => setAnswers(a)}
        onGenerate={() => saveDraft("Saved from Generate")}
      />
    </div>
  );
}

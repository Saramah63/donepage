"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThemeToggle } from "@/app/components/theme-toggle";

type Project = {
  id: string;
  plan: "launch" | "growth";
  status: string;
  revisionsAllowed: number;
  revisionsUsed: number;
  previewUrl: string;
  publishedUrl?: string | null;
  domain?: string | null;
  basicSeo: boolean;
  priorityDelivery: boolean;
  humanEtaDate: string;
};

type Revision = {
  id: string;
  message: string;
  section?: string | null;
  createdAt: string;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map((v) => Number(v));
  if (!y || !m || !d) return "";
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Helsinki",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function PortalClient() {
  const params = useSearchParams();
  const tokenParam = (params.get("token") || "").trim();
  const [token, setToken] = React.useState(tokenParam);
  const [project, setProject] = React.useState<Project | null>(null);
  const [revisions, setRevisions] = React.useState<Revision[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!tokenParam) return;
    try {
      localStorage.setItem("dp_portal_token", tokenParam);
    } catch {}
    setToken(tokenParam);
  }, [tokenParam]);

  React.useEffect(() => {
    if (token) return;
    try {
      const stored = localStorage.getItem("dp_portal_token") || "";
      if (stored) setToken(stored);
    } catch {}
  }, [token]);

  const fetchProject = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/project?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setProject(data.project as Project);
      setRevisions((data.revisions || []) as Revision[]);
      setPublishedUrl(data.project?.publishedUrl || null);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const requestRevision = async () => {
    if (!project) return;
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          token,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setMessage("");
      window.dispatchEvent(new CustomEvent("dp_revision_requested", { detail: { projectId: project.id } }));
      fetchProject();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const approvePublish = async () => {
    if (!project) return;
    setApproveLoading(true);
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setPublishedUrl(data.publishedUrl || null);
      window.dispatchEvent(new CustomEvent("dp_published", { detail: { projectId: project.id } }));
      fetchProject();
    } catch {
      // ignore
    } finally {
      setApproveLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">Loading...</main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Card>
          <CardContent className="p-6">Could not load your portal. Check your link.</CardContent>
        </Card>
      </main>
    );
  }

  const revisionsRemaining = Math.max(0, project.revisionsAllowed - project.revisionsUsed);

  return (
    <main className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 dark:border-gray-700 dark:bg-slate-900/75">
          <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Donepage</Link>
          <ThemeToggle />
        </div>

        <Card className="border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Client Portal</h1>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Plan: <span className="font-semibold capitalize">{project.plan}</span> · Status: {project.status}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                Revisions remaining: <span className="font-semibold">{revisionsRemaining}</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                Human polish ETA: <span className="font-semibold">{formatDate(project.humanEtaDate)}</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                Domain: <span className="font-semibold">{project.domain || "Not provided"}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-11 bg-blue-600 !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
                <Link href={`${project.previewUrl}&portal=1`}>Open Instant Draft</Link>
              </Button>
              <Button
                className="h-11"
                variant="outline"
                onClick={approvePublish}
                disabled={approveLoading}
              >
                {approveLoading ? "Publishing..." : "Approve & publish"}
              </Button>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {project.plan === "growth"
                ? "Domain connection is included in Growth. We'll connect your domain during publish."
                : "Custom domain connection is available as an add-on for Launch."}
            </div>

            <div id="revision" className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Request a revision</h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you want changed"
                className="mt-3 w-full min-h-[120px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
              />
              <Button
                className="mt-3 h-10"
                onClick={requestRevision}
                disabled={submitting || revisionsRemaining <= 0}
              >
                {submitting ? "Sending..." : "Request revision"}
              </Button>
              {revisionsRemaining <= 0 ? (
                <div className="mt-2 text-xs text-gray-500">Revision limit reached for this plan.</div>
              ) : null}
            </div>

            {revisions.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revision history</h2>
                <div className="mt-3 space-y-2">
                  {revisions.map((rev) => (
                    <div key={rev.id} className="rounded-lg border border-gray-200 bg-white/80 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                      <div className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleString()}</div>
                      <div className="mt-1">{rev.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {publishedUrl ? (
              <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                Published: <Link href={publishedUrl} className="underline">{publishedUrl}</Link>
              </div>
            ) : null}

            {publishedUrl ? (
              <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                Keep it fast, secure, and maintained — €19/month.
                <div className="mt-3">
                  <Button
                    asChild
                    className="h-10"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("dp_hosting_upsell_clicked", {
                          detail: { projectId: project.id },
                        })
                      )
                    }
                  >
                    <Link href="/hosting">Add Hosting & Support</Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

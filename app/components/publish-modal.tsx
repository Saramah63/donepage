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
import { Card, CardContent } from "@/app/components/ui/card";
import { CheckCircle, Globe, Zap } from "lucide-react";
import { toast } from "sonner";
import type { QuestionnaireAnswers } from "./questionnaire";

/* ---------------------------------------------
   Types
---------------------------------------------- */

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  answers: QuestionnaireAnswers;
}

type AvailabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available" }
  | { status: "taken" }
  | { status: "error"; message: string };

/* ---------------------------------------------
   Constants & helpers
---------------------------------------------- */

const RESERVED_SLUGS = new Set([
  "api",
  "pricing",
  "generator",
  "publish",
  "plan",
  "login",
  "logout",
  "signup",
  "auth",
  "account",
  "dashboard",
  "admin",
  "settings",
  "support",
  "help",
  "www",
  "app",
  "static",
  "assets",
  "favicon",
  "favicon.ico",
]);

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function makeSuggestedSlug(answers: QuestionnaireAnswers) {
  const base =
    answers.businessName?.trim() ||
    answers.primaryOffer?.trim() ||
    answers.serviceType ||
    "your-page";
  return sanitizeSlug(base) || "yourpage";
}

function validateSlug(slug: string) {
  if (!slug) return { ok: false, reason: "Slug is required" };
  if (slug.length < 3) return { ok: false, reason: "Minimum 3 characters" };
  if (slug.length > 50) return { ok: false, reason: "Maximum 50 characters" };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    return { ok: false, reason: "Only letters, numbers, and hyphens allowed" };
  if (RESERVED_SLUGS.has(slug))
    return { ok: false, reason: "This slug is reserved" };
  return { ok: true as const, reason: "" };
}

async function copyToClipboard(value: string, label = "Copied") {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(label);
  } catch {
    toast.error("Copy failed");
  }
}

/* ---------------------------------------------
   Component
---------------------------------------------- */

export function PublishModal({ open, onClose, answers }: PublishModalProps) {
  const [slug, setSlug] = React.useState("yourpage");
  const [publishing, setPublishing] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(null);

  // Secure edit flow (token returned by server in editUrl)
  const [editUrl, setEditUrl] = React.useState<string | null>(null);

  // Slug availability
  const [availability, setAvailability] = React.useState<AvailabilityState>({
    status: "idle",
  });

  // Reset state each open
  React.useEffect(() => {
    if (!open) return;
    setSlug(makeSuggestedSlug(answers));
    setPublishedUrl(null);
    setEditUrl(null);
    setAvailability({ status: "idle" });
  }, [open, answers]);

  const safeSlug = React.useMemo(() => sanitizeSlug(slug), [slug]);
  const validation = React.useMemo(() => validateSlug(safeSlug), [safeSlug]);

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const liveUrl = `${base.replace(/\/$/, "")}/${safeSlug || "yourpage"}`;
  const futureSubdomain = `https://${safeSlug || "yourpage"}.donepage.co`;

  // Debounced availability check (only when slug is valid)
  React.useEffect(() => {
    if (!open) return;

    if (!validation.ok) {
      setAvailability({ status: "idle" });
      return;
    }

    let cancelled = false;
    setAvailability({ status: "checking" });

    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/slug/check?slug=${encodeURIComponent(safeSlug)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setAvailability({
            status: "error",
            message: data?.error ?? "Check failed",
          });
          return;
        }

        setAvailability(data?.available ? { status: "available" } : { status: "taken" });
      } catch (e: any) {
        if (cancelled) return;
        setAvailability({ status: "error", message: e?.message ?? "Check failed" });
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open, safeSlug, validation.ok]);

  const canPublish =
    validation.ok &&
    availability.status === "available" &&
    !publishing;

  const handlePublish = async () => {
    if (!validation.ok) {
      toast.error(validation.reason);
      return;
    }

    if (availability.status === "checking") {
      toast.message("Checking slug availability…");
      return;
    }

    if (availability.status !== "available") {
      toast.error(
        availability.status === "taken"
          ? "Slug is already taken. Try another one."
          : "Slug availability check failed."
      );
      return;
    }

    try {
      setPublishing(true);

      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: safeSlug, answers }),
      });

      const data = await res.json();

      if (res.status === 409 && data?.code === "SLUG_TAKEN") {
        setAvailability({ status: "taken" });
        toast.error("This slug is already taken. Try another one.");
        return;
      }

      if (!res.ok) throw new Error(data?.error ?? "Publish failed");

      setPublishedUrl(data.url);
      setEditUrl(data.editUrl ?? null);

      toast.success("Published successfully. Your page is live.");
    } catch (e: any) {
      toast.error(e?.message ?? "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const renderAvailabilityLine = () => {
    if (!validation.ok) return null;

    if (availability.status === "checking") {
      return <div className="mt-2 text-xs text-gray-500">Checking availability…</div>;
    }
    if (availability.status === "available") {
      return <div className="mt-2 text-xs text-green-700">✅ Available</div>;
    }
    if (availability.status === "taken") {
      return <div className="mt-2 text-xs text-red-600">❌ Taken</div>;
    }
    if (availability.status === "error") {
      return (
        <div className="mt-2 text-xs text-red-600">
          Availability check failed: {availability.message}
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">
            Publish Your Landing Page
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Publish instantly and share a live, SEO-ready link.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Quick Publish */}
          <Card className="border-gray-200 transition-all hover:shadow-lg">
            <CardContent className="space-y-5 pt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                <Zap className="h-6 w-6 text-white" />
              </div>

              <div>
                <div className="text-xl font-semibold text-gray-900">
                  Quick Publish
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Saves your page and makes it publicly accessible.
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-sm text-gray-600">
                  Choose your page slug
                </div>

                <div className="flex items-center gap-2">
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="yourpage"
                    spellCheck={false}
                  />
                  <div className="whitespace-nowrap text-sm text-gray-700">
                    /{safeSlug || "yourpage"}
                  </div>
                </div>

                {!validation.ok ? (
                  <div className="mt-2 text-xs text-red-600">
                    {validation.reason}
                  </div>
                ) : null}

                {renderAvailabilityLine()}

                <div className="mt-3 text-xs text-gray-500">
                  Live URL:
                  <div className="mt-1 font-medium text-gray-700 break-all">
                    {publishedUrl || liveUrl}
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-gray-400">
                  Subdomain (coming soon): {futureSubdomain}
                </div>
              </div>

              {editUrl ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs text-gray-600">
                    Private edit link (keep secure):
                  </div>
                  <div className="mt-1 break-all text-sm font-medium text-gray-800">
                    {editUrl}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => copyToClipboard(editUrl, "Edit link copied")}
                  >
                    Copy Edit Link
                  </Button>
                </div>
              ) : null}

              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Instant live link (KV-backed)",
                  "Secure private edit link (token-based)",
                  "Works with /slug routing",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <Button
                  onClick={handlePublish}
                  disabled={!canPublish}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                >
                  {publishing ? "Publishing…" : "Publish Now"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(publishedUrl || liveUrl, "URL copied")
                  }
                >
                  Copy URL
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain */}
          <Card className="border-gray-200 transition-all hover:shadow-lg">
            <CardContent className="space-y-5 pt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                <Globe className="h-6 w-6 text-white" />
              </div>

              <div>
                <div className="text-xl font-semibold text-gray-900">
                  Custom Domain
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Connect your own domain (next step).
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                {["Works with client domains", "Full SEO control", "Automatic SSL"].map(
                  (t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                      {t}
                    </li>
                  )
                )}
              </ul>

              <Button
                onClick={() =>
                  toast.message("Custom domain setup will be integrated with Vercel Domains.")
                }
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              >
                Set Up Custom Domain
              </Button>

              <div className="text-xs text-gray-500">
                Requires DNS update (CNAME/A record) at your domain provider.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          SEO-ready by default · Clean HTML · Fast load · Shareable instantly
        </div>
      </DialogContent>
    </Dialog>
  );
}

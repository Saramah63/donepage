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

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  answers: QuestionnaireAnswers;
}

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export function PublishModal({ open, onClose, answers }: PublishModalProps) {
  const [slug, setSlug] = React.useState("yourpage");
  const [publishing, setPublishing] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(null);

  const safeSlug = React.useMemo(() => sanitizeSlug(slug), [slug]);

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  const previewUrl = `https://${safeSlug || "yourpage"}.donepage.co`; // فقط نمایش UI، سابدامین واقعی بعداً
  const finalUrl = `https://${safeSlug}.donepage.co`;

  const handlePublish = async () => {
    if (!safeSlug) {
      toast.error("Please enter a valid slug");
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
      if (!res.ok) throw new Error(data?.error ?? "Publish failed");

      setPublishedUrl(data.url);
      toast.success("Published! Your page is live.");
    } catch (e: any) {
      toast.error(e?.message ?? "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            Publish Your Landing Page
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Publish instantly and share your landing page link
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-6 md:grid-cols-2">
          {/* Quick Publish */}
          <Card className="border-gray-200 hover:shadow-lg transition-all">
            <CardContent className="pt-8 space-y-5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>

              <div>
                <div className="text-xl font-semibold text-gray-900">
                  Quick Publish
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Publish now (stored in KV) and get a live URL
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm text-gray-600 mb-2">
                  Choose your page slug:
                </div>

                <div className="flex items-center gap-2">
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="yourpage"
                    inputMode="url"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <div className="text-sm text-gray-700 whitespace-nowrap">
                    /{safeSlug || "yourpage"}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Live URL: {finalUrl}
                </div>

                <div className="mt-2 text-[11px] text-gray-400">
                  (Subdomain UI preview: {previewUrl})
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  Live link instantly (KV-backed)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  No database setup needed beyond KV
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  Works with /slug routing
                </li>
              </ul>

              <div className="flex gap-2">
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {publishing ? "Publishing..." : "Publish Now"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="border-gray-300 bg-white hover:bg-gray-50"
                >
                  Copy URL
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain (later wiring) */}
          <Card className="border-gray-200 hover:shadow-lg transition-all">
            <CardContent className="pt-8 space-y-5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>

              <div>
                <div className="text-xl font-semibold text-gray-900">
                  Custom Domain
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Connect your domain (next step)
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  Works with client domains
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  Full SEO control
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  SSL via platform
                </li>
              </ul>

              <Button
                onClick={() => toast.message("Custom domain flow will be wired to Vercel Domains next.")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                Set Up Custom Domain
              </Button>

              <div className="text-xs text-gray-500">
                Note: Domain connection requires DNS update (CNAME/A record) in
                your domain provider.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          SEO-ready by default: clean headings, metadata hooks, and performance-first layout.
        </div>
      </DialogContent>
    </Dialog>
  );
}

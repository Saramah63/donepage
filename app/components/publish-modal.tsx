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
import { CheckCircle, Globe, Zap, CreditCard, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import type { QuestionnaireAnswers } from "./questionnaire";

/* ---------------------------------------------
   Types
---------------------------------------------- */

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  answers: QuestionnaireAnswers;
  onOpenPricing?: () => void;
}

type AvailabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available" }
  | { status: "taken" }
  | { status: "error"; message: string };

type DomainState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved" }
  | { status: "error"; message: string };

type DomainVerify = {
  status: "idle" | "checking" | "ready" | "pending" | "error";
  message?: string;
};

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

export function PublishModal({ open, onClose, answers, onOpenPricing }: PublishModalProps) {
  const [slug, setSlug] = React.useState("yourpage");
  const [publishing, setPublishing] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(null);

  // Secure edit flow (token returned by server in editUrl)
  const [editUrl, setEditUrl] = React.useState<string | null>(null);

  // Slug availability
  const [availability, setAvailability] = React.useState<AvailabilityState>({
    status: "idle",
  });

  // Domain setup
  const [domain, setDomain] = React.useState("");
  const [domainState, setDomainState] = React.useState<DomainState>({ status: "idle" });
  const [domainVerify, setDomainVerify] = React.useState<DomainVerify>({ status: "idle" });
  const [verifyEmail, setVerifyEmail] = React.useState("");
  const [verifyEmailStatus, setVerifyEmailStatus] = React.useState<DomainVerify>({ status: "idle" });

  // Reset state each open
  React.useEffect(() => {
    if (!open) return;
    setSlug(makeSuggestedSlug(answers));
    setPublishedUrl(null);
    setEditUrl(null);
    setAvailability({ status: "idle" });
    setDomain("");
    setDomainState({ status: "idle" });
    setDomainVerify({ status: "idle" });
    setVerifyEmail("");
    setVerifyEmailStatus({ status: "idle" });
  }, [open, answers]);

  const safeSlug = React.useMemo(() => sanitizeSlug(slug), [slug]);
  const validation = React.useMemo(() => validateSlug(safeSlug), [safeSlug]);

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const liveUrl = `${base.replace(/\/$/, "")}/${safeSlug || "yourpage"}`;
  const suggestedSubdomain = `https://${safeSlug || "yourpage"}.donepage.co`;

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

  const ensurePaid = async () => {
    try {
      const pr = await fetch("/api/plan", { cache: "no-store" });
      const data = await pr.json();
      if (!data?.paid) {
        toast.message("Choose a plan to publish");
        onOpenPricing?.();
        return false;
      }
      return true;
    } catch {
      toast.error("Could not verify plan status");
      return false;
    }
  };

  const ensureDomainPlan = async () => {
    try {
      const pr = await fetch("/api/plan", { cache: "no-store" });
      const data = await pr.json();
      if (data?.plan !== "business" && data?.plan !== "pro") {
        toast.message("Custom domains require Business or Pro");
        onOpenPricing?.();
        return false;
      }
      return true;
    } catch {
      toast.error("Could not verify plan status");
      return false;
    }
  };

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

    const paid = await ensurePaid();
    if (!paid) return;

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

  const checkDomainStatus = async (domainValue: string) => {
    if (!domainValue) return;
    if (domainValue.endsWith(".donepage.co")) {
      setDomainVerify({ status: "ready", message: "Subdomain active (Donepage DNS)" });
      return;
    }
    setDomainVerify({ status: "checking" });
    try {
      const res = await fetch(
        `/api/domains/verify?domain=${encodeURIComponent(domainValue)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Verify failed");

      if (!data?.mapped) {
        setDomainVerify({ status: "pending", message: "Domain not connected yet." });
        return;
      }

      if (data?.dns?.verified) {
        setDomainVerify({ status: "ready", message: "DNS verified. Domain is live." });
      } else {
        setDomainVerify({ status: "pending", message: "DNS not verified yet." });
      }

      if (data?.verified) {
        setVerifyEmailStatus({ status: "ready", message: "Ownership verified by email." });
      }
    } catch (e: any) {
      setDomainVerify({ status: "error", message: e?.message ?? "Verify failed" });
    }
  };

  const assignDomain = async (domainValue: string) => {
    if (!domainValue) {
      toast.error("Please enter a domain");
      return;
    }

    const paid = await ensurePaid();
    if (!paid) return;
    const isCustom = !domainValue.endsWith(".donepage.co");
    if (isCustom) {
      const ok = await ensureDomainPlan();
      if (!ok) return;
    }

    setDomainState({ status: "saving" });
    try {
      const res = await fetch("/api/domains/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainValue, slug: safeSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Domain setup failed");
      setDomainState({ status: "saved" });
      toast.success("Domain connected. Update DNS to finish setup.");
      checkDomainStatus(domainValue);
    } catch (e: any) {
      setDomainState({ status: "error", message: e?.message ?? "Domain setup failed" });
    }
  };

  const requestEmailVerification = async (domainValue: string, emailValue: string) => {
    if (!domainValue) {
      toast.error("Enter a domain first");
      return;
    }
    if (!emailValue) {
      toast.error("Enter an email for verification");
      return;
    }

    const paid = await ensurePaid();
    if (!paid) return;
    const isCustom = !domainValue.endsWith(".donepage.co");
    if (isCustom) {
      const ok = await ensureDomainPlan();
      if (!ok) return;
    }

    setVerifyEmailStatus({ status: "checking", message: "Sending verification email…" });
    try {
      const res = await fetch("/api/domains/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainValue, email: emailValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      setVerifyEmailStatus({ status: "pending", message: "Verification email sent." });
    } catch (e: any) {
      setVerifyEmailStatus({ status: "error", message: e?.message ?? "Request failed" });
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
            Review your page, choose a plan, then publish.
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
                  Publish to Donepage
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Choose your slug and publish after payment.
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
                  Subdomain option: {suggestedSubdomain}
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

              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-600">
                <div className="font-semibold text-gray-900">Pricing</div>
                <div className="mt-1">
                  Choose a plan before publishing. You can review your page first.
                </div>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-600">
                  This payment covers publishing on Donepage. Client service fees are billed separately.
                </div>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => onOpenPricing?.()}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Choose Plan
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
                  Connect your own domain or use a Donepage subdomain.
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Works with client domains",
                  "Full SEO control",
                  "Automatic SSL",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs text-gray-500">Free subdomain</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  {suggestedSubdomain}
                </div>
                <Button
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => assignDomain(`${safeSlug || "yourpage"}.donepage.co`)}
                >
                  Use This Subdomain
                </Button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-sm font-semibold text-gray-900">
                  Connect your own domain
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="client.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <Button
                  onClick={() => assignDomain(domain)}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                  disabled={domainState.status === "saving"}
                >
                  {domainState.status === "saving" ? "Connecting…" : "Connect Domain"}
                </Button>

                {domainState.status === "saved" ? (
                  <div className="mt-2 text-xs text-green-700">✅ Domain connected</div>
                ) : null}
                {domainState.status === "error" ? (
                  <div className="mt-2 text-xs text-red-600">
                    {domainState.message}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    Check DNS status after you update records.
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => checkDomainStatus(domain || `${safeSlug}.donepage.co`)}
                  >
                    <RefreshCcw className="mr-2 h-3 w-3" /> Check status
                  </Button>
                </div>

                {domainVerify.status === "ready" ? (
                  <div className="mt-2 text-xs text-green-700">✅ {domainVerify.message}</div>
                ) : null}
                {domainVerify.status === "pending" ? (
                  <div className="mt-2 text-xs text-amber-700">⏳ {domainVerify.message}</div>
                ) : null}
                {domainVerify.status === "error" ? (
                  <div className="mt-2 text-xs text-red-600">{domainVerify.message}</div>
                ) : null}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-sm font-semibold text-gray-900">Verify ownership (email)</div>
                <div className="mt-2 text-xs text-gray-600">
                  We’ll send a verification link to confirm you control the domain.
                  It goes to admin@domain and your email.
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    placeholder="you@yourdomain.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() =>
                    requestEmailVerification(domain || `${safeSlug}.donepage.co`, verifyEmail)
                  }
                >
                  Send verification email
                </Button>

                {verifyEmailStatus.status === "ready" ? (
                  <div className="mt-2 text-xs text-green-700">✅ {verifyEmailStatus.message}</div>
                ) : null}
                {verifyEmailStatus.status === "pending" ? (
                  <div className="mt-2 text-xs text-amber-700">⏳ {verifyEmailStatus.message}</div>
                ) : null}
                {verifyEmailStatus.status === "error" ? (
                  <div className="mt-2 text-xs text-red-600">{verifyEmailStatus.message}</div>
                ) : null}
              </div>

              <div className="text-xs text-gray-500">
                After connecting, add a CNAME or A record at your DNS provider to
                point your domain to this Donepage project.
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

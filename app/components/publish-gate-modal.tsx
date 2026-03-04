"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { CheckCircle, CreditCard, Globe, Rocket } from "lucide-react";
import { toast } from "sonner";

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
};

type Props = {
  open: boolean;
  onClose: () => void;
  project: Project;
  token: string;
  onPublished?: (url: string) => void;
};

function getStripeLink(plan: "launch" | "growth") {
  if (plan === "growth") return process.env.NEXT_PUBLIC_STRIPE_LINK_GROWTH;
  return process.env.NEXT_PUBLIC_STRIPE_LINK_LAUNCH;
}

export default function PublishGateModal({
  open,
  onClose,
  project,
  token,
  onPublished,
}: Props) {
  const [step, setStep] = React.useState(1);
  const [publishTarget, setPublishTarget] = React.useState<
    "subdomain" | "custom_domain"
  >(project.publishTarget || (project.plan === "growth" ? "custom_domain" : "subdomain"));
  const [domain, setDomain] = React.useState(project.domain || "");
  const [publishing, setPublishing] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(
    project.publishedUrl || null
  );

  React.useEffect(() => {
    if (!open) return;
    setStep(1);
    setPublishTarget(project.publishTarget || (project.plan === "growth" ? "custom_domain" : "subdomain"));
    setDomain(project.domain || "");
    setPublishing(false);
    setPublishedUrl(project.publishedUrl || null);
  }, [open, project]);

  const isPaid = project.paymentStatus === "paid";
  const canProceedPayment = isPaid;

  const subdomainUrl = `https://${project.id}.donepage.co`;
  const customDomainUrl = domain ? `https://${domain.replace(/^https?:\/\//, "")}` : "";

  const canProceedDomain =
    project.plan === "growth"
      ? publishTarget === "subdomain" || (publishTarget === "custom_domain" && !!domain)
      : true;

  const canPublish =
    isPaid &&
    (publishTarget === "subdomain" ||
      (publishTarget === "custom_domain" &&
        project.plan === "growth" &&
        !!domain &&
        project.dnsStatus === "verified"));

  const onPublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    try {
      window.dispatchEvent(
        new CustomEvent("dp_publish_started", { detail: { projectId: project.id } })
      );
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          token,
          publishTarget,
          domain: domain || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.code === "DNS_NOT_VERIFIED") {
          toast.error("DNS not verified yet. Publish to subdomain now or verify DNS.");
          return;
        }
        throw new Error(data?.error || "Publish failed");
      }
      setPublishedUrl(data.publishedUrl);
      onPublished?.(data.publishedUrl);
      setStep(4);
    } catch (e: any) {
      toast.error(e?.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const paymentLink = getStripeLink(project.plan as "launch" | "growth");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Publish your landing page</DialogTitle>
          <DialogDescription className="text-center">
            You’re almost live. Complete the steps below to publish your page.
            <div className="mt-2 text-xs text-gray-500">
              The preview you see is a draft. Publishing will make your page publicly accessible.
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { id: 1, label: "Payment" },
            { id: 2, label: "Domain" },
            { id: 3, label: "Publish" },
            { id: 4, label: "Live" },
          ].map((s) => (
            <div
              key={s.id}
              className={[
                "rounded-xl border px-3 py-2 text-center text-sm font-semibold",
                step === s.id ? "border-blue-500 text-blue-600" : "border-gray-200 text-gray-600",
              ].join(" ")}
            >
              {s.label}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <Card className="mt-6 border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="text-lg font-semibold">
                  {isPaid ? "Payment confirmed" : "Payment required"}
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {isPaid
                  ? "Your payment has been successfully verified. You can now proceed to publishing."
                  : "To publish your landing page, please complete the payment for your selected plan."}
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {!isPaid ? (
                  <>
                    <Button asChild className="h-10">
                      <Link href={paymentLink || "/pricing"}>Complete payment</Link>
                    </Button>
                    <div className="text-xs text-gray-500">
                      After payment is confirmed, you can continue publishing your page.
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" /> Paid
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  className="h-10"
                  onClick={() => setStep(2)}
                  disabled={!canProceedPayment}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="mt-6 border-gray-200">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="text-lg font-semibold">
                  {project.plan === "growth" ? "Choose where to publish your page" : "Publish your landing page"}
                </div>
              </div>

              {project.plan === "growth" ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={publishTarget === "custom_domain" ? "default" : "outline"}
                      onClick={() => setPublishTarget("custom_domain")}
                    >
                      Connect your domain (recommended)
                    </Button>
                    <Button
                      variant={publishTarget === "subdomain" ? "default" : "outline"}
                      onClick={() => setPublishTarget("subdomain")}
                    >
                      Publish on Donepage subdomain (temporary)
                    </Button>
                  </div>

                  {publishTarget === "custom_domain" ? (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Domain</label>
                      <input
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="client.com"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <div className="text-xs text-gray-500">
                        After entering your domain, we will guide you to update your DNS settings.
                      </div>
                      {project.dnsStatus !== "verified" ? (
                        <div className="text-xs text-amber-700">
                          DNS status: {project.dnsStatus.replace("_", " ")}. You can publish on a subdomain now and connect later.
                        </div>
                      ) : null}
                      {project.dnsStatus !== "verified" ? (
                        <Button
                          variant="outline"
                          className="h-9 text-xs"
                          onClick={() => setPublishTarget("subdomain")}
                        >
                          Publish to subdomain now
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                      You can publish your page instantly on a Donepage subdomain and connect your domain later.
                      <div className="mt-2 font-semibold">{subdomainUrl}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                    Your page will be published on a Donepage subdomain:
                    <div className="mt-1 font-semibold">{subdomainUrl}</div>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                    <div className="font-semibold">Connect your own domain for a more professional presence.</div>
                    <div className="mt-1">Custom domain connection is an add-on for Launch.</div>
                    <div className="mt-2">
                      <Button variant="outline" className="h-9 text-xs" asChild>
                        <Link href="/pricing">Add domain connection</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" className="h-10" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="h-10" onClick={() => setStep(3)} disabled={!canProceedDomain}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {step === 3 ? (
          <Card className="mt-6 border-gray-200">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="text-lg font-semibold">Ready to go live</div>
              </div>
              <div className="text-sm text-gray-600">
                Once you click publish, your landing page will become publicly accessible.
              </div>
              <div className="text-sm text-gray-600">
                Target:{" "}
                <span className="font-semibold">
                  {publishTarget === "custom_domain" ? customDomainUrl || "Custom domain" : subdomainUrl}
                </span>
              </div>
              {publishTarget === "custom_domain" && project.dnsStatus !== "verified" ? (
                <div className="text-xs text-amber-700">
                  DNS must be verified to publish on a custom domain.
                </div>
              ) : null}
              <div className="flex justify-between">
                <Button variant="outline" className="h-10" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button className="h-10" onClick={onPublish} disabled={!canPublish || publishing}>
                  {publishing ? "Publishing your page…" : "Publish now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {step === 4 ? (
          <Card className="mt-6 border-gray-200">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="text-lg font-semibold">Your landing page is live</div>
              </div>
              <div className="text-sm text-gray-600">Your page is now accessible online.</div>
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                {publishedUrl || project.publishedUrl}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="h-10">
                  <Link href={publishedUrl || project.publishedUrl || "#"}>View website</Link>
                </Button>
                <Button asChild variant="outline" className="h-10">
                  <Link href={`/portal?token=${encodeURIComponent(token)}`}>Go to dashboard</Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="font-semibold">Keep your page fast, secure, and maintained</div>
                <ul className="mt-2 list-disc pl-5 text-xs">
                  <li>Hosting on Vercel</li>
                  <li>SSL and uptime monitoring</li>
                  <li>Minor updates</li>
                  <li>Email support</li>
                </ul>
                <div className="mt-2 text-sm font-semibold">€19 / month</div>
                <div className="mt-2">
                  <Button
                    asChild
                    className="h-9"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("dp_hosting_upsell_clicked", {
                          detail: { projectId: project.id },
                        })
                      )
                    }
                  >
                    <Link href="/hosting">Activate hosting</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

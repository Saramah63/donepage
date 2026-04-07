"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { PublicSiteHeader } from "@/app/components/public-site-header";

type Stage = "form" | "verify";

export default function CustomClient() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [presence, setPresence] = React.useState("");
  const [build, setBuild] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [pagesFeatures, setPagesFeatures] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [budgetRange, setBudgetRange] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [stage, setStage] = React.useState<Stage>("form");
  const [verifyError, setVerifyError] = React.useState("");
  const [resendCountdown, setResendCountdown] = React.useState(0);
  const [requestSent, setRequestSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [sendingCode, setSendingCode] = React.useState(false);
  const [verifyingCode, setVerifyingCode] = React.useState(false);

  React.useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = window.setTimeout(() => {
      setResendCountdown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  const buildPayload = React.useCallback(() => {
    return {
      name: name.trim(),
      email: email.trim(),
      company: projectName.trim(),
      reason: "custom_proposal",
      message: [
        `Business / project name`,
        projectName.trim(),
        "",
        `Website, Instagram, or LinkedIn`,
        presence.trim() || "Not provided",
        "",
        `What are you looking to build?`,
        build.trim(),
        "",
        `What is the main goal of this project?`,
        goal.trim(),
        "",
        `What pages or features do you think you need?`,
        pagesFeatures.trim(),
        "",
        `What is your ideal timeline?`,
        timeline.trim(),
        "",
        `What budget range are you considering?`,
        budgetRange.trim(),
        "",
        `Project summary`,
        details.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }, [name, email, projectName, presence, build, goal, pagesFeatures, timeline, budgetRange, details]);

  const sendOtp = React.useCallback(async () => {
    const targetEmail = email.trim();
    if (!targetEmail) return false;
    setVerifyError("");
    setSendingCode(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        if (typeof data?.retryAfter === "number" && data.retryAfter > 0) {
          setResendCountdown(data.retryAfter);
        }
        throw new Error(data?.error || "Could not send verification code.");
      }
      setStage("verify");
      setOtpCode("");
      setResendCountdown(30);
      toast.success("Verification code sent.");
      return true;
    } catch (error: any) {
      toast.error(error?.message || "Could not send verification code.");
      return false;
    } finally {
      setSendingCode(false);
    }
  }, [email]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendOtp();
  };

  const onVerifyAndSend = async () => {
    if (otpCode.trim().length !== 6) return;
    setVerifyError("");
    setVerifyingCode(true);
    try {
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode.trim() }),
      });
      const verifyData = await verifyRes.json().catch(() => null);
      if (!verifyRes.ok) throw new Error(verifyData?.error || "Verification failed.");

      setSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "send_failed");

      toast.success("Custom proposal request sent.");
      setName("");
      setEmail("");
      setProjectName("");
      setPresence("");
      setBuild("");
      setGoal("");
      setPagesFeatures("");
      setTimeline("");
      setBudgetRange("");
      setDetails("");
      setOtpCode("");
      setVerifyError("");
      setResendCountdown(0);
      setStage("form");
      setRequestSent(true);
    } catch (error: any) {
      setVerifyError(error?.message || "Could not complete request.");
      toast.error(error?.message || "Could not complete request.");
    } finally {
      setVerifyingCode(false);
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 sm:py-20">
      <PublicSiteHeader />
      <div className="mx-auto max-w-[760px]">
        <div className="h-12 sm:h-16" />

        <section className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
            Custom Projects
          </p>
          <h1
            className="mt-4 text-4xl tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Custom Projects
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#CFCFCF]">
            Need something beyond a single landing page?
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#CFCFCF]">
            We handle more advanced builds for businesses that need extra structure, flexibility, or functionality.
          </p>
        </section>

        <section className="reveal-up mt-12 rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="stagger-reveal space-y-8">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <h2
                className="text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                What custom work can include
              </h2>
              <div className="mt-4 space-y-3 text-base leading-7 text-[#CFCFCF]">
                <p>• Multi-page websites</p>
                <p>• Custom layouts</p>
                <p>• Integrations</p>
                <p>• Advanced lead flows</p>
                <p>• Tailored builds for specific business needs</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <h2
                className="text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                Who this is for
              </h2>
              <div className="mt-4 space-y-3 text-base leading-7 text-[#CFCFCF]">
                <p>• more than one page</p>
                <p>• a more custom structure</p>
                <p>• a setup tailored to your workflow or service model</p>
              </div>
            </div>
          </div>
        </section>

        <section className="reveal-up mt-12 rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <h2
            className="text-2xl tracking-tight text-white"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Request a custom proposal
          </h2>

          {requestSent ? (
            <div className="stagger-reveal mt-6 rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
                Request sent
              </p>
              <h3
                className="mt-4 text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                Your request has been sent.
              </h3>
              <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                We&apos;ll review it and get back to you shortly.
              </p>
              <div className="mt-6">
                <Button
                  type="button"
                  onClick={() => setRequestSent(false)}
                  className="h-12 rounded-full bg-[#127A66] px-8 text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.22)] hover:bg-[#15907A]"
                >
                  Send another request
                </Button>
              </div>
            </div>
          ) : stage === "form" ? (
          <form onSubmit={onSubmit} className="stagger-reveal mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Name</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Email</label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Business / project name</label>
                <Input
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                  placeholder="Your business or project name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Website, Instagram, or LinkedIn</label>
                <Input
                  required
                  value={presence}
                  onChange={(e) => setPresence(e.target.value)}
                  className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                  placeholder="A link we can review"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">What are you looking to build?</label>
              <textarea
                required
                value={build}
                onChange={(e) => setBuild(e.target.value)}
                className="min-h-28 w-full rounded-2xl border border-[#222222] bg-[#111111] px-4 py-3 text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-[#127A66] focus:bg-[#141414] focus:ring-[3px] focus:ring-[#127A66]/20"
                placeholder="Describe the type of site, flow, or system you need."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">What is the main goal of this project?</label>
              <Input
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                placeholder="Leads, applications, bookings, sales, internal workflow..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">What pages or features do you think you need?</label>
              <textarea
                required
                value={pagesFeatures}
                onChange={(e) => setPagesFeatures(e.target.value)}
                className="min-h-24 w-full rounded-2xl border border-[#222222] bg-[#111111] px-4 py-3 text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-[#127A66] focus:bg-[#141414] focus:ring-[3px] focus:ring-[#127A66]/20"
                placeholder="For example: homepage, services, case studies, CMS, booking flow, integrations..."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">What is your ideal timeline?</label>
                <Input
                  required
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                  placeholder="This month, next quarter, flexible..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">What budget range are you considering?</label>
                <Input
                  required
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                  placeholder="A range is enough"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Describe your project in 2–5 clear sentences</label>
              <textarea
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="min-h-32 w-full rounded-2xl border border-[#222222] bg-[#111111] px-4 py-3 text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-[#127A66] focus:bg-[#141414] focus:ring-[3px] focus:ring-[#127A66]/20"
                placeholder="Give us enough context to understand the project clearly."
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || sendingCode}
              className="mt-3 h-12 w-full rounded-full bg-[#127A66] text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.22)] hover:bg-[#15907A]"
            >
              {sendingCode ? "Sending code..." : "Request Custom Proposal"}
            </Button>
          </form>
          ) : (
            <div className="stagger-reveal mt-6 space-y-5">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
                  Final step
                </p>
                <h3
                  className="mt-4 text-2xl tracking-tight text-white"
                  style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
                >
                  Before we send your request
                </h3>
                <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                  Please verify your email to continue.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  We&apos;re sending the code to <span className="text-white">{email.trim()}</span>.
                </p>
                <div className="mt-6 space-y-2">
                  <label className="block text-sm font-medium text-white">Verification code</label>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-center text-lg tracking-[0.35em] text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                    placeholder="_ _ _ _ _ _"
                  />
                </div>
                {verifyError ? (
                  <p className="mt-3 text-sm text-[#fca5a5]">{verifyError}</p>
                ) : null}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    disabled={otpCode.trim().length !== 6 || verifyingCode || submitting}
                    onClick={onVerifyAndSend}
                    className="h-12 flex-1 rounded-full bg-[#127A66] text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.22)] hover:bg-[#15907A]"
                  >
                    {verifyingCode || submitting ? "Sending..." : "Verify & Send Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={sendingCode || resendCountdown > 0}
                    onClick={sendOtp}
                    className="h-12 rounded-full border-white/12 bg-transparent px-6 text-base font-medium text-white hover:bg-white/[0.05]"
                  >
                    {sendingCode
                      ? "Sending..."
                      : resendCountdown > 0
                        ? `Resend code (${resendCountdown}s)`
                        : "Resend code"}
                  </Button>
                </div>
                <button
                  type="button"
                  className="mt-4 text-sm text-white/60 transition hover:text-white"
                  onClick={() => setStage("form")}
                >
                  Back to form
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 border-t border-white/8 pt-8 text-center">
            <p
              className="text-2xl tracking-tight text-white"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Need something simpler?
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#CFCFCF]">
              Start with a conversion-ready landing page first.
            </p>
            <Button
              asChild
              className="mt-6 h-12 rounded-full bg-[#127A66] px-8 text-base font-semibold text-white shadow-[0_0_32px_rgba(18,122,102,0.28)] hover:bg-[#15907A]"
            >
              <Link href="/start" target="_blank" rel="noopener noreferrer">
                Start My Page
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

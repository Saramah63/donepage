"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { PublicSiteHeader } from "@/app/components/public-site-header";

type Stage = "form" | "verify" | "success";

export default function ContactClient() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [budgetRange, setBudgetRange] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [stage, setStage] = React.useState<Stage>("form");
  const [verifyError, setVerifyError] = React.useState("");
  const [resendCountdown, setResendCountdown] = React.useState(0);
  const [sendingCode, setSendingCode] = React.useState(false);
  const [verifyingCode, setVerifyingCode] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

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
        `Business or project name`,
        projectName.trim(),
        "",
        `What are you building?`,
        building.trim(),
        "",
        `What’s your goal?`,
        goal.trim(),
        "",
        `What timeline do you have?`,
        timeline.trim(),
        "",
        `What budget range are you considering?`,
        budgetRange.trim(),
        details.trim() ? `\nAnything specific we should know?\n${details.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }, [name, email, projectName, building, goal, timeline, budgetRange, details]);

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
      setOtpCode("");
      setResendCountdown(30);
      setStage("verify");
      toast.success("Verification code sent.");
      return true;
    } catch (error: any) {
      setVerifyError(error?.message || "Could not send verification code.");
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
      if (!res.ok) throw new Error(data?.error || "Could not send request.");

      setStage("success");
      setName("");
      setEmail("");
      setProjectName("");
      setBuilding("");
      setGoal("");
      setTimeline("");
      setBudgetRange("");
      setDetails("");
      setOtpCode("");
      setVerifyError("");
      setResendCountdown(0);
      toast.success("Custom proposal request sent.");
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

        <section className="text-center">
          <h1
            className="text-4xl tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Start your page — or tell us what you need
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#CFCFCF]">
            If you&apos;re not sure yet, generate your page in minutes. If you need something custom, share the details below.
          </p>
        </section>

        <section className="mt-12 rounded-[32px] border border-[#222222] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <Button
            asChild
            className="h-12 rounded-full border border-white/70 bg-white px-8 text-base font-semibold text-[#0A0A0A] shadow-[0_0_28px_rgba(255,255,255,0.16)] transition duration-300 hover:scale-[1.02] hover:bg-white/95 hover:text-[#0A0A0A]"
          >
            <Link href="/start" style={{ color: "#0A0A0A", backgroundColor: "#FFFFFF" }}>
              Start My Page
            </Link>
          </Button>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/62">
            Get a draft in minutes. Refine it later.
          </p>
        </section>

        <section className="mt-12 rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          {stage === "success" ? (
            <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
                Request sent
              </p>
              <h2
                className="mt-4 text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                Your request has been sent.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                We&apos;ll review it and get back to you shortly.
              </p>
              <Button
                type="button"
                onClick={() => setStage("form")}
                className="mt-6 h-12 rounded-full bg-[#127A66] px-8 text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.22)] hover:bg-[#15907A]"
              >
                Send another request
              </Button>
            </div>
          ) : stage === "form" ? (
            <>
              <h2
                className="text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                Request something custom
              </h2>
              <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
                We review serious project inquiries only. Clear details help us respond faster.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Business or project name</label>
                  <Input
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                    placeholder="Your business or project name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">What are you building?</label>
                  <textarea
                    required
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="min-h-28 w-full rounded-2xl border border-[#222222] bg-[#111111] px-4 py-3 text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-[#127A66] focus:bg-[#141414] focus:ring-[3px] focus:ring-[#127A66]/20"
                    placeholder="Describe the type of site, funnel, or system you need."
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">What&apos;s your goal?</label>
                    <Input
                      required
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                      placeholder="Leads, calls, sales, applications..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">What timeline do you have?</label>
                    <Input
                      required
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="h-12 rounded-2xl border-[#222222] bg-[#111111] px-4 text-white placeholder:text-white/35 dark:border-[#222222] dark:bg-[#111111]"
                      placeholder="This month, next quarter, flexible..."
                    />
                  </div>
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Anything specific we should know? (optional)</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="min-h-28 w-full rounded-2xl border border-[#222222] bg-[#111111] px-4 py-3 text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-[#127A66] focus:bg-[#141414] focus:ring-[3px] focus:ring-[#127A66]/20"
                    placeholder="Anything about scope, references, workflow, or constraints."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendingCode}
                  className="mt-3 h-12 w-full rounded-full bg-[#127A66] text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.22)] hover:bg-[#15907A]"
                >
                  {sendingCode ? "Sending code..." : "Request Custom Proposal"}
                </Button>
              </form>
            </>
          ) : (
            <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
                Final step
              </p>
              <h2
                className="mt-4 text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                Before we send your request
              </h2>
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
              {verifyError ? <p className="mt-3 text-sm text-[#fca5a5]">{verifyError}</p> : null}
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
          )}
        </section>

        <section className="mt-10 border-t border-white/8 pt-8 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-white/45">Prefer direct contact?</p>
          <a
            href="mailto:hello@donepage.co"
            className="mt-3 inline-block text-lg text-[#CFCFCF] transition-colors duration-200 hover:text-white"
          >
            hello@donepage.co
          </a>
          <p className="mt-3 text-sm leading-7 text-white/55">We usually respond within 24 hours.</p>
        </section>
      </div>
    </main>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import {
  Questionnaire,
  type QuestionnaireAnswers,
} from "@/app/components/questionnaire";

type Plan = "launch" | "growth";
type Stage = "entry" | "lead" | "verify" | "questions";

export default function StartClient() {
  const params = useSearchParams();
  const router = useRouter();
  const plan =
    ((params.get("plan") || "launch").toLowerCase() === "growth"
      ? "growth"
      : "launch") as Plan;
  const forceOpen = params.get("open") === "1";

  const [submitting, setSubmitting] = React.useState(false);
  const [sendingCode, setSendingCode] = React.useState(false);
  const [verifyingCode, setVerifyingCode] = React.useState(false);
  const [leadEmail, setLeadEmail] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [verified, setVerified] = React.useState(false);
  const [stage, setStage] = React.useState<Stage>(forceOpen ? "lead" : "entry");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    async function loadStatus() {
      try {
        const res = await fetch("/api/email-verification/status", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!res.ok || cancelled || !data) return;
        if (data.email) setLeadEmail(data.email);
        if (data.verified) {
          setVerified(true);
          setStage("questions");
        }
      } catch {}
    }
    loadStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("donepage-lead-capture-v2");
      if (!saved) return;
      const parsed = JSON.parse(saved) as { contactEmail?: string };
      if (parsed.contactEmail) setLeadEmail(parsed.contactEmail);
    } catch {}
  }, []);

  React.useEffect(() => {
    if (!forceOpen) return;
    setStage("lead");
  }, [forceOpen]);

  function revealClass(base: string) {
    return `${base} ${hydrated ? "is-visible" : ""}`.trim();
  }

  const handleGenerate = async (answers: QuestionnaireAnswers) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("dp_questionnaire_submitted", {
            detail: { plan, projectId: data.projectId },
          })
        );
      }

      const next =
        data.submittedUrl ||
        `/submitted?plan=${plan}&projectId=${data.projectId}&token=${encodeURIComponent(
          data.token
        )}`;
      router.push(next);
    } catch (error: any) {
      toast.error(error?.message || "Could not submit brief.");
      setSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    const email = leadEmail.trim().toLowerCase();
    if (!email) return;
    setSendingCode(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not send code.");
      try {
        localStorage.setItem(
          "donepage-lead-capture-v2",
          JSON.stringify({ contactEmail: email })
        );
      } catch {}
      setOtpCode("");
      setStage("verify");
      toast.success("Verification code sent.");
    } catch (error: any) {
      toast.error(error?.message || "Could not send code.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = otpCode.trim();
    if (code.length < 6) return;
    setVerifyingCode(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Verification failed.");
      setVerified(true);
      setStage("questions");
      toast.success("Email verified.");
    } catch (error: any) {
      toast.error(error?.message || "Verification failed.");
    } finally {
      setVerifyingCode(false);
    }
  };

  if (stage === "entry") {
    return (
      <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[760px] text-white">
          <div className={revealClass("reveal-up mb-12 flex items-center justify-between")}>
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.22em] text-white/88 transition-opacity duration-200 hover:opacity-100"
            >
              Donepage
            </Link>
          </div>

          <section className={revealClass("reveal-up text-center")}>
            <h1
              className="text-4xl tracking-tight text-white sm:text-5xl"
              style={{
                fontFamily:
                  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
              }}
            >
              Start your page
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#CFCFCF]">
              Turn your idea into a high-converting landing page - in minutes.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#CFCFCF]">
              No templates. No guesswork. Just a structured page built for your offer.
            </p>

            <Button
              type="button"
              onClick={() => setStage("lead")}
              className="mt-8 h-12 rounded-full bg-white px-8 text-base font-semibold text-black shadow-[0_0_32px_rgba(255,255,255,0.14)] hover:bg-white"
            >
              Start My Page
            </Button>
          </section>
        </div>
      </main>
    );
  }

  if (stage === "lead") {
    const canContinue = leadEmail.trim().length > 4 && !sendingCode;

    return (
      <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[760px] text-white">
          <div className={revealClass("reveal-up mb-12 flex items-center justify-between")}>
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.22em] text-white/88 transition-opacity duration-200 hover:opacity-100"
            >
              Donepage
            </Link>
          </div>

          <section
            className={revealClass(
              "reveal-up rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
              Enter your email to continue
            </p>
            <p className="mt-3 text-base leading-7 text-[#CFCFCF]">
              We&apos;ll use this to send your page and updates.
            </p>
            <div className="mt-8 space-y-2">
              <label className="block text-sm font-medium text-white">Email *</label>
              <input
                type="email"
                value={leadEmail}
                onChange={(event) => setLeadEmail(event.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-white/25 focus:bg-[#141414] focus:ring-0"
                placeholder="you@company.com"
              />
            </div>

            <Button
              type="button"
              disabled={!canContinue}
              onClick={handleSendCode}
              className="mt-8 h-12 rounded-full bg-white px-8 text-base font-semibold text-black shadow-[0_0_32px_rgba(255,255,255,0.14)] hover:bg-white"
            >
              {sendingCode ? "Sending..." : "Continue"}
            </Button>
          </section>
        </div>
      </main>
    );
  }

  if (stage === "verify") {
    const canVerify = otpCode.trim().length === 6 && !verifyingCode;
    return (
      <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[760px] text-white">
          <div className={revealClass("reveal-up mb-12 flex items-center justify-between")}>
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.22em] text-white/88 transition-opacity duration-200 hover:opacity-100"
            >
              Donepage
            </Link>
          </div>

          <section
            className={revealClass(
              "reveal-up rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
              Check your email
            </p>
            <p className="mt-3 text-base leading-7 text-[#CFCFCF]">
              We&apos;ve sent a 6-digit code. Enter it below to continue.
            </p>
            <div className="mt-8 space-y-2">
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 text-center text-xl tracking-[0.35em] text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-white/25 focus:bg-[#141414] focus:ring-0"
                placeholder="_ _ _ _ _ _"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                disabled={!canVerify}
                onClick={handleVerifyCode}
                className="h-12 rounded-full bg-white px-8 text-base font-semibold text-black shadow-[0_0_32px_rgba(255,255,255,0.14)] hover:bg-white"
              >
                {verifyingCode ? "Verifying..." : "Verify"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={sendingCode}
                onClick={handleSendCode}
                className="h-12 rounded-full border-white/12 bg-transparent px-8 text-base font-medium text-white hover:bg-white/[0.05]"
              >
                {sendingCode ? "Sending..." : "Resend code"}
              </Button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <Questionnaire
      initialAnswers={{ language: "English", contactEmail: verified ? leadEmail.trim() : "" }}
      onGenerate={handleGenerate}
      submitting={submitting}
    />
  );
}

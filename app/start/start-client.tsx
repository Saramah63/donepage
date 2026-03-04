"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Questionnaire,
  type QuestionnaireAnswers,
} from "@/app/components/questionnaire";

type Plan = "launch" | "growth";

type SubmissionState = {
  orderId: string;
  accessToken: string;
  checkoutUrl: string;
};

const GOAL_LABELS: Record<string, string> = {
  leads: "Lead generation",
  calls: "Booking calls",
  packages: "Sales",
  credibility: "Credibility",
};

const AUDIENCE_LABELS: Record<string, string> = {
  individuals: "Individuals",
  freelancers: "Freelancers",
  "small-business": "Small businesses",
  "medium-business": "Growing companies",
  enterprise: "Enterprise",
};

function planName(plan: Plan) {
  return plan === "growth" ? "Growth" : "Launch";
}

function toWebsiteGoal(answers: QuestionnaireAnswers) {
  const selected =
    Array.isArray(answers.primaryGoals) && answers.primaryGoals.length > 0
      ? answers.primaryGoals
      : answers.primaryGoal
      ? [answers.primaryGoal]
      : [];

  if (selected.length === 0) return "Lead generation";
  return selected.map((goal) => GOAL_LABELS[goal] || goal).join(", ");
}

function toTargetAudience(answers: QuestionnaireAnswers) {
  const key = answers.targetAudience || "small-business";
  return AUDIENCE_LABELS[key] || key;
}

function toDesiredCta(answers: QuestionnaireAnswers) {
  if (answers.ctaPrimaryLabel?.trim()) return answers.ctaPrimaryLabel.trim();
  if (answers.bookingLink?.trim()) return "Book a call";
  if (answers.contactEmail?.trim()) return "Contact us";
  return "Contact us";
}

export default function StartClient() {
  const params = useSearchParams();
  const sessionId = (params.get("session_id") || "").trim();
  const paid = params.get("paid") === "1";
  const paidOrderId = (params.get("order") || "").trim();
  const paidToken = (params.get("token") || "").trim();
  const plan =
    ((params.get("plan") || "launch").toLowerCase() === "growth"
      ? "growth"
      : "launch") as Plan;

  const [submitting, setSubmitting] = React.useState(false);
  const [markingPaid, setMarkingPaid] = React.useState(false);
  const [paymentLinked, setPaymentLinked] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<SubmissionState | null>(null);

  React.useEffect(() => {
    if (!paid || !paidOrderId || !sessionId) return;
    let cancelled = false;
    (async () => {
      setMarkingPaid(true);
      try {
        await fetch("/api/order/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: paidOrderId, sessionId }),
        });
        if (!cancelled) setPaymentLinked(true);
      } catch {
        // no-op, preview link still works for user
      } finally {
        if (!cancelled) setMarkingPaid(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paid, paidOrderId, sessionId]);

  const handleGenerate = async (answers: QuestionnaireAnswers) => {
    const customerEmail = (answers.contactEmail || "").trim().toLowerCase();
    const businessName = (answers.businessName || "").trim();
    const mainOffer = (answers.primaryOffer || answers.customServices || "").trim();
    const problemSolved = (answers.problemStatement || "").trim();

    if (!customerEmail || !businessName || !mainOffer || !problemSolved) {
      toast.error(
        "Please complete required fields: business name, contact email, primary offer, and problem statement."
      );
      throw new Error("Missing required fields");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paid: "0",
          sessionId: "",
          plan,
          customerEmail,
          customerName: "",
          businessName,
          websiteGoal: toWebsiteGoal(answers),
          targetAudience: toTargetAudience(answers),
          mainOffer,
          problemSolved,
          desiredCTA: toDesiredCta(answers),
          brandColors: "",
          domain: "",
          deadline: "normal",
          fullAnswers: answers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");

      setSubmitted({
        orderId: data.orderId,
        accessToken: data.accessToken,
        checkoutUrl: data.checkoutUrl,
      });
      toast.success("Brief submitted.");
    } catch (error: any) {
      toast.error(error?.message || "Could not submit brief.");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  if (paid && paidOrderId && paidToken) {
    const previewUrl = `/preview?order=${encodeURIComponent(
      paidOrderId
    )}&token=${encodeURIComponent(paidToken)}`;

    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Card>
          <CardContent className="p-7">
            <h1 className="text-2xl font-semibold">Payment received</h1>
            <p className="mt-3 text-gray-700">
              Your payment is confirmed. Your draft is now available.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {markingPaid
                ? "Linking payment..."
                : paymentLinked
                ? "Order updated for QA."
                : ""}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href={previewUrl}>View Draft</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (submitted) {
    const previewUrl = `/preview?order=${encodeURIComponent(
      submitted.orderId
    )}&token=${encodeURIComponent(submitted.accessToken)}`;

    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Card>
          <CardContent className="p-7">
            <h1 className="text-2xl font-semibold">Thank you</h1>
            <p className="mt-3 text-gray-700">
              Your full brief has been submitted. Complete payment to unlock your private draft preview.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              After payment you will be redirected back here and can open your draft.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild>
                <a href={submitted.checkoutUrl}>Pay for {planName(plan)} {plan === "growth" ? "€249" : "€99"}</a>
              </Button>
              <Button asChild variant="outline">
                <Link href={previewUrl}>I already paid, open draft</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div>
      <Questionnaire onGenerate={handleGenerate} />
      {submitting ? <div className="sr-only">Submitting</div> : null}
    </div>
  );
}

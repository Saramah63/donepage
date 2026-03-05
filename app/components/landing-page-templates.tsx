"use client";

import * as React from "react";
import { LandingPagePreview } from "@/app/components/landing-page-preview";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import type { DraftOverrides } from "@/app/lib/draft-content";

type TemplateId = "A" | "B" | "C";

type Props = {
  answers: QuestionnaireAnswers;
  onEdit: () => void;
  mode?: "preview" | "export";
  slug?: string;
  autoOpenPublish?: boolean;
  publishHint?: "custom" | "subdomain" | null;
  overrides?: DraftOverrides;
  onInlineEdit?: (section: string, field: string, value: string, index?: number) => void;
  templateId: TemplateId;
};

export function TemplateA(props: Omit<Props, "templateId">) {
  return <LandingPagePreview {...props} templateId="A" />;
}

export function TemplateB(props: Omit<Props, "templateId">) {
  return <LandingPagePreview {...props} templateId="B" />;
}

export function TemplateC(props: Omit<Props, "templateId">) {
  return <LandingPagePreview {...props} templateId="C" />;
}

export function TemplateRenderer(props: Props) {
  if (props.templateId === "B") return <TemplateB {...props} />;
  if (props.templateId === "C") return <TemplateC {...props} />;
  return <TemplateA {...props} />;
}

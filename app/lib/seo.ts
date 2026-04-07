// app/lib/seo.ts
import { QuestionnaireAnswers } from "@/app/components/questionnaire";

export function generateSEO(answers: QuestionnaireAnswers) {
  const serviceMap: Record<string, string> = {
    consulting: "Business Consulting",
    coaching: "Coaching & Training",
    design: "Design Services",
    development: "Web Development",
    marketing: "Marketing Services",
    creative: "Creative Services",
    legal: "Legal Services",
    accounting: "Accounting & Finance",
  };

  const service = serviceMap[answers.serviceType || ""] ?? "Professional Services";
  const audience = String(answers.targetAudience || "clients").replace("-", " ");
  const differentiator = String(answers.keyDifferentiator || "results").replace("-", " ");

  const title = `${service} for ${audience} | Donepage`;
  const description = `Expert ${service.toLowerCase()} tailored for ${audience}. ${differentiator} approach.`;

  return {
    title,
    description,
    keywords: [
      service,
      audience,
      answers.primaryGoal || "conversion",
      differentiator,
      "landing page",
      "services",
    ].join(", "),
    og: {
      title,
      description,
      type: "website",
    },
  };
}

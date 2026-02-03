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

  const service = serviceMap[answers.serviceType] ?? "Professional Services";

  const title = `${service} for ${answers.targetAudience.replace("-", " ")} | Donepage`;
  const description = `Expert ${service.toLowerCase()} tailored for ${
    answers.targetAudience
  }. ${answers.keyDifferentiator.replace("-", " ")} approach.`;

  return {
    title,
    description,
    keywords: [
      service,
      answers.targetAudience,
      answers.primaryGoal,
      answers.keyDifferentiator,
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

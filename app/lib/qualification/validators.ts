import { z } from "zod";

const industryEnum = z.enum([
  "coach_consultant",
  "agency_services",
  "saas_b2b",
  "local_services",
  "ecommerce_brand",
  "real_estate",
  "education_courses",
  "wellness_fitness",
  "legal_immigration_general",
  "b2b_services_manufacturing",
  "generic",
]);

export const contextSchema = z.object({
  industry: industryEnum,
  language: z.string().optional(),
  audience: z.string().optional(),
  offerType: z.string().optional(),
  avgDealSize: z.string().optional(),
});

export const qualifyBodySchema = z.object({
  slug: z.string().min(2).max(80),
  context: contextSchema,
  answers: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
  ),
  email: z.string().email().optional(),
  consentToStore: z.boolean().optional(),
  visitor: z
    .object({
      ip: z.string().optional(),
      userAgent: z.string().optional(),
    })
    .optional(),
});

export type QualifyBody = z.infer<typeof qualifyBodySchema>;

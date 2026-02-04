import { notFound } from "next/navigation";
import { getAnswersBySlug, resolveEditToken } from "@/app/lib/answers-store";
import EditClient from "./edit-client";
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  // 1) Verify token (server-side gate)
  const check = await resolveEditToken(slug, token || "");
  if (!check.ok) {
    // intentionally NOT leaking details about token validation
    return (
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Invalid or expired edit link</h1>
        <p className="mt-3 text-sm text-gray-600">
          This edit link is not valid anymore. Ask for a new edit link or republish.
        </p>
      </div>
    );
  }

  // 2) Load saved answers
  const stored = await getAnswersBySlug(slug);
  const initialAnswers = (stored?.answers ?? null) as QuestionnaireAnswers | null;

  if (!initialAnswers) {
    // slug exists for token but answers missing => treat as not found
    return notFound();
  }

  return (
    <EditClient
      slug={slug}
      token={token || ""}
      initialAnswers={initialAnswers}
    />
  );
}

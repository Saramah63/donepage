import { getAnswersBySlug } from "@/app/lib/answers-store";
import SlugClient from "./slug-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const stored = await getAnswersBySlug(slug);

  return <SlugClient slug={slug} initialAnswers={stored?.answers ?? null} />;
}

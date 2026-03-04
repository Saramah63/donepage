import { NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/app/lib/project-store";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
};

function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    const projectId = (body?.projectId || "").trim();
    const token = (body?.token || "").trim();

    if (!projectId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const base = getBaseUrl();
    const publishedUrl = `${base}/preview/${projectId}?token=${encodeURIComponent(token)}&mode=published`;

    const updated = await updateProject(projectId, {
      status: "published",
      publishedUrl,
    });

    return NextResponse.json({ ok: true, publishedUrl: updated?.publishedUrl ?? publishedUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

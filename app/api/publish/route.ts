import { NextResponse } from "next/server";
import { createEvent, getProjectById, updateProject } from "@/app/lib/project-store";
import { smartPublishCheck } from "@/app/lib/draft-validate";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  token?: string;
  publishTarget?: "subdomain" | "custom_domain";
  domain?: string | null;
};

function getBaseUrl(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto") ??
    new URL(req.url).protocol.replace(":", "");
  if (host) return `${proto}://${host}`;
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
    const publishTarget = body?.publishTarget ?? "subdomain";
    const domain = (body?.domain || "").trim();

    if (!projectId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project || project.accessToken !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (project.paymentStatus !== "paid") {
      return NextResponse.json({ error: "Payment required" }, { status: 402 });
    }

    const validation = smartPublishCheck(project.draftContent as any);
    if (validation.status === "blocking") {
      return NextResponse.json(
        {
          error: "Draft validation failed",
          code: "DRAFT_INVALID",
          issues: validation.issues,
          status: validation.status,
        },
        { status: 400 }
      );
    }

    let finalTarget: "subdomain" | "custom_domain" = publishTarget;
    if (publishTarget === "custom_domain") {
      if (project.plan !== "growth") {
        return NextResponse.json(
          { error: "Custom domain not included in this plan" },
          { status: 400 }
        );
      }
      const finalDomain = domain || project.domain || "";
      if (!finalDomain) {
        return NextResponse.json({ error: "Domain required" }, { status: 400 });
      }
      if (project.dnsStatus !== "verified") {
        finalTarget = "subdomain";
      }
    }

    const base = getBaseUrl(req);
    const subdomainUrl = `https://${project.id}.donepage.co`;
    const publishedUrl =
      finalTarget === "custom_domain"
        ? `https://${(domain || project.domain || "").replace(/^https?:\/\//, "")}`
        : subdomainUrl;

    await updateProject(projectId, { publishStatus: "publishing" });

    const updated = await updateProject(projectId, {
      status: "published",
      publishStatus: "published",
      publishedUrl,
      publishTarget: finalTarget,
      domain: domain || project.domain || null,
    });

    await createEvent({
      projectId,
      type: "page_published",
      message: "Landing page published.",
      metadata: { publishedUrl, publishTarget: finalTarget },
    });

    return NextResponse.json({
      ok: true,
      publishStatus: updated?.publishStatus ?? "published",
      publishedUrl,
      publishTarget: finalTarget,
      base,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

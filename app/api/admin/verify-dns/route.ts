import { NextResponse } from "next/server";
import { updateProject } from "@/app/lib/project-store";

export const runtime = "nodejs";

type Body = { projectId?: string };

function isAuthorized(req: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return false;
  const url = new URL(req.url);
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("token");
  return token === adminToken;
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const ctype = req.headers.get("content-type") || "";
    let projectId = "";
    if (ctype.includes("application/json")) {
      const body = (await req.json().catch(() => null)) as Body | null;
      projectId = (body?.projectId || "").trim();
    } else {
      const fd = await req.formData();
      projectId = String(fd.get("projectId") || "").trim();
    }
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }
    const updated = await updateProject(projectId, { dnsStatus: "verified" });
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, project: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

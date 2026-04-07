import { NextRequest, NextResponse } from "next/server";
import authMiddleware from "next-auth/middleware";
import { getDomainMapping } from "@/app/lib/domain-store";

const INTERNAL_HOSTS = new Set([
  "donepage.co",
  "www.donepage.co",
]);

function isAsset(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/static")
  );
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const authHeader = req.headers.get("authorization");
    const username = process.env.ADMIN_USER?.trim();
    const password = process.env.ADMIN_PASS?.trim();

    if (!username || !password) {
      return unauthorized();
    }

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return unauthorized();
    }

    const base64Credentials = authHeader.split(" ")[1] || "";
    const decoded = atob(base64Credentials);
    const [user, pass] = decoded.split(":");

    if (user !== username || pass !== password) {
      return unauthorized();
    }
  }

  if (isAsset(pathname)) return NextResponse.next();

  // Protect generator/edit routes with NextAuth
  if (pathname.startsWith("/generator") || pathname.startsWith("/edit")) {
    return authMiddleware(req as any);
  }

  const hostHeader = req.headers.get("host") || "";
  const host = hostHeader.split(":")[0].toLowerCase();
  if (!host) return NextResponse.next();

  const isLocal = host.includes("localhost") || host.startsWith("127.0.0.1");
  const isVercel = host.endsWith(".vercel.app");

  // Subdomain routing: {slug}.donepage.co => /{slug}
  if (host.endsWith(".donepage.co") && !INTERNAL_HOSTS.has(host)) {
    const sub = host.replace(".donepage.co", "");
    if (sub) {
      const mapping = await getDomainMapping(host);
      const targetSlug = mapping?.slug || sub;
      const url = req.nextUrl.clone();
      url.pathname = `/${targetSlug}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Custom domain routing: map host => slug (KV)
  if (!isLocal && !isVercel && !INTERNAL_HOSTS.has(host)) {
    const mapping = await getDomainMapping(host);
    if (mapping?.slug) {
      const url = req.nextUrl.clone();
      url.pathname = `/${mapping.slug}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

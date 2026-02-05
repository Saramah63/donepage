import authMiddleware from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const host = new URL(req.url).host.toLowerCase();
  if (host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }
  return authMiddleware(req as any);
}

export const config = {
  matcher: ["/generator/:path*", "/edit/:path*"],
};

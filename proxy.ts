import authMiddleware from "next-auth/middleware";
import { NextResponse } from "next/server";

export default function middleware(req: Request) {
  const host = new URL(req.url).host.toLowerCase();
  if (host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }
  return authMiddleware(req);
}

export const config = {
  matcher: ["/generator/:path*", "/edit/:path*"],
};

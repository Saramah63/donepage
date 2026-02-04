import authMiddleware from "next-auth/middleware";

export default authMiddleware;

export const config = {
  matcher: ["/generator/:path*", "/edit/:path*"],
};

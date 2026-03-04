export function isAdminAuthorized(req: Request, searchParams?: URLSearchParams) {
  const expected = process.env.ADMIN_TOKEN?.trim();
  if (!expected) return false;

  const fromQuery = searchParams?.get("token")?.trim() || "";
  if (fromQuery && fromQuery === expected) return true;

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Bearer ") && header.slice(7).trim() === expected) return true;

  return false;
}

export function hasAdminToken(token: string | null | undefined) {
  const expected = process.env.ADMIN_TOKEN?.trim();
  if (!expected) return false;
  return (token || "").trim() === expected;
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "ADMIN" | "USER" | "VIEWER";

function cookie(req: NextRequest, name: string) {
  return req.cookies.get(name)?.value ?? "";
}

function isLoggedIn(req: NextRequest) {
  return Boolean(cookie(req, "rd_auth"));
}

function roleOf(req: NextRequest): Role | "" {
  const r = cookie(req, "rd_role");
  return r === "ADMIN" || r === "USER" || r === "VIEWER" ? r : "";
}

function canAccess(path: string, role: Role) {
  if (role === "ADMIN") return true;

  if (path === "/dashboard" || path.startsWith("/dashboard/")) return true;

  if (path === "/control" || path.startsWith("/control/")) return role === "USER";

  if (path.startsWith("/settings")) return false;

  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow login + static + mock
  if (
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/mock") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (!isLoggedIn(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = roleOf(req);
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!canAccess(pathname, role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/control/:path*", "/settings/:path*"],
};
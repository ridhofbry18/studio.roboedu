import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuthRoute) return;

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return;
  }

  if (!isLoggedIn && (isDashboardPage || isAdminPage)) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  if (isAdminPage && isLoggedIn) {
    const role = (req.auth?.user as any)?.role;
    if (role !== "super_admin" && role !== "supervisor") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

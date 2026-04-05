import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware to enforce authentication.
 * Checks for the 'alms_session' cookie on protected routes.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("alms_session")?.value;

  // 1. Define Public and Protected paths
  const isLoginPage = pathname === "/login";
  
  // Paths under the (dashboard) group (note: they don't have /dashboard prefix in URL)
  const protectedPaths = [
    "/dashboard",
    "/accounts",
    "/approvals",
    "/assets",
    "/customers",
    "/expenses",
    "/general-ledger",
    "/loans",
    "/profile",
    "/reports",
  ];

  const isProtectedRoute = protectedPaths.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 2. Redirect logic
  if (isProtectedRoute && !session) {
    // Not logged in -> Redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && session) {
    // Already logged in -> Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

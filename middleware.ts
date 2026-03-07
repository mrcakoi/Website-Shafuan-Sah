import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and the login page
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Protect /admin routes with a simple auth cookie set on login
  if (pathname.startsWith("/admin")) {
    const isLoggedIn = request.cookies.get("portfolio-auth")?.value === "1";

    if (!isLoggedIn) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


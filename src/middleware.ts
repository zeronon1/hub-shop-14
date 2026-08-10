import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, COOKIE_OPTIONS, isAuthenticated } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const loggedIn = await isAuthenticated(request);

    if (!loggedIn) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      if (token) {
        response.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

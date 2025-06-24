import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "./lib/config";

export async function middleware(request: NextRequest) {
  const protectedRoutes = ["/dashboard", "/select-profile"];
  const url = request.nextUrl.clone();
  const path = url.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  let isAuthenticated = false;

  if (accessToken) {
    try {
      const verifyResponse = await fetch(
        `${API_URL}/auth/validate-access-token`,
        {
          method: "POST",
          headers: {
            cookie: `accessToken=${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (verifyResponse.ok) {
        isAuthenticated = true;
      }
    } catch (err) {
      console.error("[Middleware] Error verifying token:", err);
    }
  }

  if (!isProtectedRoute && isAuthenticated && path === "/") {
    return NextResponse.redirect(new URL("/select-profile", request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/select-profile"],
};

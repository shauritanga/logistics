import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiAuthPrrefix, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Check for both prefixed and non-prefixed versions of the cookie
  const authToken =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  const isLoggedIn = !!authToken;
  console.log("Is logged in:", isLoggedIn);

  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

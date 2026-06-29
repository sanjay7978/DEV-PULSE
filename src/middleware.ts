import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasValidSession = await isValidSessionToken(sessionToken);

  if (request.nextUrl.pathname === "/" && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard") && !hasValidSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

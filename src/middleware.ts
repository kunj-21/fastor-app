import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "fastor_token";
const PROTECTED = ["/home", "/product"];
const AUTH_PAGES = ["/login", "/otp"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loggedIn = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);

  if (!loggedIn && PROTECTED.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (loggedIn && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/home/:path*", "/product/:path*", "/login", "/otp"] };

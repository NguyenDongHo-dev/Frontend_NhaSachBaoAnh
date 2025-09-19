import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("refresh_token")?.value;

  const publicRoutes = ["/dang-nhap", "/dang-ki"];

  if (token && publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const privateRoutes = ["/profile", "/order", "/thanh-toan"];

  if (!token && privateRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dang-nhap", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

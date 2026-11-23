
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep the login page public
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    jwt.verify(token, secret);

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.delete("accessToken");

    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

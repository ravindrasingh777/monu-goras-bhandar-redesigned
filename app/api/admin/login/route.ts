"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/index";
import { eq, and } from "drizzle-orm";
import { users } from "../../../../db/schema";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const isExistUser = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)));

    if (!isExistUser || isExistUser.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 404 },
      );
    }

    // Placeholder for actual authentication logic
    if (isExistUser.length > 0) {
      const user = isExistUser[0];
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { email: user.email, name: user.name },
        jwtSecret!,
        {
          expiresIn: "1h",
        },
      );
      const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 },
      );

      response.cookies.set("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });

      return response;
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}

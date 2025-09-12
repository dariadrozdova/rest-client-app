import { NextRequest, NextResponse } from "next/server";

import { adminAuth } from "@/shared/lib/firebase/admin";

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SECONDS_IN_DAY = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;
const DEFAULT_SESSION_DAYS = 7;
const MILLISECONDS_IN_SECOND = 1000;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const sessionMaxAgeSeconds =
      Number(process.env.SESSION_MAX_AGE) ||
      DEFAULT_SESSION_DAYS * SECONDS_IN_DAY;

    const expiresIn = sessionMaxAgeSeconds * MILLISECONDS_IN_SECOND;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(process.env.SESSION_NAME ?? "session", sessionCookie, {
      httpOnly: true,
      maxAge: sessionMaxAgeSeconds,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error, stringError: error?.toString() },
      { status: 401 },
    );
  }
}

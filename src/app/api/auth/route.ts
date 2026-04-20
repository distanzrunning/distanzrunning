// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  STAGING_COOKIE,
  STAGING_COOKIE_MAX_AGE,
  signStagingCookie,
  verifyStagingCookie,
} from "@/lib/staging-auth";

function requireAuthEnv():
  | { ok: true; password: string; secret: string }
  | { ok: false } {
  const password = process.env.STAGING_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!password || !secret) return { ok: false };
  return { ok: true, password, secret };
}

export async function POST(request: NextRequest) {
  const env = requireAuthEnv();
  if (!env.ok) {
    return NextResponse.json(
      { success: false, message: "Auth not configured" },
      { status: 500 },
    );
  }

  let password: string | undefined;
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body?.password === "string") password = body.password;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }

  if (password !== env.password) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 },
    );
  }

  const signed = await signStagingCookie(env.secret);
  const response = NextResponse.json({ success: true });
  response.cookies.set(STAGING_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: STAGING_COOKIE_MAX_AGE,
  });
  return response;
}

// Kept for callers that still want to poll auth status (middleware is now
// the primary gate). Returns false if env is missing so nothing silently
// authenticates.
export async function GET(request: NextRequest) {
  const env = requireAuthEnv();
  if (!env.ok) {
    return NextResponse.json({ authenticated: false });
  }
  const cookie = request.cookies.get(STAGING_COOKIE)?.value;
  const authenticated = await verifyStagingCookie(cookie, env.secret);
  return NextResponse.json({ authenticated });
}

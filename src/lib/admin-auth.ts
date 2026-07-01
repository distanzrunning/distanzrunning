import { scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "distanz-admin";

/** Derive the opaque admin-session cookie value from the password using scrypt
 *  with a per-deployment secret as the salt/pepper. Deterministic for a given
 *  (password, secret), so the login-time and verify-time derivations match.
 *  scrypt's work factor removes the offline brute-force path a plain SHA-256
 *  cookie exposed. */
function deriveCookie(password: string, secret: string): string {
  return scryptSync(password, secret, 32).toString("hex");
}

/** Expected cookie value for the configured password, or null when auth is not
 *  fully configured (missing ADMIN_PASSWORD or ADMIN_AUTH_SECRET). Callers
 *  treat null as "fail closed" — no valid session can exist. */
function expectedCookieValue(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!password || !secret) return null;
  return deriveCookie(password, secret);
}

/** Cookie value to set at login. Requires ADMIN_AUTH_SECRET; throws if it is
 *  missing so a misconfigured deployment fails loudly at login rather than
 *  silently issuing a weak/forgeable cookie. */
export function adminCookieValueFor(password: string): string {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_AUTH_SECRET is not set — refusing to derive an admin session cookie.",
    );
  }
  return deriveCookie(password, secret);
}

export function passwordIsValid(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || !password) return false;
  if (password.length !== configured.length) return false;
  let diff = 0;
  for (let i = 0; i < password.length; i++) {
    diff |= password.charCodeAt(i) ^ configured.charCodeAt(i);
  }
  return diff === 0;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = expectedCookieValue();
  if (!expected) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  // Constant-time compare. timingSafeEqual throws on length mismatch, so guard
  // length first (the token is attacker-controlled; expected is always 64 hex).
  const presented = Buffer.from(token);
  const wanted = Buffer.from(expected);
  if (presented.length !== wanted.length) return false;
  return timingSafeEqual(presented, wanted);
}

import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "distanz-admin";

function expectedCookieValue(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`${password}:distanz-admin`).digest("hex");
}

export function adminCookieValueFor(password: string): string {
  return createHash("sha256").update(`${password}:distanz-admin`).digest("hex");
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
  return token === expected;
}

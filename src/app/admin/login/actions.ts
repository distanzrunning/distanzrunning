"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  adminCookieValueFor,
  passwordIsValid,
} from "@/lib/admin-auth";

export async function login(
  _prevState: { error: string | null } | undefined,
  formData: FormData,
): Promise<{ error: string | null }> {
  const password = String(formData.get("password") ?? "");
  if (!passwordIsValid(password)) {
    return { error: "Incorrect password" };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, adminCookieValueFor(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    // 8 hours — expires during/after a working day, forcing a fresh login
    // rather than carrying access across multiple days.
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

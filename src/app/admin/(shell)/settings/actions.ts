"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isValidTimezone } from "@/lib/site-settings";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function saveTimezone(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const tz = String(formData.get("timezone") ?? "").trim();
  if (!tz || !isValidTimezone(tz)) {
    throw new Error("Invalid timezone");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({ timezone: tz, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("[settings] saveTimezone failed", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
  // Consent dashboard buckets rows by the business timezone, so its
  // cached output is now stale.
  revalidatePath("/admin/consent");
}

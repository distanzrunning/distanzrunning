"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function deleteConsentRecordsByAnonId(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const anonId = String(formData.get("anonId") ?? "").trim();
  if (!anonId) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("consent_records")
    .delete()
    .eq("anon_id", anonId);

  if (error) {
    console.error("[consent] delete failed", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/consent");
  redirect("/admin/consent");
}

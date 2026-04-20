"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function deleteFeedbackRecord(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const raw = String(formData.get("id") ?? "").trim();
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid feedback id");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("feedback_records")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[feedback] delete failed", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/feedback");
}

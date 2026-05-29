"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { CONSENT_CACHE_TAG } from "./data";

export async function deleteConsentRecordsByAnonId(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const anonId = String(formData.get("anonId") ?? "").trim();
  if (!anonId) return;

  const supabase = getSupabaseAdmin();
  // `.select("id")` makes the delete RETURNING — atomic count of
  // exactly what was removed, no race with a separate count query.
  const { data: deleted, error } = await supabase
    .from("consent_records")
    .delete()
    .eq("anon_id", anonId)
    .select("id");

  if (error) {
    console.error("[consent] delete failed", error);
    throw new Error(error.message);
  }

  // Audit the deletion. Best-effort write — if the log insert fails
  // we still consider the user-facing delete successful, but log the
  // discrepancy so it shows up in runtime logs for investigation.
  const deletedCount = deleted?.length ?? 0;
  const { error: logError } = await supabase
    .from("consent_deletion_log")
    .insert({
      anon_id: anonId,
      deleted_count: deletedCount,
      // deleted_by stays null for now — single-admin auth doesn't
      // identify individuals. Populate once multi-user auth lands.
    });
  if (logError) {
    console.error(
      "[consent] deletion log insert failed (delete still applied)",
      logError,
    );
  }

  // Invalidate every cached consent-data entry (rows + earliest)
  // so the dashboard reflects the deletion on the next render.
  revalidateTag(CONSENT_CACHE_TAG);
  revalidatePath("/admin/consent");
  redirect("/admin/consent");
}

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { CONSENT_CACHE_TAG } from "./data";

// DSAR erasure for a c15t subject. The form field is still named `anonId` for
// compatibility with DeleteIdButton; its value is the c15t subject id (sub_xxx).
export async function deleteConsentRecordsByAnonId(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const subjectId = String(formData.get("anonId") ?? "").trim();
  if (!subjectId) return;

  const supabase = getSupabaseAdmin();

  // Delete consent rows first (RETURNING gives an atomic count of exactly what
  // was removed). The FKs are ON DELETE RESTRICT, so child rows (consent +
  // audit log) MUST go before the subject row.
  const { data: deleted, error } = await supabase
    .from("c15t_consent")
    .delete()
    .eq("subjectId", subjectId)
    .select("id");

  if (error) {
    console.error("[consent] delete failed", error);
    throw new Error(error.message);
  }

  const { error: auditError } = await supabase
    .from("c15t_auditLog")
    .delete()
    .eq("subjectId", subjectId);
  if (auditError) {
    console.error("[consent] audit-log delete failed", auditError);
  }

  const { error: subjectError } = await supabase
    .from("c15t_subject")
    .delete()
    .eq("id", subjectId);
  if (subjectError) {
    console.error("[consent] subject delete failed", subjectError);
  }

  // Audit the deletion. Best-effort — the user-facing delete is already done.
  const deletedCount = deleted?.length ?? 0;
  const { error: logError } = await supabase
    .from("consent_deletion_log")
    .insert({ anon_id: subjectId, deleted_count: deletedCount });
  if (logError) {
    console.error(
      "[consent] deletion log insert failed (delete still applied)",
      logError,
    );
  }

  revalidateTag(CONSENT_CACHE_TAG);
  revalidatePath("/admin/consent");
  redirect("/admin/consent");
}

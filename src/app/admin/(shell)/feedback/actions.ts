"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

import { FEEDBACK_CACHE_TAG } from "./data";

/** Toggle the contacted_at flag on a single feedback row. Reads the
 *  current value first so the UI can call this idempotently without
 *  branching on state — the action does the right thing either way. */
export async function toggleFeedbackContacted(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const raw = String(formData.get("id") ?? "").trim();
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid feedback id");
  }

  const supabase = getSupabaseAdmin();
  const { data: current, error: readError } = await supabase
    .from("feedback_records")
    .select("contacted_at")
    .eq("id", id)
    .maybeSingle();
  if (readError) {
    console.error("[feedback] contacted read failed", readError);
    throw new Error(readError.message);
  }
  if (!current) {
    throw new Error("Feedback row not found");
  }

  const next = current.contacted_at ? null : new Date().toISOString();
  const { error: writeError } = await supabase
    .from("feedback_records")
    .update({ contacted_at: next })
    .eq("id", id);
  if (writeError) {
    console.error("[feedback] contacted write failed", writeError);
    throw new Error(writeError.message);
  }

  revalidateTag(FEEDBACK_CACHE_TAG);
  revalidatePath("/admin/feedback");
}

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
  // `.select("id, anon_id, emotion")` makes the delete RETURNING —
  // captures the row's identifying fields at delete time so the
  // audit row is self-contained even after the original is gone.
  const { data: deleted, error } = await supabase
    .from("feedback_records")
    .delete()
    .eq("id", id)
    .select("id, anon_id, emotion");

  if (error) {
    console.error("[feedback] delete failed", error);
    throw new Error(error.message);
  }

  // Audit the deletion. Best-effort write — if the log insert fails
  // we still consider the user-facing delete successful, but log the
  // discrepancy so it shows up in runtime logs for investigation.
  const removed = deleted?.[0];
  if (removed) {
    const { error: logError } = await supabase
      .from("feedback_deletion_log")
      .insert({
        feedback_id: removed.id,
        anon_id: removed.anon_id,
        emotion: removed.emotion,
        // deleted_by stays null for now — single-admin auth doesn't
        // identify individuals. Populate once multi-user auth lands.
      });
    if (logError) {
      console.error(
        "[feedback] deletion log insert failed (delete still applied)",
        logError,
      );
    }
  }

  revalidateTag(FEEDBACK_CACHE_TAG);
  revalidatePath("/admin/feedback");
}

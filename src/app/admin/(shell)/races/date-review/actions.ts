"use server";

// src/app/admin/(shell)/races/date-review/actions.ts
//
// Server actions for the Race Date Review queue.
//
// approveSuggestion → copies the (optionally overridden) suggested
//   date into eventDate and clears all 4 suggestion fields. Setting
//   status back to undefined re-enables the race for the next scrape
//   cycle (it'll be eligible again the next time eventDate is in
//   the past).
// rejectSuggestion  → marks status="rejected" so the scraper skips
//   this race until an editor manually clears the status in Studio.
//
// Both actions are auth-gated by isAdminAuthenticated and call
// revalidatePath so the page re-renders without the just-decided
// row.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "next-sanity";

import { isAdminAuthenticated } from "@/lib/admin-auth";

const REVIEW_PATH = "/admin/races/date-review";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function approveSuggestion(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  // Editor can nudge the date in the row's date input before
  // approving — overrideDate is the YYYY-MM-DD they want to write.
  const overrideDate = String(formData.get("overrideDate") ?? "").trim();
  if (!id) throw new Error("Missing race id");

  // Pull the current suggestion to fall back to if the editor
  // didn't override. Defensive — a stale tab might be approving a
  // suggestion that's already been processed; if so, the field is
  // already cleared and we should bail.
  const race = await sanityClient.fetch<{ suggestedNextDate?: string } | null>(
    `*[_id == $id][0]{ suggestedNextDate }`,
    { id },
  );
  if (!race?.suggestedNextDate && !overrideDate) {
    throw new Error("No suggestion to approve — was it already processed?");
  }

  // Normalize override (YYYY-MM-DD from <input type="date">) to a
  // datetime at noon UTC, matching how the scraper writes
  // suggestedNextDate.
  const finalDate = overrideDate
    ? `${overrideDate}T12:00:00Z`
    : race!.suggestedNextDate!;

  await sanityClient
    .patch(id)
    .set({ eventDate: finalDate })
    .unset([
      "suggestedNextDate",
      "suggestedNextDateScrapedAt",
      "suggestedNextDateSourceQuote",
      "suggestedNextDateStatus",
    ])
    .commit();

  revalidatePath(REVIEW_PATH);
}

export async function rejectSuggestion(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing race id");

  await sanityClient
    .patch(id)
    .set({ suggestedNextDateStatus: "rejected" })
    .commit();

  revalidatePath(REVIEW_PATH);
}

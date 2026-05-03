"use server";

// src/app/admin/(shell)/races/date-review/actions.ts
//
// Server actions for the Race Date Review queue.
//
// scanRace            → fetch + Haiku-extract for one race. Used
//                       by the per-row Scan button. Returns the
//                       RaceResult so the client can toast/alert
//                       outcomes that don't write to Sanity
//                       (no_date_found, fetch_error, …).
// approveSuggestion   → copies the (optionally overridden) suggested
//                       date into eventDate and clears all 4 suggestion
//                       fields. Setting status back to undefined
//                       re-enables the race for the next scrape cycle.
// rejectSuggestion    → marks status="rejected" so the scraper skips
//                       this race until an editor manually clears or
//                       the Reset action below runs.
// resetSuggestion     → clears suggestedNextDateStatus + the 3
//                       suggestion fields entirely. Used to take
//                       a "rejected" race back to scannable.
//
// All actions are auth-gated by isAdminAuthenticated and call
// revalidatePath so the page re-renders without the just-decided
// row.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "next-sanity";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { processRace, type RaceResult } from "@/lib/raceDateRefresh";

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

// Lazy-load helper for the row expander. The page query
// deliberately omits lastScanLog (it's a 5–20 KB JSON blob per
// race that would balloon page weight at scale); when the editor
// clicks a row's chevron we fetch just that race's log here.
// Returns null when the race has never been scanned.
export async function getScanLog(id: string): Promise<string | null> {
  await requireAdmin();
  if (!id) return null;
  const result = await sanityClient.fetch<{ lastScanLog?: string } | null>(
    `*[_id == $id][0]{ lastScanLog }`,
    { id },
  );
  return result?.lastScanLog ?? null;
}

export async function scanRace(formData: FormData): Promise<RaceResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing race id");

  const race = await sanityClient.fetch<{
    _id: string;
    title: string;
    eventDate: string;
    officialWebsite: string;
  } | null>(
    `*[_id == $id][0]{ _id, title, eventDate, officialWebsite }`,
    { id },
  );

  if (!race) {
    throw new Error("Race not found");
  }
  if (!race.officialWebsite) {
    throw new Error("Race has no officialWebsite — can't scan");
  }

  const result = await processRace(race, { dryRun: false });
  revalidatePath(REVIEW_PATH);
  return result;
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

// Manual override path — editor sets eventDate directly without
// going through the suggestion workflow. Used by the scannable
// row's Calendar+Approve combo when the editor already knows the
// date and doesn't want to wait for a scan.
export async function approveManualDate(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  if (!id) throw new Error("Missing race id");
  if (!date) throw new Error("Missing date");

  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date");
  }

  await sanityClient
    .patch(id)
    .set({ eventDate: `${date}T12:00:00Z` })
    // Defensive — if the race had previous suggestion fields
    // lying around (rejected status etc.), wipe them so the row
    // isn't half-stateful after the manual override.
    .unset([
      "suggestedNextDate",
      "suggestedNextDateScrapedAt",
      "suggestedNextDateSourceQuote",
      "suggestedNextDateStatus",
    ])
    .commit();

  revalidatePath(REVIEW_PATH);
}

export async function resetSuggestion(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing race id");

  await sanityClient
    .patch(id)
    .unset([
      "suggestedNextDate",
      "suggestedNextDateScrapedAt",
      "suggestedNextDateSourceQuote",
      "suggestedNextDateStatus",
    ])
    .commit();

  revalidatePath(REVIEW_PATH);
}

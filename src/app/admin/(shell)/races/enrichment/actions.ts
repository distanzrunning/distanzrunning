"use server";

// src/app/admin/(shell)/races/enrichment/actions.ts
//
// Server actions for the Race Enrichment review queue (Plan 017).
//
// scanRaceEnrichment  → Wikipedia discovery + Haiku extraction for
//                       one race; writes pending per-field
//                       suggestions. Returns the result so the
//                       client can toast non-writing outcomes.
// approveSuggestion   → copies one suggestion's value into its real
//                       field (numeric fields cast) and removes the
//                       suggestion entry.
// rejectSuggestion    → marks the entry status="rejected"; the
//                       scanner won't re-suggest the same value for
//                       that field again.
// clearSuggestion     → removes an entry entirely (used on rejected
//                       rows to make the field re-suggestible).
//
// All actions are auth-gated by isAdminAuthenticated and call
// revalidatePath so the queue re-renders without the decided row.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "next-sanity";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  ENRICHABLE_RACE_PROJECTION,
  NUMERIC_ENRICHABLE_FIELDS,
  processRaceEnrichment,
  type EnrichableRace,
  type EnrichmentResult,
  type EnrichmentSuggestion,
} from "@/lib/raceEnrichment";

const REVIEW_PATH = "/admin/races/enrichment";

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

// Lazy-load helper for the row expander's scan-log panel — the
// page query omits enrichmentLastScanLog (a multi-KB JSON blob per
// race) and fetches it here on demand, mirroring date-review's
// getScanLog.
export async function getEnrichmentLog(id: string): Promise<string | null> {
  await requireAdmin();
  if (!id) return null;
  const result = await sanityClient.fetch<{
    enrichmentLastScanLog?: string;
  } | null>(`*[_id == $id][0]{ enrichmentLastScanLog }`, { id });
  return result?.enrichmentLastScanLog ?? null;
}

export async function scanRaceEnrichment(
  formData: FormData,
): Promise<EnrichmentResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing race id");

  const race = await sanityClient.fetch<EnrichableRace | null>(
    `*[_id == $id][0] ${ENRICHABLE_RACE_PROJECTION}`,
    { id },
  );
  if (!race) throw new Error("Race not found");

  const result = await processRaceEnrichment(race, { dryRun: false });
  revalidatePath(REVIEW_PATH);
  return result;
}

/** Fetch a race's suggestion entry for `field`, or throw — shared
 *  by approve/reject/clear so a stale tab acting on an already-
 *  processed suggestion fails loudly instead of writing junk. */
async function getSuggestion(
  id: string,
  field: string,
): Promise<{ suggestions: EnrichmentSuggestion[]; entry: EnrichmentSuggestion }> {
  const race = await sanityClient.fetch<{
    enrichmentSuggestions?: EnrichmentSuggestion[];
  } | null>(`*[_id == $id][0]{ enrichmentSuggestions }`, { id });
  const suggestions = race?.enrichmentSuggestions ?? [];
  const entry = suggestions.find((s) => s.field === field);
  if (!entry) {
    throw new Error(
      `No suggestion for field "${field}" — was it already processed?`,
    );
  }
  return { suggestions, entry };
}

export async function approveSuggestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const field = String(formData.get("field") ?? "").trim();
  if (!id || !field) throw new Error("Missing race id or field");

  const { suggestions, entry } = await getSuggestion(id, field);

  const value: string | number = NUMERIC_ENRICHABLE_FIELDS.has(field)
    ? Number(entry.value)
    : entry.value;
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new Error(`Suggestion value "${entry.value}" is not a number`);
  }

  await sanityClient
    .patch(id)
    .set({
      [field]: value,
      enrichmentSuggestions: suggestions.filter((s) => s.field !== field),
    })
    .commit();

  revalidatePath(REVIEW_PATH);
}

export async function rejectSuggestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const field = String(formData.get("field") ?? "").trim();
  if (!id || !field) throw new Error("Missing race id or field");

  const { suggestions } = await getSuggestion(id, field);
  await sanityClient
    .patch(id)
    .set({
      enrichmentSuggestions: suggestions.map((s) =>
        s.field === field ? { ...s, status: "rejected" as const } : s,
      ),
    })
    .commit();

  revalidatePath(REVIEW_PATH);
}

export async function clearSuggestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const field = String(formData.get("field") ?? "").trim();
  if (!id || !field) throw new Error("Missing race id or field");

  const { suggestions } = await getSuggestion(id, field);
  await sanityClient
    .patch(id)
    .set({
      enrichmentSuggestions: suggestions.filter((s) => s.field !== field),
    })
    .commit();

  revalidatePath(REVIEW_PATH);
}

/** Approve every pending suggestion on a race in one patch. */
export async function approveAllPending(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing race id");

  const race = await sanityClient.fetch<{
    enrichmentSuggestions?: EnrichmentSuggestion[];
  } | null>(`*[_id == $id][0]{ enrichmentSuggestions }`, { id });
  const suggestions = race?.enrichmentSuggestions ?? [];
  const pending = suggestions.filter((s) => s.status === "pending");
  if (pending.length === 0) {
    throw new Error("No pending suggestions to approve");
  }

  const fieldPatch: Record<string, string | number> = {};
  for (const s of pending) {
    const value: string | number = NUMERIC_ENRICHABLE_FIELDS.has(s.field)
      ? Number(s.value)
      : s.value;
    if (typeof value === "number" && !Number.isFinite(value)) continue;
    fieldPatch[s.field] = value;
  }

  await sanityClient
    .patch(id)
    .set({
      ...fieldPatch,
      enrichmentSuggestions: suggestions.filter((s) => s.status !== "pending"),
    })
    .commit();

  revalidatePath(REVIEW_PATH);
}

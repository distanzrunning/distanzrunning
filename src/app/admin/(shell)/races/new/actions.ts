"use server";

// src/app/admin/(shell)/races/new/actions.ts
//
// Server actions for the "Add race" tool (Plan 017, slice 3).
//
// runDiscovery      → search + extract from Wikipedia + geocode +
//                     climate (src/lib/raceDiscovery.ts). No writes.
// createRaceDraft   → writes the (editor-reviewed, possibly edited)
//                     result as an UNPUBLISHED Sanity draft. Never
//                     publishes — same principle as every other
//                     piece of this pipeline: a human confirms
//                     before anything goes live. Slug auto-
//                     generated + de-duplicated; officialWebsite
//                     (when present) makes the new draft immediately
//                     eligible for the Enrichment page's Scan
//                     button (start time / price / expo).

import { randomUUID } from "node:crypto";

import { redirect } from "next/navigation";
import { createClient } from "next-sanity";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { discoverRace, type RaceDiscoveryResult } from "@/lib/raceDiscovery";
import { slugifyTitle } from "@/lib/slugify";

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

export async function runDiscovery(
  formData: FormData,
): Promise<RaceDiscoveryResult> {
  await requireAdmin();
  const query = String(formData.get("query") ?? "").trim();
  if (!query) throw new Error("Enter a race name or Wikipedia URL");
  const city = String(formData.get("city") ?? "").trim() || undefined;
  const country = String(formData.get("country") ?? "").trim() || undefined;
  return discoverRace({ query, city, country });
}

/** raceCategory reference options for the review form's Select. */
export async function listRaceCategories(): Promise<
  { id: string; title: string }[]
> {
  await requireAdmin();
  const categories: { _id: string; title: string }[] = await sanityClient.fetch(
    `*[_type == "raceCategory"] | order(title asc){ _id, title }`,
  );
  return categories.map((c) => ({ id: c._id, title: c.title }));
}

async function uniqueSlug(baseTitle: string): Promise<string> {
  const base = slugifyTitle(baseTitle) || "race";
  for (let suffix = 0; suffix < 50; suffix++) {
    const candidate = suffix === 0 ? base : `${base}-${suffix + 1}`;
    const clash = await sanityClient.fetch<string | null>(
      `*[_type == "raceGuide" && slug.current == $slug][0]._id`,
      { slug: candidate },
    );
    if (!clash) return candidate;
  }
  // Astronomically unlikely fallback — keeps the function total.
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export interface CreateRaceDraftInput {
  title: string;
  city?: string;
  stateRegion?: string;
  country?: string;
  distance?: number;
  officialWebsite?: string;
  wikipediaUrl?: string;
  tags?: string[];
  raceCategoryId?: string;
  location?: { lat: number; lng: number };
  altitude?: number;
  averageTemperature?: number;
  humidity?: number;
  fieldSize?: number;
  /** YYYY-MM-DD — written as noon-UTC datetime, matching the date-
   *  refresh pipeline's convention. */
  eventDate?: string;
  startTime?: string;
  price?: number;
  currency?: string;
  surface?: string;
  profile?: string;
  elevationGain?: number;
  mensCourseRecord?: { time?: string; athlete?: string; country?: string };
  womensCourseRecord?: { time?: string; athlete?: string; country?: string };
  mensWheelchairCourseRecord?: {
    time?: string;
    athlete?: string;
    country?: string;
  };
  womensWheelchairCourseRecord?: {
    time?: string;
    athlete?: string;
    country?: string;
  };
}

export interface CreateRaceDraftResult {
  id: string;
  slug: string;
}

export async function createRaceDraft(
  formData: FormData,
): Promise<CreateRaceDraftResult> {
  await requireAdmin();
  const raw = String(formData.get("draft") ?? "");
  if (!raw) throw new Error("Missing draft payload");
  const input = JSON.parse(raw) as CreateRaceDraftInput;
  const title = input.title?.trim();
  if (!title) throw new Error("Title is required");

  const slug = await uniqueSlug(title);

  const doc: { _id: string; _type: "raceGuide" } & Record<string, unknown> = {
    _id: `drafts.${randomUUID()}`,
    _type: "raceGuide",
    title,
    slug: { _type: "slug", current: slug },
  };
  if (input.city) doc.city = input.city;
  if (input.stateRegion) doc.stateRegion = input.stateRegion;
  if (input.country) doc.country = input.country;
  if (typeof input.distance === "number") doc.distance = input.distance;
  if (input.officialWebsite) doc.officialWebsite = input.officialWebsite;
  if (input.wikipediaUrl) doc.wikipediaUrl = input.wikipediaUrl;
  if (input.tags && input.tags.length > 0) doc.tags = input.tags;
  if (input.raceCategoryId) {
    doc.raceCategory = {
      _type: "reference",
      _ref: input.raceCategoryId,
    };
  }
  if (input.location) {
    doc.location = {
      _type: "geopoint",
      lat: input.location.lat,
      lng: input.location.lng,
    };
  }
  if (typeof input.altitude === "number") doc.altitude = input.altitude;
  if (typeof input.averageTemperature === "number") {
    doc.averageTemperature = input.averageTemperature;
  }
  if (typeof input.humidity === "number") doc.humidity = input.humidity;
  if (typeof input.fieldSize === "number") doc.fieldSize = input.fieldSize;
  if (input.eventDate && /^\d{4}-\d{2}-\d{2}$/.test(input.eventDate)) {
    doc.eventDate = `${input.eventDate}T12:00:00Z`;
  }
  if (input.startTime) doc.startTime = input.startTime;
  if (typeof input.price === "number" && input.price > 0) {
    doc.price = input.price;
  }
  if (input.currency) doc.currency = input.currency;
  if (input.surface) doc.surface = input.surface;
  if (input.profile) doc.profile = input.profile;
  if (typeof input.elevationGain === "number") {
    doc.elevationGain = input.elevationGain;
  }

  const RECORD_FIELDS: {
    key: keyof CreateRaceDraftInput;
    time: string;
    athlete: string;
    country: string;
  }[] = [
    {
      key: "mensCourseRecord",
      time: "mensCourseRecord",
      athlete: "mensCourseRecordAthlete",
      country: "mensCourseRecordCountry",
    },
    {
      key: "womensCourseRecord",
      time: "womensCourseRecord",
      athlete: "womensCourseRecordAthlete",
      country: "womensCourseRecordCountry",
    },
    {
      key: "mensWheelchairCourseRecord",
      time: "mensWheelchairCourseRecord",
      athlete: "mensWheelchairCourseRecordAthlete",
      country: "mensWheelchairCourseRecordCountry",
    },
    {
      key: "womensWheelchairCourseRecord",
      time: "womensWheelchairCourseRecord",
      athlete: "womensWheelchairCourseRecordAthlete",
      country: "womensWheelchairCourseRecordCountry",
    },
  ];
  for (const f of RECORD_FIELDS) {
    const rec = input[f.key] as
      | { time?: string; athlete?: string; country?: string }
      | undefined;
    if (!rec) continue;
    if (rec.time) doc[f.time] = rec.time;
    if (rec.athlete) doc[f.athlete] = rec.athlete;
    if (rec.country) doc[f.country] = rec.country;
  }

  const created = await sanityClient.create(doc);
  return { id: created._id, slug };
}

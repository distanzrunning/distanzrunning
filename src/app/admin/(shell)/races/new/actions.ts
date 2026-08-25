"use server";

// src/app/admin/(shell)/races/new/actions.ts
//
// Server actions for the "Add race" tool (Plan 017, slice 3).
//
// runDiscovery      → search + extract from Wikipedia + geocode +
//                     climate (src/lib/raceDiscovery.ts). No writes.
// createRaceDraft   → writes the (editor-reviewed, possibly edited)
//                     result as an UNPUBLISHED Sanity draft — or,
//                     when the editor explicitly clicks "Create &
//                     publish", as a live published doc. Publishing
//                     stays a human act (the review form IS the
//                     gate); nothing automated ever publishes.
//                     Slug auto-generated + de-duplicated;
//                     officialWebsite (when present) makes the new
//                     doc immediately eligible for the Enrichment
//                     page's Scan button (start time/price/expo).

import { randomUUID } from "node:crypto";

import { redirect } from "next/navigation";
import { createClient } from "next-sanity";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { discoverRace, type RaceDiscoveryResult } from "@/lib/raceDiscovery";
import { slugifyTitle } from "@/lib/slugify";
import { fetchStravaRoute, routeToGeoJson } from "@/lib/stravaRoute";
import { fetchImageRenderUrl } from "@/lib/wikipedia";

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
  surfaceBreakdown?: string;
  profile?: string;
  elevationGain?: number;
  elevationLoss?: number;
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
  /** When set (editor accepted the route preview), the server
   *  re-reads this Strava route's embed geometry and uploads it as
   *  the draft's gpxFile — a GeoJSON FeatureCollection, the format
   *  the race page prefers. Re-fetched server-side rather than
   *  round-tripping thousands of points through the client. */
  attachRouteFromStravaUrl?: string;
  /** When set (editor picked one of the article's photos), the
   *  server asks MediaWiki for a ≤1600px render of the file and
   *  uploads it as mainImage — a TEMPORARY placeholder; the asset
   *  keeps source + creditLine so provenance survives into Studio. */
  attachImageFromWikipedia?: {
    lang: string;
    fileName: string;
    filePageUrl: string;
    license?: string;
    artist?: string;
  };
}

export interface CreateRaceDraftResult {
  id: string;
  slug: string;
  /** True when the editor chose "Create & publish" — the doc was
   *  written WITHOUT the drafts. prefix and is live immediately. */
  published: boolean;
  routeAttached?: boolean;
  routeWarning?: string;
  imageAttached?: boolean;
  imageWarning?: string;
}

export async function createRaceDraft(
  formData: FormData,
): Promise<CreateRaceDraftResult> {
  await requireAdmin();
  const raw = String(formData.get("draft") ?? "");
  if (!raw) throw new Error("Missing draft payload");
  // Publishing is still a human act — the editor reviewed the form
  // and clicked "Create & publish". Nothing automated ever sets it.
  const publish = formData.get("publish") === "1";
  const input = JSON.parse(raw) as CreateRaceDraftInput;
  const title = input.title?.trim();
  if (!title) throw new Error("Title is required");

  const slug = await uniqueSlug(title);

  const doc: { _id: string; _type: "raceGuide" } & Record<string, unknown> = {
    _id: publish ? randomUUID() : `drafts.${randomUUID()}`,
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
  if (input.surfaceBreakdown) doc.surfaceBreakdown = input.surfaceBreakdown;
  if (input.profile) doc.profile = input.profile;
  if (typeof input.elevationGain === "number") {
    doc.elevationGain = input.elevationGain;
  }
  if (typeof input.elevationLoss === "number") {
    doc.elevationLoss = input.elevationLoss;
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

  // Route attachment is best-effort: a failed fetch/upload must
  // never lose the reviewed draft, so it degrades to a warning.
  let routeAttached = false;
  let routeWarning: string | undefined;
  if (input.attachRouteFromStravaUrl) {
    try {
      const route = await fetchStravaRoute(input.attachRouteFromStravaUrl);
      if (!route) {
        routeWarning =
          "Couldn't read the Strava route geometry — draft created without the route file.";
      } else {
        const asset = await sanityClient.assets.upload(
          "file",
          Buffer.from(routeToGeoJson(route, title), "utf8"),
          {
            filename: `${slug}-route.geojson`,
            contentType: "application/geo+json",
          },
        );
        doc.gpxFile = {
          _type: "file",
          asset: { _type: "reference", _ref: asset._id },
        };
        routeAttached = true;
      }
    } catch (err) {
      routeWarning = `Route upload failed (${(err as Error).message}) — draft created without the route file.`;
    }
  }

  let imageAttached = false;
  let imageWarning: string | undefined;
  if (input.attachImageFromWikipedia) {
    const img = input.attachImageFromWikipedia;
    try {
      const renderUrl = await fetchImageRenderUrl(img.lang, img.fileName);
      if (!renderUrl) throw new Error("no render URL from MediaWiki");
      // Wikimedia asks for an identifying UA; anonymous fetches can
      // be rejected.
      const res = await fetch(renderUrl, {
        headers: {
          "User-Agent":
            "DistanzRunning/1.0 (https://distanzrunning.com; info@distanzrunning.com)",
        },
      });
      if (!res.ok) throw new Error(`image fetch ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const asset = await sanityClient.assets.upload("image", buf, {
        filename: img.fileName,
        contentType: res.headers.get("content-type") ?? undefined,
        source: { name: "wikipedia", url: img.filePageUrl, id: img.fileName },
        creditLine:
          [img.artist, img.license].filter(Boolean).join(" — ") ||
          "Wikimedia Commons",
        description: `Temporary placeholder from Wikipedia — replace before publish. ${img.filePageUrl}`,
      });
      doc.mainImage = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      };
      imageAttached = true;
    } catch (err) {
      imageWarning = `Image upload failed (${(err as Error).message}) — draft created without a main image.`;
    }
  }

  const created = await sanityClient.create(doc);
  return {
    id: created._id,
    slug,
    published: publish,
    routeAttached,
    routeWarning,
    imageAttached,
    imageWarning,
  };
}

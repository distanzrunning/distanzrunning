// src/app/api/race-date-refresh/route.ts
//
// Batch endpoint for the date refresh pipeline. Selects up to
// RUN_LIMIT past-dated races with no existing suggestion status,
// scans each via the shared lib, and writes pending suggestions
// to Sanity. Per-race scraping logic lives in
// src/lib/raceDateRefresh.ts so the admin "Scan" button can call
// the same processRace function directly from a server action.
//
// Auth (mirrors algolia-sync):
//   - Vercel cron: Authorization: Bearer ${CRON_SECRET}
//   - Manual: ?secret=${RACE_DATE_REFRESH_SECRET}
// Either path passes; otherwise 401.
//
// dryRun=1 returns extraction results without any Sanity writes.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

import {
  mapWithConcurrency,
  processRace,
  type PendingRace,
  type RaceResult,
} from "@/lib/raceDateRefresh";

// Vercel serverless functions default to a 10 s timeout — way too
// short for many races × (web fetch + Haiku call) at concurrency 3.
// 60 s is the Hobby-plan ceiling; bump to 300 s if on Pro and
// scaling RUN_LIMIT well past ~25.
export const maxDuration = 60;

// Two-pass extraction (homepage → sub-pages on miss) makes worst-
// case scans ~15 s instead of ~6 s, so we lower the per-run cap
// to keep the batch comfortably inside maxDuration. 15 races at
// concurrency 3 lands at ~75 s upper bound but most races finish
// in Pass 1 and only a few pay the Pass 2 tax.
const RUN_LIMIT = 15;
const CONCURRENCY = 3;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

async function authorize(request: NextRequest): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  const manualSecret = process.env.RACE_DATE_REFRESH_SECRET;
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");

  const isCron =
    Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;
  const isManual =
    Boolean(manualSecret) && querySecret === manualSecret;
  return isCron || isManual;
}

async function runRefresh(options: {
  dryRun: boolean;
}): Promise<{ scanned: number; dryRun: boolean; results: RaceResult[] }> {
  const query = `*[
    _type == "raceGuide"
    && defined(officialWebsite)
    && defined(eventDate)
    && eventDate < now()
    && !defined(suggestedNextDateStatus)
    && !(_id in path("drafts.**"))
  ] | order(eventDate desc) [0...$limit] {
    _id, title, eventDate, officialWebsite
  }`;

  const races: PendingRace[] = await sanityClient.fetch(query, {
    limit: RUN_LIMIT,
  });

  const results = await mapWithConcurrency(races, CONCURRENCY, (race) =>
    processRace(race, options),
  );
  return { scanned: races.length, dryRun: options.dryRun, results };
}

export async function POST(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";
    const summary = await runRefresh({ dryRun });
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("Race date refresh error:", err);
    return NextResponse.json(
      { error: "Refresh failed", details: (err as Error).message },
      { status: 500 },
    );
  }
}

// GET mirrors POST so a curl with ?secret= works for manual
// triggering during the pilot. Vercel cron also defaults to GET.
export async function GET(request: NextRequest) {
  return POST(request);
}

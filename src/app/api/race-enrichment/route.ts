// src/app/api/race-enrichment/route.ts
//
// Manual / cron batch endpoint for the Wikipedia enrichment
// pipeline (Plan 017). Mirrors /api/race-date-refresh: no schedule
// is currently registered — the admin Enrichment page's per-row
// Scan buttons are the day-to-day path; this route lets an operator
// curl-trigger a batch (e.g. after seeding new races).
//
// Auth:
//   - Manual:  ?secret=${RACE_ENRICHMENT_SECRET}
//   - Cron:    Authorization: Bearer ${CRON_SECRET}
// Either passes; otherwise 401. dryRun=1 skips all Sanity writes.

import { NextRequest, NextResponse } from "next/server";

import { runBatchEnrichment } from "@/lib/raceEnrichment";

export const maxDuration = 60;

async function authorize(request: NextRequest): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  const manualSecret = process.env.RACE_ENRICHMENT_SECRET;
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");

  const isCron = Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;
  const isManual = Boolean(manualSecret) && querySecret === manualSecret;
  return isCron || isManual;
}

export async function POST(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";
    const summary = await runBatchEnrichment({ dryRun });
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("Race enrichment error:", err);
    return NextResponse.json(
      { error: "Enrichment failed", details: (err as Error).message },
      { status: 500 },
    );
  }
}

// GET mirrors POST so a curl with ?secret= works for manual
// triggering. Vercel cron also defaults to GET.
export async function GET(request: NextRequest) {
  return POST(request);
}

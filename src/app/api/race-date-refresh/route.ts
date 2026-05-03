// src/app/api/race-date-refresh/route.ts
//
// Batch endpoint for the date refresh pipeline. Selects up to
// BATCH_RUN_LIMIT past-dated races with no existing suggestion
// status, scans each via the shared lib, and writes pending
// suggestions to Sanity. The actual batch logic lives in
// src/lib/raceDateRefresh.ts (`runBatchRefresh`) so the admin
// "Run batch scan" button server action can exercise the same
// path as the cron-triggered HTTP endpoint.
//
// Auth (mirrors algolia-sync):
//   - Vercel cron: Authorization: Bearer ${CRON_SECRET}
//   - Manual: ?secret=${RACE_DATE_REFRESH_SECRET}
// Either path passes; otherwise 401.
//
// dryRun=1 returns extraction results without any Sanity writes.

import { NextRequest, NextResponse } from "next/server";

import { runBatchRefresh } from "@/lib/raceDateRefresh";

// Vercel serverless functions default to a 10 s timeout — way too
// short for many races × (web fetch + Haiku call) at concurrency 3.
// 60 s is the Hobby-plan ceiling; bump to 300 s if on Pro and
// scaling BATCH_RUN_LIMIT well past ~25.
export const maxDuration = 60;

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

export async function POST(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";
    const summary = await runBatchRefresh({ dryRun });
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
// triggering. Vercel cron also defaults to GET.
export async function GET(request: NextRequest) {
  return POST(request);
}

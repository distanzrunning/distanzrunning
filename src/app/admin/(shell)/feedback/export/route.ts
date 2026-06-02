import { NextResponse } from "next/server";

import {
  DEFAULT_PRESET,
  matchPreset,
  windowFromParams,
} from "@/components/admin/datePresets";
import type { EnvFilter } from "@/components/admin/env";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings";

import {
  getEarliestFeedbackDate,
  getFeedbackRowsInRange,
  lookupFeedback,
  type FeedbackRowRaw,
} from "../data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FeedbackFilter =
  | "love"
  | "okay"
  | "not-great"
  | "hate"
  | "email"
  | "follow-up";

// CSV columns + order chosen so the high-cardinality `feedback` body
// sits last (easier to read when the file's opened in a spreadsheet).
const COLUMNS = [
  "id",
  "created_at",
  "environment",
  "anon_id",
  "country",
  "emotion",
  "topic",
  "email",
  "contacted_at",
  "page_path",
  "user_agent",
  "ip_hash",
  "feedback",
] as const;

type Column = (typeof COLUMNS)[number];

// Minimal RFC 4180 CSV cell escape — same shape as the consent
// export. Quote any cell containing comma/quote/newline; double any
// embedded quotes.
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function normaliseEnv(raw: string | null): EnvFilter {
  if (raw === "production" || raw === "staging" || raw === "development") {
    return raw;
  }
  return "all";
}

function normaliseFilter(raw: string | null): FeedbackFilter | null {
  if (
    raw === "love" ||
    raw === "okay" ||
    raw === "not-great" ||
    raw === "hate" ||
    raw === "email" ||
    raw === "follow-up"
  ) {
    return raw;
  }
  return null;
}

function rowMatchesFilter(row: FeedbackRowRaw, filter: FeedbackFilter): boolean {
  if (filter === "email") return !!row.email;
  if (filter === "follow-up") return !!row.email && !row.contacted_at;
  return row.emotion === filter;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const url = new URL(request.url);
  const sp = url.searchParams;
  const env = normaliseEnv(sp.get("env"));
  const filter = normaliseFilter(sp.get("filter"));
  const q = sp.get("q")?.trim() ?? "";

  let rows: FeedbackRowRaw[];
  let scope: string;
  if (q) {
    // Lookup-view export: every match across all time + the active
    // env. Filter chip doesn't apply here — the lookup isn't filter-
    // scoped today.
    rows = await lookupFeedback(q, env);
    scope = `search-${q.slice(0, 24).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  } else {
    // Dashboard-view export: same window the dashboard is showing,
    // narrowed by the active tile filter (if any).
    const { timezone: tz } = await getSiteSettings();
    const earliestDate = await getEarliestFeedbackDate(env);
    const window = windowFromParams(
      {
        period: sp.get("period") ?? undefined,
        from: sp.get("from") ?? undefined,
        to: sp.get("to") ?? undefined,
      },
      tz,
      earliestDate,
    );
    const all = await getFeedbackRowsInRange(
      window.start.toISOString(),
      window.end.toISOString(),
      env,
    );
    rows = filter ? all.filter((r) => rowMatchesFilter(r, filter)) : all;
    const preset = matchPreset(window, tz, earliestDate);
    const periodTag = preset ?? "custom";
    const filterTag = filter ? `-${filter}` : "";
    scope =
      preset === DEFAULT_PRESET ? `7d${filterTag}` : `${periodTag}${filterTag}`;
  }

  const header = COLUMNS.join(",");
  const body = rows
    .map((row) =>
      COLUMNS.map((col) =>
        csvCell((row as unknown as Record<Column, unknown>)[col]),
      ).join(","),
    )
    .join("\r\n");
  const csv = body ? `${header}\r\n${body}\r\n` : `${header}\r\n`;

  const today = new Date().toISOString().slice(0, 10);
  const envTag = env === "all" ? "all-envs" : env;
  const filename = `feedback-${envTag}-${scope}-${today}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GDPR Article 15 — Right of Access. Returns a CSV of every
// consent_records row stored against the requested anon_id, with
// all fields included (ip_hash + user_agent are hashed/truncated
// already at write time; the user is still entitled to see them).
//
// Admin-protected: an unauthenticated caller is redirected to the
// login page rather than served the CSV.

const COLUMNS = [
  "id",
  "anon_id",
  "decision",
  "marketing",
  "analytics",
  "functional",
  "gpc",
  "version",
  "environment",
  "country",
  "user_agent",
  "ip_hash",
  "created_at",
] as const;

type Column = (typeof COLUMNS)[number];

// Minimal RFC 4180 CSV cell escape: quote the cell if it contains
// a comma / quote / newline; double any embedded quotes.
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ anonId: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { anonId } = await params;
  const trimmed = anonId.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Missing anonId" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("consent_records")
    .select(COLUMNS.join(", "))
    .eq("anon_id", trimmed)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[consent] export failed", error.message);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }

  const rows = ((data ?? []) as unknown) as Record<Column, unknown>[];

  const header = COLUMNS.join(",");
  const body = rows
    .map((row) => COLUMNS.map((col) => csvCell(row[col])).join(","))
    .join("\r\n");
  // RFC 4180 uses CRLF line endings.
  const csv = body ? `${header}\r\n${body}\r\n` : `${header}\r\n`;

  // Filename: include a short prefix of the anon_id + today's date
  // so saved exports are self-describing without dumping the full ID
  // into the filename.
  const today = new Date().toISOString().slice(0, 10);
  const safeId = trimmed.slice(0, 12).replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `consent-${safeId}-${today}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

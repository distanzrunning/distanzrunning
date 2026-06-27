import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GDPR Article 15 — Right of Access. Returns a CSV of every c15t_consent row
// stored against the requested subject id, with all stored fields included
// (ipAddress is masked at write time; the user is still entitled to see it).
//
// Admin-protected: an unauthenticated caller is redirected to the login page.
// The dynamic segment is named `anonId` for route compatibility; its value is
// the c15t subject id (sub_xxx).

const COLUMNS = [
  "id",
  "subjectId",
  "consentAction",
  "purposeIds",
  "givenAt",
  "validUntil",
  "jurisdiction",
  "jurisdictionModel",
  "uiSource",
  "ipAddress",
  "userAgent",
] as const;

type Column = (typeof COLUMNS)[number];

// Minimal RFC 4180 CSV cell escape: quote the cell if it contains a comma /
// quote / newline; double any embedded quotes. Arrays/objects are JSON-encoded.
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str =
    typeof value === "object" ? JSON.stringify(value) : String(value);
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
    return NextResponse.json({ error: "Missing subject id" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const [{ data, error }, purposeRes] = await Promise.all([
    supabase
      .from("c15t_consent")
      .select(COLUMNS.join(", "))
      .eq("subjectId", trimmed)
      .order("givenAt", { ascending: false }),
    supabase.from("c15t_consentPurpose").select("id, code"),
  ]);

  if (error) {
    console.error("[consent] export failed", error.message);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }

  // Resolve purpose ids → readable category codes so the CSV shows
  // "necessary;measurement;…" instead of the raw {json:[...]} id blob.
  const purposeCode: Record<string, string> = {};
  for (const p of (purposeRes.data ?? []) as { id: string; code: string }[]) {
    purposeCode[p.id] = p.code;
  }
  const resolvePurposes = (raw: unknown): string => {
    const ids = Array.isArray(raw)
      ? (raw as string[])
      : raw && typeof raw === "object" && Array.isArray((raw as { json?: string[] }).json)
        ? (raw as { json: string[] }).json
        : [];
    return ids.map((id) => purposeCode[id] ?? id).join(";");
  };

  const rows = ((data ?? []) as unknown as Record<Column, unknown>[]).map(
    (row) => ({ ...row, purposeIds: resolvePurposes(row.purposeIds) }),
  );

  const header = COLUMNS.join(",");
  const body = rows
    .map((row) => COLUMNS.map((col) => csvCell(row[col])).join(","))
    .join("\r\n");
  // RFC 4180 uses CRLF line endings.
  const csv = body ? `${header}\r\n${body}\r\n` : `${header}\r\n`;

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

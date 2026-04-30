import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Decision = "accept_all" | "reject_all" | "custom";

interface Payload {
  anonId: string;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  decision: Decision;
  version: number;
  gpc?: boolean;
}

function isValidPayload(v: unknown): v is Payload {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.anonId === "string" &&
    p.anonId.length > 0 &&
    p.anonId.length <= 64 &&
    typeof p.marketing === "boolean" &&
    typeof p.analytics === "boolean" &&
    typeof p.functional === "boolean" &&
    (p.decision === "accept_all" ||
      p.decision === "reject_all" ||
      p.decision === "custom") &&
    typeof p.version === "number" &&
    Number.isInteger(p.version) &&
    (p.gpc === undefined || typeof p.gpc === "boolean")
  );
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.CONSENT_IP_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  const ip =
    (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ??
    headers.get("x-real-ip");
  const userAgent = headers.get("user-agent")?.slice(0, 512) ?? null;
  const country = headers.get("x-vercel-ip-country") ?? null;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("consent_records").insert({
      anon_id: body.anonId,
      marketing: body.marketing,
      analytics: body.analytics,
      functional: body.functional,
      decision: body.decision,
      version: body.version,
      user_agent: userAgent,
      ip_hash: hashIp(ip),
      country,
      gpc: body.gpc ?? null,
    });
    if (error) {
      console.error("[consent] insert failed", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("[consent] unexpected error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

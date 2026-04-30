import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Emotion = "hate" | "not-great" | "okay" | "love";

const EMOTIONS: Emotion[] = ["hate", "not-great", "okay", "love"];
const MAX_FEEDBACK_LEN = 4000;
const MAX_TOPIC_LEN = 100;
const MAX_EMAIL_LEN = 254;
const MAX_PATH_LEN = 500;
const MAX_ANON_ID_LEN = 64;

// Basic email shape check — we don't need bulletproof, just "looks like
// an email" to discard obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Payload {
  emotion?: Emotion;
  feedback: string;
  topic?: string;
  email?: string;
  pagePath?: string;
  anonId?: string;
}

function isValidPayload(v: unknown): v is Payload {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  if (typeof p.feedback !== "string") return false;
  if (p.feedback.trim().length === 0) return false;
  if (p.feedback.length > MAX_FEEDBACK_LEN) return false;
  if (p.emotion !== undefined && !EMOTIONS.includes(p.emotion as Emotion)) {
    return false;
  }
  if (p.topic !== undefined && typeof p.topic !== "string") return false;
  if (p.email !== undefined) {
    if (typeof p.email !== "string") return false;
    if (p.email.length > MAX_EMAIL_LEN) return false;
    if (p.email.length > 0 && !EMAIL_RE.test(p.email)) return false;
  }
  if (p.pagePath !== undefined && typeof p.pagePath !== "string") return false;
  if (p.anonId !== undefined) {
    if (typeof p.anonId !== "string") return false;
    if (p.anonId.length > MAX_ANON_ID_LEN) return false;
  }
  return true;
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.FEEDBACK_IP_SALT ?? process.env.CONSENT_IP_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function clip(value: string | undefined, max: number): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed.slice(0, max) : null;
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
    const { error } = await supabase.from("feedback_records").insert({
      anon_id: clip(body.anonId, MAX_ANON_ID_LEN),
      emotion: body.emotion ?? null,
      feedback: body.feedback.trim().slice(0, MAX_FEEDBACK_LEN),
      topic: clip(body.topic, MAX_TOPIC_LEN),
      email: clip(body.email, MAX_EMAIL_LEN),
      page_path: clip(body.pagePath, MAX_PATH_LEN),
      user_agent: userAgent,
      ip_hash: hashIp(ip),
      country,
    });
    if (error) {
      console.error("[feedback] insert failed", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("[feedback] unexpected error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

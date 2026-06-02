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

// IP salt is the entire defence against rainbow-tabling the audit
// log — without it, every IP from a given environment produces a
// stable salt-free SHA-256 hash that's recoverable in minutes
// against the 4B IPv4 space. Resolve at module load so the route
// crashes on cold start (visible in deploy logs) rather than
// silently shipping unsalted hashes.
//
// Falls back to CONSENT_IP_SALT for back-compat — both routes can
// share one salt, and the prior empty-string fallback that silently
// shipped unsalted hashes is removed. Same pattern as consent's
// resolveSalt module-load throw.
const FEEDBACK_IP_SALT = (() => {
  const raw = process.env.FEEDBACK_IP_SALT ?? process.env.CONSENT_IP_SALT;
  if (!raw || raw.length === 0) {
    throw new Error(
      "[feedback] FEEDBACK_IP_SALT (or CONSENT_IP_SALT as fallback) env " +
        "var is missing or empty. This salt is required to deidentify IP " +
        "hashes — refusing to ship unsalted hashes. Set it on the " +
        "deployment.",
    );
  }
  return raw;
})();

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256")
    .update(`${FEEDBACK_IP_SALT}:${ip}`)
    .digest("hex");
}

// ---------- Rate limit ----------
// Simple in-memory token bucket per IP. Per-instance state — each
// warm Vercel function shares the map within its lifetime, cold
// starts reset (~15 min idle). Sufficient defence against casual
// bots / accidental loops; swap to Upstash Redis or Vercel KV
// behind the same checkRateLimit shape for distributed-bot
// resistance. Mirrors /api/consent.

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const rateLimitBuckets = new Map<
  string,
  { count: number; windowStart: number }
>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(ip, { count: 1, windowStart: now });
    // Lazy cleanup so the map doesn't grow without bound on a long-
    // lived instance.
    for (const [key, b] of rateLimitBuckets) {
      if (now - b.windowStart >= RATE_LIMIT_WINDOW_MS) {
        rateLimitBuckets.delete(key);
      }
    }
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - bucket.windowStart)) / 1000,
    );
    return { allowed: false, retryAfter };
  }
  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

// Vercel sets VERCEL_ENV to "production" | "preview" | "development".
// Map preview → "staging" so the feedback dashboard's filter only has
// to think in production / staging / development buckets (matches
// /api/consent's resolveEnvironment + feedback_records check
// constraint).
type FeedbackEnv = "production" | "staging" | "development";
function resolveEnvironment(): FeedbackEnv {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "staging";
  return "development";
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

  // Per-IP rate limit. If we can't identify the IP at all (no
  // forwarded headers — local dev / unusual proxy), skip the check
  // rather than locking everyone into a single shared bucket.
  if (ip) {
    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfter) },
        },
      );
    }
  }

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
      environment: resolveEnvironment(),
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

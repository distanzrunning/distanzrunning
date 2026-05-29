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

// IP salt is the entire defence against rainbow-tabling the audit
// log — without it, every IP from a given environment produces a
// stable salt-free SHA-256 hash that's recoverable in minutes.
// Resolved at module load so the route crashes on cold start (in
// deploy logs, can't be missed) rather than silently shipping
// unsalted hashes if the env var is missing.
const CONSENT_IP_SALT = (() => {
  const raw = process.env.CONSENT_IP_SALT;
  if (!raw || raw.length === 0) {
    throw new Error(
      "[consent] CONSENT_IP_SALT env var is missing or empty. " +
        "This salt is required to deidentify IP hashes — refusing to " +
        "ship unsalted hashes. Set it on the deployment.",
    );
  }
  return raw;
})();

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256")
    .update(`${CONSENT_IP_SALT}:${ip}`)
    .digest("hex");
}

// Vercel sets VERCEL_ENV to "production" | "preview" | "development".
// We map preview → "staging" so the consent dashboard's filter only
// has to think in production / staging / development buckets.
type ConsentEnv = "production" | "staging" | "development";
function resolveEnvironment(): ConsentEnv {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "staging";
  // No VERCEL_ENV → local dev, or NODE_ENV says so.
  return "development";
}

// ---------- Rate limit ----------
// Simple in-memory token bucket per IP. Per-instance state — each
// warm Vercel function shares the map within its lifetime, cold
// starts reset (~15 min idle). Sufficient defence against casual
// bots / accidental loops; for distributed-bot resistance, swap to
// Upstash Redis or Vercel KV behind the same checkRateLimit shape.

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const rateLimitBuckets = new Map<
  string,
  { count: number; windowStart: number }
>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  // Bucket expired (or never existed) — reset.
  if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(ip, { count: 1, windowStart: now });
    // Lazy cleanup: prune any other expired buckets while we're here
    // so the map doesn't grow without bound on a long-lived instance.
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
      environment: resolveEnvironment(),
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

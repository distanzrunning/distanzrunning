// src/app/api/revalidate/route.ts
//
// Cache-busting endpoint for the Next.js data cache that
// `sanityFetch` populates. Every fetch made via the
// `next-sanity` `defineLive` helper is tagged with `'sanity'`,
// so calling `revalidateTag('sanity')` invalidates every cached
// fetch in one shot. The page-level ISR window (revalidate=60)
// doesn't bust this cache on its own — without `<SanityLive />`
// mounted on the client, content edits in Studio don't
// propagate until this is called.
//
// Auth via a shared secret in REVALIDATE_SECRET (env var). Send
// the secret as `?secret=` to keep the URL hit-able from a
// browser when needed.
//
// GET /api/revalidate?secret=<>            → revalidateTag('sanity')
// GET /api/revalidate?secret=<>&path=/x    → also revalidatePath('/x')
//
// Returns 200 with a JSON status, or 401 if the secret is wrong.

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }
  const got = req.nextUrl.searchParams.get("secret");
  if (got !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Bust every Next.js data-cache entry tagged with 'sanity' —
  // that's the default tag set by next-sanity's defineLive on
  // every sanityFetch call.
  revalidateTag("sanity");

  // Optional: also force a re-render of a specific path.
  const path = req.nextUrl.searchParams.get("path");
  if (path) revalidatePath(path);

  return NextResponse.json({
    ok: true,
    revalidatedTag: "sanity",
    revalidatedPath: path ?? null,
    timestamp: Date.now(),
  });
}

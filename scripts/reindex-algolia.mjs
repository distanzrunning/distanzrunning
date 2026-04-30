#!/usr/bin/env node
//
// scripts/reindex-algolia.mjs
//
// One-liner trigger for the full Algolia reindex
// (`/api/algolia-sync?secret=…`). Run after schema changes that
// affect indexed fields — currently the productPost `section` field
// added to support the search modal's product hit URLs.
//
// Usage:
//   npm run reindex                # uses staging URL by default
//   DISTANZ_BASE_URL=https://… npm run reindex
//
// REINDEX_SECRET resolution:
//   1. Already in process.env (e.g. shell exported)
//   2. Loaded from .env.local at the repo root (auto)
//   3. None → script fails with instructions
//
// Pair with `vercel env pull .env.local` to keep the secret in sync
// with whatever's in Vercel project settings.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// ── Load .env.local if present ────────────────────────────────────────────────

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const raw of readFileSync(envPath, "utf-8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue; // shell-exported value wins
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

// ── Inputs ────────────────────────────────────────────────────────────────────

const baseUrl =
  process.env.DISTANZ_BASE_URL || "https://distanzrunning.vercel.app";
const secret = process.env.REINDEX_SECRET;

if (!secret) {
  console.error(
    [
      "✗ REINDEX_SECRET not set.",
      "",
      "Easiest path — pull all Vercel env vars into .env.local:",
      "  vercel env pull .env.local",
      "  npm run reindex",
      "",
      "Or pass it inline for a one-off:",
      "  REINDEX_SECRET=xxxxxxxx npm run reindex",
    ].join("\n"),
  );
  process.exit(1);
}

// ── Fire ──────────────────────────────────────────────────────────────────────

const url = new URL("/api/algolia-sync", baseUrl);
url.searchParams.set("secret", secret);

console.log(`→ Reindexing via ${baseUrl} …`);

try {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`✗ Reindex failed (${res.status}):`, body);
    process.exit(1);
  }
  console.log(
    `✓ ${body.message ?? "Reindex complete"} (${body.count ?? "?"} records)`,
  );
} catch (err) {
  console.error("✗ Network error:", err.message ?? err);
  process.exit(1);
}

#!/usr/bin/env node
//
// scripts/fix-tokyo-reference.mjs
//
// Cleanup after migrate-runners-guides.mjs: the Tokyo article
// (`21fd889c-…`) was referenced in homepageSettings.featuredSlides
// so the migration's hard-delete failed. Tokyo race already has
// the patched content; this script:
//   1. Swaps the homepageSettings.featuredSlides slot from the
//      old article reference → the Tokyo raceGuide (which the
//      schema accepts as a featured slide type).
//   2. Hard-deletes the orphaned article.
//
// Run once and remove.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const raw of readFileSync(envPath, "utf-8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-04-17",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const TOKYO_ARTICLE_ID = "21fd889c-18d2-46bb-a1c7-933b1611aeba";
const TOKYO_RACE_ID = "eb4bc236-8cca-4586-9399-7d97f3cc2d01";
const SLIDE_KEY = "79c8047d5ba9";

console.log(
  `Swapping featuredSlides[_key==${SLIDE_KEY}] → raceGuide ${TOKYO_RACE_ID}`,
);
await client
  .patch("homepageSettings")
  .set({
    [`featuredSlides[_key=="${SLIDE_KEY}"]._ref`]: TOKYO_RACE_ID,
  })
  .commit();
console.log("  ✓ patched homepageSettings");

console.log(`Deleting orphaned article ${TOKYO_ARTICLE_ID}`);
await client.delete(TOKYO_ARTICLE_ID);
console.log("  ✓ deleted Tokyo article");

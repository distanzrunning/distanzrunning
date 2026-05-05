#!/usr/bin/env node
//
// scripts/migrate-runners-guides.mjs
//
// One-off migration: copies the editorial fields from the six
// "Runner's Guide" posts into their matching raceGuide docs,
// strips redundant customCodeBlock instances from the body,
// then hard-deletes the migrated post documents.
//
// Article body customCodeBlock entries (stats / map / course
// records / entry-method table / results) are stripped — the
// race detail page now renders stats, map, and records natively
// from raceGuide fields, so those embeds become redundant.
//
// Run a dry-run first to preview:
//   node scripts/migrate-runners-guides.mjs --dry-run
// Then for real:
//   node scripts/migrate-runners-guides.mjs
//
// Required env (auto-loaded from .env.local):
//   NEXT_PUBLIC_SANITY_PROJECT_ID
//   NEXT_PUBLIC_SANITY_DATASET
//   SANITY_API_WRITE_TOKEN

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

// ── Load .env.local ──────────────────────────────────────────────

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

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-04-17",
  token,
  useCdn: false,
});

const dryRun = process.argv.includes("--dry-run");

// Article → race mappings (by slug). London is intentionally
// absent — its raceGuide doc doesn't exist yet.
const PAIRS = [
  { articleSlug: "tokyo-marathon-runners-guide", raceSlug: "tokyo-marathon" },
  { articleSlug: "boston-marathon-runners-guide", raceSlug: "boston-marathon" },
  {
    articleSlug: "chicago-marathon-runners-guide",
    raceSlug: "chicago-marathon",
  },
  { articleSlug: "berlin-marathon-runners-guide", raceSlug: "berlin-marathon" },
  {
    articleSlug: "new-york-city-marathon-runners-guide",
    raceSlug: "new-york-city-marathon",
  },
];

const SKIPPED = ["london-marathon-runners-guide"];

const banner = dryRun ? "[DRY RUN]" : "[LIVE]";
console.log(
  `\n${banner} Migrating ${PAIRS.length} Runner's Guide articles → raceGuide.\n`,
);

let okCount = 0;
let failCount = 0;

for (const { articleSlug, raceSlug } of PAIRS) {
  console.log(`→ ${articleSlug} → ${raceSlug}`);

  const article = await client.fetch(
    /* groq */ `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      body,
      introduction,
      excerpt,
      mainImage,
      author
    }`,
    { slug: articleSlug },
  );
  if (!article) {
    console.log(`  ✗ article not found, skipping`);
    failCount++;
    continue;
  }

  const race = await client.fetch(
    /* groq */ `*[_type == "raceGuide" && slug.current == $slug][0]{ _id, "hasMainImage": defined(mainImage) }`,
    { slug: raceSlug },
  );
  if (!race) {
    console.log(`  ✗ raceGuide not found, skipping`);
    failCount++;
    continue;
  }

  // Strip every customCodeBlock instance from the body — those
  // were workarounds for embedded stats / map / records / tables
  // that the race detail page now handles natively.
  const originalLen = (article.body || []).length;
  const cleanBody = (article.body || []).filter(
    (block) => block._type !== "customCodeBlock",
  );
  const strippedCount = originalLen - cleanBody.length;

  // Build patch payload — only set fields that are actually
  // populated on the article. Avoids overwriting existing race
  // values with `undefined`.
  const patch = { body: cleanBody };
  if (article.introduction) patch.introduction = article.introduction;
  if (article.excerpt) patch.excerpt = article.excerpt;
  if (article.mainImage) patch.mainImage = article.mainImage;
  if (article.author) patch.author = article.author;

  const fieldList = Object.keys(patch).join(", ");
  console.log(
    `  body: ${cleanBody.length} blocks (stripped ${strippedCount} customCodeBlock), patch fields: ${fieldList}`,
  );

  if (dryRun) {
    okCount++;
    continue;
  }

  try {
    await client.patch(race._id).set(patch).commit();
    await client.delete(article._id);
    console.log(`  ✓ patched race + deleted article`);
    okCount++;
  } catch (err) {
    console.log(`  ✗ failed: ${err?.message ?? err}`);
    failCount++;
  }
}

console.log(`\nDone. ${okCount} ok, ${failCount} failed.`);
console.log(
  `Skipped (no matching raceGuide): ${SKIPPED.join(", ")}.`,
);

// src/lib/slugify.ts
//
// Title → URL slug, shared by every server-side race pipeline that
// needs a slug without going through Sanity Studio's own UI
// slugify (raceDateRefresh's aggregator-URL guessing, and
// raceDiscovery's new-draft creation).
//
// Matches Sanity Studio's own `options: { source: "title" }`
// behaviour for the raceGuide slug field — verified against
// published data: "3-Länder-Marathon" → "3-laender-marathon", not
// the bare diacritic-strip "3-lander-marathon" a naive NFD pass
// would produce. German/Nordic letters get their proper
// transliteration; everything else NFD-strips to its base letter
// (café → cafe), which is the common convention elsewhere.

const TRANSLITERATIONS: Record<string, string> = {
  ä: "ae", ö: "oe", ü: "ue", ß: "ss",
  Ä: "ae", Ö: "oe", Ü: "ue",
  æ: "ae", Æ: "ae",
  ø: "oe", Ø: "oe",
  å: "aa", Å: "aa",
};

export function slugifyTitle(title: string): string {
  const transliterated = title.replace(
    /[äöüßÄÖÜæÆøØåÅ]/g,
    (c) => TRANSLITERATIONS[c] ?? c,
  );
  return transliterated
    .toLowerCase()
    .normalize("NFD")
    // strip remaining diacritics (è → e) so titles with accents
    // still match/slugify predictably.
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

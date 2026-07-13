import { sanityFetch } from "./live";

/** sanityFetch for OPTIONAL surfaces (shared-layout chrome, homepage
 *  sections). Never throws: a Sanity outage must cost the section its
 *  content, not 500 every public page — the same decision
 *  getAnnouncement() records for the promo bar. Failures log
 *  server-side and resolve to { data: null }, which every consumer
 *  already renders as its empty state. Admin/editor surfaces keep the
 *  throwing sanityFetch so breakage stays loud there. */
export async function safeSanityFetch(
  args: Parameters<typeof sanityFetch>[0],
): Promise<{ data: Awaited<ReturnType<typeof sanityFetch>>["data"] | null }> {
  try {
    return await sanityFetch(args);
  } catch (err) {
    console.error(
      `[sanity] fetch failed, rendering empty (query: ${String(args.query).slice(0, 80)}…):`,
      err instanceof Error ? err.message : err,
    );
    return { data: null };
  }
}

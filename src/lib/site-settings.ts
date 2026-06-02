import { cache } from "react";

import { getSupabaseAdmin } from "./supabase/server";

export interface SiteSettings {
  /** IANA timezone used to bucket admin analytics by business day. */
  timezone: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  timezone: "Europe/Brussels",
};

/** Server-side reader for the singleton `site_settings` row. Cached
 *  per request via React's `cache`, so multiple callers in the same
 *  render tree share a single DB hit.
 *
 *  Falls back to DEFAULT_SETTINGS on error (e.g. schema not applied
 *  yet) so the dashboard stays usable in fresh environments. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .select("timezone")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[site-settings] read failed", error.message);
    return DEFAULT_SETTINGS;
  }
  if (!data) return DEFAULT_SETTINGS;

  return {
    timezone: data.timezone ?? DEFAULT_SETTINGS.timezone,
  };
});

/** Cheap IANA validator — relies on Intl rejecting unknown zones. */
export function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

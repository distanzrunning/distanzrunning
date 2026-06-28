"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { useConsentManager } from "@c15t/nextjs/headless";

// ============================================================================
// PostHog — c15t "SDK pattern" (recommended for apps that import posthog-js)
// ----------------------------------------------------------------------------
// Our app calls posthog.capture(...) directly via `import posthog from
// "posthog-js"` (ExploreButton, NewsletterSignup, SiteHeader, NewsletterModal).
// With c15t's *script-helper* those calls hit a different, uninitialised
// instance and get lost — so we initialise posthog-js OURSELVES here and let
// c15t only SYNC measurement consent (opt in/out). `cookieless_mode: 'on_reject'`
// keeps PostHog from writing cookies / persistent ids until measurement consent
// is granted (rejected-consent events are recorded cookielessly only if
// "Cookieless server hash mode" is enabled in the PostHog project; otherwise
// they're simply dropped — i.e. no analytics from non-consenters).
// Internal-traffic exclusion (own IP / localhost) lives in PostHog settings.
// ============================================================================

const POSTHOG_DEFAULT_API_HOST = "https://eu.i.posthog.com";
const POSTHOG_DEFAULT_UI_HOST = "https://eu.posthog.com";

export function PostHogConsentSync() {
  const { consents } = useConsentManager();
  const ready = useRef(false);

  // Initialise posthog-js once. Opted out until c15t resolves consent.
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (ready.current || !key || typeof window === "undefined") return;
    ready.current = true;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? POSTHOG_DEFAULT_API_HOST,
      ui_host: POSTHOG_DEFAULT_UI_HOST,
      // Pinned intentionally — PostHog versions its default bundle by date so
      // capture behaviour doesn't shift unexpectedly.
      defaults: "2025-05-24",
      cookieless_mode: "on_reject",
    });
    posthog.opt_out_capturing();
  }, []);

  // Sync measurement consent → PostHog opt in/out whenever it resolves/changes.
  useEffect(() => {
    if (!ready.current) return;
    if (consents.measurement) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, [consents]);

  return null;
}

export default PostHogConsentSync;

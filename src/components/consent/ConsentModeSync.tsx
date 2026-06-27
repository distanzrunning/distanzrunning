"use client";

import { useEffect } from "react";
import { useConsentManager } from "@c15t/nextjs/headless";
import { consentToGcm } from "@/lib/c15t/gcm";

// ============================================================================
// Consent Mode sync (AdSense)
// ----------------------------------------------------------------------------
// Replaces the old ConsentSync. PostHog/GA-style vendors are handled by c15t's
// script loader; AdSense isn't a c15t vendor, so we bridge consent → Google
// Consent Mode here: once the user has decided, push gtag('consent','update')
// reflecting their categories. Until then, the <head> default-deny bootstrap
// (gcmDefaultsScript) keeps AdSense on the denied baseline.
// ============================================================================

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ConsentModeSync() {
  const { consents, hasConsented } = useConsentManager();

  useEffect(() => {
    if (typeof window === "undefined" || !hasConsented()) return;
    const gtag = window.gtag;
    if (typeof gtag !== "function") return;
    gtag("consent", "update", consentToGcm(consents));
  }, [consents, hasConsented]);

  return null;
}

export default ConsentModeSync;

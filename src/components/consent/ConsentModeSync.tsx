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
  const { consents } = useConsentManager();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const gtag = window.gtag;
    if (typeof gtag !== "function") return;
    // Push the RESOLVED consent state to Google Consent Mode whenever it
    // changes — not just after an explicit decision. c15t auto-grants in
    // opt-out / none jurisdictions (outside the EEA), where `hasConsented()`
    // stays false; gating on it would strand those visitors on the denied
    // default and AdSense would never personalise outside the EEA. Pushing the
    // current `consents` is safe pre-decision in the EEA too — it mirrors the
    // denied default already set in <head>.
    gtag("consent", "update", consentToGcm(consents));
  }, [consents]);

  return null;
}

export default ConsentModeSync;

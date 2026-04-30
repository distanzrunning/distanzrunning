"use client";

import { useEffect } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import {
  GCM_DEFAULTS,
  consentToGcm,
  type GcmConsentState,
} from "@/lib/consent-gcm";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    posthog?: {
      opt_in_capturing: () => void;
      opt_out_capturing: () => void;
      has_opted_in_capturing?: () => boolean;
    };
  }
}

/**
 * Bridges our ConsentContext to:
 *   1. Google Consent Mode v2 — calls gtag('consent','update', …)
 *   2. window.dataLayer — pushes a typed `consent_update` event so any GTM
 *      container (client or server-side) we add later can fire on it.
 *   3. PostHog — opts in / out based on the Analytics category.
 *
 * Mount once inside <ConsentProvider>. Renders nothing.
 */
export default function ConsentSync() {
  const { preferences, isDecided } = useConsent();

  useEffect(() => {
    const gcm: GcmConsentState =
      isDecided && preferences ? consentToGcm(preferences) : GCM_DEFAULTS;

    // 1. Google Consent Mode v2 update
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", gcm);
    } else {
      // gtag's defaults script ought to be loaded first, but as a safety
      // net we push the same shape directly to the queue.
      window.dataLayer.push(["consent", "update", gcm]);
    }

    // 2. Custom dataLayer event for GTM custom triggers
    window.dataLayer.push({
      event: "consent_update",
      consent_decided: isDecided,
      ...gcm,
    });

    // 3. PostHog opt-in / opt-out — gated on Analytics consent
    if (typeof window.posthog !== "undefined") {
      if (isDecided && preferences?.analytics) {
        window.posthog.opt_in_capturing();
      } else {
        window.posthog.opt_out_capturing();
      }
    }
  }, [preferences, isDecided]);

  return null;
}

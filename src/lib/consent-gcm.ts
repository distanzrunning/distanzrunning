import type { ConsentPreferences } from "@/contexts/ConsentContext";

// ============================================================================
// Types
// ============================================================================

export type GcmSignal = "granted" | "denied";

/**
 * Google Consent Mode v2 — the seven signals every Google product reads.
 * https://developers.google.com/tag-platform/security/guides/consent
 */
export interface GcmConsentState {
  ad_storage: GcmSignal;
  ad_user_data: GcmSignal;
  ad_personalization: GcmSignal;
  analytics_storage: GcmSignal;
  functionality_storage: GcmSignal;
  personalization_storage: GcmSignal;
  security_storage: GcmSignal;
}

// ============================================================================
// Defaults
// ============================================================================

/** Strict GDPR-aligned defaults: deny everything optional, keep security on. */
export const GCM_DEFAULTS: GcmConsentState = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
};

// ============================================================================
// Mapping — our 4 categories → Google's 7 signals
// ============================================================================

/**
 * | Our category | GCM signals                                              |
 * |--------------|----------------------------------------------------------|
 * | essential    | security_storage                                         |
 * | marketing    | ad_storage, ad_user_data, ad_personalization             |
 * | analytics    | analytics_storage                                        |
 * | functional   | functionality_storage, personalization_storage           |
 */
export function consentToGcm(prefs: ConsentPreferences): GcmConsentState {
  const m: GcmSignal = prefs.marketing ? "granted" : "denied";
  const a: GcmSignal = prefs.analytics ? "granted" : "denied";
  const f: GcmSignal = prefs.functional ? "granted" : "denied";
  return {
    ad_storage: m,
    ad_user_data: m,
    ad_personalization: m,
    analytics_storage: a,
    functionality_storage: f,
    personalization_storage: f,
    security_storage: "granted",
  };
}

// ============================================================================
// Inline-script payload — primes Consent Mode v2 before any tag fires
// ============================================================================

/**
 * Inline JS for the <script> tag in <head>. Sets Consent Mode v2 defaults
 * and seeds `window.dataLayer` + `gtag()` so any GTM container or Google
 * tag that loads later picks up the denied baseline. `wait_for_update`
 * gives the consent UI 500ms to swap defaults for the user's choice
 * before tags start sending hits.
 */
export function gcmDefaultsScript(): string {
  const payload = JSON.stringify({ ...GCM_DEFAULTS, wait_for_update: 500 });
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',${payload});`;
}

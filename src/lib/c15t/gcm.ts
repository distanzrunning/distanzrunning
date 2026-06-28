import type { ConsentState } from "c15t";

// ============================================================================
// Google Consent Mode v2 — AdSense bridge
// ----------------------------------------------------------------------------
// c15t's @c15t/scripts gtag/GTM helpers own GCM when there's a Google *tag*.
// We don't run GA/GTM — only AdSense — so we keep a tiny inline default-deny
// bootstrap (primes Consent Mode before AdSense loads) plus a consent-change
// bridge that fires gtag('consent','update',…). c15t omits Google's
// `wait_for_update` knob, so we set it here to match prior behaviour.
// ============================================================================

export type GcmSignal = "granted" | "denied";

/** The seven Consent Mode v2 signals every Google product reads. */
export interface GcmConsentState {
  ad_storage: GcmSignal;
  ad_user_data: GcmSignal;
  ad_personalization: GcmSignal;
  analytics_storage: GcmSignal;
  functionality_storage: GcmSignal;
  personalization_storage: GcmSignal;
  security_storage: GcmSignal;
}

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

/**
 * Map c15t's consent categories → Google's seven signals. Mirrors c15t's own
 * gtag mapping, with `functionality` also driving `personalization_storage`
 * (we don't expose the separate `experience` category).
 *
 * | c15t category | GCM signals                                    |
 * |---------------|------------------------------------------------|
 * | necessary     | security_storage                               |
 * | marketing     | ad_storage, ad_user_data, ad_personalization   |
 * | measurement   | analytics_storage                              |
 * | functionality | functionality_storage, personalization_storage |
 */
export function consentToGcm(consents: Partial<ConsentState>): GcmConsentState {
  const marketing: GcmSignal = consents.marketing ? "granted" : "denied";
  const measurement: GcmSignal = consents.measurement ? "granted" : "denied";
  const functionality: GcmSignal = consents.functionality
    ? "granted"
    : "denied";
  return {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: measurement,
    functionality_storage: functionality,
    personalization_storage: functionality,
    security_storage: "granted",
  };
}

/**
 * Inline JS for the <head> <script>. Seeds `window.dataLayer` + `gtag()` and
 * sets Consent Mode v2 defaults (deny) so AdSense picks up the denied baseline
 * before it loads. `wait_for_update` gives the consent UI 500ms to swap in the
 * user's choice before tags send hits.
 */
export function gcmDefaultsScript(): string {
  const payload = JSON.stringify({ ...GCM_DEFAULTS, wait_for_update: 500 });
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',${payload});`;
}

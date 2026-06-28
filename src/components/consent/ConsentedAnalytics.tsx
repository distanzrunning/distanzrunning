"use client";

import { Analytics } from "@vercel/analytics/react";
import { useConsentManager } from "@c15t/nextjs/headless";

// ============================================================================
// Vercel Web Analytics, gated on `measurement` consent.
// ----------------------------------------------------------------------------
// Vercel Analytics is cookieless (no cookies / persistent ids) and GDPR-
// compliant without consent, so this gating is a deliberate, conservative
// choice for consistency with PostHog — not a legal requirement. We gate the
// native React component (rather than c15t's vercelAnalytics() script helper)
// so we keep Next App Router SPA pageview tracking, which the component
// provides and the raw script does not reliably. SpeedInsights is intentionally
// NOT gated — it's anonymous Core Web Vitals (performance), not behavioural
// analytics, so gating it loses data with no privacy benefit.
// ============================================================================

export function ConsentedAnalytics() {
  const { consents } = useConsentManager();
  if (!consents.measurement) return null;
  return <Analytics />;
}

export default ConsentedAnalytics;

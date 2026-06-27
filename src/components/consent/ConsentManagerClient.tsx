"use client";

import { type ReactNode } from "react";
import { ConsentManagerProvider } from "@c15t/nextjs/headless";

// ============================================================================
// c15t consent manager (client root)
// ----------------------------------------------------------------------------
// Self-hosted: mode 'hosted' pointed at OUR backend route (/api/c15t). Headless
// — the UI is our Stride banner/dialog (see ConsentBanner.tsx), driven by c15t
// hooks.
//
// PostHog uses c15t's "SDK pattern" (PostHogConsentSync), NOT the script helper,
// because our app calls posthog.capture(...) via `import posthog from
// "posthog-js"` directly — see PostHogConsentSync for the why. So there are no
// c15t-loaded `scripts` here; consent is synced to the SDK instead. AdSense
// Consent Mode is handled by ConsentModeSync.
// ============================================================================

export function ConsentManagerClient({ children }: { children: ReactNode }) {
  return (
    <ConsentManagerProvider
      options={{
        mode: "hosted",
        backendURL: "/api/c15t",
        consentCategories: [
          "necessary",
          "functionality",
          "measurement",
          "marketing",
        ],
      }}
    >
      {children}
    </ConsentManagerProvider>
  );
}

export default ConsentManagerClient;

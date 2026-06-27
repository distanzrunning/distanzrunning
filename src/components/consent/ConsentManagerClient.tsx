"use client";

import { type ReactNode } from "react";
import { ConsentManagerProvider } from "@c15t/nextjs/headless";
import { posthog } from "@c15t/scripts/posthog";
import type { Script } from "c15t";

// ============================================================================
// c15t consent manager (client root)
// ----------------------------------------------------------------------------
// Self-hosted: mode 'hosted' pointed at OUR backend route (/api/c15t). Headless
// — the UI is our Stride banner/dialog (see ConsentBanner.tsx), driven by c15t
// hooks. Third-party scripts are registered here so c15t gates them on consent.
// ============================================================================

// Consent-gated third-party scripts. PostHog loads only after `measurement`
// consent (loadMode: 'after-consent'); c15t then manages opt-in/out natively,
// replacing the old opt-out-by-default inline init. Internal-traffic exclusion
// (localhost / our own IP) now lives in PostHog's project settings, not app JS.
function buildScripts(): Script[] {
  const scripts: Script[] = [];
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (posthogKey) {
    scripts.push(
      posthog({
        id: posthogKey,
        ...(posthogHost ? { apiHost: posthogHost } : {}),
        loadMode: "after-consent",
        initOptions: { defaults: "2025-05-24" },
      }),
    );
  }

  return scripts;
}

const scripts = buildScripts();

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
        scripts,
      }}
    >
      {children}
    </ConsentManagerProvider>
  );
}

export default ConsentManagerClient;

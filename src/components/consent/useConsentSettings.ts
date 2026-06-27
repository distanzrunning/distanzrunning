"use client";

import { useCallback } from "react";
import { useConsentManager } from "@c15t/nextjs/headless";

// ============================================================================
// useConsentSettings — opens the consent settings dialog from anywhere.
// Thin wrapper over c15t's setActiveUI('dialog') so call sites read the same as
// the old context's openSettings(). Must be used inside <ConsentManagerClient>.
// ============================================================================

export function useConsentSettings(): { openSettings: () => void } {
  const { setActiveUI } = useConsentManager();
  const openSettings = useCallback(
    () => setActiveUI("dialog"),
    [setActiveUI],
  );
  return { openSettings };
}

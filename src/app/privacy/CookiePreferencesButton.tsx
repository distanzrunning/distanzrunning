"use client";

import { Cookie } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useConsentSettings } from "@/components/consent/useConsentSettings";

// Re-opens the consent preferences modal from anywhere the privacy
// page (or other policy surfaces) wants to expose it. Replaces the
// "floating cookie button" pattern other libraries use — surfaced
// from copy that's already about cookies instead.
export function CookiePreferencesButton() {
  const { openSettings } = useConsentSettings();
  return (
    <Button
      type="button"
      variant="secondary"
      size="small"
      prefixIcon={<Cookie />}
      onClick={openSettings}
    >
      Manage cookie preferences
    </Button>
  );
}

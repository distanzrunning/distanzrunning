"use client";

// src/components/FooterCookiesButton.tsx
//
// Extracted so Footer can be a server component — the Cookies action
// is the only spot in the footer that needs a hook (useConsentSettings
// to open the consent settings dialog), and a function can't cross the
// server→client boundary as a prop. A server component may render this
// client child directly; styling stays single-sourced via the
// className prop (Footer's linkClasses).

import { useConsentSettings } from "@/components/consent/useConsentSettings";

export default function FooterCookiesButton({
  className,
}: {
  className?: string;
}) {
  const { openSettings } = useConsentSettings();

  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookies
    </button>
  );
}

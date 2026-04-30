// src/sanity/components/StudioLogo.tsx
//
// Custom logo for the Sanity Studio top-left, swapping Sanity's
// default mark for the Distanz wordmark. Same inline-SVG component
// the public site header uses, so the colour follows currentColor —
// the Studio applies its own text colour to the navbar slot, which
// the wordmark picks up automatically (light + dark mode safe).

"use client";

import Wordmark from "@/components/ui/Wordmark";

export default function StudioLogo() {
  return (
    <Wordmark
      className="h-6 w-auto"
      aria-hidden={false}
      aria-label="Distanz Running"
      role="img"
    />
  );
}

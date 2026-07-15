// src/components/home/PromoUnit.tsx
//
// Full-bleed brand promo band (404 Media's .promo-unit): who we are, a
// link to /about, and a subscribe CTA. The fill is the OPPOSITE theme's
// canvas — bg-canvasInverted (#000 in light / #FAFAFA in dark, the same
// move as 404's --color-bg-reverse) with text-textInverted on top — so
// the band is a true theme inversion and flips automatically. Straight
// edges (404's diagonal clip is their brand flourish, not ours).
//
// The icon is inlined with fill="currentColor" (same treatment as
// Wordmark.tsx) so it follows the band's text colour — one asset, no
// black/white file swap, no load flash.

import Link from "next/link";
import type { SVGProps } from "react";

function BrandIcon(props: SVGProps<SVGSVGElement>) {
  // Paths + viewBox copied verbatim from public/brand/icon-black.svg.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M865.86,333.86c34.04-97.61-25.3-213.89-124.87-243.87-48.18-15.81-96.19-11.82-146.12-12.43-38.2.61-88.06.07-109.84,36.42-16.6,29.75-.78,65.48,29.79,78.2,19.57,8.73,43.8,9.91,65.71,10.47,26.62.51,53.37-.55,78.13.84,34.22,1.23,65.95,10.59,79.73,42.69,12.51,28.42,1.65,60.79-22.85,80.61-23.35,19.87-53.47,32.04-81.34,44.72-50.64,22.67-108.55,48.17-155.48,69.75-33.93,15.71-67.88,31.46-103.93,46.85-103.31,44.48-200.83,72.49-233.86,161.7-21.78,49.7-22.75,109.34,2.02,158.24,26.43,55.64,81.14,97.31,141.28,108.65,36.26,7.64,72.07,5.21,110.2,5.78,43.71-.45,106.62,3.51,124.31-45.92,4.55-13.97,3.18-29.92-4.65-42.48-38.15-56.61-143.95-27.27-201.5-41.24-33-7.21-59.53-37.39-55.81-72.1,6.68-56.06,82.48-78.95,126.83-100.28,47.26-21.14,95.63-42.44,141.58-63.63l.16-.07c64.95-31.07,137.35-60.67,203.38-88.51,61.76-25.92,114.62-69.66,137.12-134.4Z" />
      <path d="M810,620c-104.93,0-190,85.07-190,190s85.07,190,190,190,190-85.07,190-190-85.07-190-190-190ZM810,870c-33.14,0-60-26.86-60-60s26.86-60,60-60,60,26.86,60,60-26.86,60-60,60Z" />
      <path d="M380,190C380,85.07,294.93,0,190,0S0,85.07,0,190s85.07,190,190,190,190-85.07,190-190ZM130,190c0-33.14,26.86-60,60-60s60,26.86,60,60-26.86,60-60,60-60-26.86-60-60Z" />
    </svg>
  );
}

const bandLink =
  "underline underline-offset-[3px] decoration-1 hover:decoration-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)]";

export default function PromoUnit() {
  return (
    <section
      aria-label="About Distanz Running"
      // data-nav-surface: tells the sticky Masthead a contrasting band is
      // passing under it — its hairline rule goes transparent (the
      // colour-aware border). Any future non-canvas full-bleed section
      // should declare this too.
      data-nav-surface="inverted"
      className="bg-canvasInverted text-textInverted"
    >
      <div className="mx-auto flex max-w-content flex-col items-center gap-5 px-6 py-14 text-center lg:py-20">
        <BrandIcon className="h-8 w-8" />
        {/* 404-verbatim type. Their html{font-size:1.05rem} compounds
            every rem: description = 1.155rem × 16.8px root = 19.4px
            regular (≈ copy-20), CTA h6 = .84rem = 14.1px mono uppercase
            (≈ label-14-mono). Box is wider than 404's 800px so this
            copy balances onto two lines (needs ~1000px; measured). */}
        <p className="max-w-[1040px] text-balance text-copy-20">
          Distanz Running is an independent sport publication — our aim is
          to provide curated quality running stories, gear reviews and
          interactive race guides. Read more about us{" "}
          <Link href="/about" className={bandLink}>
            here
          </Link>
          .
        </p>
        {/* CTA in mono caps — a DELIBERATE register choice (user call,
            July 2026): the mono contrast against the sans description is
            the point. Documented as a sanctioned use on the DS Typography
            page (label-14-mono: "…uppercase brand accents"). */}
        <p className="text-label-14-mono uppercase">
          Support our journalism.{" "}
          <Link href="/signup" className={bandLink}>
            Subscribe
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

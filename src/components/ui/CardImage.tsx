"use client";

import { useState } from "react";
import Image from "next/image";

// ============================================================================
// CardImage
// ============================================================================
//
// Uniform skeleton-aware image used by every card primitive
// (ArticleCard, RaceCard, HomepageGear featured slot). Shows a
// pulsing --ds-gray-100 block while the underlying next/image is
// still decoding, then cross-fades the image in over 300 ms when
// the load event fires.
//
// Replaces the previous blur placeholder pattern — uniform aesthetic
// across all card surfaces, no per-image blur asset to fetch, and
// the skeleton continues animating during slow connections instead
// of sitting as a static blurred preview.
//
// Container is responsible for `position: relative` + an aspect
// ratio (so the box reserves space and there's no layout shift).
// CardImage uses `fill` and `object-cover` to fit the container.

export interface CardImageProps {
  src: string;
  alt: string;
  /** Tells next/image which width to download per breakpoint. */
  sizes?: string;
  /** Mark above-the-fold images as priority — disables lazy load. */
  priority?: boolean;
  /** Extra classes appended to the <Image>. */
  className?: string;
}

export default function CardImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: CardImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 bg-[color:var(--ds-gray-100)] transition-opacity duration-300 ${
          loaded ? "pointer-events-none opacity-0" : "animate-pulse opacity-100"
        }`}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`.trim()}
      />
    </>
  );
}

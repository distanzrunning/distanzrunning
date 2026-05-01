"use client";

import { useEffect, useRef, useState } from "react";
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
  const imgRef = useRef<HTMLImageElement | null>(null);

  // If the image is already in the browser cache (e.g. revisited
  // page, or a preload tag fired before hydration), the browser
  // decodes it before React attaches onLoad — so onLoad never
  // fires and the skeleton sits forever. Check `complete` on
  // mount; if the image is ready, mark loaded immediately. If
  // not, fall through to the onLoad handler on the <Image>.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {/* Skeleton overlay — sits ON TOP of the (already-rendered)
          image and melts away when the image load fires. The image
          itself is always opacity:1 so it's painted underneath the
          skeleton from the start; the skeleton's fade-out reveals
          it rather than the image fading in. With staggered loads
          this reads as multiple skeletons dissolving rather than a
          wave of images popping in. */}
      <div
        aria-hidden
        className={`absolute inset-0 z-10 bg-[color:var(--ds-gray-100)] transition-opacity duration-300 ease-out ${
          loaded ? "pointer-events-none opacity-0" : "animate-pulse opacity-100"
        }`}
      />
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`object-cover ${className}`.trim()}
      />
    </>
  );
}

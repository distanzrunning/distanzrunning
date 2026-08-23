"use client";

import Image from "next/image";

// ============================================================================
// CardImage
// ============================================================================
//
// Uniform image used by the card primitives (currently RaceCard).
// Three layers, all absolutely positioned inside the container:
//   1. A pulsing --ds-gray-100 skeleton — always rendered.
//   2. The LQIP backdrop (when provided) — the image's own inline
//      base64 preview, painted as a persistent background layer.
//   3. The Next.js <Image> on top, which FADES IN over the LQIP
//      once its bytes have decoded.
//
// Why the fade: next/image's built-in placeholder="blur" swap is an
// instant cut — on the /races grid, nine cards cutting from blur to
// sharp at staggered times reads as the grid "flickering" right
// after the loading skeleton (user report 2026-08-24, reproduced
// with a throttled-network frame capture). Keeping the LQIP as its
// own layer under an opacity-transitioned image turns each cut into
// a 300 ms cross-fade — the same photo is always beneath, so
// nothing can flash.
//
// Warm navigations stay instant two ways: an image already complete
// at mount (hydration over SSR paint) is marked loaded synchronously
// before first paint, and an image whose load lands within 100 ms of
// mount (a browser-cache hit re-fetched by a soft-nav remount) skips
// the transition — the fade only ever runs for images that genuinely
// arrived late off the network. No React state anywhere: load
// progress flips a data attribute on the <img> itself, so there is
// no re-render and no remount to flash at the skeleton→content
// swap.
//
// Container is responsible for `position: relative` + aspect ratio.
// CardImage uses `fill` + `object-cover` to fit.

export interface CardImageProps {
  src: string;
  alt: string;
  /** Tells next/image which width to download per breakpoint. */
  sizes?: string;
  /** Mark above-the-fold images as priority — disables lazy load. */
  priority?: boolean;
  /** Inline LQIP (Sanity asset->metadata.lqip) — painted as the
      persistent backdrop the sharp image fades in over. */
  blurDataURL?: string | null;
  /** Extra classes appended to the <Image>. */
  className?: string;
}

/** Below this mount→load gap the bytes came from the browser cache —
 *  reveal instantly instead of fading. */
const CACHE_HIT_MS = 100;

/** Mark the img loaded. Lives on a data attribute (not state) so the
 *  flip is a style-only change — Tailwind's data variant runs the
 *  opacity transition. `instant` suppresses the transition for this
 *  flip (cache hits). */
function markLoaded(img: HTMLImageElement, instant: boolean) {
  if (instant) img.style.transitionDuration = "0s";
  img.dataset.loaded = "true";
}

export default function CardImage({
  src,
  alt,
  sizes,
  priority = false,
  blurDataURL,
  className = "",
}: CardImageProps) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 animate-pulse bg-[color:var(--ds-gray-100)]"
      />
      {blurDataURL && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        decoding="async"
        ref={(img) => {
          if (!img) return;
          // Complete before mount (hydration over an SSR paint):
          // mark loaded synchronously so it's sharp from the first
          // frame. Otherwise stamp the mount time so onLoad can
          // tell a cache hit from a network arrival.
          if (img.complete && img.naturalWidth > 0) {
            markLoaded(img, true);
          } else {
            img.dataset.mountedAt = String(performance.now());
          }
        }}
        onLoad={(e) => {
          const img = e.currentTarget;
          const mountedAt = Number(img.dataset.mountedAt ?? NaN);
          const instant =
            Number.isFinite(mountedAt) &&
            performance.now() - mountedAt < CACHE_HIT_MS;
          markLoaded(img, instant);
        }}
        className={`object-cover opacity-0 transition-opacity duration-300 data-[loaded=true]:opacity-100 ${className}`.trim()}
      />
    </>
  );
}

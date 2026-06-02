import Image from "next/image";

// ============================================================================
// CardImage
// ============================================================================
//
// Uniform image used by every card primitive (ArticleCard, RaceCard,
// HomepageGear featured slot). Two layers, both absolutely positioned
// inside the container:
//   1. A pulsing --ds-gray-100 skeleton — always rendered.
//   2. The Next.js <Image> on top.
//
// No JS state, no fade, no onLoad handler. While the image is
// decoding it has no rendered pixels, so the skeleton beneath
// shows through; once the browser draws the image it covers the
// skeleton entirely. No "loaded → not loaded" toggle means no
// React re-render and nothing to flash when the swap happens —
// the image just gradually replaces the skeleton as bytes arrive.
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
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 animate-pulse bg-[color:var(--ds-gray-100)]"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        decoding="async"
        className={`object-cover ${className}`.trim()}
      />
    </>
  );
}

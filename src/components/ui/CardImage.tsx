import Image from "next/image";

// ============================================================================
// CardImage
// ============================================================================
//
// Uniform image used by every card primitive (ArticleCard, RaceCard,
// HomepageGear featured slot). The card's own container provides
// the --ds-gray-100 placeholder background and the aspect ratio,
// so this component is just a thin Next.js Image wrapper — no
// JS-managed skeleton overlay, no fade transition. The container
// bg shows while the image decodes; once decoded the image renders
// in place without any cross-fade. This avoids the staggered
// "wave of fade-ins" effect when many cards load at once.
//
// Container is responsible for `position: relative` + aspect ratio
// + `bg-[color:var(--ds-gray-100)]`. CardImage uses `fill` +
// `object-cover` to fit.

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
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      decoding="async"
      className={`object-cover ${className}`.trim()}
    />
  );
}

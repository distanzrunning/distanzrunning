import { ReactNode } from "react";

export interface BlockquoteProps {
  /** Quote text content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Blockquote component for quoting a passage of text or speech from another source.
 *
 * Features a pink left border accent and serif typography for an authoritative feel.
 *
 * @example
 * <Blockquote>
 *   Give, give, they cry–and take! For wilful men are they
 *   Who tax'd our cake, and took our cake, To throw our cake away.
 * </Blockquote>
 */
export default function Blockquote({
  children,
  className = "",
}: BlockquoteProps) {
  return (
    <blockquote
      className={`
        border-l-4 border-electric-pink
        pl-6 my-8
        font-serif text-[19px] leading-[28px] md:text-[21px] md:leading-[32px]
        text-textDefault
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
    >
      {children}
    </blockquote>
  );
}

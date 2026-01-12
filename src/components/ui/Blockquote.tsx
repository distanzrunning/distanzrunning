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
 * Features a left border accent and italic styling.
 *
 * @example
 * <Blockquote>
 *   Give, give, they cry–and take! For wilful men are they
 *   Who tax'd our cake, and took our cake, To throw our cake away.
 * </Blockquote>
 */
export default function Blockquote({ children, className = "" }: BlockquoteProps) {
  return (
    <blockquote
      className={`
        border-l-4 border-borderNeutral dark:border-asphalt-60
        pl-6 my-8
        font-sans text-[17px] leading-[25px] md:text-[19px] md:leading-[28px]
        text-textDefault italic
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      {children}
    </blockquote>
  );
}

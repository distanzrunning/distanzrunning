import { ReactNode } from "react";

export interface PullQuoteProps {
  /** Quote text content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PullQuote component for brief, attention-grabbing quotations from the main text.
 *
 * Unlike blockquotes (which cite external sources), pull-quotes highlight
 * key statements from within the article to draw reader attention.
 *
 * @example
 * <PullQuote>
 *   Never in the history of journalism has so much been read for so long by so few
 * </PullQuote>
 */
export default function PullQuote({ children, className = "" }: PullQuoteProps) {
  return (
    <figure
      className={`
        my-10 py-6
        border-t-4 border-b-4 border-electric-pink
        text-center
        ${className}
      `.replace(/\s+/g, " ").trim()}
    >
      <blockquote
        className="
          font-serif text-[24px] leading-[32px] md:text-[28px] md:leading-[38px]
          text-textDefault
          px-4 md:px-8
        "
      >
        {children}
      </blockquote>
    </figure>
  );
}

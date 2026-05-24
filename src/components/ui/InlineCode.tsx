import type { HTMLAttributes, ReactNode } from "react";

interface InlineCodeProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/**
 * Inline monospace chip for short tokens in body copy — env var names,
 * file paths, flag names, short identifiers. Wraps the shared
 * `inline-code` CSS class defined in `globals.css` so the
 * design-system stays the single source of truth for the style.
 *
 * Use this for inline tokens; reach for `<Snippet>` for runnable
 * shell commands and `<CodeBlock>` for multi-line source.
 */
export function InlineCode({ children, className = "", ...rest }: InlineCodeProps) {
  return (
    <code className={`inline-code ${className}`.trim()} {...rest}>
      {children}
    </code>
  );
}

export default InlineCode;

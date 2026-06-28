"use client";

export interface CodeProps {
  /** The code snippet to render (a string). */
  children: string;
  /**
   * Language id, applied as a class on the `<pre>` for semantics. Geist's
   * Code renders monochrome (no per-token colours), so this does not tint
   * the text — for coloured, copyable output use <CodeBlock>.
   */
  language?: string;
  className?: string;
}

/**
 * Code — a bordered, monochrome code snippet (read-only `<pre><code>`,
 * rendered in the foreground colour, no chrome). Matches Geist's Code:
 * plain text in `--geist-foreground`, not per-token syntax colours. For a
 * copyable, titled, colour-highlighted block use <CodeBlock>.
 */
export function Code({
  children,
  language = "tsx",
  className = "",
}: CodeProps) {
  return (
    <pre
      className={`touch-pan-y overflow-x-auto whitespace-pre rounded-[5px] border border-[var(--ds-gray-alpha-400)] p-6 ${language} ${className}`}
    >
      <code
        className="block font-mono text-[13px] leading-[20px] text-textDefault"
        style={{ fontFeatureSettings: '"liga" 0' }}
      >
        {children.replace(/\n$/, "")}
      </code>
    </pre>
  );
}

export default Code;

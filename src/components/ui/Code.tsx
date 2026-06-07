"use client";

import { Fragment } from "react";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "./useShikiHighlighter";

export interface CodeProps {
  /** The code snippet to render (a string). */
  children: string;
  /** Shiki language id (default `tsx`). */
  language?: string;
  className?: string;
}

/**
 * Code — a bordered, syntax-highlighted snippet. A read-only `<pre><code>`
 * with no chrome (no copy button, filename, or line numbers); for a
 * copyable, titled block use <CodeBlock> instead.
 */
export function Code({ children, language = "tsx", className = "" }: CodeProps) {
  const code = children.replace(/\n$/, "");
  const tokenizedLines = useShikiHighlighter(code, language);
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    code.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "hsl(var(--color-textDefault))",
            darkColor: "hsl(var(--color-textDefault))",
          },
        ] as DualThemeToken[],
    );

  return (
    <pre
      className={`touch-pan-y overflow-x-auto whitespace-pre rounded-[5px] border border-[var(--ds-gray-alpha-400)] p-6 ${className}`}
    >
      <code
        className="block font-mono text-[13px] leading-[20px] text-textDefault"
        style={{ fontFeatureSettings: '"liga" 0' }}
      >
        {lines.map((lineTokens, i) => (
          <Fragment key={i}>
            {lineTokens.map((token, j) => (
              <span key={j} style={getTokenStyle(token)}>
                {token.content}
              </span>
            ))}
            {i < lines.length - 1 ? "\n" : null}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}

export default Code;

"use client";

// CodePreview — the bordered card every DS component doc page uses to
// show a rendered example alongside its source.
//
// Top half is the live preview, bottom half is a "Show code" accordion
// that reveals the Shiki-highlighted source with a copy button.
//
// This file is the canonical implementation. Older component doc pages
// still carry near-identical local copies of the same component; they
// can migrate to this shared module incrementally.

import { useCallback, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

function CopyIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
      >
        <CopyIcon />
      </span>
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <CheckIcon />
      </span>
    </div>
  );
}

export interface CodePreviewProps {
  /** Live JSX rendered in the top half of the card */
  children: ReactNode;
  /** Source string shown in the collapsible "Show code" area */
  componentCode: string;
  /** Shiki language identifier — defaults to "tsx" */
  language?: string;
}

export function CodePreview({
  children,
  componentCode,
  language = "tsx",
}: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = useShikiHighlighter(componentCode, language);
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "rgb(var(--color-textDefault))",
            darkColor: "rgb(var(--color-textDefault))",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="border border-borderDefault rounded-lg overflow-hidden">
      {/* Preview area */}
      <div className="p-6" style={{ background: "var(--ds-background-100)" }}>
        {children}
      </div>

      {/* Accordion trigger */}
      <div style={{ background: "var(--ds-background-200)" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-copy-14 text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>

        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-borderDefault opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-canvas hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>

              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-copy-13 leading-[20px] font-mono">
                  {lines.map((lineTokens, index) => (
                    <div
                      key={index}
                      className="flex px-4"
                      style={{ fontFeatureSettings: '"liga" off' }}
                    >
                      <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">
                        {index + 1}
                      </span>
                      <span className="flex-1 pr-4">
                        {lineTokens.map((token, i) => (
                          <RenderShikiToken key={i} token={token} />
                        ))}
                        {lineTokens.length === 0 && " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodePreview;

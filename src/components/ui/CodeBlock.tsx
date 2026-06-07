"use client";

import { useState } from "react";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiLua,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { FiFile } from "react-icons/fi";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "./useShikiHighlighter";
import { CopyButton } from "./CopyButton";

// Get file icon based on language/filename
function getFileIcon(filename?: string, language?: string) {
  const ext = filename?.split(".").pop()?.toLowerCase() || language;

  switch (ext) {
    case "jsx":
    case "tsx":
      return <SiReact size={16} className="text-textSubtle" />;
    case "ts":
      return <SiTypescript size={16} className="text-textSubtle" />;
    case "js":
      return <SiJavascript size={16} className="text-textSubtle" />;
    case "json":
      return <VscJson size={16} className="text-textSubtle" />;
    case "next":
      return <SiNextdotjs size={16} className="text-textSubtle" />;
    case "lua":
      return <SiLua size={16} className="text-textSubtle" />;
    default:
      return <FiFile size={16} className="text-textSubtle" />;
  }
}

export interface SwitcherOption {
  label: string;
  value: string;
}

export interface SwitcherProps {
  options: SwitcherOption[];
  value: string;
  onChange: (value: string) => void;
  /**
   * Render the switcher as a secondary tab bar above the header instead of
   * the default select dropdown in the header.
   */
  tabs?: boolean;
}

export interface CodeBlockProps {
  /** The code content to display. Can be passed as children or as this prop. */
  code?: string;
  /** The code content as children (alternative to code prop) */
  children?: string;
  /** Filename to display in the header */
  filename?: string;
  /** Language for syntax highlighting and file icon */
  language?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Line numbers to highlight with a background color */
  highlightLines?: number[];
  /** Line numbers to mark as added (green, with + prefix) */
  addedLines?: number[];
  /** Line numbers to mark as removed (red, with - prefix) */
  removedLines?: number[];
  /** Line numbers to make clickable */
  referencedLines?: number[];
  /** Accessible label for the code block */
  "aria-label"?: string;
  /** Language switcher configuration */
  switcher?: SwitcherProps;
}

// Render a single token with dual theme support
function RenderToken({
  token,
  diffMode,
}: {
  token: DualThemeToken;
  diffMode?: "added" | "removed";
}) {
  const style = getTokenStyle(token, diffMode);
  return <span style={style}>{token.content}</span>;
}

export function CodeBlock({
  code,
  children,
  filename,
  language,
  showLineNumbers = true,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  referencedLines = [],
  "aria-label": ariaLabel,
  switcher,
}: CodeBlockProps) {
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const codeContent = code || children || "";

  // Use Shiki for syntax highlighting
  const tokenizedLines = useShikiHighlighter(codeContent, language, filename);

  const handleLineClick = (lineNumber: number) => {
    if (referencedLines.includes(lineNumber)) {
      setSelectedLines((prev) =>
        prev.includes(lineNumber) ? [] : [lineNumber],
      );
    }
  };

  // Show plain text while loading
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    codeContent.split("\n").map(
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
    <div
      className="relative border border-borderDefault rounded-md overflow-hidden group"
      data-code-block
      aria-label={ariaLabel}
    >
      {/* Language switcher as a secondary tab bar (Geist `tabs`) */}
      {switcher?.tabs && (
        <div
          className="flex items-center bg-canvas pt-3 pl-4 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="flex flex-nowrap items-center gap-2 pb-px"
          >
            {switcher.options.map((option) => {
              const selected = option.value === switcher.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => switcher.onChange(option.value)}
                  className={`flex h-6 cursor-pointer items-center rounded-md px-1.5 text-[13px] outline-none transition-colors focus-visible:shadow-[var(--ds-focus-ring)] ${
                    selected
                      ? "bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)]"
                      : "bg-[var(--ds-gray-alpha-200)] text-textDefault"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Header with filename */}
      {filename && (
        <div
          className="flex items-center justify-between h-12 pl-4 pr-3 border-b border-borderDefault"
          style={{
            // Geist: recessed header on bg-200 over the bg-100 code body.
            background: "hsl(var(--color-canvas))",
            borderRadius: "6px 6px 0 0",
          }}
        >
          <div className="flex items-center gap-2">
            {getFileIcon(filename, language)}
            <span className="text-[13px] text-textSubtle">{filename}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Language Switcher - Geist style with visible label overlay */}
            {switcher && !switcher.tabs && (
              <div className="relative rounded hover:bg-[var(--ds-gray-200)] dark:hover:bg-[var(--ds-gray-100)] transition-colors">
                <div
                  aria-hidden="true"
                  className="flex items-center gap-1 pointer-events-none text-[12px] text-textSubtle px-2 py-1.5"
                >
                  <span>
                    {
                      switcher.options.find((o) => o.value === switcher.value)
                        ?.label
                    }
                  </span>
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
                      d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <select
                  value={switcher.value}
                  onChange={(e) => switcher.onChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full text-[12px]"
                >
                  {switcher.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Copy button — ghost, sits in the recessed header bar */}
            <CopyButton
              value={codeContent}
              variant="ghost"
              size="small"
              aria-label="Copy code"
            />
          </div>
        </div>
      )}

      {/* Copy button for no-header variant — a bordered chip floating top-right */}
      {!filename && (
        <div
          className={`absolute right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100 ${
            lines.length === 1 ? "top-1/2 -translate-y-1/2" : "top-3"
          }`}
        >
          <CopyButton
            value={codeContent}
            variant="secondary"
            size="small"
            aria-label="Copy code"
          />
        </div>
      )}

      {/* Code content */}
      <pre
        className="overflow-x-auto py-4"
        style={{ background: "hsl(var(--color-surface))" }}
      >
        <code className="block text-[13px] leading-[20px] font-mono">
          {lines.map((lineTokens, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightLines.includes(lineNumber);
            const isAdded = addedLines.includes(lineNumber);
            const isRemoved = removedLines.includes(lineNumber);
            const isReferenced = referencedLines.includes(lineNumber);
            const isSelected = selectedLines.includes(lineNumber);

            let lineBackground = "";
            let linePrefix = "";
            let prefixColor = "";

            if (isHighlighted) {
              lineBackground = "bg-[var(--ds-blue-200)]";
            } else if (isAdded) {
              lineBackground = "bg-[var(--ds-green-200)]";
              linePrefix = "+";
              prefixColor = "text-[var(--ds-green-900)]";
            } else if (isRemoved) {
              lineBackground = "bg-[var(--ds-red-200)]";
              linePrefix = "-";
              prefixColor = "text-[var(--ds-red-900)]";
            }

            return (
              <div
                key={index}
                className={`flex px-4 ${lineBackground}`}
                style={{
                  fontFeatureSettings: '"liga" off',
                  boxShadow: isSelected
                    ? "oklch(0.5279 0.1496 54.65) 2px 0px 0px 0px inset"
                    : undefined,
                  backgroundColor: isSelected
                    ? "oklch(0.9593 0.0636 90.52)"
                    : undefined,
                }}
              >
                {/* Diff prefix for added/removed lines */}
                {(addedLines.length > 0 || removedLines.length > 0) && (
                  <span
                    className={`select-none w-[16px] min-w-[16px] text-left ${prefixColor}`}
                  >
                    {linePrefix}
                  </span>
                )}
                {/* Line number */}
                {showLineNumbers && (
                  <span
                    onClick={() => handleLineClick(lineNumber)}
                    className={`select-none w-[32px] min-w-[32px] text-right pr-4 transition-colors ${
                      isReferenced
                        ? "cursor-pointer [color:rgb(168,168,168)] hover:![color:black]"
                        : "text-textSubtler"
                    }`}
                  >
                    {lineNumber}
                  </span>
                )}
                {/* Line content */}
                <span className="flex-1 pr-4">
                  {lineTokens.map((token, i) => (
                    <RenderToken
                      key={i}
                      token={token}
                      diffMode={
                        isAdded ? "added" : isRemoved ? "removed" : undefined
                      }
                    />
                  ))}
                  {lineTokens.length === 0 && " "}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

export default CodeBlock;

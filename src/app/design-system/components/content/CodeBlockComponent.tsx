"use client";

import { useState, useCallback } from "react";
import { Section } from "../ContentWithTOC";

// Toast notification for copy confirmation
function Toast({
  message,
  isVisible,
  onDismiss,
}: {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-borderNeutral"
        style={{ background: "var(--ds-background-100)" }}
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-textDefault">{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <svg
            height="16"
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Global toast state management
let toastTimeout: NodeJS.Timeout | null = null;

function useToast() {
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = useCallback((message: string) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast({ message, isVisible: true });
    toastTimeout = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, dismissToast };
}

// Copy icon for code blocks
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

// Check icon for copy confirmation
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

// React file icon
function ReactIcon() {
  return (
    <svg height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M8 9.4a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z"
        fill="currentColor"
      />
      <path
        clipRule="evenodd"
        d="M8 8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm1.4-.75a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M7.995 10.603c2.957 0 5.598-.656 7.302-1.686.86-.52 1.528-1.136 1.907-1.835.384-.71.47-1.514.135-2.31-.323-.77-.963-1.331-1.752-1.754-.776-.416-1.75-.726-2.842-.937a.65.65 0 1 0-.225 1.28c1.007.195 1.865.474 2.517.824.64.343 1.072.736 1.278 1.228.195.465.163.909-.098 1.392-.256.473-.728.935-1.432 1.361-1.47.89-3.883 1.537-6.79 1.537-2.907 0-5.32-.648-6.79-1.537-.704-.426-1.176-.888-1.432-1.361-.261-.483-.293-.927-.098-1.392.206-.492.638-.885 1.278-1.228.652-.35 1.51-.629 2.517-.823a.65.65 0 0 0-.225-1.281c-1.092.21-2.066.52-2.842.937C.614 3.467-.026 4.028-.35 4.798c-.334.796-.249 1.6.136 2.31.38.699 1.047 1.315 1.907 1.835 1.704 1.03 4.345 1.686 7.302 1.686Zm3.21-.594c-1.476 2.55-3.53 4.392-5.358 4.871-.925.242-1.78.189-2.5-.187-.733-.383-1.256-1.048-1.57-1.868-.303-.795-.396-1.759-.291-2.83a.65.65 0 1 1 1.293.133c-.094.987-.006 1.815.236 2.45.233.612.58.99 1.02 1.22.453.236.999.29 1.639.122 1.426-.374 3.24-1.988 4.582-4.31 1.34-2.32 1.803-4.58 1.429-6.004-.167-.64-.479-1.11-.933-1.416-.44-.298-1-.423-1.643-.335-1.297.178-2.845 1.156-4.16 2.683A.65.65 0 0 1 3.96 3.95c1.44-1.672 3.232-2.847 4.91-3.078.911-.125 1.769.037 2.473.513.69.468 1.156 1.182 1.398 2.106.498 1.907-.108 4.487-1.537 7.018Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M4.788 10.007c1.488 2.544 3.446 4.439 5.207 5.036.892.303 1.745.313 2.496-.023.765-.342 1.341-.97 1.72-1.763.366-.768.527-1.722.497-2.797a.65.65 0 0 0-1.3.04c.027.99-.108 1.813-.398 2.42-.28.59-.668.964-1.152 1.181-.497.222-1.07.215-1.7-.001-1.398-.476-3.116-2.134-4.473-4.452-1.354-2.312-1.91-4.556-1.622-6a3.003 3.003 0 0 1 .847-1.466c.407-.388.942-.604 1.585-.582 1.305.042 2.902.93 4.306 2.384a.65.65 0 1 0 .946-.89C9.225 2.483 7.367 1.38 5.73 1.326c-.922-.03-1.756.276-2.395.886-.624.595-1.037 1.41-1.197 2.333-.327 1.891.281 4.438 1.65 6.78v-.318Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

// TypeScript file icon
function TypeScriptIcon() {
  return (
    <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
      <path d="M0 8v8h16V0H0v8zm12.69-2.87h-1.85V14h-1.46V5.13H7.56V4h5.13v1.13zM7.4 6.86c.17.07.32.21.44.42l.67 1.33c.16.35.34.64.55.88.2.24.43.42.67.54a1.46 1.46 0 0 0 1.37-.12c.19-.12.34-.29.44-.49a1.5 1.5 0 0 0 .16-.7c0-.3-.07-.56-.22-.76a1.74 1.74 0 0 0-.58-.52c-.24-.14-.5-.26-.8-.36-.36-.12-.7-.26-1.03-.42a3.58 3.58 0 0 1-.88-.55c-.25-.22-.46-.48-.61-.79A2.5 2.5 0 0 1 7.35 4.6c0-.4.08-.77.26-1.1.17-.33.42-.62.74-.86.31-.24.7-.43 1.14-.56.45-.13.94-.2 1.49-.2.45 0 .86.05 1.24.14.37.1.7.24 1 .43l-.5.95a2.6 2.6 0 0 0-.78-.37 3.24 3.24 0 0 0-.96-.14c-.35 0-.66.04-.93.13-.27.08-.49.2-.66.36a.84.84 0 0 0-.26.63c0 .24.07.45.22.62.14.17.34.31.58.44.25.12.53.24.85.35.4.14.78.29 1.13.47.35.17.67.38.94.62.28.24.5.52.67.84.17.32.25.7.25 1.14 0 .45-.09.86-.26 1.23a2.6 2.6 0 0 1-.73.93c-.31.25-.69.45-1.13.58-.44.14-.93.2-1.47.2-.6 0-1.13-.08-1.59-.23a3.7 3.7 0 0 1-1.19-.64l.56-.9c.16.11.34.22.55.33z" />
    </svg>
  );
}

// Token types for syntax highlighting
type TokenType =
  | "tag"
  | "attr-name"
  | "attr-value"
  | "punctuation"
  | "plain"
  | "string"
  | "keyword"
  | "function"
  | "comment"
  | "added"
  | "removed";

interface Token {
  type: TokenType;
  content: string;
}

// Simple JSX/TSX tokenizer for syntax highlighting
function tokenizeJsx(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Check for comments
    if (code.slice(i, i + 2) === "//") {
      let comment = "";
      while (i < code.length && code[i] !== "\n") {
        comment += code[i];
        i++;
      }
      tokens.push({ type: "comment", content: comment });
      continue;
    }

    // Check for JSX opening tag
    if (code[i] === "<" && /[A-Za-z\/]/.test(code[i + 1] || "")) {
      // Check for closing tag
      if (code[i + 1] === "/") {
        tokens.push({ type: "punctuation", content: "</" });
        i += 2;
        // Get tag name
        let tagName = "";
        while (i < code.length && /[a-zA-Z0-9.]/.test(code[i])) {
          tagName += code[i];
          i++;
        }
        if (tagName) {
          tokens.push({ type: "tag", content: tagName });
        }
        // Get closing >
        if (code[i] === ">") {
          tokens.push({ type: "punctuation", content: ">" });
          i++;
        }
      } else {
        tokens.push({ type: "punctuation", content: "<" });
        i++;
        // Get tag name (can include dots for namespaced components)
        let tagName = "";
        while (i < code.length && /[a-zA-Z0-9.]/.test(code[i])) {
          tagName += code[i];
          i++;
        }
        if (tagName) {
          tokens.push({ type: "tag", content: tagName });
        }
        // Parse attributes
        while (i < code.length && code[i] !== ">" && code[i] !== "/") {
          // Skip whitespace
          if (/\s/.test(code[i])) {
            tokens.push({ type: "plain", content: code[i] });
            i++;
            continue;
          }
          // Check for JSX expression
          if (code[i] === "{") {
            tokens.push({ type: "punctuation", content: "{" });
            i++;
            let depth = 1;
            let expr = "";
            while (i < code.length && depth > 0) {
              if (code[i] === "{") depth++;
              if (code[i] === "}") depth--;
              if (depth > 0) {
                expr += code[i];
              }
              i++;
            }
            if (expr) {
              tokens.push({ type: "plain", content: expr });
            }
            tokens.push({ type: "punctuation", content: "}" });
            continue;
          }
          // Get attribute name
          let attrName = "";
          while (i < code.length && /[a-zA-Z0-9-]/.test(code[i])) {
            attrName += code[i];
            i++;
          }
          if (attrName) {
            tokens.push({ type: "attr-name", content: attrName });
          }
          // Get equals sign
          if (code[i] === "=") {
            tokens.push({ type: "punctuation", content: "=" });
            i++;
          }
          // Get attribute value
          if (code[i] === '"' || code[i] === "'") {
            const quote = code[i];
            tokens.push({ type: "punctuation", content: quote });
            i++;
            let attrValue = "";
            while (i < code.length && code[i] !== quote) {
              attrValue += code[i];
              i++;
            }
            if (attrValue) {
              tokens.push({ type: "attr-value", content: attrValue });
            }
            if (code[i] === quote) {
              tokens.push({ type: "punctuation", content: quote });
              i++;
            }
          } else if (code[i] === "{") {
            // JSX expression as value
            tokens.push({ type: "punctuation", content: "{" });
            i++;
            let depth = 1;
            let expr = "";
            while (i < code.length && depth > 0) {
              if (code[i] === "{") depth++;
              if (code[i] === "}") depth--;
              if (depth > 0) {
                expr += code[i];
              }
              i++;
            }
            if (expr) {
              tokens.push({ type: "attr-value", content: expr });
            }
            tokens.push({ type: "punctuation", content: "}" });
          }
        }
        // Handle self-closing or closing
        if (code[i] === "/") {
          tokens.push({ type: "punctuation", content: "/" });
          i++;
        }
        if (code[i] === ">") {
          tokens.push({ type: "punctuation", content: ">" });
          i++;
        }
      }
    } else if (code[i] === '"' || code[i] === "'") {
      // String literal
      const quote = code[i];
      let str = quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        str += code[i];
        i++;
      }
      if (i < code.length) {
        str += code[i];
        i++;
      }
      tokens.push({ type: "string", content: str });
    } else if (code[i] === "`") {
      // Template literal
      let str = "`";
      i++;
      while (i < code.length && code[i] !== "`") {
        str += code[i];
        i++;
      }
      if (i < code.length) {
        str += code[i];
        i++;
      }
      tokens.push({ type: "string", content: str });
    } else {
      // Check for keywords
      const keywords = [
        "import",
        "export",
        "from",
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "default",
        "async",
        "await",
        "true",
        "false",
        "null",
        "undefined",
      ];
      let foundKeyword = false;
      for (const kw of keywords) {
        if (
          code.slice(i, i + kw.length) === kw &&
          !/[a-zA-Z0-9]/.test(code[i + kw.length] || "")
        ) {
          tokens.push({ type: "keyword", content: kw });
          i += kw.length;
          foundKeyword = true;
          break;
        }
      }
      if (!foundKeyword) {
        // Plain text
        let text = "";
        while (
          i < code.length &&
          code[i] !== "<" &&
          code[i] !== '"' &&
          code[i] !== "'" &&
          code[i] !== "`" &&
          !(code.slice(i, i + 2) === "//")
        ) {
          // Check for keywords mid-stream
          let breakForKeyword = false;
          for (const kw of keywords) {
            if (
              code.slice(i, i + kw.length) === kw &&
              !/[a-zA-Z0-9]/.test(code[i - 1] || "") &&
              !/[a-zA-Z0-9]/.test(code[i + kw.length] || "")
            ) {
              breakForKeyword = true;
              break;
            }
          }
          if (breakForKeyword) break;
          text += code[i];
          i++;
        }
        if (text) {
          tokens.push({ type: "plain", content: text });
        }
      }
    }
  }

  return tokens;
}

// Get token color class based on type
function getTokenClass(type: TokenType): string {
  switch (type) {
    case "tag":
      return "text-[var(--ds-green-900)]";
    case "attr-name":
      return "text-[var(--ds-purple-900)]";
    case "attr-value":
      return "text-[var(--ds-blue-900)]";
    case "punctuation":
      return "text-textDefault";
    case "string":
      return "text-[var(--ds-blue-900)]";
    case "keyword":
      return "text-[var(--ds-purple-900)]";
    case "function":
      return "text-[var(--ds-blue-900)]";
    case "comment":
      return "text-textSubtler";
    case "added":
      return "text-[var(--ds-green-900)]";
    case "removed":
      return "text-[var(--ds-red-900)]";
    case "plain":
    default:
      return "text-textDefault";
  }
}

// Render a line with syntax highlighting
function HighlightedLine({ line }: { line: string }) {
  const tokens = tokenizeJsx(line);

  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={getTokenClass(token.type)}>
          {token.content}
        </span>
      ))}
      {tokens.length === 0 && " "}
    </>
  );
}

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  referencedLines?: number[];
}

// Full featured code block component
function CodeBlock({
  code,
  filename,
  showLineNumbers = true,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  referencedLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleLineClick = (lineNumber: number) => {
    if (referencedLines.includes(lineNumber)) {
      // Could implement scroll-to or highlight behavior
      console.log(`Line ${lineNumber} clicked`);
    }
  };

  return (
    <div
      className="group relative border border-borderDefault rounded-xl overflow-hidden"
      style={{ background: "var(--ds-background-100)" }}
    >
      {/* Header with filename */}
      {filename && (
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-borderSubtle"
          style={{ background: "var(--ds-background-100)" }}
        >
          <div className="flex items-center gap-2 text-textSubtle">
            <ReactIcon />
            <span className="text-[13px] font-mono">{filename}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md border border-borderDefault hover:bg-[var(--ds-gray-100)] transition-colors"
            style={{ background: "var(--ds-background-200)" }}
            aria-label="Copy code"
          >
            {copied ? (
              <span className="text-green-700">
                <CheckIcon />
              </span>
            ) : (
              <span className="text-textSubtle hover:text-textDefault">
                <CopyIcon />
              </span>
            )}
          </button>
        </div>
      )}

      {/* Copy button for no-header variant */}
      {!filename && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md border border-borderDefault opacity-0 group-hover:opacity-100 transition-opacity z-10"
          style={{ background: "var(--ds-background-200)" }}
          aria-label="Copy code"
        >
          {copied ? (
            <span className="text-green-700">
              <CheckIcon />
            </span>
          ) : (
            <span className="text-textSubtle hover:text-textDefault">
              <CopyIcon />
            </span>
          )}
        </button>
      )}

      {/* Code content */}
      <pre className="overflow-x-auto py-4">
        <code className="block text-[13px] leading-[20px] font-mono">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightLines.includes(lineNumber);
            const isAdded = addedLines.includes(lineNumber);
            const isRemoved = removedLines.includes(lineNumber);
            const isReferenced = referencedLines.includes(lineNumber);

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
                style={{ fontFeatureSettings: '"liga" off' }}
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
                    className={`select-none w-[32px] min-w-[32px] text-right pr-4 ${
                      isReferenced
                        ? "text-[var(--ds-blue-900)] cursor-pointer hover:underline"
                        : "text-textSubtler"
                    }`}
                  >
                    {lineNumber}
                  </span>
                )}
                {/* Line content */}
                <span
                  className={`flex-1 pr-4 ${isRemoved ? "text-textSubtle line-through" : ""}`}
                >
                  <HighlightedLine line={line} />
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

// Link icon for section headers
function LinkIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 14, height: 14, color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.46968 1.46968C10.1433 -0.203925 12.8567 -0.203923 14.5303 1.46968C16.2039 3.14329 16.2039 5.85674 14.5303 7.53034L12.0303 10.0303L10.9697 8.96968L13.4697 6.46968C14.5575 5.38186 14.5575 3.61816 13.4697 2.53034C12.3819 1.44252 10.6182 1.44252 9.53034 2.53034L7.03034 5.03034L5.96968 3.96968L8.46968 1.46968ZM11.5303 5.53034L5.53034 11.5303L4.46968 10.4697L10.4697 4.46968L11.5303 5.53034ZM1.46968 14.5303C3.14329 16.2039 5.85673 16.204 7.53034 14.5303L10.0303 12.0303L8.96968 10.9697L6.46968 13.4697C5.38186 14.5575 3.61816 14.5575 2.53034 13.4697C1.44252 12.3819 1.44252 10.6182 2.53034 9.53034L5.03034 7.03034L3.96968 5.96968L1.46968 8.46968C-0.203923 10.1433 -0.203925 12.8567 1.46968 14.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Section header with link icon on hover
function SectionHeader({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit"
      href={`#${id}`}
      id={id}
      style={{ scrollMarginTop: 32 }}
    >
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </a>
  );
}

// Example code snippets
const defaultExample = `export default function Page() {
  return <p>Hello, World!</p>
}`;

const noFilenameExample = `<CodeBlock code={code} />`;

const highlightedExample = `export default function Page() {
  const name = "World"
  return <p>Hello, {name}!</p>
}`;

const diffExample = `export default function Page() {
  const name = "World"
  return <p>Hello, {name}!</p>
}`;

const referencedExample = `export default function Page() {
  const name = "World"
  return <p>Hello, {name}!</p>
}`;

const languageSwitcherCode = `import { CodeBlock } from '@/components/CodeBlock'

export function Example() {
  return (
    <CodeBlock
      code={code}
      filename="page.tsx"
      language="tsx"
    />
  )
}`;

const hiddenLineNumbersExample = `export default function Page() {
  return <p>Hello, World!</p>
}`;

export default function CodeBlockComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Default Section */}
      <Section>
        <SectionHeader id="default">Default</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          The default code block includes a filename header with a file icon,
          line numbers, and a copy button.
        </p>
        <CodeBlock code={defaultExample} filename="page.tsx" />
      </Section>

      {/* No Filename Section */}
      <Section>
        <SectionHeader id="no-filename">No filename</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Code blocks can be rendered without a filename header. The copy button
          appears on hover.
        </p>
        <CodeBlock code={noFilenameExample} />
      </Section>

      {/* Highlighted Lines Section */}
      <Section>
        <SectionHeader id="highlighted-lines">Highlighted lines</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Specific lines can be highlighted to draw attention to important code.
          Use the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            highlightLines
          </code>{" "}
          prop with an array of line numbers.
        </p>
        <CodeBlock
          code={highlightedExample}
          filename="page.tsx"
          highlightLines={[2]}
        />
      </Section>

      {/* Added & Removed Lines Section */}
      <Section>
        <SectionHeader id="added-removed-lines">
          Added & removed lines
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Show diff-style additions and removals using the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            addedLines
          </code>{" "}
          and{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            removedLines
          </code>{" "}
          props.
        </p>
        <CodeBlock
          code={diffExample}
          filename="page.tsx"
          addedLines={[2]}
          removedLines={[3]}
        />
      </Section>

      {/* Referenced Lines Section */}
      <Section>
        <SectionHeader id="referenced-lines">Referenced lines</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Line numbers can be made clickable using the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            referencedLines
          </code>{" "}
          prop. Useful for linking to specific lines in documentation.
        </p>
        <CodeBlock
          code={referencedExample}
          filename="page.tsx"
          referencedLines={[3]}
        />
      </Section>

      {/* Language Switcher Section */}
      <Section>
        <SectionHeader id="language-switcher">Language switcher</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          For documentation showing code in multiple languages, use tabs or a
          dropdown to switch between examples.
        </p>
        <CodeBlock code={languageSwitcherCode} filename="example.tsx" />
      </Section>

      {/* Hidden Line Numbers Section */}
      <Section>
        <SectionHeader id="hidden-line-numbers">
          Hidden line numbers
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Line numbers can be hidden by setting{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            showLineNumbers={"{false}"}
          </code>
          .
        </p>
        <CodeBlock
          code={hiddenLineNumbersExample}
          filename="page.tsx"
          showLineNumbers={false}
        />
      </Section>

      {/* Props Section */}
      <Section>
        <SectionHeader id="props">Props</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Available props for the CodeBlock component.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Prop
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">code</td>
                <td className="py-3 px-4 font-mono text-textSubtle">string</td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  The code content to display
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">filename</td>
                <td className="py-3 px-4 font-mono text-textSubtle">string</td>
                <td className="py-3 px-4 text-textSubtle">undefined</td>
                <td className="py-3 px-4 text-textSubtle">
                  Filename to display in the header
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">showLineNumbers</td>
                <td className="py-3 px-4 font-mono text-textSubtle">boolean</td>
                <td className="py-3 px-4 text-textSubtle">true</td>
                <td className="py-3 px-4 text-textSubtle">
                  Whether to show line numbers
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">highlightLines</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  number[]
                </td>
                <td className="py-3 px-4 text-textSubtle">[]</td>
                <td className="py-3 px-4 text-textSubtle">
                  Line numbers to highlight
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">addedLines</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  number[]
                </td>
                <td className="py-3 px-4 text-textSubtle">[]</td>
                <td className="py-3 px-4 text-textSubtle">
                  Line numbers to mark as added (green)
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">removedLines</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  number[]
                </td>
                <td className="py-3 px-4 text-textSubtle">[]</td>
                <td className="py-3 px-4 text-textSubtle">
                  Line numbers to mark as removed (red)
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">referencedLines</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  number[]
                </td>
                <td className="py-3 px-4 text-textSubtle">[]</td>
                <td className="py-3 px-4 text-textSubtle">
                  Line numbers to make clickable
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

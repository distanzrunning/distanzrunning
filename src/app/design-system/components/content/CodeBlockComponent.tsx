"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { SiReact } from "react-icons/si";
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
  | "parameter"
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
  let insideJsxContent = false; // Track if we're inside JSX text content (between > and <)

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
        insideJsxContent = false; // Entering closing tag
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
          insideJsxContent = true; // Now inside JSX text content
        }
      } else {
        tokens.push({ type: "punctuation", content: "<" });
        insideJsxContent = false; // Entering a tag, no longer in text content
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
          insideJsxContent = false; // Self-closing tag, no content follows
        }
        if (code[i] === ">") {
          tokens.push({ type: "punctuation", content: ">" });
          i++;
          // Only set insideJsxContent if not self-closing
          const prevToken = tokens[tokens.length - 2];
          if (prevToken?.content !== "/") {
            insideJsxContent = true;
          }
        }
      }
    } else if (insideJsxContent && code[i] !== "{") {
      // We're inside JSX text content - collect plain text until we hit < or {
      let text = "";
      while (i < code.length && code[i] !== "<" && code[i] !== "{") {
        text += code[i];
        i++;
      }
      if (text) {
        tokens.push({ type: "plain", content: text });
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
        "type",
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
        // Check context from previous tokens (skip whitespace/plain tokens)
        const findPrevNonWhitespaceToken = () => {
          for (let j = tokens.length - 1; j >= 0; j--) {
            const t = tokens[j];
            // Skip whitespace-only plain tokens
            if (t.type === "plain" && /^\s*$/.test(t.content)) continue;
            return t;
          }
          return null;
        };
        const prevNonWhitespace = findPrevNonWhitespaceToken();
        const prevTokenIsFunction =
          prevNonWhitespace?.type === "keyword" &&
          prevNonWhitespace?.content === "function";

        // Check if we're inside function parameters (after function name and open paren)
        const isInsideParams = (() => {
          // Look back for pattern: function Name( or Name(
          let parenDepth = 0;
          for (let j = tokens.length - 1; j >= 0; j--) {
            const t = tokens[j];
            if (t.type === "punctuation" && t.content === ")") parenDepth++;
            if (t.type === "punctuation" && t.content === "(") {
              parenDepth--;
              if (parenDepth < 0) {
                // Found unmatched open paren, check if preceded by function name
                const prevToken = tokens[j - 1];
                if (prevToken?.type === "function") return true;
              }
            }
            // Stop at certain boundaries
            if (
              t.type === "punctuation" &&
              (t.content === "{" || t.content === "}")
            )
              break;
          }
          return false;
        })();

        // Check for identifier (potential function/class name)
        if (/[a-zA-Z_$]/.test(code[i])) {
          let identifier = "";
          while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
            identifier += code[i];
            i++;
          }

          // Only mark as function if directly after 'function' keyword
          // (PascalCase like CodeBlock, Element should be plain/greyscale)
          if (prevTokenIsFunction) {
            tokens.push({ type: "function", content: identifier });
          } else if (isInsideParams) {
            tokens.push({ type: "parameter", content: identifier });
          } else {
            tokens.push({ type: "plain", content: identifier });
          }
          continue;
        }

        // Plain text (non-identifier characters)
        let text = "";
        while (
          i < code.length &&
          code[i] !== "<" &&
          code[i] !== '"' &&
          code[i] !== "'" &&
          code[i] !== "`" &&
          !/[a-zA-Z_$]/.test(code[i]) &&
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

// Get token color class based on type and diff mode (Geist shiki token colors)
// Keywords (import, export, const, function, return, type) - pink
// Function names after 'function' keyword (MyComponent, Component) - purple
// Attribute names (aria-label, filename, className) - purple
// Attribute values ("Hello world", "Table.jsx") - blue
// String literals and template literals - green
// JSX tags (div, h1, CodeBlock) - green
// Function parameters (props) - amber

// Check if content is an identifier (not punctuation)
function isIdentifier(content: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(content);
}

function getTokenClass(
  type: TokenType,
  diffMode?: "added" | "removed",
  content?: string,
): string {
  // In diff mode, identifiers are red, value keywords (true/false) are green
  if (diffMode) {
    // Identifiers/property names are red (but not punctuation in plain tokens)
    if (type === "plain" && content && isIdentifier(content)) {
      return "text-[var(--ds-red-900)]";
    }
    if (type === "attr-name") {
      return "text-[var(--ds-red-900)]";
    }
    // Value keywords like true/false are green
    if (type === "keyword") {
      return "text-[var(--ds-green-900)]";
    }
    // Everything else is greyscale
    return "text-[var(--ds-gray-1000)]";
  }

  // Normal syntax highlighting
  switch (type) {
    case "tag":
      // JSX tags like div, h1, CodeBlock - green
      return "text-[var(--ds-green-900)]";
    case "attr-name":
      // Attribute names like aria-label, filename - purple
      return "text-[var(--ds-purple-900)]";
    case "attr-value":
      // Attribute values like "Hello world" - blue
      return "text-[var(--ds-blue-900)]";
    case "punctuation":
      // Punctuation like {, }, <, > - gray-1000
      return "text-[var(--ds-gray-1000)]";
    case "string":
      // String literals and template literals - green
      return "text-[var(--ds-green-900)]";
    case "keyword":
      // Keywords like function, return, const, import, type - pink
      return "text-[var(--ds-pink-900)]";
    case "function":
      // Function names after 'function' keyword - purple
      return "text-[var(--ds-purple-900)]";
    case "parameter":
      // Parameters like props - amber
      return "text-[var(--ds-amber-900)]";
    case "comment":
      // Comments - gray-900
      return "text-[var(--ds-gray-900)]";
    case "added":
      return "text-[var(--ds-green-900)]";
    case "removed":
      return "text-[var(--ds-red-900)]";
    case "plain":
    default:
      return "text-[var(--ds-gray-1000)]";
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

// Tokenize entire code block and split into lines for rendering
// This properly handles multi-line strings like template literals
function tokenizeFullCode(code: string): Token[][] {
  const tokens = tokenizeJsx(code);
  const lines: Token[][] = [[]];

  for (const token of tokens) {
    // Split token content by newlines
    const parts = token.content.split("\n");

    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        // Start a new line
        lines.push([]);
      }
      if (parts[i]) {
        lines[lines.length - 1].push({ type: token.type, content: parts[i] });
      }
    }
  }

  return lines;
}

// Render pre-tokenized line
function RenderTokenLine({
  tokens,
  diffMode,
}: {
  tokens: Token[];
  diffMode?: "added" | "removed";
}) {
  return (
    <>
      {tokens.map((token, i) => (
        <span
          key={i}
          className={getTokenClass(token.type, diffMode, token.content)}
        >
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

// Inner code block component (the actual code display)
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
  const tokenizedLines = tokenizeFullCode(code);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleLineClick = (lineNumber: number) => {
    if (referencedLines.includes(lineNumber)) {
      console.log(`Line ${lineNumber} clicked`);
    }
  };

  return (
    <div
      className="relative border border-[var(--ds-gray-400)] rounded overflow-hidden"
      data-code-block
    >
      {/* Header with filename */}
      {filename && (
        <div
          className="flex items-center justify-between h-12 pl-4 pr-3 border-b border-[var(--ds-gray-400)]"
          style={{
            background: "var(--ds-background-200)",
            borderRadius: "4px 4px 0 0",
          }}
        >
          <div className="flex items-center gap-2">
            <SiReact size={16} className="text-textSubtle" />
            <span className="text-[13px] text-textSubtle">{filename}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-[var(--ds-gray-100)] transition-colors text-textSubtle hover:text-textDefault"
            aria-label="Copy code"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      )}

      {/* Copy button for no-header variant */}
      {!filename && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault hover:bg-[var(--ds-gray-100)]"
          aria-label="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}

      {/* Code content */}
      <pre
        className="overflow-x-auto py-4"
        style={{ background: "var(--ds-background-100)" }}
      >
        <code className="block text-[13px] leading-[20px] font-mono">
          {tokenizedLines.map((lineTokens, index) => {
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
                <span className="flex-1 pr-4">
                  <RenderTokenLine
                    tokens={lineTokens}
                    diffMode={
                      isAdded ? "added" : isRemoved ? "removed" : undefined
                    }
                  />
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

// Preview wrapper with "Show code" accordion
interface CodePreviewProps {
  previewCode: string;
  previewFilename: string;
  componentCode: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  referencedLines?: number[];
}

function CodePreview({
  previewCode,
  previewFilename,
  componentCode,
  showLineNumbers = true,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  referencedLines = [],
}: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const componentCodeLines = tokenizeFullCode(componentCode);

  const handleCopyComponentCode = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [componentCode]);

  return (
    <div className="border border-[var(--ds-gray-400)] rounded-lg overflow-hidden">
      {/* Preview area */}
      <div
        className="p-6 group"
        style={{ background: "var(--ds-background-100)" }}
      >
        <CodeBlock
          code={previewCode}
          filename={previewFilename || undefined}
          showLineNumbers={showLineNumbers}
          highlightLines={highlightLines}
          addedLines={addedLines}
          removedLines={removedLines}
          referencedLines={referencedLines}
        />
      </div>

      {/* Accordion trigger */}
      <div style={{ background: "var(--ds-background-200)" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-[var(--ds-gray-400)]"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>

        {/* Collapsible code section */}
        {isOpen && (
          <div
            className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-[13px]"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              {/* Floating copy button */}
              <button
                onClick={handleCopyComponentCode}
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault hover:bg-[var(--ds-gray-100)]"
                style={{ background: "var(--ds-background-200)" }}
                aria-label="Copy code"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>

              {/* Component code */}
              <pre className="overflow-x-auto py-4">
                <code className="block text-[13px] leading-[20px] font-mono">
                  {componentCodeLines.map((lineTokens, index) => (
                    <div
                      key={index}
                      className="flex px-4"
                      style={{ fontFeatureSettings: '"liga" off' }}
                    >
                      <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">
                        {index + 1}
                      </span>
                      <span className="flex-1 pr-4">
                        <RenderTokenLine tokens={lineTokens} />
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

// Example code snippets - preview code (what's shown in the code block)
const defaultPreviewCode = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

// Component code (shown in the "Show code" accordion)
const defaultComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}\`;

export function Component() {
  return (
    <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx">
      {code}
    </CodeBlock>
  );
}`;

const noFilenamePreviewCode = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

const noFilenameComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}\`;

export function Component() {
  return (
    <CodeBlock aria-label="Hello world" language="jsx">
      {code}
    </CodeBlock>
  );
}`;

const highlightedPreviewCode = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

const highlightedComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}\`;

export function Component() {
  return (
    <CodeBlock
      aria-label="Hello world"
      filename="highlighted.jsx"
      highlightLines={[1, 4]}
      language="jsx"
    >
      {code}
    </CodeBlock>
  );
}`;

const diffPreviewCode = `module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
}`;

const diffComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

const code = \`module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
}\`;

export function Component() {
  return (
    <CodeBlock
      aria-label="Hello world"
      filename="next.config.js"
      addedLines={[5]}
      removedLines={[2, 3, 4]}
      language="jsx"
    >
      {code}
    </CodeBlock>
  );
}`;

const referencedPreviewCode = `export default function Page() {
  const name = "World"
  return <p>Hello, {name}!</p>
}`;

const referencedComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

const code = \`export default function Page() {
  const name = "World"
  return <p>Hello, {name}!</p>
}\`;

export function Component() {
  return (
    <CodeBlock filename="page.tsx" referencedLines={[3]}>
      {code}
    </CodeBlock>
  );
}`;

const languageSwitcherPreviewCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

export function Example() {
  return (
    <CodeBlock
      code={code}
      filename="page.tsx"
      language="tsx"
    />
  )
}`;

const languageSwitcherComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';
import { Tabs } from '@/components/ui/Tabs';

export function Component() {
  return (
    <Tabs defaultValue="tsx">
      <Tabs.List>
        <Tabs.Trigger value="tsx">TypeScript</Tabs.Trigger>
        <Tabs.Trigger value="jsx">JavaScript</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tsx">
        <CodeBlock filename="page.tsx" language="tsx">{tsxCode}</CodeBlock>
      </Tabs.Content>
      <Tabs.Content value="jsx">
        <CodeBlock filename="page.jsx" language="jsx">{jsxCode}</CodeBlock>
      </Tabs.Content>
    </Tabs>
  );
}`;

const hiddenLineNumbersPreviewCode = `export default function Page() {
  return <p>Hello, World!</p>
}`;

const hiddenLineNumbersComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

const code = \`export default function Page() {
  return <p>Hello, World!</p>
}\`;

export function Component() {
  return (
    <CodeBlock filename="page.tsx" showLineNumbers={false}>
      {code}
    </CodeBlock>
  );
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
        <CodePreview
          previewCode={defaultPreviewCode}
          previewFilename="Table.jsx"
          componentCode={defaultComponentCode}
        />
      </Section>

      {/* No Filename Section */}
      <Section>
        <SectionHeader id="no-filename">No filename</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Code blocks can be rendered without a filename header. The copy button
          appears on hover.
        </p>
        <CodePreview
          previewCode={noFilenamePreviewCode}
          previewFilename=""
          componentCode={noFilenameComponentCode}
        />
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
        <CodePreview
          previewCode={highlightedPreviewCode}
          previewFilename="highlighted.jsx"
          componentCode={highlightedComponentCode}
          highlightLines={[1, 4]}
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
        <CodePreview
          previewCode={diffPreviewCode}
          previewFilename="next.config.js"
          componentCode={diffComponentCode}
          addedLines={[5]}
          removedLines={[2, 3, 4]}
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
        <CodePreview
          previewCode={referencedPreviewCode}
          previewFilename="page.tsx"
          componentCode={referencedComponentCode}
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
        <CodePreview
          previewCode={languageSwitcherPreviewCode}
          previewFilename="example.tsx"
          componentCode={languageSwitcherComponentCode}
        />
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
        <CodePreview
          previewCode={hiddenLineNumbersPreviewCode}
          previewFilename="page.tsx"
          componentCode={hiddenLineNumbersComponentCode}
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

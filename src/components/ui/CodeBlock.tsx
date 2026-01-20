"use client";

import { useState, useCallback } from "react";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiLua,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { FiFile } from "react-icons/fi";

// Copy icon
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
  | "comment";

interface Token {
  type: TokenType;
  content: string;
}

// Simple JSX/TSX tokenizer for syntax highlighting
function tokenizeJsx(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let insideJsxContent = false;

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
      if (code[i + 1] === "/") {
        tokens.push({ type: "punctuation", content: "</" });
        i += 2;
        insideJsxContent = false;
        let tagName = "";
        while (i < code.length && /[a-zA-Z0-9.]/.test(code[i])) {
          tagName += code[i];
          i++;
        }
        if (tagName) {
          tokens.push({ type: "tag", content: tagName });
        }
        if (code[i] === ">") {
          tokens.push({ type: "punctuation", content: ">" });
          i++;
          insideJsxContent = true;
        }
      } else {
        tokens.push({ type: "punctuation", content: "<" });
        insideJsxContent = false;
        i++;
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
          if (/\s/.test(code[i])) {
            tokens.push({ type: "plain", content: code[i] });
            i++;
            continue;
          }
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
          let attrName = "";
          while (i < code.length && /[a-zA-Z0-9-]/.test(code[i])) {
            attrName += code[i];
            i++;
          }
          if (attrName) {
            tokens.push({ type: "attr-name", content: attrName });
          }
          if (code[i] === "=") {
            tokens.push({ type: "punctuation", content: "=" });
            i++;
          }
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
        if (code[i] === "/") {
          tokens.push({ type: "punctuation", content: "/" });
          i++;
          insideJsxContent = false;
        }
        if (code[i] === ">") {
          tokens.push({ type: "punctuation", content: ">" });
          i++;
          const prevToken = tokens[tokens.length - 2];
          if (prevToken?.content !== "/") {
            insideJsxContent = true;
          }
        }
      }
    } else if (insideJsxContent && code[i] !== "{") {
      let text = "";
      while (i < code.length && code[i] !== "<" && code[i] !== "{") {
        text += code[i];
        i++;
      }
      if (text) {
        tokens.push({ type: "plain", content: text });
      }
    } else if (code[i] === '"' || code[i] === "'") {
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
        const findPrevNonWhitespaceToken = () => {
          for (let j = tokens.length - 1; j >= 0; j--) {
            const t = tokens[j];
            if (t.type === "plain" && /^\s*$/.test(t.content)) continue;
            return t;
          }
          return null;
        };
        const prevNonWhitespace = findPrevNonWhitespaceToken();
        const prevTokenIsFunction =
          prevNonWhitespace?.type === "keyword" &&
          prevNonWhitespace?.content === "function";

        const isInsideParams = (() => {
          let parenDepth = 0;
          for (let j = tokens.length - 1; j >= 0; j--) {
            const t = tokens[j];
            if (t.type === "punctuation" && t.content === ")") parenDepth++;
            if (t.type === "punctuation" && t.content === "(") {
              parenDepth--;
              if (parenDepth < 0) {
                const prevToken = tokens[j - 1];
                if (prevToken?.type === "function") return true;
              }
            }
            if (
              t.type === "punctuation" &&
              (t.content === "{" || t.content === "}")
            )
              break;
          }
          return false;
        })();

        // Handle parentheses as punctuation (needed for isInsideParams to work)
        if (code[i] === "(" || code[i] === ")") {
          tokens.push({ type: "punctuation", content: code[i] });
          i++;
          continue;
        }

        if (/[a-zA-Z_$]/.test(code[i])) {
          let identifier = "";
          while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
            identifier += code[i];
            i++;
          }

          if (prevTokenIsFunction) {
            tokens.push({ type: "function", content: identifier });
          } else if (isInsideParams) {
            tokens.push({ type: "parameter", content: identifier });
          } else {
            tokens.push({ type: "plain", content: identifier });
          }
          continue;
        }

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

// Check if content is an identifier (not punctuation)
function isIdentifier(content: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(content);
}

// Get token color class based on type and diff mode
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
      return "text-[var(--ds-green-900)]";
    case "attr-name":
      return "text-[var(--ds-purple-900)]";
    case "attr-value":
      return "text-[var(--ds-blue-900)]";
    case "punctuation":
      return "text-[var(--ds-gray-1000)]";
    case "string":
      return "text-[var(--ds-green-900)]";
    case "keyword":
      return "text-[var(--ds-pink-900)]";
    case "function":
      return "text-[var(--ds-purple-900)]";
    case "parameter":
      return "text-[var(--ds-amber-900)]";
    case "comment":
      return "text-[var(--ds-gray-900)]";
    case "plain":
    default:
      return "text-[var(--ds-gray-1000)]";
  }
}

// Tokenize entire code block and split into lines
function tokenizeFullCode(code: string): Token[][] {
  const tokens = tokenizeJsx(code);
  const lines: Token[][] = [[]];

  for (const token of tokens) {
    const parts = token.content.split("\n");

    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
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
  const [copied, setCopied] = useState(false);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const codeContent = code || children || "";
  const tokenizedLines = tokenizeFullCode(codeContent);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeContent]);

  const handleLineClick = (lineNumber: number) => {
    if (referencedLines.includes(lineNumber)) {
      setSelectedLines((prev) =>
        prev.includes(lineNumber) ? [] : [lineNumber],
      );
    }
  };

  return (
    <div
      className="relative border border-[var(--ds-gray-400)] rounded overflow-hidden group"
      data-code-block
      aria-label={ariaLabel}
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
            {getFileIcon(filename, language)}
            <span className="text-[13px] text-textSubtle">{filename}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Language Switcher - Geist style with visible label overlay */}
            {switcher && (
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
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                >
                  {switcher.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-[var(--ds-gray-200)] dark:hover:bg-[var(--ds-gray-100)] transition-colors text-textSubtle hover:text-textDefault"
              aria-label="Copy code"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
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

export default CodeBlock;

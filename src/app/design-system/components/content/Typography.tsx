"use client";

import { useState, useCallback } from "react";
import { CircleHelp } from "lucide-react";
import { SiTailwindcss } from "react-icons/si";
import { Section } from "../ContentWithTOC";

// Toast notification for copy confirmation (matches Color page style)
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

// Typography table row with click-to-copy functionality
function TypographyRow({
  example,
  className,
  usage,
  onCopy,
}: {
  example: React.ReactNode;
  className: string;
  usage: string;
  onCopy: (text: string) => void;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(className);
      onCopy(className);
    },
    [className, onCopy],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(className);
      onCopy(className);
    },
    [className, onCopy],
  );

  return (
    <tr
      className="border-b border-borderSubtle cursor-pointer hover:bg-surfaceSubtle transition-colors"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <td className="py-4 pr-4">{example}</td>
      <td className="py-4 px-4 font-mono text-xs align-top">{className}</td>
      <td className="py-4 px-4 text-textSubtle align-top">{usage}</td>
    </tr>
  );
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
  | "string";

interface Token {
  type: TokenType;
  content: string;
}

// Simple HTML tokenizer for syntax highlighting
function tokenizeHtml(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Check for opening tag
    if (code[i] === "<") {
      // Check for closing tag
      if (code[i + 1] === "/") {
        tokens.push({ type: "punctuation", content: "</" });
        i += 2;
        // Get tag name
        let tagName = "";
        while (i < code.length && /[a-zA-Z0-9]/.test(code[i])) {
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
        // Get tag name
        let tagName = "";
        while (i < code.length && /[a-zA-Z0-9]/.test(code[i])) {
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
    } else {
      // Plain text
      let text = "";
      while (i < code.length && code[i] !== "<") {
        text += code[i];
        i++;
      }
      if (text) {
        tokens.push({ type: "plain", content: text });
      }
    }
  }

  return tokens;
}

// Get token color class based on type (Geist/Shiki style)
// Using Geist color system: green for tags, purple for attrs, blue for values
function getTokenClass(type: TokenType): string {
  switch (type) {
    case "tag":
      // Green for tags (p, strong, div, etc.)
      return "text-green-700 dark:text-green-400";
    case "attr-name":
      // Purple for attribute names (className, etc.)
      return "text-purple-700 dark:text-purple-400";
    case "attr-value":
      // Blue for attribute values (the string inside quotes)
      return "text-blue-700 dark:text-blue-400";
    case "punctuation":
      // Gray for punctuation (<, >, =, quotes)
      return "text-textDefault";
    case "string":
      return "text-blue-700 dark:text-blue-400";
    case "plain":
    default:
      return "text-textDefault";
  }
}

// Render a line with syntax highlighting
function HighlightedLine({ line }: { line: string }) {
  const tokens = tokenizeHtml(line);

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

// Code block with copy button (matches Geist)
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group relative border border-borderDefault rounded-md my-4 overflow-hidden">
      {/* Copy button - positioned in top right with border and background */}
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

      {/* Code content with padding */}
      <pre
        className="overflow-x-auto py-5"
        style={{ background: "var(--ds-background-100)" }}
      >
        <code className="block text-[13px] leading-[20px] font-mono">
          {lines.map((line, index) => (
            <div
              key={index}
              className="flex px-5"
              style={{ fontFeatureSettings: '"liga" off' }}
            >
              {/* Line number */}
              <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">
                {index + 1}
              </span>
              {/* Line content with syntax highlighting */}
              <span className="flex-1 pr-4">
                <HighlightedLine line={line} />
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

// Link icon for section headers (matches Geist)
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

// Section header with link icon on hover (matches Geist)
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

export default function Typography() {
  const { toast, showToast, dismissToast } = useToast();

  const handleCopy = useCallback(
    (className: string) => {
      showToast(`Copied: ${className}`);
    },
    [showToast],
  );

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />
      {/* Usage Section */}
      <Section>
        <SectionHeader id="usage">Usage</SectionHeader>

        <p className="text-copy-14 text-textSubtle mt-4 mb-4">
          Our typography styles can be consumed as{" "}
          <span className="inline-flex items-center gap-1.5 align-bottom">
            <SiTailwindcss size={14} className="text-[#38bdf8]" />
            Tailwind
          </span>{" "}
          classes. The classes below pre-set a combination of{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            font-size
          </code>
          ,{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            line-height
          </code>
          ,{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            letter-spacing
          </code>
          , and{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            font-weight
          </code>{" "}
          for you based on the Geist design system.
        </p>

        <p className="text-copy-14 text-textSubtle mb-6">
          The{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element can be used as a modifier to change the font weight. For
          Headings, this reduces the weight (for creating subtle variants),
          while for Copy text it increases the weight for emphasis.
        </p>

        <CodeBlock
          code={`<p className="text-heading-32 font-serif">
  Heading with <strong>subtle</strong> text
</p>`}
        />
      </Section>

      {/* Headings Section */}
      <Section>
        <SectionHeader id="headings">Headings</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Headings are used to introduce pages or sections. The{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element reduces the weight for creating subtle variants.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    Usage
                    <CircleHelp size={14} className="text-textSubtler" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TypographyRow
                example={<p className="text-heading-72 font-serif">Heading</p>}
                className="text-heading-72 font-serif"
                usage="Hero headlines"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-64 font-serif">Heading</p>}
                className="text-heading-64 font-serif"
                usage="Large page titles"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-56 font-serif">Heading</p>}
                className="text-heading-56 font-serif"
                usage="Page titles"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-48 font-serif">Heading</p>}
                className="text-heading-48 font-serif"
                usage="Section titles"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-40 font-serif">Heading</p>}
                className="text-heading-40 font-serif"
                usage="Feature headers"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-32 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-32 font-serif"
                usage="Card titles, section headers"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-24 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-24 font-serif"
                usage="Subsection titles"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-20 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-20 font-serif"
                usage="Small headers"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-16 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-16 font-serif"
                usage="Mini headers, labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-14 font-serif">Heading</p>}
                className="text-heading-14 font-serif"
                usage="Smallest heading"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Buttons Section */}
      <Section>
        <SectionHeader id="buttons">Buttons</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Button text styles should only be used for button components.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    Usage
                    <CircleHelp size={14} className="text-textSubtler" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TypographyRow
                example={<p className="text-button-16">Button Text</p>}
                className="text-button-16"
                usage="Large buttons"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-button-14">Button Text</p>}
                className="text-button-14"
                usage="Default buttons"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-button-12">Button Text</p>}
                className="text-button-12"
                usage="Small buttons"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Labels Section */}
      <Section>
        <SectionHeader id="labels">Labels</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Labels are single-line text with ample line-height to align with
          icons. Use the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element to increase weight. Mono variants use monospace font.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    Usage
                    <CircleHelp size={14} className="text-textSubtler" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TypographyRow
                example={<p className="text-label-20">Label Text</p>}
                className="text-label-20"
                usage="Large labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-18">Label Text</p>}
                className="text-label-18"
                usage="Medium labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-16">
                    Label <strong>Strong</strong>
                  </p>
                }
                className="text-label-16"
                usage="Default labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-14">
                    Label <strong>Strong</strong>
                  </p>
                }
                className="text-label-14"
                usage="Standard labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-14-mono">Label Mono</p>}
                className="text-label-14-mono"
                usage="Code, technical labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-13">
                    Label <strong>Strong</strong>{" "}
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      123
                    </span>
                  </p>
                }
                className="text-label-13"
                usage="Small labels, tabular nums"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-13-mono">Label Mono</p>}
                className="text-label-13-mono"
                usage="Small code labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-12">
                    Label <strong>Strong</strong>{" "}
                    <span className="uppercase">CAPS</span>
                  </p>
                }
                className="text-label-12"
                usage="Tiny labels, metadata"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-12-mono">Label Mono</p>}
                className="text-label-12-mono"
                usage="Tiny code labels"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Copy Section */}
      <Section>
        <SectionHeader id="copy">Copy</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Copy styles are for multi-line text with higher line height than
          Labels. Use the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element to increase weight for emphasis.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    Usage
                    <CircleHelp size={14} className="text-textSubtler" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TypographyRow
                example={
                  <p className="text-copy-24">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-24"
                usage="Lead paragraphs"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-20">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-20"
                usage="Large body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-18">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-18"
                usage="Introductions"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-16">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-16"
                usage="Default body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-14">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-14"
                usage="Compact body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-copy-13">Copy text</p>}
                className="text-copy-13"
                usage="Small body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-copy-13-mono">Copy text mono</p>}
                className="text-copy-13-mono"
                usage="Code snippets, technical text"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Reference Section */}
      <Section>
        <SectionHeader id="reference">Quick reference</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Complete specifications for all typography utility classes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Font Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Line Height
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Letter Spacing
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Font Weight
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono whitespace-nowrap">
              {/* Headings */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Headings
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-72</td>
                <td className="py-2 px-4">72px</td>
                <td className="py-2 px-4">80px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-64</td>
                <td className="py-2 px-4">64px</td>
                <td className="py-2 px-4">72px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-56</td>
                <td className="py-2 px-4">56px</td>
                <td className="py-2 px-4">64px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-48</td>
                <td className="py-2 px-4">48px</td>
                <td className="py-2 px-4">56px</td>
                <td className="py-2 px-4">-0.03em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-40</td>
                <td className="py-2 px-4">40px</td>
                <td className="py-2 px-4">48px</td>
                <td className="py-2 px-4">-0.02em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-32</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">40px</td>
                <td className="py-2 px-4">-0.02em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-24</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">-0.015em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">-0.006em</td>
                <td className="py-2 px-4">600</td>
              </tr>

              {/* Buttons */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Buttons
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-12</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>

              {/* Labels */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-18</td>
                <td className="py-2 px-4">18px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-14-mono</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-13</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-13-mono</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-12</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-12-mono</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>

              {/* Copy */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Copy
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-24</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">36px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-18</td>
                <td className="py-2 px-4">18px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">22px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-13</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-13-mono</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

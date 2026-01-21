"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { SiReact, SiTypescript, SiNextdotjs, SiLua } from "react-icons/si";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
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
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      className={className}
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
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      className={className}
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

// Animated copy button with crossfade transition
function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <CopyIcon
        className={`absolute inset-0 transition-opacity duration-75 ${
          copied ? "opacity-0" : "opacity-100"
        }`}
      />
      <CheckIcon
        className={`absolute inset-0 transition-opacity duration-75 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

// Render a single Shiki token with dual theme support
function RenderShikiToken({
  token,
  diffMode,
}: {
  token: DualThemeToken;
  diffMode?: "added" | "removed";
}) {
  const style = getTokenStyle(token, diffMode);
  return <span style={style}>{token.content}</span>;
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

// Inner code block component using Shiki
function CodeBlock({
  code,
  filename,
  language,
  showLineNumbers = true,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  referencedLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);

  // Use Shiki for syntax highlighting
  const tokenizedLines = useShikiHighlighter(code, language, filename);

  // Show plain text while loading
  const lines =
    tokenizedLines ||
    code.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "var(--ds-gray-1000)",
            darkColor: "var(--ds-gray-1000)",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [code]);

  const handleLineClick = (lineNumber: number) => {
    if (referencedLines.includes(lineNumber)) {
      setSelectedLines((prev) =>
        prev.includes(lineNumber) ? [] : [lineNumber],
      );
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
            className="p-2 rounded hover:bg-[var(--ds-gray-200)] dark:hover:bg-[var(--ds-gray-100)] transition-colors text-textSubtle hover:text-textDefault"
            aria-label="Copy code"
          >
            <CopyIconButton copied={copied} />
          </button>
        </div>
      )}

      {/* Copy button for no-header variant */}
      {!filename && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
          aria-label="Copy code"
        >
          <CopyIconButton copied={copied} />
        </button>
      )}

      {/* Code content */}
      <pre
        className="overflow-x-auto py-4"
        style={{ background: "var(--ds-background-100)" }}
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
                    <RenderShikiToken
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

// Preview wrapper with "Show code" accordion
interface CodePreviewProps {
  previewCode: string;
  previewFilename: string;
  previewLanguage?: string;
  componentCode: string;
  componentLanguage?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  referencedLines?: number[];
}

function CodePreview({
  previewCode,
  previewFilename,
  previewLanguage,
  componentCode,
  componentLanguage = "tsx",
  showLineNumbers = true,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  referencedLines = [],
}: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use Shiki for component code highlighting
  const componentCodeTokens = useShikiHighlighter(
    componentCode,
    componentLanguage,
  );
  const componentCodeLines =
    componentCodeTokens ||
    componentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "var(--ds-gray-1000)",
            darkColor: "var(--ds-gray-1000)",
          },
        ] as DualThemeToken[],
    );

  const handleCopyComponentCode = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
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
          language={previewLanguage}
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
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
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

const referencedPreviewCode = `function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}`;

const referencedComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}\`;

export function Component() {
  return (
    <CodeBlock
      aria-label="Hello world"
      referencedLines={[1, 2, 3, 4, 5, 6, 7]}
      language="jsx"
    >
      {code}
    </CodeBlock>
  );
}`;

const languageSwitcherPreviewCodeJs = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const languageSwitcherPreviewCodeTs = `function MyComponent(props: Props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const languageSwitcherPreviewCodeLua = `local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
local decode_table = ffi.new 'uint8_t[256]'
for i = 1, #b64 do
  decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0
end

function BloomFilter:has(key)
  local ptr = self.ptr -- uint8_t* pointer to start of base64 string
  for byte_offset, bit_offset in self:iterator(key) do
    local sextet = decode_table[ptr[byte_offset]]
    if band(sextet, lshift(1, bit_offset)) == 0 then
      return false
    end
  end
  return true
end`;

const languageSwitcherComponentCode = `import { CodeBlock } from '@/components/ui/CodeBlock';
import { useState } from 'react';

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}\`;

const codeTs = \`function MyComponent(props: Props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}\`;

const codeLua = \`local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
local decode_table = ffi.new 'uint8_t[256]'
for i = 1, #b64 do
  decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0
end

function BloomFilter:has(key)
  local ptr = self.ptr -- uint8_t* pointer to start of base64 string
  for byte_offset, bit_offset in self:iterator(key) do
    local sextet = decode_table[ptr[byte_offset]]
    if band(sextet, lshift(1, bit_offset)) == 0 then
      return false
    end
  end
  return true
end\`;

const languages = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Next.js', value: 'next' },
  { label: 'Lua', value: 'lua' },
];

export function Component() {
  const [language, setLanguage] = useState('js');

  const getCode = () => {
    if (language === 'ts' || language === 'next') return codeTs;
    if (language === 'lua') return codeLua;
    return code;
  };

  const getFilename = () => {
    if (language === 'ts') return 'language-switcher.tsx';
    if (language === 'next') return 'language-switcher.tsx';
    if (language === 'lua') return 'bloom-filter.lua';
    return 'language-switcher.jsx';
  };

  return (
    <CodeBlock
      aria-label="Hello world"
      filename={getFilename()}
      language={language}
      switcher={{
        options: languages,
        value: language,
        onChange: setLanguage,
      }}
    >
      {getCode()}
    </CodeBlock>
  );
}`;

const hiddenLineNumbersPreviewCode = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const hiddenLineNumbersComponentCode = `import { CodeBlock } from 'geist/components';
import type { JSX } from 'react';

const code = \`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}\`;

export function Component(): JSX.Element {
  return (
    <CodeBlock
      aria-label="Hello world"
      filename="hidden-line-numbers.jsx"
      hideLineNumbers
      language="jsx"
    >
      {code}
    </CodeBlock>
  );
}`;

// Language options for switcher
const languageOptions = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Next.js", value: "next" },
  { label: "Lua", value: "lua" },
];

// Get file icon based on language
function getLanguageIcon(language: string) {
  switch (language) {
    case "js":
      return <SiReact size={16} className="text-textSubtle" />;
    case "ts":
      return <SiTypescript size={16} className="text-textSubtle" />;
    case "next":
      return <SiNextdotjs size={16} className="text-textSubtle" />;
    case "lua":
      return <SiLua size={16} className="text-textSubtle" />;
    default:
      return <SiReact size={16} className="text-textSubtle" />;
  }
}

// Language Switcher Code Preview with accordion
function LanguageSwitcherCodePreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tokenizedLines = useShikiHighlighter(
    languageSwitcherComponentCode,
    "tsx",
  );
  const componentCodeLines: DualThemeToken[][] =
    tokenizedLines ||
    languageSwitcherComponentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "var(--ds-gray-1000)",
            darkColor: "var(--ds-gray-1000)",
          },
        ] as DualThemeToken[],
    );

  const handleCopyComponentCode = useCallback(() => {
    navigator.clipboard.writeText(languageSwitcherComponentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <div className="border border-[var(--ds-gray-400)] rounded-lg overflow-hidden">
      {/* Preview area */}
      <div
        className="p-6 group"
        style={{ background: "var(--ds-background-100)" }}
      >
        <LanguageSwitcherPreview />
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
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
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
                        {lineTokens.map((token, tokenIndex) => (
                          <RenderShikiToken key={tokenIndex} token={token} />
                        ))}
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

// Interactive Language Switcher Preview
function LanguageSwitcherPreview() {
  const [language, setLanguage] = useState("js");
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    if (language === "ts" || language === "next")
      return languageSwitcherPreviewCodeTs;
    if (language === "lua") return languageSwitcherPreviewCodeLua;
    return languageSwitcherPreviewCodeJs;
  };

  const getFilename = () => {
    if (language === "ts") return "language-switcher.tsx";
    if (language === "next") return "language-switcher.tsx";
    if (language === "lua") return "bloom-filter.lua";
    return "language-switcher.jsx";
  };

  const code = getCode();
  const shikiLanguage =
    language === "next"
      ? "tsx"
      : language === "ts"
        ? "typescript"
        : language === "lua"
          ? "lua"
          : "jsx";
  const tokenizedLines = useShikiHighlighter(code, shikiLanguage);

  // Fallback while Shiki is loading
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    code.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "var(--ds-gray-1000)",
            darkColor: "var(--ds-gray-1000)",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [code]);

  return (
    <div
      className="relative border border-[var(--ds-gray-400)] rounded overflow-hidden"
      data-code-block
    >
      {/* Header with filename and switcher */}
      <div
        className="flex items-center justify-between h-12 pl-4 pr-3 border-b border-[var(--ds-gray-400)]"
        style={{
          background: "var(--ds-background-200)",
          borderRadius: "4px 4px 0 0",
        }}
      >
        <div className="flex items-center gap-2">
          {getLanguageIcon(language)}
          <span className="text-[13px] text-textSubtle">{getFilename()}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Language Switcher - Geist style with visible label overlay */}
          <div className="relative rounded hover:bg-[var(--ds-gray-200)] dark:hover:bg-[var(--ds-gray-100)] transition-colors">
            <div
              aria-hidden="true"
              className="flex items-center gap-1 pointer-events-none text-[12px] text-textSubtle px-2 py-1.5"
            >
              <span>
                {languageOptions.find((o) => o.value === language)?.label}
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full text-[12px]"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded hover:bg-[var(--ds-gray-200)] dark:hover:bg-[var(--ds-gray-100)] transition-colors text-textSubtle hover:text-textDefault"
            aria-label="Copy code"
          >
            <CopyIconButton copied={copied} />
          </button>
        </div>
      </div>

      {/* Code content */}
      <pre
        className="overflow-x-auto py-4"
        style={{ background: "var(--ds-background-100)" }}
      >
        <code className="block text-[13px] leading-[20px] font-mono">
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
                {lineTokens.map((token, tokenIndex) => (
                  <RenderShikiToken key={tokenIndex} token={token} />
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

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
          prop. Click a line number to highlight it with an amber left border.
          Click again to remove the highlight.
        </p>
        <CodePreview
          previewCode={referencedPreviewCode}
          previewFilename=""
          componentCode={referencedComponentCode}
          referencedLines={[1, 2, 3, 4, 5, 6, 7]}
        />
      </Section>

      {/* Language Switcher Section */}
      <Section>
        <SectionHeader id="language-switcher">Language switcher</SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Use the switcher prop to add a language dropdown to the header. When
          the user switches languages, the code, filename, and icon update
          accordingly.
        </p>
        <LanguageSwitcherCodePreview />
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
          previewFilename="hidden-line-numbers.jsx"
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

      {/* Syntax Highlighting Section */}
      <Section>
        <SectionHeader id="syntax-highlighting">
          Syntax highlighting
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          The CodeBlock component uses{" "}
          <a
            href="https://shiki.style"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textDefault underline hover:no-underline"
          >
            Shiki
          </a>{" "}
          for syntax highlighting, the same engine used by VS Code. It provides
          accurate, theme-aware highlighting for all major programming
          languages.
        </p>

        <h3 className="text-[16px] font-semibold text-textDefault mt-8 mb-4">
          Theme
        </h3>
        <p className="text-copy-14 text-textSubtle mb-4">
          We use the{" "}
          <span className="font-semibold text-textDefault">One Light</span> and{" "}
          <span className="font-semibold text-textDefault">One Dark Pro</span>{" "}
          themes, which automatically switch based on the current color mode.
          These themes provide vibrant, readable syntax highlighting inspired by
          Atom&apos;s classic editor theme.
        </p>

        <h3 className="text-[16px] font-semibold text-textDefault mt-8 mb-4">
          Diff highlighting
        </h3>
        <p className="text-copy-14 text-textSubtle mb-4">
          When using{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            addedLines
          </code>{" "}
          or{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            removedLines
          </code>
          , syntax highlighting changes to emphasise what is being modified.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Token type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Color
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Token
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Examples
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Identifiers & property names</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[var(--ds-red-900)]"></span>
                    <span className="text-textSubtle">Red</span>
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  --ds-red-900
                </td>
                <td className="py-3 px-4 font-mono text-[var(--ds-red-900)]">
                  experimental, appDir, config
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Value keywords</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[var(--ds-green-900)]"></span>
                    <span className="text-textSubtle">Green</span>
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  --ds-green-900
                </td>
                <td className="py-3 px-4 font-mono text-[var(--ds-green-900)]">
                  true, false, null
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Everything else</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[var(--ds-gray-1000)]"></span>
                    <span className="text-textSubtle">Gray</span>
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  --ds-gray-1000
                </td>
                <td className="py-3 px-4 font-mono text-[var(--ds-gray-1000)]">
                  {"{ } : , ="}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

"use client";

import { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import { Search } from "lucide-react";

interface VariantShowcaseProps {
  title: string;
  id: string;
  variant: "primary" | "secondary" | "inverse" | "inverse-secondary";
  code: string;
  inverse?: boolean;
}

// VS Code Dark-style syntax highlighting for JSX
function highlightCode(code: string) {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(<\/?[A-Z][a-zA-Z]*|>|[a-z-]+(?==)|"[^"]*")/g);

    const highlighted = parts.map((part, i) => {
      if (/^<\/?[A-Z]/.test(part)) {
        return (
          <span key={i} className="text-[#569CD6]">
            {part}
          </span>
        );
      }
      if (part === ">") {
        return (
          <span key={i} className="text-[#569CD6]">
            {part}
          </span>
        );
      }
      if (/^"[^"]*"$/.test(part)) {
        return (
          <span key={i} className="text-[#CE9178]">
            {part}
          </span>
        );
      }
      if (/^[a-z-]+$/.test(part) && parts[i + 1] === "=") {
        return (
          <span key={i} className="text-[#9CDCFE]">
            {part}
          </span>
        );
      }
      if (/^(icon|inverse|secondary|disabled|size)$/.test(part)) {
        return (
          <span key={i} className="text-[#9CDCFE]">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });

    return (
      <span key={lineIndex}>
        {highlighted}
        {lineIndex < lines.length - 1 && "\n"}
      </span>
    );
  });
}

function VariantShowcase({
  title,
  id,
  variant,
  code,
  inverse = false,
}: VariantShowcaseProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [codeValue, setCodeValue] = useState(code);

  return (
    <div className="mb-8">
      <h3
        id={id}
        className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
      >
        {title}
      </h3>

      {/* Preview + States container (side-by-side) */}
      <div className="flex rounded-t-lg border border-b-0 border-borderSubtle overflow-hidden">
        {/* Preview area - fixed background regardless of theme */}
        <div
          className={`flex-1 p-8 flex items-center justify-start min-h-[120px] ${
            inverse ? "bg-asphalt-10" : "bg-white"
          }`}
        >
          <IconButton
            variant={
              variant === "secondary" || variant === "inverse-secondary"
                ? "secondary"
                : "primary"
            }
            inverse={inverse}
            ignoreDarkMode
            size="small"
            disabled={isDisabled}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </IconButton>
        </div>

        <div className="w-[140px] border-l border-borderSubtle bg-surfaceSubtle dark:bg-neutral-900 p-4 flex flex-col">
          <span className="text-sm font-medium text-textSubtle mb-3">
            States
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isDisabled}
                onChange={(e) => setIsDisabled(e.target.checked)}
                className="peer sr-only"
              />
              <div
                className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center
                  transition-all duration-150 ease-out cursor-pointer
                  ${
                    isDisabled
                      ? "bg-asphalt-10 dark:bg-asphalt-95 border-asphalt-10 dark:border-asphalt-95"
                      : "bg-white dark:bg-asphalt-10 border-asphalt-40 dark:border-asphalt-60 hover:border-asphalt-50"
                  }
                  peer-focus:ring-1 peer-focus:ring-borderNeutral peer-focus:ring-offset-0
                `}
              >
                {isDisabled && (
                  <svg
                    className="w-3 h-3 text-white dark:text-asphalt-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 12 12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 6L5 8.5L9.5 4"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-textDefault">disabled</span>
          </label>
        </div>
      </div>

      <div className="relative rounded-b-lg border border-borderSubtle bg-surfaceSubtle dark:bg-neutral-900 overflow-hidden focus-within:border-borderDefault focus-within:ring-1 focus-within:ring-borderNeutral transition-all">
        <div className="absolute inset-0 p-4 pointer-events-none">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            <code>{highlightCode(codeValue)}</code>
          </pre>
        </div>
        <textarea
          value={codeValue}
          onChange={(e) => setCodeValue(e.target.value)}
          spellCheck={false}
          className="w-full p-4 text-sm font-mono bg-transparent text-transparent caret-textDefault resize-none focus:outline-none"
          rows={3}
        />
      </div>
    </div>
  );
}

export default function SlimButtonIconComponent() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Buttons</p>
        <h1
          id="slim-button-icon"
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
        >
          Slim button + icon
        </h1>
      </div>

      <p className="text-base text-textSubtle max-w-3xl">
        For actions where space is limited, or to resolve conflicting priorities
        between nearby buttons.
      </p>

      <hr className="border-t-4 border-textDefault" />

      {/* Variants Section */}
      <section>
        <h2
          id="variants"
          className="sr-only font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Variants
        </h2>

        <VariantShowcase
          title="Default"
          id="variants-default"
          variant="primary"
          code={`<IconButton size="small" aria-label="Search">
  <SearchIcon />
</IconButton>`}
        />

        <VariantShowcase
          title="Inverse"
          id="variants-inverse"
          variant="inverse"
          code={`<IconButton size="small" inverse aria-label="Search">
  <SearchIcon />
</IconButton>`}
          inverse
        />

        <VariantShowcase
          title="Secondary"
          id="variants-secondary"
          variant="secondary"
          code={`<IconButton size="small" variant="secondary" aria-label="Search">
  <SearchIcon />
</IconButton>`}
        />

        <VariantShowcase
          title="Inverse, Secondary"
          id="variants-inverse-secondary"
          variant="inverse-secondary"
          code={`<IconButton size="small" variant="secondary" inverse aria-label="Search">
  <SearchIcon />
</IconButton>`}
          inverse
        />
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Guidelines Section */}
      <section>
        <h2
          id="guidelines"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Guidelines
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <h3
          id="guidelines-how-to-use"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          How to use
        </h3>

        <div className="space-y-4 text-base text-textSubtle max-w-3xl">
          <p>Do not use for principal actions.</p>
          <p>
            For secondary actions where space is limited, and for additional
            options adjacent to a slim primary button.
          </p>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Props Section */}
      <section>
        <h2
          id="props"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Props
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

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
              </tr>
            </thead>
            <tbody className="text-sm font-mono">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">children</td>
                <td className="py-3 px-4">ReactNode</td>
                <td className="py-3 px-4 text-textSubtle">required</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">type</td>
                <td className="py-3 px-4">
                  &apos;button&apos; | &apos;submit&apos; | &apos;reset&apos;
                </td>
                <td className="py-3 px-4">&apos;button&apos;</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">className</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">&apos;&apos;</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">size</td>
                <td className="py-3 px-4">
                  &apos;default&apos; | &apos;small&apos;
                </td>
                <td className="py-3 px-4">&apos;small&apos;</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">variant</td>
                <td className="py-3 px-4">
                  &apos;primary&apos; | &apos;secondary&apos;
                </td>
                <td className="py-3 px-4">&apos;primary&apos;</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">inverse</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">false</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">disabled</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">false</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface VariantShowcaseProps {
  title: string;
  id: string;
  variant: "primary" | "secondary" | "inverse" | "inverse-secondary";
  code: string;
  inverse?: boolean;
}

// VS Code Dark-style syntax highlighting for JSX
function highlightCode(code: string) {
  const parts = code.split(/(<\/?[A-Z][a-zA-Z]*|>|[a-z]+(?==))/g);

  return parts.map((part, i) => {
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
    if (/^[a-z]+$/.test(part) && parts[i + 1] !== ">") {
      return (
        <span key={i} className="text-[#9CDCFE]">
          {part}
        </span>
      );
    }
    if (part && !part.startsWith("<") && part !== ">") {
      return (
        <span key={i} className="text-[#CE9178]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
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
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // In dark mode, swap the inverse behavior
  const effectiveInverse = isDark ? !inverse : inverse;

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
        {/* Preview area - swaps between light/dark based on variant and theme */}
        <div
          className={`flex-1 p-8 flex items-center justify-start min-h-[120px] ${
            inverse
              ? "bg-asphalt-10 dark:bg-white"
              : "bg-white dark:bg-asphalt-10"
          }`}
        >
          <Button
            variant={
              variant === "secondary" || variant === "inverse-secondary"
                ? "secondary"
                : "primary"
            }
            inverse={effectiveInverse}
            size="slim"
            disabled={isDisabled}
            className="min-w-[100px]"
          >
            Slim button
          </Button>
        </div>

        {/* States sidebar */}
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

      {/* Editable code box */}
      <div className="relative rounded-b-lg border border-borderSubtle bg-surfaceSubtle dark:bg-neutral-900 overflow-hidden focus-within:border-borderDefault focus-within:ring-1 focus-within:ring-borderNeutral transition-all">
        {/* Highlighted overlay */}
        <div className="absolute inset-0 p-4 pointer-events-none">
          <pre className="text-sm font-mono">
            <code>{highlightCode(codeValue)}</code>
          </pre>
        </div>
        {/* Editable textarea */}
        <textarea
          value={codeValue}
          onChange={(e) => setCodeValue(e.target.value)}
          spellCheck={false}
          className="w-full p-4 text-sm font-mono bg-transparent text-transparent caret-textDefault resize-none focus:outline-none"
          rows={1}
        />
      </div>
    </div>
  );
}

export default function SlimButtonComponent() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Buttons</p>
        <h1
          id="slim-button"
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
        >
          Slim button
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

        {/* Primary (Default) */}
        <VariantShowcase
          title="Primary"
          id="variants-primary"
          variant="primary"
          code={`<Button size="slim">Slim button</Button>`}
        />

        {/* Inverse */}
        <VariantShowcase
          title="Inverse"
          id="variants-inverse"
          variant="inverse"
          code={`<Button size="slim" inverse>Slim button</Button>`}
          inverse
        />

        {/* Secondary */}
        <VariantShowcase
          title="Secondary"
          id="variants-secondary"
          variant="secondary"
          code={`<Button size="slim" variant="secondary">Slim button</Button>`}
        />

        {/* Inverse Secondary */}
        <VariantShowcase
          title="Inverse, Secondary"
          id="variants-inverse-secondary"
          variant="inverse-secondary"
          code={`<Button size="slim" variant="secondary" inverse>Slim button</Button>`}
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
          <p>Do not use for primary actions.</p>
          <p>
            For secondary actions where space is limited, and for additional
            options adjacent to a slim primary button.
          </p>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Anatomy Section */}
      <section>
        <h2
          id="anatomy"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Anatomy
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Property
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Height</td>
                <td className="py-3 px-4">36px</td>
                <td className="py-3 px-4 font-mono">h-9</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Horizontal padding</td>
                <td className="py-3 px-4">16px</td>
                <td className="py-3 px-4 font-mono">px-4</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Border radius</td>
                <td className="py-3 px-4">6px</td>
                <td className="py-3 px-4 font-mono">rounded-md</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Font family</td>
                <td className="py-3 px-4">Inter</td>
                <td className="py-3 px-4 font-mono">font-sans</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Font size</td>
                <td className="py-3 px-4">14px</td>
                <td className="py-3 px-4 font-mono">text-sm</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Font weight</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4 font-mono">font-semibold</td>
              </tr>
            </tbody>
          </table>
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
                <td className="py-3 pr-4">variant</td>
                <td className="py-3 px-4">
                  &apos;primary&apos; | &apos;secondary&apos;
                </td>
                <td className="py-3 px-4">&apos;primary&apos;</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">size</td>
                <td className="py-3 px-4">
                  &apos;default&apos; | &apos;slim&apos;
                </td>
                <td className="py-3 px-4">&apos;slim&apos;</td>
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
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">className</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">&apos;&apos;</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">onClick</td>
                <td className="py-3 px-4">() =&gt; void</td>
                <td className="py-3 px-4">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

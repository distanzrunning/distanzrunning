"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface VariantShowcaseProps {
  title: string;
  id: string;
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "inverse"
    | "inverse-secondary"
    | "inverse-tertiary";
  code: string;
  inverse?: boolean;
}

// VS Code Dark-style syntax highlighting for JSX
function highlightCode(code: string) {
  // Match JSX tags, attributes, and text content
  const parts = code.split(/(<\/?[A-Z][a-zA-Z]*|>|[a-z]+(?==))/g);

  return parts.map((part, i) => {
    // Component tags (e.g., <Button, </Button) - Blue
    if (/^<\/?[A-Z]/.test(part)) {
      return (
        <span key={i} className="text-[#569CD6]">
          {part}
        </span>
      );
    }
    // Closing bracket - Blue
    if (part === ">") {
      return (
        <span key={i} className="text-[#569CD6]">
          {part}
        </span>
      );
    }
    // Attributes (e.g., inverse, secondary) - Light Blue
    if (/^[a-z]+$/.test(part) && parts[i + 1] !== ">") {
      return (
        <span key={i} className="text-[#9CDCFE]">
          {part}
        </span>
      );
    }
    // Default text content - Orange
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
          <Button
            variant={
              variant === "secondary" || variant === "inverse-secondary"
                ? "secondary"
                : variant === "tertiary" || variant === "inverse-tertiary"
                  ? "tertiary"
                  : "primary"
            }
            inverse={inverse}
            ignoreDarkMode
            disabled={isDisabled}
            className="min-w-[120px]"
          >
            Button
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

export default function ButtonComponent() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Buttons</p>
        <h1
          id="button"
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
        >
          Button
        </h1>
      </div>

      <p className="text-base text-textSubtle max-w-3xl">
        For the primary action.
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
          code={`<Button>Button</Button>`}
        />

        {/* Inverse */}
        <VariantShowcase
          title="Inverse"
          id="variants-inverse"
          variant="inverse"
          code={`<Button inverse>Button</Button>`}
          inverse
        />

        {/* Secondary */}
        <VariantShowcase
          title="Secondary"
          id="variants-secondary"
          variant="secondary"
          code={`<Button secondary>Button</Button>`}
        />

        {/* Inverse Secondary */}
        <VariantShowcase
          title="Inverse, Secondary"
          id="variants-inverse-secondary"
          variant="inverse-secondary"
          code={`<Button inverse secondary>Button</Button>`}
          inverse
        />

        {/* Tertiary */}
        <VariantShowcase
          title="Tertiary"
          id="variants-tertiary"
          variant="tertiary"
          code={`<Button variant="tertiary">Button</Button>`}
        />

        {/* Inverse Tertiary */}
        <VariantShowcase
          title="Inverse, Tertiary"
          id="variants-inverse-tertiary"
          variant="inverse-tertiary"
          code={`<Button inverse variant="tertiary">Button</Button>`}
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
          <p>
            Use the <strong>primary button</strong> for the main action on a
            page or within a form. There should typically be only one primary
            button visible at a time.
          </p>
          <p>
            Use <strong>secondary buttons</strong> for alternative actions, or
            when multiple buttons are needed alongside a primary action.
          </p>
          <p>
            Use <strong>tertiary buttons</strong> (ghost buttons) for
            low-emphasis actions such as &quot;Cancel&quot;, &quot;Learn
            more&quot;, or navigation links that need button-like affordance.
            They have no background or border, only text with a subtle hover
            state.
          </p>
          <p>
            Use <strong>inverse variants</strong> when placing buttons on dark
            backgrounds to maintain visibility and contrast.
          </p>
        </div>

        <hr className="border-t border-borderDefault my-8" />

        <h3
          id="guidelines-best-practices"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Best practices
        </h3>

        <ul className="space-y-3 text-base text-textSubtle max-w-3xl list-disc pl-5">
          <li>
            Use clear, action-oriented labels (e.g., &quot;Subscribe&quot;,
            &quot;Save changes&quot;, &quot;Continue&quot;)
          </li>
          <li>Keep button labels concise—ideally 1-3 words</li>
          <li>Maintain consistent button sizing within the same context</li>
          <li>
            Ensure sufficient colour contrast for accessibility (WCAG AA
            minimum)
          </li>
          <li>Provide visual feedback for hover, focus, and disabled states</li>
        </ul>
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
                <td className="py-3 px-4">48px</td>
                <td className="py-3 px-4 font-mono">h-12</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Horizontal padding</td>
                <td className="py-3 px-4">20px</td>
                <td className="py-3 px-4 font-mono">px-5</td>
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
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Border width (secondary)</td>
                <td className="py-3 px-4">1px</td>
                <td className="py-3 px-4 font-mono">border</td>
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
                  &apos;primary&apos; | &apos;secondary&apos; |
                  &apos;tertiary&apos;
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

      <hr className="border-t-4 border-textDefault" />

      {/* Colour Reference Section */}
      <section>
        <h2
          id="colours"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Colour reference
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <h3
          id="colours-primary"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Primary button
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  State
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Background
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Text
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Default (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
                <td className="py-3 px-4 font-mono">white</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Hover (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-20</td>
                <td className="py-3 px-4 font-mono">white</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Default (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Hover (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-90</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          id="colours-secondary"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Secondary button
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  State
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Background
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Border
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Text
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Default (light)</td>
                <td className="py-3 px-4 font-mono">transparent</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Hover (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Default (dark)</td>
                <td className="py-3 px-4 font-mono">transparent</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Hover (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          id="colours-tertiary"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Tertiary button
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  State
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Background
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Text
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Default (light)</td>
                <td className="py-3 px-4 font-mono">transparent</td>
                <td className="py-3 px-4 font-mono">asphalt-20</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Hover (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-95/70</td>
                <td className="py-3 px-4 font-mono">asphalt-10</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Default (dark)</td>
                <td className="py-3 px-4 font-mono">transparent</td>
                <td className="py-3 px-4 font-mono">asphalt-80</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Hover (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-20/50</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

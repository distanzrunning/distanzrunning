"use client";

import { useState } from "react";
import Toggle from "@/components/ui/Toggle";

interface VariantShowcaseProps {
  title: string;
  id: string;
  code: string;
  inverse?: boolean;
  size?: "default" | "small";
  showLabel?: boolean;
}

// VS Code Dark-style syntax highlighting for JSX
function highlightCode(code: string) {
  const parts = code.split(/(<\/?[A-Z][a-zA-Z]*|>|[a-z]+(?==)|"[^"]*")/g);

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
    if (/^".*"$/.test(part)) {
      return (
        <span key={i} className="text-[#CE9178]">
          {part}
        </span>
      );
    }
    if (/^[a-z]+$/.test(part)) {
      return (
        <span key={i} className="text-[#9CDCFE]">
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
  code,
  inverse = false,
  size = "default",
  showLabel = false,
}: VariantShowcaseProps) {
  const [isChecked, setIsChecked] = useState(false);
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

      {/* Preview + States container */}
      <div className="flex rounded-t-lg border border-b-0 border-gray-300 overflow-hidden">
        {/* Preview area */}
        <div
          className={`flex-1 p-8 flex items-center justify-start min-h-[120px] ${
            inverse ? "bg-asphalt-10" : "bg-white"
          }`}
        >
          <Toggle
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            size={size}
            inverse={inverse}
            ignoreDarkMode
            disabled={isDisabled}
            label={showLabel ? "Enable feature" : undefined}
          />
        </div>

        {/* States sidebar */}
        <div className="w-[140px] border-l border-gray-300 [background:var(--ds-gray-100)] dark:bg-neutral-900 p-4 flex flex-col gap-3">
          <span className="text-sm font-medium text-gray-900 mb-1">States</span>

          {/* Checked toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="peer sr-only"
              />
              <div
                className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center
                  transition-all duration-150 ease-out cursor-pointer
                  ${
                    isChecked
                      ? "bg-asphalt-10 dark:bg-asphalt-95 border-asphalt-10 dark:border-asphalt-95"
                      : "bg-white dark:bg-asphalt-10 border-asphalt-40 dark:border-asphalt-60 hover:border-asphalt-50"
                  }
                  peer-focus:ring-1 peer-focus:ring-borderNeutral peer-focus:ring-offset-0
                `}
              >
                {isChecked && (
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
            <span className="text-sm text-gray-1000">checked</span>
          </label>

          {/* Disabled toggle */}
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
            <span className="text-sm text-gray-1000">disabled</span>
          </label>
        </div>
      </div>

      {/* Editable code box */}
      <div className="relative rounded-b-lg border border-gray-300 [background:var(--ds-gray-100)] dark:bg-neutral-900 overflow-hidden focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-all">
        <div className="absolute inset-0 p-4 pointer-events-none">
          <pre className="text-sm font-mono">
            <code>{highlightCode(codeValue)}</code>
          </pre>
        </div>
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

export default function ToggleComponent() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Controls
        </p>
        <h1
          id="toggle"
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
        >
          Toggle
        </h1>
      </div>

      <p className="text-base text-gray-900 max-w-3xl">
        A switch control for binary on/off states. Use toggles for settings that
        take effect immediately.
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

        {/* Default */}
        <VariantShowcase
          title="Default"
          id="variants-default"
          code={`<Toggle checked={checked} onChange={handleChange} />`}
        />

        {/* With Label */}
        <VariantShowcase
          title="With Label"
          id="variants-with-label"
          code={`<Toggle label="Enable feature" checked={checked} onChange={handleChange} />`}
          showLabel
        />

        {/* Small */}
        <VariantShowcase
          title="Small"
          id="variants-small"
          code={`<Toggle size="small" checked={checked} onChange={handleChange} />`}
          size="small"
        />

        {/* Inverse */}
        <VariantShowcase
          title="Inverse"
          id="variants-inverse"
          code={`<Toggle inverse checked={checked} onChange={handleChange} />`}
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

        <hr className="border-t border-gray-400 mb-6" />

        <h3
          id="guidelines-how-to-use"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          How to use
        </h3>

        <div className="space-y-4 text-base text-gray-900 max-w-3xl">
          <p>
            Use <strong>toggles</strong> for settings that take immediate
            effect—the action happens as soon as the user flips the switch.
            There&apos;s no need for a separate &quot;Save&quot; button.
          </p>
          <p>
            Use <strong>checkboxes</strong> instead when the setting is part of
            a form that requires explicit submission, or when selecting multiple
            items from a list.
          </p>
          <p>
            Always provide a clear label that describes what the toggle
            controls. The label should describe the &quot;on&quot; state.
          </p>
        </div>

        <hr className="border-t border-gray-400 my-8" />

        <h3
          id="guidelines-toggle-vs-checkbox"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Toggle vs Checkbox
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Use Toggle when...
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Use Checkbox when...
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Setting takes immediate effect</td>
                <td className="py-3 px-4">
                  Part of a form requiring submission
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Binary on/off choice</td>
                <td className="py-3 px-4">Multiple selections from a list</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Mobile/touch-friendly interface</td>
                <td className="py-3 px-4">Dense forms with many options</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Enabling/disabling features</td>
                <td className="py-3 px-4">Agreeing to terms and conditions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-gray-400 my-8" />

        <h3
          id="guidelines-best-practices"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Best practices
        </h3>

        <ul className="space-y-3 text-base text-gray-900 max-w-3xl list-disc pl-5">
          <li>
            Write labels in positive terms—describe the &quot;on&quot; state
            (e.g., &quot;Enable notifications&quot; not &quot;Disable
            notifications&quot;)
          </li>
          <li>Keep labels concise and clear—avoid technical jargon</li>
          <li>
            Don&apos;t use toggles for destructive actions—use a button with
            confirmation instead
          </li>
          <li>
            Ensure the toggle is large enough for touch targets (minimum 44×44px
            touch area)
          </li>
          <li>
            Provide visual feedback for the current state—the toggle should
            clearly show whether it&apos;s on or off
          </li>
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

        <hr className="border-t border-gray-400 mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Property
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Small
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Track width</td>
                <td className="py-3 px-4">44px</td>
                <td className="py-3 px-4">36px</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Track height</td>
                <td className="py-3 px-4">24px</td>
                <td className="py-3 px-4">20px</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Thumb diameter</td>
                <td className="py-3 px-4">20px</td>
                <td className="py-3 px-4">16px</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Border radius</td>
                <td className="py-3 px-4" colSpan={2}>
                  <span className="font-mono">rounded-full</span> (pill shape)
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Transition</td>
                <td className="py-3 px-4" colSpan={2}>
                  200ms ease-out
                </td>
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

        <hr className="border-t border-gray-400 mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
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
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">checked</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">false</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">onChange</td>
                <td className="py-3 px-4">(e: ChangeEvent) =&gt; void</td>
                <td className="py-3 px-4">undefined</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">size</td>
                <td className="py-3 px-4">
                  &apos;default&apos; | &apos;small&apos;
                </td>
                <td className="py-3 px-4">&apos;default&apos;</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">inverse</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">false</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">disabled</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">false</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">label</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">undefined</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">labelPosition</td>
                <td className="py-3 px-4">
                  &apos;left&apos; | &apos;right&apos;
                </td>
                <td className="py-3 px-4">&apos;right&apos;</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">id</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">auto-generated</td>
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

        <hr className="border-t border-gray-400 mb-6" />

        <h3
          id="colours-track"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Track
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  State
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Off
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  On
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Default (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-70</td>
                <td className="py-3 px-4 font-mono">electric-pink</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Hover (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-60</td>
                <td className="py-3 px-4 font-mono">electric-pink-45</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Default (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-40</td>
                <td className="py-3 px-4 font-mono">electric-pink</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Hover (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-50</td>
                <td className="py-3 px-4 font-mono">electric-pink-45</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Disabled (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-80</td>
                <td className="py-3 px-4 font-mono">asphalt-60</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Disabled (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-30</td>
                <td className="py-3 px-4 font-mono">asphalt-40</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          id="colours-thumb"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Thumb
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  State
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Colour
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Default (light)</td>
                <td className="py-3 px-4 font-mono">white</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Default (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-95</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Disabled (light)</td>
                <td className="py-3 px-4 font-mono">asphalt-90</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Disabled (dark)</td>
                <td className="py-3 px-4 font-mono">asphalt-50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

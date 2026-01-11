"use client";

import { useState } from "react";

interface CheckboxPreviewProps {
  disabled?: boolean;
  isIndeterminate?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

function CheckboxPreview({
  disabled = false,
  isIndeterminate = false,
  checked = false,
  onChange,
  label = "Input text",
}: CheckboxPreviewProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={`
            w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center
            transition-all duration-150 ease-out
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${
              checked || isIndeterminate
                ? "bg-asphalt-10 dark:bg-asphalt-95 border-asphalt-10 dark:border-asphalt-95"
                : "bg-white dark:bg-asphalt-10 border-asphalt-40 dark:border-asphalt-60 hover:border-asphalt-50"
            }
            peer-focus:ring-1 peer-focus:ring-borderNeutral peer-focus:ring-offset-0
          `}
        >
          {/* Checkmark */}
          {checked && !isIndeterminate && (
            <svg
              className="w-3.5 h-3.5 text-white dark:text-asphalt-10"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 12 12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 6l3 3 5-5.5"
              />
            </svg>
          )}
          {/* Indeterminate dash */}
          {isIndeterminate && (
            <svg
              className="w-3.5 h-3.5 text-white dark:text-asphalt-10"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 12 12"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6h8" />
            </svg>
          )}
        </div>
      </div>
      <span
        className={`text-sm text-textDefault ${disabled ? "opacity-50" : ""}`}
      >
        {label}
      </span>
    </label>
  );
}

// VS Code Dark-style syntax highlighting for JSX
function highlightCode(code: string) {
  const parts = code.split(/(<\/?[A-Z][a-zA-Z]*|>|[a-z]+(?==)|'[^']*')/g);

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
    if (/^[a-z]+$/.test(part)) {
      return (
        <span key={i} className="text-[#9CDCFE]">
          {part}
        </span>
      );
    }
    if (/^'[^']*'$/.test(part)) {
      return (
        <span key={i} className="text-[#CE9178]">
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

function VariantShowcase() {
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [codeValue, setCodeValue] = useState(
    "<FormCheckbox labelText='Input text' id='checkbox' />",
  );

  return (
    <div className="mb-8">
      <h3
        id="variants-default"
        className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
      >
        Default
      </h3>

      {/* Preview + States container (side-by-side) */}
      <div className="flex rounded-t-lg border border-b-0 border-borderSubtle overflow-hidden">
        {/* Preview area */}
        <div className="flex-1 p-8 flex items-center justify-start min-h-[120px] bg-white dark:bg-asphalt-10">
          <CheckboxPreview
            checked={isChecked}
            disabled={isDisabled}
            isIndeterminate={isIndeterminate}
            onChange={setIsChecked}
          />
        </div>

        {/* States sidebar */}
        <div className="w-[160px] border-l border-borderSubtle bg-surfaceSubtle dark:bg-neutral-900 p-4 flex flex-col">
          <span className="text-sm font-medium text-textSubtle mb-3">
            States
          </span>
          <div className="space-y-2">
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
                      strokeWidth={1.75}
                      viewBox="0 0 12 12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2 6l3 3 5-5.5"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-textDefault">disabled</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isIndeterminate}
                  onChange={(e) => {
                    setIsIndeterminate(e.target.checked);
                    if (e.target.checked) setIsChecked(false);
                  }}
                  className="peer sr-only"
                />
                <div
                  className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center
                    transition-all duration-150 ease-out cursor-pointer
                    ${
                      isIndeterminate
                        ? "bg-asphalt-10 dark:bg-asphalt-95 border-asphalt-10 dark:border-asphalt-95"
                        : "bg-white dark:bg-asphalt-10 border-asphalt-40 dark:border-asphalt-60 hover:border-asphalt-50"
                    }
                    peer-focus:ring-1 peer-focus:ring-borderNeutral peer-focus:ring-offset-0
                  `}
                >
                  {isIndeterminate && (
                    <svg
                      className="w-3 h-3 text-white dark:text-asphalt-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      viewBox="0 0 12 12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2 6h8"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-textDefault">isIndeterminate</span>
            </label>
          </div>
        </div>
      </div>

      {/* Editable code box */}
      <div className="relative rounded-b-lg border border-borderSubtle bg-surfaceSubtle dark:bg-neutral-900 overflow-hidden focus-within:border-borderDefault focus-within:ring-1 focus-within:ring-borderNeutral transition-all">
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

export default function CheckboxComponent() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Forms</p>
        <h1
          id="checkbox"
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
        >
          Checkbox
        </h1>
      </div>

      <p className="text-base text-textSubtle max-w-3xl">
        For a set of selectable values. In a group of checkbox inputs, multiple
        values may be selected.
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

        <VariantShowcase />
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
                <td className="py-3 pr-4">isIndeterminate</td>
                <td className="py-3 px-4">bool</td>
                <td className="py-3 px-4">false</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">labelText</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4 text-textSubtle">required</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">id</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4 text-textSubtle">required</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">checked</td>
                <td className="py-3 px-4">bool</td>
                <td className="py-3 px-4">false</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">disabled</td>
                <td className="py-3 px-4">bool</td>
                <td className="py-3 px-4">false</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">onChange</td>
                <td className="py-3 px-4">{"(checked: bool) => void"}</td>
                <td className="py-3 px-4">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

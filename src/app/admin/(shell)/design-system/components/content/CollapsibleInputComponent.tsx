"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import CollapsibleInput from "@/components/ui/CollapsibleInput";

export default function CollapsibleInputComponent() {
  const [emptyDemo, setEmptyDemo] = useState("");
  const [primedDemo, setPrimedDemo] = useState("Berlin");

  const buildSuffix = (
    value: string,
    setValue: (next: string) => void,
  ) =>
    value ? (
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setValue("")}
        aria-label="Clear search"
        className="flex size-6 cursor-pointer items-center justify-center rounded-sm text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-200)] hover:text-[color:var(--ds-gray-1000)]"
      >
        <X className="size-3.5" />
      </button>
    ) : undefined;

  return (
    <article className="space-y-10">
      {/* Header */}
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-medium text-textDefault mb-4">
          Collapsible Input
        </h1>
        <p className="text-lg text-textSubtle max-w-2xl">
          A search-shaped input that collapses to its prefix-icon
          square when empty and unfocused, and expands smoothly to
          its full width when focused or once the user has typed
          something. Reach for it in dense filter rows or toolbar
          contexts where the icon needs to read as the dominant
          affordance until activated.
        </p>
      </header>

      {/* Preview */}
      <section>
        <h2 className="font-display text-xl font-medium text-textDefault mb-4">
          Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-borderNeutral rounded-lg p-8 flex flex-col items-center gap-3 bg-[color:var(--ds-background-100)]">
            <span className="text-sm text-textSubtle font-medium">
              Empty — click to expand
            </span>
            <CollapsibleInput
              prefix={<Search className="size-4" />}
              placeholder="Search"
              value={emptyDemo}
              onChange={(e) => setEmptyDemo(e.target.value)}
              collapsedAriaLabel="Search demo"
              aria-label="Search demo"
              expandedSuffix={buildSuffix(emptyDemo, setEmptyDemo)}
            />
          </div>
          <div className="border border-borderNeutral rounded-lg p-8 flex flex-col items-center gap-3 bg-[color:var(--ds-background-100)]">
            <span className="text-sm text-textSubtle font-medium">
              With value (stays expanded)
            </span>
            <CollapsibleInput
              prefix={<Search className="size-4" />}
              placeholder="Search"
              value={primedDemo}
              onChange={(e) => setPrimedDemo(e.target.value)}
              collapsedAriaLabel="Search demo"
              aria-label="Search demo"
              expandedSuffix={buildSuffix(primedDemo, setPrimedDemo)}
            />
          </div>
        </div>
      </section>

      {/* When to use */}
      <section>
        <h2 className="font-display text-xl font-medium text-textDefault mb-4">
          When to use
        </h2>
        <p className="text-base text-textSubtle max-w-3xl">
          Use CollapsibleInput when an input needs to behave like a
          chip in a horizontal row (filter bars, toolbars) — the
          collapsed icon-only state matches the height and weight of
          neighbouring filter triggers, while the expanded state
          gives full input affordance once the user engages. For
          inputs that should always be visible (forms, settings,
          dialog fields), reach for the regular{" "}
          <a className="underline" href="/admin/design-system/input">
            Input
          </a>{" "}
          instead.
        </p>
      </section>

      {/* Usage */}
      <section>
        <h2 className="font-display text-xl font-medium text-textDefault mb-4">
          Usage
        </h2>
        <div className="bg-asphalt-95 dark:bg-asphalt-10 rounded-lg overflow-hidden">
          <pre className="p-4 text-sm overflow-x-auto">
            <code className="text-textDefault">{`import { Search, X } from "lucide-react";
import CollapsibleInput from "@/components/ui/CollapsibleInput";

// Basic — collapses to a 32×32 icon square when empty
<CollapsibleInput
  prefix={<Search className="size-4" />}
  placeholder="Search"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  collapsedAriaLabel="Search races"
  aria-label="Search races"
/>

// With a clear button in the right gutter while expanded.
// onMouseDown preventDefault keeps focus on the input so the
// user can keep typing after clearing.
<CollapsibleInput
  prefix={<Search className="size-4" />}
  placeholder="Search"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  expandedSuffix={
    query ? (
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setQuery("")}
        aria-label="Clear"
      >
        <X className="size-3.5" />
      </button>
    ) : undefined
  }
/>`}</code>
          </pre>
        </div>
      </section>

      {/* Props */}
      <section>
        <h2 className="font-display text-xl font-medium text-textDefault mb-4">
          Props
        </h2>
        <div className="overflow-x-auto rounded-lg border border-borderNeutral">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--ds-background-200)] text-left text-textDefault">
              <tr>
                <th className="px-4 py-3 font-medium">Prop</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Default</th>
                <th className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-textSubtle">
              {(
                [
                  [
                    "prefix",
                    "ReactNode",
                    "—",
                    "Icon rendered at the left edge in both states. Required.",
                  ],
                  [
                    "expandedSuffix",
                    "ReactNode",
                    "—",
                    "Element rendered in the right gutter only while expanded — typically a clear button when there's a value.",
                  ],
                  [
                    "expandedWidth",
                    "number",
                    "260",
                    "Width in pixels when the input is expanded.",
                  ],
                  [
                    "size",
                    `"small" | "default" | "large"`,
                    `"small"`,
                    "Mirrors Input's size scale.",
                  ],
                  [
                    "collapsedAriaLabel",
                    "string",
                    "—",
                    "aria-label used in the collapsed state where the placeholder isn't visible. Falls back to the regular aria-label.",
                  ],
                  [
                    "value",
                    "string",
                    "—",
                    "Controlled input value. Empty string + unfocused = collapsed.",
                  ],
                  [
                    "placeholder",
                    "string",
                    "—",
                    "Visible only while expanded.",
                  ],
                ] as const
              ).map(([prop, type, def, desc]) => (
                <tr key={prop} className="border-t border-borderNeutral">
                  <td className="px-4 py-3 font-mono text-textDefault">
                    {prop}
                  </td>
                  <td className="px-4 py-3 font-mono">{type}</td>
                  <td className="px-4 py-3 font-mono">{def}</td>
                  <td className="px-4 py-3">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

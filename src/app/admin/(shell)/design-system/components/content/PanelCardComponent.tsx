"use client";

import { Section } from "../ContentWithTOC";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PanelCard } from "@/components/ui/PanelCard";

export default function PanelCardComponent() {
  return (
    <>
      {/* Usage */}
      <Section>
        <h2
          id="usage"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Usage
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 max-w-3xl">
          Panel Card is the generic bordered surface every admin section
          reaches for: an optional h2 title, an optional action on the right
          (a "Clear" link, an "Export" button), and arbitrary body content
          underneath. Use it to group a chart, a table, a form, or a stack of
          paragraphs into a hairline-bordered card.
        </p>
      </Section>

      {/* Preview */}
      <Section>
        <h2
          id="preview"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Preview
        </h2>
        <div className="mt-6 flex flex-col gap-4 max-w-3xl">
          <PanelCard title="Recent decisions">
            <p className="text-copy-16 text-textSubtle m-0">
              Panel Card body. The card sits on{" "}
              <code className="inline-code">var(--ds-background-100)</code>{" "}
              with a hairline{" "}
              <code className="inline-code">var(--ds-gray-400)</code> border,
              24 px padding, and a 12 px radius.
            </p>
          </PanelCard>

          <PanelCard
            title="ID: abc-123-…"
            action={
              <a
                href="#"
                className="text-copy-13 text-textSubtle no-underline hover:underline"
              >
                Clear search
              </a>
            }
          >
            <p className="text-copy-16 text-textSubtle m-0">
              Optional <code className="inline-code">action</code> renders on
              the right of the title.
            </p>
          </PanelCard>

          <PanelCard>
            <p className="text-copy-16 text-textSubtle m-0">
              Title is optional too — drop it for a plain bordered container.
            </p>
          </PanelCard>
        </div>
      </Section>

      {/* Code */}
      <Section>
        <h2
          id="code"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Code
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 max-w-3xl">
          Import from <code className="inline-code">@/components/ui/PanelCard</code>{" "}
          and wrap any content.
        </p>
        <div className="mt-6">
          <CodeBlock
            language="tsx"
            filename="page.tsx"
            code={`import { PanelCard } from "@/components/ui/PanelCard";

<PanelCard
  title="Recent decisions"
  action={<button>Export</button>}
>
  <Table>{/* … */}</Table>
</PanelCard>

// Title-only
<PanelCard title="Per-category opt-in">
  <CategoryBar … />
</PanelCard>

// Plain bordered container
<PanelCard>
  <p>Just a panel.</p>
</PanelCard>`}
          />
        </div>
      </Section>

      {/* Props */}
      <Section>
        <h2
          id="props"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Props
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 text-heading-14">Prop</th>
                <th className="text-left py-3 px-4 text-heading-14">Type</th>
                <th className="text-left py-3 px-4 text-heading-14">Required</th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-copy-14">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">title</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">ReactNode</code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  Header title rendered as h2 (text-heading-16). Omit for a
                  card with no header row.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">action</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">ReactNode</code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  Element rendered on the right of the title — typically a
                  link or button
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">children</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">ReactNode</code>
                </td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4 text-textSubtle">
                  Card body — arbitrary content
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Foundations */}
      <Section>
        <h2
          id="foundations"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Foundations
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 max-w-3xl">
          Panel Card uses the same documented foundation as Stat Card. Every
          value maps to a slot in the Foundations sidebar.
        </p>
        <ul className="text-copy-16 text-textSubtle mt-6 space-y-2 max-w-3xl list-disc pl-6">
          <li>
            <strong className="text-textDefault">Padding</strong> —{" "}
            <code className="inline-code">p-6</code> (24 px, Grid &amp;
            Spacing token <code className="inline-code">6</code>)
          </li>
          <li>
            <strong className="text-textDefault">Gap</strong> —{" "}
            <code className="inline-code">gap-4</code> between header and body
            (16 px, Grid &amp; Spacing token{" "}
            <code className="inline-code">4</code>)
          </li>
          <li>
            <strong className="text-textDefault">Radius</strong> —{" "}
            <code className="inline-code">rounded-xl</code> (12 px,{" "}
            <code className="inline-code">material-medium</code>)
          </li>
          <li>
            <strong className="text-textDefault">Surface</strong> —{" "}
            <code className="inline-code">var(--ds-background-100)</code> fill
            with a <code className="inline-code">var(--ds-gray-400)</code>{" "}
            hairline border
          </li>
          <li>
            <strong className="text-textDefault">Title</strong> —{" "}
            <code className="inline-code">text-heading-16</code> (Typography:{" "}
            <em>Small card titles, sidebar headers</em>)
          </li>
        </ul>
      </Section>
    </>
  );
}

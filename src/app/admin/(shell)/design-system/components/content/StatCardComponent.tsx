"use client";

import { Section } from "../ContentWithTOC";
import { CodePreview } from "../CodePreview";
import { StatCard } from "@/components/ui/StatCard";

const basicCode = `import { StatCard } from "@/components/ui/StatCard";

export function Component() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
      }}
    >
      <StatCard label="Total decisions" value="12,481" />
      <StatCard
        label="Unique visitors"
        value="3,927"
        hint="distinct anonymous IDs"
      />
      <StatCard label="Accept all" value="72%" hint="8,986 decisions" />
      <StatCard label="Reject all" value="18%" hint="2,247 decisions" />
    </div>
  );
}`;

const withoutHintCode = `import { StatCard } from "@/components/ui/StatCard";

export function Component() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
      }}
    >
      <StatCard label="Total" value="12,481" />
      <StatCard label="Active" value="3,927" />
      <StatCard label="Errors" value="42" />
    </div>
  );
}`;

export default function StatCardComponent() {
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
        <p className="text-copy-16 text-textSubtle mt-4">
          Stat Card is the dashboard surface for headline numbers — a small
          uppercase label, a prominent value, and an optional secondary hint
          line. Use it in a CSS grid of 3–6 tiles at the top of an admin page
          to give the reader the at-a-glance shape of a dataset (totals,
          percentages, opt-ins) before they dig into the underlying table.
        </p>
      </Section>

      {/* Basic example */}
      <Section>
        <h2
          id="examples"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Examples
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          Every prop is plain text or a React node — no children API. Drop
          the cards into a CSS grid sized to your screen.
        </p>
        <CodePreview componentCode={basicCode}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <StatCard label="Total decisions" value="12,481" />
            <StatCard
              label="Unique visitors"
              value="3,927"
              hint="distinct anonymous IDs"
            />
            <StatCard label="Accept all" value="72%" hint="8,986 decisions" />
            <StatCard label="Reject all" value="18%" hint="2,247 decisions" />
          </div>
        </CodePreview>
      </Section>

      {/* Without hint */}
      <Section>
        <h2
          id="without-hint"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Without hint
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          The <code className="inline-code">hint</code> prop is optional —
          omit it for a tighter card.
        </p>
        <CodePreview componentCode={withoutHintCode}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <StatCard label="Total" value="12,481" />
            <StatCard label="Active" value="3,927" />
            <StatCard label="Errors" value="42" />
          </div>
        </CodePreview>
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
                  <code className="inline-code">label</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">string</code>
                </td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4 text-textSubtle">
                  Uppercase caption rendered above the value
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">value</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">ReactNode</code>
                </td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4 text-textSubtle">
                  The primary stat — typically a number or short string
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">hint</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">ReactNode</code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  Optional secondary line rendered beneath the value
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
        <p className="text-copy-16 text-textSubtle mt-4">
          Stat Card is composed entirely from documented DS tokens — no magic
          numbers. Every value below maps to a slot you can reach from the
          Foundations sidebar.
        </p>
        <ul className="text-copy-16 text-textSubtle mt-6 space-y-2 list-disc pl-6">
          <li>
            <strong className="text-textDefault">Padding</strong> —{" "}
            <code className="inline-code">p-6</code> (24 px, Grid &amp;
            Spacing token <code className="inline-code">6</code>)
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
            <strong className="text-textDefault">Label</strong> —{" "}
            <code className="inline-code">text-label-12</code> with{" "}
            <code className="inline-code">font-medium uppercase tracking-wide</code>
          </li>
          <li>
            <strong className="text-textDefault">Value</strong> —{" "}
            <code className="inline-code">text-heading-32</code>
          </li>
          <li>
            <strong className="text-textDefault">Hint</strong> —{" "}
            <code className="inline-code">text-label-12</code>
          </li>
        </ul>
      </Section>
    </>
  );
}

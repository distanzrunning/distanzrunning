"use client";

import { Section } from "../ContentWithTOC";
import { CodePreview } from "../CodePreview";
import { PanelCard } from "@/components/ui/PanelCard";

const withTitleCode = `import { PanelCard } from "@/components/ui/PanelCard";

export function Component() {
  return (
    <PanelCard title="Recent decisions">
      <p className="text-copy-16 text-textSubtle m-0">
        Panel Card body. The card sits on a hairline-bordered surface
        with 24 px padding and a 12 px radius.
      </p>
    </PanelCard>
  );
}`;

const withActionCode = `import { PanelCard } from "@/components/ui/PanelCard";

export function Component() {
  return (
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
        Optional <code>action</code> renders on the right of the title.
      </p>
    </PanelCard>
  );
}`;

const plainCode = `import { PanelCard } from "@/components/ui/PanelCard";

export function Component() {
  return (
    <PanelCard>
      <p className="text-copy-16 text-textSubtle m-0">
        Title is optional too — drop it for a plain bordered container.
      </p>
    </PanelCard>
  );
}`;

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
        <p className="text-copy-16 text-textSubtle mt-4">
          Panel Card is the generic bordered surface every admin section
          reaches for: an optional h2 title, an optional action on the right
          (a "Clear" link, an "Export" button), and arbitrary body content
          underneath. Use it to group a chart, a table, a form, or a stack of
          paragraphs into a hairline-bordered card.
        </p>
      </Section>

      {/* With title */}
      <Section>
        <h2
          id="with-title"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          With title
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          The most common shape — a section heading on top of the body
          content.
        </p>
        <CodePreview componentCode={withTitleCode}>
          <PanelCard title="Recent decisions">
            <p className="text-copy-16 text-textSubtle m-0">
              Panel Card body. The card sits on a hairline-bordered surface
              with 24 px padding and a 12 px radius.
            </p>
          </PanelCard>
        </CodePreview>
      </Section>

      {/* With action */}
      <Section>
        <h2
          id="with-action"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          With action
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          Pass an <code className="inline-code">action</code> node and it
          renders flush-right of the title — typically a link or button.
        </p>
        <CodePreview componentCode={withActionCode}>
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
        </CodePreview>
      </Section>

      {/* Title-less */}
      <Section>
        <h2
          id="plain"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Title-less
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          Drop the title entirely for a plain bordered container — useful for
          wrapping a single piece of content that already carries its own
          heading.
        </p>
        <CodePreview componentCode={plainCode}>
          <PanelCard>
            <p className="text-copy-16 text-textSubtle m-0">
              Title is optional too — drop it for a plain bordered container.
            </p>
          </PanelCard>
        </CodePreview>
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
          Panel Card uses the same documented foundation as Stat Card. Every
          value maps to a slot in the Foundations sidebar.
        </p>
        <ul className="text-copy-16 text-textSubtle mt-6 space-y-2 list-disc pl-6">
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

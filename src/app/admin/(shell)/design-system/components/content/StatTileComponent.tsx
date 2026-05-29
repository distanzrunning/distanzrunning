"use client";

import { useState } from "react";

import { Section } from "../ContentWithTOC";
import { CodePreview } from "../CodePreview";
import { ComponentRef } from "../ComponentRef";
import { StatTile } from "@/components/ui/StatTile";
import { StatTileGroup } from "@/components/ui/StatTileGroup";

type DemoMetric = "decisions" | "visitors";

// Local stateful demo for the "As a tab row" example. The real
// component uses Next's <Link> via `href` to drive navigation; here
// we intercept the click with anchorProps.onClick + preventDefault
// so the demo reads as a tab swap rather than a page jump.
function TabRowDemo() {
  const [metric, setMetric] = useState<DemoMetric>("decisions");
  const selectMetric =
    (next: DemoMetric) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setMetric(next);
    };
  return (
    <div
      className="divide-x divide-[color:var(--ds-gray-400)]"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        borderBottom: "1px solid var(--ds-gray-400)",
        background: "var(--ds-background-200)",
      }}
    >
      <StatTile
        label="Decisions"
        value="12,481"
        href="#decisions"
        active={metric === "decisions"}
        anchorProps={{ onClick: selectMetric("decisions") }}
      />
      <StatTile
        label="Unique visitors"
        value="3,927"
        href="#visitors"
        active={metric === "visitors"}
        anchorProps={{ onClick: selectMetric("visitors") }}
      />
    </div>
  );
}

const basicCode = `import { StatTile } from "@/components/ui/StatTile";
import { StatTileGroup } from "@/components/ui/StatTileGroup";

export function Component() {
  return (
    <StatTileGroup columns={4}>
      <StatTile label="Total decisions" value="12,481" />
      <StatTile
        label="Unique visitors"
        value="3,927"
        hint="distinct anonymous IDs"
      />
      <StatTile label="Accept all" value="72%" hint="8,986 decisions" />
      <StatTile label="Reject all" value="18%" hint="2,247 decisions" />
    </StatTileGroup>
  );
}`;

const withoutHintCode = `import { StatTile } from "@/components/ui/StatTile";
import { StatTileGroup } from "@/components/ui/StatTileGroup";

export function Component() {
  return (
    <StatTileGroup columns={3}>
      <StatTile label="Total" value="12,481" />
      <StatTile label="Active" value="3,927" />
      <StatTile label="Errors" value="42" />
    </StatTileGroup>
  );
}`;

const changeChipCode = `import { StatTile } from "@/components/ui/StatTile";
import { StatTileGroup } from "@/components/ui/StatTileGroup";

export function Component() {
  return (
    <StatTileGroup columns={3}>
      <StatTile
        label="Decisions"
        value="12,481"
        change={{
          value: "+8.4%",
          direction: "up",
          ariaLabel: "8.4% increase vs last 7 days",
        }}
      />
      <StatTile
        label="Reject rate"
        value="18.2%"
        change={{
          value: "-1.1%",
          direction: "down",
          ariaLabel: "1.1% decrease vs last 7 days",
        }}
      />
      <StatTile
        label="Unique visitors"
        value="3,927"
        change={{ value: "0%", direction: "flat", ariaLabel: "No change" }}
      />
    </StatTileGroup>
  );
}`;

const tabRowCode = `import { StatTile } from "@/components/ui/StatTile";

// Tile row that doubles as tabs — each tile is an <a> via \`href\`,
// the selected one gets \`active\`. Wired to the trend chart below
// so clicking a tile swaps which metric the chart shows. The active
// tile carries a black bottom rule (the canonical "selected tab"
// treatment).
//
// Unlike the standalone group, this row hand-rolls the grid + bottom
// border because the tab row needs to sit flush with the chart that
// follows (no rounded bottom corners).
export function Component({
  metric,
  buildHref,
}: {
  metric: 'decisions' | 'visitors';
  buildHref: (m: 'decisions' | 'visitors') => string;
}) {
  return (
    <div
      className="divide-x divide-[color:var(--ds-gray-400)]"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        borderBottom: "1px solid var(--ds-gray-400)",
        background: "var(--ds-background-200)",
      }}
    >
      <StatTile
        label="Decisions"
        value="12,481"
        href={buildHref('decisions')}
        active={metric === 'decisions'}
      />
      <StatTile
        label="Unique visitors"
        value="3,927"
        href={buildHref('visitors')}
        active={metric === 'visitors'}
      />
    </div>
  );
}`;

export default function StatTileComponent() {
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
          Stat Tile is the dashboard surface for headline numbers — a
          small column header, a prominent value, and an optional hint
          line. Use it in a{" "}
          <ComponentRef name="Stat Tile Group" slug="stat-tile" /> for
          the &quot;connected row&quot; look (rounded outer border,
          hairline internal dividers), or stand alone where a single
          tile makes sense. With <code className="inline-code">href</code>{" "}
          + <code className="inline-code">active</code> it doubles as a
          clickable tab — the consent dashboard uses this so a tile
          click swaps which metric the trend chart shows below.
        </p>
      </Section>

      {/* Basic */}
      <Section>
        <h2
          id="examples"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Standalone (in a group)
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          Standalone tiles are unbordered cells —{" "}
          <ComponentRef name="Stat Tile Group" slug="stat-tile" />{" "}
          supplies the rounded outer border and the hairline dividers
          between cells. The group lays children out in a fixed{" "}
          <code className="inline-code">columns</code> grid; wrap it in
          an <code className="inline-code">overflow-x: auto</code>{" "}
          container if the row should scroll on narrow widths.
        </p>
        <CodePreview componentCode={basicCode}>
          <StatTileGroup columns={4}>
            <StatTile label="Total decisions" value="12,481" />
            <StatTile
              label="Unique visitors"
              value="3,927"
              hint="distinct anonymous IDs"
            />
            <StatTile label="Accept all" value="72%" hint="8,986 decisions" />
            <StatTile label="Reject all" value="18%" hint="2,247 decisions" />
          </StatTileGroup>
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
          The <code className="inline-code">hint</code> prop is optional
          — omit it for a tighter tile.
        </p>
        <CodePreview componentCode={withoutHintCode}>
          <StatTileGroup columns={3}>
            <StatTile label="Total" value="12,481" />
            <StatTile label="Active" value="3,927" />
            <StatTile label="Errors" value="42" />
          </StatTileGroup>
        </CodePreview>
      </Section>

      {/* Change chip */}
      <Section>
        <h2
          id="change-chip"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          With change chip
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          The <code className="inline-code">change</code> prop renders a
          trend pill anchored to the bottom-right of the tile — green
          for <em>up</em>, red for <em>down</em>, gray for{" "}
          <em>flat</em>. The pill is a real button with its own focus
          ring and hover <ComponentRef name="Tooltip" /> sourced from{" "}
          <code className="inline-code">ariaLabel</code>; clicking it
          doesn&apos;t fire the parent tile&apos;s link.
        </p>
        <CodePreview componentCode={changeChipCode}>
          <StatTileGroup columns={3}>
            <StatTile
              label="Decisions"
              value="12,481"
              change={{
                value: "+8.4%",
                direction: "up",
                ariaLabel: "8.4% increase vs last 7 days",
              }}
            />
            <StatTile
              label="Reject rate"
              value="18.2%"
              change={{
                value: "-1.1%",
                direction: "down",
                ariaLabel: "1.1% decrease vs last 7 days",
              }}
            />
            <StatTile
              label="Unique visitors"
              value="3,927"
              change={{
                value: "0%",
                direction: "flat",
                ariaLabel: "No change",
              }}
            />
          </StatTileGroup>
        </CodePreview>
      </Section>

      {/* Tab row */}
      <Section>
        <h2
          id="tab-row"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          As a tab row
        </h2>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          Pass <code className="inline-code">href</code> and the tile
          renders as a Next.js{" "}
          <code className="inline-code">&lt;Link&gt;</code> — inactive
          tabs sit transparent on the row&apos;s background; the{" "}
          <code className="inline-code">active</code> tile pops to{" "}
          <code className="inline-code">--ds-background-100</code> with
          a 2 px black bottom rule (canonical &quot;selected tab&quot;).
          Use this pattern when the tile row sits flush above a chart
          or detail surface — the URL change feeds the next render of
          the surface below.
        </p>
        <CodePreview componentCode={tabRowCode}>
          <TabRowDemo />
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

        <h3 className="text-heading-16 text-textDefault mt-8 mb-4">
          StatTile
        </h3>
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
                  Small column header rendered above the value
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
                  The primary stat — typically a number or short string.
                  Wrap in <ComponentRef name="Number Ticker" /> to tween
                  between values.
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
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">change</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">StatTileChange</code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  Trend pill anchored bottom-right —{" "}
                  <code className="inline-code">value</code>,{" "}
                  <code className="inline-code">direction</code>{" "}
                  (<em>up</em> / <em>down</em> / <em>flat</em>),
                  optional <code className="inline-code">ariaLabel</code>{" "}
                  for the hover tooltip
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">href</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">string</code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  When set, the tile renders as a Next.js{" "}
                  <code className="inline-code">&lt;Link&gt;</code> and
                  acts as a clickable tab
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">active</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">boolean</code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  Marks the selected tab — pairs with{" "}
                  <code className="inline-code">href</code>. Drives the
                  2 px black bottom rule.
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">anchorProps</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">
                    AnchorHTMLAttributes
                  </code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  Forwarded to the underlying{" "}
                  <code className="inline-code">&lt;a&gt;</code> for
                  analytics, rel, target
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-heading-16 text-textDefault mt-8 mb-4">
          StatTileGroup
        </h3>
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
                  <code className="inline-code">children</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">ReactNode</code>
                </td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4 text-textSubtle">
                  <code className="inline-code">StatTile</code> children
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">
                  <code className="inline-code">columns</code>
                </td>
                <td className="py-3 px-4">
                  <code className="inline-code">number</code>
                </td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-textSubtle">
                  Tiles per row. Defaults to the number of children
                  (single row).
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
          Stat Tile is composed entirely from documented DS tokens — no
          magic numbers. Every value below maps to a slot you can reach
          from the Foundations sidebar.
        </p>
        <ul className="text-copy-16 text-textSubtle mt-6 space-y-2 list-disc pl-6">
          <li>
            <strong className="text-textDefault">Padding</strong> —{" "}
            <code className="inline-code">p-4</code> (16 px, Grid &amp;
            Spacing token <code className="inline-code">4</code>)
          </li>
          <li>
            <strong className="text-textDefault">Group radius</strong>{" "}
            — 12 px (
            <code className="inline-code">material-medium</code>)
          </li>
          <li>
            <strong className="text-textDefault">Group surface</strong>{" "}
            — <code className="inline-code">var(--ds-background-100)</code>{" "}
            with a <code className="inline-code">var(--ds-gray-400)</code>{" "}
            hairline border and internal dividers
          </li>
          <li>
            <strong className="text-textDefault">Tab inactive bg</strong>{" "}
            — <code className="inline-code">transparent</code>{" "}
            (parent paints{" "}
            <code className="inline-code">--ds-background-200</code>);{" "}
            label + value at <code className="inline-code">opacity: 0.8</code>
          </li>
          <li>
            <strong className="text-textDefault">Tab active bg</strong>{" "}
            — <code className="inline-code">var(--ds-background-100)</code>{" "}
            with a 2 px{" "}
            <code className="inline-code">var(--ds-gray-1000)</code>{" "}
            bottom rule
          </li>
          <li>
            <strong className="text-textDefault">Label</strong> —{" "}
            <code className="inline-code">text-heading-14</code>{" "}
            (gray-900)
          </li>
          <li>
            <strong className="text-textDefault">Value</strong> —{" "}
            <code className="inline-code">text-heading-32</code>{" "}
            (gray-1000)
          </li>
          <li>
            <strong className="text-textDefault">Hint</strong> —{" "}
            <code className="inline-code">text-copy-13</code> (gray-700)
          </li>
          <li>
            <strong className="text-textDefault">Change chip</strong> —{" "}
            12 px Geist, font-weight 600, 6 px radius;{" "}
            <code className="inline-code">rgba(hue-900-rgb, 0.2)</code>{" "}
            background bumping to{" "}
            <code className="inline-code">0.5</code> on focus via a CSS
            custom property (no JS state)
          </li>
        </ul>
      </Section>
    </>
  );
}

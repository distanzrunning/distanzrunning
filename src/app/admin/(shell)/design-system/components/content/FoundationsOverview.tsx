"use client";

import {
  LayoutGrid,
  ExternalLink,
  BarChart3,
  Clock,
  Globe,
  Package,
  Shield,
  Inbox,
  PenLine,
  FileText,
  Bell,
  Hexagon,
  Flag,
  Save,
  GitBranch,
  Puzzle,
  SlidersHorizontal,
  Folder,
  Database,
  Key,
  Paperclip,
  TrendingUp,
  Code2,
  Settings,
  UserPlus,
  List,
} from "lucide-react";
import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { Snippet } from "@/components/ui/Snippet";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";

// React 18.2's JSX types predate the `inert` attribute; pass it as a raw
// DOM attribute. Applied to decorative preview wrappers so their real,
// interactive child components can't be focused or clicked — the card's
// overlay link owns all interaction.
const inertProps = { inert: "" } as unknown as React.HTMLAttributes<HTMLDivElement>;

interface OverviewCardProps {
  href: string;
  title: string;
  description: string;
  children: React.ReactNode;
  /** Position in the grid: even index = left column, odd = right column */
  index: number;
  /** Total number of cards */
  total: number;
}

function OverviewCard({
  href,
  title,
  description,
  children,
  index,
  total,
}: OverviewCardProps) {
  const isLeftColumn = index % 2 === 0;
  const isLastCard = index === total - 1;
  const isSecondLastCard = index === total - 2;

  // Card-with-overlay-link pattern (see CLAUDE.md): the card is a <div> so the
  // preview can contain real, interactive DS components without nesting them
  // inside an <a> (invalid HTML). A positioned <a> overlay owns navigation and
  // spans the whole card; the preview is `inert` so it stays decorative.
  return (
    <div
      className={`group relative flex h-full flex-col gap-6 p-8 hover:bg-surface ${isLeftColumn ? "md:border-r" : ""} ${isLastCard ? "border-b-0" : "border-b"} ${isSecondLastCard ? "md:border-b-0" : ""}`}
      style={{
        backgroundClip: "padding-box",
        borderColor: "var(--ds-gray-alpha-400)",
      }}
    >
      <div className="flex-1" {...inertProps}>
        {children}
      </div>
      <div className="mt-auto">
        <p className="text-heading-16 font-semibold" style={{ color: "hsl(var(--color-textDefault))" }}>
          {title}
        </p>
        <p className="text-copy-16" style={{ color: "hsl(var(--color-textSubtle))" }}>
          {description}
        </p>
      </div>
      {/* Overlay link — spans the card, `peer` so the focus ring tracks its
          keyboard focus. */}
      <Link
        href={href}
        aria-label={title}
        className="peer absolute inset-0 z-10 cursor-pointer rounded-[inherit] no-underline outline-none"
      />
      {/* Focus ring — keyboard focus only (peer-focus-visible). */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 peer-focus-visible:opacity-100"
        style={{ border: "2px solid var(--ds-blue-700)" }}
      />
    </div>
  );
}

function BrandPreview() {
  const guideColor = "var(--ds-gray-alpha-400)";
  const guideStyle: React.CSSProperties = {
    position: "absolute",
    borderColor: guideColor,
    borderStyle: "dashed",
  };

  return (
    <div className="relative mx-auto w-full" style={{ height: 96 }}>
      {/* Logo — inline SVG (Wordmark uses fill="currentColor")
          so there's no network round-trip on first paint and
          the brand preview renders the moment React mounts.
          The gray-700 text colour matches the previous
          wordmark-gray.svg tint. */}
      <Wordmark
        aria-label="Distanz Running"
        className="relative z-10 mx-auto block text-textSubtler"
        style={{ height: 96, width: "auto" }}
      />
      {/* Horizontal guide lines */}
      <div style={{ ...guideStyle, top: 0, left: 0, right: 0, borderTopWidth: 1 }} />
      <div style={{ ...guideStyle, top: "26%", left: 0, right: 0, borderTopWidth: 1 }} />
      <div style={{ ...guideStyle, top: "50%", left: 0, right: 0, borderTopWidth: 1 }} />
      <div style={{ ...guideStyle, top: "74%", left: 0, right: 0, borderTopWidth: 1 }} />
      <div style={{ ...guideStyle, bottom: 0, left: 0, right: 0, borderBottomWidth: 1 }} />
      {/* Vertical guide lines */}
      <div style={{ ...guideStyle, top: 0, bottom: 0, left: "10%", borderLeftWidth: 1 }} />
      <div style={{ ...guideStyle, top: 0, bottom: 0, left: "30%", borderLeftWidth: 1 }} />
      <div style={{ ...guideStyle, top: 0, bottom: 0, right: "10%", borderRightWidth: 1 }} />
      {/* Diagonal guide lines through icon area */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
      >
        <line x1="10%" y1="0%" x2="38%" y2="100%" stroke={guideColor} strokeWidth="1" strokeDasharray="4 4" />
        <line x1="38%" y1="0%" x2="10%" y2="100%" stroke={guideColor} strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

function IconsPreview() {
  const iconRows = [
    [LayoutGrid, ExternalLink, BarChart3, Clock, Globe, Package, Shield, Hexagon],
    [Inbox, PenLine, FileText, Bell, Flag, Save, GitBranch, Puzzle],
    [SlidersHorizontal, Folder, Database, Key, Paperclip, TrendingUp, Code2, Settings],
  ];

  return (
    <div className="flex flex-col gap-7">
      {iconRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-between">
          {row.map((Icon, iconIndex) => (
            <span
              key={iconIndex}
              className="ds-overview-icon"
              style={{
                transitionDelay: `${rowIndex * 20}ms`,
                transitionProperty: "color",
                transitionDuration: "200ms",
              }}
            >
              <Icon size={16} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function ComponentsPreview() {
  // Real DS primitives (the card's overlay link + `inert` wrapper keep them
  // decorative). Mirrors Geist's "Components" card, which also composes its
  // real Snippet / Button / Switch / Input.
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-[214px] md:w-[246px]">
        <Snippet text="npx create-next-app" width="100%" />
      </div>

      <Button variant="secondary" prefixIcon={<UserPlus size={16} />}>
        Collaborate
      </Button>

      <Button variant="secondary" shape="square" aria-label="Shield">
        <Shield size={16} />
      </Button>

      <Switch
        defaultValue="source"
        options={[
          { value: "source", icon: <LayoutGrid size={16} />, ariaLabel: "Source" },
          { value: "output", icon: <List size={16} />, ariaLabel: "Output" },
        ]}
      />

      <div className="w-[200px] md:w-[234px]">
        <Input prefix="Label" placeholder="Value" className="w-full" />
      </div>
    </div>
  );
}

function ColoursPreview() {
  const colors = [
    "var(--ds-gray-800)",
    "var(--ds-blue-800)",
    "var(--ds-purple-700)",
    "var(--ds-pink-800)",
    "var(--ds-red-800)",
    "var(--ds-amber-800)",
    "var(--ds-green-800)",
    "var(--ds-teal-800)",
  ];

  return (
    <div className="flex justify-between">
      {colors.map((color, i) => (
        <div
          key={i}
          className="flex items-center justify-center overflow-hidden rounded-full"
          style={{
            height: 96,
            width: 32,
            border: "1px solid var(--ds-gray-alpha-400)",
            background: "hsl(var(--color-canvas))",
          }}
        >
          <div
            className="rounded-full"
            style={{
              height: 72,
              width: 8,
              background: color,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function GridCross({ style }: { style: React.CSSProperties }) {
  const crossSize = 21;
  const halfSize = 11;
  const guideColor = "hsl(var(--color-textSubtler))";

  return (
    <div
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 2,
        ...style,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          width: halfSize,
          height: crossSize,
          borderRight: `1px solid ${guideColor}`,
          top: -halfSize,
          left: -halfSize,
        }}
      />
      {/* Horizontal line */}
      <div
        style={{
          position: "absolute",
          width: crossSize,
          height: halfSize,
          borderBottom: `1px solid ${guideColor}`,
          top: -halfSize,
          left: -halfSize,
        }}
      />
    </div>
  );
}

function GridPreview() {
  const cols = 9;
  const rows = 2;
  const guideColor = "hsl(var(--color-borderDefault))";

  return (
    <div className="w-full" style={{ position: "relative" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          aspectRatio: `${cols}/${rows}`,
          position: "relative",
          border: `1px solid ${guideColor}`,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const isLastCol = col === cols - 1;
          const isLastRow = row === rows - 1;

          return (
            <div
              key={i}
              style={{
                borderRight: isLastCol ? "none" : `1px solid ${guideColor}`,
                borderBottom: isLastRow ? "none" : `1px solid ${guideColor}`,
              }}
            />
          );
        })}

        {/* Cross marker — top left */}
        <GridCross style={{ top: 0, left: 0 }} />
        {/* Cross marker — bottom right */}
        <GridCross style={{ bottom: 0, right: 0 }} />
      </div>
    </div>
  );
}

function TypefacePreview() {
  return (
    <div
      className="relative grid h-20 grow grid-cols-2 place-items-center rounded-sm"
      style={{
        border: "1px dashed var(--ds-gray-400)",
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          borderRight: "1px dashed var(--ds-gray-400)",
        }}
      >
        <p className="text-heading-24 text-center" style={{ fontFamily: "var(--font-family-sans)", color: "hsl(var(--color-textSubtler))" }}>
          Geist
        </p>
      </div>
      <p
        className="text-heading-24 text-center"
        style={{ fontFamily: "var(--font-family-serif)", color: "hsl(var(--color-textSubtler))" }}
      >
        EB Garamond
      </p>
    </div>
  );
}

interface FoundationsOverviewProps {
}

export default function FoundationsOverview({}: FoundationsOverviewProps) {
  return (
    <div>
      {/* Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ borderBottom: "1px solid var(--ds-gray-alpha-400)" }}
      >
        <OverviewCard
          href="/admin/design-system/distanz-running"
          title="Brand Assets"
          description="Learn how to work with our brand assets."
          index={0}
          total={6}
        >
          <BrandPreview />
        </OverviewCard>

        <OverviewCard
          href="/admin/design-system/icons"
          title="Icons"
          description="Icon set tailored for running products."
          index={1}
          total={6}
        >
          <IconsPreview />
        </OverviewCard>

        <OverviewCard
          href="/admin/design-system/avatar"
          title="Components"
          description="Building blocks for React applications."
          index={2}
          total={6}
        >
          <ComponentsPreview />
        </OverviewCard>

        <OverviewCard
          href="/admin/design-system/colours"
          title="Colours"
          description="A high contrast, accessible color system."
          index={3}
          total={6}
        >
          <ColoursPreview />
        </OverviewCard>

        <OverviewCard
          href="/admin/design-system/grid"
          title="Grid"
          description="A huge part of the new Distanz aesthetic."
          index={4}
          total={6}
        >
          <GridPreview />
        </OverviewCard>

        <OverviewCard
          href="/admin/design-system/typography"
          title="Typeface"
          description="Specifically designed for developers and designers."
          index={5}
          total={6}
        >
          <TypefacePreview />
        </OverviewCard>
      </div>
    </div>
  );
}

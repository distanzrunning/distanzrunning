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
} from "lucide-react";

interface OverviewCardProps {
  href: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onNavigate: (slug: string) => void;
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
  onNavigate,
  index,
  total,
}: OverviewCardProps) {
  const slug = href.replace("/design-system/", "");
  const isLeftColumn = index % 2 === 0;
  const isLastCard = index === total - 1;
  const isSecondLastCard = index === total - 2;

  return (
    <a
      className={`group relative flex h-full flex-col gap-6 p-8 no-underline cursor-pointer hover:bg-[var(--ds-background-100)] ${isLeftColumn ? "md:border-r" : ""} ${isLastCard ? "border-b-0" : "border-b"} ${isSecondLastCard ? "md:border-b-0" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(slug);
      }}
      style={{
        backgroundClip: "padding-box",
        borderColor: "var(--ds-gray-alpha-400)",
      }}
    >
      <div className="flex-1">{children}</div>
      <div className="mt-auto">
        <p className="text-heading-16 font-semibold" style={{ color: "var(--ds-gray-1000)" }}>
          {title}
        </p>
        <p className="text-copy-16" style={{ color: "var(--ds-gray-900)" }}>
          {description}
        </p>
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-focus-visible:opacity-100"
        style={{ border: "2px solid var(--ds-blue-700)" }}
      />
    </a>
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
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Distanz_Logo_1600_600_Gray.svg"
        alt="Distanz Running"
        className="relative z-10"
        style={{ height: 96, width: "auto", objectFit: "contain", margin: "0 auto", display: "block" }}
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
  return (
    <div className="pointer-events-none flex flex-wrap gap-4">
      {/* Snippet */}
      <div
        className="-mt-px w-[214px] md:w-[246px]"
        style={{
          height: "auto",
          border: "1px solid var(--ds-gray-alpha-400)",
          borderRadius: 6,
          padding: "8px 12px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 14,
          color: "var(--ds-gray-700)",
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden" }}>npx create-next-app</pre>
      </div>
      {/* Button */}
      <button
        style={{
          border: "1px solid var(--ds-gray-alpha-400)",
          borderRadius: 6,
          padding: "6px 12px",
          fontSize: 14,
          color: "var(--ds-gray-700)",
          background: "transparent",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Globe size={16} />
        <span>Collaborate</span>
      </button>
      {/* Toggle-like switch */}
      <div
        style={{
          display: "inline-flex",
          border: "1px solid var(--ds-gray-alpha-400)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "6px 10px",
            background: "var(--ds-gray-100)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <LayoutGrid size={16} style={{ color: "var(--ds-gray-1000)" }} />
        </div>
        <div
          style={{
            padding: "6px 10px",
            borderLeft: "1px solid var(--ds-gray-alpha-400)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <BarChart3 size={16} style={{ color: "var(--ds-gray-700)" }} />
        </div>
      </div>
      {/* Input */}
      <div className="w-[200px] md:w-[234px]">
        <div
          style={{
            border: "1px solid var(--ds-gray-alpha-400)",
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 14,
            color: "var(--ds-gray-700)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--ds-gray-900)", fontSize: 13 }}>Label</span>
          <span style={{ color: "var(--ds-gray-600)" }}>Value</span>
        </div>
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
            background: "var(--ds-background-200)",
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

function GridPreview() {
  return (
    <div
      className="w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        aspectRatio: "9/2",
      }}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          style={{
            borderRight: i % 9 !== 8 ? "1px solid var(--ds-gray-alpha-400)" : "none",
            borderBottom: i < 9 ? "1px solid var(--ds-gray-alpha-400)" : "none",
          }}
        />
      ))}
    </div>
  );
}

function TypefacePreview() {
  return (
    <div
      className="relative grid h-20 grow grid-cols-2 place-items-center rounded-sm"
      style={{
        border: "1px dashed var(--ds-gray-alpha-400)",
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          borderRight: "1px dashed var(--ds-gray-alpha-400)",
        }}
      >
        <p className="text-heading-24 text-center" style={{ color: "var(--ds-gray-700)" }}>
          Geist Sans
        </p>
      </div>
      <p
        className="text-heading-24 text-center"
        style={{ fontFamily: "var(--font-geist-mono)", color: "var(--ds-gray-700)" }}
      >
        Geist Mono
      </p>
    </div>
  );
}

interface FoundationsOverviewProps {
  onNavigate?: (slug: string) => void;
}

export default function FoundationsOverview({ onNavigate }: FoundationsOverviewProps) {
  const handleNavigate = onNavigate || (() => {});

  return (
    <div>
      {/* Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ borderBottom: "1px solid var(--ds-gray-400)" }}
      >
        <OverviewCard
          href="/design-system/colours"
          title="Brand Assets"
          description="Learn how to work with our brand assets."
          onNavigate={handleNavigate}
          index={0}
          total={6}
        >
          <BrandPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/icons"
          title="Icons"
          description="Icon set tailored for running products."
          onNavigate={handleNavigate}
          index={1}
          total={6}
        >
          <IconsPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/avatar"
          title="Components"
          description="Building blocks for React applications."
          onNavigate={handleNavigate}
          index={2}
          total={6}
        >
          <ComponentsPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/colours"
          title="Colours"
          description="A high contrast, accessible color system."
          onNavigate={handleNavigate}
          index={3}
          total={6}
        >
          <ColoursPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/grid"
          title="Grid"
          description="A huge part of the new Distanz aesthetic."
          onNavigate={handleNavigate}
          index={4}
          total={6}
        >
          <GridPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/typography"
          title="Typeface"
          description="Specifically designed for developers and designers."
          onNavigate={handleNavigate}
          index={5}
          total={6}
        >
          <TypefacePreview />
        </OverviewCard>
      </div>
    </div>
  );
}

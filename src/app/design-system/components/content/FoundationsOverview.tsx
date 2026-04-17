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
        src="/brand/wordmark-gray.svg"
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
  const boxBorder = "var(--ds-gray-alpha-400) 0px 0px 0px 1px";

  return (
    <div className="pointer-events-none flex flex-wrap gap-4">
      {/* Snippet with prompt style */}
      <div
        className="-mt-px w-[214px] md:w-[246px]"
        style={{
          height: 42,
          background: "var(--ds-background-100)",
          boxShadow: boxBorder,
          borderRadius: 6,
          padding: "10px 48px 10px 12px",
          position: "relative",
          color: "var(--ds-gray-700)",
        }}
      >
        <pre
          style={{
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13,
            lineHeight: "20px",
          }}
        >
          npx create-next-app
        </pre>
        {/* Copy icon */}
        <div
          style={{
            position: "absolute",
            right: 4,
            top: "50%",
            transform: "translateY(-50%)",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ds-gray-700)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z" />
          </svg>
        </div>
      </div>

      {/* Button with icon prefix — "Collaborate" */}
      <div
        style={{
          height: 40,
          background: "var(--ds-background-100)",
          boxShadow: boxBorder,
          borderRadius: 6,
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "20px",
          color: "var(--ds-gray-700)",
        }}
      >
        {/* User plus icon */}
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, minWidth: 20, marginRight: 2 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.75 0C3.95507 0 2.5 1.45507 2.5 3.25V3.75C2.5 5.54493 3.95507 7 5.75 7H6.25C8.04493 7 9.5 5.54493 9.5 3.75V3.25C9.5 1.45507 8.04493 0 6.25 0H5.75ZM4 3.25C4 2.2835 4.7835 1.5 5.75 1.5H6.25C7.2165 1.5 8 2.2835 8 3.25V3.75C8 4.7165 7.2165 5.5 6.25 5.5H5.75C4.7835 5.5 4 4.7165 4 3.75V3.25ZM12.25 7.25V9H13.75V7.25H15.5V5.75H13.75V4H12.25V5.75H10.5V7.25H12.25ZM1.5 13.1709V14.5H10.5V13.1709C9.68042 11.5377 8.00692 10.5 6.17055 10.5H5.82945C3.99308 10.5 2.31958 11.5377 1.5 13.1709ZM0.0690305 12.6857C1.10604 10.4388 3.35483 9 5.82945 9H6.17055C8.64517 9 10.894 10.4388 11.931 12.6857L12 12.8353V13V15.25V16H11.25H0.75H0V15.25V13V12.8353L0.0690305 12.6857Z" />
          </svg>
        </span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 6px" }}>Collaborate</span>
      </div>

      {/* Shield icon button — square */}
      <div
        style={{
          width: 40,
          height: 40,
          background: "var(--ds-background-100)",
          boxShadow: boxBorder,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ds-gray-700)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <path d="M11.25 4.25V3.5C9.35033 2.86678 6 2.58921 6 0C6 2.58921 2.64967 2.86678 0.75 3.5V9.52717C0.75 11.2011 1.67915 12.7367 3.16197 13.5134L4.5 14.2143" strokeWidth="1.5" strokeLinecap="square" />
          <circle cx="11.5" cy="11.5" r="3.875" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 11.5H15.25" strokeLinejoin="bevel" />
          <path d="M10.75 15V15C10.0964 12.7124 10.0964 10.2876 10.75 8V8" strokeLinejoin="bevel" />
          <path d="M12.25 15V15C12.9036 12.7124 12.9036 10.2876 12.25 8V8" strokeLinejoin="bevel" />
        </svg>
      </div>

      {/* Switch control — two segments */}
      <div
        style={{
          height: 40,
          background: "var(--ds-background-100)",
          boxShadow: boxBorder,
          borderRadius: 6,
          display: "inline-flex",
          alignItems: "stretch",
          padding: 4,
          gap: 0,
        }}
      >
        {/* Active segment */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 12px",
            borderRadius: 2,
            background: "var(--ds-gray-100)",
            color: "var(--ds-gray-700)",
          }}
        >
          <LayoutGrid size={16} />
        </div>
        {/* Inactive segment */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 12px",
            borderRadius: 2,
            color: "var(--ds-gray-700)",
          }}
        >
          <BarChart3 size={16} />
        </div>
      </div>

      {/* Input with label prefix */}
      <div className="w-[200px] md:w-[234px]">
        <div
          style={{
            height: 40,
            boxShadow: boxBorder,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            fontSize: 14,
            overflow: "hidden",
          }}
        >
          {/* Label prefix */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
              height: 40,
              flexShrink: 0,
              background: "var(--ds-background-100)",
              color: "var(--ds-gray-700)",
              borderRight: "1px solid var(--ds-gray-alpha-400)",
            }}
          >
            Label
          </div>
          {/* Input area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              height: 40,
              flex: 1,
              minWidth: 0,
              background: "var(--ds-background-100)",
              color: "var(--ds-gray-600)",
            }}
          >
            Value
          </div>
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

function GridCross({ style }: { style: React.CSSProperties }) {
  const crossSize = 21;
  const halfSize = 11;
  const guideColor = "var(--ds-gray-700)";

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
  const guideColor = "var(--ds-gray-400)";

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
        border: "1px dashed var(--ds-gray-alpha-400)",
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          borderRight: "1px dashed var(--ds-gray-alpha-400)",
        }}
      >
        <p className="text-heading-24 text-center" style={{ fontFamily: "var(--font-family-sans)", color: "var(--ds-gray-700)" }}>
          Inter
        </p>
      </div>
      <p
        className="text-heading-24 text-center"
        style={{ fontFamily: "var(--font-family-serif)", color: "var(--ds-gray-700)" }}
      >
        EB Garamond
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
          href="/design-system/distanz-running"
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

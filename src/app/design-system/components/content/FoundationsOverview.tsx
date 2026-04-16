"use client";

import Image from "next/image";
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
}

function OverviewCard({
  href,
  title,
  description,
  children,
  onNavigate,
}: OverviewCardProps) {
  const slug = href.replace("/design-system/", "");

  return (
    <a
      className="group relative flex h-full flex-col gap-6 p-8 no-underline cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        onNavigate(slug);
      }}
      style={{
        backgroundClip: "padding-box",
        border: "1px solid var(--ds-gray-alpha-400)",
        transition: "border-color 200ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--ds-gray-900)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--ds-gray-alpha-400)";
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
  return (
    <div className="relative mx-auto w-fit flex items-center justify-center" style={{ height: 96 }}>
      <Image
        src="/images/distanz_icon_black.png"
        alt="Distanz Running"
        width={120}
        height={80}
        className="dark:hidden"
        style={{ objectFit: "contain" }}
      />
      <Image
        src="/images/distanz_icon_white.png"
        alt="Distanz Running"
        width={120}
        height={80}
        className="hidden dark:block"
        style={{ objectFit: "contain" }}
      />
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
    <div className="flex flex-col gap-7" style={{ color: "var(--ds-gray-900)" }}>
      {iconRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-between">
          {row.map((Icon, iconIndex) => (
            <span
              key={iconIndex}
              className="group-hover:text-gray-1000 transition-colors"
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
      {/* Title Section */}
      <div style={{ padding: "48px 32px 32px" }}>
        <h1 className="text-heading-24 md:text-heading-40 font-semibold mb-3" style={{ color: "var(--ds-gray-1000)" }}>
          Stride Design System
        </h1>
        <p className="text-copy-16 md:text-copy-20" style={{ color: "var(--ds-gray-900)", lineHeight: 1.5 }}>
          Distanz Running&apos;s design system for building consistent web experiences.
        </p>
      </div>

      {/* Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{
          borderTop: "1px solid var(--ds-gray-alpha-400)",
        }}
      >
        <OverviewCard
          href="/design-system/colours"
          title="Brand Assets"
          description="Learn how to work with our brand assets."
          onNavigate={handleNavigate}
        >
          <BrandPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/icons"
          title="Icons"
          description="Icon set tailored for running products."
          onNavigate={handleNavigate}
        >
          <IconsPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/avatar"
          title="Components"
          description="Building blocks for React applications."
          onNavigate={handleNavigate}
        >
          <ComponentsPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/colours"
          title="Colours"
          description="A high contrast, accessible color system."
          onNavigate={handleNavigate}
        >
          <ColoursPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/grid"
          title="Grid"
          description="A huge part of the new Distanz aesthetic."
          onNavigate={handleNavigate}
        >
          <GridPreview />
        </OverviewCard>

        <OverviewCard
          href="/design-system/typography"
          title="Typeface"
          description="Specifically designed for developers and designers."
          onNavigate={handleNavigate}
        >
          <TypefacePreview />
        </OverviewCard>
      </div>
    </div>
  );
}

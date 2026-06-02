"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Check,
  MousePointer,
  CircleDollarSign,
  ChartPie,
  ChartNoAxesColumn,
  Star,
  Bell,
  CircleCheck,
} from "lucide-react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Section } from "../ContentWithTOC";
import { useToast } from "@/components/ui/Toast";

// Link icon for section headers (matches Geist)
function LinkIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 14, height: 14, color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.46968 1.46968C10.1433 -0.203925 12.8567 -0.203923 14.5303 1.46968C16.2039 3.14329 16.2039 5.85674 14.5303 7.53034L12.0303 10.0303L10.9697 8.96968L13.4697 6.46968C14.5575 5.38186 14.5575 3.61816 13.4697 2.53034C12.3819 1.44252 10.6182 1.44252 9.53034 2.53034L7.03034 5.03034L5.96968 3.96968L8.46968 1.46968ZM11.5303 5.53034L5.53034 11.5303L4.46968 10.4697L10.4697 4.46968L11.5303 5.53034ZM1.46968 14.5303C3.14329 16.2039 5.85673 16.204 7.53034 14.5303L10.0303 12.0303L8.96968 10.9697L6.46968 13.4697C5.38186 14.5575 3.61816 14.5575 2.53034 13.4697C1.44252 12.3819 1.44252 10.6182 2.53034 9.53034L5.03034 7.03034L3.96968 5.96968L1.46968 8.46968C-0.203923 10.1433 -0.203925 12.8567 1.46968 14.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Header height and section padding constants (must match ContentWithTOC)
const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

// Section header with link icon on hover (matches Geist)
function SectionHeader({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { showToast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Copy URL with hash to clipboard
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    showToast("Copied link to clipboard");

    // Update URL
    window.history.pushState(null, "", `#${id}`);

    // Scroll to correct position (accounting for header and padding)
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const scrollTarget = absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;

      window.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit text-left cursor-pointer bg-transparent border-none"
      id={id}
    >
      <h2 className="text-heading-24 text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

// Normalise a resolved CSS color (from getComputedStyle) for display/copy.
// Opaque rgb() → hex; translucent rgba() and any modern color function
// (oklch(), color(srgb …)) pass through verbatim. Keeps the displayed
// value honest to what the browser actually rendered.
function formatColor(value: string): string {
  const m = value.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    const [r, g, b, a] = parts;
    if (a !== undefined && a < 1) return `rgba(${r}, ${g}, ${b}, ${a})`;
    const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
    return `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
  }
  return value;
}

// Color swatch with context menu (matches Geist).
// The swatch paints straight from the CSS variable, and its displayed /
// copied value is read back from the rendered element via getComputedStyle —
// so the page is always truthful to distanz-tokens.css and can never drift.
// `themeKey` flips with light/dark so the resolved value re-reads on toggle.
function ColorSwatch({
  cssVar,
  themeKey,
}: {
  cssVar: string;
  themeKey: boolean;
}) {
  const { showToast } = useToast();
  const [showTick, setShowTick] = useState(false);
  const [resolved, setResolved] = useState("");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      setResolved(formatColor(getComputedStyle(ref.current).backgroundColor));
    }
  }, [cssVar, themeKey]);

  const flash = useCallback(() => {
    setShowTick(true);
    setTimeout(() => setShowTick(false), 600);
  }, []);

  const handleCopyToken = useCallback(() => {
    navigator.clipboard.writeText(`var(${cssVar})`);
    showToast(`Copied var(${cssVar})`);
    flash();
  }, [cssVar, showToast, flash]);

  const handleCopyValue = useCallback(() => {
    navigator.clipboard.writeText(resolved);
    showToast(`Copied ${resolved}`);
    flash();
  }, [resolved, showToast, flash]);

  return (
    <ContextMenu.Root modal={false}>
      <ContextMenu.Trigger asChild>
        <button
          ref={ref}
          className="relative w-full aspect-square md:h-10 md:aspect-auto rounded-sm cursor-copy shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
          style={{ backgroundColor: `var(${cssVar})` }}
          onClick={handleCopyToken}
        >
          <span
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
              showTick ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check
              size={20}
              strokeWidth={1.5}
              className="text-textSubtle dark:text-white"
            />
          </span>
        </button>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="material-menu min-w-[240px] p-1.5 z-50">
          <ContextMenu.Item
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-textDefault hover:bg-[var(--ds-gray-100)] rounded-md cursor-pointer outline-none"
            onSelect={handleCopyValue}
          >
            Copy value
            <span className="text-copy-13 text-textSubtle">{resolved}</span>
          </ContextMenu.Item>
          <ContextMenu.Item
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-textDefault hover:bg-[var(--ds-gray-100)] rounded-md cursor-pointer outline-none"
            onSelect={handleCopyToken}
          >
            Copy token
            <span className="flex items-center gap-1.5 text-copy-13 text-textSubtle">
              Left click <MousePointer size={14} />
            </span>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

// Color scale data.
//
// IMPORTANT: this carries NO colour values — only token names. Every swatch
// resolves its colour at runtime from distanz-tokens.css (see ColorSwatch),
// which is the single source of truth. Do not reintroduce hardcoded hex here;
// it silently drifts the moment a token changes (which is exactly what
// happened before this page was reworked).
interface ColorStep {
  step: number;
  cssVar: string;
}

interface ColorScale {
  name: string;
  id: string;
  steps: ColorStep[];
}

const STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

function makeScale(
  name: string,
  id: string,
  prefix: string,
  steps: number[] = STEPS,
): ColorScale {
  return {
    name,
    id,
    steps: steps.map((step) => ({ step, cssVar: `${prefix}${step}` })),
  };
}

const backgroundScale: ColorScale = makeScale(
  "Backgrounds",
  "backgrounds",
  "--ds-background-",
  [100, 200],
);

const grayScale = makeScale("Gray", "gray", "--ds-gray-");
const grayAlphaScale = makeScale("Gray alpha", "gray-alpha", "--ds-gray-alpha-");
const blueScale = makeScale("Blue", "blue", "--ds-blue-");
const redScale = makeScale("Red", "red", "--ds-red-");
const amberScale = makeScale("Amber", "amber", "--ds-amber-");
const greenScale = makeScale("Green", "green", "--ds-green-");
const tealScale = makeScale("Teal", "teal", "--ds-teal-");
const purpleScale = makeScale("Purple", "purple", "--ds-purple-");
const pinkScale = makeScale("Pink", "pink", "--ds-pink-");

const allScales: ColorScale[] = [
  backgroundScale,
  grayScale,
  grayAlphaScale,
  blueScale,
  redScale,
  amberScale,
  greenScale,
  tealScale,
  purpleScale,
  pinkScale,
];

// Color scale row component (matches Geist layout)
function ColorScaleRow({
  scale,
  isDark,
}: {
  scale: ColorScale;
  isDark: boolean;
}) {
  const fullSteps = 10;
  const emptySlots = fullSteps - scale.steps.length;

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      <div className="w-[100px] flex-shrink-0">
        <p
          className="text-heading-14 text-textDefault"
          id={scale.name}
        >
          {scale.name}
        </p>
      </div>
      <ul aria-describedby={scale.name} className="flex w-full gap-1 md:gap-2">
        {scale.steps.map((step) => (
          <li key={step.step} className="w-full max-w-[68px]">
            <ColorSwatch cssVar={step.cssVar} themeKey={isDark} />
          </li>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <li key={`empty-${i}`} className="w-full max-w-[68px]">
            <div className="w-full aspect-square md:h-10 md:aspect-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Scales Section (matches Geist)
function ScalesSection({ isDark }: { isDark: boolean }) {
  return (
    <Section>
      <SectionHeader id="scales">Scales</SectionHeader>
      <p className="text-copy-16 text-textSubtle mt-4">
        There are 10 color scales in the system. Right click to copy raw values.
      </p>
      <div className="mt-10 space-y-6">
        {allScales.map((scale) => (
          <ColorScaleRow key={scale.id} scale={scale} isDark={isDark} />
        ))}
      </div>
    </Section>
  );
}

// Color row item for usage sections
function ColorRowItem({
  cssVar,
  label,
  description,
  showBorder = true,
}: {
  cssVar: string;
  label: string;
  description: string;
  showBorder?: boolean;
}) {
  return (
    <div
      className={`flex h-10 items-center gap-3 ${showBorder ? "border-b border-borderNeutral" : ""}`}
    >
      <div
        className="h-4 w-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{ background: `var(${cssVar})` }}
      />
      <p className="text-heading-14 text-textDefault w-[120px]">
        {label}
      </p>
      <p className="text-label-14 text-textSubtle">
        {description}
      </p>
    </div>
  );
}

// Backgrounds Section
function BackgroundsSection() {
  return (
    <Section>
      <SectionHeader id="backgrounds">Backgrounds</SectionHeader>
      <p className="text-copy-16 text-textSubtle mt-4">
        There are two background colors for pages and UI components. In most
        instances, you should use Background 1—especially when color is being
        placed on top of the background. Background 2 should be used sparingly
        when a subtle background differentiation is needed.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-background-100"
          label="Background 1"
          description="Default element background"
        />
        <ColorRowItem
          cssVar="--ds-background-200"
          label="Background 2"
          description="Secondary background"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[700px] w-full flex-col border border-borderNeutral md:h-[412px] md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div
          className="flex h-[50%] items-center justify-center border-r border-borderNeutral md:h-full md:w-[50%]"
          style={{ background: "var(--ds-background-100)" }}
        >
          <div
            className="relative flex h-[164px] w-[164px] items-center justify-center rounded-[12px] border border-borderNeutral"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              1
            </div>
            <div
              className="absolute bottom-[-57px] flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              2
            </div>
          </div>
        </div>
        <div
          className="flex h-[50%] items-center justify-center border-t border-borderNeutral md:h-full md:w-[50%] md:border-t-0"
          style={{ background: "var(--ds-background-200)" }}
        >
          <div
            className="relative flex h-[164px] w-[164px] items-center justify-center rounded-[12px] border border-borderNeutral"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              1
            </div>
            <div
              className="absolute bottom-[-57px] flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              2
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// Colors 1-3: Component Backgrounds Section
function ComponentBackgroundsSection() {
  return (
    <Section>
      <SectionHeader id="colors-1-3-component-backgrounds">
        Colors 1–3: Component Backgrounds
      </SectionHeader>
      <p className="text-copy-16 text-textSubtle mt-4">
        These three colors are designed for UI component backgrounds.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-100"
          label="Color 1"
          description="Default background"
        />
        <ColorRowItem
          cssVar="--ds-gray-200"
          label="Color 2"
          description="Hover background"
        />
        <ColorRowItem
          cssVar="--ds-gray-300"
          label="Color 3"
          description="Active background"
          showBorder={false}
        />
      </div>
      <p className="text-copy-16 text-textSubtle mt-4">
        If your UI component&apos;s default background is Background 1, you can
        use Color 1 as your hover background and Color 2 as your active
        background. On smaller UI elements like badges, you can use Color 2 or
        Color 3 as the background.
      </p>
      {/* Visual demo */}
      <div
        className="mt-10 flex w-full flex-col border border-borderNeutral md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div className="border-borderNeutral p-2 md:p-12">
          <ul>
            <li className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]">
              <span className="text-textSubtle">○</span>
              <p className="text-xs font-mono text-textSubtle">
                APR 26 15:54:21.12
              </p>
              <div className="h-5 w-px bg-borderNeutral" />
              <p className="text-xs font-mono text-textSubtle">
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
            <li
              className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]"
              style={{ background: "var(--ds-amber-100)" }}
            >
              <span style={{ color: "var(--ds-amber-900)" }}>⚠</span>
              <p
                className="text-xs font-mono"
                style={{ color: "var(--ds-amber-900)" }}
              >
                APR 26 15:54:21.12
              </p>
              <div
                className="h-5 w-px"
                style={{ background: "var(--ds-amber-400)" }}
              />
              <p
                className="text-xs font-mono"
                style={{ color: "var(--ds-amber-900)" }}
              >
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
            <li className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]">
              <span className="text-textSubtle">○</span>
              <p className="text-xs font-mono text-textSubtle whitespace-nowrap">
                APR 26 15:54:21.12
              </p>
              <div className="h-5 w-px bg-borderNeutral" />
              <p className="text-xs font-mono text-textSubtle">
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
            <li className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]">
              <span className="text-textSubtle">○</span>
              <p className="text-xs font-mono text-textSubtle">
                APR 26 15:54:21.12
              </p>
              <div className="h-5 w-px bg-borderNeutral" />
              <p className="text-xs font-mono text-textSubtle">
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
          </ul>
        </div>
        <div className="flex h-[120px] grow items-center justify-center gap-2 border-t md:h-auto md:border-l md:border-t-0">
          <span
            className="px-2 py-1 text-xs font-medium rounded capitalize"
            style={{
              background: "var(--ds-gray-200)",
              color: "var(--ds-gray-900)",
            }}
          >
            Hobby
          </span>
          <span
            className="px-2 py-1 text-xs font-medium rounded capitalize"
            style={{
              background: "var(--ds-blue-100)",
              color: "var(--ds-blue-900)",
            }}
          >
            Pro
          </span>
          <span
            className="px-2 py-1 text-xs font-medium rounded capitalize"
            style={{
              background: "var(--ds-purple-100)",
              color: "var(--ds-purple-900)",
            }}
          >
            Enterprise
          </span>
        </div>
      </div>
    </Section>
  );
}

// Colors 4-6: Borders Section
function BordersSection() {
  return (
    <Section>
      <SectionHeader id="colors-4-6-borders">Colors 4-6: Borders</SectionHeader>
      <p className="text-copy-16 text-textSubtle mt-4">
        These three colors are designed for UI component borders.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-400"
          label="Color 4"
          description="Default border"
        />
        <ColorRowItem
          cssVar="--ds-gray-500"
          label="Color 5"
          description="Hover border"
        />
        <ColorRowItem
          cssVar="--ds-gray-600"
          label="Color 6"
          description="Active border"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[136px] w-full items-center justify-center border border-borderNeutral"
        style={{ background: "var(--ds-background-100)" }}
      >
        <button
          className="inline-flex items-center justify-center font-sans font-medium text-sm transition-all duration-150 ease focus:outline-none active:scale-[0.98] active:duration-100"
          style={{
            height: "40px",
            minWidth: "160px",
            padding: "0 12px",
            borderRadius: "6px",
            background: "var(--ds-background-100)",
            boxShadow: "0 0 0 1px var(--ds-gray-400)",
            color: "var(--ds-gray-1000)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--ds-gray-alpha-200)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--ds-background-100)";
          }}
        >
          New Project
        </button>
      </div>
    </Section>
  );
}

// Colors 7-8: High Contrast Backgrounds Section
function HighContrastBackgroundsSection() {
  return (
    <Section>
      <SectionHeader id="colors-7-8-high-contrast-backgrounds">
        Colors 7-8: High Contrast Backgrounds
      </SectionHeader>
      <p className="text-copy-16 text-textSubtle mt-4">
        These two colors are designed for high contrast UI component
        backgrounds.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-700"
          label="Color 7"
          description="High contrast background"
        />
        <ColorRowItem
          cssVar="--ds-gray-800"
          label="Color 8"
          description="Hover high contrast background"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[260px] w-full flex-col items-center justify-center border border-borderNeutral md:h-[136px] md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div className="flex h-[65%] w-full items-center justify-center gap-5 border-borderNeutral md:h-full md:w-[50%] md:border-r">
          {/* Gauges */}
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-gray-alpha-400)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-green-700)"
                strokeWidth="3"
                strokeDasharray="85 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              90
            </span>
          </div>
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-gray-alpha-400)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-amber-700)"
                strokeWidth="3"
                strokeDasharray="55 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              55
            </span>
          </div>
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-gray-alpha-400)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-red-800)"
                strokeWidth="3"
                strokeDasharray="20 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              20
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center md:w-[50%] py-6 md:py-0">
          <button
            className="inline-flex items-center justify-center font-sans font-medium text-sm transition-all duration-150 ease focus:outline-none active:scale-[0.98] active:duration-100"
            style={{
              height: "40px",
              minWidth: "160px",
              padding: "0 12px",
              borderRadius: "6px",
              background: "var(--ds-blue-700)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0B7BFE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--ds-blue-700)";
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </Section>
  );
}

// Colors 9-10: Text and Icons Section
function TextAndIconsSection() {
  return (
    <Section>
      <SectionHeader id="colors-9-10-text-and-icons">
        Colors 9-10: Text and Icons
      </SectionHeader>
      <p className="text-copy-16 text-textSubtle mt-4">
        These two colors are designed for accessible text and icons.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-900"
          label="Color 9"
          description="Secondary text and icons"
        />
        <ColorRowItem
          cssVar="--ds-gray-1000"
          label="Color 10"
          description="Primary text and icons"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[260px] w-full flex-col items-center justify-center border border-borderNeutral md:h-[198px] md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div className="flex h-[65%] w-[63%] items-center justify-center border-borderNeutral md:h-full md:w-[50%]">
          <div className="flex w-[316px] flex-col gap-1">
            <p
              className="text-heading-16"
              style={{ color: "var(--ds-gray-1000)" }}
            >
              The Frontend Cloud
            </p>
            <p className="text-[14px]" style={{ color: "var(--ds-gray-900)" }}>
              Build, scale, and secure a faster, personalized web with Distanz.
            </p>
            <a
              className="mt-2 flex items-center gap-0.5 text-sm no-underline"
              href="#"
              style={{ color: "var(--ds-pink-900)" }}
            >
              Learn More
              <svg
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
                style={{ color: "currentcolor" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex h-[35%] w-full items-center justify-center gap-7 border-t md:h-full md:w-[50%] md:gap-5 md:border-l md:border-t-0">
          <CircleDollarSign
            size={16}
            style={{ color: "var(--ds-green-900)" }}
          />
          <ChartPie size={16} style={{ color: "var(--ds-blue-900)" }} />
          <ChartNoAxesColumn
            size={16}
            style={{ color: "var(--ds-purple-900)" }}
          />
          <Star size={16} style={{ color: "var(--ds-amber-900)" }} />
          <Bell size={16} style={{ color: "var(--ds-pink-900)" }} />
          <CircleCheck size={16} style={{ color: "var(--ds-teal-900)" }} />
        </div>
      </div>
    </Section>
  );
}

export default function ColourPalettes() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode();
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Sections in Geist order */}
      <ScalesSection isDark={isDark} />
      <BackgroundsSection />
      <ComponentBackgroundsSection />
      <BordersSection />
      <HighContrastBackgroundsSection />
      <TextAndIconsSection />
    </div>
  );
}

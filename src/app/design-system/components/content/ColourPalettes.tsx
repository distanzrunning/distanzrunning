"use client";

import { useState, useCallback, useEffect } from "react";

// Link icon for section headers
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

// Section header with link icon on hover
function SectionHeader({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit"
      href={`#${id}`}
      id={id}
      style={{ scrollMarginTop: 32 }}
    >
      <h2 className="font-serif text-[24px] leading-[1.2] font-medium">
        <div className="absolute left-0 top-[6px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </a>
  );
}

// Color row item (circle + label + description)
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
      className={`flex h-10 items-center gap-3 ${showBorder ? "border-b border-borderSubtle" : ""}`}
    >
      <div
        className="h-4 w-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{ background: `var(${cssVar})` }}
      />
      <p className="text-[14px] leading-[20px] font-medium text-textDefault w-[120px]">
        {label}
      </p>
      <p className="text-sm text-textSubtle">{description}</p>
    </div>
  );
}

// Backgrounds Section
function BackgroundsSection() {
  return (
    <section className="mb-16">
      <SectionHeader id="backgrounds">Backgrounds</SectionHeader>
      <p className="text-base text-textSubtle mt-4">
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
      <div className="mt-10 flex h-[700px] w-full flex-col border border-borderDefault md:h-[412px] md:flex-row bg-canvas">
        <div
          className="flex h-[50%] items-center justify-center border-r border-borderDefault md:h-full md:w-[50%]"
          style={{ background: "var(--ds-background-100)" }}
        >
          <div
            className="relative flex h-[164px] w-[164px] items-center justify-center rounded-[12px] border border-borderDefault"
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
          className="flex h-[50%] items-center justify-center border-t border-borderDefault md:h-full md:w-[50%] md:border-t-0"
          style={{ background: "var(--ds-background-200)" }}
        >
          <div
            className="relative flex h-[164px] w-[164px] items-center justify-center rounded-[12px] border border-borderDefault"
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
    </section>
  );
}

// Colors 1-3: Component Backgrounds Section
function ComponentBackgroundsSection() {
  return (
    <section className="mb-16">
      <SectionHeader id="colors-1-3-component-backgrounds">
        Colors 1–3: Component Backgrounds
      </SectionHeader>
      <p className="text-base text-textSubtle mt-4">
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

      <p className="text-base text-textSubtle mt-4">
        If your UI component&apos;s default background is Background 1, you can
        use Color 1 as your hover background and Color 2 as your active
        background. On smaller UI elements like badges, you can use Color 2 or
        Color 3 as the background.
      </p>

      {/* Visual demo - list items with badges */}
      <div className="mt-10 flex w-full flex-col border border-borderDefault md:flex-row bg-canvas">
        <div className="border-borderDefault p-2 md:p-12">
          <ul>
            <li className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]">
              <span className="text-textSubtle">○</span>
              <p className="text-xs font-mono text-textSubtle">
                APR 26 15:54:21.12
              </p>
              <div className="h-5 w-px bg-borderDefault" />
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
              <div className="h-5 w-px bg-borderDefault" />
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
              <div className="h-5 w-px bg-borderDefault" />
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
    </section>
  );
}

// Colors 4-6: Borders Section
function BordersSection() {
  return (
    <section className="mb-16">
      <SectionHeader id="colors-4-6-borders">Colors 4-6: Borders</SectionHeader>
      <p className="text-base text-textSubtle mt-4">
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

      {/* Visual demo - button */}
      <div className="mt-10 flex h-[136px] w-full items-center justify-center border border-borderDefault bg-canvas">
        <button
          className="px-6 py-2 text-sm font-medium rounded-md transition-colors"
          style={{
            background: "var(--ds-background-100)",
            border: "1px solid var(--ds-gray-400)",
            color: "var(--ds-gray-1000)",
            minWidth: 160,
          }}
        >
          New Project
        </button>
      </div>
    </section>
  );
}

// Colors 7-8: High Contrast Backgrounds Section
function HighContrastSection() {
  return (
    <section className="mb-16">
      <SectionHeader id="colors-7-8-high-contrast-backgrounds">
        Colors 7-8: High Contrast Backgrounds
      </SectionHeader>
      <p className="text-base text-textSubtle mt-4">
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

      {/* Visual demo - gauges and button */}
      <div className="mt-10 flex h-[260px] w-full flex-col items-center justify-center border border-borderDefault md:h-[136px] md:flex-row bg-canvas">
        <div className="flex h-[65%] w-full items-center justify-center gap-5 border-borderDefault md:h-full md:w-[50%] md:border-r">
          {/* Simple gauge representations */}
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
            className="px-6 py-2 text-sm font-medium rounded-md transition-colors"
            style={{
              background: "var(--ds-blue-700)",
              color: "#fff",
              minWidth: 160,
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </section>
  );
}

// Colors 9-10: Text and Icons Section
function TextAndIconsSection() {
  return (
    <section className="mb-16">
      <SectionHeader id="colors-9-10-text-and-icons">
        Colors 9-10: Text and Icons
      </SectionHeader>
      <p className="text-base text-textSubtle mt-4">
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

      {/* Visual demo - text content and icons */}
      <div className="mt-10 flex h-[260px] w-full flex-col items-center justify-center border border-borderDefault md:h-[198px] md:flex-row bg-canvas">
        <div className="flex h-[65%] w-[63%] items-center justify-center border-borderDefault md:h-full md:w-[50%]">
          <div className="flex w-[316px] flex-col gap-1">
            <p
              className="text-base font-semibold"
              style={{ color: "var(--ds-gray-1000)" }}
            >
              The Frontend Cloud
            </p>
            <p className="text-sm" style={{ color: "var(--ds-gray-900)" }}>
              Build, scale, and secure a faster, personalized web with Distanz.
            </p>
            <a
              className="mt-2 flex items-center gap-0.5 text-sm no-underline"
              href="#"
              style={{ color: "var(--ds-blue-900)" }}
            >
              Learn More{" "}
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
          {/* Colored icons */}
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-green-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-blue-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-purple-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-amber-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-pink-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-teal-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// Color scale data
interface ColorStep {
  step: number;
  cssVar: string;
  lightValue: string;
  darkValue: string;
}

interface ColorScale {
  name: string;
  id: string;
  steps: ColorStep[];
}

const grayScale: ColorScale = {
  name: "Gray",
  id: "gray",
  steps: [
    {
      step: 100,
      cssVar: "--ds-gray-100",
      lightValue: "#F2F2F2",
      darkValue: "#F2F2F2",
    },
    {
      step: 200,
      cssVar: "--ds-gray-200",
      lightValue: "#EBEBEB",
      darkValue: "#EBEBEB",
    },
    {
      step: 300,
      cssVar: "--ds-gray-300",
      lightValue: "#E6E6E6",
      darkValue: "#E6E6E6",
    },
    {
      step: 400,
      cssVar: "--ds-gray-400",
      lightValue: "#EBEBEB",
      darkValue: "#EBEBEB",
    },
    {
      step: 500,
      cssVar: "--ds-gray-500",
      lightValue: "#C9C9C9",
      darkValue: "#C9C9C9",
    },
    {
      step: 600,
      cssVar: "--ds-gray-600",
      lightValue: "#A8A8A8",
      darkValue: "#A8A8A8",
    },
    {
      step: 700,
      cssVar: "--ds-gray-700",
      lightValue: "#8F8F8F",
      darkValue: "#8F8F8F",
    },
    {
      step: 800,
      cssVar: "--ds-gray-800",
      lightValue: "#7D7D7D",
      darkValue: "#7D7D7D",
    },
    {
      step: 900,
      cssVar: "--ds-gray-900",
      lightValue: "#666666",
      darkValue: "#666666",
    },
    {
      step: 1000,
      cssVar: "--ds-gray-1000",
      lightValue: "#171717",
      darkValue: "#171717",
    },
  ],
};

const accentScales: ColorScale[] = [
  {
    name: "Blue",
    id: "blue",
    steps: [
      {
        step: 100,
        cssVar: "--ds-blue-100",
        lightValue: "#EFF7FF",
        darkValue: "#EFF7FF",
      },
      {
        step: 200,
        cssVar: "--ds-blue-200",
        lightValue: "#E8F4FF",
        darkValue: "#E8F4FF",
      },
      {
        step: 300,
        cssVar: "--ds-blue-300",
        lightValue: "#DBEEFF",
        darkValue: "#DBEEFF",
      },
      {
        step: 400,
        cssVar: "--ds-blue-400",
        lightValue: "#C6E4FF",
        darkValue: "#C6E4FF",
      },
      {
        step: 500,
        cssVar: "--ds-blue-500",
        lightValue: "#99CCFF",
        darkValue: "#99CCFF",
      },
      {
        step: 600,
        cssVar: "--ds-blue-600",
        lightValue: "#52A9FF",
        darkValue: "#52A9FF",
      },
      {
        step: 700,
        cssVar: "--ds-blue-700",
        lightValue: "#0070F3",
        darkValue: "#0070F3",
      },
      {
        step: 800,
        cssVar: "--ds-blue-800",
        lightValue: "#0062D4",
        darkValue: "#0062D4",
      },
      {
        step: 900,
        cssVar: "--ds-blue-900",
        lightValue: "#006ADC",
        darkValue: "#006ADC",
      },
      {
        step: 1000,
        cssVar: "--ds-blue-1000",
        lightValue: "#00244D",
        darkValue: "#00244D",
      },
    ],
  },
  {
    name: "Red",
    id: "red",
    steps: [
      {
        step: 100,
        cssVar: "--ds-red-100",
        lightValue: "#FFF0F0",
        darkValue: "#FFF0F0",
      },
      {
        step: 200,
        cssVar: "--ds-red-200",
        lightValue: "#FFE8E8",
        darkValue: "#FFE8E8",
      },
      {
        step: 300,
        cssVar: "--ds-red-300",
        lightValue: "#FFE0E0",
        darkValue: "#FFE0E0",
      },
      {
        step: 400,
        cssVar: "--ds-red-400",
        lightValue: "#FFD2D2",
        darkValue: "#FFD2D2",
      },
      {
        step: 500,
        cssVar: "--ds-red-500",
        lightValue: "#FFAFAF",
        darkValue: "#FFAFAF",
      },
      {
        step: 600,
        cssVar: "--ds-red-600",
        lightValue: "#FF6C6C",
        darkValue: "#FF6C6C",
      },
      {
        step: 700,
        cssVar: "--ds-red-700",
        lightValue: "#EE0000",
        darkValue: "#EE0000",
      },
      {
        step: 800,
        cssVar: "--ds-red-800",
        lightValue: "#D50000",
        darkValue: "#D50000",
      },
      {
        step: 900,
        cssVar: "--ds-red-900",
        lightValue: "#C50000",
        darkValue: "#C50000",
      },
      {
        step: 1000,
        cssVar: "--ds-red-1000",
        lightValue: "#3C1414",
        darkValue: "#3C1414",
      },
    ],
  },
  {
    name: "Amber",
    id: "amber",
    steps: [
      {
        step: 100,
        cssVar: "--ds-amber-100",
        lightValue: "#FFF8E6",
        darkValue: "#FFF8E6",
      },
      {
        step: 200,
        cssVar: "--ds-amber-200",
        lightValue: "#FFF4D6",
        darkValue: "#FFF4D6",
      },
      {
        step: 300,
        cssVar: "--ds-amber-300",
        lightValue: "#FFEFC7",
        darkValue: "#FFEFC7",
      },
      {
        step: 400,
        cssVar: "--ds-amber-400",
        lightValue: "#FFDC8C",
        darkValue: "#FFDC8C",
      },
      {
        step: 500,
        cssVar: "--ds-amber-500",
        lightValue: "#FFC850",
        darkValue: "#FFC850",
      },
      {
        step: 600,
        cssVar: "--ds-amber-600",
        lightValue: "#FFA800",
        darkValue: "#FFA800",
      },
      {
        step: 700,
        cssVar: "--ds-amber-700",
        lightValue: "#F5A400",
        darkValue: "#F5A400",
      },
      {
        step: 800,
        cssVar: "--ds-amber-800",
        lightValue: "#E68C00",
        darkValue: "#E68C00",
      },
      {
        step: 900,
        cssVar: "--ds-amber-900",
        lightValue: "#995200",
        darkValue: "#995200",
      },
      {
        step: 1000,
        cssVar: "--ds-amber-1000",
        lightValue: "#472912",
        darkValue: "#472912",
      },
    ],
  },
  {
    name: "Green",
    id: "green",
    steps: [
      {
        step: 100,
        cssVar: "--ds-green-100",
        lightValue: "#ECFDF0",
        darkValue: "#ECFDF0",
      },
      {
        step: 200,
        cssVar: "--ds-green-200",
        lightValue: "#E4FBEB",
        darkValue: "#E4FBEB",
      },
      {
        step: 300,
        cssVar: "--ds-green-300",
        lightValue: "#D4F7DC",
        darkValue: "#D4F7DC",
      },
      {
        step: 400,
        cssVar: "--ds-green-400",
        lightValue: "#BFF1CA",
        darkValue: "#BFF1CA",
      },
      {
        step: 500,
        cssVar: "--ds-green-500",
        lightValue: "#99E6AA",
        darkValue: "#99E6AA",
      },
      {
        step: 600,
        cssVar: "--ds-green-600",
        lightValue: "#66D982",
        darkValue: "#66D982",
      },
      {
        step: 700,
        cssVar: "--ds-green-700",
        lightValue: "#2FA34C",
        darkValue: "#2FA34C",
      },
      {
        step: 800,
        cssVar: "--ds-green-800",
        lightValue: "#248B3D",
        darkValue: "#248B3D",
      },
      {
        step: 900,
        cssVar: "--ds-green-900",
        lightValue: "#1A7832",
        darkValue: "#1A7832",
      },
      {
        step: 1000,
        cssVar: "--ds-green-1000",
        lightValue: "#0F371B",
        darkValue: "#0F371B",
      },
    ],
  },
  {
    name: "Teal",
    id: "teal",
    steps: [
      {
        step: 100,
        cssVar: "--ds-teal-100",
        lightValue: "#EBFEFD",
        darkValue: "#EBFEFD",
      },
      {
        step: 200,
        cssVar: "--ds-teal-200",
        lightValue: "#E6FDFA",
        darkValue: "#E6FDFA",
      },
      {
        step: 300,
        cssVar: "--ds-teal-300",
        lightValue: "#D6F9F4",
        darkValue: "#D6F9F4",
      },
      {
        step: 400,
        cssVar: "--ds-teal-400",
        lightValue: "#C3F4EC",
        darkValue: "#C3F4EC",
      },
      {
        step: 500,
        cssVar: "--ds-teal-500",
        lightValue: "#99E8DA",
        darkValue: "#99E8DA",
      },
      {
        step: 600,
        cssVar: "--ds-teal-600",
        lightValue: "#66D9C3",
        darkValue: "#66D9C3",
      },
      {
        step: 700,
        cssVar: "--ds-teal-700",
        lightValue: "#1AA390",
        darkValue: "#1AA390",
      },
      {
        step: 800,
        cssVar: "--ds-teal-800",
        lightValue: "#118B7A",
        darkValue: "#118B7A",
      },
      {
        step: 900,
        cssVar: "--ds-teal-900",
        lightValue: "#0C786A",
        darkValue: "#0C786A",
      },
      {
        step: 1000,
        cssVar: "--ds-teal-1000",
        lightValue: "#123D35",
        darkValue: "#123D35",
      },
    ],
  },
  {
    name: "Purple",
    id: "purple",
    steps: [
      {
        step: 100,
        cssVar: "--ds-purple-100",
        lightValue: "#FAF0FF",
        darkValue: "#FAF0FF",
      },
      {
        step: 200,
        cssVar: "--ds-purple-200",
        lightValue: "#FAF0FF",
        darkValue: "#FAF0FF",
      },
      {
        step: 300,
        cssVar: "--ds-purple-300",
        lightValue: "#F2E6FD",
        darkValue: "#F2E6FD",
      },
      {
        step: 400,
        cssVar: "--ds-purple-400",
        lightValue: "#E6D7FA",
        darkValue: "#E6D7FA",
      },
      {
        step: 500,
        cssVar: "--ds-purple-500",
        lightValue: "#C8AAF5",
        darkValue: "#C8AAF5",
      },
      {
        step: 600,
        cssVar: "--ds-purple-600",
        lightValue: "#A573EB",
        darkValue: "#A573EB",
      },
      {
        step: 700,
        cssVar: "--ds-purple-700",
        lightValue: "#7928CA",
        darkValue: "#7928CA",
      },
      {
        step: 800,
        cssVar: "--ds-purple-800",
        lightValue: "#641EAA",
        darkValue: "#641EAA",
      },
      {
        step: 900,
        cssVar: "--ds-purple-900",
        lightValue: "#5D1EA8",
        darkValue: "#5D1EA8",
      },
      {
        step: 1000,
        cssVar: "--ds-purple-1000",
        lightValue: "#280F48",
        darkValue: "#280F48",
      },
    ],
  },
  {
    name: "Pink",
    id: "pink",
    steps: [
      {
        step: 100,
        cssVar: "--ds-pink-100",
        lightValue: "#FFEDF5",
        darkValue: "#FFEDF5",
      },
      {
        step: 200,
        cssVar: "--ds-pink-200",
        lightValue: "#FFEDF3",
        darkValue: "#FFEDF3",
      },
      {
        step: 300,
        cssVar: "--ds-pink-300",
        lightValue: "#FDE1EC",
        darkValue: "#FDE1EC",
      },
      {
        step: 400,
        cssVar: "--ds-pink-400",
        lightValue: "#FAD7E6",
        darkValue: "#FAD7E6",
      },
      {
        step: 500,
        cssVar: "--ds-pink-500",
        lightValue: "#F2B9D2",
        darkValue: "#F2B9D2",
      },
      {
        step: 600,
        cssVar: "--ds-pink-600",
        lightValue: "#EB82AF",
        darkValue: "#EB82AF",
      },
      {
        step: 700,
        cssVar: "--ds-pink-700",
        lightValue: "#EB377D",
        darkValue: "#EB377D",
      },
      {
        step: 800,
        cssVar: "--ds-pink-800",
        lightValue: "#DA2D73",
        darkValue: "#DA2D73",
      },
      {
        step: 900,
        cssVar: "--ds-pink-900",
        lightValue: "#B92D64",
        darkValue: "#B92D64",
      },
      {
        step: 1000,
        cssVar: "--ds-pink-1000",
        lightValue: "#3C1426",
        darkValue: "#3C1426",
      },
    ],
  },
];

// Tooltip component
function Tooltip({
  children,
  content,
  visible,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  visible: boolean;
}) {
  return (
    <div className="relative">
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
            {content}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </div>
      )}
    </div>
  );
}

// Color swatch component
function ColorSwatch({
  step,
  cssVar,
  value,
}: {
  step: number;
  cssVar: string;
  value: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
    [value],
  );

  return (
    <Tooltip
      content={copied ? "Copied!" : `${step}: ${value}`}
      visible={showTooltip || copied}
    >
      <button
        className="w-full aspect-square md:h-10 md:aspect-auto rounded-sm cursor-copy transition-transform hover:scale-105 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{ backgroundColor: `var(${cssVar})` }}
        onClick={handleCopy}
        onContextMenu={handleCopy}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={`${step}: ${value}`}
      />
    </Tooltip>
  );
}

// Color scale row component
function ColorScaleRow({
  scale,
  isDark,
}: {
  scale: ColorScale;
  isDark: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      <div className="w-[100px] flex-shrink-0">
        <p className="text-sm font-medium text-textDefault" id={scale.id}>
          {scale.name}
        </p>
      </div>
      <ul aria-describedby={scale.id} className="flex w-full gap-1 md:gap-2">
        {scale.steps.map((step) => (
          <li key={step.step} className="w-full max-w-[68px]">
            <ColorSwatch
              step={step.step}
              cssVar={step.cssVar}
              value={isDark ? step.darkValue : step.lightValue}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Gray Scale Section
function GrayScaleSection({ isDark }: { isDark: boolean }) {
  return (
    <section className="mb-16">
      <SectionHeader id="gray-scale">Gray Scale</SectionHeader>
      <p className="text-base text-textSubtle mt-4 mb-8">
        The full gray scale from 100-1000. Click any swatch to copy the hex
        value.
      </p>
      <ColorScaleRow scale={grayScale} isDark={isDark} />
    </section>
  );
}

// Accent Colors Section
function AccentColorsSection({ isDark }: { isDark: boolean }) {
  return (
    <section className="mb-16">
      <SectionHeader id="accent-colors">Accent Colors</SectionHeader>
      <p className="text-base text-textSubtle mt-4 mb-8">
        Accent color scales for semantic and decorative use. Each scale follows
        the same 100-1000 structure as gray.
      </p>
      <div className="space-y-6">
        {accentScales.map((scale) => (
          <ColorScaleRow key={scale.id} scale={scale} isDark={isDark} />
        ))}
      </div>
    </section>
  );
}

// Migration section
function MigrationSection() {
  const mappings = [
    { old: "asphalt-98", new: "gray-100", usage: "Canvas, lightest" },
    { old: "asphalt-95", new: "gray-200", usage: "Surface backgrounds" },
    { old: "asphalt-90", new: "gray-300", usage: "Hover states" },
    { old: "asphalt-85", new: "gray-400", usage: "Subtle borders" },
    { old: "asphalt-75", new: "gray-500", usage: "Default borders" },
    { old: "asphalt-65", new: "gray-600", usage: "Prominent borders" },
    { old: "asphalt-50", new: "gray-700", usage: "Muted text" },
    { old: "asphalt-35", new: "gray-800", usage: "Secondary text" },
    { old: "asphalt-20", new: "gray-900", usage: "Primary text" },
    { old: "asphalt-10", new: "gray-1000", usage: "Maximum contrast" },
  ];

  return (
    <section className="mb-16">
      <SectionHeader id="migration">Migration</SectionHeader>
      <p className="text-base text-textSubtle mt-4 mb-6">
        The Asphalt scale (5-98) has been replaced with a Gray scale (100-1000).
        Legacy class names are preserved for backward compatibility.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borderSubtle">
              <th className="text-left py-3 pr-4 font-medium text-textSubtle">
                Old
              </th>
              <th className="text-left py-3 pr-4 font-medium text-textSubtle">
                New
              </th>
              <th className="text-left py-3 font-medium text-textSubtle">
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping) => (
              <tr
                key={mapping.old}
                className="border-b border-borderExtraSubtle"
              >
                <td className="py-3 pr-4">
                  <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-surfaceSubtle text-textDefault">
                    {mapping.old}
                  </code>
                </td>
                <td className="py-3 pr-4">
                  <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300">
                    {mapping.new}
                  </code>
                </td>
                <td className="py-3 text-textSubtle">{mapping.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ColourPalettes() {
  const [isDark, setIsDark] = useState(false);

  // Listen for dark mode changes on the document
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    // Initial check
    checkDarkMode();

    // Create observer for class changes on html element
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
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="font-serif text-[32px] md:text-[40px] leading-[1.15] font-medium mb-3">
          Colors
        </h1>
        <p
          className="text-base md:text-lg text-textSubtle"
          style={{ lineHeight: 1.5 }}
        >
          Learn how to work with our color system. Click any swatch to copy its
          value.
        </p>
      </div>

      {/* Main content sections */}
      <BackgroundsSection />
      <ComponentBackgroundsSection />
      <BordersSection />
      <HighContrastSection />
      <TextAndIconsSection />
      <GrayScaleSection isDark={isDark} />
      <AccentColorsSection isDark={isDark} />
      <MigrationSection />
    </div>
  );
}

"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Check } from "lucide-react";

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

// Colors 7-8: Solid Colors Section
function SolidColorsSection() {
  return (
    <section className="mb-16">
      <SectionHeader id="colors-7-8-solid-colors">
        Colors 7-8: Solid Colors
      </SectionHeader>
      <p className="text-base text-textSubtle mt-4">
        These two colors are designed for solid UI component backgrounds.
      </p>

      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-700"
          label="Color 7"
          description="Solid background"
        />
        <ColorRowItem
          cssVar="--ds-gray-800"
          label="Color 8"
          description="Hover solid background"
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

// Background scale (only 2 steps, will be displayed differently)
const backgroundScale: ColorScale = {
  name: "Background",
  id: "background",
  steps: [
    {
      step: 100,
      cssVar: "--ds-background-100",
      lightValue: "#FAFAFA",
      darkValue: "#0A0A0A",
    },
    {
      step: 200,
      cssVar: "--ds-background-200",
      lightValue: "#FFFFFF",
      darkValue: "#000000",
    },
  ],
};

const grayScale: ColorScale = {
  name: "Gray",
  id: "gray",
  steps: [
    {
      step: 100,
      cssVar: "--ds-gray-100",
      lightValue: "#F2F2F2",
      darkValue: "#1A1A1A",
    },
    {
      step: 200,
      cssVar: "--ds-gray-200",
      lightValue: "#EBEBEB",
      darkValue: "#1F1F1F",
    },
    {
      step: 300,
      cssVar: "--ds-gray-300",
      lightValue: "#E6E6E6",
      darkValue: "#292929",
    },
    {
      step: 400,
      cssVar: "--ds-gray-400",
      lightValue: "#EBEBEB",
      darkValue: "#2E2E2E",
    },
    {
      step: 500,
      cssVar: "--ds-gray-500",
      lightValue: "#C9C9C9",
      darkValue: "#454545",
    },
    {
      step: 600,
      cssVar: "--ds-gray-600",
      lightValue: "#A8A8A8",
      darkValue: "#878787",
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
      darkValue: "#A1A1A1",
    },
    {
      step: 1000,
      cssVar: "--ds-gray-1000",
      lightValue: "#171717",
      darkValue: "#EDEDED",
    },
  ],
};

const grayAlphaScale: ColorScale = {
  name: "Gray Alpha",
  id: "gray-alpha",
  steps: [
    {
      step: 100,
      cssVar: "--ds-gray-alpha-100",
      lightValue: "rgba(0,0,0,0.05)",
      darkValue: "rgba(255,255,255,0.06)",
    },
    {
      step: 200,
      cssVar: "--ds-gray-alpha-200",
      lightValue: "rgba(0,0,0,0.09)",
      darkValue: "rgba(255,255,255,0.09)",
    },
    {
      step: 300,
      cssVar: "--ds-gray-alpha-300",
      lightValue: "rgba(0,0,0,0.13)",
      darkValue: "rgba(255,255,255,0.13)",
    },
    {
      step: 400,
      cssVar: "--ds-gray-alpha-400",
      lightValue: "rgba(0,0,0,0.17)",
      darkValue: "rgba(255,255,255,0.17)",
    },
    {
      step: 500,
      cssVar: "--ds-gray-alpha-500",
      lightValue: "rgba(0,0,0,0.24)",
      darkValue: "rgba(255,255,255,0.24)",
    },
    {
      step: 600,
      cssVar: "--ds-gray-alpha-600",
      lightValue: "rgba(0,0,0,0.38)",
      darkValue: "rgba(255,255,255,0.51)",
    },
    {
      step: 700,
      cssVar: "--ds-gray-alpha-700",
      lightValue: "rgba(0,0,0,0.47)",
      darkValue: "rgba(255,255,255,0.54)",
    },
    {
      step: 800,
      cssVar: "--ds-gray-alpha-800",
      lightValue: "rgba(0,0,0,0.55)",
      darkValue: "rgba(255,255,255,0.47)",
    },
    {
      step: 900,
      cssVar: "--ds-gray-alpha-900",
      lightValue: "rgba(0,0,0,0.65)",
      darkValue: "rgba(255,255,255,0.61)",
    },
    {
      step: 1000,
      cssVar: "--ds-gray-alpha-1000",
      lightValue: "rgba(0,0,0,0.91)",
      darkValue: "rgba(255,255,255,0.92)",
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
        darkValue: "#0F1B2D",
      },
      {
        step: 200,
        cssVar: "--ds-blue-200",
        lightValue: "#E8F4FF",
        darkValue: "#10243E",
      },
      {
        step: 300,
        cssVar: "--ds-blue-300",
        lightValue: "#DBEEFF",
        darkValue: "#0F3058",
      },
      {
        step: 400,
        cssVar: "--ds-blue-400",
        lightValue: "#C6E4FF",
        darkValue: "#0D3868",
      },
      {
        step: 500,
        cssVar: "--ds-blue-500",
        lightValue: "#99CCFF",
        darkValue: "#0A4481",
      },
      {
        step: 600,
        cssVar: "--ds-blue-600",
        lightValue: "#52A9FF",
        darkValue: "#0091FF",
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
        darkValue: "#3B9EFF",
      },
      {
        step: 900,
        cssVar: "--ds-blue-900",
        lightValue: "#006ADC",
        darkValue: "#70B8FF",
      },
      {
        step: 1000,
        cssVar: "--ds-blue-1000",
        lightValue: "#00244D",
        darkValue: "#C2E6FF",
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
        darkValue: "#2D1313",
      },
      {
        step: 200,
        cssVar: "--ds-red-200",
        lightValue: "#FFE8E8",
        darkValue: "#3C1618",
      },
      {
        step: 300,
        cssVar: "--ds-red-300",
        lightValue: "#FFE0E0",
        darkValue: "#541B1F",
      },
      {
        step: 400,
        cssVar: "--ds-red-400",
        lightValue: "#FFD2D2",
        darkValue: "#671E22",
      },
      {
        step: 500,
        cssVar: "--ds-red-500",
        lightValue: "#FFAFAF",
        darkValue: "#822025",
      },
      {
        step: 600,
        cssVar: "--ds-red-600",
        lightValue: "#FF6C6C",
        darkValue: "#E5484D",
      },
      {
        step: 700,
        cssVar: "--ds-red-700",
        lightValue: "#EE0000",
        darkValue: "#F2555A",
      },
      {
        step: 800,
        cssVar: "--ds-red-800",
        lightValue: "#D50000",
        darkValue: "#FF6369",
      },
      {
        step: 900,
        cssVar: "--ds-red-900",
        lightValue: "#C50000",
        darkValue: "#FF9592",
      },
      {
        step: 1000,
        cssVar: "--ds-red-1000",
        lightValue: "#3C1414",
        darkValue: "#FFD1D9",
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
        darkValue: "#271700",
      },
      {
        step: 200,
        cssVar: "--ds-amber-200",
        lightValue: "#FFF4D6",
        darkValue: "#341C00",
      },
      {
        step: 300,
        cssVar: "--ds-amber-300",
        lightValue: "#FFEFC7",
        darkValue: "#4A2900",
      },
      {
        step: 400,
        cssVar: "--ds-amber-400",
        lightValue: "#FFDC8C",
        darkValue: "#573300",
      },
      {
        step: 500,
        cssVar: "--ds-amber-500",
        lightValue: "#FFC850",
        darkValue: "#693F05",
      },
      {
        step: 600,
        cssVar: "--ds-amber-600",
        lightValue: "#FFA800",
        darkValue: "#FFCB47",
      },
      {
        step: 700,
        cssVar: "--ds-amber-700",
        lightValue: "#F5A400",
        darkValue: "#FFCB47",
      },
      {
        step: 800,
        cssVar: "--ds-amber-800",
        lightValue: "#E68C00",
        darkValue: "#FFD866",
      },
      {
        step: 900,
        cssVar: "--ds-amber-900",
        lightValue: "#995200",
        darkValue: "#FFE099",
      },
      {
        step: 1000,
        cssVar: "--ds-amber-1000",
        lightValue: "#472912",
        darkValue: "#FFF1CF",
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
        darkValue: "#0D1F12",
      },
      {
        step: 200,
        cssVar: "--ds-green-200",
        lightValue: "#E4FBEB",
        darkValue: "#132819",
      },
      {
        step: 300,
        cssVar: "--ds-green-300",
        lightValue: "#D4F7DC",
        darkValue: "#113B1D",
      },
      {
        step: 400,
        cssVar: "--ds-green-400",
        lightValue: "#BFF1CA",
        darkValue: "#174825",
      },
      {
        step: 500,
        cssVar: "--ds-green-500",
        lightValue: "#99E6AA",
        darkValue: "#20572D",
      },
      {
        step: 600,
        cssVar: "--ds-green-600",
        lightValue: "#66D982",
        darkValue: "#46A758",
      },
      {
        step: 700,
        cssVar: "--ds-green-700",
        lightValue: "#2FA34C",
        darkValue: "#53B365",
      },
      {
        step: 800,
        cssVar: "--ds-green-800",
        lightValue: "#248B3D",
        darkValue: "#5CC06E",
      },
      {
        step: 900,
        cssVar: "--ds-green-900",
        lightValue: "#1A7832",
        darkValue: "#87DB96",
      },
      {
        step: 1000,
        cssVar: "--ds-green-1000",
        lightValue: "#0F371B",
        darkValue: "#CCFFD5",
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
        darkValue: "#0D1F1E",
      },
      {
        step: 200,
        cssVar: "--ds-teal-200",
        lightValue: "#E6FDFA",
        darkValue: "#0F2927",
      },
      {
        step: 300,
        cssVar: "--ds-teal-300",
        lightValue: "#D6F9F4",
        darkValue: "#0F3D39",
      },
      {
        step: 400,
        cssVar: "--ds-teal-400",
        lightValue: "#C3F4EC",
        darkValue: "#114B46",
      },
      {
        step: 500,
        cssVar: "--ds-teal-500",
        lightValue: "#99E8DA",
        darkValue: "#175A54",
      },
      {
        step: 600,
        cssVar: "--ds-teal-600",
        lightValue: "#66D9C3",
        darkValue: "#12A594",
      },
      {
        step: 700,
        cssVar: "--ds-teal-700",
        lightValue: "#1AA390",
        darkValue: "#0DB09C",
      },
      {
        step: 800,
        cssVar: "--ds-teal-800",
        lightValue: "#118B7A",
        darkValue: "#10C0AC",
      },
      {
        step: 900,
        cssVar: "--ds-teal-900",
        lightValue: "#0C786A",
        darkValue: "#61DFC8",
      },
      {
        step: 1000,
        cssVar: "--ds-teal-1000",
        lightValue: "#123D35",
        darkValue: "#BFFAEA",
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
        darkValue: "#1F1528",
      },
      {
        step: 200,
        cssVar: "--ds-purple-200",
        lightValue: "#FAF0FF",
        darkValue: "#291A38",
      },
      {
        step: 300,
        cssVar: "--ds-purple-300",
        lightValue: "#F2E6FD",
        darkValue: "#3B1F52",
      },
      {
        step: 400,
        cssVar: "--ds-purple-400",
        lightValue: "#E6D7FA",
        darkValue: "#482467",
      },
      {
        step: 500,
        cssVar: "--ds-purple-500",
        lightValue: "#C8AAF5",
        darkValue: "#5A2D80",
      },
      {
        step: 600,
        cssVar: "--ds-purple-600",
        lightValue: "#A573EB",
        darkValue: "#8E4EC6",
      },
      {
        step: 700,
        cssVar: "--ds-purple-700",
        lightValue: "#7928CA",
        darkValue: "#9D5BD2",
      },
      {
        step: 800,
        cssVar: "--ds-purple-800",
        lightValue: "#641EAA",
        darkValue: "#AB6BE5",
      },
      {
        step: 900,
        cssVar: "--ds-purple-900",
        lightValue: "#5D1EA8",
        darkValue: "#D19DFF",
      },
      {
        step: 1000,
        cssVar: "--ds-purple-1000",
        lightValue: "#280F48",
        darkValue: "#F1DFFF",
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
        darkValue: "#27141D",
      },
      {
        step: 200,
        cssVar: "--ds-pink-200",
        lightValue: "#FFEDF3",
        darkValue: "#351526",
      },
      {
        step: 300,
        cssVar: "--ds-pink-300",
        lightValue: "#FDE1EC",
        darkValue: "#4F1534",
      },
      {
        step: 400,
        cssVar: "--ds-pink-400",
        lightValue: "#FAD7E6",
        darkValue: "#62163F",
      },
      {
        step: 500,
        cssVar: "--ds-pink-500",
        lightValue: "#F2B9D2",
        darkValue: "#781B4E",
      },
      {
        step: 600,
        cssVar: "--ds-pink-600",
        lightValue: "#EB82AF",
        darkValue: "#D93A83",
      },
      {
        step: 700,
        cssVar: "--ds-pink-700",
        lightValue: "#EB377D",
        darkValue: "#E24694",
      },
      {
        step: 800,
        cssVar: "--ds-pink-800",
        lightValue: "#DA2D73",
        darkValue: "#EB5AA3",
      },
      {
        step: 900,
        cssVar: "--ds-pink-900",
        lightValue: "#B92D64",
        darkValue: "#FF8EC5",
      },
      {
        step: 1000,
        cssVar: "--ds-pink-1000",
        lightValue: "#3C1426",
        darkValue: "#FFD6EA",
      },
    ],
  },
];

// Toast context for showing copy notifications
const ToastContext = React.createContext<{
  showToast: (message: string) => void;
}>({
  showToast: () => {},
});

// Toast component
function Toast({
  message,
  visible,
  onDismiss,
}: {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-borderDefault"
        style={{
          background: "var(--ds-background-100)",
        }}
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-textDefault">{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
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
              d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Toast provider component
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, visible: true });

    // Auto-hide after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={dismissToast}
      />
    </ToastContext.Provider>
  );
}

// Color swatch component
function ColorSwatch({
  cssVar,
}: {
  step: number;
  cssVar: string;
  value: string;
}) {
  const { showToast } = React.useContext(ToastContext);
  const [showTick, setShowTick] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const tokenValue = `var(${cssVar})`;
      navigator.clipboard.writeText(tokenValue);
      showToast(`Copied ${tokenValue}`);

      // Show tick briefly
      setShowTick(true);
      setTimeout(() => setShowTick(false), 600);
    },
    [cssVar, showToast],
  );

  return (
    <button
      className="relative w-full aspect-square md:h-10 md:aspect-auto rounded-sm cursor-copy shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
      style={{ backgroundColor: `var(${cssVar})` }}
      onClick={handleCopy}
      onContextMenu={handleCopy}
    >
      {/* Tick icon on copy */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
          showTick ? "opacity-100" : "opacity-0"
        }`}
      >
        <Check
          size={20}
          strokeWidth={1.5}
          className="text-gray-900 dark:text-white"
        />
      </span>
    </button>
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
  // Pad scales with fewer than 10 steps to align with full scales
  const fullSteps = 10;
  const emptySlots = fullSteps - scale.steps.length;

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
        {/* Empty slots to maintain alignment */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <li key={`empty-${i}`} className="w-full max-w-[68px]">
            <div className="w-full aspect-square md:h-10 md:aspect-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Unified Color Scales Section (like Geist)
function ColorScalesSection({ isDark }: { isDark: boolean }) {
  // All scales in one array for unified display
  const allScales: ColorScale[] = [
    backgroundScale,
    grayScale,
    grayAlphaScale,
    ...accentScales,
  ];

  return (
    <section className="mb-16">
      <SectionHeader id="colour-scales">Colour Scales</SectionHeader>
      <p className="text-base text-textSubtle mt-4 mb-8">
        The complete colour system. Each scale ranges from 100-1000, providing
        consistent tones for backgrounds, borders, text, and accents. Click any
        swatch to copy its value.
      </p>
      <div className="space-y-4">
        {allScales.map((scale) => (
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
    <ToastProvider>
      <div>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-[32px] md:text-[40px] leading-[1.15] font-medium mb-3">
            Colours
          </h1>
          <p
            className="text-base md:text-lg text-textSubtle"
            style={{ lineHeight: 1.5 }}
          >
            Learn how to work with our color system. Click any swatch to copy
            its value.
          </p>
        </div>

        {/* Main content sections - ordered like Geist */}
        <ColorScalesSection isDark={isDark} />
        <BackgroundsSection />
        <ComponentBackgroundsSection />
        <BordersSection />
        <SolidColorsSection />
        <TextAndIconsSection />
        <MigrationSection />
      </div>
    </ToastProvider>
  );
}

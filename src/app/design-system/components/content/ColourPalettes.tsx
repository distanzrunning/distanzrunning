"use client";

import { useState, useCallback, useEffect } from "react";

// Color data with both light and dark mode values
interface ColorValue {
  light: string;
  dark: string;
}

interface ColorStep {
  step: number;
  cssVar: string;
  values: ColorValue;
}

interface ColorScale {
  name: string;
  id: string;
  steps: ColorStep[];
}

// Background colors
const backgroundScale: ColorScale = {
  name: "Backgrounds",
  id: "background",
  steps: [
    {
      step: 100,
      cssVar: "--ds-background-100",
      values: { light: "#FAF9F5", dark: "#1F1E1C" },
    },
    {
      step: 200,
      cssVar: "--ds-background-200",
      values: { light: "#F5F4ED", dark: "#363530" },
    },
  ],
};

// Gray scale
const grayScale: ColorScale = {
  name: "Gray",
  id: "gray",
  steps: [
    {
      step: 100,
      cssVar: "--ds-gray-100",
      values: { light: "#FAF9F5", dark: "#FAF9F5" },
    },
    {
      step: 200,
      cssVar: "--ds-gray-200",
      values: { light: "#F5F4ED", dark: "#F5F4ED" },
    },
    {
      step: 300,
      cssVar: "--ds-gray-300",
      values: { light: "#EBE9DC", dark: "#EBE9DC" },
    },
    {
      step: 400,
      cssVar: "--ds-gray-400",
      values: { light: "#DDDACB", dark: "#DDDACB" },
    },
    {
      step: 500,
      cssVar: "--ds-gray-500",
      values: { light: "#C1BEAF", dark: "#C1BEAF" },
    },
    {
      step: 600,
      cssVar: "--ds-gray-600",
      values: { light: "#A5A295", dark: "#A5A295" },
    },
    {
      step: 700,
      cssVar: "--ds-gray-700",
      values: { light: "#7E7B6F", dark: "#7E7B6F" },
    },
    {
      step: 800,
      cssVar: "--ds-gray-800",
      values: { light: "#5A574F", dark: "#5A574F" },
    },
    {
      step: 900,
      cssVar: "--ds-gray-900",
      values: { light: "#363530", dark: "#363530" },
    },
    {
      step: 1000,
      cssVar: "--ds-gray-1000",
      values: { light: "#1F1E1C", dark: "#1F1E1C" },
    },
  ],
};

// Gray Alpha scale
const grayAlphaScale: ColorScale = {
  name: "Gray Alpha",
  id: "gray-alpha",
  steps: [
    {
      step: 100,
      cssVar: "--ds-gray-alpha-100",
      values: { light: "rgba(90,87,79,0.02)", dark: "rgba(250,249,245,0.02)" },
    },
    {
      step: 200,
      cssVar: "--ds-gray-alpha-200",
      values: { light: "rgba(90,87,79,0.04)", dark: "rgba(250,249,245,0.04)" },
    },
    {
      step: 300,
      cssVar: "--ds-gray-alpha-300",
      values: { light: "rgba(90,87,79,0.07)", dark: "rgba(250,249,245,0.07)" },
    },
    {
      step: 400,
      cssVar: "--ds-gray-alpha-400",
      values: { light: "rgba(90,87,79,0.12)", dark: "rgba(250,249,245,0.12)" },
    },
    {
      step: 500,
      cssVar: "--ds-gray-alpha-500",
      values: { light: "rgba(90,87,79,0.20)", dark: "rgba(250,249,245,0.20)" },
    },
    {
      step: 600,
      cssVar: "--ds-gray-alpha-600",
      values: { light: "rgba(90,87,79,0.32)", dark: "rgba(250,249,245,0.32)" },
    },
    {
      step: 700,
      cssVar: "--ds-gray-alpha-700",
      values: { light: "rgba(90,87,79,0.48)", dark: "rgba(250,249,245,0.48)" },
    },
    {
      step: 800,
      cssVar: "--ds-gray-alpha-800",
      values: { light: "rgba(90,87,79,0.64)", dark: "rgba(250,249,245,0.64)" },
    },
    {
      step: 900,
      cssVar: "--ds-gray-alpha-900",
      values: { light: "rgba(90,87,79,0.80)", dark: "rgba(250,249,245,0.80)" },
    },
    {
      step: 1000,
      cssVar: "--ds-gray-alpha-1000",
      values: { light: "rgba(90,87,79,0.92)", dark: "rgba(250,249,245,0.92)" },
    },
  ],
};

// Pink scale (Electric Pink - Primary)
const pinkScale: ColorScale = {
  name: "Pink",
  id: "pink",
  steps: [
    {
      step: 100,
      cssVar: "--ds-pink-100",
      values: { light: "#FDF2F6", dark: "#FDF2F6" },
    },
    {
      step: 200,
      cssVar: "--ds-pink-200",
      values: { light: "#FAE9F0", dark: "#FAE9F0" },
    },
    {
      step: 300,
      cssVar: "--ds-pink-300",
      values: { light: "#F5D2E1", dark: "#F5D2E1" },
    },
    {
      step: 400,
      cssVar: "--ds-pink-400",
      values: { light: "#EEB6CD", dark: "#EEB6CD" },
    },
    {
      step: 500,
      cssVar: "--ds-pink-500",
      values: { light: "#E08AAF", dark: "#E08AAF" },
    },
    {
      step: 600,
      cssVar: "--ds-pink-600",
      values: { light: "#D11B5C", dark: "#D11B5C" },
    },
    {
      step: 700,
      cssVar: "--ds-pink-700",
      values: { light: "#B8164F", dark: "#B8164F" },
    },
    {
      step: 800,
      cssVar: "--ds-pink-800",
      values: { light: "#8E1240", dark: "#8E1240" },
    },
    {
      step: 900,
      cssVar: "--ds-pink-900",
      values: { light: "#6A0D30", dark: "#6A0D30" },
    },
    {
      step: 1000,
      cssVar: "--ds-pink-1000",
      values: { light: "#450820", dark: "#450820" },
    },
  ],
};

// Purple scale (Pace Purple - Secondary)
const purpleScale: ColorScale = {
  name: "Purple",
  id: "purple",
  steps: [
    {
      step: 100,
      cssVar: "--ds-purple-100",
      values: { light: "#F8F5FD", dark: "#F8F5FD" },
    },
    {
      step: 200,
      cssVar: "--ds-purple-200",
      values: { light: "#EDEBFA", dark: "#EDEBFA" },
    },
    {
      step: 300,
      cssVar: "--ds-purple-300",
      values: { light: "#DBD6F5", dark: "#DBD6F5" },
    },
    {
      step: 400,
      cssVar: "--ds-purple-400",
      values: { light: "#C4B8EE", dark: "#C4B8EE" },
    },
    {
      step: 500,
      cssVar: "--ds-purple-500",
      values: { light: "#A68DE6", dark: "#A68DE6" },
    },
    {
      step: 600,
      cssVar: "--ds-purple-600",
      values: { light: "#5E3FD1", dark: "#5E3FD1" },
    },
    {
      step: 700,
      cssVar: "--ds-purple-700",
      values: { light: "#452BB8", dark: "#452BB8" },
    },
    {
      step: 800,
      cssVar: "--ds-purple-800",
      values: { light: "#36208F", dark: "#36208F" },
    },
    {
      step: 900,
      cssVar: "--ds-purple-900",
      values: { light: "#271666", dark: "#271666" },
    },
    {
      step: 1000,
      cssVar: "--ds-purple-1000",
      values: { light: "#180D3D", dark: "#180D3D" },
    },
  ],
};

// Green scale (Volt Green - Success)
const greenScale: ColorScale = {
  name: "Green",
  id: "green",
  steps: [
    {
      step: 100,
      cssVar: "--ds-green-100",
      values: { light: "#F2FDF6", dark: "#F2FDF6" },
    },
    {
      step: 200,
      cssVar: "--ds-green-200",
      values: { light: "#E6FAEF", dark: "#E6FAEF" },
    },
    {
      step: 300,
      cssVar: "--ds-green-300",
      values: { light: "#CCF5E0", dark: "#CCF5E0" },
    },
    {
      step: 400,
      cssVar: "--ds-green-400",
      values: { light: "#A3EDCA", dark: "#A3EDCA" },
    },
    {
      step: 500,
      cssVar: "--ds-green-500",
      values: { light: "#6AE0A8", dark: "#6AE0A8" },
    },
    {
      step: 600,
      cssVar: "--ds-green-600",
      values: { light: "#008C47", dark: "#008C47" },
    },
    {
      step: 700,
      cssVar: "--ds-green-700",
      values: { light: "#00733A", dark: "#00733A" },
    },
    {
      step: 800,
      cssVar: "--ds-green-800",
      values: { light: "#005A2E", dark: "#005A2E" },
    },
    {
      step: 900,
      cssVar: "--ds-green-900",
      values: { light: "#004122", dark: "#004122" },
    },
    {
      step: 1000,
      cssVar: "--ds-green-1000",
      values: { light: "#002816", dark: "#002816" },
    },
  ],
};

// Blue scale (Tech Cyan)
const blueScale: ColorScale = {
  name: "Blue",
  id: "blue",
  steps: [
    {
      step: 100,
      cssVar: "--ds-blue-100",
      values: { light: "#F2F8FD", dark: "#F2F8FD" },
    },
    {
      step: 200,
      cssVar: "--ds-blue-200",
      values: { light: "#E6F7FA", dark: "#E6F7FA" },
    },
    {
      step: 300,
      cssVar: "--ds-blue-300",
      values: { light: "#CCF0F5", dark: "#CCF0F5" },
    },
    {
      step: 400,
      cssVar: "--ds-blue-400",
      values: { light: "#A3E4ED", dark: "#A3E4ED" },
    },
    {
      step: 500,
      cssVar: "--ds-blue-500",
      values: { light: "#6AD0E0", dark: "#6AD0E0" },
    },
    {
      step: 600,
      cssVar: "--ds-blue-600",
      values: { light: "#008CB8", dark: "#008CB8" },
    },
    {
      step: 700,
      cssVar: "--ds-blue-700",
      values: { light: "#007399", dark: "#007399" },
    },
    {
      step: 800,
      cssVar: "--ds-blue-800",
      values: { light: "#005A7A", dark: "#005A7A" },
    },
    {
      step: 900,
      cssVar: "--ds-blue-900",
      values: { light: "#00415B", dark: "#00415B" },
    },
    {
      step: 1000,
      cssVar: "--ds-blue-1000",
      values: { light: "#00283C", dark: "#00283C" },
    },
  ],
};

// Red scale (Track Red - Error)
const redScale: ColorScale = {
  name: "Red",
  id: "red",
  steps: [
    {
      step: 100,
      cssVar: "--ds-red-100",
      values: { light: "#FDF5F2", dark: "#FDF5F2" },
    },
    {
      step: 200,
      cssVar: "--ds-red-200",
      values: { light: "#FAE9E9", dark: "#FAE9E9" },
    },
    {
      step: 300,
      cssVar: "--ds-red-300",
      values: { light: "#F5D2D2", dark: "#F5D2D2" },
    },
    {
      step: 400,
      cssVar: "--ds-red-400",
      values: { light: "#EDB8B8", dark: "#EDB8B8" },
    },
    {
      step: 500,
      cssVar: "--ds-red-500",
      values: { light: "#E08A8A", dark: "#E08A8A" },
    },
    {
      step: 600,
      cssVar: "--ds-red-600",
      values: { light: "#D11B1B", dark: "#D11B1B" },
    },
    {
      step: 700,
      cssVar: "--ds-red-700",
      values: { light: "#B81616", dark: "#B81616" },
    },
    {
      step: 800,
      cssVar: "--ds-red-800",
      values: { light: "#8E1212", dark: "#8E1212" },
    },
    {
      step: 900,
      cssVar: "--ds-red-900",
      values: { light: "#6A0D0D", dark: "#6A0D0D" },
    },
    {
      step: 1000,
      cssVar: "--ds-red-1000",
      values: { light: "#450808", dark: "#450808" },
    },
  ],
};

// Amber scale (Warning)
const amberScale: ColorScale = {
  name: "Amber",
  id: "amber",
  steps: [
    {
      step: 100,
      cssVar: "--ds-amber-100",
      values: { light: "#FEFBF2", dark: "#FEFBF2" },
    },
    {
      step: 200,
      cssVar: "--ds-amber-200",
      values: { light: "#FDF5E0", dark: "#FDF5E0" },
    },
    {
      step: 300,
      cssVar: "--ds-amber-300",
      values: { light: "#FBEBC4", dark: "#FBEBC4" },
    },
    {
      step: 400,
      cssVar: "--ds-amber-400",
      values: { light: "#F5D88A", dark: "#F5D88A" },
    },
    {
      step: 500,
      cssVar: "--ds-amber-500",
      values: { light: "#EBC04A", dark: "#EBC04A" },
    },
    {
      step: 600,
      cssVar: "--ds-amber-600",
      values: { light: "#D69E0A", dark: "#D69E0A" },
    },
    {
      step: 700,
      cssVar: "--ds-amber-700",
      values: { light: "#B38208", dark: "#B38208" },
    },
    {
      step: 800,
      cssVar: "--ds-amber-800",
      values: { light: "#8C6606", dark: "#8C6606" },
    },
    {
      step: 900,
      cssVar: "--ds-amber-900",
      values: { light: "#664A04", dark: "#664A04" },
    },
    {
      step: 1000,
      cssVar: "--ds-amber-1000",
      values: { light: "#402E02", dark: "#402E02" },
    },
  ],
};

// Teal scale
const tealScale: ColorScale = {
  name: "Teal",
  id: "teal",
  steps: [
    {
      step: 100,
      cssVar: "--ds-teal-100",
      values: { light: "#F2FDFC", dark: "#F2FDFC" },
    },
    {
      step: 200,
      cssVar: "--ds-teal-200",
      values: { light: "#E6FAF8", dark: "#E6FAF8" },
    },
    {
      step: 300,
      cssVar: "--ds-teal-300",
      values: { light: "#CCF5F0", dark: "#CCF5F0" },
    },
    {
      step: 400,
      cssVar: "--ds-teal-400",
      values: { light: "#A3EDE4", dark: "#A3EDE4" },
    },
    {
      step: 500,
      cssVar: "--ds-teal-500",
      values: { light: "#6AE0D3", dark: "#6AE0D3" },
    },
    {
      step: 600,
      cssVar: "--ds-teal-600",
      values: { light: "#0D9488", dark: "#0D9488" },
    },
    {
      step: 700,
      cssVar: "--ds-teal-700",
      values: { light: "#0A7A70", dark: "#0A7A70" },
    },
    {
      step: 800,
      cssVar: "--ds-teal-800",
      values: { light: "#086058", dark: "#086058" },
    },
    {
      step: 900,
      cssVar: "--ds-teal-900",
      values: { light: "#054640", dark: "#054640" },
    },
    {
      step: 1000,
      cssVar: "--ds-teal-1000",
      values: { light: "#032C28", dark: "#032C28" },
    },
  ],
};

// All scales array
const allScales = [
  backgroundScale,
  grayScale,
  grayAlphaScale,
  pinkScale,
  purpleScale,
  greenScale,
  blueScale,
  redScale,
  amberScale,
  tealScale,
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

// Color swatch button component
function ColorSwatch({
  step,
  cssVar,
  value,
  isDark,
}: {
  step: number;
  cssVar: string;
  value: string;
  isDark: boolean;
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

  const handleContextMenu = useCallback(
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
        onContextMenu={handleContextMenu}
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
              value={isDark ? step.values.dark : step.values.light}
              isDark={isDark}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Usage section component
function UsageSection() {
  return (
    <section className="mt-16">
      <h2
        id="usage"
        className="font-serif text-[28px] leading-[1.2] font-medium mb-4 scroll-mt-32"
      >
        Usage
      </h2>
      <hr className="border-t border-borderDefault mb-6" />

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-semibold text-textDefault mb-2">
            Scale ranges
          </h3>
          <p className="text-sm text-textSubtle mb-4">
            Each color scale follows a consistent structure for predictable
            usage:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surfaceSubtle">
              <code className="text-sm font-mono text-pink-600">100-300</code>
              <p className="text-sm text-textSubtle mt-1">
                Backgrounds, subtle fills, hover states
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surfaceSubtle">
              <code className="text-sm font-mono text-pink-600">400-600</code>
              <p className="text-sm text-textSubtle mt-1">
                Borders, from subtle to prominent
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surfaceSubtle">
              <code className="text-sm font-mono text-pink-600">700-800</code>
              <p className="text-sm text-textSubtle mt-1">
                Solid backgrounds, high contrast fills
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surfaceSubtle">
              <code className="text-sm font-mono text-pink-600">900-1000</code>
              <p className="text-sm text-textSubtle mt-1">Text and icons</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-textDefault mb-2">
            CSS Variables
          </h3>
          <p className="text-sm text-textSubtle mb-4">
            Use CSS custom properties to reference colors. They automatically
            adapt to light/dark mode:
          </p>
          <div className="bg-gray-900 dark:bg-gray-100 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-100 dark:text-gray-900">
              {`.element {
  background: var(--ds-gray-100);
  border-color: var(--ds-gray-400);
  color: var(--ds-gray-1000);
}`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-textDefault mb-2">
            Tailwind Classes
          </h3>
          <p className="text-sm text-textSubtle mb-4">
            Colors are available as Tailwind utility classes:
          </p>
          <div className="bg-gray-900 dark:bg-gray-100 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-100 dark:text-gray-900">
              {`<div className="bg-gray-100 border-gray-400 text-gray-1000">
  Content
</div>`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

// Semantic colors section
function SemanticSection() {
  return (
    <section className="mt-16">
      <h2
        id="semantic"
        className="font-serif text-[28px] leading-[1.2] font-medium mb-4 scroll-mt-32"
      >
        Semantic Colors
      </h2>
      <hr className="border-t border-borderDefault mb-6" />

      <p className="text-sm text-textSubtle mb-6">
        Semantic tokens map color scales to specific purposes. They
        automatically switch values between light and dark modes.
      </p>

      <div className="space-y-4">
        {/* Text colors */}
        <div className="p-4 rounded-lg border border-borderSubtle">
          <h3 className="text-sm font-semibold text-textDefault mb-3">Text</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-textDefault" />
              <span className="text-xs font-mono text-textSubtle">
                textDefault
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-textSubtle" />
              <span className="text-xs font-mono text-textSubtle">
                textSubtle
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-textSubtler" />
              <span className="text-xs font-mono text-textSubtle">
                textSubtler
              </span>
            </div>
          </div>
        </div>

        {/* Surface colors */}
        <div className="p-4 rounded-lg border border-borderSubtle">
          <h3 className="text-sm font-semibold text-textDefault mb-3">
            Surfaces
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-canvas border border-borderSubtle" />
              <span className="text-xs font-mono text-textSubtle">canvas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-surface border border-borderSubtle" />
              <span className="text-xs font-mono text-textSubtle">surface</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-surfaceSubtle border border-borderSubtle" />
              <span className="text-xs font-mono text-textSubtle">
                surfaceSubtle
              </span>
            </div>
          </div>
        </div>

        {/* Border colors */}
        <div className="p-4 rounded-lg border border-borderSubtle">
          <h3 className="text-sm font-semibold text-textDefault mb-3">
            Borders
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border-2 border-borderDefault" />
              <span className="text-xs font-mono text-textSubtle">
                borderDefault
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border-2 border-borderSubtle" />
              <span className="text-xs font-mono text-textSubtle">
                borderSubtle
              </span>
            </div>
          </div>
        </div>

        {/* Status colors */}
        <div className="p-4 rounded-lg border border-borderSubtle">
          <h3 className="text-sm font-semibold text-textDefault mb-3">
            Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded bg-success-bg border border-success-border">
              <span className="text-xs font-semibold text-success-text">
                Success
              </span>
            </div>
            <div className="p-3 rounded bg-warning-bg border border-warning-border">
              <span className="text-xs font-semibold text-warning-text">
                Warning
              </span>
            </div>
            <div className="p-3 rounded bg-error-bg border border-error-border">
              <span className="text-xs font-semibold text-error-text">
                Error
              </span>
            </div>
            <div className="p-3 rounded bg-info-bg border border-info-border">
              <span className="text-xs font-semibold text-info-text">Info</span>
            </div>
          </div>
        </div>
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
    <section className="mt-16">
      <h2
        id="migration"
        className="font-serif text-[28px] leading-[1.2] font-medium mb-4 scroll-mt-32"
      >
        Migration
      </h2>
      <hr className="border-t border-borderDefault mb-6" />

      <p className="text-sm text-textSubtle mb-6">
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
      <div className="mb-8">
        <h1 className="font-serif text-[32px] md:text-[40px] leading-[1.15] font-medium mb-3">
          Colors
        </h1>
        <p
          className="text-base md:text-lg text-textSubtle"
          style={{ lineHeight: 1.5 }}
        >
          Learn how to work with our color system. Right click to copy raw
          values.
        </p>
      </div>

      {/* Scales Section */}
      <section>
        <h2
          id="scales"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-4 scroll-mt-32"
        >
          Scales
        </h2>
        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-sm text-textSubtle mb-8">
          There are 10 color scales in the system. Colors automatically adapt to
          light and dark modes.
        </p>

        <div className="space-y-6">
          {allScales.map((scale) => (
            <ColorScaleRow key={scale.id} scale={scale} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* Usage Section */}
      <UsageSection />

      {/* Semantic Section */}
      <SemanticSection />

      {/* Migration Section */}
      <MigrationSection />
    </div>
  );
}

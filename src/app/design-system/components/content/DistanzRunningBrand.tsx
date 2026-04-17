"use client";

import { useState, useCallback } from "react";
import { Section } from "../ContentWithTOC";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Download, Copy, Check } from "lucide-react";

const LinkIcon = () => (
  <svg
    height="14"
    width="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    style={{ color: "currentcolor" }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.46968 1.46968C10.1433 -0.203925 12.8567 -0.203923 14.5303 1.46968C16.2039 3.14329 16.2039 5.85674 14.5303 7.53034L12.0303 10.0303L10.9697 8.96968L13.4697 6.46968C14.5575 5.38186 14.5575 3.61816 13.4697 2.53034C12.3819 1.44252 10.6182 1.44252 9.53034 2.53034L7.03034 5.03034L5.96968 3.96968L8.46968 1.46968ZM11.5303 5.53034L5.53034 11.5303L4.46968 10.4697L10.4697 4.46968L11.5303 5.53034ZM1.46968 14.5303C3.14329 16.2039 5.85673 16.204 7.53034 14.5303L10.0303 12.0303L8.96968 10.9697L6.46968 13.4697C5.38186 14.5575 3.61816 14.5575 2.53034 13.4697C1.44252 12.3819 1.44252 10.6182 2.53034 9.53034L5.03034 7.03034L3.96968 5.96968L1.46968 8.46968C-0.203923 10.1433 -0.203925 12.8567 1.46968 14.5303Z"
    />
  </svg>
);

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <a
      id={id}
      href={`#${id}`}
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none"
      style={{ scrollMarginTop: 32 }}
    >
      <h2 className="text-heading-24">
        <div className="absolute left-0 top-[8px] opacity-0 group-hover:opacity-100 group-focus:opacity-100">
          <LinkIcon />
        </div>
        {title}
      </h2>
    </a>
  );
}

function CopyButton({ text, variant = "light" }: { text: string; variant?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code"
      className={`absolute right-4 top-4 opacity-0 focus:opacity-100 group-hover:opacity-100 transition-opacity ${variant === "light" ? "ds-copy-btn-on-white" : "ds-copy-btn-on-black"}`}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

// The SVG markup that gets copied to clipboard
const blackLogoSvg = `<img src="/images/Distanz_Logo_1600_600_Black.svg" alt="Distanz Running" height="64" />`;
const whiteLogoSvg = `<img src="/images/Distanz_Logo_1600_600_White.svg" alt="Distanz Running" height="64" />`;
const blackMarkSvg = `<img src="/images/distanz_icon_black.svg" alt="Distanz Running" height="32" />`;
const whiteMarkSvg = `<img src="/images/distanz_icon_white.svg" alt="Distanz Running" height="32" />`;

export default function DistanzRunningBrand() {
  return (
    <div>
      {/* Distanz Running heading */}
      <Section>
        <div className="flex flex-col">
          <SectionHeading id="distanz-running-logo" title="Distanz Running" />
          <p className="text-copy-16 mt-4" style={{ color: "var(--ds-gray-900)" }}>
            The Distanz Running trademark includes the Distanz Running name &amp; logo.
            Please don&apos;t modify the trademarks or use them in an altered way,
            including suggesting sponsorship or endorsement by Distanz Running, or in a
            way that confuses Distanz Running with another brand.
          </p>
          <div className="mt-4 w-fit">
            <Button
              variant="secondary"
              shape="rounded"
              shadow
              prefixIcon={<Download size={16} />}
              onClick={() => {/* TODO: link to hosted assets */}}
            >
              Download Distanz Assets
            </Button>
          </div>
        </div>
      </Section>

      {/* Logo on white background */}
      <div
        className="group relative flex justify-center py-14 md:py-28"
        style={{
          background: "#fff",
        }}
      >
        <CopyButton text={blackLogoSvg} variant="light" />
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_1600_600_Black.svg"
            alt="Distanz Running Logo - Black"
            style={{ height: 96, width: "auto" }}
          />
        </div>
      </div>

      {/* Logo on black background */}
      <div
        className="group relative flex items-center justify-center py-14 md:py-28"
        style={{
          background: "#000",
        }}
      >
        <CopyButton text={whiteLogoSvg} variant="dark" />
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_1600_600_White.svg"
            alt="Distanz Running Logo - White"
            style={{ height: 96, width: "auto" }}
          />
        </div>
      </div>

      {/* Code block for logo usage */}
      <div
        style={{ borderTop: "1px solid var(--ds-gray-400)", borderBottom: "1px solid var(--ds-gray-400)" }}
        className="[&>div]:border-0 [&>div]:rounded-none"
      >
        <CodeBlock
          code={`import { DistanzWordmark } from '@/components/logos';\n\n<DistanzWordmark height={64} />`}
          language="jsx"
          showLineNumbers={false}
        />
      </div>

      {/* Symbol heading */}
      <Section>
        <div className="flex flex-col">
          <SectionHeading id="symbol" title="Symbol" />
          <p className="text-copy-16 mt-4" style={{ color: "var(--ds-gray-900)" }}>
            The Distanz Running symbol should only be used in places where there is not
            enough room to display the full logo, or in cases where only brand symbols
            are displayed.
          </p>
        </div>
      </Section>

      {/* Symbol display — 2 column grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
      >
        {/* White bg */}
        <div
          className="group relative flex h-[164px] items-center justify-center md:h-[200px]"
          style={{ background: "#fff" }}
        >
          <CopyButton text={blackMarkSvg} variant="light" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/distanz_icon_black.svg"
            alt="Distanz Running Symbol - Black"
            style={{ height: 32 }}
          />
        </div>
        {/* Black bg */}
        <div
          className="group relative flex h-[164px] items-center justify-center md:h-[200px]"
          style={{ background: "#000" }}
        >
          <CopyButton text={whiteMarkSvg} variant="dark" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/distanz_icon_white.svg"
            alt="Distanz Running Symbol - White"
            style={{ height: 32 }}
          />
        </div>
      </div>

      {/* Code block for symbol usage */}
      <div
        style={{ borderTop: "1px solid var(--ds-gray-400)", borderBottom: "1px solid var(--ds-gray-400)" }}
        className="[&>div]:border-0 [&>div]:rounded-none"
      >
        <CodeBlock
          code={`import { DistanzMark } from '@/components/logos';\n\n<DistanzMark size={32} />`}
          language="jsx"
          showLineNumbers={false}
        />
      </div>

      {/* Spacing considerations */}
      <Section>
        <div className="flex flex-col">
          <SectionHeading id="spacing-considerations" title="Spacing considerations" />
          <p className="text-copy-16 mt-4" style={{ color: "var(--ds-gray-900)" }}>
            The safety area surrounding the Primary Logo is defined by the height of our
            symbol.
          </p>
        </div>
      </Section>

      {/* Spacing diagram */}
      <div style={{ borderBottom: "1px solid var(--ds-gray-400)" }}>
        <div className="flex justify-center" style={{ background: "var(--ds-background-100)" }}>
          <svg fill="none" viewBox="0 0 720 361" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: -1, width: "100%" }}>
            <title>Distanz Spacing Consideration</title>
            <rect x="0.5" y="0.87" width="719" height="359" fill="var(--ds-background-100)" />

            {/* Main icon — center, solid */}
            <g transform="translate(310, 130) scale(0.2)">
              <path fill="var(--ds-gray-1000)" d="M 189.46 98.96 A 90.59 90.59 0 0 1 98.87 189.55 A 90.59 90.59 0 0 1 8.28 98.96 A 90.59 90.59 0 0 1 98.87 8.37 A 90.59 90.59 0 0 1 189.46 98.96 Z M 71.28 111.19 Q 74.15 117.57 78.51 121.31 Q 88.63 129.98 101.09 129.05 Q 108.34 128.50 114.37 124.82 Q 120.51 121.08 124.35 115.05 Q 130.01 106.18 128.79 95.44 Q 127.64 85.27 120.01 77.33 A 4.31 4.31 0 0 0 119.04 76.57 Q 117.48 75.65 117.39 75.49 Q 116.62 74.15 113.33 72.41 Q 103.02 66.92 91.77 69.63 Q 79.61 72.55 73.03 83.41 C 68.03 91.65 67.23 102.18 71.28 111.19 Z" />
              <path fill="var(--ds-gray-1000)" d="M 261.32 277.89 Q 261.25 277.93 261.18 277.96 Q 216.69 298.07 148.13 328.86 Q 142.30 331.48 136.72 338.02 Q 131.87 343.72 130.09 351.07 Q 125.98 368.11 137.19 381.57 Q 142.93 388.45 152.87 391.93 Q 158.13 393.77 171.34 393.53 Q 174.34 393.47 228.36 393.45 Q 239.73 393.44 243.96 394.90 Q 251.03 397.32 256.35 402.62 Q 261.50 407.74 263.62 415.18 C 268.16 431.03 259.74 447.08 244.16 452.43 Q 239.48 454.04 226.30 454.03 Q 170.70 454.01 164.75 453.83 Q 164.00 453.80 157.76 453.65 Q 154.17 453.57 150.71 453.09 Q 125.39 449.60 105.28 434.23 C 88.14 421.13 76.22 402.44 71.14 381.54 Q 66.14 360.99 70.54 340.03 Q 74.76 319.95 87.21 303.20 Q 102.22 283.00 125.82 272.56 Q 129.44 270.96 236.72 222.83 Q 238.29 222.13 238.35 222.10 Q 238.43 222.07 238.50 222.03 Q 282.98 201.92 351.54 171.13 Q 357.37 168.51 362.95 161.97 Q 367.80 156.27 369.58 148.92 Q 373.69 131.88 362.48 118.42 Q 356.74 111.54 346.80 108.06 Q 341.54 106.22 328.33 106.46 Q 325.33 106.52 271.31 106.54 Q 259.94 106.55 255.71 105.09 Q 248.64 102.67 243.32 97.37 Q 238.17 92.25 236.05 84.81 C 231.51 68.96 239.93 52.91 255.51 47.56 Q 260.19 45.95 273.37 45.96 Q 328.97 45.98 334.92 46.16 Q 335.67 46.19 341.91 46.34 Q 345.50 46.42 348.96 46.90 Q 374.28 50.39 394.39 65.76 C 411.53 78.86 423.45 97.55 428.53 118.45 Q 433.53 139.00 429.13 159.96 Q 424.91 180.04 412.46 196.79 Q 397.45 216.99 373.85 227.43 Q 370.23 229.03 262.96 277.16 Q 261.38 277.87 261.32 277.89 Z" />
              <path fill="var(--ds-gray-1000)" d="M 491.45 401.03 A 90.59 90.59 0 0 1 400.86 491.62 A 90.59 90.59 0 0 1 310.27 401.03 A 90.59 90.59 0 0 1 400.86 310.44 A 90.59 90.59 0 0 1 491.45 401.03 Z M 373.29 413.26 Q 376.16 419.64 380.52 423.38 Q 390.64 432.05 403.09 431.12 Q 410.34 430.57 416.37 426.89 Q 422.51 423.15 426.35 417.12 Q 432.01 408.25 430.79 397.52 Q 429.64 387.35 422.01 379.41 A 4.31 4.30 -6.9 0 0 421.04 378.65 Q 419.48 377.73 419.39 377.57 Q 418.62 376.23 415.33 374.49 Q 405.02 369.00 393.78 371.71 Q 381.62 374.63 375.04 385.49 C 370.04 393.73 369.24 404.25 373.29 413.26 Z" />
            </g>

            {/* Ghost icons — faded copies showing safety zone */}
            {/* Top */}
            <g transform="translate(310, 30) scale(0.2)" opacity="0.15">
              <path fill="var(--ds-gray-1000)" d="M 189.46 98.96 A 90.59 90.59 0 0 1 98.87 189.55 A 90.59 90.59 0 0 1 8.28 98.96 A 90.59 90.59 0 0 1 98.87 8.37 A 90.59 90.59 0 0 1 189.46 98.96 Z" />
              <path fill="var(--ds-gray-1000)" d="M 491.45 401.03 A 90.59 90.59 0 0 1 400.86 491.62 A 90.59 90.59 0 0 1 310.27 401.03 A 90.59 90.59 0 0 1 400.86 310.44 A 90.59 90.59 0 0 1 491.45 401.03 Z" />
            </g>
            {/* Bottom */}
            <g transform="translate(310, 230) scale(0.2)" opacity="0.15">
              <path fill="var(--ds-gray-1000)" d="M 189.46 98.96 A 90.59 90.59 0 0 1 98.87 189.55 A 90.59 90.59 0 0 1 8.28 98.96 A 90.59 90.59 0 0 1 98.87 8.37 A 90.59 90.59 0 0 1 189.46 98.96 Z" />
              <path fill="var(--ds-gray-1000)" d="M 491.45 401.03 A 90.59 90.59 0 0 1 400.86 491.62 A 90.59 90.59 0 0 1 310.27 401.03 A 90.59 90.59 0 0 1 400.86 310.44 A 90.59 90.59 0 0 1 491.45 401.03 Z" />
            </g>
            {/* Left */}
            <g transform="translate(210, 130) scale(0.2)" opacity="0.15">
              <path fill="var(--ds-gray-1000)" d="M 189.46 98.96 A 90.59 90.59 0 0 1 98.87 189.55 A 90.59 90.59 0 0 1 8.28 98.96 A 90.59 90.59 0 0 1 98.87 8.37 A 90.59 90.59 0 0 1 189.46 98.96 Z" />
              <path fill="var(--ds-gray-1000)" d="M 491.45 401.03 A 90.59 90.59 0 0 1 400.86 491.62 A 90.59 90.59 0 0 1 310.27 401.03 A 90.59 90.59 0 0 1 400.86 310.44 A 90.59 90.59 0 0 1 491.45 401.03 Z" />
            </g>

            {/* Dashed guide lines */}
            <g stroke="#a8a8a8" strokeDasharray="4 8" strokeWidth="0.5">
              {/* Horizontal */}
              <line x1="120" y1="130" x2="600" y2="130" />
              <line x1="120" y1="180" x2="600" y2="180" />
              <line x1="120" y1="230" x2="600" y2="230" />
              <line x1="120" y1="80" x2="600" y2="80" />
              <line x1="120" y1="280" x2="600" y2="280" />
              {/* Vertical */}
              <line x1="310" y1="60" x2="310" y2="300" />
              <line x1="410" y1="60" x2="410" y2="300" />
              <line x1="260" y1="60" x2="260" y2="300" />
              <line x1="460" y1="60" x2="460" y2="300" />
            </g>
          </svg>
        </div>
      </div>

      {/* Partner spacing diagram */}
      <div style={{ borderBottom: "1px solid var(--ds-gray-400)" }}>
        <div className="flex justify-center" style={{ background: "var(--ds-background-100)" }}>
          <svg fill="none" viewBox="0 0 720 361" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: -1, width: "100%" }}>
            <title>Distanz Spacing Partner</title>
            <rect x="0.5" y="0.87" width="719" height="359" fill="var(--ds-background-100)" />

            {/* Distanz icon — left side, solid */}
            <g transform="translate(130, 130) scale(0.2)">
              <path fill="var(--ds-gray-1000)" d="M 189.46 98.96 A 90.59 90.59 0 0 1 98.87 189.55 A 90.59 90.59 0 0 1 8.28 98.96 A 90.59 90.59 0 0 1 98.87 8.37 A 90.59 90.59 0 0 1 189.46 98.96 Z M 71.28 111.19 Q 74.15 117.57 78.51 121.31 Q 88.63 129.98 101.09 129.05 Q 108.34 128.50 114.37 124.82 Q 120.51 121.08 124.35 115.05 Q 130.01 106.18 128.79 95.44 Q 127.64 85.27 120.01 77.33 A 4.31 4.31 0 0 0 119.04 76.57 Q 117.48 75.65 117.39 75.49 Q 116.62 74.15 113.33 72.41 Q 103.02 66.92 91.77 69.63 Q 79.61 72.55 73.03 83.41 C 68.03 91.65 67.23 102.18 71.28 111.19 Z" />
              <path fill="var(--ds-gray-1000)" d="M 261.32 277.89 Q 261.25 277.93 261.18 277.96 Q 216.69 298.07 148.13 328.86 Q 142.30 331.48 136.72 338.02 Q 131.87 343.72 130.09 351.07 Q 125.98 368.11 137.19 381.57 Q 142.93 388.45 152.87 391.93 Q 158.13 393.77 171.34 393.53 Q 174.34 393.47 228.36 393.45 Q 239.73 393.44 243.96 394.90 Q 251.03 397.32 256.35 402.62 Q 261.50 407.74 263.62 415.18 C 268.16 431.03 259.74 447.08 244.16 452.43 Q 239.48 454.04 226.30 454.03 Q 170.70 454.01 164.75 453.83 Q 164.00 453.80 157.76 453.65 Q 154.17 453.57 150.71 453.09 Q 125.39 449.60 105.28 434.23 C 88.14 421.13 76.22 402.44 71.14 381.54 Q 66.14 360.99 70.54 340.03 Q 74.76 319.95 87.21 303.20 Q 102.22 283.00 125.82 272.56 Q 129.44 270.96 236.72 222.83 Q 238.29 222.13 238.35 222.10 Q 238.43 222.07 238.50 222.03 Q 282.98 201.92 351.54 171.13 Q 357.37 168.51 362.95 161.97 Q 367.80 156.27 369.58 148.92 Q 373.69 131.88 362.48 118.42 Q 356.74 111.54 346.80 108.06 Q 341.54 106.22 328.33 106.46 Q 325.33 106.52 271.31 106.54 Q 259.94 106.55 255.71 105.09 Q 248.64 102.67 243.32 97.37 Q 238.17 92.25 236.05 84.81 C 231.51 68.96 239.93 52.91 255.51 47.56 Q 260.19 45.95 273.37 45.96 Q 328.97 45.98 334.92 46.16 Q 335.67 46.19 341.91 46.34 Q 345.50 46.42 348.96 46.90 Q 374.28 50.39 394.39 65.76 C 411.53 78.86 423.45 97.55 428.53 118.45 Q 433.53 139.00 429.13 159.96 Q 424.91 180.04 412.46 196.79 Q 397.45 216.99 373.85 227.43 Q 370.23 229.03 262.96 277.16 Q 261.38 277.87 261.32 277.89 Z" />
              <path fill="var(--ds-gray-1000)" d="M 491.45 401.03 A 90.59 90.59 0 0 1 400.86 491.62 A 90.59 90.59 0 0 1 310.27 401.03 A 90.59 90.59 0 0 1 400.86 310.44 A 90.59 90.59 0 0 1 491.45 401.03 Z M 373.29 413.26 Q 376.16 419.64 380.52 423.38 Q 390.64 432.05 403.09 431.12 Q 410.34 430.57 416.37 426.89 Q 422.51 423.15 426.35 417.12 Q 432.01 408.25 430.79 397.52 Q 429.64 387.35 422.01 379.41 A 4.31 4.30 -6.9 0 0 421.04 378.65 Q 419.48 377.73 419.39 377.57 Q 418.62 376.23 415.33 374.49 Q 405.02 369.00 393.78 371.71 Q 381.62 374.63 375.04 385.49 C 370.04 393.73 369.24 404.25 373.29 413.26 Z" />
            </g>

            {/* Ghost icons — spacing indicators */}
            <g transform="translate(130, 30) scale(0.2)" opacity="0.15">
              <path fill="var(--ds-gray-1000)" d="M 189.46 98.96 A 90.59 90.59 0 0 1 98.87 189.55 A 90.59 90.59 0 0 1 8.28 98.96 A 90.59 90.59 0 0 1 98.87 8.37 A 90.59 90.59 0 0 1 189.46 98.96 Z" />
            </g>
            <g transform="translate(130, 230) scale(0.2)" opacity="0.15">
              <path fill="var(--ds-gray-1000)" d="M 189.46 98.96 A 90.59 90.59 0 0 1 98.87 189.55 A 90.59 90.59 0 0 1 8.28 98.96 A 90.59 90.59 0 0 1 98.87 8.37 A 90.59 90.59 0 0 1 189.46 98.96 Z" />
            </g>

            {/* Plus symbol */}
            <g stroke="#a8a8a8" strokeWidth="0.96">
              <line x1="355" y1="180" x2="361" y2="180" />
              <line x1="367" y1="180" x2="361" y2="180" />
              <line x1="361" y1="174" x2="361" y2="180" />
              <line x1="361" y1="186" x2="361" y2="180" />
            </g>

            {/* Nike swoosh — right side */}
            <image
              href="/images/001-nike-logos-swoosh-black.jpg"
              x="400"
              y="155"
              width="120"
              height="50"
              preserveAspectRatio="xMidYMid meet"
              className="dark:hidden"
            />
            <image
              href="/images/002-nike-logos-swoosh-white.jpg"
              x="400"
              y="155"
              width="120"
              height="50"
              preserveAspectRatio="xMidYMid meet"
              className="hidden dark:block"
            />

            {/* Dashed guide lines */}
            <g stroke="#a8a8a8" strokeDasharray="4 8" strokeWidth="0.5">
              <line x1="80" y1="130" x2="600" y2="130" />
              <line x1="80" y1="160" x2="600" y2="160" />
              <line x1="80" y1="200" x2="600" y2="200" />
              <line x1="80" y1="230" x2="600" y2="230" />
              <line x1="80" y1="260" x2="600" y2="260" />
              <line x1="130" y1="100" x2="130" y2="270" />
              <line x1="230" y1="100" x2="230" y2="270" />
              <line x1="340" y1="100" x2="340" y2="270" />
              <line x1="385" y1="100" x2="385" y2="270" />
              <line x1="530" y1="100" x2="530" y2="270" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

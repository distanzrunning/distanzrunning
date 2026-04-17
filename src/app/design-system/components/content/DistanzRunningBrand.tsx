"use client";

import { useState, useCallback } from "react";
import { Section } from "../ContentWithTOC";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Download, Copy, Check } from "lucide-react";
import { SiAdidas } from "react-icons/si";

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

/**
 * Inline Distanz icon paths — used in spacing diagrams where we need the icon
 * to inherit fill colour from context and be positioned inside another SVG.
 * Size is the final rendered box; viewBox scales automatically.
 */
function DistanzIconPaths({ size = 50 }: { size?: number }) {
  return (
    <g transform={`scale(${size / 1000})`}>
      <path d="M865.86,333.86c34.04-97.61-25.3-213.89-124.87-243.87-48.18-15.81-96.19-11.82-146.12-12.43-38.2.61-88.06.07-109.84,36.42-16.6,29.75-.78,65.48,29.79,78.2,19.57,8.73,43.8,9.91,65.71,10.47,26.62.51,53.37-.55,78.13.84,34.22,1.23,65.95,10.59,79.73,42.69,12.51,28.42,1.65,60.79-22.85,80.61-23.35,19.87-53.47,32.04-81.34,44.72-50.64,22.67-108.55,48.17-155.48,69.75-33.93,15.71-67.88,31.46-103.93,46.85-103.31,44.48-200.83,72.49-233.86,161.7-21.78,49.7-22.75,109.34,2.02,158.24,26.43,55.64,81.14,97.31,141.28,108.65,36.26,7.64,72.07,5.21,110.2,5.78,43.71-.45,106.62,3.51,124.31-45.92,4.55-13.97,3.18-29.92-4.65-42.48-38.15-56.61-143.95-27.27-201.5-41.24-33-7.21-59.53-37.39-55.81-72.1,6.68-56.06,82.48-78.95,126.83-100.28,47.26-21.14,95.63-42.44,141.58-63.63l.16-.07c64.95-31.07,137.35-60.67,203.38-88.51,61.76-25.92,114.62-69.66,137.12-134.4Z" fill="currentColor" />
      <path d="M810,620c-104.93,0-190,85.07-190,190s85.07,190,190,190,190-85.07,190-190-85.07-190-190-190ZM810,870c-33.14,0-60-26.86-60-60s26.86-60,60-60,60,26.86,60,60-26.86,60-60,60Z" fill="currentColor" />
      <path d="M380,190C380,85.07,294.93,0,190,0S0,85.07,0,190s85.07,190,190,190,190-85.07,190-190ZM130,190c0-33.14,26.86-60,60-60s60,26.86,60,60-26.86,60-60,60-60-26.86-60-60Z" fill="currentColor" />
    </g>
  );
}

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
const blackFullLogoSvg = `<img src="/images/Distanz_Logo_Full_Black_v3.svg" alt="Distanz Running" height="96" />`;
const whiteFullLogoSvg = `<img src="/images/Distanz_Logo_Full_White_v3.svg" alt="Distanz Running" height="96" />`;
const blackWordmarkSvg = `<img src="/images/Distanz_Logo_Black_v3.svg" alt="Distanz Running" height="64" />`;
const whiteWordmarkSvg = `<img src="/images/Distanz_Logo_White_v3.svg" alt="Distanz Running" height="64" />`;
const blackMarkSvg = `<img src="/images/distanz_icon_black_v3.svg" alt="Distanz Running" height="32" />`;
const whiteMarkSvg = `<img src="/images/distanz_icon_white_v3.svg" alt="Distanz Running" height="32" />`;

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

      {/* Full logo on white background */}
      <div
        className="group relative flex justify-center py-14 md:py-28"
        style={{
          background: "#fff",
        }}
      >
        <CopyButton text={blackFullLogoSvg} variant="light" />
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_Full_Black_v3.svg"
            alt="Distanz Running Logo - Black"
            style={{ height: 120, width: "auto" }}
          />
        </div>
      </div>

      {/* Full logo on black background */}
      <div
        className="group relative flex items-center justify-center py-14 md:py-28"
        style={{
          background: "#000",
        }}
      >
        <CopyButton text={whiteFullLogoSvg} variant="dark" />
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_Full_White_v3.svg"
            alt="Distanz Running Logo - White"
            style={{ height: 120, width: "auto" }}
          />
        </div>
      </div>

      {/* Code block for full logo usage */}
      <div
        style={{ borderTop: "1px solid var(--ds-gray-400)", borderBottom: "1px solid var(--ds-gray-400)" }}
        className="[&>div]:border-0 [&>div]:rounded-none"
      >
        <CodeBlock
          code={`import { DistanzLogo } from '@/components/logos';\n\n<DistanzLogo height={96} />`}
          language="jsx"
          showLineNumbers={false}
        />
      </div>

      {/* Wordmark heading */}
      <Section>
        <div className="flex flex-col">
          <SectionHeading id="wordmark" title="Wordmark" />
          <p className="text-copy-16 mt-4" style={{ color: "var(--ds-gray-900)" }}>
            The Distanz Running wordmark can be used as an alternative when the full logo
            would be too vertical or when a more horizontal brand presence is needed.
          </p>
        </div>
      </Section>

      {/* Wordmark on white background */}
      <div
        className="group relative flex justify-center py-14 md:py-28"
        style={{ background: "#fff" }}
      >
        <CopyButton text={blackWordmarkSvg} variant="light" />
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_Black_v3.svg"
            alt="Distanz Running Wordmark - Black"
            style={{ height: 72, width: "auto" }}
          />
        </div>
      </div>

      {/* Wordmark on black background */}
      <div
        className="group relative flex items-center justify-center py-14 md:py-28"
        style={{ background: "#000" }}
      >
        <CopyButton text={whiteWordmarkSvg} variant="dark" />
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_White_v3.svg"
            alt="Distanz Running Wordmark - White"
            style={{ height: 72, width: "auto" }}
          />
        </div>
      </div>

      {/* Code block for wordmark usage */}
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
            src="/images/distanz_icon_black_v3.svg"
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
            src="/images/distanz_icon_white_v3.svg"
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

      {/* Icon spacing diagram — icon with safety zone + Adidas comparison */}
      <div style={{ borderBottom: "1px solid var(--ds-gray-400)" }}>
        <div
          className="relative flex justify-center"
          style={{ background: "var(--ds-background-100)", minHeight: 361, padding: 0 }}
        >
          <svg
            fill="none"
            viewBox="0 0 720 361"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginTop: -1, width: "100%", color: "var(--ds-gray-1000)" }}
          >
            <title>Distanz Icon Spacing Consideration</title>
            <rect x="0.5" y="0.87" width="719" height="359" fill="var(--ds-background-100)" />

            {/* Ghost icons — safety zone around center */}
            {/* Left ghost */}
            <g opacity="0.25" transform="translate(190, 155)">
              <DistanzIconPaths size={50} />
            </g>
            {/* Top ghost */}
            <g opacity="0.25" transform="translate(275, 70)">
              <DistanzIconPaths size={50} />
            </g>
            {/* Bottom ghost */}
            <g opacity="0.25" transform="translate(275, 240)">
              <DistanzIconPaths size={50} />
            </g>
            {/* Right ghost (before the icon itself) */}
            <g opacity="0.25" transform="translate(360, 155)">
              <DistanzIconPaths size={50} />
            </g>

            {/* Main icon — centre */}
            <g transform="translate(275, 155)">
              <DistanzIconPaths size={50} />
            </g>

            {/* Plus symbol */}
            <g stroke="#a8a8a8" strokeWidth="0.96">
              <line x1="452" y1="180" x2="470" y2="180" />
              <line x1="461" y1="171" x2="461" y2="189" />
            </g>

            {/* Adidas icon — partner comparison */}
            <g transform="translate(500, 155)" style={{ color: "var(--ds-gray-1000)" }}>
              <foreignObject x="0" y="0" width="50" height="50">
                <div style={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ds-gray-1000)" }}>
                  <SiAdidas size={50} />
                </div>
              </foreignObject>
            </g>

            {/* Dashed guide lines */}
            <g stroke="#a8a8a8" strokeDasharray="4 8" strokeWidth="0.5">
              {/* Horizontal */}
              <line x1="100" y1="100" x2="620" y2="100" />
              <line x1="100" y1="155" x2="620" y2="155" />
              <line x1="100" y1="205" x2="620" y2="205" />
              <line x1="100" y1="260" x2="620" y2="260" />
              {/* Vertical */}
              <line x1="190" y1="55" x2="190" y2="300" />
              <line x1="240" y1="55" x2="240" y2="300" />
              <line x1="275" y1="55" x2="275" y2="300" />
              <line x1="325" y1="55" x2="325" y2="300" />
              <line x1="360" y1="55" x2="360" y2="300" />
              <line x1="410" y1="55" x2="410" y2="300" />
              <line x1="500" y1="55" x2="500" y2="300" />
              <line x1="550" y1="55" x2="550" y2="300" />
            </g>
          </svg>
        </div>
      </div>

      {/* Full logo partner spacing diagram */}
      <div style={{ borderBottom: "1px solid var(--ds-gray-400)" }}>
        <div
          className="relative flex justify-center"
          style={{ background: "var(--ds-background-100)", minHeight: 361, padding: 0 }}
        >
          <svg
            fill="none"
            viewBox="0 0 720 361"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginTop: -1, width: "100%" }}
          >
            <title>Distanz Full Logo Partner Spacing</title>
            <rect x="0.5" y="0.87" width="719" height="359" fill="var(--ds-background-100)" />

            {/* Distanz full logo — left */}
            <image
              href="/images/Distanz_Logo_Full_Black_v3.svg"
              x="60"
              y="120"
              width="240"
              height="120"
              preserveAspectRatio="xMidYMid meet"
              className="dark:hidden"
            />
            <image
              href="/images/Distanz_Logo_Full_White_v3.svg"
              x="60"
              y="120"
              width="240"
              height="120"
              preserveAspectRatio="xMidYMid meet"
              className="hidden dark:block"
            />

            {/* Plus symbol */}
            <g stroke="#a8a8a8" strokeWidth="0.96">
              <line x1="345" y1="180" x2="363" y2="180" />
              <line x1="354" y1="171" x2="354" y2="189" />
            </g>

            {/* Chicago Marathon — partner */}
            <image
              href="/images/bac_chimar_black.png"
              x="400"
              y="120"
              width="260"
              height="120"
              preserveAspectRatio="xMidYMid meet"
              className="dark:hidden"
            />
            <image
              href="/images/bac_chimar_white.png"
              x="400"
              y="120"
              width="260"
              height="120"
              preserveAspectRatio="xMidYMid meet"
              className="hidden dark:block"
            />

            {/* Dashed guide lines */}
            <g stroke="#a8a8a8" strokeDasharray="4 8" strokeWidth="0.5">
              {/* Horizontal */}
              <line x1="40" y1="100" x2="680" y2="100" />
              <line x1="40" y1="120" x2="680" y2="120" />
              <line x1="40" y1="240" x2="680" y2="240" />
              <line x1="40" y1="260" x2="680" y2="260" />
              {/* Vertical */}
              <line x1="60" y1="80" x2="60" y2="280" />
              <line x1="300" y1="80" x2="300" y2="280" />
              <line x1="320" y1="80" x2="320" y2="280" />
              <line x1="380" y1="80" x2="380" y2="280" />
              <line x1="400" y1="80" x2="400" y2="280" />
              <line x1="660" y1="80" x2="660" y2="280" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

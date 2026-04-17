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

      {/* Spacing diagram — logo with safety zone */}
      <div style={{ borderBottom: "1px solid var(--ds-gray-400)" }}>
        <div className="flex justify-center" style={{ background: "var(--ds-background-100)" }}>
          <svg fill="none" viewBox="0 0 720 361" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: -1, width: "100%" }}>
            <title>Distanz Spacing Consideration</title>
            <rect x="0.5" y="0.87" width="719" height="359" fill="var(--ds-background-100)" />

            {/* Main wordmark logo — center */}
            <image
              href="/images/Distanz_Logo_Black_v3.svg"
              x="185"
              y="145"
              width="350"
              height="70"
              preserveAspectRatio="xMidYMid meet"
              className="dark:hidden"
            />
            <image
              href="/images/Distanz_Logo_White_v3.svg"
              x="185"
              y="145"
              width="350"
              height="70"
              preserveAspectRatio="xMidYMid meet"
              className="hidden dark:block"
            />

            {/* Ghost logos — faded copies showing safety zone */}
            <image href="/images/Distanz_Logo_Black_v3.svg" x="185" y="75" width="350" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="dark:hidden" />
            <image href="/images/Distanz_Logo_White_v3.svg" x="185" y="75" width="350" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="hidden dark:block" />
            <image href="/images/Distanz_Logo_Black_v3.svg" x="185" y="215" width="350" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="dark:hidden" />
            <image href="/images/Distanz_Logo_White_v3.svg" x="185" y="215" width="350" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="hidden dark:block" />
            <image href="/images/Distanz_Logo_Black_v3.svg" x="60" y="145" width="350" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="dark:hidden" />
            <image href="/images/Distanz_Logo_White_v3.svg" x="60" y="145" width="350" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="hidden dark:block" />

            {/* Dashed guide lines */}
            <g stroke="#a8a8a8" strokeDasharray="4 8" strokeWidth="0.5">
              <line x1="120" y1="75" x2="600" y2="75" />
              <line x1="120" y1="145" x2="600" y2="145" />
              <line x1="120" y1="215" x2="600" y2="215" />
              <line x1="120" y1="285" x2="600" y2="285" />
              <line x1="185" y1="50" x2="185" y2="310" />
              <line x1="360" y1="50" x2="360" y2="310" />
              <line x1="535" y1="50" x2="535" y2="310" />
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

            {/* Distanz wordmark — left */}
            <image href="/images/Distanz_Logo_Black_v3.svg" x="60" y="150" width="250" height="60" preserveAspectRatio="xMidYMid meet" className="dark:hidden" />
            <image href="/images/Distanz_Logo_White_v3.svg" x="60" y="150" width="250" height="60" preserveAspectRatio="xMidYMid meet" className="hidden dark:block" />

            {/* Ghost logos — spacing */}
            <image href="/images/Distanz_Logo_Black_v3.svg" x="60" y="90" width="250" height="60" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="dark:hidden" />
            <image href="/images/Distanz_Logo_White_v3.svg" x="60" y="90" width="250" height="60" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="hidden dark:block" />
            <image href="/images/Distanz_Logo_Black_v3.svg" x="60" y="210" width="250" height="60" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="dark:hidden" />
            <image href="/images/Distanz_Logo_White_v3.svg" x="60" y="210" width="250" height="60" preserveAspectRatio="xMidYMid meet" opacity="0.12" className="hidden dark:block" />

            {/* Plus symbol */}
            <g stroke="#a8a8a8" strokeWidth="0.96">
              <line x1="345" y1="180" x2="357" y2="180" />
              <line x1="351" y1="174" x2="351" y2="186" />
            </g>

            {/* Partner logo — Bank of America Chicago Marathon */}
            <image href="/images/bac_chimar_black.png" x="400" y="140" width="260" height="80" preserveAspectRatio="xMidYMid meet" className="dark:hidden" />
            <image href="/images/bac_chimar_white.png" x="400" y="140" width="260" height="80" preserveAspectRatio="xMidYMid meet" className="hidden dark:block" />

            {/* Dashed guide lines */}
            <g stroke="#a8a8a8" strokeDasharray="4 8" strokeWidth="0.5">
              <line x1="40" y1="90" x2="680" y2="90" />
              <line x1="40" y1="150" x2="680" y2="150" />
              <line x1="40" y1="210" x2="680" y2="210" />
              <line x1="40" y1="270" x2="680" y2="270" />
              <line x1="60" y1="70" x2="60" y2="290" />
              <line x1="310" y1="70" x2="310" y2="290" />
              <line x1="330" y1="70" x2="330" y2="290" />
              <line x1="370" y1="70" x2="370" y2="290" />
              <line x1="400" y1="70" x2="400" y2="290" />
              <line x1="660" y1="70" x2="660" y2="290" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

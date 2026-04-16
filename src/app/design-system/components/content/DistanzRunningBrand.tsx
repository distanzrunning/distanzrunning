"use client";

import { Section } from "../ContentWithTOC";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

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
          borderBottom: "1px solid var(--ds-gray-400)",
        }}
      >
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_1600_600_Black.svg"
            alt="Distanz Running Logo - Black"
            style={{ height: 64, width: "auto" }}
          />
        </div>
      </div>

      {/* Logo on black background */}
      <div
        className="group relative flex items-center justify-center py-14 md:py-28"
        style={{
          background: "#000",
          borderBottom: "1px solid var(--ds-gray-400)",
        }}
      >
        <div className="flex justify-center" style={{ maxWidth: "80%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Distanz_Logo_1600_600_White.svg"
            alt="Distanz Running Logo - White"
            style={{ height: 64, width: "auto" }}
          />
        </div>
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
        style={{
          borderBottom: "1px solid var(--ds-gray-400)",
        }}
      >
        {/* White bg */}
        <div
          className="group relative flex h-[164px] items-center justify-center md:h-[200px]"
          style={{ background: "#fff" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/distanz_icon_black.png"
            alt="Distanz Running Symbol - Black"
            style={{ height: 32 }}
          />
        </div>
        {/* Black bg */}
        <div
          className="group relative flex h-[164px] items-center justify-center md:h-[200px]"
          style={{ background: "#000" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/distanz_icon_white.png"
            alt="Distanz Running Symbol - White"
            style={{ height: 32 }}
          />
        </div>
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
    </div>
  );
}

"use client";

import { useCallback } from "react";
import { CircleHelp } from "lucide-react";
import { SiTailwindcss } from "react-icons/si";
import { Section } from "../ContentWithTOC";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useToast } from "@/components/ui/Toast";

// Typography table row with click-to-copy functionality
function TypographyRow({
  example,
  className,
  usage,
  onCopy,
}: {
  example: React.ReactNode;
  className: string;
  usage: string;
  onCopy: (text: string) => void;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(className);
      onCopy(className);
    },
    [className, onCopy],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(className);
      onCopy(className);
    },
    [className, onCopy],
  );

  return (
    <tr
      className="border-b border-borderSubtle cursor-pointer hover:bg-[var(--ds-gray-100)] transition-colors"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <td className="py-4 pr-4 align-middle">{example}</td>
      <td className="py-4 px-4 font-mono text-xs align-middle">{className}</td>
      <td className="py-4 px-4 text-textSubtle align-middle">{usage}</td>
    </tr>
  );
}

// Copy icon for code blocks
function CopyIcon() {
  return (
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
        d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Check icon for copy confirmation
function CheckIcon() {
  return (
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
        d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
  onCopyLink,
}: {
  id: string;
  children: React.ReactNode;
  onCopyLink?: (message: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Copy URL with hash to clipboard
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    onCopyLink?.("Copied link to clipboard");

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
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

export default function Typography() {
  const { showToast } = useToast();

  const handleCopy = useCallback(
    (className: string) => {
      showToast(`Copied: ${className}`);
    },
    [showToast],
  );

  return (
    <>
      {/* Usage Section */}
      <Section>
        <SectionHeader id="usage" onCopyLink={showToast}>
          Usage
        </SectionHeader>

        <p className="text-copy-14 text-textSubtle mt-4 mb-4">
          Our typography styles can be consumed as{" "}
          <span className="inline-flex items-center gap-1.5 align-bottom">
            <SiTailwindcss size={14} className="text-[#38bdf8]" />
            Tailwind
          </span>{" "}
          classes. The classes below pre-set a combination of{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            font-size
          </code>
          ,{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            line-height
          </code>
          ,{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            letter-spacing
          </code>
          , and{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            font-weight
          </code>{" "}
          for you based on the Geist design system.
        </p>

        <p className="text-copy-14 text-textSubtle mb-6">
          The{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element can be used as a modifier to change the font weight. For
          Headings, this reduces the weight (for creating subtle variants),
          while for Copy text it increases the weight for emphasis.
        </p>

        <CodeBlock language="html">
          {`<p className="text-heading-32 font-serif">
  Heading with <strong>subtle</strong> text
</p>`}
        </CodeBlock>
      </Section>

      {/* Headings Section */}
      <Section>
        <SectionHeader id="headings" onCopyLink={showToast}>
          Headings
        </SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-4">
          Headings are used to introduce pages or sections. Use{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            font-serif
          </code>{" "}
          (EB Garamond) for editorial contexts like featured article headlines,
          article page titles, and pull quotes. Use{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            font-sans
          </code>{" "}
          (Geist Sans) for UI contexts like section titles, card headings, and
          navigation.
        </p>

        <p className="text-base text-textSubtle mb-6">
          The{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element reduces the weight for creating subtle variants.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    <CircleHelp size={14} className="text-textSubtler" />
                    Usage
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Editorial headings - EB Garamond */}
              <TypographyRow
                example={<p className="text-heading-48 font-serif">Heading</p>}
                className="text-heading-48 font-serif"
                usage="Featured article headlines"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-40 font-serif">Heading</p>}
                className="text-heading-40 font-serif"
                usage="Article page titles"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-32 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-32 font-serif"
                usage="Large article titles, pull quotes"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-24 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-24 font-serif"
                usage="Article subheadings, blockquotes"
                onCopy={handleCopy}
              />
              {/* UI headings - Geist Sans */}
              <TypographyRow
                example={<p className="text-heading-32">Heading</p>}
                className="text-heading-32"
                usage="Page section titles"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-24">Heading</p>}
                className="text-heading-24"
                usage="Card titles, section headers"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-20">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-20"
                usage="Breaking news headings, subsections"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-heading-16">
                    Heading <strong>Subtle</strong>
                  </p>
                }
                className="text-heading-16"
                usage="Small card titles, sidebar headers"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-heading-14">Heading</p>}
                className="text-heading-14"
                usage="Mini headers, metadata labels"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Buttons Section */}
      <Section>
        <SectionHeader id="buttons" onCopyLink={showToast}>
          Buttons
        </SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Button text styles should only be used for button components.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    <CircleHelp size={14} className="text-textSubtler" />
                    Usage
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TypographyRow
                example={<p className="text-button-16">Button Text</p>}
                className="text-button-16"
                usage="Large buttons"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-button-14">Button Text</p>}
                className="text-button-14"
                usage="Default buttons"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-button-12">Button Text</p>}
                className="text-button-12"
                usage="Small buttons"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Labels Section */}
      <Section>
        <SectionHeader id="labels" onCopyLink={showToast}>
          Labels
        </SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Labels are single-line text with ample line-height to align with
          icons. Use the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element to increase weight. Mono variants use monospace font.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    <CircleHelp size={14} className="text-textSubtler" />
                    Usage
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TypographyRow
                example={<p className="text-label-20">Label Text</p>}
                className="text-label-20"
                usage="Large labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-18">Label Text</p>}
                className="text-label-18"
                usage="Medium labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-16">
                    Label <strong>Strong</strong>
                  </p>
                }
                className="text-label-16"
                usage="Default labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-14">
                    Label <strong>Strong</strong>
                  </p>
                }
                className="text-label-14"
                usage="Standard labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-14-mono">Label Mono</p>}
                className="text-label-14-mono"
                usage="Code, technical labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-13">
                    Label <strong>Strong</strong>{" "}
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      123
                    </span>
                  </p>
                }
                className="text-label-13"
                usage="Small labels, tabular nums"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-13-mono">Label Mono</p>}
                className="text-label-13-mono"
                usage="Small code labels"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-label-12">
                    Label <strong>Strong</strong>{" "}
                    <span className="uppercase">CAPS</span>
                  </p>
                }
                className="text-label-12"
                usage="Tiny labels, metadata"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-label-12-mono">Label Mono</p>}
                className="text-label-12-mono"
                usage="Tiny code labels"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Copy Section */}
      <Section>
        <SectionHeader id="copy" onCopyLink={showToast}>
          Copy
        </SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Copy styles are for multi-line text with higher line height than
          Labels. Use the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            strong
          </code>{" "}
          element to increase weight for emphasis.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class name
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-2">
                    <CircleHelp size={14} className="text-textSubtler" />
                    Usage
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TypographyRow
                example={
                  <p className="text-copy-24">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-24"
                usage="Lead paragraphs"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-20">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-20"
                usage="Large body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-18">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-18"
                usage="Introductions"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-16">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-16"
                usage="Default body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={
                  <p className="text-copy-14">
                    Copy text <strong>strong</strong>
                  </p>
                }
                className="text-copy-14"
                usage="Compact body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-copy-13">Copy text</p>}
                className="text-copy-13"
                usage="Small body text"
                onCopy={handleCopy}
              />
              <TypographyRow
                example={<p className="text-copy-13-mono">Copy text mono</p>}
                className="text-copy-13-mono"
                usage="Code snippets, technical text"
                onCopy={handleCopy}
              />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Reference Section */}
      <Section>
        <SectionHeader id="reference" onCopyLink={showToast}>
          Quick reference
        </SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Complete specifications for all typography utility classes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <SiTailwindcss size={14} className="text-[#06B6D4]" />
                    Class
                  </span>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Font Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Line Height
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Letter Spacing
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Font Weight
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono whitespace-nowrap">
              {/* Headings */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Headings
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-72</td>
                <td className="py-2 px-4">72px</td>
                <td className="py-2 px-4">80px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-64</td>
                <td className="py-2 px-4">64px</td>
                <td className="py-2 px-4">72px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-56</td>
                <td className="py-2 px-4">56px</td>
                <td className="py-2 px-4">64px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-48</td>
                <td className="py-2 px-4">48px</td>
                <td className="py-2 px-4">56px</td>
                <td className="py-2 px-4">-0.03em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-40</td>
                <td className="py-2 px-4">40px</td>
                <td className="py-2 px-4">48px</td>
                <td className="py-2 px-4">-0.02em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-32</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">40px</td>
                <td className="py-2 px-4">-0.02em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-24</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">-0.015em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">-0.006em</td>
                <td className="py-2 px-4">600</td>
              </tr>

              {/* Buttons */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Buttons
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-12</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>

              {/* Labels */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-18</td>
                <td className="py-2 px-4">18px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-14-mono</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-13</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-13-mono</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-12</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-12-mono</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>

              {/* Copy */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td
                  colSpan={5}
                  className="py-2 px-4 font-sans font-semibold text-textSubtle"
                >
                  Copy
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-24</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">36px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-18</td>
                <td className="py-2 px-4">18px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">22px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-13</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-13-mono</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

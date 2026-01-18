"use client";

import { useState, useCallback } from "react";
import { Check } from "lucide-react";
import { SiTailwindcss } from "react-icons/si";
import { Section } from "../ContentWithTOC";

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

// Code block with copy button (matches Geist)
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group relative">
      <pre className="bg-[#0a0a0a] dark:bg-[#0a0a0a] text-[#ededed] rounded-lg p-4 overflow-x-auto">
        <code className="text-[13px] leading-[20px] font-mono">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-[#1a1a1a] border border-[#333] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#252525] hover:border-[#444]"
        aria-label="Copy code"
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <span className="text-[#888]">
            <CopyIcon />
          </span>
        )}
      </button>
    </div>
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

// Section header with link icon on hover (matches Geist)
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
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </a>
  );
}

export default function Typography() {
  return (
    <>
      {/* Usage Section */}
      <Section>
        <SectionHeader id="usage">Usage</SectionHeader>

        <p className="text-copy-14 text-textSubtle mt-4 mb-4">
          Our typography styles can be consumed as{" "}
          <span className="inline-flex items-center gap-1">
            <SiTailwindcss size={14} className="text-[#06B6D4]" />
            Tailwind
          </span>{" "}
          classes. The classes below pre-set a combination of font-size,
          line-height, letter-spacing, and font-weight for you based on the
          Geist design system.
        </p>

        <p className="text-copy-14 text-textSubtle mb-6">
          The{" "}
          <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">
            strong
          </code>{" "}
          element can be used as a modifier to change the font weight. For
          Headings, this reduces the weight (for creating subtle variants),
          while for Copy text it increases the weight for emphasis.
        </p>

        <CodeBlock
          code={`<p className="text-heading-32 font-serif">
  Heading with <strong>subtle</strong> text
</p>`}
        />
      </Section>

      {/* Headings Section */}
      <Section>
        <SectionHeader id="headings">Headings</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Headings are used to introduce pages or sections. The{" "}
          <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">
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
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-72 font-serif">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-72 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Hero headlines
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-64 font-serif">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-64 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large page titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-56 font-serif">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-56 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Page titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-48 font-serif">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-48 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Section titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-40 font-serif">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-40 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Feature headers
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-32 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-32 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Card titles, section headers
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-24 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-24 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Subsection titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-20 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-20 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small headers
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-16 font-serif">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-16 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Mini headers, labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-14 font-serif">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-14 font-serif
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Smallest heading
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Buttons Section */}
      <Section>
        <SectionHeader id="buttons">Buttons</SectionHeader>

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
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-button-16">Button Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-button-16
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large buttons
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-button-14">Button Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-button-14
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Default buttons
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-button-12">Button Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-button-12
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small buttons
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Labels Section */}
      <Section>
        <SectionHeader id="labels">Labels</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Labels are single-line text with ample line-height to align with
          icons. Use the{" "}
          <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">
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
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-20">Label Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-20
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-18">Label Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-18
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Medium labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-16">
                    Label <strong>Strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-16
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Default labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-14">
                    Label <strong>Strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-14
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Standard labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-14-mono">Label Mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-14-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Code, technical labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-13">
                    Label <strong>Strong</strong>{" "}
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      123
                    </span>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-13
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small labels, tabular nums
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-13-mono">Label Mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-13-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small code labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-12">
                    Label <strong>Strong</strong>{" "}
                    <span className="uppercase">CAPS</span>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-12
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Tiny labels, metadata
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-12-mono">Label Mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-12-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Tiny code labels
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Copy Section */}
      <Section>
        <SectionHeader id="copy">Copy</SectionHeader>

        <p className="text-base text-textSubtle mt-4 mb-6">
          Copy styles are for multi-line text with higher line height than
          Labels. Use the{" "}
          <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">
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
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-24">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-24
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Lead paragraphs
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-20">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-20
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-18">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-18
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Introductions
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-16">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-16
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Default body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-14">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-14
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Compact body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-13">Copy text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-13
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-13-mono">Copy text mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-13-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Code snippets, technical text
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Reference Section */}
      <Section>
        <SectionHeader id="reference">Quick reference</SectionHeader>

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

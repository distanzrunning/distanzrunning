"use client";

import { useState, useCallback } from "react";
import { ChevronDown, Check, Star, Medal } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import {
  Avatar,
  AvatarGroup,
  AvatarBrand,
  AvatarWithIcon,
} from "@/components/ui/Avatar";

// Toast notification for copy confirmation
function Toast({
  message,
  isVisible,
  onDismiss,
}: {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className="material-menu flex items-center gap-3 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-textDefault">{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <svg
            height="16"
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="16"
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

// Global toast state management
let toastTimeout: NodeJS.Timeout | null = null;

function useToast() {
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = useCallback((message: string) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast({ message, isVisible: true });
    toastTimeout = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, dismissToast };
}

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

// Header height and section padding constants (must match ContentWithTOC)
const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

// Section header with link icon on hover
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

// Render a single Shiki token with dual theme support
function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

// Copy icon
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

// Animated copy button with scale + opacity transition
function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${
          copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <CopyIcon />
      </span>
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${
          copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <CheckIcon />
      </span>
    </div>
  );
}

// Code Preview component with Shiki syntax highlighting (no internal borders)
interface CodePreviewProps {
  children: React.ReactNode;
  componentCode: string;
}

function CodePreview({ children, componentCode }: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use Shiki for syntax highlighting
  const tokenizedLines = useShikiHighlighter(componentCode, "tsx");
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "var(--ds-gray-1000)",
            darkColor: "var(--ds-gray-1000)",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="border border-[var(--ds-gray-400)] rounded-lg overflow-hidden">
      {/* Preview area */}
      <div className="p-6" style={{ background: "var(--ds-background-100)" }}>
        {children}
      </div>

      {/* Accordion trigger */}
      <div style={{ background: "var(--ds-background-200)" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-[var(--ds-gray-400)]"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>

        {/* Collapsible code section - no internal rounded corners */}
        {isOpen && (
          <div
            className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-[13px]"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              {/* Floating copy button */}
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>

              {/* Code content */}
              <pre className="overflow-x-auto py-4">
                <code className="block text-[13px] leading-[20px] font-mono">
                  {lines.map((lineTokens, index) => (
                    <div
                      key={index}
                      className="flex px-4"
                      style={{ fontFeatureSettings: '"liga" off' }}
                    >
                      <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">
                        {index + 1}
                      </span>
                      <span className="flex-1 pr-4">
                        {lineTokens.map((token, i) => (
                          <RenderShikiToken key={i} token={token} />
                        ))}
                        {lineTokens.length === 0 && " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Example images for avatars
const avatarImages = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
];

// Code examples
const groupCode = `import { AvatarGroup } from '@/components/ui/Avatar';

export function Component() {
  return (
    <div className="flex flex-col gap-4">
      <AvatarGroup
        members={[
          { src: '/user1.jpg' },
          { src: '/user2.jpg' },
          { placeholder: true },
        ]}
        size={32}
      />
      <AvatarGroup
        limit={4}
        members={[
          { src: '/user1.jpg' },
          { src: '/user2.jpg' },
          { src: '/user3.jpg' },
          { src: '/user4.jpg' },
          { src: '/user5.jpg' },
          { src: '/user6.jpg' },
        ]}
        size={32}
      />
    </div>
  );
}`;

const brandCode = `import { AvatarBrand } from '@/components/ui/Avatar';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <AvatarBrand src="/user.jpg" brand="nike" size={64} badgeSize={26} />
      <AvatarBrand src="/user.jpg" brand="adidas" size={64} badgeSize={26} />
      <AvatarBrand src="/user.jpg" brand="newbalance" size={64} badgeSize={26} />
    </div>
  );
}`;

const customIconCode = `import { AvatarWithIcon } from '@/components/ui/Avatar';
import { Check, Medal, Star } from 'lucide-react';

export function Component() {
  return (
    <div className="flex flex-col gap-4">
      <AvatarWithIcon
        gradient={{ colors: ['#ff6b6b', '#feca57', '#48dbfb'], angle: 135 }}
        icon={<Check size={14} />}
        iconBgColor="var(--ds-gray-900)"
        size={64}
        badgeSize={26}
      />
      <AvatarWithIcon
        gradient={{ colors: ['#a29bfe', '#74b9ff', '#81ecec'], angle: 45 }}
        icon={<Medal size={14} />}
        iconBgColor="var(--ds-gray-200)"
        iconColor="var(--ds-gray-900)"
        size={64}
        badgeSize={26}
      />
      <AvatarWithIcon
        gradient={{ colors: ['#fd79a8', '#e84393', '#6c5ce7'], angle: 180 }}
        icon={<Star size={14} />}
        iconBgColor="var(--ds-gray-100)"
        iconColor="var(--ds-gray-800)"
        size={64}
        badgeSize={26}
      />
    </div>
  );
}`;

const placeholderCode = `import { Avatar } from '@/components/ui/Avatar';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return <Avatar placeholder size={90} />;
}`;

const sizesCode = `import { Avatar } from '@/components/ui/Avatar';

export function Component() {
  return (
    <div className="flex items-center gap-4">
      <Avatar src="/user.jpg" size={24} />
      <Avatar src="/user.jpg" size={32} />
      <Avatar src="/user.jpg" size={40} />
      <Avatar src="/user.jpg" size={48} />
      <Avatar src="/user.jpg" size={64} />
    </div>
  );
}`;

export default function AvatarComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Group Section */}
      <Section>
        <SectionHeader id="group" onCopyLink={showToast}>
          Group
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Multiple avatars can be stacked together in a group. Use the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            limit
          </code>{" "}
          prop to limit the number of visible avatars and show a count for the
          remaining.
        </p>
        <CodePreview componentCode={groupCode}>
          <div className="flex flex-col items-stretch justify-start gap-4 flex-initial">
            {/* First row: 3 avatars, one with placeholder */}
            <AvatarGroup
              members={[
                {
                  src: "/images/distanz_icon_white.svg",
                  alt: "Distanz",
                  bgColor: "#000",
                  borderColor: "var(--ds-gray-400)",
                },
                { src: avatarImages[0], alt: "User 1" },
                { src: avatarImages[1], alt: "User 2" },
              ]}
              size={32}
            />
            {/* Second row: 5 avatars with limit=4, showing +2 */}
            <AvatarGroup
              limit={4}
              members={[
                { src: avatarImages[2], alt: "User 3" },
                { src: avatarImages[3], alt: "User 4" },
                { src: avatarImages[4], alt: "User 5" },
                { src: avatarImages[5], alt: "User 6" },
                { src: avatarImages[0], alt: "User 7" },
                { src: avatarImages[1], alt: "User 8" },
              ]}
              size={32}
            />
          </div>
        </CodePreview>
      </Section>

      {/* Brand Section */}
      <Section>
        <SectionHeader id="brand" onCopyLink={showToast}>
          Brand
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Avatars can display a badge indicating a brand affiliation. Supported
          brands include Nike, Adidas, and New Balance. Each badge uses the
          brand&apos;s colour.
        </p>
        <CodePreview componentCode={brandCode}>
          <div className="flex flex-col gap-4">
            <AvatarBrand
              src={avatarImages[0]}
              alt="Nike athlete"
              size={64}
              brand="nike"
              badgeSize={26}
            />
            <AvatarBrand
              src={avatarImages[1]}
              alt="Adidas athlete"
              size={64}
              brand="adidas"
              badgeSize={26}
            />
            <AvatarBrand
              src={avatarImages[2]}
              alt="New Balance athlete"
              size={64}
              brand="newbalance"
              badgeSize={26}
            />
          </div>
        </CodePreview>
      </Section>

      {/* Custom Icon Section */}
      <Section>
        <SectionHeader id="custom-icon" onCopyLink={showToast}>
          With custom icon
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Add a custom icon badge to indicate status, role, or any other
          attribute. Customize the background colour using the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            iconBgColor
          </code>{" "}
          prop. The avatar can also use a gradient background instead of an
          image.
        </p>
        <CodePreview componentCode={customIconCode}>
          <div className="flex flex-col gap-4">
            <AvatarWithIcon
              gradient={{
                colors: ["#ff6b6b", "#feca57", "#48dbfb"],
                angle: 135,
              }}
              size={64}
              badgeSize={26}
              icon={<Check size={14} />}
              iconBgColor="var(--ds-gray-900)"
            />
            <AvatarWithIcon
              gradient={{
                colors: ["#a29bfe", "#74b9ff", "#81ecec"],
                angle: 45,
              }}
              size={64}
              badgeSize={26}
              icon={<Medal size={14} />}
              iconBgColor="var(--ds-gray-200)"
              iconColor="var(--ds-gray-900)"
            />
            <AvatarWithIcon
              gradient={{
                colors: ["#fd79a8", "#e84393", "#6c5ce7"],
                angle: 180,
              }}
              size={64}
              badgeSize={26}
              icon={<Star size={14} />}
              iconBgColor="var(--ds-gray-100)"
              iconColor="var(--ds-gray-800)"
            />
          </div>
        </CodePreview>
      </Section>

      {/* Placeholder Section */}
      <Section>
        <SectionHeader id="placeholder" onCopyLink={showToast}>
          Placeholder
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          When no image is provided, use the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            placeholder
          </code>{" "}
          prop to display a subtle shimmer animation.
        </p>
        <CodePreview componentCode={placeholderCode}>
          <Avatar placeholder size={90} />
        </CodePreview>
      </Section>

      {/* Sizes Section */}
      <Section>
        <SectionHeader id="sizes" onCopyLink={showToast}>
          Sizes
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Avatars can be rendered at any size using the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            size
          </code>{" "}
          prop. Common sizes are 24, 32, 40, 48, and 64 pixels.
        </p>
        <CodePreview componentCode={sizesCode}>
          <div className="flex items-center gap-4">
            <Avatar src={avatarImages[0]} alt="User" size={24} />
            <Avatar src={avatarImages[0]} alt="User" size={32} />
            <Avatar src={avatarImages[0]} alt="User" size={40} />
            <Avatar src={avatarImages[0]} alt="User" size={48} />
            <Avatar src={avatarImages[0]} alt="User" size={64} />
          </div>
        </CodePreview>
      </Section>

      {/* Props Section */}
      <Section>
        <SectionHeader id="props" onCopyLink={showToast}>
          Props
        </SectionHeader>
        <p className="text-copy-14 text-textSubtle mt-4 mb-6">
          Available props for the Avatar components.
        </p>

        <h3 className="text-[16px] font-semibold text-textDefault mt-8 mb-4">
          Avatar
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Prop
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">src</td>
                <td className="py-3 px-4 font-mono text-textSubtle">string</td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Image URL for the avatar
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">alt</td>
                <td className="py-3 px-4 font-mono text-textSubtle">string</td>
                <td className="py-3 px-4 text-textSubtle">&quot;&quot;</td>
                <td className="py-3 px-4 text-textSubtle">
                  Alt text for the avatar image
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">size</td>
                <td className="py-3 px-4 font-mono text-textSubtle">number</td>
                <td className="py-3 px-4 text-textSubtle">32</td>
                <td className="py-3 px-4 text-textSubtle">Size in pixels</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">fallback</td>
                <td className="py-3 px-4 font-mono text-textSubtle">string</td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Text to generate initials from
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">placeholder</td>
                <td className="py-3 px-4 font-mono text-textSubtle">boolean</td>
                <td className="py-3 px-4 text-textSubtle">false</td>
                <td className="py-3 px-4 text-textSubtle">
                  Show placeholder with shimmer animation
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">placeholderIcon</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Custom icon for placeholder (disables shimmer)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-[16px] font-semibold text-textDefault mt-8 mb-4">
          AvatarGroup
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Prop
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">members</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  AvatarGroupMember[]
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Array of avatar members to display
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">limit</td>
                <td className="py-3 px-4 font-mono text-textSubtle">number</td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Maximum visible avatars before showing +N
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">size</td>
                <td className="py-3 px-4 font-mono text-textSubtle">number</td>
                <td className="py-3 px-4 text-textSubtle">32</td>
                <td className="py-3 px-4 text-textSubtle">
                  Size in pixels for all avatars
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-[16px] font-semibold text-textDefault mt-8 mb-4">
          AvatarBrand
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Prop
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">brand</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  &quot;nike&quot; | &quot;adidas&quot; | &quot;newbalance&quot;
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Brand for the badge
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">badgeSize</td>
                <td className="py-3 px-4 font-mono text-textSubtle">number</td>
                <td className="py-3 px-4 text-textSubtle">size * 0.55</td>
                <td className="py-3 px-4 text-textSubtle">
                  Fixed badge size in pixels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">...AvatarProps</td>
                <td className="py-3 px-4 font-mono text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  All Avatar props are supported
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-[16px] font-semibold text-textDefault mt-8 mb-4">
          AvatarWithIcon
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Prop
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Default
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">icon</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Icon to display in the badge
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">iconBgColor</td>
                <td className="py-3 px-4 font-mono text-textSubtle">string</td>
                <td className="py-3 px-4 text-textSubtle">
                  var(--ds-blue-600)
                </td>
                <td className="py-3 px-4 text-textSubtle">
                  Background colour for the badge
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">iconColor</td>
                <td className="py-3 px-4 font-mono text-textSubtle">string</td>
                <td className="py-3 px-4 text-textSubtle">white</td>
                <td className="py-3 px-4 text-textSubtle">Icon colour</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">gradient</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  {"{"}colors: string[], angle?: number{"}"}
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Use gradient background instead of image
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">badgeSize</td>
                <td className="py-3 px-4 font-mono text-textSubtle">number</td>
                <td className="py-3 px-4 text-textSubtle">size * 0.55</td>
                <td className="py-3 px-4 text-textSubtle">
                  Fixed badge size in pixels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">...AvatarProps</td>
                <td className="py-3 px-4 font-mono text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  All Avatar props are supported
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

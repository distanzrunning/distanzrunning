"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
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
      <h2 className="text-heading-24 text-textDefault">
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
            color: "hsl(var(--color-textDefault))",
            darkColor: "hsl(var(--color-textDefault))",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="mt-4 xl:mt-7 border border-borderDefault rounded-lg overflow-hidden">
      {/* Preview area */}
      <div className="p-6" style={{ background: "hsl(var(--color-surface))" }}>
        {children}
      </div>

      {/* Accordion trigger */}
      <div style={{ background: "hsl(var(--color-canvas))" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>

        {/* Collapsible code section - no internal rounded corners */}
        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto font-mono text-copy-13"
            style={{ background: "hsl(var(--color-surface))" }}
          >
            <div className="relative group">
              {/* Floating copy button */}
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-borderDefault opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-canvas hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>

              {/* Code content */}
              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-copy-13 leading-[20px] font-mono">
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

// Distanz icon mark, inlined as SVG so it paints with the avatar shell (no
// network fetch / pop-in). Shared by the Group and Size demos.
function DistanzMarkIcon() {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="#fff"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <path d="M865.86,333.86c34.04-97.61-25.3-213.89-124.87-243.87-48.18-15.81-96.19-11.82-146.12-12.43-38.2.61-88.06.07-109.84,36.42-16.6,29.75-.78,65.48,29.79,78.2,19.57,8.73,43.8,9.91,65.71,10.47,26.62.51,53.37-.55,78.13.84,34.22,1.23,65.95,10.59,79.73,42.69,12.51,28.42,1.65,60.79-22.85,80.61-23.35,19.87-53.47,32.04-81.34,44.72-50.64,22.67-108.55,48.17-155.48,69.75-33.93,15.71-67.88,31.46-103.93,46.85-103.31,44.48-200.83,72.49-233.86,161.7-21.78,49.7-22.75,109.34,2.02,158.24,26.43,55.64,81.14,97.31,141.28,108.65,36.26,7.64,72.07,5.21,110.2,5.78,43.71-.45,106.62,3.51,124.31-45.92,4.55-13.97,3.18-29.92-4.65-42.48-38.15-56.61-143.95-27.27-201.5-41.24-33-7.21-59.53-37.39-55.81-72.1,6.68-56.06,82.48-78.95,126.83-100.28,47.26-21.14,95.63-42.44,141.58-63.63l.16-.07c64.95-31.07,137.35-60.67,203.38-88.51,61.76-25.92,114.62-69.66,137.12-134.4Z" />
      <path d="M810,620c-104.93,0-190,85.07-190,190s85.07,190,190,190,190-85.07,190-190-85.07-190-190-190ZM810,870c-33.14,0-60-26.86-60-60s26.86-60,60-60,60,26.86,60,60-26.86,60-60,60Z" />
      <path d="M380,190C380,85.07,294.93,0,190,0S0,85.07,0,190s85.07,190,190,190,190-85.07,190-190ZM130,190c0-33.14,26.86-60,60-60s60,26.86,60,60-26.86,60-60,60-60-26.86-60-60Z" />
    </svg>
  );
}

// Blank gradient avatar for the "With custom icon" demo — Geist shows the
// anonymous Vercel gradient avatar (no user) so the focus is the badge, not a
// face. Same gradient on all three. Colours approximate Vercel's default —
// tune to taste.
const iconAvatarGradient = { colors: ["#007CF0", "#00DFD8"], angle: 135 };

// Geist's exact custom-icon glyphs (download / filled-check / clock). The
// check is a *filled* disc with a knocked-out check (fill-rule evenodd), so it
// renders as a solid gray-900 circle with a white check — that's why Geist's
// middle badge reads as a dark circle, not a thin outline like lucide's.
const ICON_DOWNLOAD =
  "M8.75 5.25V4.5H7.25V5.25V9.43934L5.78033 7.96967L5.25 7.43934L4.18934 8.5L4.71967 9.03033L7.46967 11.7803C7.76256 12.0732 8.23744 12.0732 8.53033 11.7803L11.2803 9.03033L11.8107 8.5L10.75 7.43934L10.2197 7.96967L8.75 9.43934V5.25ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z";
const ICON_CHECK =
  "M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5303 6.53033L12.0607 6L11 4.93934L10.4697 5.46967L6.5 9.43934L5.53033 8.46967L5 7.93934L3.93934 9L4.46967 9.53033L5.96967 11.0303C6.26256 11.3232 6.73744 11.3232 7.03033 11.0303L11.5303 6.53033Z";
const ICON_CLOCK =
  "M5.35066 2.06247C5.96369 1.78847 6.62701 1.60666 7.32351 1.53473L7.16943 0.0426636C6.31208 0.1312 5.49436 0.355227 4.73858 0.693033L5.35066 2.06247ZM8.67651 1.53473C11.9481 1.87258 14.5 4.63876 14.5 8.00001C14.5 11.5899 11.5899 14.5 8.00001 14.5C4.63901 14.5 1.87298 11.9485 1.5348 8.67722L0.0427551 8.83147C0.459163 12.8594 3.86234 16 8.00001 16C12.4183 16 16 12.4183 16 8.00001C16 3.86204 12.8589 0.458666 8.83059 0.0426636L8.67651 1.53473ZM2.73972 4.18084C3.14144 3.62861 3.62803 3.14195 4.18021 2.74018L3.29768 1.52727C2.61875 2.02128 2.02064 2.61945 1.52671 3.29845L2.73972 4.18084ZM1.5348 7.32279C1.60678 6.62656 1.78856 5.96348 2.06247 5.35066L0.693033 4.73858C0.355343 5.4941 0.131354 6.31152 0.0427551 7.16854L1.5348 7.32279ZM8.75001 4.75V4H7.25001V4.75V7.875C7.25001 8.18976 7.3982 8.48615 7.65001 8.675L9.55001 10.1L10.15 10.55L11.05 9.35L10.45 8.9L8.75001 7.625V4.75Z";

function GeistGlyph({ d }: { d: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path fillRule="evenodd" clipRule="evenodd" d={d} />
    </svg>
  );
}

// Code examples
const groupCode = `import { AvatarGroup } from '@/components/ui/Avatar';

export function Component() {
  return (
    <div className="flex items-center gap-4">
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
    <div className="flex items-center gap-4">
      <AvatarBrand src="/user.jpg" brand="nike" size={32} />
      <AvatarBrand src="/user.jpg" brand="adidas" size={32} />
      <AvatarBrand src="/user.jpg" brand="newbalance" size={32} />
    </div>
  );
}`;

const customIconCode = `import { AvatarWithIcon } from '@/components/ui/Avatar';
import { CircleArrowDown, CircleCheck, Clock } from 'lucide-react';

export function Component() {
  const gradient = { colors: ['#007CF0', '#00DFD8'] };
  return (
    <div className="flex items-center gap-4">
      <AvatarWithIcon gradient={gradient} size={32} icon={<CircleArrowDown size={14} />} />
      <AvatarWithIcon gradient={gradient} size={32} icon={<CircleCheck size={14} />} />
      <AvatarWithIcon gradient={gradient} size={32} icon={<Clock size={14} />} />
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
      <Avatar src="/user.jpg" size={48} />
    </div>
  );
}`;

const letterCode = `import { Avatar } from '@/components/ui/Avatar';

export function Component() {
  return (
    <div className="flex items-center gap-4">
      <Avatar fallback="Sarah Lee" size={32} />
      <Avatar fallback="Emma King" size={32} />
      <Avatar fallback="Chris Kim" size={32} />
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
        <CodePreview componentCode={groupCode}>
          <div className="flex items-center gap-4">
            {/* Two clusters side by side on one row (Geist layout) */}
            <AvatarGroup
              members={[
                {
                  alt: "Distanz",
                  placeholder: true,
                  placeholderIcon: <DistanzMarkIcon />,
                  bgColor: "#000",
                  borderColor: "hsl(var(--color-borderDefault))",
                },
                { src: avatarImages[0], alt: "User 1" },
                { src: avatarImages[1], alt: "User 2" },
              ]}
              size={32}
            />
            {/* Second cluster: 6 avatars with limit=4, showing +2 */}
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

      {/* Size Section */}
      <Section>
        <SectionHeader id="size" onCopyLink={showToast}>
          Size
        </SectionHeader>
        <CodePreview componentCode={sizesCode}>
          <div className="flex items-center gap-4">
            <Avatar placeholder placeholderIcon={<DistanzMarkIcon />} bgColor="#000" alt="Distanz" size={24} />
            <Avatar placeholder placeholderIcon={<DistanzMarkIcon />} bgColor="#000" alt="Distanz" size={32} />
            <Avatar placeholder placeholderIcon={<DistanzMarkIcon />} bgColor="#000" alt="Distanz" size={48} />
          </div>
        </CodePreview>
      </Section>

      {/* Brand Section */}
      <Section>
        <SectionHeader id="brand" onCopyLink={showToast}>
          Brand
        </SectionHeader>
        <CodePreview componentCode={brandCode}>
          <div className="flex items-center gap-4">
            <AvatarBrand src={avatarImages[0]} alt="Nike athlete" size={32} brand="nike" />
            <AvatarBrand src={avatarImages[1]} alt="Adidas athlete" size={32} brand="adidas" />
            <AvatarBrand src={avatarImages[2]} alt="New Balance athlete" size={32} brand="newbalance" />
          </div>
        </CodePreview>
      </Section>

      {/* Custom Icon Section */}
      <Section>
        <SectionHeader id="custom-icon" onCopyLink={showToast}>
          With custom icon
        </SectionHeader>
        <CodePreview componentCode={customIconCode}>
          <div className="flex items-center gap-4">
            <AvatarWithIcon gradient={iconAvatarGradient} size={32} icon={<GeistGlyph d={ICON_DOWNLOAD} />} />
            <AvatarWithIcon gradient={iconAvatarGradient} size={32} icon={<GeistGlyph d={ICON_CHECK} />} />
            <AvatarWithIcon gradient={iconAvatarGradient} size={32} icon={<GeistGlyph d={ICON_CLOCK} />} />
          </div>
        </CodePreview>
      </Section>

      {/* Letter Section */}
      <Section>
        <SectionHeader id="letter" onCopyLink={showToast}>
          Letter
        </SectionHeader>
        <CodePreview componentCode={letterCode}>
          <div className="flex items-center gap-4">
            <Avatar fallback="Sarah Lee" size={32} />
            <Avatar fallback="Emma King" size={32} />
            <Avatar fallback="Chris Kim" size={32} />
          </div>
        </CodePreview>
      </Section>

      {/* Placeholder Section */}
      <Section>
        <SectionHeader id="placeholder" onCopyLink={showToast}>
          Placeholder
        </SectionHeader>
        <CodePreview componentCode={placeholderCode}>
          <Avatar placeholder size={90} />
        </CodePreview>
      </Section>

      {/* Best Practices Section */}
      <Section>
        <SectionHeader id="best-practices" onCopyLink={showToast}>
          Best Practices
        </SectionHeader>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Use a single{" "}
            <code className="inline-code">&lt;Avatar&gt;</code> for
            one person, team, or organization. For two or more
            stacked avatars, use{" "}
            <code className="inline-code">&lt;AvatarGroup&gt;</code>{" "}
            so the cluster gets correct overlap, sizing, and a
            single accessible label.
          </li>
          <li>
            Pass <code className="inline-code">src</code> first and
            fall back to{" "}
            <code className="inline-code">fallback</code> (the
            entity&apos;s name; the component derives 1&ndash;2
            uppercase initials) when the image is missing. Reserve{" "}
            <code className="inline-code">placeholder</code> for the
            loading shell, never as a permanent fallback.
          </li>
          <li>
            <code className="inline-code">fallback</code> is the
            literal entity name (
            <code className="inline-code">Acme Inc.</code>,{" "}
            <code className="inline-code">Jane Doe</code>). Initials
            avatars are announced as{" "}
            <code className="inline-code">
              Avatar with initials:
            </code>{" "}
            for screen readers, so don&apos;t hand-write{" "}
            <code className="inline-code">Avatar of …</code>.
          </li>
          <li>
            Keep <code className="inline-code">fallback</code>{" "}
            derived from the entity name. No emoji, no punctuation,
            no <code className="inline-code">?</code>.
          </li>
          <li>
            Pick a size that matches adjacent type: 20&ndash;24px
            next to{" "}
            <code className="inline-code">text-label-14</code>, 32px
            next to{" "}
            <code className="inline-code">text-label-16</code>,
            48&ndash;64px in headers and onboarding states.
          </li>
        </ul>
      </Section>
    </>
  );
}

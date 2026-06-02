"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Section } from "../ContentWithTOC";
import { ComponentRef } from "../ComponentRef";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuSection,
  MenuSeparator,
} from "@/components/ui/Menu";

// ============================================================================
// Toast Component
// ============================================================================

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
          className="p-1 rounded hover:bg-[var(--ds-gray-100)] transition-colors"
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

function useToast() {
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, isVisible: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, dismissToast };
}

// ============================================================================
// Section Header Component
// ============================================================================

const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

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
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    onCopyLink?.("Copied link to clipboard");
    window.history.pushState(null, "", `#${id}`);
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const scrollTarget =
        absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
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

// ============================================================================
// Code Preview Component
// ============================================================================

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

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

function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
      >
        <CopyIcon />
      </span>
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <CheckIcon />
      </span>
    </div>
  );
}

interface CodePreviewProps {
  children: React.ReactNode;
  componentCode: string;
}

function CodePreview({ children, componentCode }: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <div className="border border-borderDefault rounded-lg">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "hsl(var(--color-surface))" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg overflow-hidden"
        style={{ background: "hsl(var(--color-canvas))" }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto font-mono text-copy-13"
            style={{ background: "hsl(var(--color-surface))" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-borderDefault opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-canvas hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>
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

// ============================================================================
// Code Examples
// ============================================================================

const defaultCode = `import { Menu, MenuButton, MenuItem, MenuSeparator } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu>
      <MenuButton>Actions</MenuButton>
      <MenuItem onClick={() => console.log('edit')}>Edit Race</MenuItem>
      <MenuItem onClick={() => console.log('duplicate')}>Duplicate Race</MenuItem>
      <MenuItem onClick={() => console.log('archive')}>Archive Race</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log('delete')}>Delete Race</MenuItem>
    </Menu>
  );
}`;

const withChevronCode = `import { Menu, MenuButton, MenuItem, MenuSeparator } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu>
      <MenuButton variant="secondary" chevron>Actions</MenuButton>
      <MenuItem onClick={() => console.log('edit')}>Edit Race</MenuItem>
      <MenuItem onClick={() => console.log('duplicate')}>Duplicate Race</MenuItem>
      <MenuItem onClick={() => console.log('archive')}>Archive Race</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log('delete')}>Delete Race</MenuItem>
    </Menu>
  );
}`;

const disabledItemsCode = `import { Menu, MenuButton, MenuItem, MenuSeparator } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu>
      <MenuButton>Actions</MenuButton>
      <MenuItem onClick={() => console.log('edit')}>Edit Race</MenuItem>
      <MenuItem disabled>Duplicate Race</MenuItem>
      <MenuItem disabled>Archive Race</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log('delete')}>Delete Race</MenuItem>
    </Menu>
  );
}`;

const lockedItemsCode = `import { Menu, MenuButton, MenuItem } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu>
      <MenuButton>Actions</MenuButton>
      <MenuItem onClick={() => console.log('view')}>View Race Details</MenuItem>
      <MenuItem onClick={() => console.log('edit')}>Edit Race</MenuItem>
      <MenuItem locked>Delete Race</MenuItem>
    </Menu>
  );
}`;

const linkItemsCode = `import { Menu, MenuButton, MenuItem } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu>
      <MenuButton>Links</MenuButton>
      <MenuItem href="/admin/design-system/menu#custom-trigger">View Documentation</MenuItem>
      <MenuItem href="#">Open GitHub Repo</MenuItem>
      <MenuItem href="#">Contact Support</MenuItem>
    </Menu>
  );
}`;

const customTriggerCode = `import { Menu, MenuButton, MenuItem } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu>
      <MenuButton
        variant="secondary"
        shape="square"
        style={{ borderRadius: '50%', overflow: 'hidden' }}
      >
        <img
          src="https://vercel.com/api/www/avatar?u=evilrabbit&s=44"
          alt="Avatar"
          width={32}
          height={32}
        />
      </MenuButton>
      <MenuItem onClick={() => console.log('profile')}>View Profile</MenuItem>
      <MenuItem onClick={() => console.log('settings')}>Account Settings</MenuItem>
      <MenuItem onClick={() => console.log('logout')}>Sign Out</MenuItem>
    </Menu>
  );
}`;

const prefixSuffixCode = `import { Menu, MenuButton, MenuItem } from '@/components/ui/Menu';
import { MoreHorizontal, Accessibility } from 'lucide-react';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-6">
      <Menu width={150}>
        <MenuButton
          aria-label="Menu"
          variant="secondary"
          size="small"
          shape="square"
        >
          <MoreHorizontal size={16} />
        </MenuButton>
        <MenuItem prefix={<Accessibility size={16} />}>Align Left</MenuItem>
        <MenuItem prefix={<Accessibility size={16} />}>Align Center</MenuItem>
        <MenuItem prefix={<Accessibility size={16} />}>Align Right</MenuItem>
      </Menu>
      <Menu width={150}>
        <MenuButton
          aria-label="Menu"
          variant="secondary"
          size="small"
          shape="square"
        >
          <MoreHorizontal size={16} />
        </MenuButton>
        <MenuItem suffix={<Accessibility size={16} />}>Align Left</MenuItem>
        <MenuItem suffix={<Accessibility size={16} />}>Align Center</MenuItem>
        <MenuItem suffix={<Accessibility size={16} />}>Align Right</MenuItem>
      </Menu>
    </div>
  );
}`;

const menuPositionCode = `import { Menu, MenuButton, MenuItem } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu position="left-start">
      <MenuButton>Left Start</MenuButton>
      <MenuItem>Edit Race</MenuItem>
      <MenuItem>Duplicate Race</MenuItem>
    </Menu>
  );
}`;

const menuSectionCode = `import { Menu, MenuButton, MenuItem, MenuSection, MenuSeparator } from '@/components/ui/Menu';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return (
    <Menu>
      <MenuButton variant="secondary" chevron>Account</MenuButton>
      <MenuSection title="Workspace">
        <MenuItem>Switch Workspace</MenuItem>
        <MenuItem>Invite Members</MenuItem>
      </MenuSection>
      <MenuSeparator />
      <MenuSection title="Account">
        <MenuItem>Account Settings</MenuItem>
        <MenuItem>Sign Out</MenuItem>
      </MenuSection>
    </Menu>
  );
}`;

// ============================================================================
// SVG Icons for Demos
// ============================================================================

function ThreeDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="2.5" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13.5" cy="8" r="1.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L3.462 11.098a.25.25 0 00-.064.108l-.631 2.208 2.208-.63a.25.25 0 00.108-.064l8.61-8.61a.25.25 0 000-.355l-1.086-1.086z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19a1.75 1.75 0 001.741-1.575l.66-6.6a.75.75 0 00-1.492-.15l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"
      />
    </svg>
  );
}

// ============================================================================
// Demo Components
// ============================================================================

function DefaultDemo() {
  return (
    <Menu>
      <MenuButton>Actions</MenuButton>
      <MenuItem onClick={() => console.log("edit")}>Edit Race</MenuItem>
      <MenuItem onClick={() => console.log("duplicate")}>Duplicate Race</MenuItem>
      <MenuItem onClick={() => console.log("archive")}>Archive Race</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log("delete")}>Delete Race</MenuItem>
    </Menu>
  );
}

function WithChevronDemo() {
  return (
    <Menu>
      <MenuButton variant="secondary" chevron>
        Actions
      </MenuButton>
      <MenuItem onClick={() => console.log("edit")}>Edit Race</MenuItem>
      <MenuItem onClick={() => console.log("duplicate")}>Duplicate Race</MenuItem>
      <MenuItem onClick={() => console.log("archive")}>Archive Race</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log("delete")}>Delete Race</MenuItem>
    </Menu>
  );
}

function DisabledItemsDemo() {
  return (
    <Menu>
      <MenuButton>Actions</MenuButton>
      <MenuItem onClick={() => console.log("edit")}>Edit Race</MenuItem>
      <MenuItem disabled>Duplicate Race</MenuItem>
      <MenuItem disabled>Archive Race</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log("delete")}>Delete Race</MenuItem>
    </Menu>
  );
}

function LockedItemsDemo() {
  return (
    <Menu>
      <MenuButton>Actions</MenuButton>
      <MenuItem onClick={() => console.log("view")}>View Race Details</MenuItem>
      <MenuItem onClick={() => console.log("edit")}>Edit Race</MenuItem>
      <MenuItem locked>Delete Race</MenuItem>
    </Menu>
  );
}

function LinkItemsDemo() {
  return (
    <Menu>
      <MenuButton>Links</MenuButton>
      <MenuItem href="/admin/design-system/menu#custom-trigger">View Documentation</MenuItem>
      <MenuItem href="#">Open GitHub Repo</MenuItem>
      <MenuItem href="#">Contact Support</MenuItem>
    </Menu>
  );
}

function CustomTriggerDemo() {
  return (
    <Menu>
      <MenuButton unstyled aria-label="Menu">
        <Avatar
          src="https://vercel.com/api/www/avatar?u=evilrabbit&s=60"
          alt="Avatar for evilrabbit"
          size={30}
        />
      </MenuButton>
      <MenuItem onClick={() => console.log("profile")}>View Profile</MenuItem>
      <MenuItem onClick={() => console.log("settings")}>Account Settings</MenuItem>
      <MenuItem onClick={() => console.log("logout")}>Sign Out</MenuItem>
    </Menu>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 3C8.82843 3 9.5 2.32843 9.5 1.5C9.5 0.671573 8.82843 0 8 0C7.17157 0 6.5 0.671573 6.5 1.5C6.5 2.32843 7.17157 3 8 3Z" />
      <path d="M4.67148 6C5.89632 6 6.83343 7.09104 6.64857 8.30185L6.43 9.73346C6.3381 10.2159 6.1906 10.6874 6 11.1401L4.33 15.2L5.92164 15.888L7.594 11.9162C7.72668 11.6011 8.27332 11.6011 8.406 11.9162L10.0784 15.888L11.67 15.2L10 11.1401C9.8094 10.6874 9.6619 10.2159 9.57 9.73346L9.2835 8.42904C9.00946 7.18131 9.95947 6 11.2369 6H14V4.5H2V6H4.67148Z" />
    </svg>
  );
}

function PrefixSuffixDemo() {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
      <Menu width={150}>
        <MenuButton variant="secondary" size="small" shape="square">
          <ThreeDotsIcon />
        </MenuButton>
        <MenuItem prefix={<PersonIcon />} onClick={() => console.log("left")}>Align Left</MenuItem>
        <MenuItem prefix={<PersonIcon />} onClick={() => console.log("center")}>Align Center</MenuItem>
        <MenuItem prefix={<PersonIcon />} onClick={() => console.log("right")}>Align Right</MenuItem>
      </Menu>
      <Menu width={150}>
        <MenuButton variant="secondary" size="small" shape="square">
          <ThreeDotsIcon />
        </MenuButton>
        <MenuItem suffix={<PersonIcon />} onClick={() => console.log("left")}>Align Left</MenuItem>
        <MenuItem suffix={<PersonIcon />} onClick={() => console.log("center")}>Align Center</MenuItem>
        <MenuItem suffix={<PersonIcon />} onClick={() => console.log("right")}>Align Right</MenuItem>
      </Menu>
    </div>
  );
}

function MenuPositionDemo() {
  return (
    <Menu position="left-start">
      <MenuButton>Left Start</MenuButton>
      <MenuItem onClick={() => console.log("edit")}>Edit Race</MenuItem>
      <MenuItem onClick={() => console.log("duplicate")}>Duplicate Race</MenuItem>
    </Menu>
  );
}

function MenuSectionDemo() {
  return (
    <Menu>
      <MenuButton variant="secondary" chevron>
        Account
      </MenuButton>
      <MenuSection title="Workspace">
        <MenuItem onClick={() => console.log("switch")}>
          Switch Workspace
        </MenuItem>
        <MenuItem onClick={() => console.log("invite")}>
          Invite Members
        </MenuItem>
      </MenuSection>
      <MenuSeparator />
      <MenuSection title="Account">
        <MenuItem onClick={() => console.log("settings")}>
          Account Settings
        </MenuItem>
        <MenuItem onClick={() => console.log("signout")}>
          Sign Out
        </MenuItem>
      </MenuSection>
    </Menu>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function MenuComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-6" style={{ lineHeight: 1.5 }}>
          Menu extends the{" "}
          <a
            href="/admin/design-system/button"
            className="text-textSubtle underline hover:text-textDefault transition-colors"
          >
            Button
          </a>{" "}
          component.
        </p>
        <div className="mt-6">
          <CodePreview componentCode={defaultCode}>
            <DefaultDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="with-chevron" onCopyLink={showToast}>
          With chevron
        </SectionHeader>
        <div className="mt-6">
          <CodePreview componentCode={withChevronCode}>
            <WithChevronDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="disabled-items" onCopyLink={showToast}>
          Disabled items
        </SectionHeader>
        <div className="mt-6">
          <CodePreview componentCode={disabledItemsCode}>
            <DisabledItemsDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="locked-items" onCopyLink={showToast}>
          Locked items
        </SectionHeader>
        <p className="text-copy-16 mt-2 leading-6 xl:mt-4" style={{ lineHeight: 1.5, color: "hsl(var(--color-textSubtle))" }}>
          Use <code>MenuItemLocked</code> to indicate an action that requires additional permissions. The item is rendered as disabled with a lock icon suffix.
        </p>
        <div className="mt-6">
          <CodePreview componentCode={lockedItemsCode}>
            <LockedItemsDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="link-items" onCopyLink={showToast}>
          Link items
        </SectionHeader>
        <div className="mt-6">
          <CodePreview componentCode={linkItemsCode}>
            <LinkItemsDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="custom-trigger" onCopyLink={showToast}>
          Custom trigger
        </SectionHeader>
        <p className="text-copy-16 mt-2 leading-6 xl:mt-4" style={{ lineHeight: 1.5, color: "hsl(var(--color-textSubtle))" }}>
          The trigger is still wrapped by an unstyled button.
        </p>
        <div className="mt-6">
          <CodePreview componentCode={customTriggerCode}>
            <CustomTriggerDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="prefix-and-suffix" onCopyLink={showToast}>
          Prefix and suffix
        </SectionHeader>
        <p className="text-copy-16 mt-2 leading-6 xl:mt-4" style={{ lineHeight: 1.5, color: "hsl(var(--color-textSubtle))" }}>
          The trigger is still wrapped by an unstyled button.
        </p>
        <div className="mt-6">
          <CodePreview componentCode={prefixSuffixCode}>
            <PrefixSuffixDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="menu-position" onCopyLink={showToast}>
          Menu position
        </SectionHeader>
        <p className="text-copy-16 mt-2 leading-6 xl:mt-4" style={{ lineHeight: 1.5, color: "hsl(var(--color-textSubtle))" }}>
          The position will automatically adapt based on the window bounds.
        </p>
        <div className="mt-6">
          <CodePreview componentCode={menuPositionCode}>
            <MenuPositionDemo />
          </CodePreview>
        </div>
      </Section>

      <Section>
        <SectionHeader id="menu-section" onCopyLink={showToast}>
          Menu sections
        </SectionHeader>
        <p className="text-copy-16 mt-2 leading-6 xl:mt-4" style={{ lineHeight: 1.5, color: "hsl(var(--color-textSubtle))" }}>
          Group related items under a Title Case header with{" "}
          <code className="inline-code">&lt;MenuSection title=&quot;&hellip;&quot;&gt;</code>{" "}
          when the menu starts to crowd past ~10 items.
        </p>
        <div className="mt-6">
          <CodePreview componentCode={menuSectionCode}>
            <MenuSectionDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Best Practices Section */}
      <Section>
        <SectionHeader id="best-practices" onCopyLink={showToast}>
          Best Practices
        </SectionHeader>

        <h3
          id="when-to-use"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          When to use
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Use Menu for a discoverable trigger that opens a list of
            actions on a single resource (a dots menu on a row, a
            dropdown on a primary entity).
          </li>
          <li>
            For right-click or long-press on a row, use{" "}
            <ComponentRef name="Context Menu" />. For global commands
            behind <code className="inline-code">⌘K</code>, use{" "}
            <ComponentRef name="Command Menu" />. For two related
            primary actions, use{" "}
            <ComponentRef name="Split Button" /> rather than burying
            the secondary action.
          </li>
          <li>
            Cap a Menu around 10 items. Past that, group with{" "}
            <code className="inline-code">MenuSection</code> or move
            secondary actions to a settings page.
          </li>
        </ul>

        <h3
          id="behavior"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Behavior
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Open on click, not hover; hover-open menus collide with
            screen readers and trackpad scrolls.
          </li>
          <li>
            Position auto-flips based on window bounds; don&apos;t
            hardcode a side that clips on narrow viewports.
          </li>
          <li>
            Close on item activation, Escape, and outside-click.
            Don&apos;t auto-close on a hover-out.
          </li>
          <li>
            Use{" "}
            <code className="inline-code">&lt;MenuItem locked&gt;</code>{" "}
            for permission-gated actions so the lock icon and
            disabled state explain why the row is inert.
          </li>
        </ul>

        <h3
          id="content"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Content
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Item children are Title Case{" "}
            <code className="inline-code">Verb + Noun</code> (
            <code className="inline-code">Rename Project</code>,{" "}
            <code className="inline-code">Duplicate Deployment</code>).
            Bare verbs like{" "}
            <code className="inline-code">Rename</code> or{" "}
            <code className="inline-code">Edit</code> are wrong outside
            obvious single-object context.
          </li>
          <li>
            End an item with{" "}
            <code className="inline-code">&hellip;</code> only when
            activating it opens a follow-up dialog (
            <code className="inline-code">Rename&hellip;</code>,{" "}
            <code className="inline-code">
              Transfer to Team&hellip;
            </code>
            ).
          </li>
          <li>
            Group destructive items at the bottom, separated by a
            divider, and keep the destructive copy as{" "}
            <code className="inline-code">Verb + Noun</code> (
            <code className="inline-code">Delete Project</code>, never
            bare <code className="inline-code">Delete</code>).
          </li>
          <li>
            Section headers (
            <code className="inline-code">
              MenuSection title
            </code>
            ) are Title Case, 1&ndash;2 words (
            <code className="inline-code">Workspace</code>,{" "}
            <code className="inline-code">Recent Projects</code>).
          </li>
        </ul>

        <h3
          id="accessibility"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Accessibility
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Up/Down arrows move focus through items, Home/End jump to
            first/last, Enter or Space activates.
          </li>
          <li>
            Typeahead jumps to the next item whose label starts with the
            typed character; keep the visible label first so typeahead
            matches what the user sees.
          </li>
          <li>
            Return focus to the trigger on close so keyboard users keep
            their place in the row.
          </li>
        </ul>
      </Section>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />
    </>
  );
}

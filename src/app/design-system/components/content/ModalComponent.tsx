"use client";

import React, { useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

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
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
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
    <div className="border border-[var(--ds-gray-400)] rounded-lg">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "var(--ds-background-100)" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg overflow-hidden"
        style={{ background: "var(--ds-background-200)" }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-[var(--ds-gray-400)]"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-[13px]"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>
              <pre className="overflow-x-auto py-4" data-code-block>
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

// ============================================================================
// Code Examples
// ============================================================================

const defaultCode = `import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function DefaultExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Token"
        subtitle="Enter a unique name for your token to differentiate it from other tokens and then select the scope."
        footer={
          <footer style={{
            display: "flex",
            justifyContent: "space-between",
            flexShrink: 0,
            padding: 16,
            position: "sticky",
            bottom: 0,
          }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Submit</Button>
          </footer>
        }
      >
        <p className="text-copy-14">
          Some content contained within the modal.
        </p>
      </Modal>
    </>
  );
}`;

const stickyCode = `import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function StickyExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Terms of Service"
        stickyHeader
        footer={
          <footer style={{
            display: "flex",
            justifyContent: "space-between",
            flexShrink: 0,
            padding: 16,
            position: "sticky",
            bottom: 0,
          }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>Decline</Button>
            <Button onClick={() => setOpen(false)}>Accept</Button>
          </footer>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Long content that causes scrolling */}
          <p className="text-copy-14" style={{ color: "var(--ds-gray-900)", margin: 0 }}>
            Lorem ipsum dolor sit amet...
          </p>
        </div>
      </Modal>
    </>
  );
}`;

const singleButtonCode = `import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function SingleButtonExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Welcome"
        subtitle="Your account has been created successfully."
        footer={
          <footer style={{
            display: "flex",
            justifyContent: "flex-end",
            flexShrink: 0,
            padding: 16,
            position: "sticky",
            bottom: 0,
          }}>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </footer>
        }
      >
        <p className="text-copy-14" style={{ color: "var(--ds-gray-900)", margin: 0 }}>
          You can now start using all features of the platform.
        </p>
      </Modal>
    </>
  );
}`;

const disabledActionsCode = `import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function DisabledActionsExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Project"
        subtitle="This action cannot be undone. Please type the project name to confirm."
        footer={
          <footer style={{
            display: "flex",
            justifyContent: "space-between",
            flexShrink: 0,
            padding: 16,
            position: "sticky",
            bottom: 0,
          }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled>Delete</Button>
          </footer>
        }
      >
        <p className="text-copy-14" style={{ color: "var(--ds-gray-900)", margin: 0 }}>
          Type the project name to enable the delete button.
        </p>
      </Modal>
    </>
  );
}`;

const insetCode = `import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function InsetExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Environment Variables"
        subtitle="Add environment variables to your project."
        footer={
          <footer style={{
            display: "flex",
            justifyContent: "space-between",
            flexShrink: 0,
            padding: 16,
            position: "sticky",
            bottom: 0,
          }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </footer>
        }
      >
        {/* Inset section with contrasting background */}
        <div style={{
          background: "var(--ds-background-200)",
          borderTop: "1px solid var(--ds-gray-alpha-400)",
          margin: "0 -24px -24px",
          padding: 24,
        }}>
          <p className="text-copy-14" style={{ color: "var(--ds-gray-900)", margin: 0 }}>
            The inset section provides a visually distinct area within
            the modal body, useful for forms or secondary content.
          </p>
        </div>
      </Modal>
    </>
  );
}`;

// ============================================================================
// Demo Components
// ============================================================================

function DefaultDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Token"
        subtitle="Enter a unique name for your token to differentiate it from other tokens and then select the scope."
        footer={
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexShrink: 0,
              padding: 16,
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Submit</Button>
          </footer>
        }
      >
        <p className="text-copy-14">
          Some content contained within the modal.
        </p>
      </Modal>
    </>
  );
}

function StickyDemo() {
  const [open, setOpen] = useState(false);

  const paragraphs = [
    "These Terms of Service govern your use of the platform. By accessing or using our services, you agree to be bound by these terms. If you do not agree, you may not use the platform.",
    "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.",
    "We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will provide reasonable notice of any significant changes that may affect your use of the platform.",
    "All content and materials available on the platform are protected by intellectual property rights. You may not copy, modify, distribute, or create derivative works without prior written consent.",
    "You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service. Any violation of these terms may result in immediate termination of your account.",
    "Our liability is limited to the maximum extent permitted by applicable law. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
    "These terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction. Any disputes shall be resolved through binding arbitration.",
    "By continuing to use the platform after changes to these terms, you accept the modified terms. We encourage you to review these terms periodically for any updates.",
  ];

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Terms of Service"
        stickyHeader
        footer={
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexShrink: 0,
              padding: 16,
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button onClick={() => setOpen(false)}>Accept</Button>
          </footer>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {paragraphs.map((text, i) => (
            <p
              key={i}
              className="text-copy-14"
              style={{ color: "var(--ds-gray-900)", margin: 0 }}
            >
              {text}
            </p>
          ))}
        </div>
      </Modal>
    </>
  );
}

function SingleButtonDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Welcome"
        subtitle="Your account has been created successfully."
        footer={
          <footer
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexShrink: 0,
              padding: 16,
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button onClick={() => setOpen(false)}>Done</Button>
          </footer>
        }
      >
        <p
          className="text-copy-14"
          style={{ color: "var(--ds-gray-900)", margin: 0 }}
        >
          You can now start using all features of the platform.
        </p>
      </Modal>
    </>
  );
}

function DisabledActionsDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Project"
        subtitle="This action cannot be undone. Please type the project name to confirm."
        footer={
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexShrink: 0,
              padding: 16,
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled>Delete</Button>
          </footer>
        }
      >
        <p
          className="text-copy-14"
          style={{ color: "var(--ds-gray-900)", margin: 0 }}
        >
          Type the project name to enable the delete button.
        </p>
      </Modal>
    </>
  );
}

function InsetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Environment Variables"
        subtitle="Add environment variables to your project."
        footer={
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexShrink: 0,
              padding: 16,
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </footer>
        }
      >
        <div
          style={{
            background: "var(--ds-background-200)",
            borderTop: "1px solid var(--ds-gray-alpha-400)",
            margin: "0 -24px -24px",
            padding: 24,
          }}
        >
          <p
            className="text-copy-14"
            style={{ color: "var(--ds-gray-900)", margin: 0 }}
          >
            The inset section provides a visually distinct area within the modal
            body, useful for forms or secondary content.
          </p>
        </div>
      </Modal>
    </>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ModalComponent() {
  const { toast, showToast, dismissToast } = useToast();

  return (
    <>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onDismiss={dismissToast}
      />

      {/* Default */}
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={defaultCode}>
            <DefaultDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Sticky */}
      <Section>
        <SectionHeader id="sticky" onCopyLink={showToast}>
          Sticky
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={stickyCode}>
            <StickyDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Single button */}
      <Section>
        <SectionHeader id="single-button" onCopyLink={showToast}>
          Single button
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={singleButtonCode}>
            <SingleButtonDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Disabled actions */}
      <Section>
        <SectionHeader id="disabled-actions" onCopyLink={showToast}>
          Disabled actions
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={disabledActionsCode}>
            <DisabledActionsDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Inset */}
      <Section>
        <SectionHeader id="inset" onCopyLink={showToast}>
          Inset
        </SectionHeader>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={insetCode}>
            <InsetDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Props */}
      <Section>
        <SectionHeader id="props" onCopyLink={showToast}>
          Props
        </SectionHeader>

        <p className="text-copy-14 text-textSubtle mt-4 mb-4">
          Available props for the Modal component.
        </p>
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
                <td className="py-3 pr-4 font-mono">open</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  boolean
                </td>
                <td className="py-3 px-4 text-textSubtle">false</td>
                <td className="py-3 px-4 text-textSubtle">
                  Whether the modal is visible
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">onClose</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  {"() => void"}
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Called when the modal should close (backdrop click or Escape
                  key)
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">children</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Modal body content rendered inside the scrollable area
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">title</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  string
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Title displayed in the modal header
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">subtitle</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  string
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Subtitle displayed below the title in the header
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">footer</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  ReactNode
                </td>
                <td className="py-3 px-4 text-textSubtle">-</td>
                <td className="py-3 px-4 text-textSubtle">
                  Footer content rendered outside the scrollable body area
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">stickyHeader</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  boolean
                </td>
                <td className="py-3 px-4 text-textSubtle">false</td>
                <td className="py-3 px-4 text-textSubtle">
                  Enable sticky header that stays visible when body scrolls
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">className</td>
                <td className="py-3 px-4 font-mono text-textSubtle">
                  string
                </td>
                <td className="py-3 px-4 text-textSubtle">{`""`}</td>
                <td className="py-3 px-4 text-textSubtle">
                  Additional CSS classes for the modal dialog element
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

"use client";

import React, { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import AdminEnvFilter from "@/components/admin/AdminEnvFilter";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

import { ComponentRef } from "../ComponentRef";
import { Section } from "../ContentWithTOC";

// ============================================================================
// Page chrome — copied verbatim from AccordionComponent.tsx per the DS
// convention (TODO: extract into a shared module once we touch more than
// one of these in a single PR).
// ============================================================================

const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

function Toast({
  message,
  isVisible,
}: {
  message: string;
  isVisible: boolean;
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
        <span className="text-copy-14 text-textDefault">{message}</span>
      </div>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg
      height="14"
      width="14"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      aria-hidden="true"
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
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top - HEADER_HEIGHT - SECTION_PADDING,
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

function CopyIconButton({ copied }: { copied: boolean }) {
  return copied ? (
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
  ) : (
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

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

function CodePreview({
  children,
  componentCode,
}: {
  children: React.ReactNode;
  componentCode: string;
}) {
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
            className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-copy-13"
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
// Demos
// ============================================================================

function DefaultDemo() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <AdminEnvFilter current="all" />
    </div>
  );
}

function SelectedDemo() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <AdminEnvFilter current="production" />
    </div>
  );
}

// ============================================================================
// Code strings
// ============================================================================

const defaultCode = `import AdminEnvFilter from '@/components/admin/AdminEnvFilter';
import type { EnvFilter } from '@/components/admin/env';

type Props = {
  searchParams: Promise<{ env?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { env } = await searchParams;
  const current: EnvFilter =
    env === 'production' || env === 'staging' || env === 'development'
      ? env
      : 'all';

  return <AdminEnvFilter current={current} />;
}`;

const selectedCode = `// Render with a pre-selected environment when ?env=production is in the URL.
<AdminEnvFilter current="production" />`;

// ============================================================================
// Page
// ============================================================================

export default function AdminEnvFilterComponent() {
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast((t) => ({ ...t, isVisible: false })), 2000);
  };

  return (
    <>
      <Toast message={toast.message} isVisible={toast.isVisible} />

      {/* Default */}
      <Section>
        <SectionHeader id="default" onCopyLink={showToast}>
          Default
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          A secondary <ComponentRef name="Menu" /> trigger that lets
          admins scope a dashboard to a single deployment env —{" "}
          <em>Production</em>, <em>Staging</em>, <em>Development</em>{" "}
          — or leave it on <em>All environments</em>. Writes its
          selection to the URL via{" "}
          <code className="inline-code">?env=</code> (omitted when{" "}
          <em>All</em>).
        </p>
        <p className="text-copy-14 text-textSubtle mt-3 mb-4 xl:mb-6">
          <em>
            Note: selecting an option here updates this page&apos;s URL —
            that&apos;s the filter&apos;s real behaviour, not a bug.
          </em>
        </p>
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      {/* Pre-selected */}
      <Section>
        <SectionHeader id="pre-selected" onCopyLink={showToast}>
          Pre-selected
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Reading <code className="inline-code">?env=production</code>{" "}
          from <code className="inline-code">searchParams</code> and
          passing it down restores the picker to the same state on
          refresh / share / back-button. The trigger label updates to
          match.
        </p>
        <CodePreview componentCode={selectedCode}>
          <SelectedDemo />
        </CodePreview>
      </Section>

      {/* Best Practices */}
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
            Any admin dashboard backed by a table with an{" "}
            <code className="inline-code">environment</code> column
            written at insert time (consent, feedback, future
            analytics). Sits to the left of{" "}
            <ComponentRef name="Admin Date Range Picker" /> on the
            filter row.
          </li>
          <li>
            Don&apos;t expose to non-admins — env is an internal
            distinction. Public-facing analytics should always be
            production-only and not show this control.
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
            URL-driven, no internal state. Read{" "}
            <code className="inline-code">?env=</code> server-side and
            pass <code className="inline-code">current</code> down — the
            same pattern as{" "}
            <ComponentRef name="Admin Date Range Picker" />.
          </li>
          <li>
            <em>All environments</em> is the default and stays off the
            URL for clean shareable links. The other three values write{" "}
            <code className="inline-code">?env=production</code>,{" "}
            <code className="inline-code">?env=staging</code>, or{" "}
            <code className="inline-code">?env=development</code>.
          </li>
          <li>
            Switching env <strong>drops</strong> any active{" "}
            <code className="inline-code">?filter=</code> — a filter
            from a different env (e.g. an opt-out reason that only
            exists in production data) is usually noise.
          </li>
          <li>
            Navigation goes through{" "}
            <code className="inline-code">router.push()</code> inside{" "}
            <code className="inline-code">startTransition</code>; the
            trigger dims to 0.6 opacity during the re-fetch as a
            lightweight loading affordance.
          </li>
          <li>
            The trigger width is pinned to{" "}
            <code className="inline-code">200px</code> — wide enough
            for the longest label (<em>All environments</em>) so the
            row doesn&apos;t shift when the selection changes.
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
            Labels are fixed — <em>All environments</em>,{" "}
            <em>Production</em>, <em>Staging</em>,{" "}
            <em>Development</em> — and consistent across every admin
            dashboard so muscle memory transfers.
          </li>
          <li>
            The concrete env values map from{" "}
            <code className="inline-code">VERCEL_ENV</code> at insert
            time (<em>production</em> → <em>production</em>,{" "}
            <em>preview</em> → <em>staging</em>, else{" "}
            <em>development</em>). Keep the dashboard filter labels in
            lockstep with that mapping or rows will appear to be missing.
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
            Inherits keyboard nav from <ComponentRef name="Menu" /> —
            Enter/Space opens, arrow keys move between options,
            Enter/Space selects, Escape closes.
          </li>
          <li>
            The selected option carries a <em>Check</em> suffix as a
            non-colour affordance — screen readers announce it via the
            icon&apos;s text equivalent and sighted users see it
            without relying on the trigger label alone.
          </li>
          <li>
            The trigger shows a focus ring on click and while open —
            matches <ComponentRef name="Admin Date Range Picker" /> and{" "}
            <ComponentRef name="Input" /> for row-level consistency. The
            ring uses the{" "}
            <code className="inline-code">[data-menu-trigger=&quot;secondary&quot;]</code>{" "}
            selector defined in <em>globals.css</em>.
          </li>
        </ul>
      </Section>
    </>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { useToast } from "@/components/ui/Toast";
import { Note } from "@/components/ui/Note";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  CONSENT_CATEGORIES,
  CONSENT_COPY,
  ConsentAnonIdSection,
  ConsentCategoryRow,
} from "@/components/ui/ConsentBanner";
import type { ConsentPreferences } from "@/contexts/ConsentContext";

// ============================================================================
// Section header + copy link
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
      const scrollTarget = absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit text-left cursor-pointer bg-transparent border-none"
      id={id}
      style={{ scrollMarginTop: 32 }}
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
// Code preview
// ============================================================================

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

function CopyIcon() {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor" }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z" fill="currentColor" />
    </svg>
  );
}

function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <span className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
        <CopyIcon />
      </span>
      <span className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        <CheckIcon />
      </span>
    </div>
  );
}

function CodePreview({ children, componentCode, minHeight = 220 }: { children: React.ReactNode; componentCode: string; minHeight?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tokenizedLines = useShikiHighlighter(componentCode, "tsx");
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map((line) => [{ content: line, color: "var(--ds-gray-1000)", darkColor: "var(--ds-gray-1000)" }] as DualThemeToken[]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="border border-[var(--ds-gray-400)] rounded-lg w-full min-w-0 overflow-hidden">
      <div className="p-6 flex items-center justify-center" style={{ background: "var(--ds-background-100)", minHeight }}>
        {children}
      </div>
      <div style={{ background: "var(--ds-background-200)" }}>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-[var(--ds-gray-400)]">
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-[13px]" style={{ background: "var(--ds-background-100)" }}>
            <div className="relative group">
              <button onClick={handleCopy} className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]" aria-label="Copy code">
                <CopyIconButton copied={copied} />
              </button>
              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-[13px] leading-[20px] font-mono">
                  {lines.map((lineTokens, index) => (
                    <div key={index} className="flex px-4" style={{ fontFeatureSettings: '"liga" off' }}>
                      <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">{index + 1}</span>
                      <span className="flex-1 pr-4">
                        {lineTokens.map((token, i) => <RenderShikiToken key={i} token={token} />)}
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
// Decoupled demo — renders the real floating banner and modal at their
// natural fixed positions over the page, driven by local state. Nothing
// here touches the real consent context.
// ============================================================================

function DemoFloatingBanner({
  onDeny,
  onAccept,
  onCustomise,
}: {
  onDeny: () => void;
  onAccept: () => void;
  onCustomise: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes ds-consent-demo-in {
          from {
            opacity: 0;
            transform: translateY(calc(100% + 24px));
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div
        role="alertdialog"
        aria-labelledby="consent-demo-title"
        aria-modal="false"
        className="fixed bottom-4 left-4 right-4 z-[10000] sm:right-auto sm:max-w-[400px]"
        style={{
          animation:
            "ds-consent-demo-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="flex flex-col gap-4 rounded-xl p-5"
          style={{
            background: "var(--ds-background-100)",
            border: "1px solid var(--ds-gray-400)",
            boxShadow: "var(--ds-shadow-menu)",
          }}
        >
          <div>
            <h2
              id="consent-demo-title"
              className="text-[16px] font-semibold text-textDefault leading-tight"
            >
              {CONSENT_COPY.bannerTitle}
            </h2>
            <p className="mt-2 text-[13px] leading-[1.55] text-textSubtle">
              {CONSENT_COPY.bannerDescription}{" "}
              <a
                href={CONSENT_COPY.cookiePolicyHref}
                className="text-textDefault underline hover:opacity-80"
                onClick={(e) => e.preventDefault()}
              >
                Cookie Policy
              </a>{" "}
              and{" "}
              <a
                href={CONSENT_COPY.privacyHref}
                className="text-textDefault underline hover:opacity-80"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              shape="rounded"
              size="small"
              onClick={onDeny}
            >
              Deny
            </Button>
            <Button
              variant="secondary"
              shape="rounded"
              size="small"
              onClick={onAccept}
            >
              Accept all
            </Button>
            <Button
              shape="rounded"
              size="small"
              onClick={onCustomise}
              className="ml-auto"
            >
              Customise
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

function DemoSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ConsentPreferences>({
    essential: true,
    marketing: false,
    analytics: false,
    functional: false,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={CONSENT_COPY.modalTitle}
      subtitle={CONSENT_COPY.modalDescription}
      footer={
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Deny
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Accept all
            </Button>
            <Button onClick={onClose} className="ml-auto">
              Save
            </Button>
          </div>
          <p
            className="text-[12px] leading-[1.6]"
            style={{ color: "var(--ds-gray-700)", margin: 0 }}
          >
            For more information, see our{" "}
            <a
              href={CONSENT_COPY.cookiePolicyHref}
              className="text-textDefault underline hover:opacity-80"
              onClick={(e) => e.preventDefault()}
            >
              Cookie Policy
            </a>{" "}
            and{" "}
            <a
              href={CONSENT_COPY.privacyHref}
              className="text-textDefault underline hover:opacity-80"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      }
    >
      <div
        className="overflow-hidden"
        style={{
          border: "1px solid var(--ds-gray-400)",
          borderRadius: 6,
          background: "var(--ds-background-100)",
        }}
      >
        {CONSENT_CATEGORIES.map((cat, i) => (
          <ConsentCategoryRow
            key={cat.key}
            category={cat}
            value={draft[cat.key]}
            onChange={(next) => {
              if (cat.required) return;
              setDraft((d) => ({ ...d, [cat.key]: next }));
            }}
            isLast={i === CONSENT_CATEGORIES.length - 1}
          />
        ))}
      </div>
      <ConsentAnonIdSection anonId="demo-0000-0000-0000-000000000000" />
    </Modal>
  );
}

function ConsentBannerDemo() {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setBannerOpen(true)}>
        Show banner
      </Button>
      {bannerOpen && !modalOpen && (
        <DemoFloatingBanner
          onDeny={() => setBannerOpen(false)}
          onAccept={() => setBannerOpen(false)}
          onCustomise={() => setModalOpen(true)}
        />
      )}
      <DemoSettingsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setBannerOpen(false);
        }}
      />
    </>
  );
}

// ============================================================================
// Code snippets
// ============================================================================

const previewCode = `import { ConsentBanner } from "@/components/ui/ConsentBanner";

// Mount once at the app root. The banner auto-hides after the user
// makes a decision and reopens via the settings modal.
export default function Demo() {
  return <ConsentBanner />;
}`;

const providerSetupCode = `// src/app/layout.tsx
import { ConsentProvider } from "@/contexts/ConsentContext";
import { ConsentBanner } from "@/components/ui/ConsentBanner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConsentProvider>
          {children}
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}`;

const useConsentCode = `// Read consent state from any component
import { useConsent, useConsentCategory } from "@/contexts/ConsentContext";

function MyComponent() {
  const { preferences, openSettings } = useConsent();
  const canShowMarketing = useConsentCategory("marketing");

  return (
    <>
      {canShowMarketing && <AdSlot slot="..." size="mpu" />}
      <button onClick={openSettings}>Cookie preferences</button>
    </>
  );
}`;

// ============================================================================
// Main
// ============================================================================

export default function ConsentBannerComponent() {
  const { showToast } = useToast();

  return (
    <div>
      {/* Intro */}
      <Section>
        <SectionHeader id="intro" onCopyLink={showToast}>
          Intro
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 xl:mt-7 mb-6">
          The consent banner is how Distanz Running asks visitors for
          permission before loading tracking scripts, advertising, and other
          third-party tech. It appears once on first visit, captures four
          consent categories (Essential, Marketing, Analytics, Functional),
          persists to{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            localStorage
          </code>
          , and exposes the state via a React context so any component can
          gate itself on the user&apos;s preferences.
        </p>

        <Note type="default">
          <strong>Storage:</strong> preferences live under the
          localStorage key{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            distanz-consent
          </code>{" "}
          with a version field so we can prompt for re-consent if the
          category list changes. A{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            distanz-consent-change
          </code>{" "}
          window event fires on every update, so scripts in{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            layout.tsx
          </code>{" "}
          and elsewhere can react without going through React.
        </Note>
      </Section>

      {/* Preview */}
      <Section>
        <SectionHeader id="preview" onCopyLink={showToast}>
          Preview
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Click <strong>Show banner</strong> to pop the real floating banner
          at its fixed bottom-left position. Deny and Accept dismiss it;
          Customise opens the settings modal. The demo runs on local state —
          nothing here changes your actual consent preferences.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={previewCode}>
            <ConsentBannerDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Provider setup */}
      <Section>
        <SectionHeader id="setup" onCopyLink={showToast}>
          Setup
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Wrap the app in{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            ConsentProvider
          </code>{" "}
          and render{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            ConsentBanner
          </code>{" "}
          once at the root. The banner self-hides once a decision has been
          made and re-opens when{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            reset()
          </code>{" "}
          is called.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={providerSetupCode} minHeight={280}>
            <pre className="font-mono text-[12px] leading-[1.6] text-textSubtle text-left">
              {providerSetupCode}
            </pre>
          </CodePreview>
        </div>
      </Section>

      {/* Consuming consent */}
      <Section>
        <SectionHeader id="consuming" onCopyLink={showToast}>
          Consuming consent
        </SectionHeader>
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Use{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            useConsent()
          </code>{" "}
          to read the full preferences object or trigger the settings modal,
          and{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            useConsentCategory(name)
          </code>{" "}
          when you just need a boolean for a single category. Before the
          user decides, every optional category defaults to{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            false
          </code>{" "}
          — the strict default expected by GDPR.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={useConsentCode} minHeight={320}>
            <pre className="font-mono text-[12px] leading-[1.6] text-textSubtle text-left">
              {useConsentCode}
            </pre>
          </CodePreview>
        </div>
      </Section>
    </div>
  );
}

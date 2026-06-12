"use client";

import React, { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Fieldset } from "@/components/ui/Fieldset";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

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
// Demos
// ============================================================================

const LONG_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur.";

function DefaultDemo() {
  return (
    <Fieldset
      title="Account Settings"
      subtitle="Manage your account preferences and settings"
      status={
        <span>
          Need help?{" "}
          <a href="#" className="text-link underline">
            View documentation
          </a>
        </span>
      }
      action={<Button size="small">Save Changes</Button>}
    />
  );
}

function DisabledDemo() {
  return (
    <Fieldset
      disabled
      title="Transfer Project"
      subtitle="Move this project to another team or account"
      status="You need additional permissions to transfer projects."
    />
  );
}

function LongContentDemo() {
  return (
    <Fieldset
      title="Privacy Policy"
      subtitle={LONG_TEXT}
      status="Last updated: March 10, 2025"
      action={
        <>
          <Button size="small" variant="secondary">
            Decline
          </Button>
          <Button size="small">Accept</Button>
        </>
      }
    />
  );
}

function MultipleDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Fieldset
        title="Personal Information"
        subtitle="Update your name and contact details"
        status="This information will be publicly visible"
        action={<Button size="small">Update</Button>}
      />
      <Fieldset
        title="Security"
        subtitle="Manage your password and authentication methods"
        status="Last password change: 30 days ago"
        action={<Button size="small">Change Password</Button>}
      />
      <Fieldset
        disabled
        title="API Access"
        subtitle="Generate and manage API tokens for programmatic access"
        status="You need a Pro account to access API features."
      />
    </div>
  );
}

function NoFooterDemo() {
  return (
    <Fieldset
      title="Account Information"
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl."
    />
  );
}

function NoTitleDemo() {
  return (
    <Fieldset
      subtitle="This fieldset contains only a subtitle with no title. It can be used for informational sections or supplementary content."
      status="Information only"
    />
  );
}

function ErrorTextDemo() {
  return (
    <Fieldset
      title="API Configuration"
      subtitle="Configure your API endpoint and authentication"
      errorText="API key validation failed. Please check your credentials and try again."
      status="Last checked: 5 minutes ago"
      action={<Button size="small">Verify API Connection</Button>}
    />
  );
}

function WarningTextDemo() {
  return (
    <Fieldset
      title="Database Settings"
      subtitle="Configure your database connection parameters"
      warningText="Changing these settings will require a restart of your application. Make sure to save any pending work."
      status="Current status: Connected"
      action={
        <>
          <Button size="small" variant="secondary">
            Cancel
          </Button>
          <Button size="small">Apply Changes</Button>
        </>
      }
    />
  );
}

function DisabledWallDemo() {
  return (
    <Fieldset
      disabled
      title="Advanced Features"
      subtitle="Access premium capabilities and tools"
      status="Upgrade to a Pro plan to access these features."
    >
      <div className="rounded border border-borderDefault p-4">
        <p>
          This content is behind a disabled wall and not accessible to free
          users.
        </p>
        <p className="mt-2">
          It contains advanced configuration options and premium features.
        </p>
      </div>
    </Fieldset>
  );
}

function ErrorTypeDemo() {
  return (
    <Fieldset
      type="error"
      title="Payment Failed"
      subtitle="Your payment method was declined. Please update your billing information to continue using the service."
      status="Payment failed on February 10, 2026"
      action={
        <>
          <Button size="small" variant="secondary">
            Contact Support
          </Button>
          <Button size="small">Update Payment Method</Button>
        </>
      }
    />
  );
}

function WarningTypeDemo() {
  return (
    <Fieldset
      type="warning"
      title="Trial Ending Soon"
      subtitle="Your trial period will end in 3 days. Add a payment method to continue accessing premium features without interruption."
      status="Trial expires: February 13, 2026"
      action={
        <>
          <Button size="small" variant="secondary">
            Remind Me Later
          </Button>
          <Button size="small">Add Payment Method</Button>
        </>
      }
    />
  );
}

// ============================================================================
// Code strings
// ============================================================================

const defaultCode = `<Fieldset
  title="Account Settings"
  subtitle="Manage your account preferences and settings"
  status={<span>Need help? <a href="#">View documentation</a></span>}
  action={<Button size="small">Save Changes</Button>}
/>`;

const disabledCode = `<Fieldset
  disabled
  title="Transfer Project"
  subtitle="Move this project to another team or account"
  status="You need additional permissions to transfer projects."
/>`;

const longContentCode = `<Fieldset
  title="Privacy Policy"
  subtitle="Lorem ipsum dolor sit amet…"
  status="Last updated: March 10, 2025"
  action={
    <>
      <Button size="small" variant="secondary">Decline</Button>
      <Button size="small">Accept</Button>
    </>
  }
/>`;

const multipleCode = `<div className="flex flex-col gap-6">
  <Fieldset title="Personal Information" subtitle="…" status="…"
    action={<Button size="small">Update</Button>} />
  <Fieldset title="Security" subtitle="…" status="…"
    action={<Button size="small">Change Password</Button>} />
  <Fieldset disabled title="API Access" subtitle="…" status="…" />
</div>`;

const noFooterCode = `<Fieldset
  title="Account Information"
  subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
/>`;

const noTitleCode = `<Fieldset
  subtitle="This fieldset contains only a subtitle with no title."
  status="Information only"
/>`;

const errorTextCode = `<Fieldset
  title="API Configuration"
  subtitle="Configure your API endpoint and authentication"
  errorText="API key validation failed. Please check your credentials and try again."
  status="Last checked: 5 minutes ago"
  action={<Button size="small">Verify API Connection</Button>}
/>`;

const warningTextCode = `<Fieldset
  title="Database Settings"
  subtitle="Configure your database connection parameters"
  warningText="Changing these settings will require a restart of your application."
  status="Current status: Connected"
  action={
    <>
      <Button size="small" variant="secondary">Cancel</Button>
      <Button size="small">Apply Changes</Button>
    </>
  }
/>`;

const disabledWallCode = `<Fieldset
  disabled
  title="Advanced Features"
  subtitle="Access premium capabilities and tools"
  status="Upgrade to a Pro plan to access these features."
>
  <div className="rounded border border-borderDefault p-4">
    <p>This content is behind a disabled wall.</p>
  </div>
</Fieldset>`;

const errorTypeCode = `<Fieldset
  type="error"
  title="Payment Failed"
  subtitle="Your payment method was declined."
  status="Payment failed on February 10, 2026"
  action={
    <>
      <Button size="small" variant="secondary">Contact Support</Button>
      <Button size="small">Update Payment Method</Button>
    </>
  }
/>`;

const warningTypeCode = `<Fieldset
  type="warning"
  title="Trial Ending Soon"
  subtitle="Your trial period will end in 3 days."
  status="Trial expires: February 13, 2026"
  action={
    <>
      <Button size="small" variant="secondary">Remind Me Later</Button>
      <Button size="small">Add Payment Method</Button>
    </>
  }
/>`;

// ============================================================================
// Page
// ============================================================================

export default function FieldsetComponent() {
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
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      {/* Disabled */}
      <Section>
        <SectionHeader id="disabled" onCopyLink={showToast}>
          Disabled
        </SectionHeader>
        <CodePreview componentCode={disabledCode}>
          <DisabledDemo />
        </CodePreview>
      </Section>

      {/* With Long Content */}
      <Section>
        <SectionHeader id="with-long-content" onCopyLink={showToast}>
          With Long Content
        </SectionHeader>
        <CodePreview componentCode={longContentCode}>
          <LongContentDemo />
        </CodePreview>
      </Section>

      {/* Multiple Fieldsets */}
      <Section>
        <SectionHeader id="multiple-fieldsets" onCopyLink={showToast}>
          Multiple Fieldsets
        </SectionHeader>
        <CodePreview componentCode={multipleCode}>
          <MultipleDemo />
        </CodePreview>
      </Section>

      {/* Without Footer */}
      <Section>
        <SectionHeader id="without-footer" onCopyLink={showToast}>
          Without Footer
        </SectionHeader>
        <CodePreview componentCode={noFooterCode}>
          <NoFooterDemo />
        </CodePreview>
      </Section>

      {/* Without Title */}
      <Section>
        <SectionHeader id="without-title" onCopyLink={showToast}>
          Without Title
        </SectionHeader>
        <CodePreview componentCode={noTitleCode}>
          <NoTitleDemo />
        </CodePreview>
      </Section>

      {/* With Error Text */}
      <Section>
        <SectionHeader id="with-error-text" onCopyLink={showToast}>
          With Error Text
        </SectionHeader>
        <CodePreview componentCode={errorTextCode}>
          <ErrorTextDemo />
        </CodePreview>
      </Section>

      {/* With Warning Text */}
      <Section>
        <SectionHeader id="with-warning-text" onCopyLink={showToast}>
          With Warning Text
        </SectionHeader>
        <CodePreview componentCode={warningTextCode}>
          <WarningTextDemo />
        </CodePreview>
      </Section>

      {/* With Disabled Wall */}
      <Section>
        <SectionHeader id="with-disabled-wall" onCopyLink={showToast}>
          With Disabled Wall
        </SectionHeader>
        <CodePreview componentCode={disabledWallCode}>
          <DisabledWallDemo />
        </CodePreview>
      </Section>

      {/* Error Type */}
      <Section>
        <SectionHeader id="error-type" onCopyLink={showToast}>
          Error Type
        </SectionHeader>
        <CodePreview componentCode={errorTypeCode}>
          <ErrorTypeDemo />
        </CodePreview>
      </Section>

      {/* Warning Type */}
      <Section>
        <SectionHeader id="warning-type" onCopyLink={showToast}>
          Warning Type
        </SectionHeader>
        <CodePreview componentCode={warningTypeCode}>
          <WarningTypeDemo />
        </CodePreview>
      </Section>

    </>
  );
}

"use client";

import React, { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Fieldset } from "@/components/ui/Fieldset";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
            color: "rgb(var(--color-textDefault))",
            darkColor: "rgb(var(--color-textDefault))",
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
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto font-mono text-copy-13"
            style={{ background: "var(--ds-background-100)" }}
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

function DefaultDemo() {
  const [name, setName] = useState("distanzrunning");
  return (
    <Fieldset
      id="project-name"
      title="Project name"
      subtitle="Used to identify your project on the dashboard and in deployment URLs."
      status={
        <span>
          Slug auto-derived from name. <em>distanz-runnings-projects/</em>
          {name}
        </span>
      }
      action={
        <Button type="button" size="small" variant="default">
          Save
        </Button>
      }
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
      />
    </Fieldset>
  );
}

function NoFooterDemo() {
  return (
    <Fieldset
      id="project-id"
      title="Project ID"
      subtitle="Used when interacting with the API. Read-only."
    >
      <Input value="prj_GM5xUaOGIzReGFyGbArrLBEQ1SEm" readOnly />
    </Fieldset>
  );
}

function ErrorVariantDemo() {
  return (
    <Fieldset
      id="delete-project"
      variant="error"
      title="Delete project"
      subtitle="Permanently delete this project and all of its data. This action cannot be undone."
      action={
        <Button type="button" size="small" variant="error">
          Delete project
        </Button>
      }
    >
      <Select
        defaultValue="confirm"
        aria-label="Confirm deletion target"
      >
        <option value="confirm">Type the project name to confirm…</option>
      </Select>
    </Fieldset>
  );
}

// ============================================================================
// Code strings
// ============================================================================

const defaultCode = `import { Fieldset } from '@/components/ui/Fieldset';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function Example() {
  return (
    <Fieldset
      id="project-name"
      title="Project name"
      subtitle="Used to identify your project on the dashboard and in deployment URLs."
      status={<span>Slug auto-derived from name.</span>}
      action={<Button size="small">Save</Button>}
    >
      <Input placeholder="Project name" />
    </Fieldset>
  );
}`;

const noFooterCode = `import { Fieldset } from '@/components/ui/Fieldset';
import { Input } from '@/components/ui/Input';

export function Example() {
  return (
    <Fieldset
      id="project-id"
      title="Project ID"
      subtitle="Used when interacting with the API. Read-only."
    >
      <Input value="prj_..." readOnly />
    </Fieldset>
  );
}`;

const errorVariantCode = `import { Fieldset } from '@/components/ui/Fieldset';
import { Button } from '@/components/ui/Button';

export function Example() {
  return (
    <Fieldset
      id="delete-project"
      variant="error"
      title="Delete project"
      subtitle="Permanently delete this project and all of its data."
      action={<Button size="small" variant="error">Delete project</Button>}
    >
      {/* destructive content goes here */}
    </Fieldset>
  );
}`;

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
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Title + subtitle + content slot + footer with status text on
          the left and an action on the right. The standard Vercel
          settings-card pattern. When an{" "}
          <code className="inline-code">id</code> is set, the title wraps
          in an anchor link for deep-linking.
        </p>
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      {/* No footer */}
      <Section>
        <SectionHeader id="no-footer" onCopyLink={showToast}>
          Without footer
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Omit <code className="inline-code">status</code> and{" "}
          <code className="inline-code">action</code> for read-only or
          informational cards. The footer row collapses entirely — no
          extra padding to manage.
        </p>
        <CodePreview componentCode={noFooterCode}>
          <NoFooterDemo />
        </CodePreview>
      </Section>

      {/* Error variant */}
      <Section>
        <SectionHeader id="error-variant" onCopyLink={showToast}>
          Error variant
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Pass <code className="inline-code">variant=&quot;error&quot;</code>
          {" "}for destructive sections — flips both the outer border and
          the footer divider to <code className="inline-code">--ds-red-700</code>{" "}
          so the danger zone reads immediately. Pair with a Button{" "}
          <code className="inline-code">variant=&quot;error&quot;</code> in the
          action slot.
        </p>
        <CodePreview componentCode={errorVariantCode}>
          <ErrorVariantDemo />
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
            One Fieldset per setting on settings pages — stack vertically
            with <code className="inline-code">gap-6</code> /{" "}
            <code className="inline-code">gap-8</code>. The deep-link
            anchor on each title makes URLs like{" "}
            <em>/admin/settings#timezone</em> work out of the box.
          </li>
          <li>
            Reach for <ComponentRef name="Panel Card" /> instead when the
            card is showing data rather than holding an editable setting
            — Fieldset&apos;s footer / save-button affordance is wasted
            on read-only displays.
          </li>
          <li>
            Use the <code className="inline-code">error</code> variant
            sparingly — reserve it for sections whose action is truly
            destructive (delete, transfer ownership). Don&apos;t use it
            to flag validation errors on the field itself; the Input&apos;s{" "}
            <code className="inline-code">error</code> prop is for that.
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
            Footer renders only when{" "}
            <code className="inline-code">status</code> or{" "}
            <code className="inline-code">action</code> (or both) is
            passed. With neither, the card has no footer row.
          </li>
          <li>
            Title becomes a deep-linkable anchor when{" "}
            <code className="inline-code">id</code> is set. The anchor
            icon appears on hover / focus-within and copies the section
            URL to the clipboard. Without{" "}
            <code className="inline-code">id</code>, the title renders as
            a plain span.
          </li>
          <li>
            Background is <code className="inline-code">--ds-background-100</code>{" "}
            on the body and{" "}
            <code className="inline-code">--ds-background-200</code> on
            the footer — same two-surface treatment the consent
            dashboard&apos;s tile row uses, so settings pages and
            dashboards visually compose in one app.
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
            <code className="inline-code">title</code> is a short noun
            phrase — <em>Project name</em>, <em>Website timezone</em>,{" "}
            <em>Delete project</em>. Sentence case, no trailing
            punctuation.
          </li>
          <li>
            <code className="inline-code">subtitle</code> explains what
            the setting controls in one sentence. Don&apos;t restate the
            title; if the subtitle is just <em>Set the project name</em>,
            drop it.
          </li>
          <li>
            <code className="inline-code">status</code> is for ancillary
            text — &quot;Learn more&quot; links, currently-active value,
            or pricing prompts. Avoid putting validation errors here;
            those belong on the field.
          </li>
          <li>
            <code className="inline-code">action</code> is typically one
            Button. Don&apos;t put two-or-more actions side by side here
            — the row becomes visually noisy. If a setting needs
            multiple actions, split into two Fieldsets.
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
            The title renders as <code className="inline-code">&lt;h2&gt;</code>,
            so the page&apos;s heading hierarchy starts at h2 inside each
            card. Use the surrounding page&apos;s shell header (e.g.{" "}
            <em>AdminPageHeader</em>) as the implicit h1.
          </li>
          <li>
            Anchor icon on the title is{" "}
            <code className="inline-code">aria-hidden</code> — purely
            decorative. The full anchor element is keyboard-focusable
            because the title link is itself a focusable element.
          </li>
          <li>
            <code className="inline-code">variant=&quot;error&quot;</code>{" "}
            is visual only. Communicate the destructive nature in the
            copy too (<em>&quot;This action cannot be undone&quot;</em>)
            — colour alone isn&apos;t enough for SR users or anyone with
            colour-vision differences.
          </li>
        </ul>
      </Section>
    </>
  );
}

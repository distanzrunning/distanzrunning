"use client";

import React, { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DestructiveActionModal } from "@/components/ui/DestructiveActionModal";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

import { ComponentRef } from "../ComponentRef";
import { Section } from "../ContentWithTOC";

// ============================================================================
// Page chrome: copy-link toast, deep-linked section header, code preview
// Mirrors the legacy DS pages (Modal / MultiSelect / etc.) so the
// Destructive Action Modal page reads identically.
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

function DefaultDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        title="Delete Project"
        description={
          <>
            <strong className="font-semibold">next-year-boilerplate</strong>{" "}
            and all its deployments, domains, and environment variables
            will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        verificationPhrase="next-year-boilerplate"
        verificationLabel="project name"
        confirmLabel="Delete Project"
      />
    </>
  );
}

function ReversibleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Disable Authentication
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        title="Disable Authentication"
        description="Anyone with a deployment URL will be able to view your project without signing in."
        verificationPhrase="disable authentication"
        confirmLabel="Disable Authentication"
      />
    </>
  );
}

function LoadingDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Delete Project (loading)
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {}}
        title="Delete Project"
        description={
          <>
            <strong className="font-semibold">next-year-boilerplate</strong>{" "}
            will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        verificationPhrase="next-year-boilerplate"
        verificationLabel="project name"
        confirmLabel="Delete Project"
        loading
      />
    </>
  );
}

function ErrorDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Delete Project (with error)
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {}}
        title="Delete Project"
        description={
          <>
            <strong className="font-semibold">next-year-boilerplate</strong>{" "}
            will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        verificationPhrase="next-year-boilerplate"
        verificationLabel="project name"
        confirmLabel="Delete Project"
        error="Couldn't delete project. Try again."
      />
    </>
  );
}

// ============================================================================
// Code strings (rendered into the show-code panels)
// ============================================================================

const defaultCode = `import { DestructiveActionModal } from '@/components/ui/DestructiveActionModal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        title="Delete Project"
        description={
          <>
            <strong className="font-semibold">next-year-boilerplate</strong> and all its
            deployments, domains, and environment variables will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        verificationPhrase="next-year-boilerplate"
        verificationLabel="project name"
        confirmLabel="Delete Project"
      />
    </>
  );
}`;

const reversibleCode = `import { DestructiveActionModal } from '@/components/ui/DestructiveActionModal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Disable Authentication
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        title="Disable Authentication"
        description="Anyone with a deployment URL will be able to view your project without signing in."
        verificationPhrase="disable authentication"
        confirmLabel="Disable Authentication"
      />
    </>
  );
}`;

const loadingCode = `import { DestructiveActionModal } from '@/components/ui/DestructiveActionModal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {}}
        title="Delete Project"
        description={<>The project will be permanently deleted.</>}
        irreversibleDescription="Deleting this project cannot be undone."
        verificationPhrase="next-year-boilerplate"
        verificationLabel="project name"
        confirmLabel="Delete Project"
        loading
      />
    </>
  );
}`;

const errorCode = `import { DestructiveActionModal } from '@/components/ui/DestructiveActionModal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {}}
        title="Delete Project"
        description={<>The project will be permanently deleted.</>}
        irreversibleDescription="Deleting this project cannot be undone."
        verificationPhrase="next-year-boilerplate"
        verificationLabel="project name"
        confirmLabel="Delete Project"
        error="Couldn't delete project. Try again."
      />
    </>
  );
}`;

// ============================================================================
// Page
// ============================================================================

export default function DestructiveActionModalComponent() {
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
          A type-to-confirm gate disables submit until the user types the
          verification phrase exactly. The red striped band at the bottom
          names what cannot be undone.
        </p>
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      {/* Reversible */}
      <Section>
        <SectionHeader id="reversible" onCopyLink={showToast}>
          Reversible
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Omit <code className="inline-code">irreversibleDescription</code> for
          actions that can be re-enabled, undone, or rolled back. The
          type-to-confirm gate stays — the friction is still warranted — but
          the red band is skipped.
        </p>
        <CodePreview componentCode={reversibleCode}>
          <ReversibleDemo />
        </CodePreview>
      </Section>

      {/* Loading */}
      <Section>
        <SectionHeader id="loading" onCopyLink={showToast}>
          Loading
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          <code className="inline-code">loading</code> disables both buttons
          and shows a spinner on the primary action. Use while the destructive
          API call is in flight. Caller controls{" "}
          <code className="inline-code">open</code> — don&apos;t dismiss the
          modal from inside <code className="inline-code">onConfirm</code>.
        </p>
        <CodePreview componentCode={loadingCode}>
          <LoadingDemo />
        </CodePreview>
      </Section>

      {/* With error */}
      <Section>
        <SectionHeader id="with-error" onCopyLink={showToast}>
          With error
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Pass <code className="inline-code">error</code> (a string or an{" "}
          <code className="inline-code">Error</code>) to surface an inline
          error under the input. The modal stays open so the user can retry.
        </p>
        <CodePreview componentCode={errorCode}>
          <ErrorDemo />
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
            Reach for this over <ComponentRef name="Modal" /> when the action
            is destructive and warrants friction: delete, rotate, revoke,
            disconnect, downgrade, disable a security setting. The typed gate
            forces deliberate intent.
          </li>
          <li>
            Use it for reversible destructive actions too, when the
            consequence is serious enough to warrant a pause — disabling
            deployment protection, revoking a shared token. Keep the typed
            gate; drop{" "}
            <code className="inline-code">irreversibleDescription</code>.
          </li>
          <li>
            Don&apos;t use for routine confirmations (save draft, discard
            changes, close without saving). The typed gate reads as melodrama
            when the stakes are low — use a plain <ComponentRef name="Modal" />{" "}
            instead.
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
            The verification input gets focus on open so the user can start
            typing immediately. Submit stays disabled until the value matches{" "}
            <code className="inline-code">verificationPhrase</code> exactly.
          </li>
          <li>
            Enter submits only when the gate is open; it&apos;s a no-op
            otherwise. Cancel, outside-click, and Escape all dismiss.
          </li>
          <li>
            <code className="inline-code">loading</code> disables both
            buttons. The caller owns <code className="inline-code">open</code> —
            do not self-dismiss from{" "}
            <code className="inline-code">onConfirm</code>. Close the modal
            after the API settles (success or error), or keep it open on
            error so the user can retry.
          </li>
          <li>
            Pair the post-confirm success toast verb 1:1 with the primary
            button: <code className="inline-code">Delete Project</code> button,{" "}
            <code className="inline-code">Project deleted</code> toast. Never{" "}
            <code className="inline-code">Project removed</code>.
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
            <code className="inline-code">title</code> is Title Case,{" "}
            <code className="inline-code">Verb + Noun</code>, a statement —
            never a question.{" "}
            <code className="inline-code">Delete Project</code>, not{" "}
            <code className="inline-code">Delete this project?</code>.
          </li>
          <li>
            <code className="inline-code">description</code> is sentence case,
            names the consequence, and interpolates the specific resource when
            relevant.{" "}
            <code className="inline-code">
              &lt;b&gt;my-project&lt;/b&gt; and all its deployments will be
              permanently deleted.
            </code>{" "}
            reads stronger than{" "}
            <code className="inline-code">
              This project and all its deployments will be deleted.
            </code>
            .
          </li>
          <li>
            <code className="inline-code">confirmLabel</code> matches the
            title 1:1. Never generic (
            <code className="inline-code">Confirm</code>,{" "}
            <code className="inline-code">OK</code>,{" "}
            <code className="inline-code">Continue</code>), never a bare verb
            (<code className="inline-code">Delete</code>).
          </li>
          <li>
            <code className="inline-code">verificationPhrase</code>: for
            entity deletes, type the{" "}
            <strong className="font-semibold text-textDefault">
              resource name itself
            </strong>{" "}
            (<code className="inline-code">my-project</code>) and pair with{" "}
            <code className="inline-code">verificationLabel=&quot;project name&quot;</code>{" "}
            so the prompt reads{" "}
            <code className="inline-code">
              To confirm, type the project name &quot;my-project&quot;
            </code>
            . That&apos;s the canonical signal that the user knows which thing
            they&apos;re acting on. Fall back to a lowercase verb phrase (
            <code className="inline-code">disable authentication</code>)
            only when there&apos;s no entity to name.
          </li>
          <li>
            <code className="inline-code">irreversibleDescription</code> names
            the specific action and resource and ends with{" "}
            <code className="inline-code">cannot be undone.</code> —{" "}
            <code className="inline-code">
              Deleting my-project cannot be undone.
            </code>{" "}
            rather than the generic{" "}
            <code className="inline-code">This cannot be undone.</code>. Omit
            the prop entirely for reversible actions; the prop&apos;s absence
            is the signal, not a falsy value.
          </li>
          <li>
            <code className="inline-code">error</code> surfaces the API
            failure verbatim in Distanz voice:{" "}
            <code className="inline-code">
              Couldn&apos;t save settings. Try again.
            </code>
            . Never dump a raw error object.
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
            The verification input is associated with its prompt via{" "}
            <code className="inline-code">aria-labelledby</code> +{" "}
            <code className="inline-code">htmlFor</code>. Screen readers
            announce the full prompt on focus.
          </li>
          <li>
            The Warning icon in the irreversibility band is{" "}
            <code className="inline-code">aria-hidden</code>; the sentence
            carries the meaning so nothing is announced twice.
          </li>
          <li>
            Focus stays inside the modal across an{" "}
            <code className="inline-code">error</code> transition so the user
            can retry without losing context. After success, return focus to
            the trigger.
          </li>
        </ul>
      </Section>
    </>
  );
}

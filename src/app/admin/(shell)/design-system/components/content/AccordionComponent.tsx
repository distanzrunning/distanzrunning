"use client";

import React, { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

import { ComponentRef } from "../ComponentRef";
import { Section } from "../ContentWithTOC";

// ============================================================================
// Page chrome: deep-linkable headers + code preview cards
// Mirrors the legacy DS pages (Modal / MultiSelect / Destructive Action
// Modal) so the Accordion docs read identically.
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

  const tokenizedLines = useShikiHighlighter(componentCode, "tsx", undefined, isOpen);
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
// Demo data
// ============================================================================

const FAQ_ITEMS = [
  {
    value: "what-is",
    question: "What's the Stride Accordion built on?",
    answer:
      "It wraps Base UI's Accordion primitive, the same one shadcn ships from. Base UI handles focus management, keyboard navigation, and ARIA wiring; we apply Distanz tokens for the visual treatment.",
  },
  {
    value: "single-or-multi",
    question: "Can multiple panels stay open at once?",
    answer:
      "Yes. Pass multiple to the root Accordion to allow any number of panels to expand independently. Defaults to single-panel mode otherwise.",
  },
  {
    value: "styling",
    question: "How do I theme it for a specific section?",
    answer:
      "Override className on any sub-component — Accordion, AccordionItem, AccordionTrigger, or AccordionContent — and the cn() helper merges your classes with the defaults.",
  },
];

function DemoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid hsl(var(--color-borderDefault))",
        borderRadius: 6,
        padding: "0 16px",
        maxWidth: 640,
      }}
    >
      {children}
    </div>
  );
}

function DefaultDemo() {
  return (
    <DemoFrame>
      <Accordion>
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DemoFrame>
  );
}

function MultipleDemo() {
  return (
    <DemoFrame>
      <Accordion multiple>
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DemoFrame>
  );
}

// ============================================================================
// Code strings
// ============================================================================

const defaultCode = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';

const FAQ_ITEMS = [
  { value: 'a', question: 'Item one', answer: 'Body for item one.' },
  { value: 'b', question: 'Item two', answer: 'Body for item two.' },
  { value: 'c', question: 'Item three', answer: 'Body for item three.' },
];

export function Example() {
  return (
    <Accordion>
      {FAQ_ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

const multipleCode = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';

export function Example() {
  return (
    <Accordion multiple>
      <AccordionItem value="a">
        <AccordionTrigger>Item one</AccordionTrigger>
        <AccordionContent>Body for item one.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Item two</AccordionTrigger>
        <AccordionContent>Body for item two.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

// ============================================================================
// Page
// ============================================================================

export default function AccordionComponent() {
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
          Single-panel disclosure list. Click a row to expand, click it
          again to collapse — opening one closes the others.
        </p>
        <CodePreview componentCode={defaultCode}>
          <DefaultDemo />
        </CodePreview>
      </Section>

      {/* Multiple */}
      <Section>
        <SectionHeader id="multiple" onCopyLink={showToast}>
          Multiple panels open
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Pass <code className="inline-code">multiple</code> to the root
          Accordion to allow any number of panels to expand independently.
        </p>
        <CodePreview componentCode={multipleCode}>
          <MultipleDemo />
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
            Reach for Accordion when grouped secondary content would
            otherwise stretch a page — FAQ lists, expandable settings
            sections, long-form metadata, optional details on a detail
            view.
          </li>
          <li>
            For a single isolated disclosure (one block of content that
            optionally hides), use <ComponentRef name="Collapse" /> — it
            ships without the multi-item composition.
          </li>
          <li>
            Don&apos;t use Accordion for primary navigation between
            views. <ComponentRef name="Tabs" /> is the right primitive
            when each section is a peer destination, not collapsible
            detail.
          </li>
          <li>
            Avoid for content that needs to be scanned together (e.g.
            a comparison table, a step-by-step). Forcing the reader to
            expand each item hurts comprehension.
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
            Single-panel mode by default — opening one item closes any
            other open item. Pass{" "}
            <code className="inline-code">multiple</code> on the root
            Accordion when items shouldn&apos;t affect each other.
          </li>
          <li>
            Keyboard: Tab moves focus through the triggers; Enter / Space
            toggles the focused trigger; Up / Down arrows move between
            triggers without exiting the group. All wired by Base UI.
          </li>
          <li>
            Panel height animates via Base UI&apos;s{" "}
            <code className="inline-code">--accordion-panel-height</code>{" "}
            CSS variable. Triggers expose{" "}
            <code className="inline-code">aria-expanded</code> which
            drives the chevron rotation.
          </li>
          <li>
            Default state is closed. Pass{" "}
            <code className="inline-code">defaultValue</code> on the root
            for items that should start open (single-panel) or{" "}
            <code className="inline-code">defaultValue={"{[…]}"}</code> for
            multi-panel.
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
            <code className="inline-code">AccordionTrigger</code> labels
            are short noun phrases or{" "}
            <code className="inline-code">Verb + Noun</code> statements —{" "}
            <em>Billing &amp; invoices</em>,{" "}
            <em>Cancel your subscription</em>. Avoid full questions; they
            read like an FAQ marketing page rather than UI.
          </li>
          <li>
            <code className="inline-code">AccordionContent</code> is
            sentence case, scannable, ideally under three paragraphs. If
            a panel grows past that, split it into multiple items rather
            than letting one item dominate.
          </li>
          <li>
            Keep trigger labels parallel in structure when items group
            together — all noun phrases, or all imperatives. Mixing
            reads inconsistent.
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
            Triggers expose{" "}
            <code className="inline-code">aria-expanded</code> +{" "}
            <code className="inline-code">aria-controls</code>{" "}
            automatically via Base UI. Screen readers announce
            &ldquo;collapsed&rdquo; / &ldquo;expanded&rdquo; on toggle.
          </li>
          <li>
            The chevron is{" "}
            <code className="inline-code">aria-hidden</code>; its
            orientation is purely visual — the announced state carries
            the meaning.
          </li>
          <li>
            Focus stays on the trigger when toggling. It doesn&apos;t
            jump into the opened panel; the user navigates content with
            Tab as usual.
          </li>
          <li>
            Don&apos;t suppress focus styles. The default focus ring on
            triggers is the only signal of keyboard position inside the
            group.
          </li>
        </ul>
      </Section>
    </>
  );
}

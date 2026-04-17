"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Section } from "../ContentWithTOC";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { Note } from "@/components/ui/Note";
import { useToast } from "@/components/ui/Toast";

// ============================================================================
// Section Header (anchor + copy-link pattern used across DS pages)
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
// Sample data for the live preview
// ============================================================================

const SAMPLE_GROUPS: { heading: string; items: string[] }[] = [
  {
    heading: "Foundations",
    items: ["Introduction", "Colours", "Icons", "Typography", "Materials"],
  },
  {
    heading: "Components",
    items: ["Avatar", "Badge", "Button", "Input", "Modal", "Tooltip"],
  },
];

// ============================================================================
// Main component
// ============================================================================

export default function SearchComponent() {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

  // Listen for ⌘K inside the preview so it behaves like the real header trigger
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div>
      {/* Overview */}
      <Section>
        <div className="py-12">
          <p className="text-[16px] leading-[1.6] text-textSubtle max-w-[720px] mb-6">
            Search is a header-level trigger paired with a modal that lets
            users jump between pages. The trigger is a compact input-styled
            button showing the <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">⌘K</code> shortcut; the modal is built
            on <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">CommandMenu</code> and lists navigable destinations
            grouped by section.
          </p>

          <Note type="default" label="Algolia">
            <div className="flex items-start justify-between gap-4">
              <span>
                Search on{" "}
                <a
                  href="https://distanzrunning.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-textDefault hover:text-textSubtle inline-flex items-center gap-1"
                >
                  distanzrunning.com
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>{" "}
                is powered by Algolia across articles, gear, and races. The
                design-system search here is a local, in-app navigator — no
                external index.
              </span>
            </div>
          </Note>
        </div>
      </Section>

      {/* Trigger + modal preview */}
      <Section>
        <div className="py-12">
          <SectionHeader id="preview" onCopyLink={showToast}>
            Preview
          </SectionHeader>

          <p className="text-[16px] leading-[1.6] text-textSubtle max-w-[720px] mt-4 mb-6">
            Click the trigger or press <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">⌘K</code> to open the modal.
          </p>

          <div
            className="flex items-center justify-center rounded-[12px] border border-borderSubtle"
            style={{
              background: "var(--ds-background-200)",
              minHeight: 240,
              padding: 48,
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-8 w-[280px] cursor-pointer items-center justify-between rounded border border-[var(--ds-gray-400)] bg-[var(--ds-background-100)] pl-2 pr-1.5 font-sans text-sm text-[var(--ds-gray-700)] outline-none transition-colors hover:bg-[var(--ds-background-200)]"
            >
              Search Stride
              <kbd
                className="ml-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded bg-[var(--ds-background-100)] px-1 font-sans text-[12px] leading-5 text-[var(--ds-gray-900)]"
                style={{ boxShadow: "0 0 0 1px var(--ds-gray-alpha-400)" }}
              >
                <span style={{ minWidth: "1em", display: "inline-block" }}>
                  ⌘
                </span>
                <span>K</span>
              </kbd>
            </button>
          </div>
        </div>
      </Section>

      <CommandMenu
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Search..."
      >
        {SAMPLE_GROUPS.map((group) => (
          <CommandMenu.Group key={group.heading} heading={group.heading}>
            {group.items.map((label) => (
              <CommandMenu.Item
                key={label}
                icon={<ArrowRight className="w-4 h-4" />}
                onSelect={() => {
                  showToast(`Selected "${label}"`);
                  setOpen(false);
                }}
              >
                {label}
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        ))}
      </CommandMenu>
    </div>
  );
}

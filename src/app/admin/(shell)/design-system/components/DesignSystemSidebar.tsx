"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Lock } from "lucide-react";

/** Atomic-design classification — surfaced as a badge on each component page
 *  now that the sidebar is a single flat, alphabetical Components list. */
export type ComponentType = "Atom" | "Molecule" | "Organism";

export interface NavItem {
  id: string;
  label: string;
  locked?: boolean;
  type?: ComponentType;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

interface DesignSystemSidebarProps {
  activeSlug: string;
  onNavigate: (slug: string) => void;
  onHomeClick: () => void;
}

// Navigation structure - add pages here as they are built
// Exported for use by pagination component
export const navigation: NavSection[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "colours", label: "Colours" },
      { id: "icons", label: "Icons" },
      { id: "typography", label: "Typography" },
      { id: "materials", label: "Materials" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      { id: "registry-mcp", label: "Registry & MCP" },
    ],
  },
  {
    id: "brands",
    label: "Brands",
    items: [
      { id: "distanz-running", label: "Distanz Running" },
    ],
  },
  {
    // One flat, alphabetical Components list (atoms/molecules/organisms merged).
    // The atomic classification is surfaced per-page via a type badge, not by
    // sidebar grouping. Keep this sorted by label.
    id: "components",
    label: "Components",
    items: [
      { id: "accordion", label: "Accordion", type: "Molecule" },
      { id: "ad-slot", label: "Ad Slot", type: "Molecule" },
      { id: "avatar", label: "Avatar", type: "Atom" },
      { id: "badge", label: "Badge", type: "Atom" },
      { id: "banner", label: "Banner", type: "Molecule" },
      { id: "breadcrumbs", label: "Breadcrumbs", type: "Molecule" },
      { id: "browser", label: "Browser", type: "Molecule" },
      { id: "button", label: "Button", type: "Atom" },
      { id: "calendar", label: "Calendar", type: "Molecule" },
      { id: "checkbox", label: "Checkbox", type: "Atom" },
      { id: "choicebox", label: "Choicebox", type: "Molecule" },
      { id: "clearable-input", label: "Clearable Input", type: "Molecule" },
      { id: "code-block", label: "Code Block", type: "Molecule" },
      { id: "collapse", label: "Collapse", type: "Molecule" },
      { id: "collapsible-input", label: "Collapsible Input", type: "Molecule" },
      { id: "combobox", label: "Combobox", type: "Molecule" },
      { id: "command-menu", label: "Command Menu", type: "Organism" },
      { id: "consent-banner", label: "Consent Banner", type: "Organism" },
      { id: "context-card", label: "Context Card", type: "Molecule" },
      { id: "context-menu", label: "Context Menu", type: "Organism" },
      { id: "description", label: "Description", type: "Molecule" },
      {
        id: "destructive-action-modal",
        label: "Destructive Action Modal",
        type: "Organism",
      },
      { id: "drawer", label: "Drawer", type: "Organism" },
      { id: "empty-state", label: "Empty State", type: "Molecule" },
      { id: "entity", label: "Entity", type: "Molecule" },
      { id: "error", label: "Error", type: "Molecule" },
      { id: "feedback", label: "Feedback", type: "Organism" },
      { id: "fieldset", label: "Fieldset", type: "Molecule" },
      { id: "gauge", label: "Gauge", type: "Atom" },
      { id: "grid", label: "Grid", type: "Molecule" },
      { id: "input", label: "Input", type: "Atom" },
      { id: "keyboard-input", label: "Keyboard Input", type: "Atom" },
      { id: "loading-dots", label: "Loading Dots", type: "Atom" },
      { id: "login", label: "Login", type: "Organism" },
      { id: "material", label: "Material", type: "Atom" },
      { id: "menu", label: "Menu", type: "Organism" },
      { id: "middle-truncate", label: "Middle Truncate", type: "Atom" },
      { id: "modal", label: "Modal", type: "Organism" },
      { id: "multi-select", label: "Multi Select", type: "Molecule" },
      { id: "note", label: "Note", type: "Molecule" },
      { id: "number-ticker", label: "Number Ticker", type: "Atom" },
      { id: "pagination", label: "Pagination", type: "Molecule" },
      { id: "panel-card", label: "Panel Card", type: "Molecule" },
      { id: "phone", label: "Phone", type: "Molecule" },
      { id: "progress", label: "Progress", type: "Atom" },
      { id: "project-banner", label: "Project Banner", type: "Organism" },
      { id: "radio", label: "Radio", type: "Atom" },
      {
        id: "relative-time-card",
        label: "Relative Time Card",
        type: "Molecule",
      },
      { id: "scroller", label: "Scroller", type: "Molecule" },
      { id: "search", label: "Search", type: "Molecule" },
      { id: "select", label: "Select", type: "Molecule" },
      { id: "sheet", label: "Sheet", type: "Organism" },
      { id: "show-more", label: "Show More", type: "Atom" },
      { id: "skeleton", label: "Skeleton", type: "Atom" },
      { id: "slider", label: "Slider", type: "Molecule" },
      { id: "snippet", label: "Snippet", type: "Molecule" },
      { id: "spinner", label: "Spinner", type: "Atom" },
      { id: "split-button", label: "Split Button", type: "Molecule" },
      { id: "stat-tile", label: "Stat Tile", type: "Molecule" },
      { id: "status-dot", label: "Status Dot", type: "Atom" },
      { id: "switch", label: "Switch", type: "Atom" },
      { id: "table", label: "Table", type: "Organism" },
      { id: "tabs", label: "Tabs", type: "Molecule" },
      { id: "textarea", label: "Textarea", type: "Atom" },
      { id: "theme-switcher", label: "Theme Switcher", type: "Molecule" },
      { id: "toast", label: "Toast", type: "Organism" },
      { id: "toggle", label: "Toggle", type: "Atom" },
      { id: "tooltip", label: "Tooltip", type: "Molecule" },
      { id: "trend-chart", label: "Trend Chart", type: "Molecule" },
    ],
  },
];

/** slug → atomic type, for the per-page Component badge. */
export const componentTypeBySlug: Record<string, ComponentType> =
  Object.fromEntries(
    (navigation.find((s) => s.id === "components")?.items ?? [])
      .filter((i) => i.type)
      .map((i) => [i.id, i.type as ComponentType]),
  );

export default function DesignSystemSidebar({
  activeSlug,
  onNavigate,
}: DesignSystemSidebarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleClick = (item: NavItem) => {
    if (item.locked) return;
    onNavigate(item.id);
    setMobileNavOpen(false);
  };

  // Render flat navigation list - Geist style
  const renderNavList = () => (
    <div className="space-y-4">
      {navigation.map((navSection) => (
        <div key={navSection.id}>
          {/* Section header — text-button-14 in the DS scale (14/20/500) */}
          <p className="text-button-14 mb-0.5 flex h-10 items-center gap-2 py-1.5 pl-1 text-black dark:text-white">
            {navSection.label}
          </p>

          {/* Section items - flat list with Geist dimensions */}
          <ul
            className="relative space-y-0.5"
            style={{ width: "calc(100% + 8px)" }}
          >
            {navSection.items.map((item) => {
              const isActive = activeSlug === item.id;
              return (
                <li
                  key={item.id}
                  className={navSection.id === "components" ? "py-[2px]" : ""}
                >
                  <button
                    onClick={() => handleClick(item)}
                    disabled={item.locked}
                    className={`
                      group relative -ml-2 flex h-[40px] w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[14px] leading-[20px] outline-none transition-colors
                      ${
                        item.locked
                          ? "text-textSubtle cursor-not-allowed"
                          : isActive
                            ? "bg-black/[0.05] dark:bg-white/[0.1] text-black dark:text-white"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }
                    `}
                  >
                    {item.id === "distanz-running" && (
                      <span style={{ position: "relative", display: "block", width: 16, height: 16, flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/brand/icon-black.svg"
                          alt=""
                          className="dark:!hidden"
                          style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16 }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/brand/icon-white.svg"
                          alt=""
                          className="!hidden dark:!block"
                          style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16 }}
                        />
                      </span>
                    )}
                    <span className="flex flex-row items-center gap-2">
                      {item.label}
                    </span>
                    {item.locked && (
                      <Lock className="w-4 h-4 text-textSubtle ml-auto" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet Header (< 1280px) */}
      <div className="xl:hidden bg-white dark:bg-neutral-900 border-b border-borderSubtle">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="w-full flex items-center justify-between px-6 py-3"
        >
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stride_icon_black.svg"
              alt="Stride"
              className="dark:hidden"
              style={{ width: 27, height: 27 }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stride_icon_white.svg"
              alt="Stride"
              className="hidden dark:block"
              style={{ width: 27, height: 27 }}
            />
            <span className="text-base font-medium text-textDefault">
              Stride Design System
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-textSubtle transition-transform ${
              mobileNavOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Mobile dropdown navigation */}
        {mobileNavOpen && (
          <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
            {renderNavList()}
          </div>
        )}
      </div>

      {/* Desktop Sidebar (≥ 1280px) - Geist: w-[260px], px-6, pb-[14px], pt-4 */}
      <nav className="hidden xl:flex flex-col w-[260px] border-r border-borderSubtle h-[calc(100vh-65px)] sticky top-[65px] overflow-hidden">
        {/* Scrollable navigation - Geist padding */}
        <div className="h-full overflow-y-auto px-6 pb-[14px] pt-4">
          {renderNavList()}
        </div>
      </nav>
    </>
  );
}

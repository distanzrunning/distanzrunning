"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Lock } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  section: string;
  locked?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

interface DesignSystemSidebarProps {
  section: string;
  activeSubsection: string;
  onSectionChange: (section: string) => void;
  onSubsectionChange: (subsection: string) => void;
  onHomeClick: () => void;
}

// Navigation structure matching Geist design system
const navigation: NavSection[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "introduction", label: "Introduction", section: "foundations" },
      { id: "colours", label: "Colors", section: "foundations" },
      { id: "icons", label: "Icons", section: "foundations" },
      { id: "typography", label: "Typography", section: "foundations" },
      { id: "materials", label: "Materials", section: "foundations" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      {
        id: "upgrade-guide",
        label: "Upgrade Guide",
        section: "resources",
        locked: true,
      },
      {
        id: "icons-logos",
        label: "Icons & Logos",
        section: "resources",
        locked: true,
      },
      {
        id: "guidelines",
        label: "Guidelines",
        section: "resources",
        locked: true,
      },
      {
        id: "changelog",
        label: "Changelog",
        section: "resources",
        locked: true,
      },
    ],
  },
  {
    id: "brands",
    label: "Brands",
    items: [
      { id: "distanz", label: "Distanz", section: "brands" },
      { id: "stride", label: "Stride", section: "brands" },
    ],
  },
  {
    id: "components",
    label: "Components",
    items: [
      { id: "avatar", label: "Avatar", section: "components" },
      { id: "badge", label: "Badge", section: "components" },
      { id: "blockquote", label: "Blockquote", section: "components" },
      { id: "button", label: "Button", section: "components" },
      { id: "calendar", label: "Calendar", section: "components" },
      { id: "checkbox", label: "Checkbox", section: "components" },
      { id: "close", label: "Close", section: "components" },
      { id: "collapse", label: "Collapse", section: "components" },
      { id: "combobox", label: "Combobox", section: "components" },
      { id: "context-menu", label: "Context Menu", section: "components" },
      { id: "description", label: "Description", section: "components" },
      { id: "drawer", label: "Drawer", section: "components" },
      { id: "dropdown-menu", label: "Dropdown Menu", section: "components" },
      { id: "error", label: "Error", section: "components" },
      { id: "feedback", label: "Feedback", section: "components" },
      { id: "file-tree", label: "File Tree", section: "components" },
      { id: "icon-button", label: "Icon Button", section: "components" },
      { id: "input", label: "Input", section: "components" },
      { id: "keyboard-input", label: "Keyboard Input", section: "components" },
      { id: "link", label: "Link", section: "components" },
      { id: "loading-dots", label: "Loading Dots", section: "components" },
      { id: "menu", label: "Menu", section: "components" },
      { id: "modal", label: "Modal", section: "components" },
      { id: "note", label: "Note", section: "components" },
      { id: "pagination", label: "Pagination", section: "components" },
      { id: "progress", label: "Progress", section: "components" },
      { id: "pull-quote", label: "Pull Quote", section: "components" },
      { id: "radio", label: "Radio", section: "components" },
      { id: "scroller", label: "Scroller", section: "components" },
      { id: "select", label: "Select", section: "components" },
      { id: "skeleton", label: "Skeleton", section: "components" },
      { id: "slider", label: "Slider", section: "components" },
      { id: "snippet", label: "Snippet", section: "components" },
      { id: "spinner", label: "Spinner", section: "components" },
      { id: "stack", label: "Stack", section: "components" },
      { id: "status-dot", label: "Status Dot", section: "components" },
      { id: "switch", label: "Switch", section: "components" },
      { id: "table", label: "Table", section: "components" },
      { id: "tabs", label: "Tabs", section: "components" },
      { id: "text", label: "Text", section: "components" },
      { id: "textarea", label: "Textarea", section: "components" },
      { id: "theme-switcher", label: "Theme Switcher", section: "components" },
      { id: "toast", label: "Toast", section: "components" },
      { id: "toggle", label: "Toggle", section: "components" },
      { id: "toggle-group", label: "Toggle Group", section: "components" },
      { id: "tooltip", label: "Tooltip", section: "components" },
      { id: "window", label: "Window", section: "components" },
    ],
  },
];

export default function DesignSystemSidebar({
  section,
  activeSubsection,
  onSectionChange,
  onSubsectionChange,
}: DesignSystemSidebarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleClick = (item: NavItem) => {
    if (item.locked) return;

    if (item.section !== section) {
      onSectionChange(item.section);
    }
    onSubsectionChange(item.id);
    setMobileNavOpen(false);
  };

  // Render flat navigation list - Geist style
  const renderNavList = () => (
    <div className="space-y-4">
      {navigation.map((navSection) => (
        <div key={navSection.id}>
          {/* Section header - Geist: h-10, text-[14px] leading-[20px] font-medium */}
          <p className="text-[14px] leading-[20px] font-medium mb-0.5 flex h-10 items-center gap-2 py-1.5 pl-1 text-black dark:text-white">
            {navSection.label}
          </p>

          {/* Section items - flat list with Geist dimensions */}
          <ul
            className="relative space-y-0.5"
            style={{ width: "calc(100% + 8px)" }}
          >
            {navSection.items.map((item) => {
              const isActive =
                section === item.section && activeSubsection === item.id;
              return (
                <li
                  key={`${item.section}-${item.id}`}
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
            <Image
              src="/images/distanz_icon_black.png"
              alt="Distanz Running"
              width={27}
              height={27}
              className="dark:hidden"
            />
            <Image
              src="/images/distanz_icon_white.png"
              alt="Distanz Running"
              width={27}
              height={27}
              className="hidden dark:block"
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
      <nav className="hidden xl:flex flex-col w-[260px] border-r border-borderSubtle dark:border-[#242424] min-h-[calc(100vh-112px)] sticky top-28 self-stretch">
        {/* Scrollable navigation - Geist padding */}
        <div className="flex-1 overflow-y-auto px-6 pb-[14px] pt-4">
          {renderNavList()}
        </div>
      </nav>
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Lock } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  locked?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

interface DesignSystemSidebarProps {
  activeSlug: string;
  onNavigate: (slug: string) => void;
  onHomeClick: () => void;
}

// Navigation structure matching Geist design system
const navigation: NavSection[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "colours", label: "Colors" },
      { id: "icons", label: "Icons" },
      { id: "typography", label: "Typography" },
      { id: "materials", label: "Materials" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      { id: "upgrade-guide", label: "Upgrade Guide", locked: true },
      { id: "icons-logos", label: "Icons & Logos", locked: true },
      { id: "guidelines", label: "Guidelines", locked: true },
      { id: "changelog", label: "Changelog", locked: true },
    ],
  },
  {
    id: "brands",
    label: "Brands",
    items: [
      { id: "distanz", label: "Distanz" },
      { id: "stride", label: "Stride" },
    ],
  },
  {
    id: "components",
    label: "Components",
    items: [
      { id: "avatar", label: "Avatar" },
      { id: "badge", label: "Badge" },
      { id: "blockquote", label: "Blockquote" },
      { id: "button", label: "Button" },
      { id: "calendar", label: "Calendar" },
      { id: "checkbox", label: "Checkbox" },
      { id: "close", label: "Close" },
      { id: "collapse", label: "Collapse" },
      { id: "combobox", label: "Combobox" },
      { id: "context-menu", label: "Context Menu" },
      { id: "description", label: "Description" },
      { id: "drawer", label: "Drawer" },
      { id: "dropdown-menu", label: "Dropdown Menu" },
      { id: "error", label: "Error" },
      { id: "feedback", label: "Feedback" },
      { id: "file-tree", label: "File Tree" },
      { id: "icon-button", label: "Icon Button" },
      { id: "input", label: "Input" },
      { id: "keyboard-input", label: "Keyboard Input" },
      { id: "link", label: "Link" },
      { id: "loading-dots", label: "Loading Dots" },
      { id: "menu", label: "Menu" },
      { id: "modal", label: "Modal" },
      { id: "note", label: "Note" },
      { id: "pagination", label: "Pagination" },
      { id: "progress", label: "Progress" },
      { id: "pull-quote", label: "Pull Quote" },
      { id: "radio", label: "Radio" },
      { id: "scroller", label: "Scroller" },
      { id: "select", label: "Select" },
      { id: "skeleton", label: "Skeleton" },
      { id: "slider", label: "Slider" },
      { id: "snippet", label: "Snippet" },
      { id: "spinner", label: "Spinner" },
      { id: "stack", label: "Stack" },
      { id: "status-dot", label: "Status Dot" },
      { id: "switch", label: "Switch" },
      { id: "table", label: "Table" },
      { id: "tabs", label: "Tabs" },
      { id: "text", label: "Text" },
      { id: "textarea", label: "Textarea" },
      { id: "theme-switcher", label: "Theme Switcher" },
      { id: "toast", label: "Toast" },
      { id: "toggle", label: "Toggle" },
      { id: "toggle-group", label: "Toggle Group" },
      { id: "tooltip", label: "Tooltip" },
      { id: "window", label: "Window" },
    ],
  },
];

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
      <nav className="hidden xl:flex flex-col w-[260px] border-r border-borderSubtle h-[calc(100vh-112px)] sticky top-28 overflow-hidden">
        {/* Scrollable navigation - Geist padding */}
        <div className="h-full overflow-y-auto px-6 pb-[14px] pt-4">
          {renderNavList()}
        </div>
      </nav>
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  section: string;
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

// Flat navigation structure - all items directly listed
const navigation: NavSection[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "overview", label: "Overview", section: "foundations" },
      {
        id: "design-principles",
        label: "Design Principles",
        section: "foundations",
      },
      { id: "ux-principles", label: "UX Principles", section: "foundations" },
      { id: "design-tokens", label: "Design Tokens", section: "foundations" },
      { id: "colours", label: "Colours", section: "foundations" },
      { id: "grid-spacing", label: "Grid Spacing", section: "foundations" },
      { id: "grid-layout", label: "Grid Layout", section: "foundations" },
      { id: "rules", label: "Rules", section: "foundations" },
      { id: "typefaces", label: "Typefaces", section: "foundations" },
      { id: "modular-scale", label: "Modular Scale", section: "foundations" },
      { id: "line-height", label: "Line Height", section: "foundations" },
      { id: "text-styles", label: "Text Styles", section: "foundations" },
      { id: "iconography", label: "Iconography", section: "foundations" },
    ],
  },
  {
    id: "brand",
    label: "Brand",
    items: [
      { id: "overview", label: "Overview", section: "brand" },
      { id: "logo", label: "Logo & Wordmark", section: "brand" },
    ],
  },
  {
    id: "components",
    label: "Components",
    items: [
      { id: "overview", label: "Overview", section: "components" },
      { id: "button", label: "Button", section: "components" },
      { id: "button-icon", label: "Button + Icon", section: "components" },
      { id: "slim-button", label: "Slim Button", section: "components" },
      {
        id: "slim-button-icon",
        label: "Slim Button + Icon",
        section: "components",
      },
      { id: "blockquote", label: "Blockquote", section: "components" },
      { id: "pull-quote", label: "Pull Quote", section: "components" },
      { id: "close", label: "Close", section: "components" },
      { id: "toggle", label: "Toggle", section: "components" },
      { id: "checkbox", label: "Checkbox", section: "components" },
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

  const handleClick = (itemSection: string, itemId: string) => {
    if (itemSection !== section) {
      onSectionChange(itemSection);
    }
    onSubsectionChange(itemId);
    setMobileNavOpen(false);
  };

  // Render flat navigation list
  const renderNavList = () => (
    <div className="space-y-6">
      {navigation.map((navSection) => (
        <div key={navSection.id}>
          {/* Section header */}
          <div className="text-[11px] font-medium uppercase tracking-wider text-textDefault mb-2 px-3">
            {navSection.label}
          </div>

          {/* Section items - flat list */}
          <ul className="space-y-0.5">
            {navSection.items.map((item) => {
              const isActive =
                section === item.section && activeSubsection === item.id;
              return (
                <li key={`${item.section}-${item.id}`}>
                  <button
                    onClick={() => handleClick(item.section, item.id)}
                    className={`
                      w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors
                      ${
                        isActive
                          ? "bg-neutral-100 dark:bg-neutral-800 text-textDefault font-medium"
                          : "text-textSubtle hover:text-textDefault hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }
                    `}
                  >
                    {item.label}
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
              src="/images/distanz_icon_black_round.png"
              alt="Distanz Running"
              width={28}
              height={28}
              className="dark:invert"
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

      {/* Desktop Sidebar (≥ 1280px) */}
      <nav className="hidden xl:flex flex-col w-[280px] border-r border-borderSubtle dark:border-[#242424] h-[calc(100vh-112px)] sticky top-28">
        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {renderNavList()}
        </div>
      </nav>
    </>
  );
}

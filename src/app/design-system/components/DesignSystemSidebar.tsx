"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Lock } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  locked?: boolean;
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
      { id: "colours", label: "Colours" },
      { id: "icons", label: "Icons" },
      { id: "typography", label: "Typography" },
      { id: "materials", label: "Materials" },
    ],
  },
  {
    id: "components",
    label: "Components",
    items: [
      { id: "avatar", label: "Avatar" },
      { id: "badge", label: "Badge" },
      { id: "browser", label: "Browser" },
      { id: "button", label: "Button" },
      { id: "calendar", label: "Calendar" },
      { id: "checkbox", label: "Checkbox" },
      { id: "choicebox", label: "Choicebox" },
      { id: "combobox", label: "Combobox" },
      { id: "code-block", label: "Code Block" },
      { id: "collapse", label: "Collapse" },
      { id: "command-menu", label: "Command Menu" },
      { id: "context-card", label: "Context Card" },
      { id: "context-menu", label: "Context Menu" },
      { id: "description", label: "Description" },
      { id: "drawer", label: "Drawer" },
      { id: "empty-state", label: "Empty State" },
      { id: "entity", label: "Entity" },
      { id: "error", label: "Error" },
      { id: "feedback", label: "Feedback" },
      { id: "gauge", label: "Gauge" },
      { id: "grid", label: "Grid" },
      { id: "input", label: "Input" },
      { id: "modal", label: "Modal" },
      { id: "pagination", label: "Pagination" },
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
      <nav className="hidden xl:flex flex-col w-[260px] border-r border-borderSubtle h-[calc(100vh-65px)] sticky top-[65px] overflow-hidden">
        {/* Scrollable navigation - Geist padding */}
        <div className="h-full overflow-y-auto px-6 pb-[14px] pt-4">
          {renderNavList()}
        </div>
      </nav>
    </>
  );
}

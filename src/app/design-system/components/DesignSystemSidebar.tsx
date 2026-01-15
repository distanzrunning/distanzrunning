"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Glasses,
  Scale,
  SwatchBook,
  LayoutGrid,
  RulerDimensionLine,
  Type,
  Shapes,
  Power,
  PencilLine,
  SlidersVertical,
  MessageSquareWarning,
  FileInput,
  Eye,
  SignpostBig,
  Compass,
  Network,
  Image as ImageIcon,
  Feather,
  LucideIcon,
} from "lucide-react";

interface SubSection {
  id: string;
  label: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  subsections?: SubSection[];
  showSeparator?: boolean;
}

interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
}

interface DesignSystemSidebarProps {
  section: string;
  activeSubsection: string;
  onSectionChange: (section: string) => void;
  onSubsectionChange: (subsection: string) => void;
  onHomeClick: () => void;
}

// Foundations section items
const foundationsItems: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: Glasses },
  {
    id: "principles",
    label: "Principles",
    icon: Scale,
    subsections: [
      { id: "design-principles", label: "Design principles" },
      { id: "ux-principles", label: "UX principles" },
      { id: "design-tokens", label: "Design tokens" },
    ],
    showSeparator: true,
  },
  { id: "colours", label: "Colours", icon: SwatchBook },
  {
    id: "grid",
    label: "Grid",
    icon: LayoutGrid,
    subsections: [
      { id: "grid-spacing", label: "Grid Spacing" },
      { id: "grid-layout", label: "Grid Layout" },
    ],
  },
  { id: "rules", label: "Rules", icon: RulerDimensionLine },
  {
    id: "typography",
    label: "Typography",
    icon: Type,
    subsections: [
      { id: "typefaces", label: "Typefaces" },
      { id: "modular-scale", label: "Modular scale" },
      { id: "line-height", label: "Line-height" },
      { id: "text-styles", label: "Text styles" },
    ],
  },
  { id: "iconography", label: "Iconography", icon: Shapes },
];

// Brand section items (placeholder for now)
const brandItems: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: Glasses },
  { id: "logo", label: "Logo & wordmark", icon: Feather },
];

// Components section items
const componentsItems: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: Glasses, showSeparator: true },
  {
    id: "buttons",
    label: "Buttons",
    icon: Power,
    subsections: [
      { id: "button", label: "Button" },
      { id: "button-icon", label: "Button + Icon" },
      { id: "slim-button", label: "Slim button" },
      { id: "slim-button-icon", label: "Slim button + Icon" },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: PencilLine,
    subsections: [
      { id: "blockquote", label: "Blockquote" },
      { id: "pull-quote", label: "Pull-quote" },
    ],
  },
  {
    id: "controls",
    label: "Controls",
    icon: SlidersVertical,
    subsections: [
      { id: "close", label: "Close" },
      { id: "collapse", label: "Collapse" },
      { id: "drag", label: "Drag" },
      { id: "drag-handle", label: "Drag + handle" },
      { id: "expand", label: "Expand" },
      { id: "label", label: "Label" },
      { id: "media", label: "Media" },
      { id: "menu-disclosure", label: "Menu disclosure" },
      { id: "nav-disclosure", label: "Navigation disclosure" },
      { id: "nav-disclosure-icon", label: "Navigation disclosure + icon" },
      { id: "section-control", label: "Section control" },
      { id: "toggle", label: "Toggle" },
      { id: "tooltip", label: "Tooltip" },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: MessageSquareWarning,
    subsections: [
      { id: "banner-alert", label: "Banner alert" },
      { id: "indicator", label: "Indicator" },
      { id: "inline-alert", label: "Inline alert" },
      { id: "notification", label: "Notification" },
      { id: "status-alert", label: "Status alert" },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    icon: FileInput,
    subsections: [
      { id: "checkbox", label: "Checkbox" },
      { id: "combined-input-field", label: "Combined input field" },
      { id: "date-field", label: "Date field" },
      { id: "helper-text", label: "Helper text" },
      { id: "form-input", label: "Form input" },
      { id: "form-label", label: "Label" },
      { id: "label-tag", label: "Label + tag" },
      { id: "notice", label: "Notice" },
      { id: "number-field", label: "Number field" },
      { id: "password-field", label: "Password field" },
      { id: "radio-button", label: "Radio button" },
      { id: "search-field", label: "Search field" },
      { id: "select-field", label: "Select field" },
      { id: "text-area", label: "Text area" },
      { id: "text-field", label: "Text field" },
    ],
  },
  {
    id: "identity",
    label: "Identity",
    icon: Eye,
    subsections: [
      { id: "idents-columns", label: "Idents (Columns)" },
      { id: "idents-newsletters", label: "Idents (Newsletters)" },
      { id: "idents-podcasts", label: "Idents (Podcasts)" },
    ],
  },
  {
    id: "landmarks",
    label: "Landmarks",
    icon: SignpostBig,
    subsections: [
      { id: "badge", label: "Badge" },
      { id: "section-headline", label: "Section headline" },
      {
        id: "section-headline-sub-rule",
        label: "Section headline and subheadline + rule",
      },
      { id: "section-headline-rule", label: "Section headline + rule" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    icon: Compass,
    subsections: [
      { id: "actioned-link", label: "Actioned link" },
      { id: "breadcrumb", label: "Breadcrumb" },
      { id: "call-to-action", label: "Call-to-action" },
      { id: "cta-arrow", label: "Call-to-action with arrow" },
      { id: "chapter-list", label: "Chapter list" },
      { id: "emphasised-link", label: "Emphasised link" },
      { id: "link-arrow", label: "Link with arrow" },
      { id: "link-arrow-icon", label: "Link with arrow icon" },
      { id: "navigation-link", label: "Navigation link" },
      { id: "navigation-link-icon", label: "Navigation link + icon" },
      { id: "pagination", label: "Pagination" },
      { id: "section-link", label: "Section link" },
      { id: "share", label: "Share" },
      { id: "share-link", label: "Share link" },
      { id: "tabs", label: "Tabs" },
    ],
  },
  {
    id: "structure",
    label: "Structure",
    icon: Network,
    subsections: [{ id: "rule", label: "Rule" }],
    showSeparator: true,
  },
  {
    id: "assets",
    label: "Assets",
    icon: ImageIcon,
    subsections: [
      { id: "avatar", label: "Avatar" },
      { id: "logo-wordmark", label: "Logo & wordmark" },
      { id: "monogram", label: "Monogram" },
      { id: "social-icons", label: "Social icons" },
    ],
  },
];

// All sections
const allSections: SidebarSection[] = [
  { id: "foundations", label: "Foundations", items: foundationsItems },
  { id: "brand", label: "Brand", items: brandItems },
  { id: "components", label: "Components", items: componentsItems },
];

export default function DesignSystemSidebar({
  section,
  activeSubsection,
  onSectionChange,
  onSubsectionChange,
}: DesignSystemSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([section]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Find which item should be expanded based on active subsection
  const getParentItem = (subsectionId: string): string | null => {
    for (const sec of allSections) {
      for (const item of sec.items) {
        if (item.subsections?.some((sub) => sub.id === subsectionId)) {
          return item.id;
        }
      }
    }
    return null;
  };

  const parentItem = getParentItem(activeSubsection);
  const shouldBeExpanded = parentItem
    ? [parentItem, ...expandedItems.filter((id) => id !== parentItem)]
    : expandedItems;

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id)
        ? prev.filter((sectionId) => sectionId !== id)
        : [...prev, id],
    );
  };

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleClick = (sectionId: string, subsectionId: string) => {
    if (sectionId !== section) {
      onSectionChange(sectionId);
    }
    onSubsectionChange(subsectionId);
    setMobileNavOpen(false);
  };

  // Check if an item is active (either directly or one of its subsections)
  const isItemActive = (sectionId: string, item: SidebarItem): boolean => {
    if (section !== sectionId) return false;
    if (item.id === activeSubsection) return true;
    if (item.subsections?.some((sub) => sub.id === activeSubsection))
      return true;
    return false;
  };

  // Render navigation list
  const renderNavList = () => (
    <div className="space-y-6">
      {allSections.map((sec) => (
        <div key={sec.id}>
          {/* Section header */}
          <button
            onClick={() => toggleSection(sec.id)}
            className="w-full text-left text-[11px] font-medium uppercase tracking-wider text-textSubtle hover:text-textDefault transition-colors flex items-center justify-between mb-2 px-3"
          >
            <span>{sec.label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                expandedSections.includes(sec.id) ? "" : "-rotate-90"
              }`}
            />
          </button>

          {/* Section items */}
          {expandedSections.includes(sec.id) && (
            <ul className="space-y-0.5">
              {sec.items.map((item) => (
                <li key={item.id}>
                  {item.subsections ? (
                    // Item with subsections
                    <div>
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors hover:text-textDefault hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between ${
                          isItemActive(sec.id, item)
                            ? "font-medium text-textDefault"
                            : "text-textSubtle"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon && (
                            <item.icon
                              className="w-4 h-4"
                              strokeWidth={isItemActive(sec.id, item) ? 2 : 1.5}
                            />
                          )}
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            shouldBeExpanded.includes(item.id)
                              ? ""
                              : "-rotate-90"
                          }`}
                        />
                      </button>
                      {shouldBeExpanded.includes(item.id) && (
                        <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-borderSubtle pl-3">
                          {item.subsections.map((sub) => (
                            <li key={sub.id}>
                              <button
                                onClick={() => handleClick(sec.id, sub.id)}
                                className={`
                                  w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors
                                  ${
                                    section === sec.id &&
                                    activeSubsection === sub.id
                                      ? "bg-neutral-100 dark:bg-neutral-800 text-textDefault font-medium"
                                      : "text-textSubtle hover:text-textDefault hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                  }
                                `}
                              >
                                {sub.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.showSeparator && (
                        <div className="my-3 border-t border-borderSubtle mx-3" />
                      )}
                    </div>
                  ) : (
                    // Regular item
                    <div>
                      <button
                        onClick={() => handleClick(sec.id, item.id)}
                        className={`
                          w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors flex items-center gap-2
                          ${
                            section === sec.id && activeSubsection === item.id
                              ? "bg-neutral-100 dark:bg-neutral-800 text-textDefault font-medium"
                              : "text-textSubtle hover:text-textDefault hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          }
                        `}
                      >
                        {item.icon && (
                          <item.icon
                            className="w-4 h-4"
                            strokeWidth={
                              section === sec.id && activeSubsection === item.id
                                ? 2
                                : 1.5
                            }
                          />
                        )}
                        {item.label}
                      </button>
                      {item.showSeparator && (
                        <div className="my-3 border-t border-borderSubtle mx-3" />
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet Header (< 1100px) */}
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

      {/* Desktop Sidebar (≥ 1280px) - No logo, just navigation */}
      <nav className="hidden xl:flex flex-col w-[280px] border-r border-borderSubtle dark:border-[#242424] h-[calc(100vh-64px)] sticky top-16">
        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {renderNavList()}
        </div>
      </nav>
    </>
  );
}

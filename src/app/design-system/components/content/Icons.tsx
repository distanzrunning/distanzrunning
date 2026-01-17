"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { Check, Search, Copy } from "lucide-react";
import * as icons from "lucide-react";
import { Section } from "../ContentWithTOC";

// Icons used across the Distanz codebase, sorted alphabetically
const projectIconNames = [
  "AlertCircle",
  "AlertTriangle",
  "ArrowDown",
  "ArrowDownRight",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowUpRight",
  "Bell",
  "Bookmark",
  "Calendar",
  "Check",
  "CheckCircle2",
  "ChevronDown",
  "ChevronLeft",
  "ChevronRight",
  "ChevronUp",
  "Clock",
  "Copy",
  "Database",
  "Download",
  "Edit",
  "Ellipsis",
  "Expand",
  "ExternalLink",
  "Eye",
  "EyeOff",
  "FileText",
  "Filter",
  "Flag",
  "Footprints",
  "Glasses",
  "Heart",
  "HelpCircle",
  "Home",
  "Info",
  "Key",
  "LayoutGrid",
  "Loader2",
  "Lock",
  "Mail",
  "Medal",
  "Menu",
  "MessageCircle",
  "Minus",
  "Monitor",
  "Moon",
  "MoreHorizontal",
  "MoreVertical",
  "Mountain",
  "MountainSnow",
  "MousePointer",
  "Plus",
  "Route",
  "RulerDimensionLine",
  "Scale",
  "Search",
  "Settings",
  "Settings2",
  "Share2",
  "Shield",
  "Shrink",
  "SlidersHorizontal",
  "Square",
  "Star",
  "Sun",
  "SwatchBook",
  "ThermometerSun",
  "ThumbsUp",
  "Trash2",
  "Type",
  "Unlock",
  "Upload",
  "User",
  "Users",
  "UtensilsCrossed",
  "Wallet",
  "Watch",
  "X",
  "XCircle",
  "Zap",
];

// Toast context for copy notifications
const ToastContext = React.createContext<{
  showToast: (message: string) => void;
}>({
  showToast: () => {},
});

function Toast({
  message,
  visible,
  onDismiss,
}: {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-borderNeutral"
        style={{ background: "var(--ds-background-100)" }}
        role="status"
        aria-live="polite"
      >
        <span className="text-sm text-textDefault">{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <svg
            height="16"
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, visible: true });
    timeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={dismissToast}
      />
    </ToastContext.Provider>
  );
}

// Icon card component matching Geist design
function IconCard({
  name,
  isFirstColMobile,
  isFirstColDesktop,
  isFirstRowMobile,
  isFirstRowDesktop,
  isLastRowMobile,
  isLastRowDesktop,
}: {
  name: string;
  isFirstColMobile?: boolean;
  isFirstColDesktop?: boolean;
  isFirstRowMobile?: boolean;
  isFirstRowDesktop?: boolean;
  isLastRowMobile?: boolean;
  isLastRowDesktop?: boolean;
}) {
  const { showToast } = React.useContext(ToastContext);
  const [showTick, setShowTick] = useState(false);
  const IconComponent = (
    icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string; size?: number }>
    >
  )[name];

  const handleCopy = useCallback(
    (e: React.MouseEvent, type: "name" | "import" | "jsx") => {
      e.stopPropagation();
      let textToCopy = "";

      switch (type) {
        case "name":
          textToCopy = name;
          break;
        case "import":
          textToCopy = `import { ${name} } from "lucide-react";`;
          break;
        case "jsx":
          textToCopy = `<${name} className="w-4 h-4" />`;
          break;
      }

      navigator.clipboard.writeText(textToCopy);
      showToast(`Copied ${type === "name" ? name : type}`);
      setShowTick(true);
      setTimeout(() => setShowTick(false), 600);
    },
    [name, showToast],
  );

  // Default click copies name
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(name);
    showToast(`Copied ${name}`);
    setShowTick(true);
    setTimeout(() => setShowTick(false), 600);
  }, [name, showToast]);

  // Context menu for additional copy options
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Copy import statement on right-click
      const textToCopy = `import { ${name} } from "lucide-react";`;
      navigator.clipboard.writeText(textToCopy);
      showToast("Copied import statement");
      setShowTick(true);
      setTimeout(() => setShowTick(false), 600);
    },
    [name, showToast],
  );

  if (!IconComponent) return null;

  // Border logic:
  // - Left border: only if not first column (to avoid double border with page edge)
  // - Top border: only on first row
  // - Bottom border: only if not last row (to avoid double border with section divider)
  // Mobile: 2 columns, Desktop: 4 columns

  const borderClasses: string[] = ["border-borderNeutral"];

  // Left border logic
  if (isFirstColMobile && isFirstColDesktop) {
    // First col on both - no left border
  } else if (isFirstColMobile && !isFirstColDesktop) {
    // First col on mobile only - left border on desktop
    borderClasses.push("md:border-l");
  } else if (!isFirstColMobile && isFirstColDesktop) {
    // First col on desktop only - left border on mobile
    borderClasses.push("border-l md:border-l-0");
  } else {
    // Not first col on either - always has left border
    borderClasses.push("border-l");
  }

  // Top border logic (first row)
  if (isFirstRowMobile && isFirstRowDesktop) {
    borderClasses.push("border-t");
  } else if (isFirstRowMobile && !isFirstRowDesktop) {
    borderClasses.push("border-t md:border-t-0");
  } else if (!isFirstRowMobile && isFirstRowDesktop) {
    borderClasses.push("md:border-t");
  }

  // Bottom border logic (not last row)
  if (isLastRowMobile && isLastRowDesktop) {
    // Last row on both - no bottom border
  } else if (isLastRowMobile && !isLastRowDesktop) {
    // Last row on mobile only - bottom border on desktop
    borderClasses.push("md:border-b");
  } else if (!isLastRowMobile && isLastRowDesktop) {
    // Last row on desktop only - bottom border on mobile
    borderClasses.push("border-b md:border-b-0");
  } else {
    // Not last row on either - always has bottom border
    borderClasses.push("border-b");
  }

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`group relative flex h-28 w-full cursor-pointer flex-col items-center px-4 text-textSubtle ${borderClasses.join(" ")} transition-colors hover:[background:var(--ds-background-100)]`}
      title={name}
    >
      <div className="flex-1" />
      <div className="-mt-1.5 relative">
        {showTick ? (
          <Check size={16} className="text-green-600" />
        ) : (
          <IconComponent size={16} className="text-current" />
        )}
      </div>
      <p className="text-[13px] text-textSubtle truncate flex-1 pt-4 max-w-full">
        {name}
      </p>
      {/* Copy button overlay on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => handleCopy(e, "import")}
          className="p-1.5 rounded bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
          title="Copy import statement"
        >
          <Copy size={12} />
        </button>
      </div>
    </button>
  );
}

// Search input component matching Geist design
function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="relative flex items-center w-full"
      style={{ "--geist-icon-size": "16px" } as React.CSSProperties}
    >
      <input
        placeholder="Search icons..."
        aria-label="Search"
        aria-invalid="false"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-10 pr-4 text-sm border border-borderNeutral outline-none placeholder:text-gray-600 focus:border-borderNeutralHover focus:ring-2 focus:ring-borderNeutral transition-colors"
        style={{ background: "var(--ds-background-100)" }}
      />
      <label
        aria-hidden="true"
        className="absolute left-3 pointer-events-none text-gray-600"
      >
        <Search size={16} />
      </label>
    </div>
  );
}

export default function Icons() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return projectIconNames;

    const term = searchTerm.toLowerCase();
    return projectIconNames.filter((name) => name.toLowerCase().includes(term));
  }, [searchTerm]);

  // Calculate position for border handling
  const getIconPosition = (index: number, total: number) => {
    const colsMobile = 2;
    const colsDesktop = 4;

    const rowMobile = Math.floor(index / colsMobile);
    const rowDesktop = Math.floor(index / colsDesktop);
    const totalRowsMobile = Math.ceil(total / colsMobile);
    const totalRowsDesktop = Math.ceil(total / colsDesktop);

    return {
      isFirstColMobile: index % colsMobile === 0,
      isFirstColDesktop: index % colsDesktop === 0,
      isFirstRowMobile: rowMobile === 0,
      isFirstRowDesktop: rowDesktop === 0,
      isLastRowMobile: rowMobile === totalRowsMobile - 1,
      isLastRowDesktop: rowDesktop === totalRowsDesktop - 1,
    };
  };

  return (
    <ToastProvider>
      <div>
        {/* Search Section */}
        <Section>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </Section>

        {/* Icon Grid - spans full width, no padding */}
        <div>
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {filteredIcons.map((name, index) => {
                const pos = getIconPosition(index, filteredIcons.length);
                return (
                  <IconCard
                    key={name}
                    name={name}
                    isFirstColMobile={pos.isFirstColMobile}
                    isFirstColDesktop={pos.isFirstColDesktop}
                    isFirstRowMobile={pos.isFirstRowMobile}
                    isFirstRowDesktop={pos.isFirstRowDesktop}
                    isLastRowMobile={pos.isLastRowMobile}
                    isLastRowDesktop={pos.isLastRowDesktop}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search size={48} className="text-gray-400 mb-4" />
              <p className="text-textSubtle font-medium">No icons found</p>
              <p className="text-gray-600 text-sm mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        {/* Divider after icon grid */}
        <hr className="border-t border-borderNeutral" />

        {/* Usage Section */}
        <Section>
          <h2
            id="usage"
            className="text-[24px] leading-[1.2] font-semibold text-textDefault mb-4 scroll-mt-32"
          >
            Usage
          </h2>
          <p className="text-[16px] leading-[1.5] text-textSubtle mb-6">
            We use{" "}
            <a
              href="https://lucide.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              Lucide React
            </a>{" "}
            for our icon library. Icons are imported individually for optimal
            tree-shaking.
          </p>

          {/* Installation */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Installation
            </h3>
            <pre className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-md overflow-x-auto">
              <code className="text-sm font-mono text-textDefault">
                npm install lucide-react
              </code>
            </pre>
          </div>

          {/* Import */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Import
            </h3>
            <pre className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-md overflow-x-auto">
              <code className="text-sm font-mono text-textDefault">
                {`import { Home, Search, Settings } from "lucide-react";`}
              </code>
            </pre>
          </div>

          {/* Basic usage */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Basic usage
            </h3>
            <pre className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-md overflow-x-auto">
              <code className="text-sm font-mono text-textDefault">
                {`<Home className="w-4 h-4" />
<Search className="w-5 h-5 text-gray-600" />
<Settings size={24} strokeWidth={1.5} />`}
              </code>
            </pre>
          </div>

          {/* Sizing */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Recommended sizes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-borderNeutral">
                    <th className="text-left py-3 pr-4 font-medium">Size</th>
                    <th className="text-left py-3 px-4 font-medium">Class</th>
                    <th className="text-left py-3 px-4 font-medium">Pixels</th>
                    <th className="text-left py-3 px-4 font-medium">Usage</th>
                  </tr>
                </thead>
                <tbody className="text-textSubtle">
                  <tr className="border-b border-gray-200 dark:border-neutral-700">
                    <td className="py-3 pr-4">Small</td>
                    <td className="py-3 px-4 font-mono">w-4 h-4</td>
                    <td className="py-3 px-4">16px</td>
                    <td className="py-3 px-4">Inline text, badges</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-neutral-700">
                    <td className="py-3 pr-4">Medium</td>
                    <td className="py-3 px-4 font-mono">w-5 h-5</td>
                    <td className="py-3 px-4">20px</td>
                    <td className="py-3 px-4">Buttons, inputs</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-neutral-700">
                    <td className="py-3 pr-4">Large</td>
                    <td className="py-3 px-4 font-mono">w-6 h-6</td>
                    <td className="py-3 px-4">24px</td>
                    <td className="py-3 px-4">Navigation, headers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Resources Section */}
        <Section>
          <h2
            id="resources"
            className="text-[24px] leading-[1.2] font-semibold text-textDefault mb-4 scroll-mt-32"
          >
            Resources
          </h2>
          <div className="space-y-2">
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:underline text-sm"
            >
              Browse all Lucide icons
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
                  d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://lucide.dev/guide/packages/lucide-react"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:underline text-sm"
            >
              Lucide React documentation
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
                  d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </Section>
      </div>
    </ToastProvider>
  );
}

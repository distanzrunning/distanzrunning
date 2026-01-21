"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { Check, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Section } from "../ContentWithTOC";
import { CodeBlock } from "@/components/ui/CodeBlock";

// Import icons from other libraries via react-icons
import { TbApi, TbApiOff, TbCsv, TbGif } from "react-icons/tb";
import { MdOutlineGifBox } from "react-icons/md";
import { LuPersonStanding } from "react-icons/lu";
import {
  SiTypescript,
  SiStrava,
  SiInstagram,
  SiX,
  SiBrave,
  SiLinkedin,
  SiTailwindcss,
  SiReact,
  SiNextdotjs,
  SiLua,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { FiFile } from "react-icons/fi";

// Icon library types
type IconLibrary =
  | "lucide"
  | "tabler"
  | "material"
  | "react-icons-lucide"
  | "simple"
  | "vscode"
  | "feather";

interface IconDefinition {
  name: string;
  displayName: string;
  library: IconLibrary;
  component: React.ComponentType<{ size?: number; className?: string }>;
  importStatement: string;
}

// Build icon registry from multiple libraries
const buildIconRegistry = (): IconDefinition[] => {
  const icons: IconDefinition[] = [];

  // Lucide icons (imported directly from lucide-react)
  const lucideIconNames = [
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
    "ChartNoAxesColumn",
    "ChartPie",
    "Check",
    "CheckCircle2",
    "ChevronDown",
    "ChevronLeft",
    "ChevronRight",
    "ChevronUp",
    "CircleCheck",
    "CircleDollarSign",
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
    "PersonStanding",
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

  lucideIconNames.forEach((name) => {
    const IconComponent = (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{ size?: number; className?: string }>
      >
    )[name];
    if (IconComponent) {
      icons.push({
        name,
        displayName: name,
        library: "lucide",
        component: IconComponent,
        importStatement: `import { ${name} } from "lucide-react";`,
      });
    }
  });

  // Tabler icons (for UI icons not available in Lucide)
  const tablerIcons: Array<{
    name: string;
    displayName: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    { name: "TbApi", displayName: "Api", component: TbApi },
    { name: "TbApiOff", displayName: "ApiOff", component: TbApiOff },
    { name: "TbCsv", displayName: "Csv", component: TbCsv },
    { name: "TbGif", displayName: "Gif", component: TbGif },
  ];

  tablerIcons.forEach(({ name, displayName, component }) => {
    icons.push({
      name,
      displayName,
      library: "tabler",
      component,
      importStatement: `import { ${name} } from "react-icons/tb";`,
    });
  });

  // Material Design icons
  const materialIcons: Array<{
    name: string;
    displayName: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    {
      name: "MdOutlineGifBox",
      displayName: "GifBox",
      component: MdOutlineGifBox,
    },
  ];

  materialIcons.forEach(({ name, displayName, component }) => {
    icons.push({
      name,
      displayName,
      library: "material",
      component,
      importStatement: `import { ${name} } from "react-icons/md";`,
    });
  });

  // React-icons Lucide (for icons not in main lucide-react)
  const reactIconsLucide: Array<{
    name: string;
    displayName: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    {
      name: "LuPersonStanding",
      displayName: "PersonStanding (ri)",
      component: LuPersonStanding,
    },
  ];

  reactIconsLucide.forEach(({ name, displayName, component }) => {
    icons.push({
      name,
      displayName,
      library: "react-icons-lucide",
      component,
      importStatement: `import { ${name} } from "react-icons/lu";`,
    });
  });

  // Simple Icons (brand logos)
  const simpleIcons: Array<{
    name: string;
    displayName: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    { name: "SiBrave", displayName: "Brave", component: SiBrave },
    { name: "SiInstagram", displayName: "Instagram", component: SiInstagram },
    { name: "SiLinkedin", displayName: "Linkedin", component: SiLinkedin },
    { name: "SiStrava", displayName: "Strava", component: SiStrava },
    {
      name: "SiTailwindcss",
      displayName: "Tailwind CSS",
      component: SiTailwindcss,
    },
    {
      name: "SiTypescript",
      displayName: "Typescript",
      component: SiTypescript,
    },
    { name: "SiX", displayName: "X", component: SiX },
    { name: "SiReact", displayName: "React", component: SiReact },
    { name: "SiNextdotjs", displayName: "Next.js", component: SiNextdotjs },
    { name: "SiLua", displayName: "Lua", component: SiLua },
  ];

  simpleIcons.forEach(({ name, displayName, component }) => {
    icons.push({
      name,
      displayName,
      library: "simple",
      component,
      importStatement: `import { ${name} } from "react-icons/si";`,
    });
  });

  // VS Code icons
  const vscodeIcons: Array<{
    name: string;
    displayName: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
  }> = [{ name: "VscJson", displayName: "JSON", component: VscJson }];

  vscodeIcons.forEach(({ name, displayName, component }) => {
    icons.push({
      name,
      displayName,
      library: "vscode" as IconLibrary,
      component,
      importStatement: `import { ${name} } from "react-icons/vsc";`,
    });
  });

  // Feather icons
  const featherIcons: Array<{
    name: string;
    displayName: string;
    component: React.ComponentType<{ size?: number; className?: string }>;
  }> = [{ name: "FiFile", displayName: "File", component: FiFile }];

  featherIcons.forEach(({ name, displayName, component }) => {
    icons.push({
      name,
      displayName,
      library: "feather" as IconLibrary,
      component,
      importStatement: `import { ${name} } from "react-icons/fi";`,
    });
  });

  // Sort alphabetically by display name
  return icons.sort((a, b) => a.displayName.localeCompare(b.displayName));
};

const iconRegistry = buildIconRegistry();

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

// Library badge style
const libraryBadgeStyle =
  "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400";

const libraryLabels: Record<IconLibrary, string> = {
  lucide: "Lucide",
  tabler: "Tabler",
  material: "Material",
  "react-icons-lucide": "Lucide (ri)",
  simple: "Simple",
  vscode: "VS Code",
  feather: "Feather",
};

// Icon card component matching Geist design
function IconCard({ icon }: { icon: IconDefinition }) {
  const { showToast } = React.useContext(ToastContext);
  const [showTick, setShowTick] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const IconComponent = icon.component;

  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label}`);
      setShowTick(true);
      setTimeout(() => setShowTick(false), 600);
    },
    [showToast],
  );

  const handleCopyImport = useCallback(() => {
    copyToClipboard(icon.importStatement, "import");
  }, [icon.importStatement, copyToClipboard]);

  const handleCopyName = useCallback(() => {
    copyToClipboard(icon.name, icon.name);
  }, [icon.name, copyToClipboard]);

  const handleCopyJSX = useCallback(() => {
    copyToClipboard(`<${icon.name} className="w-4 h-4" />`, "JSX");
  }, [icon.name, copyToClipboard]);

  const handleCopySVG = useCallback(async () => {
    // Get the SVG element and copy its outerHTML
    const iconElement = document.querySelector(
      `[data-icon="${icon.name}"] svg`,
    );
    if (iconElement) {
      copyToClipboard(iconElement.outerHTML, "SVG");
    } else {
      showToast("Could not copy SVG");
    }
  }, [icon.name, copyToClipboard, showToast]);

  // Trigger context menu on left click
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Create and dispatch a context menu event at the click position
    const contextMenuEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    e.currentTarget.dispatchEvent(contextMenuEvent);
  }, []);

  if (!IconComponent) return null;

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          ref={triggerRef}
          data-icon={icon.name}
          className="group relative flex h-28 w-full cursor-pointer flex-col items-center px-4 text-textSubtle transition-colors hover:[background:var(--ds-background-100)] outline-none"
          onClick={handleClick}
        >
          {/* Library badge - show on hover */}
          <span
            className={`absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${libraryBadgeStyle}`}
          >
            {libraryLabels[icon.library]}
          </span>
          <div className="flex-1" />
          <div className="-mt-1.5 relative">
            {showTick ? (
              <Check size={16} className="text-current" />
            ) : (
              <IconComponent size={16} className="text-current" />
            )}
          </div>
          <p className="text-[13px] text-textSubtle truncate flex-1 pt-4 max-w-full">
            {icon.displayName}
          </p>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className="min-w-[160px] rounded-md border border-borderNeutral bg-white dark:bg-neutral-900 p-1 shadow-lg"
          style={{ zIndex: 50 }}
        >
          <ContextMenu.Item
            className="flex cursor-pointer select-none items-center rounded px-3 py-2 text-sm text-textDefault outline-none hover:bg-gray-100 dark:hover:bg-neutral-800"
            onSelect={handleCopyImport}
          >
            Copy Import
          </ContextMenu.Item>
          <ContextMenu.Item
            className="flex cursor-pointer select-none items-center rounded px-3 py-2 text-sm text-textDefault outline-none hover:bg-gray-100 dark:hover:bg-neutral-800"
            onSelect={handleCopyName}
          >
            Copy Name
          </ContextMenu.Item>
          <ContextMenu.Item
            className="flex cursor-pointer select-none items-center rounded px-3 py-2 text-sm text-textDefault outline-none hover:bg-gray-100 dark:hover:bg-neutral-800"
            onSelect={handleCopyJSX}
          >
            Copy JSX
          </ContextMenu.Item>
          <ContextMenu.Item
            className="flex cursor-pointer select-none items-center rounded px-3 py-2 text-sm text-textDefault outline-none hover:bg-gray-100 dark:hover:bg-neutral-800"
            onSelect={handleCopySVG}
          >
            Copy SVG
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

// Search input component matching Geist design
function SearchInput({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div
      className="relative flex items-center w-full"
      style={{ "--geist-icon-size": "16px" } as React.CSSProperties}
    >
      <input
        ref={inputRef}
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
        className="w-full h-11 pl-11 pr-4 text-sm rounded-md border border-borderNeutral outline-none placeholder:text-gray-600 hover:border-borderNeutralHover focus:border-textSubtle focus:ring-4 focus:ring-borderNeutral transition-colors"
        style={{ background: "var(--ds-background-100)" }}
      />
      <label
        aria-hidden="true"
        className="absolute left-4 pointer-events-none text-gray-600"
      >
        <Search size={16} />
      </label>
    </div>
  );
}

export default function Icons() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on mount
  React.useEffect(() => {
    // Small delay to ensure the page has scrolled to top first
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return iconRegistry;

    const term = searchTerm.toLowerCase();
    return iconRegistry.filter(
      (icon) =>
        icon.displayName.toLowerCase().includes(term) ||
        icon.name.toLowerCase().includes(term) ||
        icon.library.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  // Group icons into rows for desktop (4 cols) - we'll use CSS to handle mobile (2 cols)
  const groupIntoRows = (icons: IconDefinition[], cols: number) => {
    const rows: IconDefinition[][] = [];
    for (let i = 0; i < icons.length; i += cols) {
      rows.push(icons.slice(i, i + cols));
    }
    return rows;
  };

  // Group by 4 for desktop, CSS grid will reflow for mobile
  const iconRows = groupIntoRows(filteredIcons, 4);

  return (
    <ToastProvider>
      <div>
        {/* Search Section */}
        <Section>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            inputRef={searchInputRef}
          />
        </Section>

        {/* Icon Grid - spans full width, no padding, with dividers between rows and columns */}
        <div>
          {filteredIcons.length > 0 ? (
            <div className="divide-y divide-borderNeutral">
              {iconRows.map((row, rowIndex) => {
                const isLastRow = rowIndex === iconRows.length - 1;
                const emptyCells = isLastRow ? 4 - row.length : 0;
                return (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-2 md:grid-cols-4 divide-x divide-borderNeutral"
                  >
                    {row.map((icon) => (
                      <IconCard key={icon.name} icon={icon} />
                    ))}
                    {/* Fill empty cells in last row to close the grid */}
                    {emptyCells > 0 &&
                      Array.from({ length: emptyCells }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-28" />
                      ))}
                  </div>
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
            We use multiple icon libraries to ensure comprehensive coverage. Our
            primary library is{" "}
            <a
              href="https://lucide.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Lucide React
            </a>
            , with additional icons from{" "}
            <a
              href="https://tabler.io/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Tabler Icons
            </a>
            ,{" "}
            <a
              href="https://fonts.google.com/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Material Symbols
            </a>
            , and{" "}
            <a
              href="https://simpleicons.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Simple Icons
            </a>{" "}
            (for brand logos) via{" "}
            <a
              href="https://react-icons.github.io/react-icons/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              react-icons
            </a>
            .
          </p>

          {/* Installation */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Installation
            </h3>
            <CodeBlock language="bash" showLineNumbers={false}>
              {`npm install lucide-react react-icons`}
            </CodeBlock>
          </div>

          {/* Import - Lucide */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Import from Lucide (primary)
            </h3>
            <CodeBlock language="tsx" showLineNumbers={false}>
              {`import { Home, Search, Settings } from "lucide-react";`}
            </CodeBlock>
          </div>

          {/* Import - Tabler */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Import from Tabler
            </h3>
            <CodeBlock language="tsx" showLineNumbers={false}>
              {`import { TbApi, TbApiOff, TbCsv, TbGif } from "react-icons/tb";`}
            </CodeBlock>
          </div>

          {/* Import - Material */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Import from Material Design
            </h3>
            <CodeBlock language="tsx" showLineNumbers={false}>
              {`import { MdOutlineGifBox } from "react-icons/md";`}
            </CodeBlock>
          </div>

          {/* Import - Simple Icons */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Import from Simple Icons (brand logos)
            </h3>
            <CodeBlock language="tsx" showLineNumbers={false}>
              {`import { SiTypescript, SiStrava, SiInstagram } from "react-icons/si";`}
            </CodeBlock>
          </div>

          {/* Basic usage */}
          <div className="mb-6">
            <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
              Basic usage
            </h3>
            <CodeBlock language="tsx" showLineNumbers={false}>
              {`{/* Lucide icons */}
<Home className="w-4 h-4" />
<Search className="w-5 h-5 text-gray-600" />

{/* Tabler icons */}
<TbApi size={24} />
<TbCsv className="w-5 h-5" />

{/* Material icons */}
<MdOutlineGifBox size={20} />

{/* Simple Icons (brand logos) */}
<SiTypescript size={20} />
<SiStrava className="w-5 h-5" />`}
            </CodeBlock>
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
          <div className="space-y-4">
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
                Lucide (Primary)
              </h3>
              <div className="space-y-1">
                <a
                  href="https://lucide.dev/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:underline text-sm"
                >
                  Browse all Lucide icons
                  <LucideIcons.ExternalLink size={14} />
                </a>
                <a
                  href="https://lucide.dev/guide/packages/lucide-react"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:underline text-sm"
                >
                  Lucide React documentation
                  <LucideIcons.ExternalLink size={14} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
                Tabler Icons
              </h3>
              <div className="space-y-1">
                <a
                  href="https://tabler.io/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:underline text-sm"
                >
                  Browse all Tabler icons
                  <LucideIcons.ExternalLink size={14} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
                Material Design Icons
              </h3>
              <div className="space-y-1">
                <a
                  href="https://fonts.google.com/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:underline text-sm"
                >
                  Browse Material Symbols
                  <LucideIcons.ExternalLink size={14} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
                Simple Icons
              </h3>
              <div className="space-y-1">
                <a
                  href="https://simpleicons.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:underline text-sm"
                >
                  Browse all Simple Icons
                  <LucideIcons.ExternalLink size={14} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium text-textDefault mb-2">
                React Icons
              </h3>
              <div className="space-y-1">
                <a
                  href="https://react-icons.github.io/react-icons/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:underline text-sm"
                >
                  React Icons documentation
                  <LucideIcons.ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </ToastProvider>
  );
}

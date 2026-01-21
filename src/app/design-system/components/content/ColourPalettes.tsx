"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Check, MousePointer } from "lucide-react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Section } from "../ContentWithTOC";
import Button from "@/components/ui/Button";

// Link icon for section headers (matches Geist)
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

// Header height and section padding constants (must match ContentWithTOC)
const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

// Toast context for copy notifications (defined early so SectionHeader can use it)
const ToastContext = React.createContext<{
  showToast: (message: string) => void;
}>({
  showToast: () => {},
});

// Section header with link icon on hover (matches Geist)
function SectionHeader({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { showToast } = React.useContext(ToastContext);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Copy URL with hash to clipboard
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    showToast("Copied link to clipboard");

    // Update URL
    window.history.pushState(null, "", `#${id}`);

    // Scroll to correct position (accounting for header and padding)
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const scrollTarget = absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;

      window.scrollTo({
        top: scrollTarget,
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
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

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

// Helper to convert hex to HSLA
function hexToHsla(hex: string): string {
  if (hex.startsWith("rgba")) {
    return hex.replace("rgba", "HSLA").replace(/,([^,]*)$/, ",$1");
  }
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return `HSLA(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%,1)`;
}

// Color swatch with context menu (matches Geist)
function ColorSwatch({
  cssVar,
  value,
}: {
  step: number;
  cssVar: string;
  value: string;
}) {
  const { showToast } = React.useContext(ToastContext);
  const [showTick, setShowTick] = useState(false);

  const handleCopyToken = useCallback(() => {
    const tokenValue = `var(${cssVar})`;
    navigator.clipboard.writeText(tokenValue);
    showToast(`Copied ${tokenValue}`);
    setShowTick(true);
    setTimeout(() => setShowTick(false), 600);
  }, [cssVar, showToast]);

  const handleCopyHex = useCallback(() => {
    navigator.clipboard.writeText(value);
    showToast(`Copied ${value}`);
    setShowTick(true);
    setTimeout(() => setShowTick(false), 600);
  }, [value, showToast]);

  const handleCopyHsla = useCallback(() => {
    const hsla = hexToHsla(value);
    navigator.clipboard.writeText(hsla);
    showToast(`Copied ${hsla}`);
    setShowTick(true);
    setTimeout(() => setShowTick(false), 600);
  }, [value, showToast]);

  const hslaValue = hexToHsla(value);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <button
          className="relative w-full aspect-square md:h-10 md:aspect-auto rounded-sm cursor-copy shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
          style={{ backgroundColor: `var(${cssVar})` }}
          onClick={handleCopyToken}
        >
          <span
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
              showTick ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check
              size={20}
              strokeWidth={1.5}
              className="text-textSubtle dark:text-white"
            />
          </span>
        </button>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[240px] bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-borderNeutral p-1.5 z-50">
          <ContextMenu.Item
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-textDefault hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none"
            onSelect={handleCopyHex}
          >
            Copy HEX
            <span className="text-[13px] text-textSubtle">{value}</span>
          </ContextMenu.Item>
          <ContextMenu.Item
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-textDefault hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none"
            onSelect={handleCopyHsla}
          >
            Copy HSLA
            <span className="text-[13px] text-textSubtle">{hslaValue}</span>
          </ContextMenu.Item>
          <ContextMenu.Item
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-textDefault hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer outline-none"
            onSelect={handleCopyToken}
          >
            Copy token
            <span className="flex items-center gap-1.5 text-[13px] text-textSubtle">
              Left click <MousePointer size={14} />
            </span>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

// Color scale data
interface ColorStep {
  step: number;
  cssVar: string;
  lightValue: string;
  darkValue: string;
}

interface ColorScale {
  name: string;
  id: string;
  steps: ColorStep[];
}

const backgroundScale: ColorScale = {
  name: "Backgrounds",
  id: "backgrounds",
  steps: [
    {
      step: 100,
      cssVar: "--ds-background-100",
      lightValue: "#FFFFFF",
      darkValue: "#0A0A0A",
    },
    {
      step: 200,
      cssVar: "--ds-background-200",
      lightValue: "#FAFAFA",
      darkValue: "#000000",
    },
  ],
};

const grayScale: ColorScale = {
  name: "Gray",
  id: "gray",
  steps: [
    {
      step: 100,
      cssVar: "--ds-gray-100",
      lightValue: "#F2F2F2",
      darkValue: "#1A1A1A",
    },
    {
      step: 200,
      cssVar: "--ds-gray-200",
      lightValue: "#EBEBEB",
      darkValue: "#1F1F1F",
    },
    {
      step: 300,
      cssVar: "--ds-gray-300",
      lightValue: "#E6E6E6",
      darkValue: "#292929",
    },
    {
      step: 400,
      cssVar: "--ds-gray-400",
      lightValue: "#EBEBEB",
      darkValue: "#2E2E2E",
    },
    {
      step: 500,
      cssVar: "--ds-gray-500",
      lightValue: "#C9C9C9",
      darkValue: "#454545",
    },
    {
      step: 600,
      cssVar: "--ds-gray-600",
      lightValue: "#A8A8A8",
      darkValue: "#878787",
    },
    {
      step: 700,
      cssVar: "--ds-gray-700",
      lightValue: "#8F8F8F",
      darkValue: "#8F8F8F",
    },
    {
      step: 800,
      cssVar: "--ds-gray-800",
      lightValue: "#7D7D7D",
      darkValue: "#7D7D7D",
    },
    {
      step: 900,
      cssVar: "--ds-gray-900",
      lightValue: "#666666",
      darkValue: "#A1A1A1",
    },
    {
      step: 1000,
      cssVar: "--ds-gray-1000",
      lightValue: "#171717",
      darkValue: "#EDEDED",
    },
  ],
};

const grayAlphaScale: ColorScale = {
  name: "Gray alpha",
  id: "gray-alpha",
  steps: [
    {
      step: 100,
      cssVar: "--ds-gray-alpha-100",
      lightValue: "rgba(0,0,0,0.05)",
      darkValue: "rgba(255,255,255,0.06)",
    },
    {
      step: 200,
      cssVar: "--ds-gray-alpha-200",
      lightValue: "rgba(0,0,0,0.08)",
      darkValue: "rgba(255,255,255,0.09)",
    },
    {
      step: 300,
      cssVar: "--ds-gray-alpha-300",
      lightValue: "rgba(0,0,0,0.1)",
      darkValue: "rgba(255,255,255,0.13)",
    },
    {
      step: 400,
      cssVar: "--ds-gray-alpha-400",
      lightValue: "rgba(0,0,0,0.08)",
      darkValue: "rgba(255,255,255,0.14)",
    },
    {
      step: 500,
      cssVar: "--ds-gray-alpha-500",
      lightValue: "rgba(0,0,0,0.21)",
      darkValue: "rgba(255,255,255,0.24)",
    },
    {
      step: 600,
      cssVar: "--ds-gray-alpha-600",
      lightValue: "rgba(0,0,0,0.34)",
      darkValue: "rgba(255,255,255,0.51)",
    },
    {
      step: 700,
      cssVar: "--ds-gray-alpha-700",
      lightValue: "rgba(0,0,0,0.44)",
      darkValue: "rgba(255,255,255,0.54)",
    },
    {
      step: 800,
      cssVar: "--ds-gray-alpha-800",
      lightValue: "rgba(0,0,0,0.51)",
      darkValue: "rgba(255,255,255,0.47)",
    },
    {
      step: 900,
      cssVar: "--ds-gray-alpha-900",
      lightValue: "rgba(0,0,0,0.61)",
      darkValue: "rgba(255,255,255,0.61)",
    },
    {
      step: 1000,
      cssVar: "--ds-gray-alpha-1000",
      lightValue: "rgba(0,0,0,0.91)",
      darkValue: "rgba(255,255,255,0.92)",
    },
  ],
};

const blueScale: ColorScale = {
  name: "Blue",
  id: "blue",
  steps: [
    {
      step: 100,
      cssVar: "--ds-blue-100",
      lightValue: "#EFF7FF",
      darkValue: "#101C30",
    },
    {
      step: 200,
      cssVar: "--ds-blue-200",
      lightValue: "#E8F4FF",
      darkValue: "#11233D",
    },
    {
      step: 300,
      cssVar: "--ds-blue-300",
      lightValue: "#DBEEFF",
      darkValue: "#143052",
    },
    {
      step: 400,
      cssVar: "--ds-blue-400",
      lightValue: "#C6E4FF",
      darkValue: "#163961",
    },
    {
      step: 500,
      cssVar: "--ds-blue-500",
      lightValue: "#99CCFF",
      darkValue: "#194574",
    },
    {
      step: 600,
      cssVar: "--ds-blue-600",
      lightValue: "#52A9FF",
      darkValue: "#0099FF",
    },
    {
      step: 700,
      cssVar: "--ds-blue-700",
      lightValue: "#0070F3",
      darkValue: "#0070F3",
    },
    {
      step: 800,
      cssVar: "--ds-blue-800",
      lightValue: "#0062D4",
      darkValue: "#0062D4",
    },
    {
      step: 900,
      cssVar: "--ds-blue-900",
      lightValue: "#006ADC",
      darkValue: "#52A9FF",
    },
    {
      step: 1000,
      cssVar: "--ds-blue-1000",
      lightValue: "#00244D",
      darkValue: "#EBF8FF",
    },
  ],
};

const redScale: ColorScale = {
  name: "Red",
  id: "red",
  steps: [
    {
      step: 100,
      cssVar: "--ds-red-100",
      lightValue: "#FFF0F0",
      darkValue: "#2D1314",
    },
    {
      step: 200,
      cssVar: "--ds-red-200",
      lightValue: "#FFE8E8",
      darkValue: "#3C1618",
    },
    {
      step: 300,
      cssVar: "--ds-red-300",
      lightValue: "#FFE0E0",
      darkValue: "#541B1F",
    },
    {
      step: 400,
      cssVar: "--ds-red-400",
      lightValue: "#FFD2D2",
      darkValue: "#671E22",
    },
    {
      step: 500,
      cssVar: "--ds-red-500",
      lightValue: "#FFAFAF",
      darkValue: "#822025",
    },
    {
      step: 600,
      cssVar: "--ds-red-600",
      lightValue: "#FF6C6C",
      darkValue: "#E5484D",
    },
    {
      step: 700,
      cssVar: "--ds-red-700",
      lightValue: "#EE0000",
      darkValue: "#F2555A",
    },
    {
      step: 800,
      cssVar: "--ds-red-800",
      lightValue: "#D50000",
      darkValue: "#FF6369",
    },
    {
      step: 900,
      cssVar: "--ds-red-900",
      lightValue: "#C50000",
      darkValue: "#FF9592",
    },
    {
      step: 1000,
      cssVar: "--ds-red-1000",
      lightValue: "#3C1414",
      darkValue: "#FFD1D9",
    },
  ],
};

const amberScale: ColorScale = {
  name: "Amber",
  id: "amber",
  steps: [
    {
      step: 100,
      cssVar: "--ds-amber-100",
      lightValue: "#FFF8E6",
      darkValue: "#1F1300",
    },
    {
      step: 200,
      cssVar: "--ds-amber-200",
      lightValue: "#FFF4D6",
      darkValue: "#271700",
    },
    {
      step: 300,
      cssVar: "--ds-amber-300",
      lightValue: "#FFEFC7",
      darkValue: "#341C00",
    },
    {
      step: 400,
      cssVar: "--ds-amber-400",
      lightValue: "#FFDC8C",
      darkValue: "#3F2200",
    },
    {
      step: 500,
      cssVar: "--ds-amber-500",
      lightValue: "#FFC850",
      darkValue: "#4D2A00",
    },
    {
      step: 600,
      cssVar: "--ds-amber-600",
      lightValue: "#FFA800",
      darkValue: "#F5A623",
    },
    {
      step: 700,
      cssVar: "--ds-amber-700",
      lightValue: "#F5A400",
      darkValue: "#F5A623",
    },
    {
      step: 800,
      cssVar: "--ds-amber-800",
      lightValue: "#E68C00",
      darkValue: "#FFBA18",
    },
    {
      step: 900,
      cssVar: "--ds-amber-900",
      lightValue: "#995200",
      darkValue: "#FFD60A",
    },
    {
      step: 1000,
      cssVar: "--ds-amber-1000",
      lightValue: "#472912",
      darkValue: "#FFF1CF",
    },
  ],
};

const greenScale: ColorScale = {
  name: "Green",
  id: "green",
  steps: [
    {
      step: 100,
      cssVar: "--ds-green-100",
      lightValue: "#ECFDF0",
      darkValue: "#0D1912",
    },
    {
      step: 200,
      cssVar: "--ds-green-200",
      lightValue: "#E4FBEB",
      darkValue: "#0F2417",
    },
    {
      step: 300,
      cssVar: "--ds-green-300",
      lightValue: "#D4F7DC",
      darkValue: "#14351F",
    },
    {
      step: 400,
      cssVar: "--ds-green-400",
      lightValue: "#BFF1CA",
      darkValue: "#194427",
    },
    {
      step: 500,
      cssVar: "--ds-green-500",
      lightValue: "#99E6AA",
      darkValue: "#1F5530",
    },
    {
      step: 600,
      cssVar: "--ds-green-600",
      lightValue: "#66D982",
      darkValue: "#30A46C",
    },
    {
      step: 700,
      cssVar: "--ds-green-700",
      lightValue: "#2FA34C",
      darkValue: "#3CB179",
    },
    {
      step: 800,
      cssVar: "--ds-green-800",
      lightValue: "#248B3D",
      darkValue: "#4CC38A",
    },
    {
      step: 900,
      cssVar: "--ds-green-900",
      lightValue: "#1A7832",
      darkValue: "#7AE2A0",
    },
    {
      step: 1000,
      cssVar: "--ds-green-1000",
      lightValue: "#0F371B",
      darkValue: "#D1FADF",
    },
  ],
};

const tealScale: ColorScale = {
  name: "Teal",
  id: "teal",
  steps: [
    {
      step: 100,
      cssVar: "--ds-teal-100",
      lightValue: "#EBFEFD",
      darkValue: "#0D1918",
    },
    {
      step: 200,
      cssVar: "--ds-teal-200",
      lightValue: "#E6FDFA",
      darkValue: "#0F2321",
    },
    {
      step: 300,
      cssVar: "--ds-teal-300",
      lightValue: "#D6F9F4",
      darkValue: "#13322F",
    },
    {
      step: 400,
      cssVar: "--ds-teal-400",
      lightValue: "#C3F4EC",
      darkValue: "#17423E",
    },
    {
      step: 500,
      cssVar: "--ds-teal-500",
      lightValue: "#99E8DA",
      darkValue: "#1C544E",
    },
    {
      step: 600,
      cssVar: "--ds-teal-600",
      lightValue: "#66D9C3",
      darkValue: "#12A594",
    },
    {
      step: 700,
      cssVar: "--ds-teal-700",
      lightValue: "#1AA390",
      darkValue: "#0EB39E",
    },
    {
      step: 800,
      cssVar: "--ds-teal-800",
      lightValue: "#118B7A",
      darkValue: "#0FC9B0",
    },
    {
      step: 900,
      cssVar: "--ds-teal-900",
      lightValue: "#0C786A",
      darkValue: "#5EDDC8",
    },
    {
      step: 1000,
      cssVar: "--ds-teal-1000",
      lightValue: "#123D35",
      darkValue: "#C7FAF0",
    },
  ],
};

const purpleScale: ColorScale = {
  name: "Purple",
  id: "purple",
  steps: [
    {
      step: 100,
      cssVar: "--ds-purple-100",
      lightValue: "#FAF0FF",
      darkValue: "#1B1525",
    },
    {
      step: 200,
      cssVar: "--ds-purple-200",
      lightValue: "#FAF0FF",
      darkValue: "#221A2E",
    },
    {
      step: 300,
      cssVar: "--ds-purple-300",
      lightValue: "#F2E6FD",
      darkValue: "#31223F",
    },
    {
      step: 400,
      cssVar: "--ds-purple-400",
      lightValue: "#E6D7FA",
      darkValue: "#402952",
    },
    {
      step: 500,
      cssVar: "--ds-purple-500",
      lightValue: "#C8AAF5",
      darkValue: "#513368",
    },
    {
      step: 600,
      cssVar: "--ds-purple-600",
      lightValue: "#A573EB",
      darkValue: "#8E4EC6",
    },
    {
      step: 700,
      cssVar: "--ds-purple-700",
      lightValue: "#7928CA",
      darkValue: "#9D5BD2",
    },
    {
      step: 800,
      cssVar: "--ds-purple-800",
      lightValue: "#641EAA",
      darkValue: "#AB6BE5",
    },
    {
      step: 900,
      cssVar: "--ds-purple-900",
      lightValue: "#5D1EA8",
      darkValue: "#C996FF",
    },
    {
      step: 1000,
      cssVar: "--ds-purple-1000",
      lightValue: "#280F48",
      darkValue: "#F3E7FF",
    },
  ],
};

const pinkScale: ColorScale = {
  name: "Pink",
  id: "pink",
  steps: [
    {
      step: 100,
      cssVar: "--ds-pink-100",
      lightValue: "#FFEDF5",
      darkValue: "#1F1318",
    },
    {
      step: 200,
      cssVar: "--ds-pink-200",
      lightValue: "#FFEDF3",
      darkValue: "#2B1620",
    },
    {
      step: 300,
      cssVar: "--ds-pink-300",
      lightValue: "#FDE1EC",
      darkValue: "#3E1A2D",
    },
    {
      step: 400,
      cssVar: "--ds-pink-400",
      lightValue: "#FAD7E6",
      darkValue: "#501D39",
    },
    {
      step: 500,
      cssVar: "--ds-pink-500",
      lightValue: "#F2B9D2",
      darkValue: "#642248",
    },
    {
      step: 600,
      cssVar: "--ds-pink-600",
      lightValue: "#EB82AF",
      darkValue: "#D6409F",
    },
    {
      step: 700,
      cssVar: "--ds-pink-700",
      lightValue: "#EB377D",
      darkValue: "#E34BA9",
    },
    {
      step: 800,
      cssVar: "--ds-pink-800",
      lightValue: "#DA2D73",
      darkValue: "#F65CB6",
    },
    {
      step: 900,
      cssVar: "--ds-pink-900",
      lightValue: "#B92D64",
      darkValue: "#FF8AD8",
    },
    {
      step: 1000,
      cssVar: "--ds-pink-1000",
      lightValue: "#3C1426",
      darkValue: "#FFD6F0",
    },
  ],
};

const allScales: ColorScale[] = [
  backgroundScale,
  grayScale,
  grayAlphaScale,
  blueScale,
  redScale,
  amberScale,
  greenScale,
  tealScale,
  purpleScale,
  pinkScale,
];

// Color scale row component (matches Geist layout)
function ColorScaleRow({
  scale,
  isDark,
}: {
  scale: ColorScale;
  isDark: boolean;
}) {
  const fullSteps = 10;
  const emptySlots = fullSteps - scale.steps.length;

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      <div className="w-[100px] flex-shrink-0">
        <p
          className="text-[14px] leading-[20px] font-medium text-textDefault"
          id={scale.name}
        >
          {scale.name}
        </p>
      </div>
      <ul aria-describedby={scale.name} className="flex w-full gap-1 md:gap-2">
        {scale.steps.map((step) => (
          <li key={step.step} className="w-full max-w-[68px]">
            <ColorSwatch
              step={step.step}
              cssVar={step.cssVar}
              value={isDark ? step.darkValue : step.lightValue}
            />
          </li>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <li key={`empty-${i}`} className="w-full max-w-[68px]">
            <div className="w-full aspect-square md:h-10 md:aspect-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Scales Section (matches Geist)
function ScalesSection({ isDark }: { isDark: boolean }) {
  return (
    <Section>
      <SectionHeader id="scales">Scales</SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4">
        There are 10 color scales in the system. Right click to copy raw values.
      </p>
      <div className="mt-10 space-y-6">
        {allScales.map((scale) => (
          <ColorScaleRow key={scale.id} scale={scale} isDark={isDark} />
        ))}
      </div>
    </Section>
  );
}

// Color row item for usage sections
function ColorRowItem({
  cssVar,
  label,
  description,
  showBorder = true,
}: {
  cssVar: string;
  label: string;
  description: string;
  showBorder?: boolean;
}) {
  return (
    <div
      className={`flex h-10 items-center gap-3 ${showBorder ? "border-b border-borderNeutral" : ""}`}
    >
      <div
        className="h-4 w-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{ background: `var(${cssVar})` }}
      />
      <p className="text-[14px] leading-[20px] font-medium text-textDefault w-[120px]">
        {label}
      </p>
      <p className="text-[14px] leading-[20px] text-textSubtle">
        {description}
      </p>
    </div>
  );
}

// Backgrounds Section
function BackgroundsSection() {
  return (
    <Section>
      <SectionHeader id="backgrounds">Backgrounds</SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4">
        There are two background colors for pages and UI components. In most
        instances, you should use Background 1—especially when color is being
        placed on top of the background. Background 2 should be used sparingly
        when a subtle background differentiation is needed.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-background-100"
          label="Background 1"
          description="Default element background"
        />
        <ColorRowItem
          cssVar="--ds-background-200"
          label="Background 2"
          description="Secondary background"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[700px] w-full flex-col border border-borderNeutral md:h-[412px] md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div
          className="flex h-[50%] items-center justify-center border-r border-borderNeutral md:h-full md:w-[50%]"
          style={{ background: "var(--ds-background-100)" }}
        >
          <div
            className="relative flex h-[164px] w-[164px] items-center justify-center rounded-[12px] border border-borderNeutral"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              1
            </div>
            <div
              className="absolute bottom-[-57px] flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              2
            </div>
          </div>
        </div>
        <div
          className="flex h-[50%] items-center justify-center border-t border-borderNeutral md:h-full md:w-[50%] md:border-t-0"
          style={{ background: "var(--ds-background-200)" }}
        >
          <div
            className="relative flex h-[164px] w-[164px] items-center justify-center rounded-[12px] border border-borderNeutral"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              1
            </div>
            <div
              className="absolute bottom-[-57px] flex h-6 w-6 items-center justify-center rounded-full text-xs text-textSubtle font-mono"
              style={{ background: "var(--ds-gray-alpha-100)" }}
            >
              2
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// Colors 1-3: Component Backgrounds Section
function ComponentBackgroundsSection() {
  return (
    <Section>
      <SectionHeader id="colors-1-3-component-backgrounds">
        Colors 1–3: Component Backgrounds
      </SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4">
        These three colors are designed for UI component backgrounds.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-100"
          label="Color 1"
          description="Default background"
        />
        <ColorRowItem
          cssVar="--ds-gray-200"
          label="Color 2"
          description="Hover background"
        />
        <ColorRowItem
          cssVar="--ds-gray-300"
          label="Color 3"
          description="Active background"
          showBorder={false}
        />
      </div>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4">
        If your UI component&apos;s default background is Background 1, you can
        use Color 1 as your hover background and Color 2 as your active
        background. On smaller UI elements like badges, you can use Color 2 or
        Color 3 as the background.
      </p>
      {/* Visual demo */}
      <div
        className="mt-10 flex w-full flex-col border border-borderNeutral md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div className="border-borderNeutral p-2 md:p-12">
          <ul>
            <li className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]">
              <span className="text-textSubtle">○</span>
              <p className="text-xs font-mono text-textSubtle">
                APR 26 15:54:21.12
              </p>
              <div className="h-5 w-px bg-borderNeutral" />
              <p className="text-xs font-mono text-textSubtle">
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
            <li
              className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]"
              style={{ background: "var(--ds-amber-100)" }}
            >
              <span style={{ color: "var(--ds-amber-900)" }}>⚠</span>
              <p
                className="text-xs font-mono"
                style={{ color: "var(--ds-amber-900)" }}
              >
                APR 26 15:54:21.12
              </p>
              <div
                className="h-5 w-px"
                style={{ background: "var(--ds-amber-400)" }}
              />
              <p
                className="text-xs font-mono"
                style={{ color: "var(--ds-amber-900)" }}
              >
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
            <li className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]">
              <span className="text-textSubtle">○</span>
              <p className="text-xs font-mono text-textSubtle whitespace-nowrap">
                APR 26 15:54:21.12
              </p>
              <div className="h-5 w-px bg-borderNeutral" />
              <p className="text-xs font-mono text-textSubtle">
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
            <li className="flex h-10 w-full items-center gap-3 rounded-sm px-3 md:w-[420px]">
              <span className="text-textSubtle">○</span>
              <p className="text-xs font-mono text-textSubtle">
                APR 26 15:54:21.12
              </p>
              <div className="h-5 w-px bg-borderNeutral" />
              <p className="text-xs font-mono text-textSubtle">
                <span className="hidden md:inline-block">/dashboard</span>
                /overview
              </p>
            </li>
          </ul>
        </div>
        <div className="flex h-[120px] grow items-center justify-center gap-2 border-t md:h-auto md:border-l md:border-t-0">
          <span
            className="px-2 py-1 text-xs font-medium rounded capitalize"
            style={{
              background: "var(--ds-gray-200)",
              color: "var(--ds-gray-900)",
            }}
          >
            Hobby
          </span>
          <span
            className="px-2 py-1 text-xs font-medium rounded capitalize"
            style={{
              background: "var(--ds-blue-100)",
              color: "var(--ds-blue-900)",
            }}
          >
            Pro
          </span>
          <span
            className="px-2 py-1 text-xs font-medium rounded capitalize"
            style={{
              background: "var(--ds-purple-100)",
              color: "var(--ds-purple-900)",
            }}
          >
            Enterprise
          </span>
        </div>
      </div>
    </Section>
  );
}

// Colors 4-6: Borders Section
function BordersSection() {
  return (
    <Section>
      <SectionHeader id="colors-4-6-borders">Colors 4-6: Borders</SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4">
        These three colors are designed for UI component borders.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-400"
          label="Color 4"
          description="Default border"
        />
        <ColorRowItem
          cssVar="--ds-gray-500"
          label="Color 5"
          description="Hover border"
        />
        <ColorRowItem
          cssVar="--ds-gray-600"
          label="Color 6"
          description="Active border"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[136px] w-full items-center justify-center border border-borderNeutral"
        style={{ background: "var(--ds-background-100)" }}
      >
        <Button variant="secondary" ignoreDarkMode>
          New Project
        </Button>
      </div>
    </Section>
  );
}

// Colors 7-8: High Contrast Backgrounds Section
function HighContrastBackgroundsSection() {
  return (
    <Section>
      <SectionHeader id="colors-7-8-high-contrast-backgrounds">
        Colors 7-8: High Contrast Backgrounds
      </SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4">
        These two colors are designed for high contrast UI component
        backgrounds.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-700"
          label="Color 7"
          description="High contrast background"
        />
        <ColorRowItem
          cssVar="--ds-gray-800"
          label="Color 8"
          description="Hover high contrast background"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[260px] w-full flex-col items-center justify-center border border-borderNeutral md:h-[136px] md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div className="flex h-[65%] w-full items-center justify-center gap-5 border-borderNeutral md:h-full md:w-[50%] md:border-r">
          {/* Gauges */}
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-gray-alpha-400)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-green-700)"
                strokeWidth="3"
                strokeDasharray="85 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              90
            </span>
          </div>
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-gray-alpha-400)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-amber-700)"
                strokeWidth="3"
                strokeDasharray="55 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              55
            </span>
          </div>
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-gray-alpha-400)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--ds-red-800)"
                strokeWidth="3"
                strokeDasharray="20 100"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              20
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center md:w-[50%] py-6 md:py-0">
          <Button variant="primary" ignoreDarkMode>
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </Section>
  );
}

// Colors 9-10: Text and Icons Section
function TextAndIconsSection() {
  return (
    <Section>
      <SectionHeader id="colors-9-10-text-and-icons">
        Colors 9-10: Text and Icons
      </SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4">
        These two colors are designed for accessible text and icons.
      </p>
      <div className="my-5">
        <ColorRowItem
          cssVar="--ds-gray-900"
          label="Color 9"
          description="Secondary text and icons"
        />
        <ColorRowItem
          cssVar="--ds-gray-1000"
          label="Color 10"
          description="Primary text and icons"
          showBorder={false}
        />
      </div>
      {/* Visual demo */}
      <div
        className="mt-10 flex h-[260px] w-full flex-col items-center justify-center border border-borderNeutral md:h-[198px] md:flex-row"
        style={{ background: "var(--ds-background-100)" }}
      >
        <div className="flex h-[65%] w-[63%] items-center justify-center border-borderNeutral md:h-full md:w-[50%]">
          <div className="flex w-[316px] flex-col gap-1">
            <p
              className="text-[16px] font-semibold"
              style={{ color: "var(--ds-gray-1000)" }}
            >
              The Frontend Cloud
            </p>
            <p className="text-[14px]" style={{ color: "var(--ds-gray-900)" }}>
              Build, scale, and secure a faster, personalized web with Distanz.
            </p>
            <a
              className="mt-2 flex items-center gap-0.5 text-sm no-underline"
              href="#"
              style={{ color: "var(--ds-pink-900)" }}
            >
              Learn More
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
        </div>
        <div className="flex h-[35%] w-full items-center justify-center gap-7 border-t md:h-full md:w-[50%] md:gap-5 md:border-l md:border-t-0">
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-green-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-blue-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-purple-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-amber-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-pink-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            style={{ color: "var(--ds-teal-900)" }}
          >
            <circle cx="8" cy="8" r="6" fill="currentColor" />
          </svg>
        </div>
      </div>
    </Section>
  );
}

export default function ColourPalettes() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode();
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ToastProvider>
      <div>
        {/* Sections in Geist order */}
        <ScalesSection isDark={isDark} />
        <BackgroundsSection />
        <ComponentBackgroundsSection />
        <BordersSection />
        <HighContrastBackgroundsSection />
        <TextAndIconsSection />
      </div>
    </ToastProvider>
  );
}

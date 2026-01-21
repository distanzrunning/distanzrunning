"use client";

import React, { useState, useCallback, useRef } from "react";
import { Section } from "../ContentWithTOC";
import { SiTailwindcss } from "react-icons/si";
import { HelpCircle } from "lucide-react";

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

// Example icon for table header
function ExampleIcon() {
  return (
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
        d="M2.72027 11.5043L2.21981 13.2149L2.13514 13.5043H0.572266L0.780159 12.7937L3.78017 2.53943L5.21983 2.53943L8.21981 12.7937L8.4277 13.5043H6.86483L6.78016 13.2149L6.27971 11.5043H6.15H2.85H2.72027ZM3.21762 9.80429H5.78236L4.5 5.42105L3.21762 9.80429ZM10.7594 6.03974C11.2413 5.69486 11.8616 5.50427 12.6667 5.50427C13.7453 5.50427 14.5444 5.84624 15.0685 6.41056C15.5776 6.95869 15.75 7.63387 15.75 8.17101L15.75 9.00427V11.2821V13.5043H14.25V13.1109C13.7934 13.3447 13.2165 13.5043 12.5 13.5043C11.7806 13.5043 11.0987 13.2858 10.5841 12.8458C10.0596 12.3974 9.75 11.7513 9.75 11.0043C9.75 9.55377 10.9223 8.25427 12.5 8.25427H14.25V8.17101C14.25 7.93037 14.1699 7.64719 13.9695 7.43139C13.7841 7.23178 13.4165 7.00427 12.6667 7.00427C12.1073 7.00427 11.8098 7.13252 11.6323 7.25957C11.4434 7.3947 11.3089 7.58505 11.1597 7.86097L9.84025 7.14757C10.0221 6.81118 10.2887 6.37652 10.7594 6.03974ZM14.25 9.75427H12.5C11.7921 9.75427 11.25 10.3402 11.25 11.0043C11.25 11.3145 11.369 11.5434 11.5588 11.7057C11.7585 11.8764 12.0766 12.0043 12.5 12.0043C13.2926 12.0043 13.7319 11.7211 13.9746 11.4829C14.1031 11.3568 14.1874 11.2319 14.2379 11.1426L14.25 11.1208V9.75427Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Material definitions
interface MaterialDefinition {
  className: string;
  usage: string;
}

const surfaceMaterials: MaterialDefinition[] = [
  {
    className: "material-base",
    usage: "Everyday use. Radius 6px.",
  },
  {
    className: "material-small",
    usage: "Slightly raised. Radius 6px.",
  },
  {
    className: "material-medium",
    usage: "Further raised. Radius 12px.",
  },
  {
    className: "material-large",
    usage: "Further raised. Radius 12px.",
  },
];

const floatingMaterials: MaterialDefinition[] = [
  {
    className: "material-tooltip",
    usage:
      "Lightest shadow. Corner 6px. Tooltips will be the only floating element with a triangular stem.",
  },
  {
    className: "material-menu",
    usage: "Lift from page. Radius 12px.",
  },
  {
    className: "material-modal",
    usage: "Further lift. Radius 12px.",
  },
  {
    className: "material-fullscreen",
    usage: "Biggest lift. Radius 16px.",
  },
];

// Material table component
function MaterialTable({ materials }: { materials: MaterialDefinition[] }) {
  const { showToast } = React.useContext(ToastContext);

  const handleCopyClassName = (className: string) => {
    navigator.clipboard.writeText(className);
    showToast(`Copied ${className}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full caption-bottom text-sm text-textDefault table-fixed">
        <thead>
          <tr className="transition-colors">
            <th className="h-10 px-4 text-left align-middle font-medium border-b border-borderNeutral w-[45%]">
              <div className="inline-flex gap-1.5 items-center">
                <ExampleIcon />
                Example
              </div>
            </th>
            <th className="h-10 px-4 text-center align-middle font-medium border-b border-borderNeutral w-[25%]">
              <div className="inline-flex gap-1.5 items-center justify-center w-full">
                <SiTailwindcss size={16} className="text-[#38bdf8]" />
                Class name
              </div>
            </th>
            <th className="h-10 px-4 text-right align-middle font-medium border-b border-borderNeutral w-[30%]">
              <div className="inline-flex gap-1.5 items-center justify-end w-full">
                <HelpCircle size={16} />
                Usage
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr
              key={material.className}
              className="transition-colors hover:bg-[var(--ds-gray-100)] cursor-copy border-b border-[var(--ds-gray-400)]"
              onClick={() => handleCopyClassName(material.className)}
              style={{ height: 120 }}
            >
              <td className="px-4 py-3 align-middle">
                <div className={`${material.className} w-full h-[100px]`} />
              </td>
              <td className="px-4 py-3 align-middle text-center font-mono text-[13px]">
                {material.className}
              </td>
              <td className="px-4 py-3 align-middle text-right text-textSubtle">
                {material.usage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Surface section
function SurfaceSection() {
  return (
    <Section>
      <SectionHeader id="surface">Surface</SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4 mb-6">
        On the page.
      </p>
      <MaterialTable materials={surfaceMaterials} />
    </Section>
  );
}

// Floating section
function FloatingSection() {
  return (
    <Section>
      <SectionHeader id="floating">Floating</SectionHeader>
      <p className="text-[16px] leading-[1.5] text-textSubtle mt-4 mb-6">
        Above the page.
      </p>
      <MaterialTable materials={floatingMaterials} />
    </Section>
  );
}

export default function Materials() {
  return (
    <ToastProvider>
      <div>
        <SurfaceSection />
        <FloatingSection />
      </div>
    </ToastProvider>
  );
}

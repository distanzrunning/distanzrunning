"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface DesignSystemTopNavProps {
  activeSection: string | null;
  onSectionChange: (section: string | null) => void;
}

export default function DesignSystemTopNav({
  activeSection,
  onSectionChange,
}: DesignSystemTopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = ["foundations", "components", "patterns"];

  const handleSectionClick = (section: string) => {
    onSectionChange(section);
    setMenuOpen(false);
  };

  return (
    <nav
      className={`relative min-[960px]:sticky min-[960px]:top-12 z-40 border-b transition-colors duration-300 ${
        menuOpen
          ? "bg-neutral-900 dark:bg-neutral-950 border-neutral-800"
          : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-borderSubtle"
      }`}
    >
      {/* Mobile/Medium layout (< 960px) */}
      <div className="min-[960px]:hidden px-6">
        <div className="flex items-center justify-between h-14">
          <button
            onClick={() => onSectionChange(null)}
            className="flex items-center gap-3 hover:opacity-70 transition-opacity"
          >
            <Image
              src={
                menuOpen
                  ? "/images/distanz_icon_white_round.png"
                  : "/images/distanz_icon_black_round.png"
              }
              alt="Distanz Running"
              width={28}
              height={28}
              className={menuOpen ? "" : "dark:invert"}
            />
            <span
              className={`font-serif text-xl font-medium ${menuOpen ? "text-white" : ""}`}
            >
              Stride DS
            </span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-2 text-sm transition-colors ${
              menuOpen
                ? "text-white hover:text-neutral-300"
                : "text-textSubtle hover:text-textDefault"
            }`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <>
                <X className="w-5 h-5" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5" />
                <span>Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full bg-neutral-900 dark:bg-neutral-950 border-b border-neutral-800 shadow-lg z-50">
            <div className="px-6 py-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => handleSectionClick(section)}
                  className={`block w-full text-left py-3 px-4 rounded-md text-base capitalize transition-colors ${
                    activeSection === section
                      ? "font-medium text-white bg-neutral-800"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Large screen layout (≥ 960px) - aligned with 12-column grid */}
      <div className="hidden min-[960px]:grid min-[960px]:grid-cols-12 h-14 max-w-[1585px] mx-auto">
        {/* Logo and Title - aligned with sidebar (2 cols) */}
        <div className="col-span-2 flex items-center px-6">
          <button
            onClick={() => onSectionChange(null)}
            className="flex items-center gap-3 hover:opacity-70 transition-opacity"
          >
            <Image
              src="/images/distanz_icon_black_round.png"
              alt="Distanz Running"
              width={28}
              height={28}
              className="dark:invert"
            />
            <span className="font-serif text-xl font-medium">Stride DS</span>
          </button>
        </div>

        {/* Section Links - aligned with content area (10 cols) */}
        <div className="col-span-10 flex items-center gap-6 px-8">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => onSectionChange(section)}
              className={`text-base capitalize transition-colors hover:underline ${
                activeSection === section
                  ? "font-medium text-textDefault"
                  : "text-textSubtle hover:text-textDefault"
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

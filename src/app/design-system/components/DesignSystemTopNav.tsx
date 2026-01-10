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
    <header
      className={`relative min-[1100px]:sticky min-[1100px]:top-12 z-40 border-b transition-colors duration-300 ${
        menuOpen
          ? "bg-neutral-900 dark:bg-neutral-950 border-neutral-800"
          : "bg-white dark:bg-neutral-900 border-borderSubtle"
      }`}
    >
      <div className="flex items-stretch px-6 min-[1100px]:px-8 py-6 min-[1100px]:py-8">
        {/* Logo and Title */}
        <button
          onClick={() => onSectionChange(null)}
          className="flex items-center gap-4 hover:opacity-70 transition-opacity pr-6 min-[1100px]:pr-8"
        >
          <Image
            src={
              menuOpen
                ? "/images/distanz_icon_white_round.png"
                : "/images/distanz_icon_black_round.png"
            }
            alt="Distanz Running"
            width={56}
            height={56}
            className={menuOpen ? "" : "dark:invert"}
          />
          <h1
            className={`font-serif text-lg leading-tight ${menuOpen ? "text-white" : "text-textDefault"}`}
          >
            <strong className="font-semibold">Distanz</strong>{" "}
            <span className="font-normal">Design System</span>
          </h1>
        </button>

        {/* Divider */}
        <div
          className={`w-px self-stretch ${menuOpen ? "bg-neutral-700" : "bg-borderSubtle"}`}
        />

        {/* Menu section */}
        <nav className="flex items-center pl-6 min-[1100px]:pl-8">
          {/* Mobile/Tablet menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`min-[1100px]:hidden flex items-center gap-2 text-sm transition-colors ${
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

          {/* Desktop navigation links */}
          <ul className="hidden min-[1100px]:flex items-center gap-6">
            {sections.map((section) => (
              <li key={section}>
                <button
                  onClick={() => onSectionChange(section)}
                  className={`text-base capitalize transition-colors hover:underline ${
                    activeSection === section
                      ? "font-medium text-textDefault"
                      : "text-textSubtle hover:text-textDefault"
                  }`}
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="min-[1100px]:hidden absolute left-0 right-0 top-full bg-neutral-900 dark:bg-neutral-950 border-b border-neutral-800 shadow-lg z-50">
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
    </header>
  );
}

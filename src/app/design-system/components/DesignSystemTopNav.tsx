"use client";

import Image from "next/image";

interface DesignSystemTopNavProps {
  activeSection: string | null;
  onSectionChange: (section: string | null) => void;
}

export default function DesignSystemTopNav({
  activeSection,
  onSectionChange,
}: DesignSystemTopNavProps) {
  const sections = ["foundations", "components", "patterns"];

  return (
    <nav className="sticky top-12 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-borderSubtle transition-colors duration-300">
      {/* Mobile/Medium layout (< 960px) */}
      <div className="min-[960px]:hidden px-6">
        <div className="flex items-center gap-4 h-14">
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
          <div className="h-5 w-px bg-borderNeutral" />
          <div className="flex items-center gap-4">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                className={`text-sm capitalize transition-colors hover:underline ${
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

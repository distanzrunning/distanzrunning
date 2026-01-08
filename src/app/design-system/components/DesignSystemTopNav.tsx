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
      {/* Mobile layout */}
      <div className="lg:hidden px-4 sm:px-6">
        <div className="flex items-center gap-4 h-14">
          <Image
            src="/images/distanz_icon_black_round.png"
            alt="Distanz Running"
            width={28}
            height={28}
            className="dark:invert"
          />
          <button
            onClick={() => onSectionChange(null)}
            className="font-serif text-lg font-medium hover:text-textSubtle transition-colors"
          >
            Stride
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

      {/* Desktop layout - aligned with grid */}
      <div className="hidden lg:grid lg:grid-cols-12 h-14">
        {/* Logo and Title - aligned with sidebar (2 cols) */}
        <div className="col-span-2 flex items-center gap-3 px-6">
          <Image
            src="/images/distanz_icon_black_round.png"
            alt="Distanz Running"
            width={28}
            height={28}
            className="dark:invert"
          />
          <button
            onClick={() => onSectionChange(null)}
            className="font-serif text-lg font-medium hover:text-textSubtle transition-colors"
          >
            Stride
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

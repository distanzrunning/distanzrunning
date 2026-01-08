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
      <div className="grid grid-cols-1 lg:grid-cols-12 h-16">
        {/* Logo and Title - aligned with sidebar */}
        <div className="hidden lg:flex lg:col-span-2 items-center gap-3 px-6 border-r border-borderSubtle">
          <div className="flex-shrink-0">
            <Image
              src="/images/distanz_icon_black_round.png"
              alt="Distanz Running"
              width={28}
              height={28}
              className="dark:invert"
            />
          </div>
          <button
            onClick={() => onSectionChange(null)}
            className="font-serif text-lg font-medium hover:text-textSubtle transition-colors truncate"
          >
            Stride
          </button>
        </div>

        {/* Section Links - aligned with content area */}
        <div className="col-span-1 lg:col-span-10 flex items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
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

        {/* Mobile: Logo and Title */}
        <div className="lg:hidden flex items-center gap-3 px-4 col-span-1 absolute left-0 top-0 h-16">
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
      </div>
    </nav>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';

interface DesignSystemTopNavProps {
  activeSection: string | null;
  onSectionChange: (section: string | null) => void;
}

export default function DesignSystemTopNav({ activeSection, onSectionChange }: DesignSystemTopNavProps) {
  const sections = ['foundations', 'components', 'patterns'];

  return (
    <nav className="sticky top-0 z-50 bg-canvas dark:bg-[#0a0a0a] border-b border-borderNeutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/images/distanz_icon_black_round.png"
              alt="Distanz Running"
              width={32}
              height={32}
              className="dark:invert"
            />
          </div>

          {/* Title */}
          <button
            onClick={() => onSectionChange(null)}
            className="font-serif text-xl font-medium hover:text-textSubtle transition-colors"
          >
            Stride Design System
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-borderNeutral" />

          {/* Section Links */}
          <div className="flex items-center gap-6">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                className={`text-sm capitalize transition-colors ${
                  activeSection === section
                    ? 'font-medium text-textDefault'
                    : 'text-textSubtle hover:text-textDefault'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

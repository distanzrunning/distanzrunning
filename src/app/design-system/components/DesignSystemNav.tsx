'use client';

import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavSection {
  id: string;
  label: string;
  subcategories?: { id: string; label: string }[];
}

const navSections: NavSection[] = [
  { id: 'introduction', label: 'Introduction' },
  {
    id: 'foundations',
    label: 'Foundations',
    subcategories: [
      { id: 'colors', label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'radius-shadows', label: 'Radius & Shadows' },
      { id: 'grid', label: 'Grid System' },
    ]
  },
  { id: 'icons', label: 'Icons' },
  { id: 'animation', label: 'Animation' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'components', label: 'Components' },
];

interface DesignSystemNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function DesignSystemNav({ activeSection, onSectionChange }: DesignSystemNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['foundations']);

  // Color indicators for each section
  const getSectionIndicatorColor = (sectionId: string) => {
    const colorMap: Record<string, string> = {
      introduction: '#e43c81', // Electric Pink
      colors: '#e43c81',
      typography: '#00D464', // Volt Green
      spacing: '#00D464',
      'radius-shadows': '#00D464',
      grid: '#00D464',
      icons: '#FF5722', // Signal Orange
      animation: '#7C3AED', // Pace Purple
      accessibility: '#8B4513', // Trail Brown
      patterns: '#DC2626', // Track Red
      components: '#DC2626',
    };
    return colorMap[sectionId];
  };

  const handleClick = (id: string) => {
    setMobileMenuOpen(false);
    onSectionChange(id);
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`
          lg:absolute lg:left-0 lg:top-0 lg:w-64 lg:min-h-screen
          fixed inset-y-0 left-0 w-64 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-r border-borderNeutral z-40 transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto px-6 py-8 lg:sticky lg:top-0 lg:max-h-screen">
          <h2 className="text-xs uppercase tracking-wide text-textSubtler font-medium mb-4">
            Contents
          </h2>
          <ul className="space-y-1">
            {navSections.map((section) => (
              <li key={section.id}>
                {section.subcategories ? (
                  // Section with subcategories
                  <div>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full text-left text-sm py-2 px-3 rounded-md transition-colors text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between"
                    >
                      <span>{section.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedSections.includes(section.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedSections.includes(section.id) && (
                      <ul className="ml-3 mt-1 space-y-1 border-l border-borderNeutral pl-3">
                        {section.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <button
                              onClick={() => handleClick(sub.id)}
                              className={`
                                w-full text-left text-sm py-2 px-3 rounded-md transition-colors flex items-center gap-2
                                ${
                                  activeSection === sub.id
                                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                                    : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                                }
                              `}
                            >
                              {getSectionIndicatorColor(sub.id) && (
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getSectionIndicatorColor(sub.id) }}
                                />
                              )}
                              <span>{sub.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Regular section
                  <button
                    onClick={() => handleClick(section.id)}
                    className={`
                      w-full text-left text-sm py-2 px-3 rounded-md transition-colors flex items-center gap-2
                      ${
                        activeSection === section.id
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                          : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }
                    `}
                  >
                    {getSectionIndicatorColor(section.id) && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getSectionIndicatorColor(section.id) }}
                      />
                    )}
                    <span>{section.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

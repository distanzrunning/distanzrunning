'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navSections = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radius-shadows', label: 'Radius & Shadows' },
  { id: 'grid', label: 'Grid System' },
  { id: 'icons', label: 'Icons' },
  { id: 'animation', label: 'Animation' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'components', label: 'Components' },
];

export default function DesignSystemNav() {
  const [activeSection, setActiveSection] = useState('colors');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
      }
    );

    navSections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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
          fixed top-[200px] left-0 h-[calc(100vh-200px)] w-64 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-r border-borderNeutral z-40 transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto px-6 py-8">
          <h2 className="text-xs uppercase tracking-wide text-textSubtler font-medium mb-4">
            Contents
          </h2>
          <ul className="space-y-1">
            {navSections.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => handleClick(id)}
                  className={`
                    w-full text-left text-sm py-2 px-3 rounded-md transition-colors
                    ${
                      activeSection === id
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                        : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }
                  `}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

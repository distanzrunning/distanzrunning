'use client';

import { useState } from 'react';
import { ChevronDown, Glasses, Scale, SwatchBook, LayoutGrid, Ruler, Type, LucideIcon } from 'lucide-react';

interface SubSection {
  id: string;
  label: string;
}

interface SidebarSection {
  id: string;
  label: string;
  icon?: LucideIcon;
  subsections?: SubSection[];
}

interface DesignSystemSidebarProps {
  section: string;
  activeSubsection: string;
  onSubsectionChange: (subsection: string) => void;
}

const foundationsSections: SidebarSection[] = [
  { id: 'overview', label: 'Overview', icon: Glasses },
  {
    id: 'principles',
    label: 'Principles',
    icon: Scale,
    subsections: [
      { id: 'design-principles', label: 'Design principles' },
      { id: 'ux-principles', label: 'UX principles' },
    ],
  },
  {
    id: 'colour',
    label: 'Colour',
    icon: SwatchBook,
    subsections: [
      { id: 'palettes', label: 'Palettes' },
      { id: 'collections', label: 'Collections' },
    ],
  },
  {
    id: 'grid',
    label: 'Grid',
    icon: LayoutGrid,
    subsections: [
      { id: 'grid-spacing', label: 'Grid Spacing' },
      { id: 'grid-layout', label: 'Grid Layout' },
    ],
  },
  { id: 'rules', label: 'Rules', icon: Ruler },
  {
    id: 'typography',
    label: 'Typography',
    icon: Type,
    subsections: [
      { id: 'typefaces', label: 'Typefaces' },
      { id: 'modular-scale', label: 'Modular scale' },
      { id: 'line-height', label: 'Line-height' },
    ],
  },
];

const componentsSections: SidebarSection[] = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'buttons',
    label: 'Buttons',
    subsections: [
      { id: 'button', label: 'Button' },
      { id: 'button-icon', label: 'Button + Icon' },
      { id: 'slim-button', label: 'Slim button' },
      { id: 'slim-button-icon', label: 'Slim button + Icon' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    subsections: [
      { id: 'blockquote', label: 'Blockquote' },
      { id: 'pull-quote', label: 'Pull-quote' },
    ],
  },
  {
    id: 'controls',
    label: 'Controls',
    subsections: [
      { id: 'close', label: 'Close' },
      { id: 'collapse', label: 'Collapse' },
      { id: 'drag', label: 'Drag' },
      { id: 'drag-handle', label: 'Drag + handle' },
      { id: 'expand', label: 'Expand' },
      { id: 'label', label: 'Label' },
      { id: 'media', label: 'Media' },
      { id: 'menu-disclosure', label: 'Menu disclosure' },
      { id: 'nav-disclosure', label: 'Navigation disclosure' },
      { id: 'nav-disclosure-icon', label: 'Navigation disclosure + icon' },
      { id: 'section-control', label: 'Section control' },
      { id: 'tooltip', label: 'Tooltip' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    subsections: [
      { id: 'banner-alert', label: 'Banner alert' },
      { id: 'indicator', label: 'Indicator' },
      { id: 'inline-alert', label: 'Inline alert' },
      { id: 'notification', label: 'Notification' },
      { id: 'status-alert', label: 'Status alert' },
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    subsections: [
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'combined-input-field', label: 'Combined input field' },
      { id: 'date-field', label: 'Date field' },
      { id: 'helper-text', label: 'Helper text' },
      { id: 'form-input', label: 'Form input' },
      { id: 'form-label', label: 'Label' },
      { id: 'label-tag', label: 'Label + tag' },
      { id: 'notice', label: 'Notice' },
      { id: 'number-field', label: 'Number field' },
      { id: 'password-field', label: 'Password field' },
      { id: 'radio-button', label: 'Radio button' },
      { id: 'search-field', label: 'Search field' },
      { id: 'select-field', label: 'Select field' },
      { id: 'text-area', label: 'Text area' },
      { id: 'text-field', label: 'Text field' },
    ],
  },
  {
    id: 'identity',
    label: 'Identity',
    subsections: [
      { id: 'idents-columns', label: 'Idents (Columns)' },
      { id: 'idents-newsletters', label: 'Idents (Newsletters)' },
      { id: 'idents-podcasts', label: 'Idents (Podcasts)' },
    ],
  },
  {
    id: 'landmarks',
    label: 'Landmarks',
    subsections: [
      { id: 'badge', label: 'Badge' },
      { id: 'section-headline', label: 'Section headline' },
      { id: 'section-headline-sub-rule', label: 'Section headline and subheadline + rule' },
      { id: 'section-headline-rule', label: 'Section headline + rule' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    subsections: [
      { id: 'actioned-link', label: 'Actioned link' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'call-to-action', label: 'Call-to-action' },
      { id: 'cta-arrow', label: 'Call-to-action with arrow' },
      { id: 'chapter-list', label: 'Chapter list' },
      { id: 'emphasised-link', label: 'Emphasised link' },
      { id: 'link-arrow', label: 'Link with arrow' },
      { id: 'link-arrow-icon', label: 'Link with arrow icon' },
      { id: 'navigation-link', label: 'Navigation link' },
      { id: 'navigation-link-icon', label: 'Navigation link + icon' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'section-link', label: 'Section link' },
      { id: 'share', label: 'Share' },
      { id: 'share-link', label: 'Share link' },
      { id: 'tabs', label: 'Tabs' },
    ],
  },
  {
    id: 'structure',
    label: 'Structure',
    subsections: [
      { id: 'rule', label: 'Rule' },
    ],
  },
  {
    id: 'assets',
    label: 'Assets',
    subsections: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'logo-wordmark', label: 'Logo & wordmark' },
      { id: 'monogram', label: 'Monogram' },
      { id: 'social-icons', label: 'Social icons' },
    ],
  },
];

const patternsSections: SidebarSection[] = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'layout',
    label: 'Layout',
    subsections: [
      { id: 'footer', label: 'Footer' },
      { id: 'footer-secondary', label: 'Footer (secondary)' },
      { id: 'masthead', label: 'Masthead' },
      { id: 'masthead-secondary', label: 'Masthead (secondary)' },
      { id: 'media-promo', label: 'Media promo' },
      { id: 'missed-target', label: 'Missed target' },
      { id: 'slim-media-promo', label: 'Slim media promo' },
      { id: 'table', label: 'Table' },
      { id: 'table-collapsable', label: 'Table (collapsable)' },
    ],
  },
];

const sectionMap: Record<string, SidebarSection[]> = {
  foundations: foundationsSections,
  components: componentsSections,
  patterns: patternsSections,
};

export default function DesignSystemSidebar({ section, activeSubsection, onSubsectionChange }: DesignSystemSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const sections = sectionMap[section] || [];

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleClick = (id: string) => {
    onSubsectionChange(id);
  };

  return (
    <nav className="w-64 bg-canvas dark:bg-[#0a0a0a] border-r border-borderNeutral min-h-screen">
      <div className="px-6 py-8 sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <ul className="space-y-1">
          {sections.map((item) => (
            <li key={item.id}>
              {item.subsections ? (
                // Section with subsections
                <div>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className="w-full text-left text-base py-2 px-3 rounded-md transition-colors text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && (
                        <item.icon
                          className="w-4 h-4"
                          strokeWidth={item.subsections.some(sub => sub.id === activeSubsection) ? 2.5 : 1.5}
                        />
                      )}
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedSections.includes(item.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedSections.includes(item.id) && (
                    <ul className="ml-3 mt-1 space-y-1 border-l border-borderNeutral pl-3">
                      {item.subsections.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => handleClick(sub.id)}
                            className={`
                              w-full text-left text-base py-2 px-3 rounded-md transition-colors
                              ${
                                activeSubsection === sub.id
                                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                              }
                            `}
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular section
                <button
                  onClick={() => handleClick(item.id)}
                  className={`
                    w-full text-left text-base py-2 px-3 rounded-md transition-colors flex items-center gap-2
                    ${
                      activeSubsection === item.id
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                        : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }
                  `}
                >
                  {item.icon && (
                    <item.icon
                      className="w-4 h-4"
                      strokeWidth={activeSubsection === item.id ? 2.5 : 1.5}
                    />
                  )}
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

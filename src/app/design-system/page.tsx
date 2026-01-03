'use client';

import { useState } from 'react';
import IntroductionShowcase from './components/IntroductionShowcase';
import ColorPalette from './components/ColorPalette';
import TypographyShowcase from './components/TypographyShowcase';
import SpacingShowcase from './components/SpacingShowcase';
import RadiusAndShadowsShowcase from './components/RadiusAndShadowsShowcase';
import GridSystemShowcase from './components/GridSystemShowcase';
import IconSystemShowcase from './components/IconSystemShowcase';
import AnimationShowcase from './components/AnimationShowcase';
import AccessibilityShowcase from './components/AccessibilityShowcase';
import DesignPatternsShowcase from './components/DesignPatternsShowcase';
import ComponentShowcase from './components/ComponentShowcase';
import DesignSystemNav from './components/DesignSystemNav';

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return <IntroductionShowcase />;
      case 'colors':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Color Palette
            </h2>
            <ColorPalette />
          </div>
        );
      case 'typography':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Typography
            </h2>
            <TypographyShowcase />
          </div>
        );
      case 'spacing':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Spacing & Layout
            </h2>
            <SpacingShowcase />
          </div>
        );
      case 'radius-shadows':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Border Radius & Shadows
            </h2>
            <RadiusAndShadowsShowcase />
          </div>
        );
      case 'grid':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Grid System
            </h2>
            <GridSystemShowcase />
          </div>
        );
      case 'icons':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Icon System
            </h2>
            <IconSystemShowcase />
          </div>
        );
      case 'animation':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Animation & Motion
            </h2>
            <AnimationShowcase />
          </div>
        );
      case 'accessibility':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Accessibility
            </h2>
            <AccessibilityShowcase />
          </div>
        );
      case 'patterns':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Design Patterns
            </h2>
            <DesignPatternsShowcase />
          </div>
        );
      case 'components':
        return (
          <div>
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Components
            </h2>
            <ComponentShowcase />
          </div>
        );
      default:
        return <IntroductionShowcase />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-[#0a0a0a]">
      {/* Container with Sidebar and Content */}
      <div className="relative">
        {/* Sidebar Navigation */}
        <DesignSystemNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Content */}
        <main className="lg:pl-64">
          <div className="px-6 py-12">
            {renderContent()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface dark:bg-[#0c0c0d] border-t border-borderNeutral mt-24 lg:pl-64">
          <div className="px-6 py-8 text-center text-textSubtle text-sm">
            <p>Distanz Running Design System • Built with Next.js + Tailwind CSS</p>
            <p className="mt-2">
              <a href="/STYLE_GUIDE.md" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline">
                View Style Guide
              </a>
              {' • '}
              <a href="/src/styles/design-tokens.ts" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline">
                View Design Tokens
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

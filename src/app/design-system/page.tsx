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

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="flex relative min-h-screen">
      {/* Sidebar Navigation */}
      <DesignSystemNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content Area - full width with its own background */}
      <div className="flex-1 lg:ml-64 bg-white dark:bg-[#0c0c0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

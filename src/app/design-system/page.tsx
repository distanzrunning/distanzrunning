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
  return (
    <div className="min-h-screen bg-canvas dark:bg-[#0a0a0a] scroll-smooth">
      {/* Header */}
      <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-borderNeutral pt-6 pb-6 sticky top-0 lg:top-12 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col justify-center min-h-[140px]">
          <h1 className="font-serif text-[56px] leading-[1.1] font-medium mb-2">
            Design System
          </h1>
          <p className="text-textSubtle text-lg">
            Distanz Running visual language and component library
          </p>
          <div className="flex gap-4 mt-4 text-sm text-textSubtler flex-wrap">
            <span>Adobe Fonts: Inter Variable + EB Garamond</span>
            <span className="hidden sm:inline">•</span>
            <span>Design Tokens: TypeScript</span>
            <span className="hidden sm:inline">•</span>
            <span>Framework: Next.js + Tailwind</span>
          </div>
        </div>
      </header>

      {/* Container with Sidebar and Content */}
      <div className="max-w-7xl mx-auto relative">
        {/* Sidebar Navigation */}
        <DesignSystemNav />

        {/* Content */}
        <main className="lg:pl-64 pt-12">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-24">
          {/* Colors Section */}
          <section id="colors" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Color Palette
            </h2>
            <ColorPalette />
          </section>

          {/* Typography Section */}
          <section id="typography" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Typography
            </h2>
            <TypographyShowcase />
          </section>

          {/* Spacing Section */}
          <section id="spacing" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Spacing & Layout
            </h2>
            <SpacingShowcase />
          </section>

          {/* Radius & Shadows Section */}
          <section id="radius-shadows" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Border Radius & Shadows
            </h2>
            <RadiusAndShadowsShowcase />
          </section>

          {/* Grid System Section */}
          <section id="grid" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Grid System
            </h2>
            <GridSystemShowcase />
          </section>

          {/* Icon System Section */}
          <section id="icons" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Icon System
            </h2>
            <IconSystemShowcase />
          </section>

          {/* Animation Section */}
          <section id="animation" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Animation & Motion
            </h2>
            <AnimationShowcase />
          </section>

          {/* Accessibility Section */}
          <section id="accessibility" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Accessibility
            </h2>
            <AccessibilityShowcase />
          </section>

          {/* Design Patterns Section */}
          <section id="patterns" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Design Patterns
            </h2>
            <DesignPatternsShowcase />
          </section>

          {/* Components Section */}
          <section id="components" className="scroll-mt-32">
            <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
              Components
            </h2>
            <ComponentShowcase />
          </section>
        </div>
      </main>

        {/* Footer */}
        <footer className="bg-surface dark:bg-[#0c0c0d] border-t border-borderNeutral mt-24 lg:pl-64">
          <div className="max-w-5xl mx-auto px-6 py-8 text-center text-textSubtle text-sm">
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

import ColorPalette from './components/ColorPalette';
import TypographyShowcase from './components/TypographyShowcase';
import SpacingShowcase from './components/SpacingShowcase';
import ComponentShowcase from './components/ComponentShowcase';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-[#0a0a0a] scroll-smooth">
      {/* Header */}
      <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-borderNeutral pt-6 pb-6">
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

      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-borderNeutral sticky top-0 lg:top-12 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-6 text-sm font-medium overflow-x-auto scrollbar-hide justify-center sm:justify-start">
            <a href="#colors" className="hover:text-electric-pink transition-colors whitespace-nowrap">
              Colors
            </a>
            <a href="#typography" className="hover:text-electric-pink transition-colors whitespace-nowrap">
              Typography
            </a>
            <a href="#spacing" className="hover:text-electric-pink transition-colors whitespace-nowrap">
              Spacing
            </a>
            <a href="#components" className="hover:text-electric-pink transition-colors whitespace-nowrap">
              Components
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
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

        {/* Components Section */}
        <section id="components" className="scroll-mt-32">
          <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-8">
            Components
          </h2>
          <ComponentShowcase />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface dark:bg-[#0c0c0d] border-t border-borderNeutral mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-textSubtle text-sm">
          <p>Distanz Running Design System • Built with Next.js + Tailwind CSS</p>
          <p className="mt-2">
            <a href="/STYLE_GUIDE.md" className="text-electric-pink hover:underline">
              View Style Guide
            </a>
            {' • '}
            <a href="/src/styles/design-tokens.ts" className="text-electric-pink hover:underline">
              View Design Tokens
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

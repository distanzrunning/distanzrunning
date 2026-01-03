export default function IntroductionShowcase() {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h2 className="font-serif text-[40px] leading-[1.15] font-medium mb-6">
          Welcome to Distanz Running Design System
        </h2>
        <p className="text-textSubtle text-lg mb-8">
          A comprehensive visual language and component library for building consistent, accessible, and beautiful running-focused experiences.
        </p>
      </div>

      {/* Philosophy */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-2xl font-medium mb-4">Design Philosophy</h3>
        <div className="space-y-4 text-textSubtle">
          <div>
            <h4 className="font-medium text-textDefault mb-2">Minimalist & Refined</h4>
            <p className="text-sm">
              Our design system embraces minimalism with a refined aesthetic. We use neutral greys as the foundation,
              reserving electric pink and vibrant accent colors for strategic brand moments and visual hierarchy.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-textDefault mb-2">Design-Focused</h4>
            <p className="text-sm">
              Every component is crafted with attention to detail, balancing form and function.
              We prioritize clean layouts, thoughtful typography, and purposeful use of color.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-textDefault mb-2">Accessibility First</h4>
            <p className="text-sm">
              Built to WCAG 2.1 Level AA standards, ensuring everyone can access and enjoy the content
              regardless of their abilities or assistive technologies.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Technical Foundation</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-2">Framework</h4>
            <p className="text-sm text-textSubtle mb-3">
              Built with Next.js 14+ and React Server Components for optimal performance
            </p>
            <div className="text-xs text-textSubtler">
              <code className="font-mono">Next.js + TypeScript + Tailwind CSS</code>
            </div>
          </div>

          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-2">Typography</h4>
            <p className="text-sm text-textSubtle mb-3">
              Adobe Fonts providing elegant serif and versatile sans-serif type families
            </p>
            <div className="text-xs text-textSubtler">
              <code className="font-mono">Inter Variable + EB Garamond</code>
            </div>
          </div>

          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-2">Icons</h4>
            <p className="text-sm text-textSubtle mb-3">
              Lucide React for consistent, accessible iconography across all interfaces
            </p>
            <div className="text-xs text-textSubtler">
              <code className="font-mono">Lucide React v0.503.0</code>
            </div>
          </div>

          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-2">Design Tokens</h4>
            <p className="text-sm text-textSubtle mb-3">
              TypeScript-based tokens ensuring consistency across all applications
            </p>
            <div className="text-xs text-textSubtler">
              <code className="font-mono">TypeScript + Tailwind Config</code>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-2xl font-medium mb-4">Getting Started</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">1. Explore Foundations</h4>
            <p className="text-sm text-textSubtle">
              Start with our foundational elements: colors, typography, spacing, and grid system.
              These building blocks form the basis of all designs.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">2. Review Components</h4>
            <p className="text-sm text-textSubtle">
              Browse our component library for pre-built, accessible UI elements ready to use in your projects.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">3. Study Patterns</h4>
            <p className="text-sm text-textSubtle">
              Learn common design patterns and best practices for creating consistent user experiences.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">4. Check Accessibility</h4>
            <p className="text-sm text-textSubtle">
              Review our accessibility guidelines to ensure your implementations meet our standards.
            </p>
          </div>
        </div>
      </div>

      {/* Color Principles */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Color Usage Principles</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-neutral-900 dark:bg-white flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Primary Actions</p>
              <p className="text-xs text-textSubtle">Neutral 900 / White for primary buttons and key CTAs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-electric-pink flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Brand Accents</p>
              <p className="text-xs text-textSubtle">Electric pink reserved for logos, strategic highlights, and brand moments</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-borderNeutral" />
            <div>
              <p className="font-medium text-sm">Subtle Backgrounds</p>
              <p className="text-xs text-textSubtle">Neutral greys for surfaces, cards, and subtle visual hierarchy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';

export default function IntroductionShowcase() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/images/distanz_icon_black_round.png"
            alt="Distanz Running"
            width={64}
            height={64}
            className="dark:invert"
          />
          <h1 className="font-serif text-[52px] leading-[1.1] font-medium">
            Stride Design System
          </h1>
        </div>
        <p className="text-lg text-textSubtle max-w-3xl">
          A comprehensive design toolkit that enables consistent, accessible, and beautiful experiences across Distanz Running.
          Stride provides reusable components, design guidelines, and code standards that serve as our single source of truth
          for creating digital products.
        </p>
      </div>

      {/* What is Stride */}
      <div className="bg-surface-subtle rounded-lg p-8 border border-borderNeutral">
        <h2 className="font-serif text-[30px] leading-[1.25] font-medium mb-4">
          What is a Design System?
        </h2>
        <p className="text-textSubtle mb-4">
          Design systems are comprehensive collections of reusable components, guidelines, and standards that enable
          consistent user experiences across products and teams while maintaining design quality at scale.
        </p>
        <p className="text-textSubtle">
          Stride is our toolkit for building authentic Distanz Running experiences. It helps our UX and UI teams create
          consistent digital experiences across different platforms, products, and services while improving efficiency—no
          need to recreate the same elements from scratch.
        </p>
      </div>

      {/* What Stride Provides */}
      <div>
        <h2 className="font-serif text-[30px] leading-[1.25] font-medium mb-6">
          What Stride Provides
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
            <h3 className="font-semibold mb-3">Design Foundations</h3>
            <p className="text-sm text-textSubtle mb-4">
              Core visual elements including color palettes, typography systems, spacing scales, and grid structures
              that form the basis of all Distanz Running designs.
            </p>
            <div className="text-sm">
              <a href="#" className="text-textDefault hover:text-electric-pink transition-colors">
                Explore Foundations →
              </a>
            </div>
          </div>

          <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
            <h3 className="font-semibold mb-3">Reusable Components</h3>
            <p className="text-sm text-textSubtle mb-4">
              Pre-built, accessible UI components with code snippets for commonly used elements like buttons, forms,
              navigation menus, and cards.
            </p>
            <div className="text-sm">
              <a href="#" className="text-textDefault hover:text-electric-pink transition-colors">
                View Components →
              </a>
            </div>
          </div>

          <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
            <h3 className="font-semibold mb-3">Design Patterns</h3>
            <p className="text-sm text-textSubtle mb-4">
              Common interaction patterns and best practices that guide how users navigate and interact with our
              digital products.
            </p>
            <div className="text-sm">
              <a href="#" className="text-textDefault hover:text-electric-pink transition-colors">
                Study Patterns →
              </a>
            </div>
          </div>

          <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
            <h3 className="font-semibold mb-3">Accessibility Guidelines</h3>
            <p className="text-sm text-textSubtle mb-4">
              Standards and guidelines to help create inclusive experiences that work for all users, regardless of
              their abilities or assistive technologies.
            </p>
            <div className="text-sm">
              <a href="#" className="text-textDefault hover:text-electric-pink transition-colors">
                Check Accessibility →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Design Principles */}
      <div className="bg-surface-subtle rounded-lg p-8 border border-borderNeutral">
        <h2 className="font-serif text-[30px] leading-[1.25] font-medium mb-6">
          Design Principles
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Minimalist & Refined</h3>
            <p className="text-sm text-textSubtle">
              Stride embraces minimalism with a refined aesthetic. We use neutral greys as the foundation,
              reserving electric pink and vibrant accent colors for strategic brand moments and visual hierarchy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Performance-Focused</h3>
            <p className="text-sm text-textSubtle">
              Every component is optimized for speed and efficiency. Built with Next.js 14+ and React Server Components,
              Stride ensures fast, responsive experiences across all devices.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Accessibility First</h3>
            <p className="text-sm text-textSubtle">
              All components are built to WCAG 2.1 Level AA standards, ensuring everyone can access and enjoy
              Distanz Running content regardless of their abilities or assistive technologies.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Consistent & Scalable</h3>
            <p className="text-sm text-textSubtle">
              TypeScript-based design tokens and systematic guidelines ensure consistency across all platforms
              while maintaining flexibility for growth and evolution.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="font-serif text-[30px] leading-[1.25] font-medium mb-6">
          Built With
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-subtle rounded-lg p-4 border border-borderNeutral">
            <div className="text-xs text-textSubtler mb-1">Framework</div>
            <div className="font-medium text-sm">Next.js 14+</div>
          </div>
          <div className="bg-surface-subtle rounded-lg p-4 border border-borderNeutral">
            <div className="text-xs text-textSubtler mb-1">Styling</div>
            <div className="font-medium text-sm">Tailwind CSS</div>
          </div>
          <div className="bg-surface-subtle rounded-lg p-4 border border-borderNeutral">
            <div className="text-xs text-textSubtler mb-1">Typography</div>
            <div className="font-medium text-sm">Adobe Fonts</div>
          </div>
          <div className="bg-surface-subtle rounded-lg p-4 border border-borderNeutral">
            <div className="text-xs text-textSubtler mb-1">Icons</div>
            <div className="font-medium text-sm">Lucide React</div>
          </div>
        </div>
      </div>
    </div>
  );
}

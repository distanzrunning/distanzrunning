export default function DesignTokens() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Principles
        </p>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-0">
          Design tokens
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      <p className="text-base text-textSubtle max-w-3xl">
        Design tokens are design decisions, translated into data. They act as a
        &ldquo;source of truth&rdquo; to help ensure that product experiences
        feel unified and cohesive.
      </p>

      {/* What are design tokens */}
      <section>
        <h2
          id="what-are-tokens"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          What are design tokens?
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-6">
          Design tokens are the smallest, most fundamental pieces of our design
          system. They represent design decisions as named values&mdash;colours,
          spacing, typography, and more&mdash;stored in a format that can be
          used across platforms and tools.
        </p>

        <p className="text-base text-textSubtle max-w-3xl mb-6">
          Instead of hard-coding values like{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-sm font-mono">
            #E43C81
          </code>{" "}
          or{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-sm font-mono">
            16px
          </code>
          , we use tokens like{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-sm font-mono">
            electric-pink-55
          </code>{" "}
          or{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-sm font-mono">
            spacing-4
          </code>
          . This abstraction creates a shared language between design and
          engineering.
        </p>

        <div className="bg-canvas dark:bg-[#1A1816] border-l-4 border-electric-pink p-6">
          <h3 className="font-sans font-semibold text-sm uppercase tracking-wide text-textDefault mb-2">
            Why tokens matter
          </h3>
          <p className="text-sm text-textSubtle leading-relaxed">
            Tokens enable consistency at scale. When we update a token value, it
            propagates everywhere that token is used. This makes global changes
            efficient and reduces the risk of inconsistency.
          </p>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Token types */}
      <section>
        <h2
          id="token-types"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Token types
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Our token system uses a layered approach, from raw values to
          context-specific applications.
        </p>

        {/* Global tokens */}
        <h3
          id="global-tokens"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Global tokens
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          The foundational layer. These are raw, context-agnostic values that
          form the building blocks of the system. They describe what the value
          is, not how it should be used.
        </p>

        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-neutralBgSubtle dark:bg-[#1A1816]">
                <th className="text-left py-3 px-4 font-semibold">
                  Token name
                </th>
                <th className="text-left py-3 px-4 font-semibold">Value</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">asphalt-10</td>
                <td className="py-3 px-4">#1A1A1A</td>
                <td className="py-3 px-4 font-sans text-textSubtle">Colour</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">electric-pink-55</td>
                <td className="py-3 px-4">#D11B5C</td>
                <td className="py-3 px-4 font-sans text-textSubtle">Colour</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">spacing-4</td>
                <td className="py-3 px-4">1rem (16px)</td>
                <td className="py-3 px-4 font-sans text-textSubtle">Spacing</td>
              </tr>
              <tr>
                <td className="py-3 px-4">font-serif</td>
                <td className="py-3 px-4">EB Garamond</td>
                <td className="py-3 px-4 font-sans text-textSubtle">
                  Typography
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Semantic tokens */}
        <h3
          id="semantic-tokens"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Semantic tokens
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          The contextual layer. These tokens describe purpose and intent, not
          the value itself. They alias global tokens and can change based on
          context (like light/dark mode).
        </p>

        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-neutralBgSubtle dark:bg-[#1A1816]">
                <th className="text-left py-3 px-4 font-semibold">
                  Semantic token
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Light mode
                </th>
                <th className="text-left py-3 px-4 font-semibold">Dark mode</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">textDefault</td>
                <td className="py-3 px-4">asphalt-10</td>
                <td className="py-3 px-4">asphalt-95</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">textSubtle</td>
                <td className="py-3 px-4">asphalt-40</td>
                <td className="py-3 px-4">asphalt-60</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">surface</td>
                <td className="py-3 px-4">white</td>
                <td className="py-3 px-4">asphalt-5</td>
              </tr>
              <tr>
                <td className="py-3 px-4">borderDefault</td>
                <td className="py-3 px-4">asphalt-90</td>
                <td className="py-3 px-4">asphalt-20</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Component tokens */}
        <h3
          id="component-tokens"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Component tokens
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          The specific layer. These tokens are scoped to individual components,
          allowing for precise control without affecting the broader system.
        </p>

        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-neutralBgSubtle dark:bg-[#1A1816]">
                <th className="text-left py-3 px-4 font-semibold">
                  Component token
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  References
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">button-background-default</td>
                <td className="py-3 px-4">surface</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">button-background-hover</td>
                <td className="py-3 px-4">surfaceSubtle</td>
              </tr>
              <tr>
                <td className="py-3 px-4">button-border-width</td>
                <td className="py-3 px-4">border-width-100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Token inheritance diagram */}
      <section>
        <h2
          id="token-inheritance"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Token inheritance
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Tokens form a chain of inheritance, from raw values through to
          component-specific applications.
        </p>

        {/* SVG Diagram */}
        <div className="mb-6">
          <img
            src="/images/design-system/token-inheritance.svg"
            alt="Token inheritance diagram showing how values flow from raw hex codes through global, semantic, and component tokens"
            className="w-full max-w-3xl mx-auto"
          />
        </div>

        <p className="text-sm text-textSubtle max-w-3xl">
          The raw hex value{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            #D11B5C
          </code>{" "}
          is defined as the global token{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            electric-pink-55
          </code>
          , aliased by the semantic token{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            textAccent
          </code>
          , and used by the component token{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            link-color-default
          </code>
          .
        </p>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Token categories */}
      <section>
        <h2
          id="token-categories"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Token categories
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Our design tokens are organised into the following categories:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Colour</h4>
            <p className="text-sm text-textSubtle mb-3">
              Brand colours, greyscale, semantic colours, and status colours.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              color-*
            </code>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Typography</h4>
            <p className="text-sm text-textSubtle mb-3">
              Font families, sizes, weights, line heights, and letter spacing.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              font-*, text-*
            </code>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Spacing</h4>
            <p className="text-sm text-textSubtle mb-3">
              Margins, padding, gaps, and layout spacing based on an 8px grid.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              spacing-*
            </code>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Border</h4>
            <p className="text-sm text-textSubtle mb-3">
              Border widths, radii, and styles for consistent component edges.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              border-*, radius-*
            </code>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Shadow</h4>
            <p className="text-sm text-textSubtle mb-3">
              Elevation and depth through consistent shadow definitions.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              shadow-*
            </code>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Animation</h4>
            <p className="text-sm text-textSubtle mb-3">
              Durations, easing curves, and motion parameters.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              animation-*, easing-*
            </code>
          </div>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Usage guidelines */}
      <section>
        <h2
          id="usage-guidelines"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Usage guidelines
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <h3
          id="prefer-semantic"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Prefer semantic tokens
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-6">
          Always use semantic tokens when available. They ensure your
          implementation adapts correctly to theme changes and design system
          updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-success-bg-subtle dark:bg-[#0D2818] border border-success-border rounded-lg p-4">
            <p className="text-sm font-semibold text-success-text dark:text-[#4ADE80] mb-2">
              Do
            </p>
            <code className="text-xs font-mono text-textDefault">
              color: var(--color-textDefault);
            </code>
          </div>
          <div className="bg-error-bg-subtle dark:bg-[#2D1212] border border-error-border rounded-lg p-4">
            <p className="text-sm font-semibold text-error-text dark:text-[#F87171] mb-2">
              Don&apos;t
            </p>
            <code className="text-xs font-mono text-textDefault">
              color: #1A1A1A;
            </code>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        <h3
          id="use-global-sparingly"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Use global tokens sparingly
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-6">
          Only use global tokens directly when no semantic token exists for your
          use case. Global tokens don&apos;t carry contextual meaning and
          won&apos;t automatically adapt to themes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-success-bg-subtle dark:bg-[#0D2818] border border-success-border rounded-lg p-4">
            <p className="text-sm font-semibold text-success-text dark:text-[#4ADE80] mb-2">
              Do
            </p>
            <code className="text-xs font-mono text-textDefault">
              background: var(--color-surface);
            </code>
          </div>
          <div className="bg-error-bg-subtle dark:bg-[#2D1212] border border-error-border rounded-lg p-4">
            <p className="text-sm font-semibold text-error-text dark:text-[#F87171] mb-2">
              Don&apos;t
            </p>
            <code className="text-xs font-mono text-textDefault">
              background: var(--color-asphalt-95);
            </code>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        <h3
          id="never-hardcode"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Never hard-code values
        </h3>
        <p className="text-base text-textSubtle max-w-3xl">
          Hard-coded values bypass the token system entirely, making maintenance
          difficult and breaking consistency. Always reference a token, even for
          seemingly simple values.
        </p>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Implementation */}
      <section>
        <h2
          id="implementation"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Implementation
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-6">
          Our tokens are defined in{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-sm font-mono">
            src/styles/design-tokens.ts
          </code>{" "}
          and consumed via CSS custom properties and Tailwind utilities.
        </p>

        <h3
          id="css-variables"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          CSS custom properties
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          Tokens are exposed as CSS variables for use in stylesheets:
        </p>

        <div className="bg-[#1A1A1A] rounded-lg p-4 mb-8 overflow-x-auto">
          <pre className="text-sm font-mono text-[#E5E5E5]">
            <code>{`.element {
  color: var(--color-textDefault);
  background: var(--color-surface);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}`}</code>
          </pre>
        </div>

        <h3
          id="tailwind-classes"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Tailwind classes
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          Most tokens are mapped to Tailwind utilities for use in JSX:
        </p>

        <div className="bg-[#1A1A1A] rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-[#E5E5E5]">
            <code>{`<div className="text-textDefault bg-surface p-4 rounded-md">
  Content styled with tokens
</div>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}

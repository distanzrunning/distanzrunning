import { CodeBlock } from "@/components/ui/CodeBlock";

export default function DesignTokens() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <p className="text-copy-14 tracking-wide text-textSubtle mb-2">
          Principles
        </p>
        <h1 className="text-heading-40 font-serif mb-0">
          Design tokens
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      <p className="text-copy-16 text-textSubtle max-w-3xl">
        Design tokens are design decisions, translated into data. They act as a
        &ldquo;source of truth&rdquo; to help ensure that product experiences
        feel unified and cohesive.
      </p>

      {/* What are design tokens */}
      <section>
        <h2
          id="what-are-tokens"
          className="text-heading-24 font-serif mb-2 scroll-mt-32"
        >
          What are design tokens?
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-copy-16 text-textSubtle max-w-3xl mb-6">
          Design tokens are the smallest, most fundamental pieces of our design
          system. They represent design decisions as named values&mdash;colours,
          spacing, typography, and more&mdash;stored in a format that can be
          used across platforms and tools.
        </p>

        <p className="text-copy-16 text-textSubtle max-w-3xl mb-6">
          Instead of hard-coding values like{" "}
          <code className="inline-code">
            #0070F3
          </code>{" "}
          or{" "}
          <code className="inline-code">
            16px
          </code>
          , we use tokens like{" "}
          <code className="inline-code">
            blue-700
          </code>{" "}
          or{" "}
          <code className="inline-code">
            spacing-4
          </code>
          . This abstraction creates a shared language between design and
          engineering.
        </p>

        <div className="bg-surfaceWarm border-l-4 border-textDefault p-6">
          <h3 className="font-sans text-heading-14 uppercase tracking-wide text-textDefault mb-2">
            Why tokens matter
          </h3>
          <p className="text-copy-14 text-textSubtle leading-relaxed">
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
          className="text-heading-24 font-serif mb-2 scroll-mt-32"
        >
          Token types
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-copy-16 text-textSubtle max-w-3xl mb-8">
          Our token system uses a layered approach, from raw values to
          context-specific applications.
        </p>

        {/* Global tokens */}
        <h3
          id="global-tokens"
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          Global tokens
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl mb-4">
          The foundational layer. These are raw, context-agnostic values that
          form the building blocks of the system. They describe what the value
          is, not how it should be used.
        </p>

        <div className="bg-canvas rounded-lg border border-borderDefault overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-surfaceWarm">
                <th className="text-left py-3 px-4 font-semibold">
                  Token name
                </th>
                <th className="text-left py-3 px-4 font-semibold">Value</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">gray-1000</td>
                <td className="py-3 px-4">#1A1A1A</td>
                <td className="py-3 px-4 font-sans text-textSubtle">Colour</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">blue-700</td>
                <td className="py-3 px-4">#0070F3</td>
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
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          Semantic tokens
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl mb-4">
          The contextual layer. These tokens describe purpose and intent, not
          the value itself. They alias global tokens and can change based on
          context (like light/dark mode).
        </p>

        <div className="bg-canvas rounded-lg border border-borderDefault overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-surfaceWarm">
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
                <td className="py-3 px-4">gray-1000</td>
                <td className="py-3 px-4">gray-200</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">textSubtle</td>
                <td className="py-3 px-4">gray-800</td>
                <td className="py-3 px-4">gray-600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">surface</td>
                <td className="py-3 px-4">white</td>
                <td className="py-3 px-4">gray-1000</td>
              </tr>
              <tr>
                <td className="py-3 px-4">borderDefault</td>
                <td className="py-3 px-4">gray-300</td>
                <td className="py-3 px-4">gray-900</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Component tokens */}
        <h3
          id="component-tokens"
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          Component tokens
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl mb-4">
          The specific layer. These tokens are scoped to individual components,
          allowing for precise control without affecting the broader system.
        </p>

        <div className="bg-canvas rounded-lg border border-borderDefault overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-surfaceWarm">
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
          className="text-heading-24 font-serif mb-2 scroll-mt-32"
        >
          Token inheritance
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-copy-16 text-textSubtle max-w-3xl mb-8">
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

        <p className="text-copy-14 text-textSubtle max-w-3xl">
          The raw hex value{" "}
          <code className="inline-code">
            #0070F3
          </code>{" "}
          is defined as the global token{" "}
          <code className="inline-code">
            blue-700
          </code>
          , aliased by the semantic token{" "}
          <code className="inline-code">
            textAccent
          </code>
          , and used by the component token{" "}
          <code className="inline-code">
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
          className="text-heading-24 font-serif mb-2 scroll-mt-32"
        >
          Token categories
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-copy-16 text-textSubtle max-w-3xl mb-8">
          Our design tokens are organised into the following categories:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-canvas rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Colour</h4>
            <p className="text-copy-14 text-textSubtle mb-3">
              Brand colours, greyscale, semantic colours, and status colours.
            </p>
            <code className="inline-code">
              color-*
            </code>
          </div>

          <div className="bg-canvas rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Typography</h4>
            <p className="text-copy-14 text-textSubtle mb-3">
              Font families, sizes, weights, line heights, and letter spacing.
            </p>
            <code className="inline-code">
              font-*, text-*
            </code>
          </div>

          <div className="bg-canvas rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Spacing</h4>
            <p className="text-copy-14 text-textSubtle mb-3">
              Margins, padding, gaps, and layout spacing based on an 8px grid.
            </p>
            <code className="inline-code">
              spacing-*
            </code>
          </div>

          <div className="bg-canvas rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Border</h4>
            <p className="text-copy-14 text-textSubtle mb-3">
              Border widths, radii, and styles for consistent component edges.
            </p>
            <code className="inline-code">
              border-*, radius-*
            </code>
          </div>

          <div className="bg-canvas rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Shadow</h4>
            <p className="text-copy-14 text-textSubtle mb-3">
              Elevation and depth through consistent shadow definitions.
            </p>
            <code className="inline-code">
              shadow-*
            </code>
          </div>

          <div className="bg-canvas rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Animation</h4>
            <p className="text-copy-14 text-textSubtle mb-3">
              Durations, easing curves, and motion parameters.
            </p>
            <code className="inline-code">
              animation-*, easing-*
            </code>
          </div>

          <div className="bg-canvas rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Materials</h4>
            <p className="text-copy-14 text-textSubtle mb-3">
              Presets combining radii, fills, strokes, and shadows for surfaces
              and floating elements.
            </p>
            <code className="inline-code">
              material-*
            </code>
          </div>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Usage guidelines */}
      <section>
        <h2
          id="usage-guidelines"
          className="text-heading-24 font-serif mb-2 scroll-mt-32"
        >
          Usage guidelines
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <h3
          id="prefer-semantic"
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          Prefer semantic tokens
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl mb-6">
          Always use semantic tokens when available. They ensure your
          implementation adapts correctly to theme changes and design system
          updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-success-bg-subtle border border-success-border rounded-lg p-4">
            <p className="text-sm font-semibold text-success-text mb-2">Do</p>
            <code className="inline-code">
              color: var(--color-textDefault);
            </code>
          </div>
          <div className="bg-error-bg-subtle border border-error-border rounded-lg p-4">
            <p className="text-sm font-semibold text-error-text mb-2">
              Don&apos;t
            </p>
            <code className="inline-code">
              color: #1A1A1A;
            </code>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        <h3
          id="use-global-sparingly"
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          Use global tokens sparingly
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl mb-6">
          Only use global tokens directly when no semantic token exists for your
          use case. Global tokens don&apos;t carry contextual meaning and
          won&apos;t automatically adapt to themes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-success-bg-subtle border border-success-border rounded-lg p-4">
            <p className="text-sm font-semibold text-success-text mb-2">Do</p>
            <code className="inline-code">
              background: var(--color-surface);
            </code>
          </div>
          <div className="bg-error-bg-subtle border border-error-border rounded-lg p-4">
            <p className="text-sm font-semibold text-error-text mb-2">
              Don&apos;t
            </p>
            <code className="inline-code">
              background: var(--color-gray-200);
            </code>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        <h3
          id="never-hardcode"
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          Never hard-code values
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl">
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
          className="text-heading-24 font-serif mb-2 scroll-mt-32"
        >
          Implementation
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-copy-16 text-textSubtle max-w-3xl mb-6">
          Our tokens are defined in{" "}
          <code className="inline-code">
            src/styles/design-tokens.ts
          </code>{" "}
          and consumed via CSS custom properties and Tailwind utilities.
        </p>

        <h3
          id="css-variables"
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          CSS custom properties
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl mb-4">
          Tokens are exposed as CSS variables for use in stylesheets:
        </p>

        <div className="mb-8">
          <CodeBlock language="css" showLineNumbers={false}>
            {`.element {
  color: var(--color-textDefault);
  background: var(--color-surface);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}`}
          </CodeBlock>
        </div>

        <h3
          id="tailwind-classes"
          className="text-heading-20 font-serif mb-3 scroll-mt-32"
        >
          Tailwind classes
        </h3>
        <p className="text-copy-16 text-textSubtle max-w-3xl mb-4">
          Most tokens are mapped to Tailwind utilities for use in JSX:
        </p>

        <CodeBlock language="html" showLineNumbers={false}>
          {`<div className="text-textDefault bg-surface p-4 rounded-md">
  Content styled with tokens
</div>`}
        </CodeBlock>
      </section>
    </div>
  );
}

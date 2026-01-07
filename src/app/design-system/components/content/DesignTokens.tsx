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
          Design tokens&mdash;or tokens, for short&mdash;are design decisions,
          translated into data. They&apos;re ultimately a communication tool: a
          shared language between design and engineering for communicating
          detailed information about how to build user interfaces.
        </p>

        <p className="text-base text-textSubtle max-w-3xl mb-6">
          Tokens consist of values needed to construct and maintain a design
          system, such as spacing, colour, typography, object styles, animation,
          and more. They can represent anything that has a design definition,
          like a colour as an RGB value, an opacity as a number, or an animation
          ease as Bezier coordinates.
        </p>

        <p className="text-base text-textSubtle max-w-3xl mb-6">
          We use tokens instead of hard-coded values so Stride can scale and
          support the complex ways that our products need to intersect as a
          cohesive ecosystem.
        </p>

        <div className="bg-canvas dark:bg-[#1A1816] border-l-4 border-electric-pink p-6 mb-6">
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

      {/* Terminology */}
      <section>
        <h2
          id="terminology"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Terminology
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Understanding the key terms is essential to working with design tokens
          effectively.
        </p>

        <div className="space-y-6 mb-8">
          {/* Token */}
          <div className="border-l-2 border-electric-pink pl-6">
            <h3
              id="term-token"
              className="font-semibold text-lg mb-2 scroll-mt-32"
            >
              Token
            </h3>
            <p className="text-base text-textSubtle">
              A design decision, represented as data. Each token has a carefully
              chosen name that communicates its intention and scope, and follows
              a set naming convention.
            </p>
          </div>

          {/* Value */}
          <div className="border-l-2 border-electric-pink pl-6">
            <h3
              id="term-value"
              className="font-semibold text-lg mb-2 scroll-mt-32"
            >
              Value
            </h3>
            <p className="text-base text-textSubtle">
              The data associated with the token name. This could either be
              another token (called an alias) or a final value (for example:
              RGBA colours, pixels, percentages).
            </p>
          </div>

          {/* Alias */}
          <div className="border-l-2 border-electric-pink pl-6">
            <h3
              id="term-alias"
              className="font-semibold text-lg mb-2 scroll-mt-32"
            >
              Alias
            </h3>
            <p className="text-base text-textSubtle">
              A token that references another token, instead of referencing a
              hard-coded value. Aliases create layers of abstraction and enable
              theme switching.
            </p>
          </div>

          {/* Global token */}
          <div className="border-l-2 border-electric-pink pl-6">
            <h3
              id="term-global"
              className="font-semibold text-lg mb-2 scroll-mt-32"
            >
              Global token
            </h3>
            <p className="text-base text-textSubtle">
              A token used across the design system. These are the foundational
              building blocks&mdash;raw values like specific colours or spacing
              units.
            </p>
          </div>

          {/* Semantic token */}
          <div className="border-l-2 border-electric-pink pl-6">
            <h3
              id="term-semantic"
              className="font-semibold text-lg mb-2 scroll-mt-32"
            >
              Semantic token
            </h3>
            <p className="text-base text-textSubtle">
              A token that describes purpose rather than appearance. Instead of{" "}
              <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-sm font-mono">
                asphalt-10
              </code>
              , we use{" "}
              <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-sm font-mono">
                textDefault
              </code>
              .
            </p>
          </div>

          {/* Component token */}
          <div className="border-l-2 border-electric-pink pl-6">
            <h3
              id="term-component"
              className="font-semibold text-lg mb-2 scroll-mt-32"
            >
              Component token
            </h3>
            <p className="text-base text-textSubtle">
              A token scoped to a specific component. These allow precise
              control over individual components without affecting the broader
              system.
            </p>
          </div>
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
          component-specific applications. This layered approach provides both
          consistency and flexibility.
        </p>

        {/* SVG Diagram */}
        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-8 mb-8 overflow-x-auto">
          <svg
            viewBox="0 0 800 280"
            className="w-full max-w-4xl mx-auto"
            aria-labelledby="token-inheritance-title"
          >
            <title id="token-inheritance-title">
              Token inheritance diagram showing how values flow from raw hex
              codes through global, semantic, and component tokens
            </title>

            {/* Raw Value */}
            <g>
              <rect
                x="20"
                y="110"
                width="120"
                height="60"
                rx="4"
                className="fill-asphalt-95 dark:fill-asphalt-20 stroke-borderDefault"
                strokeWidth="1"
              />
              <text
                x="80"
                y="135"
                textAnchor="middle"
                className="fill-textSubtle text-[10px] font-sans"
              >
                Raw value
              </text>
              <text
                x="80"
                y="155"
                textAnchor="middle"
                className="fill-textDefault text-[12px] font-mono font-medium"
              >
                #D11B5C
              </text>
            </g>

            {/* Arrow 1 */}
            <path
              d="M140 140 L180 140"
              className="stroke-asphalt-50"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />

            {/* Global Token */}
            <g>
              <rect
                x="180"
                y="110"
                width="140"
                height="60"
                rx="4"
                className="fill-asphalt-95 dark:fill-asphalt-20 stroke-electric-pink"
                strokeWidth="2"
              />
              <text
                x="250"
                y="135"
                textAnchor="middle"
                className="fill-textSubtle text-[10px] font-sans"
              >
                Global token
              </text>
              <text
                x="250"
                y="155"
                textAnchor="middle"
                className="fill-electric-pink text-[11px] font-mono font-medium"
              >
                electric-pink-55
              </text>
            </g>

            {/* Arrow 2 */}
            <path
              d="M320 140 L360 140"
              className="stroke-asphalt-50"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />

            {/* Semantic Token */}
            <g>
              <rect
                x="360"
                y="110"
                width="140"
                height="60"
                rx="4"
                className="fill-asphalt-95 dark:fill-asphalt-20 stroke-pace-purple"
                strokeWidth="2"
              />
              <text
                x="430"
                y="135"
                textAnchor="middle"
                className="fill-textSubtle text-[10px] font-sans"
              >
                Semantic token
              </text>
              <text
                x="430"
                y="155"
                textAnchor="middle"
                className="fill-pace-purple text-[11px] font-mono font-medium"
              >
                textAccent
              </text>
            </g>

            {/* Arrow 3 - splits into two */}
            <path
              d="M500 140 L540 140 L540 80 L580 80"
              className="stroke-asphalt-50"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <path
              d="M540 140 L540 200 L580 200"
              className="stroke-asphalt-50"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />

            {/* Component Token 1 */}
            <g>
              <rect
                x="580"
                y="50"
                width="180"
                height="60"
                rx="4"
                className="fill-asphalt-95 dark:fill-asphalt-20 stroke-volt-green"
                strokeWidth="2"
              />
              <text
                x="670"
                y="75"
                textAnchor="middle"
                className="fill-textSubtle text-[10px] font-sans"
              >
                Component token
              </text>
              <text
                x="670"
                y="95"
                textAnchor="middle"
                className="fill-volt-green text-[11px] font-mono font-medium"
              >
                link-color-default
              </text>
            </g>

            {/* Component Token 2 */}
            <g>
              <rect
                x="580"
                y="170"
                width="180"
                height="60"
                rx="4"
                className="fill-asphalt-95 dark:fill-asphalt-20 stroke-volt-green"
                strokeWidth="2"
              />
              <text
                x="670"
                y="195"
                textAnchor="middle"
                className="fill-textSubtle text-[10px] font-sans"
              >
                Component token
              </text>
              <text
                x="670"
                y="215"
                textAnchor="middle"
                className="fill-volt-green text-[11px] font-mono font-medium"
              >
                button-text-accent
              </text>
            </g>

            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-asphalt-50"
                />
              </marker>
            </defs>
          </svg>
        </div>

        <p className="text-sm text-textSubtle max-w-3xl">
          In this example, the raw hex value{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            #D11B5C
          </code>{" "}
          is defined as the global token{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            electric-pink-55
          </code>
          . This is then aliased by the semantic token{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            textAccent
          </code>
          , which is used by multiple component tokens for links and buttons.
        </p>
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

      {/* Examples */}
      <section>
        <h2
          id="examples"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Examples
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Here are examples of how tokens are applied across different
          categories.
        </p>

        {/* Colour tokens */}
        <h3
          id="example-colour"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Colour tokens
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          Stride has both global and semantic colour tokens. A global colour
          token is a specific value from our colour system. A semantic colour
          token describes a particular usage.
        </p>

        {/* Colour example diagram */}
        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-lg mb-2 border border-borderSubtle"
                style={{ backgroundColor: "#1A1A1A" }}
              />
              <p className="text-xs font-mono text-textSubtle">asphalt-10</p>
              <p className="text-[10px] text-textSubtler">#1A1A1A</p>
            </div>
            <div className="text-2xl text-textSubtle">=</div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg mb-2 bg-textDefault border border-borderSubtle" />
              <p className="text-xs font-mono text-textSubtle">textDefault</p>
              <p className="text-[10px] text-textSubtler">Light mode</p>
            </div>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Size tokens */}
        <h3
          id="example-size"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Size tokens
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          Components use size tokens that follow a t-shirt sizing convention
          (small, medium, large). These offer a limited number of size options
          that follow a linear scale based on our 8px grid.
        </p>

        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-neutralBgSubtle dark:bg-[#1A1816]">
                <th className="text-left py-3 px-4 font-semibold">Size</th>
                <th className="text-left py-3 px-4 font-semibold">Token</th>
                <th className="text-left py-3 px-4 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Small</td>
                <td className="py-3 px-4 font-mono">component-height-sm</td>
                <td className="py-3 px-4">32px</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Medium</td>
                <td className="py-3 px-4 font-mono">component-height-md</td>
                <td className="py-3 px-4">40px</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Large</td>
                <td className="py-3 px-4 font-mono">component-height-lg</td>
                <td className="py-3 px-4">48px</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Layout tokens */}
        <h3
          id="example-layout"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Layout tokens
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-4">
          Layout tokens cover fundamentals including spacing, border radius, and
          border widths.
        </p>

        {/* Layout example diagram */}
        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-8 mb-8">
          <svg
            viewBox="0 0 400 120"
            className="w-full max-w-md mx-auto"
            aria-labelledby="layout-tokens-title"
          >
            <title id="layout-tokens-title">
              Layout tokens example showing border radius and spacing
            </title>

            {/* Input field example */}
            <rect
              x="50"
              y="30"
              width="300"
              height="48"
              rx="6"
              className="fill-surface stroke-borderDefault"
              strokeWidth="1"
            />

            {/* Annotations */}
            {/* Border radius */}
            <path
              d="M50 30 Q50 30 56 30"
              className="stroke-electric-pink"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="30"
              y1="20"
              x2="56"
              y2="30"
              className="stroke-electric-pink"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <text
              x="10"
              y="15"
              className="fill-electric-pink text-[9px] font-mono"
            >
              radius-md
            </text>

            {/* Padding */}
            <line
              x1="62"
              y1="42"
              x2="62"
              y2="66"
              className="stroke-pace-purple"
              strokeWidth="1"
            />
            <line
              x1="58"
              y1="42"
              x2="66"
              y2="42"
              className="stroke-pace-purple"
              strokeWidth="1"
            />
            <line
              x1="58"
              y1="66"
              x2="66"
              y2="66"
              className="stroke-pace-purple"
              strokeWidth="1"
            />
            <text
              x="70"
              y="58"
              className="fill-pace-purple text-[9px] font-mono"
            >
              spacing-3
            </text>

            {/* Border */}
            <text
              x="200"
              y="100"
              textAnchor="middle"
              className="fill-volt-green text-[9px] font-mono"
            >
              border-width-100 (1px)
            </text>
            <line
              x1="200"
              y1="78"
              x2="200"
              y2="92"
              className="stroke-volt-green"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </svg>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Naming principles */}
      <section>
        <h2
          id="naming-principles"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Naming principles
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-8">
          We name design tokens intentionally and strategically. This naming
          practice helps create a focused set of tokens and helps more people
          understand and work with tokens in product design and development.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Human-readable</h4>
            <p className="text-sm text-textSubtle">
              Tokens are communication tools that humans need to readily
              understand. We use descriptive language, not cryptic codes.
            </p>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Flat structure</h4>
            <p className="text-sm text-textSubtle">
              We use a flat structure&mdash;not nested or tree-based&mdash;so
              token names have a natural, conversational feel.
            </p>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Predictable</h4>
            <p className="text-sm text-textSubtle">
              We follow a consistent naming structure that maps to natural
              language, making tokens predictable yet flexible.
            </p>
          </div>
        </div>
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

      {/* Naming convention */}
      <section>
        <h2
          id="naming-convention"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Naming structure
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle max-w-3xl mb-6">
          We use a structured pattern for token names: context, common unit, and
          clarification. Token names start with broad context, then become
          increasingly specific.
        </p>

        <div className="bg-canvas dark:bg-[#1A1816] rounded-lg border border-borderDefault p-6 mb-6">
          <code className="text-sm font-mono">
            [category]-[property]-[variant]-[state]
          </code>
        </div>

        {/* Naming structure diagram */}
        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-8 mb-8">
          <svg
            viewBox="0 0 600 100"
            className="w-full max-w-2xl mx-auto"
            aria-labelledby="naming-structure-title"
          >
            <title id="naming-structure-title">
              Token naming structure from broad to specific
            </title>

            {/* Boxes */}
            <rect
              x="20"
              y="30"
              width="120"
              height="50"
              rx="4"
              className="fill-electric-pink/20 stroke-electric-pink"
              strokeWidth="2"
            />
            <text
              x="80"
              y="50"
              textAnchor="middle"
              className="fill-electric-pink text-[11px] font-semibold"
            >
              Category
            </text>
            <text
              x="80"
              y="68"
              textAnchor="middle"
              className="fill-textSubtle text-[9px]"
            >
              Most broad
            </text>

            <rect
              x="160"
              y="30"
              width="120"
              height="50"
              rx="4"
              className="fill-pace-purple/20 stroke-pace-purple"
              strokeWidth="2"
            />
            <text
              x="220"
              y="50"
              textAnchor="middle"
              className="fill-pace-purple text-[11px] font-semibold"
            >
              Property
            </text>
            <text
              x="220"
              y="68"
              textAnchor="middle"
              className="fill-textSubtle text-[9px]"
            >
              Common unit
            </text>

            <rect
              x="300"
              y="30"
              width="120"
              height="50"
              rx="4"
              className="fill-volt-green/20 stroke-volt-green"
              strokeWidth="2"
            />
            <text
              x="360"
              y="50"
              textAnchor="middle"
              className="fill-volt-green text-[11px] font-semibold"
            >
              Variant
            </text>
            <text
              x="360"
              y="68"
              textAnchor="middle"
              className="fill-textSubtle text-[9px]"
            >
              Modifier
            </text>

            <rect
              x="440"
              y="30"
              width="120"
              height="50"
              rx="4"
              className="fill-tech-cyan/20 stroke-tech-cyan"
              strokeWidth="2"
            />
            <text
              x="500"
              y="50"
              textAnchor="middle"
              className="fill-tech-cyan text-[11px] font-semibold"
            >
              State
            </text>
            <text
              x="500"
              y="68"
              textAnchor="middle"
              className="fill-textSubtle text-[9px]"
            >
              Most specific
            </text>

            {/* Arrow */}
            <path
              d="M80 90 L500 90"
              className="stroke-asphalt-50"
              strokeWidth="2"
              markerEnd="url(#arrowhead2)"
            />
            <text
              x="290"
              y="98"
              textAnchor="middle"
              className="fill-textSubtler text-[8px]"
            >
              Increasingly specific
            </text>

            <defs>
              <marker
                id="arrowhead2"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-asphalt-50"
                />
              </marker>
            </defs>
          </svg>
        </div>

        <h3
          id="naming-examples"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Examples
        </h3>

        <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderDefault bg-neutralBgSubtle dark:bg-[#1A1816]">
                <th className="text-left py-3 px-4 font-semibold">Token</th>
                <th className="text-left py-3 px-4 font-semibold">Breakdown</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">color-textDefault</td>
                <td className="py-3 px-4 font-sans text-textSubtle">
                  <span className="text-electric-pink">color</span> +{" "}
                  <span className="text-pace-purple">text</span> +{" "}
                  <span className="text-volt-green">default</span>
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">color-borderDefaultHover</td>
                <td className="py-3 px-4 font-sans text-textSubtle">
                  <span className="text-electric-pink">color</span> +{" "}
                  <span className="text-pace-purple">border</span> +{" "}
                  <span className="text-volt-green">default</span> +{" "}
                  <span className="text-tech-cyan">hover</span>
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">color-electric-pink-55</td>
                <td className="py-3 px-4 font-sans text-textSubtle">
                  <span className="text-electric-pink">color</span> +{" "}
                  <span className="text-pace-purple">electric-pink</span> +{" "}
                  <span className="text-volt-green">55</span> (lightness)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">spacing-4</td>
                <td className="py-3 px-4 font-sans text-textSubtle">
                  <span className="text-electric-pink">spacing</span> +{" "}
                  <span className="text-volt-green">4</span> (scale step)
                </td>
              </tr>
            </tbody>
          </table>
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
          <div className="bg-success-bg-subtle border border-success-border rounded-lg p-4">
            <p className="text-sm font-semibold text-success-text mb-2">Do</p>
            <code className="text-xs font-mono">
              color: var(--color-textDefault);
            </code>
          </div>
          <div className="bg-error-bg-subtle border border-error-border rounded-lg p-4">
            <p className="text-sm font-semibold text-error-text mb-2">
              Don&apos;t
            </p>
            <code className="text-xs font-mono">color: #1A1A1A;</code>
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
          <div className="bg-success-bg-subtle border border-success-border rounded-lg p-4">
            <p className="text-sm font-semibold text-success-text mb-2">Do</p>
            <code className="text-xs font-mono">
              background: var(--color-surface);
            </code>
          </div>
          <div className="bg-error-bg-subtle border border-error-border rounded-lg p-4">
            <p className="text-sm font-semibold text-error-text mb-2">
              Don&apos;t
            </p>
            <code className="text-xs font-mono">
              background: var(--color-asphalt-95);
            </code>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        <h3
          id="component-tokens-usage"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Use component tokens for their component
        </h3>
        <p className="text-base text-textSubtle max-w-3xl mb-6">
          When building components, use component-specific tokens. This ensures
          that as a component&apos;s design evolves, you won&apos;t have to
          retrace higher-level design decisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-success-bg-subtle border border-success-border rounded-lg p-4">
            <p className="text-sm font-semibold text-success-text mb-2">Do</p>
            <code className="text-xs font-mono">
              height: var(--button-height-md);
            </code>
          </div>
          <div className="bg-error-bg-subtle border border-error-border rounded-lg p-4">
            <p className="text-sm font-semibold text-error-text mb-2">
              Don&apos;t
            </p>
            <code className="text-xs font-mono">
              height: var(--input-height-md);
            </code>
            <p className="text-[10px] text-error-text-subtle mt-1">
              (using input token for button)
            </p>
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

      <hr className="border-t border-borderDefault" />

      {/* Resources */}
      <section>
        <h2
          id="resources"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Resources
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="space-y-4">
          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Token definitions</h4>
            <p className="text-sm text-textSubtle mb-2">
              The source of truth for all design token values.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              src/styles/design-tokens.ts
            </code>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">Tailwind configuration</h4>
            <p className="text-sm text-textSubtle mb-2">
              Token mappings to Tailwind utility classes.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              tailwind.config.js
            </code>
          </div>

          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg border border-borderDefault p-6">
            <h4 className="font-semibold mb-2">CSS variables</h4>
            <p className="text-sm text-textSubtle mb-2">
              Generated CSS custom properties for runtime theming.
            </p>
            <code className="text-xs font-mono text-electric-pink">
              src/styles/globals.css
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function GridSpacing() {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Grid</p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-4"
          id="grid-spacing"
        >
          Grid spacing
        </h1>
        <p className="text-base text-textSubtle max-w-3xl">
          Consistent spacing creates visual rhythm and hierarchy. Our grid
          spacing system uses two core values—gap and gutter—that scale
          responsively across screen sizes.
        </p>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Gap and Gutter Section */}
      <section>
        <h2
          id="gap-and-gutter"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Gap and gutter
        </h2>

        {/* Grid Gap */}
        <div className="mb-12">
          <h3
            id="grid-gap"
            className="font-serif text-[24px] leading-[1.3] font-medium mb-3 scroll-mt-32"
          >
            Grid gap
          </h3>
          <p className="text-base text-textSubtle mb-6 max-w-3xl">
            Grid gap is the standard spacing between elements. This creates
            consistent rhythm throughout the interface.
          </p>

          {/* Gap Visual Example */}
          <div className="mb-8 p-8 bg-canvas dark:bg-[#1A1816] border border-borderSubtle rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-electric-pink rounded flex items-center justify-center text-white text-sm font-medium">
                Element
              </div>
              <div className="h-20 bg-electric-pink rounded flex items-center justify-center text-white text-sm font-medium">
                Element
              </div>
              <div className="h-20 bg-electric-pink rounded flex items-center justify-center text-white text-sm font-medium">
                Element
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-0.5 bg-asphalt-40"></div>
              <span className="text-xs font-mono text-textSubtle">16px gap</span>
              <div className="flex-1 h-0.5 bg-asphalt-40"></div>
            </div>
          </div>

          {/* Gap Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-borderDefault">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Breakpoint
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    px
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    rem
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Tailwind
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Token
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-borderSubtle">
                  <td className="py-3 px-4 text-sm">All screens</td>
                  <td className="py-3 px-4 text-sm font-mono">16</td>
                  <td className="py-3 px-4 text-sm font-mono">1</td>
                  <td className="py-3 px-4 text-sm font-mono">gap-4</td>
                  <td className="py-3 px-4 text-sm font-mono">
                    --grid-gap
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Grid Gutter */}
        <div className="mb-12">
          <h3
            id="grid-gutter"
            className="font-serif text-[24px] leading-[1.3] font-medium mb-3 scroll-mt-32"
          >
            Grid gutter
          </h3>
          <p className="text-base text-textSubtle mb-6 max-w-3xl">
            Grid gutter is the space between grid columns, 2× the value of the
            gap. This creates clear separation between major content areas.
          </p>

          {/* Gutter Visual Example */}
          <div className="mb-8 p-8 bg-canvas dark:bg-[#1A1816] border border-borderSubtle rounded-lg">
            <div className="grid grid-cols-2 gap-8">
              <div className="h-32 bg-pace-purple rounded flex items-center justify-center text-white text-sm font-medium">
                Column
              </div>
              <div className="h-32 bg-pace-purple rounded flex items-center justify-center text-white text-sm font-medium">
                Column
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-0.5 bg-asphalt-40"></div>
              <span className="text-xs font-mono text-textSubtle">
                32px gutter
              </span>
              <div className="flex-1 h-0.5 bg-asphalt-40"></div>
            </div>
          </div>

          {/* Gutter Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-borderDefault">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Breakpoint
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    px
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    rem
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Tailwind
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Token
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-borderSubtle">
                  <td className="py-3 px-4 text-sm">All screens</td>
                  <td className="py-3 px-4 text-sm font-mono">32</td>
                  <td className="py-3 px-4 text-sm font-mono">2</td>
                  <td className="py-3 px-4 text-sm font-mono">gap-8</td>
                  <td className="py-3 px-4 text-sm font-mono">
                    --grid-gutter
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Usage Examples Section */}
      <section>
        <h2
          id="usage-examples"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Usage examples
        </h2>

        <div className="space-y-8">
          {/* Component Spacing Example */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Component spacing</h3>
            <p className="text-sm text-textSubtle mb-4">
              Use <span className="font-mono text-sm">gap-4</span> (16px) for
              spacing between related elements within components.
            </p>
            <div className="p-6 bg-surface border border-borderSubtle rounded-lg">
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-canvas dark:bg-[#1A1816] rounded border border-borderSubtle">
                  <p className="text-sm font-medium">List item 1</p>
                </div>
                <div className="p-4 bg-canvas dark:bg-[#1A1816] rounded border border-borderSubtle">
                  <p className="text-sm font-medium">List item 2</p>
                </div>
                <div className="p-4 bg-canvas dark:bg-[#1A1816] rounded border border-borderSubtle">
                  <p className="text-sm font-medium">List item 3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column Spacing Example */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Column spacing</h3>
            <p className="text-sm text-textSubtle mb-4">
              Use <span className="font-mono text-sm">gap-8</span> (32px) for
              spacing between columns and major sections.
            </p>
            <div className="p-6 bg-surface border border-borderSubtle rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-canvas dark:bg-[#1A1816] rounded border border-borderSubtle">
                  <p className="text-sm font-medium mb-2">Column 1</p>
                  <p className="text-xs text-textSubtle">
                    Content area with gutter spacing
                  </p>
                </div>
                <div className="p-6 bg-canvas dark:bg-[#1A1816] rounded border border-borderSubtle">
                  <p className="text-sm font-medium mb-2">Column 2</p>
                  <p className="text-xs text-textSubtle">
                    Content area with gutter spacing
                  </p>
                </div>
                <div className="p-6 bg-canvas dark:bg-[#1A1816] rounded border border-borderSubtle">
                  <p className="text-sm font-medium mb-2">Column 3</p>
                  <p className="text-xs text-textSubtle">
                    Content area with gutter spacing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Reference Section */}
      <section>
        <h2
          id="reference"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Reference
        </h2>
        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Quick reference for implementing grid spacing in your code.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Token
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind Class
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  CSS Variable
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4 text-sm font-mono">gap</td>
                <td className="py-3 px-4 text-sm">16px / 1rem</td>
                <td className="py-3 px-4 text-sm font-mono">gap-4</td>
                <td className="py-3 px-4 text-sm font-mono">
                  var(--grid-gap)
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4 text-sm font-mono">gutter</td>
                <td className="py-3 px-4 text-sm">32px / 2rem</td>
                <td className="py-3 px-4 text-sm font-mono">gap-8</td>
                <td className="py-3 px-4 text-sm font-mono">
                  var(--grid-gutter)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

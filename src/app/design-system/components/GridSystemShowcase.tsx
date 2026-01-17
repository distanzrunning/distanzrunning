export default function GridSystemShowcase() {
  return (
    <div className="space-y-12">
      {/* Grid Overview */}
      <div
        className="rounded-lg p-6 border border-gray-400"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <h3 className="font-serif text-xl font-medium mb-4">
          12-Column Responsive Grid
        </h3>
        <p className="text-gray-900 mb-4">
          The Distanz grid system uses a 12-column layout - the industry
          standard that divides evenly into halves, thirds, quarters, and
          sixths. On mobile, it simplifies to 4 columns.
        </p>
        <div className="space-y-2 text-sm text-gray-900">
          <p>
            <strong className="text-gray-1000">Max Width:</strong> 1585px
          </p>
          <p>
            <strong className="text-gray-1000">Gap:</strong> 16px (gap-4)
          </p>
          <p>
            <strong className="text-gray-1000">Gutter:</strong> 32px (gap-8)
          </p>
          <p>
            <strong className="text-gray-1000">Columns:</strong> 4 (mobile) / 12
            (desktop 768px+)
          </p>
          <p>
            <strong className="text-gray-1000">Breakpoints:</strong> sm (640px),
            md (768px), lg (1024px), xl (1280px), 2xl (1536px)
          </p>
        </div>
      </div>

      {/* 12-Column Visual */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Full 12-Column Grid
        </h3>
        <p className="text-gray-900 mb-6">
          Each column is highlighted to show the grid structure.
        </p>

        <div className="grid grid-cols-12 gap-4 max-w-[1585px] mx-auto">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-electric-pink/20 border border-gray-400 rounded p-2 text-center"
            >
              <span className="text-xs font-mono text-gray-900">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common Grid Layouts */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Common Grid Layouts
        </h3>
        <p className="text-gray-900 mb-6">
          Standard patterns used throughout the site.
        </p>

        <div className="space-y-8">
          {/* 2 Column (6/6) */}
          <div>
            <p className="text-sm font-medium mb-3">Two Columns (6 + 6)</p>
            <div className="grid grid-cols-12 gap-4 max-w-[1585px] mx-auto">
              <div className="col-span-6 bg-volt-green/20 border border-volt-green rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-6</span>
              </div>
              <div className="col-span-6 bg-volt-green/20 border border-volt-green rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-6</span>
              </div>
            </div>
          </div>

          {/* 3 Column (4/4/4) */}
          <div>
            <p className="text-sm font-medium mb-3">
              Three Columns (4 + 4 + 4)
            </p>
            <div className="grid grid-cols-12 gap-4 max-w-[1585px] mx-auto">
              <div className="col-span-4 bg-pace-purple/20 border border-pace-purple rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-4</span>
              </div>
              <div className="col-span-4 bg-pace-purple/20 border border-pace-purple rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-4</span>
              </div>
              <div className="col-span-4 bg-pace-purple/20 border border-pace-purple rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-4</span>
              </div>
            </div>
          </div>

          {/* 4 Column (3/3/3/3) */}
          <div>
            <p className="text-sm font-medium mb-3">
              Four Columns (3 + 3 + 3 + 3)
            </p>
            <div className="grid grid-cols-12 gap-4 max-w-[1585px] mx-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="col-span-3 bg-tech-cyan/20 border border-tech-cyan rounded p-6 text-center"
                >
                  <span className="text-sm font-mono">col-span-3</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary + Secondary (8/4) */}
          <div>
            <p className="text-sm font-medium mb-3">
              Primary + Secondary (8 + 4)
            </p>
            <div className="grid grid-cols-12 gap-4 max-w-[1585px] mx-auto">
              <div className="col-span-8 bg-electric-pink/20 border border-electric-pink rounded p-6 text-center">
                <span className="text-sm font-mono">
                  col-span-8 (Main Content)
                </span>
              </div>
              <div className="col-span-4 bg-electric-pink/20 border border-electric-pink rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-4 (Sidebar)</span>
              </div>
            </div>
          </div>

          {/* Sidebar + Content (2/10) */}
          <div>
            <p className="text-sm font-medium mb-3">
              Sidebar + Content (2 + 10)
            </p>
            <div className="grid grid-cols-12 gap-4 max-w-[1585px] mx-auto">
              <div className="col-span-2 bg-volt-green/20 border border-volt-green rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-2</span>
              </div>
              <div className="col-span-10 bg-volt-green/20 border border-volt-green rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-10 (Content)</span>
              </div>
            </div>
          </div>

          {/* Centered Content (start-3/span-8) */}
          <div>
            <p className="text-sm font-medium mb-3">
              Centered Content (start-3, span-8)
            </p>
            <div className="grid grid-cols-12 gap-4 max-w-[1585px] mx-auto">
              <div className="col-start-3 col-span-8 bg-pace-purple/20 border border-pace-purple rounded p-6 text-center">
                <span className="text-sm font-mono">
                  col-start-3 col-span-8
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Grid Example */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Responsive Behavior
        </h3>
        <p className="text-gray-900 mb-6">
          Grid adapts across breakpoints for optimal layouts.
        </p>

        <div
          className="rounded-lg p-6 border border-gray-400"
          style={{ background: "var(--ds-gray-100)" }}
        >
          <p className="text-sm font-medium mb-4">Article Grid (Responsive)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="rounded-lg p-4 border border-gray-400"
              style={{ background: "var(--ds-background-100)" }}
            >
              <p className="text-sm text-gray-900">1 column (mobile)</p>
              <p className="text-xs text-gray-600 mt-1">2 columns (sm)</p>
              <p className="text-xs text-gray-600">3 columns (lg)</p>
            </div>
            <div
              className="rounded-lg p-4 border border-gray-400"
              style={{ background: "var(--ds-background-100)" }}
            >
              <p className="text-sm text-gray-900">Article Card</p>
            </div>
            <div
              className="rounded-lg p-4 border border-gray-400"
              style={{ background: "var(--ds-background-100)" }}
            >
              <p className="text-sm text-gray-900">Article Card</p>
            </div>
          </div>
          <pre
            className="mt-4 p-3 rounded text-xs overflow-x-auto"
            style={{ background: "var(--ds-background-100)" }}
          >
            <code>{`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>`}</code>
          </pre>
        </div>
      </div>

      {/* Container Widths */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Container Widths
        </h3>
        <p className="text-gray-900 mb-6">
          Standard max-width values for different content types.
        </p>

        <div className="space-y-4">
          <div
            className="rounded-lg p-4 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Full Grid</p>
                <code className="text-xs text-gray-600 font-mono">
                  max-w-[1585px]
                </code>
              </div>
              <span className="text-xs text-gray-900">1585px</span>
            </div>
          </div>

          <div
            className="rounded-lg p-4 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Content Container</p>
                <code className="text-xs text-gray-600 font-mono">
                  max-w-7xl
                </code>
              </div>
              <span className="text-xs text-gray-900">1280px</span>
            </div>
          </div>

          <div
            className="rounded-lg p-4 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Reading Width (Articles)</p>
                <code className="text-xs text-gray-600 font-mono">
                  max-w-4xl
                </code>
              </div>
              <span className="text-xs text-gray-900">896px</span>
            </div>
          </div>

          <div
            className="rounded-lg p-4 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Form Container</p>
                <code className="text-xs text-gray-600 font-mono">
                  max-w-md
                </code>
              </div>
              <span className="text-xs text-gray-900">448px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div
        className="rounded-lg p-6 border border-gray-400"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <h3 className="font-serif text-xl font-medium mb-4">
          Grid Usage Guidelines
        </h3>
        <div className="space-y-3 text-sm text-gray-900">
          <p>
            <strong className="text-gray-1000">12-Column Grid:</strong> Use for
            all page layouts - provides flexibility with halves, thirds,
            quarters, and sixths.
          </p>
          <p>
            <strong className="text-gray-1000">4-Column Mobile:</strong>{" "}
            Simplifies to 4 columns on screens below 768px.
          </p>
          <p>
            <strong className="text-gray-1000">Gap:</strong> Use gap-4 (16px)
            for element spacing within components.
          </p>
          <p>
            <strong className="text-gray-1000">Gutter:</strong> Use gap-8 (32px)
            for column spacing in grids.
          </p>
          <p>
            <strong className="text-gray-1000">Responsive:</strong> Always
            design mobile-first, then add breakpoints for larger screens.
          </p>
          <p>
            <strong className="text-gray-1000">Containers:</strong> Use
            max-w-[1585px] for main wrapper, max-w-7xl for general content.
          </p>
        </div>
      </div>
    </div>
  );
}

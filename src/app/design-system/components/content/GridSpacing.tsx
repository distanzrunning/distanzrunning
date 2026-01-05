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
          spacing system uses two core values—gap and gutter—that work together
          to create clear visual separation.
        </p>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Grid Gap Section */}
      <section>
        <h2
          id="grid-gap"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Grid gap
        </h2>
        <p className="text-base text-textSubtle mb-8 max-w-3xl">
          The gap is 16px (1rem). It is the standard spacing between related
          elements within a component or layout.
        </p>

        {/* Gap Label Diagram - shows spacing within a component */}
        <div className="mb-8">
          <svg
            viewBox="0 0 800 200"
            className="w-full max-w-3xl border border-borderSubtle rounded"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* Three boxes representing elements */}
            <rect x="50" y="60" width="200" height="80" fill="#e43c81" rx="4" />
            <rect
              x="266"
              y="60"
              width="200"
              height="80"
              fill="#e43c81"
              rx="4"
            />
            <rect
              x="482"
              y="60"
              width="200"
              height="80"
              fill="#e43c81"
              rx="4"
            />

            {/* Gap measurement lines */}
            <line
              x1="250"
              y1="30"
              x2="266"
              y2="30"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="250"
              y1="20"
              x2="250"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="266"
              y1="20"
              x2="266"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            {/* Gap label */}
            <text
              x="258"
              y="18"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              16px
            </text>

            {/* Second gap measurement */}
            <line
              x1="466"
              y1="30"
              x2="482"
              y2="30"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="466"
              y1="20"
              x2="466"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="482"
              y1="20"
              x2="482"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            <text
              x="474"
              y="18"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              16px
            </text>

            {/* Element labels */}
            <text
              x="150"
              y="105"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Element
            </text>
            <text
              x="366"
              y="105"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Element
            </text>
            <text
              x="582"
              y="105"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Element
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            Gap creates consistent spacing between elements in a row or column.
          </p>
        </div>

        {/* Gap Optical Alignment Diagram - shows vertical rhythm */}
        <div className="mb-8">
          <svg
            viewBox="0 0 400 320"
            className="w-full max-w-md border border-borderSubtle rounded"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* Stack of elements with gap */}
            <rect x="80" y="40" width="240" height="60" fill="#e43c81" rx="4" />
            <rect
              x="80"
              y="116"
              width="240"
              height="60"
              fill="#e43c81"
              rx="4"
            />
            <rect
              x="80"
              y="192"
              width="240"
              height="60"
              fill="#e43c81"
              rx="4"
            />

            {/* Gap measurement on right side */}
            <line
              x1="350"
              y1="100"
              x2="350"
              y2="116"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="340"
              y1="100"
              x2="360"
              y2="100"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="340"
              y1="116"
              x2="360"
              y2="116"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            <text
              x="370"
              y="112"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
            >
              16px
            </text>

            {/* Second gap measurement */}
            <line
              x1="350"
              y1="176"
              x2="350"
              y2="192"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="340"
              y1="176"
              x2="360"
              y2="176"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="340"
              y1="192"
              x2="360"
              y2="192"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            <text
              x="370"
              y="188"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
            >
              16px
            </text>

            {/* Element labels */}
            <text
              x="200"
              y="75"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Element
            </text>
            <text
              x="200"
              y="151"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Element
            </text>
            <text
              x="200"
              y="227"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Element
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            Vertical stacking uses the same 16px gap for consistent rhythm.
          </p>
        </div>

        {/* Gap Reference Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  CSS Variable
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4 text-sm font-mono">16px / 1rem</td>
                <td className="py-3 px-4 text-sm font-mono">gap-4</td>
                <td className="py-3 px-4 text-sm font-mono">var(--grid-gap)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Grid Gutter Section */}
      <section>
        <h2
          id="grid-gutter"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Grid gutter
        </h2>
        <p className="text-base text-textSubtle mb-8 max-w-3xl">
          The gutter is 32px (2rem). It is the space between columns in a grid
          layout, providing clear separation between major content areas.
        </p>

        {/* Gutter 2-Column Diagram */}
        <div className="mb-8">
          <svg
            viewBox="0 0 800 240"
            className="w-full max-w-3xl border border-borderSubtle rounded"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* Two columns */}
            <rect
              x="50"
              y="60"
              width="344"
              height="120"
              fill="#5E3FD1"
              rx="4"
            />
            <rect
              x="426"
              y="60"
              width="344"
              height="120"
              fill="#5E3FD1"
              rx="4"
            />

            {/* Gutter measurement */}
            <line
              x1="394"
              y1="30"
              x2="426"
              y2="30"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="394"
              y1="20"
              x2="394"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="426"
              y1="20"
              x2="426"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            <text
              x="410"
              y="18"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              32px
            </text>

            {/* Column labels */}
            <text
              x="222"
              y="125"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Column
            </text>
            <text
              x="598"
              y="125"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Column
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            Gutter provides clear separation between columns in a 2-column
            layout.
          </p>
        </div>

        {/* Gutter 3-Column Diagram */}
        <div className="mb-8">
          <svg
            viewBox="0 0 800 240"
            className="w-full max-w-3xl border border-borderSubtle rounded"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* Three columns */}
            <rect
              x="50"
              y="60"
              width="216"
              height="120"
              fill="#5E3FD1"
              rx="4"
            />
            <rect
              x="298"
              y="60"
              width="216"
              height="120"
              fill="#5E3FD1"
              rx="4"
            />
            <rect
              x="546"
              y="60"
              width="216"
              height="120"
              fill="#5E3FD1"
              rx="4"
            />

            {/* First gutter measurement */}
            <line
              x1="266"
              y1="30"
              x2="298"
              y2="30"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="266"
              y1="20"
              x2="266"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="298"
              y1="20"
              x2="298"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            <text
              x="282"
              y="18"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              32px
            </text>

            {/* Second gutter measurement */}
            <line
              x1="514"
              y1="30"
              x2="546"
              y2="30"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="514"
              y1="20"
              x2="514"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="546"
              y1="20"
              x2="546"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            <text
              x="530"
              y="18"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              32px
            </text>

            {/* Column labels */}
            <text
              x="158"
              y="125"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Column
            </text>
            <text
              x="406"
              y="125"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Column
            </text>
            <text
              x="654"
              y="125"
              fill="white"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              Column
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            The same 32px gutter applies consistently across multi-column
            layouts.
          </p>
        </div>

        {/* Component Gutter Diagram - showing gutter between components */}
        <div className="mb-8">
          <svg
            viewBox="0 0 800 280"
            className="w-full max-w-3xl border border-borderSubtle rounded"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* Two component blocks with internal elements */}
            {/* First component */}
            <g>
              <rect
                x="50"
                y="60"
                width="344"
                height="160"
                fill="none"
                stroke="#5E3FD1"
                strokeWidth="2"
                rx="4"
              />
              <rect
                x="70"
                y="80"
                width="304"
                height="40"
                fill="#5E3FD1"
                rx="2"
                opacity="0.3"
              />
              <rect
                x="70"
                y="128"
                width="304"
                height="40"
                fill="#5E3FD1"
                rx="2"
                opacity="0.3"
              />
              <rect
                x="70"
                y="176"
                width="304"
                height="24"
                fill="#5E3FD1"
                rx="2"
                opacity="0.3"
              />
            </g>

            {/* Second component */}
            <g>
              <rect
                x="426"
                y="60"
                width="344"
                height="160"
                fill="none"
                stroke="#5E3FD1"
                strokeWidth="2"
                rx="4"
              />
              <rect
                x="446"
                y="80"
                width="304"
                height="40"
                fill="#5E3FD1"
                rx="2"
                opacity="0.3"
              />
              <rect
                x="446"
                y="128"
                width="304"
                height="40"
                fill="#5E3FD1"
                rx="2"
                opacity="0.3"
              />
              <rect
                x="446"
                y="176"
                width="304"
                height="24"
                fill="#5E3FD1"
                rx="2"
                opacity="0.3"
              />
            </g>

            {/* Gutter measurement between components */}
            <line
              x1="394"
              y1="30"
              x2="426"
              y2="30"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="394"
              y1="20"
              x2="394"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="426"
              y1="20"
              x2="426"
              y2="40"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />

            <text
              x="410"
              y="18"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              32px
            </text>

            {/* Component labels */}
            <text
              x="222"
              y="250"
              fill="rgb(var(--color-textDefault))"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              Component
            </text>
            <text
              x="598"
              y="250"
              fill="rgb(var(--color-textDefault))"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              Component
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            Use gutter spacing between major components and content sections.
          </p>
        </div>

        {/* Gutter Reference Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  CSS Variable
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4 text-sm font-mono">32px / 2rem</td>
                <td className="py-3 px-4 text-sm font-mono">gap-8</td>
                <td className="py-3 px-4 text-sm font-mono">
                  var(--grid-gutter)
                </td>
              </tr>
            </tbody>
          </table>
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
            <h3 className="font-semibold text-lg mb-3">
              Using gap in components
            </h3>
            <p className="text-sm text-textSubtle mb-4 max-w-2xl">
              Use <span className="font-mono text-sm">gap-4</span> (16px) for
              spacing between related elements within components.
            </p>
            <div className="p-6 bg-canvas dark:bg-[#1A1816] border border-borderSubtle rounded-lg max-w-md">
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-white dark:bg-[#0D0D0D] rounded border border-borderSubtle">
                  <p className="text-sm font-medium">List item 1</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#0D0D0D] rounded border border-borderSubtle">
                  <p className="text-sm font-medium">List item 2</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#0D0D0D] rounded border border-borderSubtle">
                  <p className="text-sm font-medium">List item 3</p>
                </div>
              </div>
            </div>
            <pre className="mt-4 p-4 bg-asphalt-5 text-asphalt-95 rounded font-mono text-xs overflow-x-auto">
              {`<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>`}
            </pre>
          </div>

          {/* Column Spacing Example */}
          <div>
            <h3 className="font-semibold text-lg mb-3">
              Using gutter in layouts
            </h3>
            <p className="text-sm text-textSubtle mb-4 max-w-2xl">
              Use <span className="font-mono text-sm">gap-8</span> (32px) for
              spacing between columns and major sections.
            </p>
            <div className="p-6 bg-canvas dark:bg-[#1A1816] border border-borderSubtle rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white dark:bg-[#0D0D0D] rounded border border-borderSubtle">
                  <p className="text-sm font-medium mb-2">Column 1</p>
                  <p className="text-xs text-textSubtle">
                    Content area with gutter spacing
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D0D] rounded border border-borderSubtle">
                  <p className="text-sm font-medium mb-2">Column 2</p>
                  <p className="text-xs text-textSubtle">
                    Content area with gutter spacing
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D0D] rounded border border-borderSubtle">
                  <p className="text-sm font-medium mb-2">Column 3</p>
                  <p className="text-xs text-textSubtle">
                    Content area with gutter spacing
                  </p>
                </div>
              </div>
            </div>
            <pre className="mt-4 p-4 bg-asphalt-5 text-asphalt-95 rounded font-mono text-xs overflow-x-auto">
              {`<div className="grid grid-cols-3 gap-8">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>`}
            </pre>
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
                <td className="py-3 px-4 text-sm font-medium">Gap</td>
                <td className="py-3 px-4 text-sm font-mono">16px / 1rem</td>
                <td className="py-3 px-4 text-sm font-mono">gap-4</td>
                <td className="py-3 px-4 text-sm font-mono">var(--grid-gap)</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4 text-sm font-medium">Gutter</td>
                <td className="py-3 px-4 text-sm font-mono">32px / 2rem</td>
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

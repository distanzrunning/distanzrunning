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

        {/* Gap Label Diagram - minimal label/input style */}
        <div className="mb-8">
          <svg
            viewBox="0 0 400 140"
            className="w-full max-w-md"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* First label/field pair with 12px gap */}
            <text
              x="50"
              y="35"
              fill="rgb(var(--color-textSubtle))"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
            >
              Label
            </text>
            <rect
              x="50"
              y="55"
              width="300"
              height="32"
              fill="none"
              stroke="rgb(var(--color-borderDefault))"
              strokeWidth="1"
              rx="4"
            />
            <text
              x="58"
              y="77"
              fill="rgb(var(--color-textSubtle))"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
            >
              Text value
            </text>

            {/* Gap measurement for first pair */}
            <line
              x1="32"
              y1="43"
              x2="32"
              y2="55"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="28"
              y1="43"
              x2="36"
              y2="43"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="28"
              y1="55"
              x2="36"
              y2="55"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <text
              x="32"
              y="52"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="end"
              dx="-8"
            >
              12
            </text>
          </svg>
        </div>

        {/* Gap Optical Diagram - showing link with measurements */}
        <div className="mb-8">
          <svg
            viewBox="0 0 400 100"
            className="w-full max-w-md"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* First link with optical spacing */}
            <text
              x="120"
              y="30"
              fill="#008CB8"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              textDecoration="underline"
            >
              Emphasised link
            </text>
            <line
              x1="100"
              y1="35"
              x2="100"
              y2="43"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="96"
              y1="35"
              x2="104"
              y2="35"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="96"
              y1="43"
              x2="104"
              y2="43"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <text
              x="100"
              y="42"
              fill="rgb(var(--color-textDefault))"
              fontSize="11"
              fontFamily="var(--font-family-sans)"
              textAnchor="end"
              dx="-8"
            >
              12
            </text>
            <line
              x1="250"
              y1="26"
              x2="258"
              y2="26"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="254"
              y1="22"
              x2="254"
              y2="30"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <text
              x="262"
              y="30"
              fill="rgb(var(--color-textDefault))"
              fontSize="11"
              fontFamily="var(--font-family-sans)"
            >
              8
            </text>

            {/* Second link */}
            <text
              x="120"
              y="70"
              fill="#008CB8"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              textDecoration="underline"
            >
              Emphasised link
            </text>
            <line
              x1="100"
              y1="75"
              x2="100"
              y2="83"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="96"
              y1="75"
              x2="104"
              y2="75"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="96"
              y1="83"
              x2="104"
              y2="83"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <text
              x="100"
              y="82"
              fill="rgb(var(--color-textDefault))"
              fontSize="11"
              fontFamily="var(--font-family-sans)"
              textAnchor="end"
              dx="-8"
            >
              16
            </text>
            <line
              x1="250"
              y1="66"
              x2="262"
              y2="66"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="256"
              y1="62"
              x2="256"
              y2="70"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <text
              x="266"
              y="70"
              fill="rgb(var(--color-textDefault))"
              fontSize="11"
              fontFamily="var(--font-family-sans)"
            >
              12
            </text>
          </svg>
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

        {/* Medium Screen Gutter - 6 columns with 24px gutters (abstract visualization) */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4">
            Medium screens (6 columns, 24px gutter)
          </h3>
          <svg
            viewBox="0 0 700 200"
            className="w-full border border-borderSubtle"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* 6 columns - alternating white (gutter) and grey (column) */}
            <rect x="0" y="0" width="700" height="200" fill="#E5E5E5" />
            <rect x="24" y="0" width="90" height="200" fill="white" />
            <rect x="138" y="0" width="90" height="200" fill="white" />
            <rect x="252" y="0" width="90" height="200" fill="white" />
            <rect x="366" y="0" width="90" height="200" fill="white" />
            <rect x="480" y="0" width="90" height="200" fill="white" />
            <rect x="594" y="0" width="90" height="200" fill="white" />

            {/* Gutter measurement */}
            <line
              x1="0"
              y1="170"
              x2="24"
              y2="170"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="165"
              x2="0"
              y2="175"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="24"
              y1="165"
              x2="24"
              y2="175"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <text
              x="12"
              y="190"
              fill="rgb(var(--color-textDefault))"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              24
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            Grey areas represent columns, white spaces are 24px gutters between
            them.
          </p>
        </div>

        {/* Large Screen Gutter - 6 columns with 32px gutters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4">
            Large screens (6 columns, 32px gutter)
          </h3>
          <svg
            viewBox="0 0 800 200"
            className="w-full border border-borderSubtle"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* 6 columns - wider gutters */}
            <rect x="0" y="0" width="800" height="200" fill="#E5E5E5" />
            <rect x="32" y="0" width="100" height="200" fill="white" />
            <rect x="164" y="0" width="100" height="200" fill="white" />
            <rect x="296" y="0" width="100" height="200" fill="white" />
            <rect x="428" y="0" width="100" height="200" fill="white" />
            <rect x="560" y="0" width="100" height="200" fill="white" />
            <rect x="692" y="0" width="100" height="200" fill="white" />

            {/* Gutter measurement */}
            <line
              x1="0"
              y1="170"
              x2="32"
              y2="170"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="165"
              x2="0"
              y2="175"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <line
              x1="32"
              y1="165"
              x2="32"
              y2="175"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="2"
            />
            <text
              x="16"
              y="190"
              fill="rgb(var(--color-textDefault))"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              fontWeight="500"
              textAnchor="middle"
            >
              32
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            Larger screens use 32px gutters for better visual separation.
          </p>
        </div>

        {/* Component Gutter - buttons with spacing */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4">Component gutters</h3>
          <svg
            viewBox="0 0 400 100"
            className="w-full max-w-md"
            style={{ backgroundColor: "rgb(var(--color-canvas))" }}
          >
            {/* First button */}
            <rect
              x="70"
              y="30"
              width="100"
              height="40"
              fill="none"
              stroke="#008CB8"
              strokeWidth="2"
              rx="4"
            />
            <text
              x="120"
              y="55"
              fill="#008CB8"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              Button
            </text>

            {/* Measurement to first button */}
            <line
              x1="50"
              y1="50"
              x2="70"
              y2="50"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="50"
              y1="46"
              x2="50"
              y2="54"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="70"
              y1="46"
              x2="70"
              y2="54"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <text
              x="60"
              y="45"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              24
            </text>

            {/* Second button */}
            <rect
              x="234"
              y="30"
              width="100"
              height="40"
              fill="none"
              stroke="#008CB8"
              strokeWidth="2"
              rx="4"
            />
            <text
              x="284"
              y="55"
              fill="#008CB8"
              fontSize="14"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              Button
            </text>

            {/* Measurement between buttons */}
            <line
              x1="170"
              y1="50"
              x2="234"
              y2="50"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="170"
              y1="46"
              x2="170"
              y2="54"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <line
              x1="234"
              y1="46"
              x2="234"
              y2="54"
              stroke="rgb(var(--color-textDefault))"
              strokeWidth="1.5"
            />
            <text
              x="202"
              y="45"
              fill="rgb(var(--color-textDefault))"
              fontSize="12"
              fontFamily="var(--font-family-sans)"
              textAnchor="middle"
            >
              32
            </text>
          </svg>
          <p className="text-sm text-textSubtle mt-4">
            Use 24px or 32px spacing between components depending on the visual
            hierarchy needed.
          </p>
        </div>

        {/* Gutter Reference Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Breakpoint
                </th>
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
                <td className="py-3 px-4 text-sm">Medium (768px+)</td>
                <td className="py-3 px-4 text-sm font-mono">24px / 1.5rem</td>
                <td className="py-3 px-4 text-sm font-mono">gap-6</td>
                <td className="py-3 px-4 text-sm font-mono">
                  var(--grid-gutter-md)
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4 text-sm">Large (1024px+)</td>
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
                <td className="py-3 px-4 text-sm font-medium">
                  Gutter (Medium)
                </td>
                <td className="py-3 px-4 text-sm font-mono">24px / 1.5rem</td>
                <td className="py-3 px-4 text-sm font-mono">gap-6</td>
                <td className="py-3 px-4 text-sm font-mono">
                  var(--grid-gutter-md)
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4 text-sm font-medium">
                  Gutter (Large)
                </td>
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

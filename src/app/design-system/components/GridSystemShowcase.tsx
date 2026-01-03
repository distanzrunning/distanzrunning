export default function GridSystemShowcase() {
  return (
    <div className="space-y-12">
      {/* Grid Overview */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">18-Column Responsive Grid</h3>
        <p className="text-textSubtle mb-4">
          The Distanz Running grid system uses an 18-column layout based on Tailwind's grid utilities. This provides more flexibility than the traditional 12-column grid while maintaining consistency.
        </p>
        <div className="space-y-2 text-sm text-textSubtle">
          <p><strong className="text-textDefault">Max Width:</strong> 1585px (18 columns × 73px + 17 gaps × 16px)</p>
          <p><strong className="text-textDefault">Gutter:</strong> 16px (gap-4)</p>
          <p><strong className="text-textDefault">Column Width:</strong> ~73px (calculated)</p>
          <p><strong className="text-textDefault">Breakpoints:</strong> sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)</p>
        </div>
      </div>

      {/* 18-Column Visual */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Full 18-Column Grid</h3>
        <p className="text-textSubtle mb-6">Each column is highlighted to show the grid structure.</p>

        <div className="grid grid-cols-18 gap-4 max-w-[1585px] mx-auto">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="bg-electric-pink/20 border border-neutral-400 dark:border-neutral-500 rounded p-2 text-center">
              <span className="text-xs font-mono text-textSubtle">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common Grid Layouts */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Common Grid Layouts</h3>
        <p className="text-textSubtle mb-6">Standard patterns used throughout the site.</p>

        <div className="space-y-8">
          {/* 2 Column (9/9) */}
          <div>
            <p className="text-sm font-medium mb-3">Two Columns (9 + 9)</p>
            <div className="grid grid-cols-18 gap-4 max-w-[1585px] mx-auto">
              <div className="col-span-9 bg-volt-green/20 border border-volt-green rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-9</span>
              </div>
              <div className="col-span-9 bg-volt-green/20 border border-volt-green rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-9</span>
              </div>
            </div>
          </div>

          {/* 3 Column (6/6/6) */}
          <div>
            <p className="text-sm font-medium mb-3">Three Columns (6 + 6 + 6)</p>
            <div className="grid grid-cols-18 gap-4 max-w-[1585px] mx-auto">
              <div className="col-span-6 bg-deep-purple/20 border border-deep-purple rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-6</span>
              </div>
              <div className="col-span-6 bg-deep-purple/20 border border-deep-purple rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-6</span>
              </div>
              <div className="col-span-6 bg-deep-purple/20 border border-deep-purple rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-6</span>
              </div>
            </div>
          </div>

          {/* Asymmetric (12/6) */}
          <div>
            <p className="text-sm font-medium mb-3">Asymmetric Layout (12 + 6)</p>
            <div className="grid grid-cols-18 gap-4 max-w-[1585px] mx-auto">
              <div className="col-span-12 bg-signal-orange/20 border border-signal-orange rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-12 (Main Content)</span>
              </div>
              <div className="col-span-6 bg-signal-orange/20 border border-signal-orange rounded p-6 text-center">
                <span className="text-sm font-mono">col-span-6 (Sidebar)</span>
              </div>
            </div>
          </div>

          {/* 6 Column Grid */}
          <div>
            <p className="text-sm font-medium mb-3">Six Columns (3 + 3 + 3 + 3 + 3 + 3)</p>
            <div className="grid grid-cols-18 gap-4 max-w-[1585px] mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-span-3 bg-pace-purple/20 border border-pace-purple rounded p-6 text-center">
                  <span className="text-sm font-mono">col-span-3</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Grid Example */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Responsive Behavior</h3>
        <p className="text-textSubtle mb-6">Grid adapts across breakpoints for optimal layouts.</p>

        <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
          <p className="text-sm font-medium mb-4">Article Grid (Responsive)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg p-4 border border-borderNeutral">
              <p className="text-sm text-textSubtle">1 column (mobile)</p>
              <p className="text-xs text-textSubtler mt-1">2 columns (sm)</p>
              <p className="text-xs text-textSubtler">3 columns (lg)</p>
            </div>
            <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg p-4 border border-borderNeutral">
              <p className="text-sm text-textSubtle">Article Card</p>
            </div>
            <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg p-4 border border-borderNeutral">
              <p className="text-sm text-textSubtle">Article Card</p>
            </div>
          </div>
          <pre className="mt-4 p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
            <code>{`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>`}</code>
          </pre>
        </div>
      </div>

      {/* Container Widths */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Container Widths</h3>
        <p className="text-textSubtle mb-6">Standard max-width values for different content types.</p>

        <div className="space-y-4">
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-4 border border-borderNeutral">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Full Grid</p>
                <code className="text-xs text-textSubtler font-mono">max-w-[1585px]</code>
              </div>
              <span className="text-xs text-textSubtle">1585px</span>
            </div>
          </div>

          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-4 border border-borderNeutral">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Content Container</p>
                <code className="text-xs text-textSubtler font-mono">max-w-7xl</code>
              </div>
              <span className="text-xs text-textSubtle">1280px</span>
            </div>
          </div>

          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-4 border border-borderNeutral">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Reading Width (Feature Articles)</p>
                <code className="text-xs text-textSubtler font-mono">max-w-4xl</code>
              </div>
              <span className="text-xs text-textSubtle">896px</span>
            </div>
          </div>

          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-4 border border-borderNeutral">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Form Container</p>
                <code className="text-xs text-textSubtler font-mono">max-w-md</code>
              </div>
              <span className="text-xs text-textSubtle">448px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">Grid Usage Guidelines</h3>
        <div className="space-y-3 text-sm text-textSubtle">
          <p><strong className="text-textDefault">18-Column Grid:</strong> Use for complex layouts requiring fine-grained control (e.g., homepage, category pages).</p>
          <p><strong className="text-textDefault">12/6 Grids:</strong> Use Tailwind's standard grid-cols-{'{n}'} for simpler responsive layouts.</p>
          <p><strong className="text-textDefault">Gutters:</strong> Maintain consistent gap-4 (16px) or gap-6 (24px) for visual rhythm.</p>
          <p><strong className="text-textDefault">Responsive:</strong> Always design mobile-first, then add breakpoints for larger screens.</p>
          <p><strong className="text-textDefault">Containers:</strong> Use max-w-[1585px] for main grid, max-w-7xl for general content, max-w-4xl for reading content.</p>
        </div>
      </div>
    </div>
  );
}

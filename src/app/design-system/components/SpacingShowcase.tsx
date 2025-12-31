'use client';

import { spacing } from '@/styles/design-tokens';

interface SpacingItemProps {
  name: string;
  value: string;
  pixelValue: string;
}

function SpacingItem({ name, value, pixelValue }: SpacingItemProps) {
  return (
    <div className="flex items-center gap-6 py-4 border-b border-borderNeutralSubtle last:border-b-0">
      <div className="w-24 flex-shrink-0">
        <p className="font-mono text-sm font-medium">{name}</p>
        <p className="text-xs text-textSubtle">{value}</p>
        <p className="text-xs text-textSubtler">{pixelValue}</p>
      </div>

      <div className="flex-1">
        <div
          className="bg-electric-pink h-8 rounded transition-all"
          style={{ width: value }}
        />
      </div>
    </div>
  );
}

export default function SpacingShowcase() {
  const spacingEntries = Object.entries(spacing);

  return (
    <div className="space-y-12">
      {/* Spacing Scale */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-6">Spacing Scale</h3>
        <p className="text-textSubtle mb-6 text-sm">
          Base unit: 8px (0.5rem). All spacing follows this scale for consistency.
        </p>

        <div className="space-y-1">
          {spacingEntries.map(([key, value]) => {
            // Convert rem to pixels for display
            const remValue = parseFloat(value);
            const pixels = remValue * 16;

            return (
              <SpacingItem
                key={key}
                name={key}
                value={value}
                pixelValue={`${pixels}px`}
              />
            );
          })}
        </div>
      </div>

      {/* Spacing Examples */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Spacing in Practice</h3>

        <div className="space-y-8">
          {/* Button Padding Example */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Button Padding</h4>
            <p className="text-textSubtle text-sm mb-6">
              Vertical: 12px (0.75rem), Horizontal: 24px (1.5rem)
            </p>
            <button className="px-6 py-3 bg-electric-pink text-white rounded-md font-medium hover:bg-opacity-90 transition-colors">
              Primary Button
            </button>
          </div>

          {/* Card Padding Example */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Card Padding</h4>
            <p className="text-textSubtle text-sm mb-6">
              All sides: 24px (1.5rem)
            </p>
            <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg p-6 border border-borderNeutralSubtle">
              <h5 className="font-semibold mb-2">Card Title</h5>
              <p className="text-textSubtle text-sm">
                This card demonstrates the standard 24px padding used throughout the application.
              </p>
            </div>
          </div>

          {/* Vertical Rhythm Example */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Vertical Rhythm</h4>
            <p className="text-textSubtle text-sm mb-6">
              Consistent spacing between elements creates visual harmony
            </p>
            <div className="space-y-4">
              <div className="bg-canvas dark:bg-[#0a0a0a] p-4 rounded border border-borderNeutralSubtle">
                <p className="text-sm">16px gap (space-y-4)</p>
              </div>
              <div className="bg-canvas dark:bg-[#0a0a0a] p-4 rounded border border-borderNeutralSubtle">
                <p className="text-sm">16px gap (space-y-4)</p>
              </div>
              <div className="bg-canvas dark:bg-[#0a0a0a] p-4 rounded border border-borderNeutralSubtle">
                <p className="text-sm">16px gap (space-y-4)</p>
              </div>
            </div>
          </div>

          {/* Section Spacing Example */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Section Spacing</h4>
            <p className="text-textSubtle text-sm mb-6">
              Major sections use 48px-64px spacing for clear visual separation
            </p>
            <div className="space-y-12">
              <div className="bg-canvas dark:bg-[#0a0a0a] p-6 rounded border border-borderNeutralSubtle">
                <h5 className="font-semibold mb-2">Section 1</h5>
                <p className="text-textSubtle text-sm">48px gap below (space-y-12)</p>
              </div>
              <div className="bg-canvas dark:bg-[#0a0a0a] p-6 rounded border border-borderNeutralSubtle">
                <h5 className="font-semibold mb-2">Section 2</h5>
                <p className="text-textSubtle text-sm">48px gap below (space-y-12)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Patterns */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Common Spacing Patterns</h3>
        <div className="space-y-3">
          <div className="flex items-baseline gap-4 text-sm">
            <code className="font-mono text-electric-pink w-32">space-y-2</code>
            <span className="text-textSubtle">8px - Tight list items</span>
          </div>
          <div className="flex items-baseline gap-4 text-sm">
            <code className="font-mono text-electric-pink w-32">space-y-4</code>
            <span className="text-textSubtle">16px - Standard paragraphs</span>
          </div>
          <div className="flex items-baseline gap-4 text-sm">
            <code className="font-mono text-electric-pink w-32">space-y-6</code>
            <span className="text-textSubtle">24px - Form fields</span>
          </div>
          <div className="flex items-baseline gap-4 text-sm">
            <code className="font-mono text-electric-pink w-32">space-y-8</code>
            <span className="text-textSubtle">32px - Card groups</span>
          </div>
          <div className="flex items-baseline gap-4 text-sm">
            <code className="font-mono text-electric-pink w-32">space-y-12</code>
            <span className="text-textSubtle">48px - Major sections</span>
          </div>
          <div className="flex items-baseline gap-4 text-sm">
            <code className="font-mono text-electric-pink w-32">space-y-16</code>
            <span className="text-textSubtle">64px - Page sections</span>
          </div>
        </div>
      </div>
    </div>
  );
}

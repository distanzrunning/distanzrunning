'use client';

import { colors } from '@/styles/design-tokens';
import { useState } from 'react';

interface ColorSwatchProps {
  name: string;
  value: string;
  category: string;
}

function ColorSwatch({ name, value, category }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group relative text-left transition-transform hover:scale-105 active:scale-95"
    >
      <div
        className="w-full h-32 rounded-lg shadow-sm border border-borderNeutralSubtle mb-3 transition-shadow group-hover:shadow-md"
        style={{ backgroundColor: value }}
      />
      <div className="space-y-1">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-textSubtle font-mono">{value}</p>
        <p className="text-xs text-textSubtler">{category}</p>
      </div>
      {copied && (
        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
          Copied!
        </div>
      )}
    </button>
  );
}

export default function ColorPalette() {
  return (
    <div className="space-y-8">
      {/* Brand Colors */}
      <div className="bg-neutralBgSubtle dark:bg-[#1a1a1a] p-6 rounded-lg border border-borderNeutralSubtle">
        <h3 className="text-xl font-semibold mb-4">Brand Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Object.entries(colors.brand).map(([key, value]) => (
            <ColorSwatch
              key={key}
              name={key.replace(/([A-Z])/g, ' $1').trim()}
              value={value}
              category="Brand"
            />
          ))}
        </div>
      </div>

      {/* Neutrals */}
      <div className="bg-neutralBgSubtle dark:bg-[#1a1a1a] p-6 rounded-lg border border-borderNeutralSubtle">
        <h3 className="text-xl font-semibold mb-4">Neutral Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Object.entries(colors.neutral).map(([key, value]) => (
            <ColorSwatch
              key={key}
              name={key.replace(/([A-Z])/g, ' $1').replace(/([0-9]+)/, ' $1').trim()}
              value={value}
              category="Neutral"
            />
          ))}
        </div>
      </div>

      {/* Semantic - Light Mode */}
      <div className="bg-neutralBgSubtle dark:bg-[#1a1a1a] p-6 rounded-lg border border-borderNeutralSubtle">
        <h3 className="text-xl font-semibold mb-4">Semantic Colors - Light Mode</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(colors.semantic.light).map(([key, value]) => {
            // Extract RGB values from string for display
            const rgbMatch = value.match(/rgb\((\d+,\s*\d+,\s*\d+)\)/);
            const hexValue = rgbMatch ? `rgb(${rgbMatch[1]})` : value;

            return (
              <ColorSwatch
                key={key}
                name={key.replace(/([A-Z])/g, ' $1').trim()}
                value={hexValue}
                category="Semantic/Light"
              />
            );
          })}
        </div>
      </div>

      {/* Semantic - Dark Mode */}
      <div className="bg-neutralBgSubtle dark:bg-[#1a1a1a] p-6 rounded-lg border border-borderNeutralSubtle">
        <h3 className="text-xl font-semibold mb-4">Semantic Colors - Dark Mode</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(colors.semantic.dark).map(([key, value]) => {
            const rgbMatch = value.match(/rgb\((\d+,\s*\d+,\s*\d+)\)/);
            const hexValue = rgbMatch ? `rgb(${rgbMatch[1]})` : value;

            return (
              <ColorSwatch
                key={key}
                name={key.replace(/([A-Z])/g, ' $1').trim()}
                value={hexValue}
                category="Semantic/Dark"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

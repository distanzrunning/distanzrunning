'use client';

import { useState } from 'react';

export default function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('option1');

  return (
    <div className="space-y-12">
      {/* Buttons */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Buttons</h3>
        <p className="text-textSubtle text-sm mb-6">
          Three button variants: Primary, Secondary, and Ghost
        </p>

        <div className="space-y-6">
          {/* Primary Button */}
          <div>
            <p className="text-sm font-medium mb-3">Primary Button</p>
            <button className="px-6 py-3 bg-electric-pink text-white rounded-md font-medium hover:bg-opacity-90 transition-colors">
              Primary Action
            </button>
            <pre className="mt-3 p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`<button className="px-6 py-3 bg-electric-pink text-white rounded-md font-medium hover:bg-opacity-90 transition-colors">
  Primary Action
</button>`}</code>
            </pre>
          </div>

          {/* Secondary Button */}
          <div>
            <p className="text-sm font-medium mb-3">Secondary Button</p>
            <button className="px-6 py-3 border-2 border-neutral-400 dark:border-neutral-500 text-electric-pink rounded-md font-medium hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-colors">
              Secondary Action
            </button>
            <pre className="mt-3 p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`<button className="px-6 py-3 border-2 border-neutral-400 dark:border-neutral-500 text-electric-pink rounded-md font-medium hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-colors">
  Secondary Action
</button>`}</code>
            </pre>
          </div>

          {/* Ghost Button */}
          <div>
            <p className="text-sm font-medium mb-3">Ghost Button</p>
            <button className="px-6 py-3 text-electric-pink font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
              Tertiary Action
            </button>
            <pre className="mt-3 p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`<button className="px-6 py-3 text-electric-pink font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
  Tertiary Action
</button>`}</code>
            </pre>
          </div>

          {/* Button Sizes */}
          <div>
            <p className="text-sm font-medium mb-3">Button Sizes</p>
            <div className="flex items-center gap-4 flex-wrap">
              <button className="px-4 py-2 bg-electric-pink text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors">
                Small
              </button>
              <button className="px-6 py-3 bg-electric-pink text-white rounded-md font-medium hover:bg-opacity-90 transition-colors">
                Medium
              </button>
              <button className="px-8 py-4 bg-electric-pink text-white rounded-md text-lg font-medium hover:bg-opacity-90 transition-colors">
                Large
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
        <p className="text-textSubtle text-sm mb-6">
          Input fields, textareas, and selects with consistent styling
        </p>

        <div className="space-y-6 max-w-md">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Text Input</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-borderNeutral rounded-md focus:border-neutral-400 dark:border-neutral-500 focus:ring-1 focus:ring-neutral-400 dark:ring-neutral-500 outline-none transition-colors bg-surface dark:bg-[#0c0c0d]"
              placeholder="Enter text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <pre className="mt-3 p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`<input
  type="text"
  className="w-full px-4 py-3 border border-borderNeutral rounded-md focus:border-neutral-400 dark:border-neutral-500 focus:ring-1 focus:ring-neutral-400 dark:ring-neutral-500 outline-none transition-colors"
  placeholder="Enter text..."
/>`}</code>
            </pre>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-sm font-medium mb-2">Textarea</label>
            <textarea
              className="w-full px-4 py-3 border border-borderNeutral rounded-md focus:border-neutral-400 dark:border-neutral-500 focus:ring-1 focus:ring-neutral-400 dark:ring-neutral-500 outline-none transition-colors resize-y bg-surface dark:bg-[#0c0c0d]"
              placeholder="Enter longer text..."
              rows={4}
            />
          </div>

          {/* Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Select</label>
            <select
              className="w-full px-4 py-3 border border-borderNeutral rounded-md focus:border-neutral-400 dark:border-neutral-500 focus:ring-1 focus:ring-neutral-400 dark:ring-neutral-500 outline-none transition-colors bg-surface dark:bg-[#0c0c0d]"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="checkbox-example"
              className="w-5 h-5 text-electric-pink border-borderNeutral rounded focus:ring-neutral-400 dark:ring-neutral-500 focus:ring-2"
            />
            <label htmlFor="checkbox-example" className="text-sm font-medium cursor-pointer">
              Checkbox label
            </label>
          </div>

          {/* Radio Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium mb-2">Radio Buttons</p>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="radio1"
                name="radio-group"
                className="w-5 h-5 text-electric-pink border-borderNeutral focus:ring-neutral-400 dark:ring-neutral-500 focus:ring-2"
              />
              <label htmlFor="radio1" className="text-sm cursor-pointer">
                Option 1
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="radio2"
                name="radio-group"
                className="w-5 h-5 text-electric-pink border-borderNeutral focus:ring-neutral-400 dark:ring-neutral-500 focus:ring-2"
              />
              <label htmlFor="radio2" className="text-sm cursor-pointer">
                Option 2
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Cards</h3>
        <p className="text-textSubtle text-sm mb-6">
          Article cards with hover effects
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Card */}
          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg overflow-hidden border border-borderNeutral hover:shadow-lg transition-shadow">
            <div className="w-full h-48 bg-gradient-to-br from-electric-pink to-pace-purple" />
            <div className="p-6">
              <p className="text-xs uppercase tracking-wide text-electric-pink font-medium mb-2">
                CATEGORY
              </p>
              <h4 className="font-bold text-xl mb-2">Article Title</h4>
              <p className="text-textSubtle text-sm mb-4">
                A brief description of the article content goes here.
              </p>
              <div className="flex items-center gap-2 text-xs text-textSubtler">
                <span>5 min read</span>
                <span>•</span>
                <span>Dec 31, 2025</span>
              </div>
            </div>
          </div>

          {/* Card with Image */}
          <div className="bg-canvas dark:bg-[#0a0a0a] rounded-lg overflow-hidden border border-borderNeutral hover:shadow-lg transition-shadow">
            <div className="w-full h-48 bg-gradient-to-br from-volt-green to-signal-orange" />
            <div className="p-6">
              <p className="text-xs uppercase tracking-wide text-volt-green font-medium mb-2">
                FEATURED
              </p>
              <h4 className="font-bold text-xl mb-2">Featured Article</h4>
              <p className="text-textSubtle text-sm mb-4">
                Another description showcasing the card design pattern.
              </p>
              <div className="flex items-center gap-2 text-xs text-textSubtler">
                <span>8 min read</span>
                <span>•</span>
                <span>Dec 30, 2025</span>
              </div>
            </div>
          </div>
        </div>

        <pre className="mt-6 p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
          <code>{`<div className="bg-surface rounded-lg overflow-hidden border border-borderNeutral hover:shadow-lg transition-shadow">
  <div className="w-full h-48 bg-gradient-to-br from-electric-pink to-pace-purple" />
  <div className="p-6">
    <p className="text-xs uppercase tracking-wide text-electric-pink font-medium mb-2">
      CATEGORY
    </p>
    <h4 className="font-bold text-xl mb-2">Article Title</h4>
    <p className="text-textSubtle text-sm">Description...</p>
  </div>
</div>`}</code>
        </pre>
      </div>

      {/* Badges & Tags */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Badges & Tags</h3>
        <p className="text-textSubtle text-sm mb-6">
          Category labels and status indicators
        </p>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-3">Category Tags</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-electric-pink text-white text-xs font-medium rounded-full">
                Running
              </span>
              <span className="px-3 py-1 bg-volt-green text-white text-xs font-medium rounded-full">
                Training
              </span>
              <span className="px-3 py-1 bg-pace-purple text-white text-xs font-medium rounded-full">
                Nutrition
              </span>
              <span className="px-3 py-1 bg-signal-orange text-white text-xs font-medium rounded-full">
                Racing
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Outlined Tags</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 border-2 border-neutral-400 dark:border-neutral-500 text-electric-pink text-xs font-medium rounded-full">
                Marathon
              </span>
              <span className="px-3 py-1 border-2 border-volt-green text-volt-green text-xs font-medium rounded-full">
                Trail
              </span>
              <span className="px-3 py-1 border-2 border-pace-purple text-pace-purple text-xs font-medium rounded-full">
                Ultra
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Subtle Tags</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-textDefault text-xs font-medium rounded-full">
                5K
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-textDefault text-xs font-medium rounded-full">
                10K
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-textDefault text-xs font-medium rounded-full">
                Half Marathon
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="text-lg font-semibold mb-4">Alerts & Messages</h3>
        <p className="text-textSubtle text-sm mb-6">
          Information, success, warning, and error states
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Info:</strong> This is an informational message.
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-900 dark:text-green-100">
              <strong>Success:</strong> Your action was completed successfully.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>Warning:</strong> Please review this before continuing.
            </p>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-900 dark:text-red-100">
              <strong>Error:</strong> Something went wrong. Please try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

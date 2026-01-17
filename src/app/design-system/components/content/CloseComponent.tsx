"use client";

import { useState } from "react";
import { X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";

export default function CloseComponent() {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <article className="space-y-10">
      {/* Header */}
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-medium text-gray-1000 mb-4">
          Close
        </h1>
        <p className="text-lg text-gray-900 max-w-2xl">
          A close control for dismissing modals, dialogs, drawers, and other
          overlay elements. Uses the IconButton component with an X icon for
          consistent styling.
        </p>
      </header>

      {/* Interactive Preview */}
      <section>
        <h2 className="font-display text-xl font-medium text-gray-1000 mb-4">
          Preview
        </h2>

        {/* Disabled Toggle */}
        <div className="mb-4">
          <label className="inline-flex items-center gap-2 text-sm text-gray-900 cursor-pointer">
            <input
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-400"
            />
            Disabled
          </label>
        </div>

        {/* Side by side: Default and Inverse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Default variant */}
          <div className="border border-gray-400 rounded-lg p-8 flex flex-col items-center gap-4 bg-white">
            <span className="text-sm text-gray-900 font-medium">Default</span>
            <IconButton
              aria-label="Close"
              variant="primary"
              disabled={isDisabled}
              ignoreDarkMode
            >
              <X className="w-5 h-5" />
            </IconButton>
          </div>

          {/* Inverse variant */}
          <div className="border border-gray-400 rounded-lg p-8 flex flex-col items-center gap-4 bg-asphalt-10">
            <span className="text-sm text-asphalt-70 font-medium">Inverse</span>
            <IconButton
              aria-label="Close"
              variant="primary"
              inverse
              disabled={isDisabled}
              ignoreDarkMode
            >
              <X className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="font-display text-xl font-medium text-gray-1000 mb-4">
          Usage
        </h2>
        <div className="bg-asphalt-95 dark:bg-asphalt-10 rounded-lg overflow-hidden">
          <pre className="p-4 text-sm overflow-x-auto">
            <code className="text-gray-1000">{`import { X } from "lucide-react";
import IconButton from "@/components/ui/IconButton";

// Default close button
<IconButton aria-label="Close" onClick={handleClose}>
  <X className="w-5 h-5" />
</IconButton>

// Inverse close button (for dark backgrounds)
<IconButton aria-label="Close" inverse onClick={handleClose}>
  <X className="w-5 h-5" />
</IconButton>

// Disabled state
<IconButton aria-label="Close" disabled>
  <X className="w-5 h-5" />
</IconButton>`}</code>
          </pre>
        </div>
      </section>

      {/* Props */}
      <section>
        <h2 className="font-display text-xl font-medium text-gray-1000 mb-4">
          Props
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-medium text-gray-1000">
                  Prop
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-1000">
                  Type
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-1000">
                  Default
                </th>
                <th className="text-left py-3 font-medium text-gray-1000">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              <tr className="border-b border-gray-400/50">
                <td className="py-3 pr-4 font-mono text-xs text-electric-pink">
                  aria-label
                </td>
                <td className="py-3 pr-4 font-mono text-xs">string</td>
                <td className="py-3 pr-4 font-mono text-xs">—</td>
                <td className="py-3">
                  Required. Accessible label (e.g., "Close", "Close dialog")
                </td>
              </tr>
              <tr className="border-b border-gray-400/50">
                <td className="py-3 pr-4 font-mono text-xs text-electric-pink">
                  inverse
                </td>
                <td className="py-3 pr-4 font-mono text-xs">boolean</td>
                <td className="py-3 pr-4 font-mono text-xs">false</td>
                <td className="py-3">
                  Use inverse colors for dark backgrounds
                </td>
              </tr>
              <tr className="border-b border-gray-400/50">
                <td className="py-3 pr-4 font-mono text-xs text-electric-pink">
                  disabled
                </td>
                <td className="py-3 pr-4 font-mono text-xs">boolean</td>
                <td className="py-3 pr-4 font-mono text-xs">false</td>
                <td className="py-3">Disable the button</td>
              </tr>
              <tr className="border-b border-gray-400/50">
                <td className="py-3 pr-4 font-mono text-xs text-electric-pink">
                  size
                </td>
                <td className="py-3 pr-4 font-mono text-xs">
                  "default" | "small"
                </td>
                <td className="py-3 pr-4 font-mono text-xs">"default"</td>
                <td className="py-3">Button size (40px or 32px)</td>
              </tr>
              <tr className="border-b border-gray-400/50">
                <td className="py-3 pr-4 font-mono text-xs text-electric-pink">
                  onClick
                </td>
                <td className="py-3 pr-4 font-mono text-xs">() =&gt; void</td>
                <td className="py-3 pr-4 font-mono text-xs">—</td>
                <td className="py-3">Click handler for close action</td>
              </tr>
              <tr className="border-b border-gray-400/50">
                <td className="py-3 pr-4 font-mono text-xs text-electric-pink">
                  className
                </td>
                <td className="py-3 pr-4 font-mono text-xs">string</td>
                <td className="py-3 pr-4 font-mono text-xs">""</td>
                <td className="py-3">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Guidelines */}
      <section>
        <h2 className="font-display text-xl font-medium text-gray-1000 mb-4">
          Guidelines
        </h2>
        <div className="space-y-4 text-gray-900">
          <div>
            <h3 className="font-medium text-gray-1000 mb-2">Accessibility</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Always provide a descriptive{" "}
                <code className="text-xs bg-asphalt-95 dark:bg-asphalt-20 px-1 py-0.5 rounded">
                  aria-label
                </code>{" "}
                (e.g., "Close dialog", "Close menu")
              </li>
              <li>
                The close button should be focusable and activated with Enter or
                Space
              </li>
              <li>
                Consider trapping focus within the modal and returning focus on
                close
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-1000 mb-2">Placement</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Position close buttons in the top-right corner of modals and
                dialogs
              </li>
              <li>
                Ensure adequate touch target size (minimum 40×40px on mobile)
              </li>
              <li>
                Maintain consistent positioning across all dismissible overlays
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-1000 mb-2">
              When to use inverse
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Use the inverse variant when the close button appears on dark
                backgrounds
              </li>
              <li>
                This is common in full-screen overlays, dark-themed modals, or
                image lightboxes
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="font-display text-xl font-medium text-gray-1000 mb-4">
          Common Patterns
        </h2>

        {/* Modal header example */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-1000">Modal Header</h3>
          <div className="border border-gray-400 rounded-lg overflow-hidden">
            <div className="bg-white p-4 flex items-center justify-between border-b border-gray-400">
              <h4 className="font-medium text-gray-1000">Modal Title</h4>
              <IconButton aria-label="Close modal" ignoreDarkMode>
                <X className="w-5 h-5" />
              </IconButton>
            </div>
            <div className="bg-asphalt-98 p-4 text-sm text-gray-900">
              Modal content goes here...
            </div>
          </div>
        </div>

        {/* Fullscreen overlay example */}
        <div className="space-y-4 mt-8">
          <h3 className="font-medium text-gray-1000">Fullscreen Overlay</h3>
          <div className="border border-gray-400 rounded-lg overflow-hidden">
            <div className="bg-asphalt-10 p-4 flex items-start justify-end min-h-[120px] relative">
              <IconButton aria-label="Close overlay" inverse ignoreDarkMode>
                <X className="w-5 h-5" />
              </IconButton>
              <span className="absolute inset-0 flex items-center justify-center text-asphalt-70 text-sm">
                Fullscreen content
              </span>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

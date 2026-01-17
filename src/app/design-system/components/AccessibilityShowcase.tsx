export default function AccessibilityShowcase() {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <div
        className="rounded-lg p-6 border border-gray-400"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <h3 className="font-serif text-xl font-medium mb-4">
          Accessibility First
        </h3>
        <p className="text-gray-900 mb-4">
          Distanz Running is committed to creating an inclusive experience for
          all users. We follow WCAG 2.1 Level AA standards and prioritize
          semantic HTML, keyboard navigation, and screen reader support.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div
            className="rounded p-4"
            style={{ background: "var(--ds-background-100)" }}
          >
            <p className="font-medium text-gray-1000 mb-1">Perceivable</p>
            <p className="text-gray-900 text-xs">
              Information must be presentable to users in ways they can perceive
            </p>
          </div>
          <div
            className="rounded p-4"
            style={{ background: "var(--ds-background-100)" }}
          >
            <p className="font-medium text-gray-1000 mb-1">Operable</p>
            <p className="text-gray-900 text-xs">
              Interface components must be operable by all users
            </p>
          </div>
          <div
            className="rounded p-4"
            style={{ background: "var(--ds-background-100)" }}
          >
            <p className="font-medium text-gray-1000 mb-1">Understandable</p>
            <p className="text-gray-900 text-xs">
              Information and operation must be understandable
            </p>
          </div>
        </div>
      </div>

      {/* Color Contrast */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Color Contrast</h3>
        <p className="text-gray-900 mb-6">
          All text meets WCAG AA contrast requirements (4.5:1 for normal text,
          3:1 for large text).
        </p>

        <div className="space-y-4">
          {/* Passing Examples */}
          <div>
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <span className="text-green-600">✓</span> Passing Contrast Ratios
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-neutral-950 rounded-lg p-6 border border-gray-400">
                <p className="text-gray-1000 text-base mb-2">
                  Default Text on Canvas
                </p>
                <p className="text-xs text-gray-900 font-mono">
                  Ratio: 19.5:1 (Light) / 18.2:1 (Dark)
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-950 rounded-lg p-6 border border-gray-400">
                <p className="text-gray-900 text-base mb-2">
                  Subtle Text on Canvas
                </p>
                <p className="text-xs text-gray-900 font-mono">
                  Ratio: 7.1:1 (Light) / 4.9:1 (Dark)
                </p>
              </div>
              <div className="bg-electric-pink rounded-lg p-6">
                <p className="text-white text-base mb-2">
                  White on Electric Pink
                </p>
                <p className="text-xs text-white/80 font-mono">Ratio: 5.8:1</p>
              </div>
              <div className="bg-volt-green rounded-lg p-6">
                <p className="text-neutral-900 text-base mb-2">
                  Dark on Volt Green
                </p>
                <p className="text-xs text-neutral-900/80 font-mono">
                  Ratio: 14.2:1
                </p>
              </div>
            </div>
          </div>

          {/* Failing Examples */}
          <div>
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <span className="text-red-600">✗</span> Avoid: Poor Contrast
              Ratios
            </p>
            <div className="grid md:grid-cols-2 gap-4 opacity-50">
              <div className="bg-white dark:bg-neutral-950 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <p className="text-neutral-300 text-base mb-2">
                  Light Gray on White (Bad)
                </p>
                <p className="text-xs text-red-600 font-mono">
                  Ratio: 2.1:1 - Fails WCAG AA
                </p>
              </div>
              <div className="bg-electric-pink rounded-lg p-6 border border-red-200 dark:border-red-800">
                <p className="text-deep-purple text-base mb-2">
                  Purple on Pink (Bad)
                </p>
                <p className="text-xs text-neutral-900 font-mono">
                  Ratio: 1.8:1 - Fails WCAG AA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Semantic HTML */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Semantic HTML</h3>
        <p className="text-gray-900 mb-6">
          Proper HTML semantics provide structure and meaning for assistive
          technologies.
        </p>

        <div
          className="rounded-lg p-6 border border-gray-400"
          style={{ background: "var(--ds-gray-100)" }}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <div className="flex-1">
                <p className="font-medium text-sm mb-2">
                  Use Semantic Elements
                </p>
                <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                  <code>{`<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2026 Distanz Running</p>
</footer>`}</code>
                </pre>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-red-600 mt-1">✗</span>
              <div className="flex-1">
                <p className="font-medium text-sm mb-2">Avoid Generic Divs</p>
                <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto opacity-50">
                  <code>{`<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Keyboard Navigation
        </h3>
        <p className="text-gray-900 mb-6">
          All interactive elements must be keyboard accessible with visible
          focus states.
        </p>

        <div className="space-y-4">
          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <p className="text-sm font-medium mb-4">Focus States</p>
            <div className="space-y-3">
              <button className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium focus:ring-2 focus:ring-neutral-400 dark:ring-neutral-500 focus:ring-offset-2 focus:outline-none transition-all">
                Focus Me (Tab to see)
              </button>
              <p className="text-xs text-gray-900">
                Try pressing Tab to see the focus ring
              </p>
            </div>
            <pre className="mt-4 p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
              <code>{`<button className="focus:ring-2 focus:ring-neutral-400 dark:ring-neutral-500 focus:ring-offset-2 focus:outline-none">
  Button
</button>`}</code>
            </pre>
          </div>

          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <p className="text-sm font-medium mb-4">Skip Links</p>
            <p className="text-xs text-gray-900 mb-3">
              Press Tab on page load to reveal skip navigation link
            </p>
            <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
              <code>{`<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-neutral-900 dark:focus:bg-white focus:text-white dark:focus:text-neutral-900 focus:rounded"
>
  Skip to main content
</a>`}</code>
            </pre>
          </div>

          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <p className="text-sm font-medium mb-4">Tab Order</p>
            <div className="space-y-2 text-xs text-gray-900">
              <p>• Logical flow: top to bottom, left to right</p>
              <p>• Avoid positive tabindex values</p>
              <p>
                • Use tabindex="-1" for elements that should not be in tab order
              </p>
              <p>
                • Use tabindex="0" to add non-interactive elements to tab order
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ARIA Labels */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          ARIA Labels & Landmarks
        </h3>
        <p className="text-gray-900 mb-6">
          Use ARIA attributes to provide additional context for assistive
          technologies.
        </p>

        <div
          className="rounded-lg p-6 border border-gray-400"
          style={{ background: "var(--ds-gray-100)" }}
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Navigation Landmarks</p>
              <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                <code>{`<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>

<nav aria-label="Footer navigation">
  <ul>...</ul>
</nav>`}</code>
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Button Labels</p>
              <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                <code>{`<button aria-label="Close dialog">
  <XIcon />
</button>

<button aria-label="Search articles">
  <SearchIcon />
</button>`}</code>
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Live Regions</p>
              <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                <code>{`<div role="status" aria-live="polite" aria-atomic="true">
  {successMessage}
</div>

<div role="alert" aria-live="assertive">
  {errorMessage}
</div>`}</code>
              </pre>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Form Labels</p>
              <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                <code>{`<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-hint"
/>
<p id="email-hint" className="text-sm text-gray-900">
  We'll never share your email
</p>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Reader Support */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Screen Reader Support
        </h3>
        <p className="text-gray-900 mb-6">
          Optimize content for screen reader users.
        </p>

        <div
          className="rounded-lg p-6 border border-gray-400"
          style={{ background: "var(--ds-gray-100)" }}
        >
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-2">Visually Hidden Text</p>
              <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                <code>{`<span className="sr-only">
  Additional context for screen readers only
</span>`}</code>
              </pre>
            </div>

            <div>
              <p className="font-medium mb-2">Hide Decorative Images</p>
              <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                <code>{`<img src="decorative.jpg" alt="" aria-hidden="true" />`}</code>
              </pre>
            </div>

            <div>
              <p className="font-medium mb-2">Descriptive Alt Text</p>
              <pre className="p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
                <code>{`<img
  src="runner.jpg"
  alt="Marathon runner crossing finish line with arms raised in victory"
/>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Checklist */}
      <div
        className="rounded-lg p-6 border border-gray-400"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <h3 className="font-serif text-xl font-medium mb-4">
          Accessibility Testing Checklist
        </h3>
        <div className="space-y-3 text-sm">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              All interactive elements are keyboard accessible
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              Focus states are clearly visible
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              Color contrast meets WCAG AA (4.5:1 for text)
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              All images have descriptive alt text
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              Form inputs have associated labels
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              Headings follow logical hierarchy (h1 → h2 → h3)
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">Page has skip navigation link</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">ARIA labels used where needed</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              Tested with screen reader (VoiceOver/NVDA)
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-electric-pink border-gray-400 rounded focus:ring-neutral-400 dark:ring-neutral-500"
              readOnly
            />
            <span className="text-gray-900">
              Respects prefers-reduced-motion
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

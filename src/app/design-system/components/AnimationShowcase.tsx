"use client";

import { useState } from "react";

export default function AnimationShowcase() {
  const [isExpanded, setIsExpanded] = useState(false);

  const transitions = [
    { name: "Duration 75", class: "duration-75", value: "75ms" },
    { name: "Duration 100", class: "duration-100", value: "100ms" },
    { name: "Duration 150", class: "duration-150", value: "150ms" },
    { name: "Duration 200", class: "duration-200", value: "200ms" },
    { name: "Duration 300", class: "duration-300", value: "300ms" },
    { name: "Duration 500", class: "duration-500", value: "500ms" },
  ];

  const easings = [
    { name: "Linear", class: "ease-linear", value: "linear" },
    { name: "Ease", class: "ease", value: "ease" },
    { name: "Ease In", class: "ease-in", value: "ease-in" },
    { name: "Ease Out", class: "ease-out", value: "ease-out" },
    { name: "Ease In Out", class: "ease-in-out", value: "ease-in-out" },
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div
        className="rounded-lg p-6 border border-gray-400"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <h3 className="font-serif text-xl font-medium mb-4">
          Motion Principles
        </h3>
        <p className="text-gray-900 mb-4">
          Animation brings the Distanz Running interface to life. All motion
          should feel purposeful, smooth, and respect user preferences
          (prefers-reduced-motion).
        </p>
        <div className="space-y-2 text-sm text-gray-900">
          <p>
            <strong className="text-gray-1000">Speed:</strong> Quick
            interactions (100-200ms), moderate transitions (300ms), complex
            animations (500ms+)
          </p>
          <p>
            <strong className="text-gray-1000">Easing:</strong> ease-out for
            entering, ease-in for exiting, ease-in-out for movement
          </p>
          <p>
            <strong className="text-gray-1000">Purpose:</strong> Guide
            attention, provide feedback, enhance UX—never just decoration
          </p>
        </div>
      </div>

      {/* Transition Durations */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Transition Durations
        </h3>
        <p className="text-gray-900 mb-6">
          Hover over each box to see the transition speed.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {transitions.map((transition) => (
            <div key={transition.name} className="text-center">
              <div
                className={`w-full h-24 bg-electric-pink rounded-lg mb-3 transition-transform hover:scale-110 ${transition.class}`}
              />
              <div className="space-y-1">
                <p className="font-medium text-xs">{transition.name}</p>
                <code className="text-xs text-gray-600 font-mono">
                  {transition.value}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Easing Functions */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Easing Functions
        </h3>
        <p className="text-gray-900 mb-6">
          Different easing curves for different motion types.
        </p>

        <div className="space-y-4">
          {easings.map((easing) => (
            <div
              key={easing.name}
              className="rounded-lg p-4 border border-gray-400 group hover:border-gray-500"
              style={{ background: "var(--ds-gray-100)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{easing.name}</span>
                <code className="text-xs text-gray-600 font-mono">
                  {easing.value}
                </code>
              </div>
              <div className="[background:var(--ds-background-100)] rounded h-2 overflow-hidden">
                <div
                  className={`h-full bg-electric-pink transition-all duration-1000 ${easing.class} group-hover:w-full w-0`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Patterns */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Common Animation Patterns
        </h3>
        <p className="text-gray-900 mb-6">
          Standard animations used throughout the application.
        </p>

        <div className="space-y-6">
          {/* Button Hover */}
          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <h4 className="font-medium mb-4">Button Hover (opacity)</h4>
            <button className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors duration-200">
              Hover Me
            </button>
            <pre className="mt-4 p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
              <code>{`<button className="transition-colors duration-200 hover:bg-opacity-90">
  Hover Me
</button>`}</code>
            </pre>
          </div>

          {/* Card Hover (scale + shadow) */}
          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <h4 className="font-medium mb-4">Card Hover (scale + shadow)</h4>
            <div className="[background:var(--ds-background-100)] rounded-lg p-6 border border-gray-400 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 inline-block">
              <p className="text-sm text-gray-900">Interactive Card</p>
            </div>
            <pre className="mt-4 p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
              <code>{`<div className="transition-all duration-300 hover:shadow-lg hover:scale-105">
  Interactive Card
</div>`}</code>
            </pre>
          </div>

          {/* Accordion (height) */}
          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <h4 className="font-medium mb-4">Accordion (height transition)</h4>
            <div className="border border-gray-400 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 [background:var(--ds-background-100)] text-left font-medium flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span>Click to Expand</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="p-4 [background:var(--ds-gray-100)] border-t border-gray-400">
                  <p className="text-sm text-gray-900">
                    This content expands and collapses with a smooth height
                    transition. The arrow icon also rotates to indicate state.
                  </p>
                </div>
              </div>
            </div>
            <pre className="mt-4 p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
              <code>{`<div className={\`transition-all duration-300 \${expanded ? 'max-h-40' : 'max-h-0'}\`}>
  Content
</div>`}</code>
            </pre>
          </div>

          {/* Fade In */}
          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <h4 className="font-medium mb-4">Fade In (opacity)</h4>
            <div className="animate-fadeIn">
              <p className="text-sm text-gray-900">
                This element fades in on page load
              </p>
            </div>
            <pre className="mt-4 p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
              <code>{`<div className="animate-fadeIn">
  Content
</div>`}</code>
            </pre>
          </div>

          {/* Slide Up */}
          <div
            className="rounded-lg p-6 border border-gray-400"
            style={{ background: "var(--ds-gray-100)" }}
          >
            <h4 className="font-medium mb-4">Slide Up (transform + opacity)</h4>
            <div className="animate-slideUp">
              <p className="text-sm text-gray-900">
                This element slides up on page load
              </p>
            </div>
            <pre className="mt-4 p-3 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
              <code>{`<div className="animate-slideUp">
  Content
</div>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Framer Motion Integration */}
      <div
        className="rounded-lg p-6 border border-gray-400"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <h3 className="font-serif text-xl font-medium mb-4">
          Framer Motion Integration
        </h3>
        <p className="text-gray-900 mb-4">
          For complex animations, we use Framer Motion. Common patterns include
          page transitions, staggered lists, and gesture-based interactions.
        </p>
        <pre className="p-4 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
          <code>{`import { motion } from 'framer-motion';

// Fade in on mount
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div variants={itemVariants} key={item.id}>
      {item.content}
    </motion.div>
  ))}
</motion.div>`}</code>
        </pre>
      </div>

      {/* Accessibility */}
      <div
        className="rounded-lg p-6 border border-gray-400"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <h3 className="font-serif text-xl font-medium mb-4">
          Accessibility Considerations
        </h3>
        <div className="space-y-3 text-sm text-gray-900">
          <p>
            <strong className="text-gray-1000">
              Respect User Preferences:
            </strong>{" "}
            Always check for prefers-reduced-motion and provide instant
            alternatives.
          </p>
          <p>
            <strong className="text-gray-1000">No Seizure Risk:</strong> Avoid
            flashing or rapid color changes that could trigger seizures.
          </p>
          <p>
            <strong className="text-gray-1000">Essential Info:</strong> Never
            rely solely on animation to convey critical information.
          </p>
          <p>
            <strong className="text-gray-1000">Pausable:</strong> Long-running
            animations should be pausable by the user.
          </p>
        </div>
        <pre className="mt-4 p-4 [background:var(--ds-background-100)] rounded text-xs overflow-x-auto">
          <code>{`/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}</code>
        </pre>
      </div>
    </div>
  );
}

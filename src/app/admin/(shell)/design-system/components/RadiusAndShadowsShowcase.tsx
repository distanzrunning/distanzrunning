export default function RadiusAndShadowsShowcase() {
  const radiusValues = [
    { name: "None", class: "rounded-none", value: "0px" },
    { name: "Small", class: "rounded-sm", value: "2px" },
    { name: "Base", class: "rounded", value: "4px" },
    { name: "Medium", class: "rounded-md", value: "6px" },
    { name: "Large", class: "rounded-lg", value: "8px" },
    { name: "XL", class: "rounded-xl", value: "12px" },
    { name: "2XL", class: "rounded-2xl", value: "16px" },
    { name: "3XL", class: "rounded-3xl", value: "24px" },
    { name: "Full", class: "rounded-full", value: "9999px" },
  ];

  const shadowValues = [
    { name: "Small", class: "shadow-sm", value: "0 1px 2px rgba(0,0,0,0.05)" },
    { name: "Base", class: "shadow", value: "0 1px 3px rgba(0,0,0,0.1)" },
    { name: "Medium", class: "shadow-md", value: "0 4px 6px rgba(0,0,0,0.1)" },
    { name: "Large", class: "shadow-lg", value: "0 10px 15px rgba(0,0,0,0.1)" },
    { name: "XL", class: "shadow-xl", value: "0 20px 25px rgba(0,0,0,0.1)" },
    { name: "2XL", class: "shadow-2xl", value: "0 25px 50px rgba(0,0,0,0.25)" },
  ];

  return (
    <div className="space-y-12">
      {/* Border Radius */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Border Radius</h3>
        <p className="text-textSubtle mb-6">
          Consistent corner rounding creates visual cohesion.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {radiusValues.map((radius) => (
            <div key={radius.name} className="text-center">
              <div
                className={`w-full h-24 bg-electric-pink ${radius.class} mb-3 transition-transform hover:scale-105`}
              />
              <div className="space-y-1">
                <p className="font-medium text-sm">{radius.name}</p>
                <p className="text-xs text-textSubtle font-mono">
                  {radius.value}
                </p>
                <code className="text-xs text-textSubtler font-mono">
                  {radius.class}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shadows */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Elevation & Shadows
        </h3>
        <p className="text-textSubtle mb-6">
          Shadows create depth hierarchy and visual layers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shadowValues.map((shadow) => (
            <div key={shadow.name} className="group">
              <div
                className={`w-full h-32 bg-surface dark:bg-neutral-900 rounded-lg ${shadow.class} mb-3 transition-transform hover:scale-105 border border-borderNeutral flex items-center justify-center`}
              >
                <p className="text-sm font-medium text-textSubtle">
                  {shadow.name}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{shadow.name}</p>
                <code className="text-xs text-textSubtler font-mono block">
                  {shadow.class}
                </code>
                <p className="text-xs text-textSubtle">{shadow.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">
          Usage Guidelines
        </h3>
        <div className="space-y-4 text-sm text-textSubtle">
          <div>
            <p className="font-medium text-textDefault mb-2">Border Radius</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong className="text-textDefault">rounded-md (6px):</strong>{" "}
                Default for buttons and form inputs
              </li>
              <li>
                <strong className="text-textDefault">rounded-lg (8px):</strong>{" "}
                Cards and larger containers
              </li>
              <li>
                <strong className="text-textDefault">rounded-xl (12px):</strong>{" "}
                Hero sections and feature cards
              </li>
              <li>
                <strong className="text-textDefault">rounded-full:</strong>{" "}
                Badges, avatars, and pills
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-textDefault mb-2">Shadows</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong className="text-textDefault">shadow-sm:</strong> Subtle
                cards and input fields
              </li>
              <li>
                <strong className="text-textDefault">shadow-md:</strong>{" "}
                Dropdowns and popovers
              </li>
              <li>
                <strong className="text-textDefault">shadow-lg:</strong> Modals
                and overlays
              </li>
              <li>
                <strong className="text-textDefault">shadow-xl:</strong>{" "}
                Navigation mega menu
              </li>
              <li>Hover states typically increase shadow by one level</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Examples in Context */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Examples in Context
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Button Example */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">
              Button (rounded-md + no shadow)
            </h4>
            <button className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
              Primary Button
            </button>
            <pre className="mt-4 text-xs text-textSubtle">rounded-md (6px)</pre>
          </div>

          {/* Card Example */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Card (rounded-lg + shadow-sm)</h4>
            <div className="bg-canvas rounded-lg p-4 border border-borderNeutral shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-textSubtle">
                Content card with subtle shadow
              </p>
            </div>
            <pre className="mt-4 text-xs text-textSubtle">
              rounded-lg (8px) + shadow-sm
            </pre>
          </div>

          {/* Badge Example */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Badge (rounded-full)</h4>
            <span className="inline-block px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium rounded-full">
              Marathon
            </span>
            <pre className="mt-4 text-xs text-textSubtle">
              rounded-full (9999px)
            </pre>
          </div>

          {/* Modal Example */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">
              Modal (rounded-xl + shadow-2xl)
            </h4>
            <div className="bg-canvas rounded-xl p-6 border border-borderNeutral shadow-2xl">
              <p className="text-sm text-textSubtle">
                Modal overlay with large shadow
              </p>
            </div>
            <pre className="mt-4 text-xs text-textSubtle">
              rounded-xl (12px) + shadow-2xl
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function DesignPatternsShowcase() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">
          Common Design Patterns
        </h3>
        <p className="text-textSubtle">
          Reusable solutions to common design problems. These patterns ensure
          consistency across the Distanz Running platform and speed up
          development.
        </p>
      </div>

      {/* Navigation Patterns */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Navigation Patterns
        </h3>

        <div className="space-y-6">
          {/* Primary Navigation */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Primary Navigation (Desktop)</h4>
            <p className="text-sm text-textSubtle mb-4">
              Sticky header with logo, main nav, and action buttons
            </p>
            <div className="bg-canvas border border-borderNeutral rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-electric-pink">LOGO</div>
                <nav className="flex gap-6 text-sm">
                  <a
                    href="#"
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    News
                  </a>
                  <a
                    href="#"
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Training
                  </a>
                </nav>
                <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            <pre className="mt-4 p-3 bg-canvas rounded text-xs overflow-x-auto">
              <code>{`<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
  <div className="flex items-center justify-between">
    <Logo />
    <NavLinks />
    <CTAButton />
  </div>
</nav>`}</code>
            </pre>
          </div>

          {/* Mega Menu */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Mega Menu Pattern</h4>
            <p className="text-sm text-textSubtle mb-4">
              Multi-column dropdown with images and organized content
            </p>
            <div className="bg-canvas border border-borderNeutral rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="font-medium text-xs mb-3 text-electric-pink uppercase tracking-wide">
                    Category 1
                  </p>
                  <ul className="space-y-2 text-sm text-textSubtle">
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-xs mb-3 text-electric-pink uppercase tracking-wide">
                    Category 2
                  </p>
                  <ul className="space-y-2 text-sm text-textSubtle">
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-electric-pink to-deep-purple rounded p-4 flex items-center justify-center">
                  <p className="text-white text-xs text-center">
                    Featured Content
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Breadcrumb Navigation</h4>
            <p className="text-sm text-textSubtle mb-4">
              Shows current location in site hierarchy
            </p>
            <nav className="flex items-center gap-2 text-sm text-textSubtle">
              <a
                href="#"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Home
              </a>
              <span>/</span>
              <a
                href="#"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Training
              </a>
              <span>/</span>
              <span className="text-textDefault font-medium">
                Marathon Plans
              </span>
            </nav>
            <pre className="mt-4 p-3 bg-canvas rounded text-xs overflow-x-auto">
              <code>{`<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2">
    <li><a href="/">Home</a></li>
    <li>/</li>
    <li><a href="/training">Training</a></li>
    <li>/</li>
    <li aria-current="page">Marathon Plans</li>
  </ol>
</nav>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Content Patterns */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Content Patterns
        </h3>

        <div className="space-y-6">
          {/* Article Card Grid */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Article Card Grid</h4>
            <p className="text-sm text-textSubtle mb-4">
              Responsive grid of article cards
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-canvas rounded-lg overflow-hidden border border-borderNeutral hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-32 bg-gradient-to-br from-electric-pink via-pace-purple to-deep-purple" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wide text-electric-pink font-medium mb-1">
                      Category
                    </p>
                    <p className="font-bold text-sm mb-1">Article Title {i}</p>
                    <p className="text-xs text-textSubtle">
                      Brief description...
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <pre className="mt-4 p-3 bg-canvas rounded text-xs overflow-x-auto">
              <code>{`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {articles.map(article => (
    <ArticleCard key={article.id} {...article} />
  ))}
</div>`}</code>
            </pre>
          </div>

          {/* Hero Section */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Hero Section</h4>
            <p className="text-sm text-textSubtle mb-4">
              Large featured content with image and CTA
            </p>
            <div className="bg-gradient-to-br from-electric-pink to-deep-purple rounded-xl p-8 text-white">
              <p className="text-xs uppercase tracking-wide mb-2 opacity-90">
                Featured
              </p>
              <h2 className="font-serif text-3xl font-medium mb-3">
                Hero Article Title Goes Here
              </h2>
              <p className="text-sm mb-6 opacity-90">
                Compelling description that hooks the reader and encourages them
                to click through.
              </p>
              <button className="px-6 py-3 bg-white text-electric-pink rounded-md font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                Read More
              </button>
            </div>
            <pre className="mt-4 p-3 bg-canvas rounded text-xs overflow-x-auto">
              <code>{`<section className="relative h-[500px] bg-gradient-to-br from-electric-pink to-deep-purple">
  <div className="absolute inset-0 flex items-center">
    <div className="max-w-2xl px-6">
      <h1 className="font-serif text-5xl">Title</h1>
      <p className="text-lg">Description</p>
      <button>CTA</button>
    </div>
  </div>
</section>`}</code>
            </pre>
          </div>

          {/* Tabbed Content */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Tabbed Navigation</h4>
            <p className="text-sm text-textSubtle mb-4">
              Switch between related content sections
            </p>
            <div className="border border-borderNeutral rounded-lg overflow-hidden">
              <div className="flex border-b border-borderNeutral bg-surface-subtle">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "overview"
                      ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white -mb-px"
                      : "text-textSubtle hover:text-textDefault"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "details"
                      ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white -mb-px"
                      : "text-textSubtle hover:text-textDefault"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "specs"
                      ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white -mb-px"
                      : "text-textSubtle hover:text-textDefault"
                  }`}
                >
                  Specifications
                </button>
              </div>
              <div className="p-6">
                {activeTab === "overview" && (
                  <p className="text-sm text-textSubtle">Overview content...</p>
                )}
                {activeTab === "details" && (
                  <p className="text-sm text-textSubtle">
                    Detailed information...
                  </p>
                )}
                {activeTab === "specs" && (
                  <p className="text-sm text-textSubtle">
                    Technical specifications...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Patterns */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Form Patterns</h3>

        <div className="space-y-6">
          {/* Inline Validation */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Inline Validation</h4>
            <p className="text-sm text-textSubtle mb-4">
              Real-time feedback on form inputs
            </p>
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email (Valid)
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-green-500 rounded-md bg-surface"
                  value="user@example.com"
                  readOnly
                />
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span>✓</span> Valid email address
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email (Invalid)
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-red-500 rounded-md bg-surface"
                  value="invalid-email"
                  readOnly
                />
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <span>✗</span> Please enter a valid email address
                </p>
              </div>
            </div>
          </div>

          {/* Multi-step Form */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Multi-step Progress</h4>
            <p className="text-sm text-textSubtle mb-4">
              Visual progress indicator for multi-step forms
            </p>
            <div className="flex items-center justify-between max-w-md">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-sm font-medium mb-2">
                  ✓
                </div>
                <p className="text-xs font-medium">Account</p>
              </div>
              <div className="flex-1 h-1 bg-electric-pink mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-sm font-medium mb-2">
                  2
                </div>
                <p className="text-xs font-medium text-electric-pink">
                  Profile
                </p>
              </div>
              <div className="flex-1 h-1 bg-borderNeutral mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-surface-subtle border border-borderNeutral text-textSubtle flex items-center justify-center text-sm font-medium mb-2">
                  3
                </div>
                <p className="text-xs text-textSubtle">Confirm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Patterns */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">
          Feedback Patterns
        </h3>

        <div className="space-y-6">
          {/* Toast Notifications */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Toast Notifications</h4>
            <p className="text-sm text-textSubtle mb-4">
              Temporary feedback messages
            </p>
            <div className="space-y-3 max-w-md">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                <span className="text-green-600">✓</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Success
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-200">
                    Your changes have been saved
                  </p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <span className="text-red-600">✗</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    Error
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-200">
                    Something went wrong. Please try again
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading States */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Loading States</h4>
            <p className="text-sm text-textSubtle mb-4">
              Visual feedback during async operations
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium mb-2">Skeleton Loading</p>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-subtle rounded animate-pulse" />
                  <div className="h-4 bg-surface-subtle rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-surface-subtle rounded animate-pulse w-1/2" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Spinner</p>
                <div className="w-8 h-8 border-4 border-surface-subtle border-t-electric-pink rounded-full animate-spin" />
              </div>
            </div>
          </div>

          {/* Empty States */}
          <div className="bg-surface rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Empty States</h4>
            <p className="text-sm text-textSubtle mb-4">
              Helpful messaging when no content exists
            </p>
            <div className="bg-canvas rounded-lg p-12 text-center border border-borderNeutral">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-medium mb-2">No articles yet</p>
              <p className="text-sm text-textSubtle mb-4">
                Start by creating your first article
              </p>
              <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-md text-sm font-medium transition-colors">
                Create Article
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">
          Pattern Implementation Best Practices
        </h3>
        <div className="space-y-3 text-sm text-textSubtle">
          <p>
            <strong className="text-textDefault">Consistency:</strong> Use the
            same pattern for the same problem throughout the application.
          </p>
          <p>
            <strong className="text-textDefault">Accessibility:</strong> Ensure
            all patterns are keyboard navigable and screen reader friendly.
          </p>
          <p>
            <strong className="text-textDefault">Responsive:</strong> All
            patterns should adapt gracefully to mobile, tablet, and desktop.
          </p>
          <p>
            <strong className="text-textDefault">Performance:</strong> Avoid
            heavy animations on pattern elements that appear frequently.
          </p>
          <p>
            <strong className="text-textDefault">Documentation:</strong>{" "}
            Document pattern variations and when to use each one.
          </p>
        </div>
      </div>
    </div>
  );
}

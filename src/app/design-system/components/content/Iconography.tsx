import {
  // Navigation & UI
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Settings,
  Settings2,

  // Theme
  Moon,
  Sun,

  // Category icons
  Flag,
  Calendar,
  Footprints,
  Zap,
  MountainSnow,
  Watch,
  UtensilsCrossed,
  FileText,
  Database,
  Route,

  // Data & metrics
  Wallet,
  Users,
  Mountain,
  ThermometerSun,
  Medal,

  // Design system sidebar
  Glasses,
  Scale,
  SwatchBook,
  LayoutGrid,
  RulerDimensionLine,
  Type,
  LucideIcon,
} from "lucide-react";

interface IconShowcaseProps {
  icon: LucideIcon;
  name: string;
  usage?: string;
}

function IconShowcase({ icon: Icon, name, usage }: IconShowcaseProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg [background:var(--ds-gray-100)] border border-gray-300">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg [background:var(--ds-background-100)] border border-gray-400">
        <Icon className="w-5 h-5 text-gray-1000" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm font-medium text-gray-1000">{name}</p>
        {usage && <p className="text-sm text-gray-900 mt-0.5">{usage}</p>}
      </div>
    </div>
  );
}

interface IconGridProps {
  icons: Array<{ icon: LucideIcon; name: string; usage?: string }>;
}

function IconGrid({ icons }: IconGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {icons.map(({ icon, name, usage }) => (
        <IconShowcase key={name} icon={icon} name={name} usage={usage} />
      ))}
    </div>
  );
}

export default function Iconography() {
  const navigationIcons = [
    { icon: Menu, name: "Menu", usage: "Mobile menu trigger" },
    { icon: X, name: "X", usage: "Close buttons, dismiss actions" },
    {
      icon: ChevronDown,
      name: "ChevronDown",
      usage: "Dropdown indicators, expandable sections",
    },
    {
      icon: ChevronRight,
      name: "ChevronRight",
      usage: "Navigation, breadcrumbs",
    },
    { icon: ArrowLeft, name: "ArrowLeft", usage: "Back navigation" },
    {
      icon: ArrowRight,
      name: "ArrowRight",
      usage: "Forward navigation, links",
    },
    {
      icon: ArrowUpRight,
      name: "ArrowUpRight",
      usage: "External links, elevation gain",
    },
    { icon: ArrowDownRight, name: "ArrowDownRight", usage: "Elevation loss" },
    { icon: Search, name: "Search", usage: "Search triggers and inputs" },
    { icon: Settings, name: "Settings", usage: "Settings menus" },
    {
      icon: Settings2,
      name: "Settings2",
      usage: "Secondary settings, preferences",
    },
  ];

  const themeIcons = [
    { icon: Moon, name: "Moon", usage: "Dark mode indicator/toggle" },
    { icon: Sun, name: "Sun", usage: "Light mode indicator/toggle" },
  ];

  const categoryIcons = [
    { icon: Flag, name: "Flag", usage: "Race Day Shoes category" },
    {
      icon: Calendar,
      name: "Calendar",
      usage: "Daily Trainers, Race Calendar",
    },
    { icon: Footprints, name: "Footprints", usage: "Max Cushion shoes" },
    { icon: Zap, name: "Zap", usage: "Tempo Shoes, speed" },
    { icon: MountainSnow, name: "MountainSnow", usage: "Trail Shoes category" },
    { icon: Watch, name: "Watch", usage: "GPS Watches category" },
    {
      icon: UtensilsCrossed,
      name: "UtensilsCrossed",
      usage: "Nutrition category",
    },
    { icon: FileText, name: "FileText", usage: "Race Guides" },
    { icon: Database, name: "Database", usage: "Race Database" },
    { icon: Route, name: "Route", usage: "Race surface, course info" },
  ];

  const dataIcons = [
    { icon: Wallet, name: "Wallet", usage: "Entry price, costs" },
    { icon: Users, name: "Users", usage: "Finisher counts, participants" },
    { icon: Mountain, name: "Mountain", usage: "Elevation profile" },
    { icon: ThermometerSun, name: "ThermometerSun", usage: "Temperature data" },
    { icon: Medal, name: "Medal", usage: "Course records, achievements" },
  ];

  const designSystemIcons = [
    { icon: Glasses, name: "Glasses", usage: "Overview section" },
    { icon: Scale, name: "Scale", usage: "Principles section" },
    { icon: SwatchBook, name: "SwatchBook", usage: "Colour section" },
    { icon: LayoutGrid, name: "LayoutGrid", usage: "Grid section" },
    {
      icon: RulerDimensionLine,
      name: "RulerDimensionLine",
      usage: "Rules section",
    },
    { icon: Type, name: "Type", usage: "Typography section" },
  ];

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Foundations
        </p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="iconography"
        >
          Iconography
        </h1>
      </div>

      <hr className="border-t-4 border-gray-1000" />

      <p className="text-base text-gray-900">
        We use Lucide React for our icon library. Lucide provides a
        comprehensive set of open-source icons that are consistent,
        customisable, and optimised for web use. All icons are SVG-based and
        support both light and dark modes.
      </p>

      {/* Sizing Section */}
      <section>
        <h2
          id="sizing"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Sizing
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          Icons should be sized consistently based on their context. We use
          three primary sizes throughout the interface.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Pixels
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Small</td>
                <td className="py-3 px-4 font-mono">16px</td>
                <td className="py-3 px-4 font-mono">w-4 h-4</td>
                <td className="py-3 px-4">
                  Inline with text, sidebar navigation
                </td>
                <td className="py-3 px-4">
                  <ChevronDown className="w-4 h-4 text-gray-1000" />
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Medium</td>
                <td className="py-3 px-4 font-mono">20px</td>
                <td className="py-3 px-4 font-mono">w-5 h-5</td>
                <td className="py-3 px-4">
                  Buttons, header actions, toolbar icons
                </td>
                <td className="py-3 px-4">
                  <Search className="w-5 h-5 text-gray-1000" />
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Large</td>
                <td className="py-3 px-4 font-mono">24px</td>
                <td className="py-3 px-4 font-mono">w-6 h-6</td>
                <td className="py-3 px-4">Mobile menu, prominent actions</td>
                <td className="py-3 px-4">
                  <Menu className="w-6 h-6 text-gray-1000" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-gray-400" />

      {/* Stroke Weight Section */}
      <section>
        <h2
          id="stroke-weight"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Stroke weight
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          Lucide icons support variable stroke width. We use two weights to
          indicate state.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="[background:var(--ds-gray-100)] p-6">
            <div className="flex items-center gap-4 mb-4">
              <Type className="w-6 h-6 text-gray-1000" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-sm text-gray-1000">
                  strokeWidth={"{1.5}"}
                </p>
                <p className="text-sm text-gray-900">
                  Default / inactive state
                </p>
              </div>
            </div>
          </div>
          <div className="[background:var(--ds-gray-100)] p-6">
            <div className="flex items-center gap-4 mb-4">
              <Type className="w-6 h-6 text-gray-1000" strokeWidth={2.5} />
              <div>
                <p className="font-mono text-sm text-gray-1000">
                  strokeWidth={"{2.5}"}
                </p>
                <p className="text-sm text-gray-900">Active / selected state</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-900">
          This pattern is used in the design system sidebar to indicate the
          currently active section.
        </p>
      </section>

      <hr className="border-t border-gray-400" />

      {/* Colour Section */}
      <section>
        <h2
          id="colour"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Colour
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          Icons inherit their colour from the parent text colour using{" "}
          <code className="font-mono text-sm [background:var(--ds-gray-100)] px-1.5 py-0.5 rounded">
            currentColor
          </code>
          . Apply colour using Tailwind text utilities.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="[background:var(--ds-gray-100)] p-4 text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-gray-1000" />
            <p className="font-mono text-xs text-gray-900">text-gray-1000</p>
          </div>
          <div className="[background:var(--ds-gray-100)] p-4 text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-gray-900" />
            <p className="font-mono text-xs text-gray-900">text-gray-900</p>
          </div>
          <div className="[background:var(--ds-gray-100)] p-4 text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-electric-pink" />
            <p className="font-mono text-xs text-gray-900">
              text-electric-pink
            </p>
          </div>
          <div className="[background:var(--ds-gray-100)] p-4 text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-volt-green" />
            <p className="font-mono text-xs text-gray-900">text-volt-green</p>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-400" />

      {/* Navigation Icons */}
      <section>
        <h2
          id="navigation"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Navigation
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <IconGrid icons={navigationIcons} />
      </section>

      <hr className="border-t border-gray-400" />

      {/* Theme Icons */}
      <section>
        <h2
          id="theme"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Theme
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <IconGrid icons={themeIcons} />
      </section>

      <hr className="border-t border-gray-400" />

      {/* Category Icons */}
      <section>
        <h2
          id="categories"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Categories
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          These icons represent different content categories and navigation
          sections throughout the site.
        </p>

        <IconGrid icons={categoryIcons} />
      </section>

      <hr className="border-t border-gray-400" />

      {/* Data Icons */}
      <section>
        <h2
          id="data"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Data &amp; metrics
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          Icons used to represent race data, statistics, and metrics in the race
          calendar and event popups.
        </p>

        <IconGrid icons={dataIcons} />
      </section>

      <hr className="border-t border-gray-400" />

      {/* Design System Icons */}
      <section>
        <h2
          id="design-system"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Design system
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          Icons used in the design system sidebar navigation to represent
          different foundation sections.
        </p>

        <IconGrid icons={designSystemIcons} />
      </section>

      <hr className="border-t border-gray-400" />

      {/* Usage Guidelines */}
      <section>
        <h2
          id="usage"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Usage guidelines
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <div className="space-y-4">
          <div>
            <h3 className="font-serif text-[22px] leading-[1.3] font-medium mb-2">
              Import
            </h3>
            <div className="[background:var(--ds-gray-100)] p-4 font-mono text-sm">
              <code className="text-gray-1000">
                {`import { IconName } from "lucide-react";`}
              </code>
            </div>
          </div>

          <hr className="border-t border-gray-300" />

          <div>
            <h3 className="font-serif text-[22px] leading-[1.3] font-medium mb-2">
              Basic usage
            </h3>
            <div className="[background:var(--ds-gray-100)] p-4 font-mono text-sm">
              <code className="text-gray-1000">
                {`<Search className="w-5 h-5 text-gray-1000" />`}
              </code>
            </div>
          </div>

          <hr className="border-t border-gray-300" />

          <div>
            <h3 className="font-serif text-[22px] leading-[1.3] font-medium mb-2">
              With custom stroke
            </h3>
            <div className="[background:var(--ds-gray-100)] p-4 font-mono text-sm">
              <code className="text-gray-1000">
                {`<Type className="w-4 h-4" strokeWidth={2.5} />`}
              </code>
            </div>
          </div>

          <hr className="border-t border-gray-300" />

          <div>
            <h3 className="font-serif text-[22px] leading-[1.3] font-medium mb-2">
              Accessibility
            </h3>
            <p className="text-base text-gray-900 mb-4">
              Icons used as buttons should include an accessible label:
            </p>
            <div className="[background:var(--ds-gray-100)] p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-1000">
                {`<button aria-label="Open search">
  <Search className="w-5 h-5" />
</button>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-400" />

      {/* Reference */}
      <section>
        <h2
          id="reference"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Reference
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Property
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Library</td>
                <td className="py-3 px-4 font-mono">lucide-react</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Default stroke</td>
                <td className="py-3 px-4 font-mono">1.5</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Active stroke</td>
                <td className="py-3 px-4 font-mono">2.5</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Small size</td>
                <td className="py-3 px-4 font-mono">16px (w-4 h-4)</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Medium size</td>
                <td className="py-3 px-4 font-mono">20px (w-5 h-5)</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Large size</td>
                <td className="py-3 px-4 font-mono">24px (w-6 h-6)</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">Documentation</td>
                <td className="py-3 px-4">
                  <a
                    href="https://lucide.dev/icons/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-pink hover:underline"
                  >
                    lucide.dev/icons
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

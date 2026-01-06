"use client";

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
    <div className="flex items-center gap-4 p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-canvas border border-borderDefault">
        <Icon className="w-5 h-5 text-textDefault" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm font-medium text-textDefault">{name}</p>
        {usage && (
          <p className="text-sm text-textSubtle mt-0.5">{usage}</p>
        )}
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
    { icon: ChevronDown, name: "ChevronDown", usage: "Dropdown indicators, expandable sections" },
    { icon: ChevronRight, name: "ChevronRight", usage: "Navigation, breadcrumbs" },
    { icon: ArrowLeft, name: "ArrowLeft", usage: "Back navigation" },
    { icon: ArrowRight, name: "ArrowRight", usage: "Forward navigation, links" },
    { icon: ArrowUpRight, name: "ArrowUpRight", usage: "External links, elevation gain" },
    { icon: ArrowDownRight, name: "ArrowDownRight", usage: "Elevation loss" },
    { icon: Search, name: "Search", usage: "Search triggers and inputs" },
    { icon: Settings, name: "Settings", usage: "Settings menus" },
    { icon: Settings2, name: "Settings2", usage: "Secondary settings, preferences" },
  ];

  const themeIcons = [
    { icon: Moon, name: "Moon", usage: "Dark mode indicator/toggle" },
    { icon: Sun, name: "Sun", usage: "Light mode indicator/toggle" },
  ];

  const categoryIcons = [
    { icon: Flag, name: "Flag", usage: "Race Day Shoes category" },
    { icon: Calendar, name: "Calendar", usage: "Daily Trainers, Race Calendar" },
    { icon: Footprints, name: "Footprints", usage: "Max Cushion shoes" },
    { icon: Zap, name: "Zap", usage: "Tempo Shoes, speed" },
    { icon: MountainSnow, name: "MountainSnow", usage: "Trail Shoes category" },
    { icon: Watch, name: "Watch", usage: "GPS Watches category" },
    { icon: UtensilsCrossed, name: "UtensilsCrossed", usage: "Nutrition category" },
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
    { icon: RulerDimensionLine, name: "RulerDimensionLine", usage: "Rules section" },
    { icon: Type, name: "Type", usage: "Typography section" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block px-2 py-1 text-xs font-medium uppercase tracking-wider text-electric-pink bg-electric-pink/10 rounded mb-4">
          Iconography
        </span>
        <h1 className="font-headline text-4xl font-medium text-textDefault mb-2">
          Iconography
        </h1>
        <hr className="border-t-4 border-textDefault mt-4" />
      </div>

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-textSubtle leading-relaxed max-w-3xl">
          We use Lucide React for our icon library. Lucide provides a comprehensive set of
          open-source icons that are consistent, customisable, and optimised for web use.
          All icons are SVG-based and support both light and dark modes.
        </p>
      </div>

      {/* Sizing Section */}
      <section className="mb-12" id="sizing">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Sizing
        </h2>
        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-textSubtle mb-6 max-w-3xl">
          Icons should be sized consistently based on their context. We use three primary sizes
          throughout the interface.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="py-3 pr-6 text-sm font-semibold text-textDefault">Size</th>
                <th className="py-3 pr-6 text-sm font-semibold text-textDefault">Pixels</th>
                <th className="py-3 pr-6 text-sm font-semibold text-textDefault">Tailwind</th>
                <th className="py-3 pr-6 text-sm font-semibold text-textDefault">Usage</th>
                <th className="py-3 text-sm font-semibold text-textDefault">Example</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-6 text-textDefault">Small</td>
                <td className="py-4 pr-6 text-textSubtle">16px</td>
                <td className="py-4 pr-6 text-textSubtle">w-4 h-4</td>
                <td className="py-4 pr-6 text-textSubtle font-sans">Inline with text, sidebar navigation</td>
                <td className="py-4">
                  <ChevronDown className="w-4 h-4 text-textDefault" />
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-6 text-textDefault">Medium</td>
                <td className="py-4 pr-6 text-textSubtle">20px</td>
                <td className="py-4 pr-6 text-textSubtle">w-5 h-5</td>
                <td className="py-4 pr-6 text-textSubtle font-sans">Buttons, header actions, toolbar icons</td>
                <td className="py-4">
                  <Search className="w-5 h-5 text-textDefault" />
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-6 text-textDefault">Large</td>
                <td className="py-4 pr-6 text-textSubtle">24px</td>
                <td className="py-4 pr-6 text-textSubtle">w-6 h-6</td>
                <td className="py-4 pr-6 text-textSubtle font-sans">Mobile menu, prominent actions</td>
                <td className="py-4">
                  <Menu className="w-6 h-6 text-textDefault" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Stroke Weight Section */}
      <section className="mb-12" id="stroke-weight">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Stroke weight
        </h2>
        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-textSubtle mb-6 max-w-3xl">
          Lucide icons support variable stroke width. We use two weights to indicate state.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 rounded-lg bg-surfaceSubtle border border-borderSubtle">
            <div className="flex items-center gap-4 mb-4">
              <Type className="w-6 h-6 text-textDefault" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-sm text-textDefault">strokeWidth={`{1.5}`}</p>
                <p className="text-sm text-textSubtle">Default / inactive state</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-surfaceSubtle border border-borderSubtle">
            <div className="flex items-center gap-4 mb-4">
              <Type className="w-6 h-6 text-textDefault" strokeWidth={2.5} />
              <div>
                <p className="font-mono text-sm text-textDefault">strokeWidth={`{2.5}`}</p>
                <p className="text-sm text-textSubtle">Active / selected state</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-textSubtle text-sm max-w-3xl">
          This pattern is used in the design system sidebar to indicate the currently active section.
        </p>
      </section>

      {/* Colour Section */}
      <section className="mb-12" id="colour">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Colour
        </h2>
        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-textSubtle mb-6 max-w-3xl">
          Icons inherit their colour from the parent text colour using <code className="font-mono text-sm bg-surfaceSubtle px-1.5 py-0.5 rounded">currentColor</code>.
          Apply colour using Tailwind text utilities.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-textDefault" />
            <p className="font-mono text-xs text-textSubtle">text-textDefault</p>
          </div>
          <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-textSubtle" />
            <p className="font-mono text-xs text-textSubtle">text-textSubtle</p>
          </div>
          <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-electric-pink" />
            <p className="font-mono text-xs text-textSubtle">text-electric-pink</p>
          </div>
          <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle text-center">
            <Search className="w-6 h-6 mx-auto mb-2 text-volt-green" />
            <p className="font-mono text-xs text-textSubtle">text-volt-green</p>
          </div>
        </div>
      </section>

      {/* Navigation Icons */}
      <section className="mb-12" id="navigation">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Navigation
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <IconGrid icons={navigationIcons} />
      </section>

      {/* Theme Icons */}
      <section className="mb-12" id="theme">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Theme
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <IconGrid icons={themeIcons} />
      </section>

      {/* Category Icons */}
      <section className="mb-12" id="categories">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Categories
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-textSubtle mb-6 max-w-3xl">
          These icons represent different content categories and navigation sections throughout the site.
        </p>
        <IconGrid icons={categoryIcons} />
      </section>

      {/* Data Icons */}
      <section className="mb-12" id="data">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Data & metrics
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-textSubtle mb-6 max-w-3xl">
          Icons used to represent race data, statistics, and metrics in the race calendar and event popups.
        </p>
        <IconGrid icons={dataIcons} />
      </section>

      {/* Design System Icons */}
      <section className="mb-12" id="design-system">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Design system
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-textSubtle mb-6 max-w-3xl">
          Icons used in the design system sidebar navigation to represent different foundation sections.
        </p>
        <IconGrid icons={designSystemIcons} />
      </section>

      {/* Usage Guidelines */}
      <section className="mb-12" id="usage">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Usage guidelines
        </h2>
        <hr className="border-t border-borderDefault mb-6" />

        <div className="space-y-6 max-w-3xl">
          <div>
            <h3 className="font-headline text-[22px] leading-tight font-medium text-textDefault mb-2">
              Import
            </h3>
            <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle font-mono text-sm">
              <code className="text-textDefault">
                {`import { IconName } from "lucide-react";`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-headline text-[22px] leading-tight font-medium text-textDefault mb-2">
              Basic usage
            </h3>
            <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle font-mono text-sm">
              <code className="text-textDefault">
                {`<Search className="w-5 h-5 text-textDefault" />`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-headline text-[22px] leading-tight font-medium text-textDefault mb-2">
              With custom stroke
            </h3>
            <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle font-mono text-sm">
              <code className="text-textDefault">
                {`<Type className="w-4 h-4" strokeWidth={2.5} />`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-headline text-[22px] leading-tight font-medium text-textDefault mb-2">
              Accessibility
            </h3>
            <p className="text-textSubtle mb-3">
              Icons used as buttons should include an accessible label:
            </p>
            <div className="p-4 rounded-lg bg-surfaceSubtle border border-borderSubtle font-mono text-sm overflow-x-auto">
              <code className="text-textDefault whitespace-pre">
{`<button aria-label="Open search">
  <Search className="w-5 h-5" />
</button>`}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Reference */}
      <section id="reference">
        <h2 className="font-headline text-[28px] leading-tight font-medium text-textDefault mb-4">
          Reference
        </h2>
        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="py-3 pr-6 text-sm font-semibold text-textDefault">Property</th>
                <th className="py-3 text-sm font-semibold text-textDefault">Value</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-6 text-textDefault">Library</td>
                <td className="py-3 text-textSubtle">lucide-react</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-6 text-textDefault">Default stroke</td>
                <td className="py-3 text-textSubtle">1.5</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-6 text-textDefault">Active stroke</td>
                <td className="py-3 text-textSubtle">2.5</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-6 text-textDefault">Small size</td>
                <td className="py-3 text-textSubtle">16px (w-4 h-4)</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-6 text-textDefault">Medium size</td>
                <td className="py-3 text-textSubtle">20px (w-5 h-5)</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-6 text-textDefault">Large size</td>
                <td className="py-3 text-textSubtle">24px (w-6 h-6)</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-6 text-textDefault">Documentation</td>
                <td className="py-3 text-textSubtle">
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

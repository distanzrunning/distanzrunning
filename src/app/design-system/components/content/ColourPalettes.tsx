import ColorSwatchGrid from "../ColorSwatchGrid";
import ColorTable from "../ColorTable";

export default function ColourPalettes() {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Colour</p>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-4">
          Palettes
        </h1>
        <p className="text-base text-textSubtle max-w-3xl">
          Our color palettes are theme-agnostic—each color maintains the same
          hex value in both light and dark modes. Theme switching is handled
          through semantic tokens that reference these base colors appropriately
          for each context.
        </p>
      </div>

      {/* Dark Mode Note */}
      <div className="bg-canvas dark:bg-[#1A1816] border-l-4 border-electric-pink p-6">
        <h3 className="font-sans font-semibold text-sm uppercase tracking-wide text-textDefault mb-2">
          Dark Mode
        </h3>
        <p className="text-sm text-textSubtle leading-relaxed">
          Use the dark mode toggle in the top-right corner to see how the
          interface adapts. The raw color values shown below remain
          constant—what changes are the <strong>semantic tokens</strong> (like{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            --color-textDefault
          </code>
          ) that swap between light and dark variants of our Greyscale palette.
          For example,{" "}
          <code className="px-1.5 py-0.5 bg-neutralBgSubtle rounded text-xs font-mono">
            textDefault
          </code>{" "}
          uses Asphalt 5 in light mode but Asphalt 95 in dark mode.
        </p>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Brand Section */}
      <section>
        <h2
          id="brand"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Brand
        </h2>
        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Core monochrome foundation used throughout the design system for text,
          backgrounds, and structural elements.
        </p>

        <ColorSwatchGrid
          swatches={[
            { name: "Black", hex: "#000000", textColor: "light" },
            { name: "White", hex: "#FFFFFF", textColor: "dark" },
          ]}
        />

        <ColorTable
          colors={[
            {
              name: "Black",
              hex: "#000000",
              rgb: "0, 0, 0",
              hsl: "0°, 0%, 0%",
              token: "--color-brand-black",
            },
            {
              name: "White",
              hex: "#FFFFFF",
              rgb: "255, 255, 255",
              hsl: "0°, 0%, 100%",
              token: "--color-brand-white",
            },
          ]}
        />
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Accent Section */}
      <section>
        <h2
          id="accent"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Accent
        </h2>
        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Purposeful color used for UI interactions, structural highlights, and
          content categorization.
        </p>

        {/* Primary - Electric Pink */}
        <div className="mb-12">
          <hr className="border-t border-borderNeutral mb-6" />
          <h3
            id="accent-primary"
            className="font-serif text-[24px] leading-[1.3] font-medium mb-3 scroll-mt-32"
          >
            Primary
          </h3>
          <p className="text-sm text-textSubtle mb-6 max-w-3xl">
            Electric Pink is the primary accent throughout the interface—used
            for links, active states, highlights, and navigation markers.
          </p>

          <ColorSwatchGrid
            swatches={[
              { name: "Electric Pink 20", hex: "#520A23", textColor: "light" },
              { name: "Electric Pink 30", hex: "#7A0F35", textColor: "light" },
              { name: "Electric Pink 45", hex: "#B8164F", textColor: "light" },
              { name: "Electric Pink 55", hex: "#D11B5C", textColor: "light" },
              { name: "Electric Pink 90", hex: "#F5D2E1", textColor: "dark" },
              { name: "Electric Pink 95", hex: "#FAE9F0", textColor: "dark" },
            ]}
          />

          <ColorTable
            colors={[
              {
                name: "Electric Pink 20",
                hex: "#520A23",
                rgb: "82, 10, 35",
                hsl: "333°, 74%, 20%",
                token: "--color-electric-pink-20",
              },
              {
                name: "Electric Pink 30",
                hex: "#7A0F35",
                rgb: "122, 15, 53",
                hsl: "333°, 74%, 30%",
                token: "--color-electric-pink-30",
              },
              {
                name: "Electric Pink 45",
                hex: "#B8164F",
                rgb: "184, 22, 79",
                hsl: "333°, 74%, 45%",
                token: "--color-electric-pink-45",
              },
              {
                name: "Electric Pink 55",
                hex: "#D11B5C",
                rgb: "209, 27, 92",
                hsl: "333°, 74%, 55%",
                token: "--color-electric-pink-55",
              },
              {
                name: "Electric Pink 90",
                hex: "#F5D2E1",
                rgb: "245, 210, 225",
                hsl: "333°, 74%, 90%",
                token: "--color-electric-pink-90",
              },
              {
                name: "Electric Pink 95",
                hex: "#FAE9F0",
                rgb: "250, 233, 240",
                hsl: "333°, 74%, 95%",
                token: "--color-electric-pink-95",
              },
            ]}
          />
        </div>

        {/* Secondary - Pace Purple & Volt Green */}
        <div className="mb-12">
          <hr className="border-t border-borderNeutral mb-6" />
          <h3
            id="accent-secondary"
            className="font-serif text-[24px] leading-[1.3] font-medium mb-3 scroll-mt-32"
          >
            Secondary
          </h3>
          <p className="text-sm text-textSubtle mb-6 max-w-3xl">
            Category colors for primary content themes—training content uses
            Pace Purple, nutrition and wellness use Volt Green.
          </p>

          <ColorSwatchGrid
            swatches={[
              { name: "Pace Purple 45", hex: "#452BB8", textColor: "light" },
              { name: "Pace Purple 55", hex: "#5E3FD1", textColor: "light" },
              { name: "Pace Purple 90", hex: "#DBD6F5", textColor: "dark" },
              { name: "Pace Purple 95", hex: "#EDEBFA", textColor: "dark" },
              { name: "Volt Green 45", hex: "#00733A", textColor: "light" },
              { name: "Volt Green 55", hex: "#008C47", textColor: "light" },
              { name: "Volt Green 90", hex: "#CCF5E0", textColor: "dark" },
              { name: "Volt Green 95", hex: "#E6FAEF", textColor: "dark" },
            ]}
          />

          <ColorTable
            colors={[
              {
                name: "Pace Purple 45",
                hex: "#452BB8",
                rgb: "69, 43, 184",
                hsl: "262°, 60%, 45%",
                token: "--color-pace-purple-45",
              },
              {
                name: "Pace Purple 55",
                hex: "#5E3FD1",
                rgb: "94, 63, 209",
                hsl: "262°, 60%, 55%",
                token: "--color-pace-purple-55",
              },
              {
                name: "Pace Purple 90",
                hex: "#DBD6F5",
                rgb: "219, 214, 245",
                hsl: "262°, 60%, 90%",
                token: "--color-pace-purple-90",
              },
              {
                name: "Pace Purple 95",
                hex: "#EDEBFA",
                rgb: "237, 235, 250",
                hsl: "262°, 60%, 95%",
                token: "--color-pace-purple-95",
              },
              {
                name: "Volt Green 45",
                hex: "#00733A",
                rgb: "0, 115, 58",
                hsl: "146°, 100%, 45%",
                token: "--color-volt-green-45",
              },
              {
                name: "Volt Green 55",
                hex: "#008C47",
                rgb: "0, 140, 71",
                hsl: "146°, 100%, 55%",
                token: "--color-volt-green-55",
              },
              {
                name: "Volt Green 90",
                hex: "#CCF5E0",
                rgb: "204, 245, 224",
                hsl: "146°, 100%, 90%",
                token: "--color-volt-green-90",
              },
              {
                name: "Volt Green 95",
                hex: "#E6FAEF",
                rgb: "230, 250, 239",
                hsl: "146°, 100%, 95%",
                token: "--color-volt-green-95",
              },
            ]}
          />
        </div>

        {/* Tertiary - Signal Orange, Track Red & Trail Brown */}
        <div className="mb-12">
          <hr className="border-t border-borderNeutral mb-6" />
          <h3
            id="accent-tertiary"
            className="font-serif text-[24px] leading-[1.3] font-medium mb-3 scroll-mt-32"
          >
            Tertiary
          </h3>
          <p className="text-sm text-textSubtle mb-6 max-w-3xl">
            Supporting category colors for specialized content—gear uses Signal
            Orange, races use Track Red, and routes use Trail Brown.
          </p>

          <ColorSwatchGrid
            swatches={[
              { name: "Signal Orange 45", hex: "#732600", textColor: "light" },
              { name: "Signal Orange 55", hex: "#8C2F00", textColor: "light" },
              { name: "Signal Orange 90", hex: "#F5D6CC", textColor: "dark" },
              { name: "Signal Orange 95", hex: "#FAEBE6", textColor: "dark" },
              { name: "Track Red 45", hex: "#B81616", textColor: "light" },
              { name: "Track Red 55", hex: "#D11B1B", textColor: "light" },
              { name: "Track Red 90", hex: "#F5D2D2", textColor: "dark" },
              { name: "Track Red 95", hex: "#FAE9E9", textColor: "dark" },
              { name: "Trail Brown 45", hex: "#73391D", textColor: "light" },
              { name: "Trail Brown 55", hex: "#8C4623", textColor: "light" },
              { name: "Trail Brown 90", hex: "#F5E6D9", textColor: "dark" },
              { name: "Trail Brown 95", hex: "#FAF2EC", textColor: "dark" },
            ]}
          />

          <ColorTable
            colors={[
              {
                name: "Signal Orange 45",
                hex: "#732600",
                rgb: "115, 38, 0",
                hsl: "14°, 100%, 45%",
                token: "--color-signal-orange-45",
              },
              {
                name: "Signal Orange 55",
                hex: "#8C2F00",
                rgb: "140, 47, 0",
                hsl: "14°, 100%, 55%",
                token: "--color-signal-orange-55",
              },
              {
                name: "Signal Orange 90",
                hex: "#F5D6CC",
                rgb: "245, 214, 204",
                hsl: "14°, 100%, 90%",
                token: "--color-signal-orange-90",
              },
              {
                name: "Signal Orange 95",
                hex: "#FAEBE6",
                rgb: "250, 235, 230",
                hsl: "14°, 100%, 95%",
                token: "--color-signal-orange-95",
              },
              {
                name: "Track Red 45",
                hex: "#B81616",
                rgb: "184, 22, 22",
                hsl: "0°, 79%, 45%",
                token: "--color-track-red-45",
              },
              {
                name: "Track Red 55",
                hex: "#D11B1B",
                rgb: "209, 27, 27",
                hsl: "0°, 79%, 55%",
                token: "--color-track-red-55",
              },
              {
                name: "Track Red 90",
                hex: "#F5D2D2",
                rgb: "245, 210, 210",
                hsl: "0°, 79%, 90%",
                token: "--color-track-red-90",
              },
              {
                name: "Track Red 95",
                hex: "#FAE9E9",
                rgb: "250, 233, 233",
                hsl: "0°, 79%, 95%",
                token: "--color-track-red-95",
              },
              {
                name: "Trail Brown 45",
                hex: "#73391D",
                rgb: "115, 57, 29",
                hsl: "25°, 59%, 45%",
                token: "--color-trail-brown-45",
              },
              {
                name: "Trail Brown 55",
                hex: "#8C4623",
                rgb: "140, 70, 35",
                hsl: "25°, 59%, 55%",
                token: "--color-trail-brown-55",
              },
              {
                name: "Trail Brown 90",
                hex: "#F5E6D9",
                rgb: "245, 230, 217",
                hsl: "25°, 59%, 90%",
                token: "--color-trail-brown-90",
              },
              {
                name: "Trail Brown 95",
                hex: "#FAF2EC",
                rgb: "250, 242, 236",
                hsl: "25°, 59%, 95%",
                token: "--color-trail-brown-95",
              },
            ]}
          />
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Greyscale Section */}
      <section>
        <h2
          id="greyscale"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Greyscale
        </h2>
        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Complete systematic greyscale covering all UI needs—15 shades from
          near-black to pure white, providing precise tonal control for both
          light and dark modes.
        </p>

        <ColorSwatchGrid
          swatches={[
            { name: "Asphalt 5", hex: "#0D0D0D", textColor: "light" },
            { name: "Asphalt 10", hex: "#1A1A1A", textColor: "light" },
            { name: "Asphalt 20", hex: "#333333", textColor: "light" },
            { name: "Asphalt 30", hex: "#4D4D4D", textColor: "light" },
            { name: "Asphalt 40", hex: "#666666", textColor: "light" },
            { name: "Asphalt 50", hex: "#808080", textColor: "light" },
            { name: "Asphalt 60", hex: "#999999", textColor: "dark" },
            { name: "Asphalt 70", hex: "#B3B3B3", textColor: "dark" },
            { name: "Asphalt 80", hex: "#CCCCCC", textColor: "dark" },
            { name: "Asphalt 90", hex: "#E5E5E5", textColor: "dark" },
            { name: "Asphalt 95", hex: "#F2F2F2", textColor: "dark" },
          ]}
        />

        <ColorTable
          colors={[
            {
              name: "Asphalt 5",
              hex: "#0D0D0D",
              rgb: "13, 13, 13",
              hsl: "0°, 0%, 5%",
              token: "--color-asphalt-5",
            },
            {
              name: "Asphalt 10",
              hex: "#1A1A1A",
              rgb: "26, 26, 26",
              hsl: "0°, 0%, 10%",
              token: "--color-asphalt-10",
            },
            {
              name: "Asphalt 20",
              hex: "#333333",
              rgb: "51, 51, 51",
              hsl: "0°, 0%, 20%",
              token: "--color-asphalt-20",
            },
            {
              name: "Asphalt 30",
              hex: "#4D4D4D",
              rgb: "77, 77, 77",
              hsl: "0°, 0%, 30%",
              token: "--color-asphalt-30",
            },
            {
              name: "Asphalt 40",
              hex: "#666666",
              rgb: "102, 102, 102",
              hsl: "0°, 0%, 40%",
              token: "--color-asphalt-40",
            },
            {
              name: "Asphalt 50",
              hex: "#808080",
              rgb: "128, 128, 128",
              hsl: "0°, 0%, 50%",
              token: "--color-asphalt-50",
            },
            {
              name: "Asphalt 60",
              hex: "#999999",
              rgb: "153, 153, 153",
              hsl: "0°, 0%, 60%",
              token: "--color-asphalt-60",
            },
            {
              name: "Asphalt 70",
              hex: "#B3B3B3",
              rgb: "179, 179, 179",
              hsl: "0°, 0%, 70%",
              token: "--color-asphalt-70",
            },
            {
              name: "Asphalt 80",
              hex: "#CCCCCC",
              rgb: "204, 204, 204",
              hsl: "0°, 0%, 80%",
              token: "--color-asphalt-80",
            },
            {
              name: "Asphalt 90",
              hex: "#E5E5E5",
              rgb: "229, 229, 229",
              hsl: "0°, 0%, 90%",
              token: "--color-asphalt-90",
            },
            {
              name: "Asphalt 95",
              hex: "#F2F2F2",
              rgb: "242, 242, 242",
              hsl: "0°, 0%, 95%",
              token: "--color-asphalt-95",
            },
          ]}
        />
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Canvas Section */}
      <section>
        <h2
          id="canvas"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Canvas
        </h2>
        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Subtle tinted backgrounds for layered sections and containers—warm
          tones for inviting spaces, cool tones for technical content. Light
          mode uses three tints per color; dark mode uses single elevated
          surfaces.
        </p>

        <ColorSwatchGrid
          swatches={[
            { name: "Warm 85", hex: "#E8E6E0", textColor: "dark" },
            { name: "Warm 90", hex: "#F0EEE8", textColor: "dark" },
            { name: "Warm 95", hex: "#F8F7F4", textColor: "dark" },
            { name: "Cool 85", hex: "#E0E6E8", textColor: "dark" },
            { name: "Cool 90", hex: "#E8EEF0", textColor: "dark" },
            { name: "Cool 95", hex: "#F4F7F8", textColor: "dark" },
            { name: "Dark Warm", hex: "#1A1816", textColor: "light" },
            { name: "Dark Cool", hex: "#16181A", textColor: "light" },
          ]}
        />

        <ColorTable
          colors={[
            {
              name: "Warm 85",
              hex: "#E8E6E0",
              rgb: "232, 230, 224",
              hsl: "45°, 15%, 85%",
              token: "--color-canvas-warm-85",
            },
            {
              name: "Warm 90",
              hex: "#F0EEE8",
              rgb: "240, 238, 232",
              hsl: "45°, 20%, 90%",
              token: "--color-canvas-warm-90",
            },
            {
              name: "Warm 95",
              hex: "#F8F7F4",
              rgb: "248, 247, 244",
              hsl: "45°, 25%, 95%",
              token: "--color-canvas-warm-95",
            },
            {
              name: "Cool 85",
              hex: "#E0E6E8",
              rgb: "224, 230, 232",
              hsl: "195°, 15%, 85%",
              token: "--color-canvas-cool-85",
            },
            {
              name: "Cool 90",
              hex: "#E8EEF0",
              rgb: "232, 238, 240",
              hsl: "195°, 20%, 90%",
              token: "--color-canvas-cool-90",
            },
            {
              name: "Cool 95",
              hex: "#F4F7F8",
              rgb: "244, 247, 248",
              hsl: "195°, 25%, 95%",
              token: "--color-canvas-cool-95",
            },
            {
              name: "Dark Warm",
              hex: "#1A1816",
              rgb: "26, 24, 22",
              hsl: "30°, 8%, 9%",
              token: "--color-canvas-dark-warm",
            },
            {
              name: "Dark Cool",
              hex: "#16181A",
              rgb: "22, 24, 26",
              hsl: "210°, 8%, 9%",
              token: "--color-canvas-dark-cool",
            },
          ]}
        />
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Status Section */}
      <section>
        <h2
          id="status"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Status
        </h2>
        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Semantic feedback colors for forms, validation, and alerts. These map
          category colors to common UI status meanings—success (Volt Green),
          warning (Signal Orange), error (Track Red), and info (Pace Purple).
          Each status has text, background, and border variants for flexible
          usage.
        </p>

        <ColorSwatchGrid
          swatches={[
            { name: "Success", hex: "#008C47", textColor: "light" },
            { name: "Success BG", hex: "#E6FAEF", textColor: "dark" },
            { name: "Warning", hex: "#8C2F00", textColor: "light" },
            { name: "Warning BG", hex: "#FAEBE6", textColor: "dark" },
            { name: "Error", hex: "#D11B1B", textColor: "light" },
            { name: "Error BG", hex: "#FAE9E9", textColor: "dark" },
            { name: "Info", hex: "#5E3FD1", textColor: "light" },
            { name: "Info BG", hex: "#EDEBFA", textColor: "dark" },
          ]}
        />

        <ColorTable
          colors={[
            {
              name: "Success Text",
              hex: "#008C47",
              rgb: "0, 140, 71",
              hsl: "146°, 100%, 55%",
              token: "--color-success-text",
            },
            {
              name: "Success Text Subtle",
              hex: "#00733A",
              rgb: "0, 115, 58",
              hsl: "146°, 100%, 45%",
              token: "--color-success-text-subtle",
            },
            {
              name: "Success Background",
              hex: "#E6FAEF",
              rgb: "230, 250, 239",
              hsl: "146°, 100%, 95%",
              token: "--color-success-bg",
            },
            {
              name: "Success Background Subtle",
              hex: "#CCF5E0",
              rgb: "204, 245, 224",
              hsl: "146°, 100%, 90%",
              token: "--color-success-bg-subtle",
            },
            {
              name: "Success Border",
              hex: "#008C47",
              rgb: "0, 140, 71",
              hsl: "146°, 100%, 55%",
              token: "--color-success-border",
            },
            {
              name: "Warning Text",
              hex: "#8C2F00",
              rgb: "140, 47, 0",
              hsl: "14°, 100%, 55%",
              token: "--color-warning-text",
            },
            {
              name: "Warning Text Subtle",
              hex: "#732600",
              rgb: "115, 38, 0",
              hsl: "14°, 100%, 45%",
              token: "--color-warning-text-subtle",
            },
            {
              name: "Warning Background",
              hex: "#FAEBE6",
              rgb: "250, 235, 230",
              hsl: "14°, 100%, 95%",
              token: "--color-warning-bg",
            },
            {
              name: "Warning Background Subtle",
              hex: "#F5D6CC",
              rgb: "245, 214, 204",
              hsl: "14°, 100%, 90%",
              token: "--color-warning-bg-subtle",
            },
            {
              name: "Warning Border",
              hex: "#8C2F00",
              rgb: "140, 47, 0",
              hsl: "14°, 100%, 55%",
              token: "--color-warning-border",
            },
            {
              name: "Error Text",
              hex: "#D11B1B",
              rgb: "209, 27, 27",
              hsl: "0°, 79%, 55%",
              token: "--color-error-text",
            },
            {
              name: "Error Text Subtle",
              hex: "#B81616",
              rgb: "184, 22, 22",
              hsl: "0°, 79%, 45%",
              token: "--color-error-text-subtle",
            },
            {
              name: "Error Background",
              hex: "#FAE9E9",
              rgb: "250, 233, 233",
              hsl: "0°, 79%, 95%",
              token: "--color-error-bg",
            },
            {
              name: "Error Background Subtle",
              hex: "#F5D2D2",
              rgb: "245, 210, 210",
              hsl: "0°, 79%, 90%",
              token: "--color-error-bg-subtle",
            },
            {
              name: "Error Border",
              hex: "#D11B1B",
              rgb: "209, 27, 27",
              hsl: "0°, 79%, 55%",
              token: "--color-error-border",
            },
            {
              name: "Info Text",
              hex: "#5E3FD1",
              rgb: "94, 63, 209",
              hsl: "262°, 60%, 55%",
              token: "--color-info-text",
            },
            {
              name: "Info Text Subtle",
              hex: "#452BB8",
              rgb: "69, 43, 184",
              hsl: "262°, 60%, 45%",
              token: "--color-info-text-subtle",
            },
            {
              name: "Info Background",
              hex: "#EDEBFA",
              rgb: "237, 235, 250",
              hsl: "262°, 60%, 95%",
              token: "--color-info-bg",
            },
            {
              name: "Info Background Subtle",
              hex: "#DBD6F5",
              rgb: "219, 214, 245",
              hsl: "262°, 60%, 90%",
              token: "--color-info-bg-subtle",
            },
            {
              name: "Info Border",
              hex: "#5E3FD1",
              rgb: "94, 63, 209",
              hsl: "262°, 60%, 55%",
              token: "--color-info-border",
            },
          ]}
        />
      </section>
    </div>
  );
}

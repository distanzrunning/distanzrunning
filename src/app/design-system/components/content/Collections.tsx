export default function Collections() {
  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Colour</p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-4"
          id="collections"
        >
          Collections
        </h1>
        <p className="text-base text-textSubtle max-w-3xl">
          Curated color combinations for specific content types and contexts.
          Collections ensure visual consistency across different sections of the
          site.
        </p>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Road Collection */}
      <section>
        <h2
          id="road"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Road
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Professional road running content - races, training, and performance.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#452BB8" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Pace Purple 45
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#5E3FD1" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Pace Purple 55
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#DBD6F5" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Pace Purple 90
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#EDEBFA" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Pace Purple 95
              </span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Track Collection */}
      <section>
        <h2
          id="track"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Track
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Track and field content - sprint, middle distance, and technical
          training.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#B81616" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Track Red 45
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#D11B1B" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Track Red 55
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5D2D2" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Track Red 90
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#FAE9E9" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Track Red 95
              </span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Trail Collection */}
      <section>
        <h2
          id="trail"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Trail
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Trail and ultrarunning content - adventure, exploration, and
          endurance.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#73391D" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Trail Brown 45
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#8C4623" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Trail Brown 55
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5E6D9" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Trail Brown 90
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#FAF2EC" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Trail Brown 95
              </span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Gear Collection */}
      <section>
        <h2
          id="gear"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Gear
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Equipment and gear reviews - shoes, watches, nutrition, and
          technology.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#007399" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Tech Cyan 45
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#008CB8" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Tech Cyan 55
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#CCF0F5" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Tech Cyan 90
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E6F7FA" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Tech Cyan 95
              </span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Nutrition Collection */}
      <section>
        <h2
          id="nutrition"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Nutrition
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6 max-w-3xl">
          Nutrition and wellness content - fueling strategies, recovery, and
          health.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#00733A" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Volt Green 45
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#008C47" }}
            >
              <span className="text-sm font-sans text-center px-2 text-white">
                Volt Green 55
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#CCF5E0" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Volt Green 90
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E6FAEF" }}
            >
              <span className="text-sm font-sans text-center px-2 text-black">
                Volt Green 95
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

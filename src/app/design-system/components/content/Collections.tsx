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

      <hr className="border-t-4 border-asphalt-10 mb-12" />

      {/* Road Collection */}
      <h2 id="road">Road</h2>
      <hr className="border-t border-borderSubtle mb-6" />
      <p className="text-base text-textSubtle mb-6">
        Professional road running content - races, training, and performance.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#B81616] flex items-end p-4">
            <span className="text-xs font-mono text-white">Track Red 45</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#D11B1B] flex items-end p-4">
            <span className="text-xs font-mono text-white">Track Red 55</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#F5D2D2] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Track Red 90
            </span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#FAE9E9] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Track Red 95
            </span>
          </div>
        </div>
      </div>

      <hr className="border-t-4 border-asphalt-10 mb-12" />

      {/* Track Collection */}
      <h2 id="track">Track</h2>
      <hr className="border-t border-borderSubtle mb-6" />
      <p className="text-base text-textSubtle mb-6">
        Track and field content - sprint, middle distance, and technical
        training.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#452BB8] flex items-end p-4">
            <span className="text-xs font-mono text-white">Pace Purple 45</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#5E3FD1] flex items-end p-4">
            <span className="text-xs font-mono text-white">Pace Purple 55</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#DBD6F5] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Pace Purple 90
            </span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#EDEBFA] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Pace Purple 95
            </span>
          </div>
        </div>
      </div>

      <hr className="border-t-4 border-asphalt-10 mb-12" />

      {/* Trail Collection */}
      <h2 id="trail">Trail</h2>
      <hr className="border-t border-borderSubtle mb-6" />
      <p className="text-base text-textSubtle mb-6">
        Trail and ultrarunning content - adventure, exploration, and endurance.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#73391D] flex items-end p-4">
            <span className="text-xs font-mono text-white">Trail Brown 45</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#8C4623] flex items-end p-4">
            <span className="text-xs font-mono text-white">Trail Brown 55</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#F5E6D9] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Trail Brown 90
            </span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#FAF2EC] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Trail Brown 95
            </span>
          </div>
        </div>
      </div>

      <hr className="border-t-4 border-asphalt-10 mb-12" />

      {/* Gear Collection */}
      <h2 id="gear">Gear</h2>
      <hr className="border-t border-borderSubtle mb-6" />
      <p className="text-base text-textSubtle mb-6">
        Equipment and gear reviews - shoes, watches, nutrition, and technology.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#732600] flex items-end p-4">
            <span className="text-xs font-mono text-white">
              Signal Orange 45
            </span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#8C2F00] flex items-end p-4">
            <span className="text-xs font-mono text-white">
              Signal Orange 55
            </span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#F5D6CC] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Signal Orange 90
            </span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#FAEBE6] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Signal Orange 95
            </span>
          </div>
        </div>
      </div>

      <hr className="border-t-4 border-asphalt-10 mb-12" />

      {/* Nutrition Collection */}
      <h2 id="nutrition">Nutrition</h2>
      <hr className="border-t border-borderSubtle mb-6" />
      <p className="text-base text-textSubtle mb-6">
        Nutrition and wellness content - fueling strategies, recovery, and
        health.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#00733A] flex items-end p-4">
            <span className="text-xs font-mono text-white">Volt Green 45</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#008C47] flex items-end p-4">
            <span className="text-xs font-mono text-white">Volt Green 55</span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#CCF5E0] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Volt Green 90
            </span>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-borderSubtle">
          <div className="w-full h-full bg-[#E6FAEF] flex items-end p-4">
            <span className="text-xs font-mono text-asphalt-10">
              Volt Green 95
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

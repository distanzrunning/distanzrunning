'use client';

type ExploreButtonProps = {
  variant?: 'default' | 'pink';
};

export function ExploreButton({ variant = 'default' }: ExploreButtonProps) {
  return (
    <div className="flex justify-center">
      <div className="relative group">
        <button
          onClick={() => {
            const marathonSection = document.getElementById('marathon-showcase');
            if (marathonSection) {
              marathonSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }}
          className={`inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 group border active:scale-[0.98] active:duration-100 focus:outline-none relative z-10
            ${
              variant === 'pink'
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white border-transparent'
                : 'text-black dark:text-white bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
        >
          <span style={{ lineHeight: '18px' }}>
            Explore the Marathon Majors
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        {/* Pink variant with rotating gradient border */}
        {variant === 'pink' && (
          <>
            {/* Rotating gradient border container */}
            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none -z-10">
              {/* Rotating gradient layer */}
              <div
                className="absolute inset-[-100%] animate-spin"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg 340deg, rgba(236, 72, 153, 0.8) 360deg)`,
                  animationDuration: '2s',
                  animationTimingFunction: 'linear'
                }}
              />
            </div>

            {/* Inner background to create border effect */}
            <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-neutral-800 pointer-events-none -z-[9]" />

            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-[11]"
              style={{
                boxShadow: '0 0 20px 5px rgba(236, 72, 153, 0.2)'
              }}
            />
          </>
        )}
        
        {/* Default variant hover effect */}
        {variant === 'default' && (
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 shadow-[0_0_20px_rgba(236,72,153,0.3)]" />
        )}
      </div>
    </div>
  );
}
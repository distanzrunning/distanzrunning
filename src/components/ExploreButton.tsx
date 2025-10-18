'use client';

type ExploreButtonProps = {
  variant?: 'default' | 'pink';
};

export function ExploreButton({ variant = 'default' }: ExploreButtonProps) {
  return (
    <div className="flex justify-center">
      <a
        onClick={(e) => {
          e.preventDefault();
          const marathonSection = document.getElementById('marathon-showcase');
          if (marathonSection) {
            marathonSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }}
        className={`group whitespace-nowrap font-medium text-sm relative m-0 flex cursor-pointer select-none items-center rounded-lg border-none p-0 no-underline outline-none ease-out focus-visible:outline-none after:pointer-events-none after:absolute after:inset-0 after:z-[0] after:rounded-lg focus-visible:after:ring active:scale-[0.98] active:duration-100 h-12 gap-2 px-5 focus-visible:after:ring-formSecondarySubtleHover justify-center
          ${
            variant === 'pink'
              ? 'text-black dark:text-white transition-shadow after:transition-border after:border after:border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:shadow-[0_0_20px_5px_rgba(236,72,153,0.2)] pr-4'
              : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
          }`}
      >
        {/* Rotating gradient border for pink variant */}
        {variant === 'pink' && (
          <>
            <div className="absolute inset-0 z-0">
              <div className="mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-md [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(236,72,153,0.8)_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]"></div>
            </div>
            <div className="absolute inset-[1px] z-[1] rounded-[7px] bg-white dark:bg-neutral-900 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800"></div>
          </>
        )}

        <div className="font-sans font-semibold text-sm capsize leading-snug transition-all duration-700 whitespace-nowrap opacity-100 z-[1]">
          Explore the Marathon Majors
        </div>
        <div className="z-[1]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </a>
    </div>
  );
}
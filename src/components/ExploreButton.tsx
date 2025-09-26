'use client';

import { motion, useTime, useTransform } from 'framer-motion';

type ExploreButtonProps = {
  variant?: 'default' | 'pink';
};

export function ExploreButton({ variant = 'default' }: ExploreButtonProps) {
  const time = useTime();
  
  // Rotating animation for pink variant
  const rotate = useTransform(time, (latest) => (latest / 25) % 360);
  
  // Enhanced gradient with more color stops for smoother effect
  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg, 
      transparent 0%, 
      rgba(236, 72, 153, 0.1) 20%, 
      rgba(236, 72, 153, 0.3) 40%, 
      rgba(168, 85, 247, 0.2) 60%, 
      rgba(236, 72, 153, 0.7) 80%, 
      transparent 100%)`;
  });

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
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white border-gray-200 dark:border-neutral-600'
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
        
        {/* Pink variant with glow and rotating border */}
        {variant === 'pink' && (
          <>
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-lg z-0 pointer-events-none blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              style={{
                background: rotatingBg,
                willChange: 'transform'
              }}
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main rotating border */}
            <motion.div
              className="absolute inset-0 rounded-lg z-0 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: rotatingBg,
                willChange: 'transform',
                mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
                maskComposite: 'xor',
                WebkitMask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
                WebkitMaskComposite: 'xor',
                padding: '2px'
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
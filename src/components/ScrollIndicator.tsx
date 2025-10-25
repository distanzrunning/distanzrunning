'use client'

import { ChevronDown } from 'lucide-react'

export default function ScrollIndicator() {
  const handleClick = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to features"
      className="group flex flex-col items-center gap-2 text-textSubtle hover:text-textDefault transition-colors duration-300"
    >
      <ChevronDown className="w-6 h-6 animate-bounce" />
    </button>
  );
}

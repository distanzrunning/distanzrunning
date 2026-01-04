'use client';

import { useRouter } from 'next/navigation';
import IntroductionShowcase from './components/IntroductionShowcase';

export default function DesignSystemPage() {
  const router = useRouter();

  const handleSectionChange = (section: string | null) => {
    if (section) {
      router.push(`/design-system/${section}/overview`);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <IntroductionShowcase onSectionChange={handleSectionChange} />
      </div>
    </div>
  );
}

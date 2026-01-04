'use client';

import IntroductionShowcase from './components/IntroductionShowcase';

export default function DesignSystemPage() {
  const handleSectionChange = (section: string | null) => {
    if (section) {
      window.location.href = `/design-system/${section}/overview`;
    }
  };

  return <IntroductionShowcase onSectionChange={handleSectionChange} />;
}

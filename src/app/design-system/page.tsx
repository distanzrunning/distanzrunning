'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import IntroductionShowcase from './components/IntroductionShowcase';
import DesignSystemTopNav from './components/DesignSystemTopNav';
import DesignSystemSidebar from './components/DesignSystemSidebar';
import PlaceholderContent from './components/PlaceholderContent';
import FoundationsOverview from './components/content/FoundationsOverview';
import DesignPrinciples from './components/content/DesignPrinciples';
import UXPrinciples from './components/content/UXPrinciples';
import ContentWithTOC from './components/ContentWithTOC';

function DesignSystemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSubsection, setActiveSubsection] = useState('overview');

  // Initialize from URL params on mount
  useEffect(() => {
    const section = searchParams.get('section');
    const subsection = searchParams.get('subsection');

    if (section) {
      setActiveSection(section);
      setActiveSubsection(subsection || 'overview');
    }
  }, [searchParams]);

  const handleSectionChange = (section: string | null) => {
    setActiveSection(section);
    setActiveSubsection('overview');

    // Update URL
    if (section) {
      router.push(`/design-system?section=${section}&subsection=overview`, { scroll: false });
    } else {
      router.push('/design-system', { scroll: false });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubsectionChange = (subsection: string) => {
    setActiveSubsection(subsection);

    // Update URL with section and subsection
    if (activeSection) {
      router.push(`/design-system?section=${activeSection}&subsection=${subsection}`, { scroll: false });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    // Show introduction if no section is selected
    if (!activeSection) {
      return <IntroductionShowcase onSectionChange={handleSectionChange} />;
    }

    // Show Foundations content
    if (activeSection === 'foundations') {
      if (activeSubsection === 'overview') {
        return <FoundationsOverview />;
      }
      if (activeSubsection === 'design-principles') {
        return (
          <ContentWithTOC
            tocTitle="Our principles"
            tocItems={[
              { id: 'less-is-more', title: 'Less is more' },
              { id: 'deliberate-typography', title: 'Deliberate typography' },
              { id: 'visual-harmony', title: 'Visual harmony' },
              { id: 'clear-wayfinding', title: 'Clear wayfinding' },
              { id: 'performance-and-precision', title: 'Performance and precision' },
              { id: 'recognisable-consistency', title: 'Recognisable consistency' }
            ]}
          >
            <DesignPrinciples />
          </ContentWithTOC>
        );
      }
      if (activeSubsection === 'ux-principles') {
        return (
          <ContentWithTOC
            tocTitle="Our UX principles"
            tocItems={[
              { id: 'user-centred-design', title: 'User-centred design' },
              { id: 'accessible-to-all', title: 'Accessible to all' },
              { id: 'progressive-disclosure', title: 'Progressive disclosure' },
              { id: 'feedback-and-response', title: 'Feedback and response' },
              { id: 'consistency-and-familiarity', title: 'Consistency and familiarity' },
              { id: 'respect-time-and-attention', title: 'Respect time and attention' }
            ]}
          >
            <UXPrinciples />
          </ContentWithTOC>
        );
      }
    }

    // Format the title based on section and subsection
    const sectionTitle = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
    const subsectionTitle = activeSubsection
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return (
      <PlaceholderContent
        title={sectionTitle}
        subsection={subsectionTitle}
      />
    );
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0d]">
      {/* Design System Top Navigation - below main site navbar */}
      <DesignSystemTopNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Conditional Sidebar - only show when a section is active */}
        {activeSection && (
          <div className="hidden lg:block lg:col-span-2 h-full">
            <DesignSystemSidebar
              section={activeSection}
              activeSubsection={activeSubsection}
              onSubsectionChange={handleSubsectionChange}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className={activeSection ? "col-span-1 lg:col-span-10" : "col-span-1 lg:col-span-12"}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DesignSystemContent />
    </Suspense>
  );
}

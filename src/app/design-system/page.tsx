'use client';

import { useState } from 'react';
import IntroductionShowcase from './components/IntroductionShowcase';
import DesignSystemTopNav from './components/DesignSystemTopNav';
import DesignSystemSidebar from './components/DesignSystemSidebar';
import PlaceholderContent from './components/PlaceholderContent';
import FoundationsOverview from './components/content/FoundationsOverview';
import DesignPrinciples from './components/content/DesignPrinciples';
import UXPrinciples from './components/content/UXPrinciples';
import ContentWithTOC from './components/ContentWithTOC';

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSubsection, setActiveSubsection] = useState('overview');

  const handleSectionChange = (section: string | null) => {
    setActiveSection(section);
    setActiveSubsection('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubsectionChange = (subsection: string) => {
    setActiveSubsection(subsection);
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
          <div className="hidden lg:block lg:col-span-2">
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

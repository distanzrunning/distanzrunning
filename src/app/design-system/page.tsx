'use client';

import { useState } from 'react';
import IntroductionShowcase from './components/IntroductionShowcase';
import DesignSystemTopNav from './components/DesignSystemTopNav';
import DesignSystemSidebar from './components/DesignSystemSidebar';
import PlaceholderContent from './components/PlaceholderContent';

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
    <div className="min-h-screen bg-white dark:bg-[#0c0c0d]">
      {/* Top Navigation */}
      <DesignSystemTopNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="flex">
        {/* Conditional Sidebar - only show when a section is active */}
        {activeSection && (
          <DesignSystemSidebar
            section={activeSection}
            activeSubsection={activeSubsection}
            onSubsectionChange={handleSubsectionChange}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

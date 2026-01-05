"use client";

import { useParams, useRouter } from "next/navigation";
import DesignSystemTopNav from "../../components/DesignSystemTopNav";
import DesignSystemSidebar from "../../components/DesignSystemSidebar";
import PlaceholderContent from "../../components/PlaceholderContent";
import FoundationsOverview from "../../components/content/FoundationsOverview";
import DesignPrinciples from "../../components/content/DesignPrinciples";
import UXPrinciples from "../../components/content/UXPrinciples";
import ColourPalettes from "../../components/content/ColourPalettes";
import Collections from "../../components/content/Collections";
import Rules from "../../components/content/Rules";
import GridSpacing from "../../components/content/GridSpacing";
import GridLayout from "../../components/content/GridLayout";
import ContentWithTOC from "../../components/ContentWithTOC";

export default function DesignSystemSubsectionPage() {
  const params = useParams();
  const router = useRouter();
  const section = params.section as string;
  const subsection = params.subsection as string;

  const handleSectionChange = (newSection: string | null) => {
    if (newSection) {
      router.push(`/design-system/${newSection}/overview`);
    } else {
      router.push("/design-system");
    }
  };

  const handleSubsectionChange = (newSubsection: string) => {
    router.push(`/design-system/${section}/${newSubsection}`);
  };

  const renderContent = () => {
    // Show Foundations content
    if (section === "foundations") {
      if (subsection === "overview") {
        return <FoundationsOverview />;
      }
      if (subsection === "design-principles") {
        return (
          <ContentWithTOC
            tocTitle="Our principles"
            mainSectionId="our-principles"
            tocItems={[
              { id: "less-is-more", title: "Less is more" },
              { id: "deliberate-typography", title: "Deliberate typography" },
              { id: "visual-harmony", title: "Visual harmony" },
              { id: "clear-wayfinding", title: "Clear wayfinding" },
              {
                id: "performance-and-precision",
                title: "Performance and precision",
              },
              {
                id: "recognisable-consistency",
                title: "Recognisable consistency",
              },
            ]}
          >
            <DesignPrinciples />
          </ContentWithTOC>
        );
      }
      if (subsection === "ux-principles") {
        return (
          <ContentWithTOC
            tocTitle="Our UX principles"
            mainSectionId="our-ux-principles"
            tocItems={[
              { id: "user-centred-design", title: "User-centred design" },
              { id: "accessible-to-all", title: "Accessible to all" },
              { id: "progressive-disclosure", title: "Progressive disclosure" },
              { id: "feedback-and-response", title: "Feedback and response" },
              {
                id: "consistency-and-familiarity",
                title: "Consistency and familiarity",
              },
              {
                id: "respect-time-and-attention",
                title: "Respect time and attention",
              },
            ]}
          >
            <UXPrinciples />
          </ContentWithTOC>
        );
      }
      if (subsection === "palettes") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              { id: "brand", title: "Brand" },
              {
                id: "accent",
                title: "Accent",
                children: [
                  { id: "accent-primary", title: "Primary" },
                  { id: "accent-secondary", title: "Secondary" },
                  { id: "accent-tertiary", title: "Tertiary" },
                ],
              },
              { id: "greyscale", title: "Greyscale" },
              { id: "canvas", title: "Canvas" },
              { id: "status", title: "Status" },
            ]}
          >
            <ColourPalettes />
          </ContentWithTOC>
        );
      }
      if (subsection === "collections") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              { id: "road", title: "Road" },
              { id: "track", title: "Track" },
              { id: "trail", title: "Trail" },
              { id: "gear", title: "Gear" },
              { id: "nutrition", title: "Nutrition" },
            ]}
          >
            <Collections />
          </ContentWithTOC>
        );
      }
      if (subsection === "rules") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              {
                id: "styles",
                title: "Styles",
                children: [
                  { id: "styles-rule", title: "Rule" },
                  { id: "styles-rule-inverse", title: "Rule (inverse)" },
                  { id: "styles-rule-emphasised", title: "Rule (emphasised)" },
                  {
                    id: "styles-rule-inverse-emphasised",
                    title: "Rule (inverse, emphasised)",
                  },
                  { id: "styles-rule-heavy", title: "Rule (heavy)" },
                  {
                    id: "styles-rule-inverse-heavy",
                    title: "Rule (inverse, heavy)",
                  },
                  { id: "styles-rule-accent", title: "Rule (accent)" },
                  {
                    id: "styles-rule-inverse-accent",
                    title: "Rule (accent, inverse)",
                  },
                ],
              },
              { id: "reference", title: "Reference" },
            ]}
          >
            <Rules />
          </ContentWithTOC>
        );
      }
      if (subsection === "grid-spacing") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              {
                id: "gap-and-gutter",
                title: "Gap and gutter",
                children: [
                  { id: "gap-and-gutter-grid-gap", title: "Grid gap" },
                  { id: "gap-and-gutter-grid-gutter", title: "Grid gutter" },
                ],
              },
            ]}
          >
            <GridSpacing />
          </ContentWithTOC>
        );
      }
      if (subsection === "grid-layout") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              { id: "column-grid", title: "Column grid" },
              {
                id: "main-wrapper",
                title: "Main wrapper",
                children: [
                  { id: "main-wrapper-classes", title: "CSS classes" },
                  {
                    id: "main-wrapper-responsive",
                    title: "Responsive behavior",
                  },
                  { id: "main-wrapper-usage", title: "Usage" },
                ],
              },
              {
                id: "resources",
                title: "Resources",
                children: [
                  { id: "resources-figma-files", title: "Figma files" },
                  { id: "resources-css-variables", title: "CSS variables" },
                ],
              },
            ]}
          >
            <GridLayout />
          </ContentWithTOC>
        );
      }
    }

    // Format the title based on section and subsection
    const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
    const subsectionTitle = subsection
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <PlaceholderContent title={sectionTitle} subsection={subsectionTitle} />
    );
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0d]">
      {/* Design System Top Navigation - below main site navbar */}
      <DesignSystemTopNav
        activeSection={section}
        onSectionChange={handleSectionChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Conditional Sidebar - only show when a section is active */}
        <div className="hidden lg:block lg:col-span-2 h-full">
          <DesignSystemSidebar
            section={section}
            activeSubsection={subsection}
            onSubsectionChange={handleSubsectionChange}
          />
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

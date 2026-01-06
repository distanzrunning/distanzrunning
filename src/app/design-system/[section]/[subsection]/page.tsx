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
import Typefaces from "../../components/content/Typefaces";
import ModularScale from "../../components/content/ModularScale";
import LineHeight from "../../components/content/LineHeight";
import TextStyles from "../../components/content/TextStyles";
import Iconography from "../../components/content/Iconography";
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
                  { id: "styles-rule-emphasised", title: "Rule (emphasised)" },
                  { id: "styles-rule-heavy", title: "Rule (heavy)" },
                  { id: "styles-rule-accent", title: "Rule (accent)" },
                ],
              },
              { id: "dark-mode", title: "Dark mode" },
              { id: "reference", title: "Reference" },
              { id: "usage", title: "Usage" },
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
              { id: "main-wrapper", title: "Main wrapper" },
              {
                id: "resources",
                title: "Resources",
                children: [
                  { id: "resources-figma-files", title: "Figma artboards" },
                ],
              },
            ]}
          >
            <GridLayout />
          </ContentWithTOC>
        );
      }
      if (subsection === "typefaces") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              {
                id: "eb-garamond",
                title: "EB Garamond",
                children: [
                  { id: "eb-garamond-regular", title: "EB Garamond" },
                  { id: "eb-garamond-italic", title: "EB Garamond Italic" },
                ],
              },
              {
                id: "inter",
                title: "Inter",
                children: [
                  { id: "inter-variable", title: "Inter Variable" },
                  { id: "inter-weights", title: "Weight spectrum" },
                ],
              },
              { id: "font-roles", title: "Font roles" },
              { id: "reference", title: "Reference" },
            ]}
          >
            <Typefaces />
          </ContentWithTOC>
        );
      }
      if (subsection === "modular-scale") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              { id: "type-scale", title: "Type scale" },
              { id: "heading-sizes", title: "Heading sizes" },
              { id: "body-text", title: "Body text" },
            ]}
          >
            <ModularScale />
          </ContentWithTOC>
        );
      }
      if (subsection === "line-height") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              {
                id: "multipliers",
                title: "Multipliers",
                children: [
                  { id: "visual-comparison", title: "Visual comparison" },
                ],
              },
              { id: "computed-values", title: "Computed values" },
              { id: "reference", title: "Reference" },
            ]}
          >
            <LineHeight />
          </ContentWithTOC>
        );
      }
      if (subsection === "text-styles") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              { id: "display", title: "Display" },
              { id: "headings", title: "Headings" },
              { id: "body", title: "Body" },
              { id: "ui", title: "UI" },
              { id: "reference", title: "Quick reference" },
            ]}
          >
            <TextStyles />
          </ContentWithTOC>
        );
      }
      if (subsection === "iconography") {
        return (
          <ContentWithTOC
            tocTitle="Contents"
            tocItems={[
              { id: "sizing", title: "Sizing" },
              { id: "stroke-weight", title: "Stroke weight" },
              { id: "colour", title: "Colour" },
              { id: "navigation", title: "Navigation" },
              { id: "theme", title: "Theme" },
              { id: "categories", title: "Categories" },
              { id: "data", title: "Data & metrics" },
              { id: "design-system", title: "Design system" },
              { id: "usage", title: "Usage guidelines" },
              { id: "reference", title: "Reference" },
            ]}
          >
            <Iconography />
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

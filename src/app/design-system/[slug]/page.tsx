"use client";

import { useParams, useRouter } from "next/navigation";
import DesignSystemHeader from "../components/DesignSystemHeader";
import DesignSystemSidebar from "../components/DesignSystemSidebar";
import PlaceholderContent from "../components/PlaceholderContent";
import FoundationsOverview from "../components/content/FoundationsOverview";
import ComponentsOverview from "../components/content/ComponentsOverview";
import DesignPrinciples from "../components/content/DesignPrinciples";
import UXPrinciples from "../components/content/UXPrinciples";
import DesignTokens from "../components/content/DesignTokens";
import ColourPalettes from "../components/content/ColourPalettes";
import Rules from "../components/content/Rules";
import GridSpacing from "../components/content/GridSpacing";
import GridLayout from "../components/content/GridLayout";
import Typefaces from "../components/content/Typefaces";
import ModularScale from "../components/content/ModularScale";
import LineHeight from "../components/content/LineHeight";
import TextStyles from "../components/content/TextStyles";
import Iconography from "../components/content/Iconography";
import Icons from "../components/content/Icons";
import ButtonComponent from "../components/content/ButtonComponent";
import ButtonIconComponent from "../components/content/ButtonIconComponent";
import SlimButtonComponent from "../components/content/SlimButtonComponent";
import SlimButtonIconComponent from "../components/content/SlimButtonIconComponent";
import CheckboxComponent from "../components/content/CheckboxComponent";
import BlockquoteComponent from "../components/content/BlockquoteComponent";
import PullQuoteComponent from "../components/content/PullQuoteComponent";
import CloseComponent from "../components/content/CloseComponent";
import ToggleComponent from "../components/content/ToggleComponent";
import ContentWithTOC from "../components/ContentWithTOC";

export default function DesignSystemPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const handleNavigation = (newSlug: string) => {
    router.push(`/design-system/${newSlug}`);
  };

  const handleHomeClick = () => {
    router.push("/design-system");
  };

  const renderContent = () => {
    // Foundations pages
    if (slug === "introduction") {
      return <FoundationsOverview />;
    }
    if (slug === "design-principles") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "ux-principles") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "design-tokens") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            { id: "what-are-tokens", title: "What are design tokens?" },
            {
              id: "token-types",
              title: "Token types",
              children: [
                { id: "global-tokens", title: "Global tokens" },
                { id: "semantic-tokens", title: "Semantic tokens" },
                { id: "component-tokens", title: "Component tokens" },
              ],
            },
            { id: "token-inheritance", title: "Token inheritance" },
            { id: "token-categories", title: "Token categories" },
            {
              id: "usage-guidelines",
              title: "Usage guidelines",
              children: [
                { id: "prefer-semantic", title: "Prefer semantic tokens" },
                {
                  id: "use-global-sparingly",
                  title: "Use global tokens sparingly",
                },
                { id: "never-hardcode", title: "Never hard-code values" },
              ],
            },
            {
              id: "implementation",
              title: "Implementation",
              children: [
                { id: "css-variables", title: "CSS custom properties" },
                { id: "tailwind-classes", title: "Tailwind classes" },
              ],
            },
          ]}
        >
          <DesignTokens />
        </ContentWithTOC>
      );
    }
    if (slug === "colours") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            { id: "scales", title: "Scales" },
            { id: "backgrounds", title: "Backgrounds" },
            {
              id: "colors-1-3-component-backgrounds",
              title: "Colors 1-3: Backgrounds",
            },
            { id: "colors-4-6-borders", title: "Colors 4-6: Borders" },
            {
              id: "colors-7-8-high-contrast-backgrounds",
              title: "Colors 7-8: Solid",
            },
            {
              id: "colors-9-10-text-and-icons",
              title: "Colors 9-10: Text & Icons",
            },
          ]}
        >
          <ColourPalettes />
        </ContentWithTOC>
      );
    }
    if (slug === "rules") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "grid-spacing") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "grid-layout") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "typefaces") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "modular-scale") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "line-height") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "text-styles") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "iconography") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "icons") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            { id: "usage", title: "Usage" },
            { id: "resources", title: "Resources" },
          ]}
        >
          <Icons />
        </ContentWithTOC>
      );
    }
    if (slug === "typography") {
      // Typography landing page - could show typefaces or text-styles
      return (
        <ContentWithTOC
          tocTitle="On this page"
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
    if (slug === "materials") {
      return <PlaceholderContent title="Foundations" subsection="Materials" />;
    }

    // Brand pages
    if (slug === "distanz") {
      return <PlaceholderContent title="Brands" subsection="Distanz" />;
    }
    if (slug === "stride") {
      return <PlaceholderContent title="Brands" subsection="Stride" />;
    }

    // Components pages
    if (slug === "button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [
                { id: "variants-primary", title: "Primary" },
                { id: "variants-inverse", title: "Inverse" },
                { id: "variants-secondary", title: "Secondary" },
                {
                  id: "variants-inverse-secondary",
                  title: "Inverse, Secondary",
                },
                { id: "variants-tertiary", title: "Tertiary" },
                {
                  id: "variants-inverse-tertiary",
                  title: "Inverse, Tertiary",
                },
              ],
            },
            {
              id: "guidelines",
              title: "Guidelines",
              children: [
                { id: "guidelines-how-to-use", title: "How to use" },
                { id: "guidelines-best-practices", title: "Best practices" },
              ],
            },
            { id: "anatomy", title: "Anatomy" },
            { id: "props", title: "Props" },
            {
              id: "colours",
              title: "Colour reference",
              children: [
                { id: "colours-primary", title: "Primary button" },
                { id: "colours-secondary", title: "Secondary button" },
                { id: "colours-tertiary", title: "Tertiary button" },
              ],
            },
          ]}
        >
          <ButtonComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "icon-button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [
                { id: "variants-primary", title: "Primary" },
                { id: "variants-inverse", title: "Inverse" },
                { id: "variants-secondary", title: "Secondary" },
                {
                  id: "variants-inverse-secondary",
                  title: "Inverse, Secondary",
                },
              ],
            },
            {
              id: "guidelines",
              title: "Guidelines",
              children: [
                { id: "guidelines-how-to-use", title: "How to use" },
                { id: "guidelines-best-practices", title: "Best practices" },
              ],
            },
            { id: "anatomy", title: "Anatomy" },
            { id: "props", title: "Props" },
            {
              id: "colours",
              title: "Colour reference",
              children: [
                { id: "colours-primary", title: "Primary icon button" },
                { id: "colours-secondary", title: "Secondary icon button" },
              ],
            },
          ]}
        >
          <ButtonIconComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "slim-button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [
                { id: "variants-primary", title: "Primary" },
                { id: "variants-inverse", title: "Inverse" },
                { id: "variants-secondary", title: "Secondary" },
                {
                  id: "variants-inverse-secondary",
                  title: "Inverse, Secondary",
                },
              ],
            },
            {
              id: "guidelines",
              title: "Guidelines",
              children: [{ id: "guidelines-how-to-use", title: "How to use" }],
            },
            { id: "anatomy", title: "Anatomy" },
            { id: "props", title: "Props" },
          ]}
        >
          <SlimButtonComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "slim-button-icon") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [
                { id: "variants-default", title: "Default" },
                { id: "variants-inverse", title: "Inverse" },
                { id: "variants-secondary", title: "Secondary" },
                {
                  id: "variants-inverse-secondary",
                  title: "Inverse, Secondary",
                },
              ],
            },
            {
              id: "guidelines",
              title: "Guidelines",
              children: [{ id: "guidelines-how-to-use", title: "How to use" }],
            },
            { id: "props", title: "Props" },
          ]}
        >
          <SlimButtonIconComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "checkbox") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [{ id: "variants-default", title: "Default" }],
            },
            { id: "props", title: "Props" },
          ]}
        >
          <CheckboxComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "blockquote") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [{ id: "variants-default", title: "Default" }],
            },
            { id: "props", title: "Props" },
            { id: "anatomy", title: "Anatomy" },
            { id: "colours", title: "Colour reference" },
          ]}
        >
          <BlockquoteComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "pull-quote") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [{ id: "variants-default", title: "Default" }],
            },
            { id: "props", title: "Props" },
            { id: "anatomy", title: "Anatomy" },
            { id: "colours", title: "Colour reference" },
            {
              id: "guidelines",
              title: "Guidelines",
              children: [
                {
                  id: "guidelines-blockquote-vs-pullquote",
                  title: "Blockquote vs Pull-quote",
                },
              ],
            },
          ]}
        >
          <PullQuoteComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "close") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            { id: "preview", title: "Preview" },
            { id: "usage", title: "Usage" },
            { id: "props", title: "Props" },
            { id: "guidelines", title: "Guidelines" },
            { id: "common-patterns", title: "Common Patterns" },
          ]}
        >
          <CloseComponent />
        </ContentWithTOC>
      );
    }

    if (slug === "toggle" || slug === "switch") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[
            {
              id: "variants",
              title: "Variants",
              children: [
                { id: "variants-default", title: "Default" },
                { id: "variants-with-label", title: "With Label" },
                { id: "variants-small", title: "Small" },
                { id: "variants-inverse", title: "Inverse" },
              ],
            },
            {
              id: "guidelines",
              title: "Guidelines",
              children: [
                { id: "guidelines-how-to-use", title: "How to use" },
                {
                  id: "guidelines-toggle-vs-checkbox",
                  title: "Toggle vs Checkbox",
                },
                { id: "guidelines-best-practices", title: "Best practices" },
              ],
            },
            { id: "anatomy", title: "Anatomy" },
            { id: "props", title: "Props" },
            {
              id: "colours",
              title: "Colour reference",
              children: [
                { id: "colours-track", title: "Track" },
                { id: "colours-thumb", title: "Thumb" },
              ],
            },
          ]}
        >
          <ToggleComponent />
        </ContentWithTOC>
      );
    }

    // Default placeholder for unimplemented pages
    const formattedTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <PlaceholderContent title="Design System" subsection={formattedTitle} />
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--ds-background-200)" }}
    >
      {/* Geist-style Header */}
      <DesignSystemHeader onHomeClick={handleHomeClick} />

      {/* Mobile/Tablet Section Header - visible below xl */}
      <div className="xl:hidden sticky top-28 z-30">
        <DesignSystemSidebar
          activeSlug={slug}
          onNavigate={handleNavigation}
          onHomeClick={handleHomeClick}
        />
      </div>

      <div className="flex">
        {/* Desktop Sidebar - hidden below xl */}
        <div className="hidden xl:block flex-shrink-0">
          <DesignSystemSidebar
            activeSlug={slug}
            onNavigate={handleNavigation}
            onHomeClick={handleHomeClick}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="p-12">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

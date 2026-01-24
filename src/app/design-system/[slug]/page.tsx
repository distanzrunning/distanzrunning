"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
import Typography from "../components/content/Typography";
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
import CodeBlockComponent from "../components/content/CodeBlockComponent";
import AvatarComponent from "../components/content/AvatarComponent";
import BadgeComponent from "../components/content/BadgeComponent";
import BrowserComponent from "../components/content/BrowserComponent";
import Materials from "../components/content/Materials";
import ContentWithTOC from "../components/ContentWithTOC";

export default function DesignSystemPage() {
  const params = useParams();
  const router = useRouter();
  const initialSlug = params.slug as string;

  // State-based navigation for SPA behavior
  const [activeSlug, setActiveSlug] = useState(initialSlug);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/\/design-system\/(.+)/);
      if (match) {
        setActiveSlug(match[1]);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync state with URL params on initial load
  useEffect(() => {
    setActiveSlug(initialSlug);
  }, [initialSlug]);

  // Update document title based on active slug
  useEffect(() => {
    const formattedTitle = activeSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    document.title = formattedTitle;
  }, [activeSlug]);

  const handleNavigation = useCallback((newSlug: string) => {
    // Update state immediately for instant navigation
    setActiveSlug(newSlug);
    // Update URL without triggering navigation
    window.history.pushState({}, "", `/design-system/${newSlug}`);
    // Scroll window to top
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleHomeClick = () => {
    router.push("/design-system");
  };

  const renderContent = () => {
    // Foundations pages
    if (activeSlug === "introduction") {
      return <FoundationsOverview />;
    }
    if (activeSlug === "design-principles") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <DesignPrinciples />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "ux-principles") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <UXPrinciples />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "design-tokens") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <DesignTokens />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "colours") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Colours"
          pageSubtitle="Learn how to work with our color system. Right click to copy raw values."
          mainSectionId="colours"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ColourPalettes />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "rules") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <Rules />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "grid-spacing") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <GridSpacing />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "grid-layout") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <GridLayout />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "typefaces") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <Typefaces />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "modular-scale") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ModularScale />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "line-height") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <LineHeight />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "text-styles") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <TextStyles />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "iconography") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <Iconography />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "icons") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Icons"
          pageSubtitle="A collection of icons used across Distanz products. Right click to copy import statement."
          mainSectionId="icons"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <Icons />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "typography") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Typography"
          pageSubtitle="Pre-set combinations of font-size, line-height, letter-spacing, and font-weight based on the Geist design system."
          mainSectionId="typography"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <Typography />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "materials") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Materials"
          pageSubtitle="Presets for radii, fills, strokes, and shadows."
          mainSectionId="materials"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <Materials />
        </ContentWithTOC>
      );
    }

    // Brand pages
    if (activeSlug === "distanz") {
      return <PlaceholderContent title="Brands" subsection="Distanz" />;
    }
    if (activeSlug === "stride") {
      return <PlaceholderContent title="Brands" subsection="Stride" />;
    }

    // Components pages
    if (activeSlug === "button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ButtonComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "icon-button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ButtonIconComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "slim-button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SlimButtonComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "slim-button-icon") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SlimButtonIconComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "checkbox") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <CheckboxComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "blockquote") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <BlockquoteComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "pull-quote") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <PullQuoteComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "close") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <CloseComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "toggle" || activeSlug === "switch") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ToggleComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "avatar") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Avatar"
          pageSubtitle="Avatars represent users or entities with images, initials, or icons."
          mainSectionId="avatar"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <AvatarComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "badge") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Badge"
          pageSubtitle="Badges are used to highlight important information or status."
          mainSectionId="badge"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <BadgeComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "browser") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Browser"
          pageSubtitle="The Browser component lets you showcase website screenshots or any other content within a realistic browser-style frame."
          mainSectionId="browser"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <BrowserComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "code-block") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Code Block"
          pageSubtitle="Code Block component used across Distanz documentation and code examples."
          mainSectionId="code-block"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <CodeBlockComponent />
        </ContentWithTOC>
      );
    }

    // Default placeholder for unimplemented pages
    const formattedTitle = activeSlug
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
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
          onHomeClick={handleHomeClick}
        />
      </div>

      <div className="flex">
        {/* Desktop Sidebar - hidden below xl */}
        <div className="hidden xl:block flex-shrink-0">
          <DesignSystemSidebar
            activeSlug={activeSlug}
            onNavigate={handleNavigation}
            onHomeClick={handleHomeClick}
          />
        </div>

        {/* Main Content Area */}
        <div
          id="main-content"
          className="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-112px)]"
        >
          <div className="p-12 flex-1 flex flex-col">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

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
        <ContentWithTOC tocTitle="On this page">
          <DesignPrinciples />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "ux-principles") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <UXPrinciples />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "design-tokens") {
      return (
        <ContentWithTOC tocTitle="On this page">
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
        >
          <ColourPalettes />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "rules") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <Rules />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "grid-spacing") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <GridSpacing />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "grid-layout") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <GridLayout />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "typefaces") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <Typefaces />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "modular-scale") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <ModularScale />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "line-height") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <LineHeight />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "text-styles") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <TextStyles />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "iconography") {
      return (
        <ContentWithTOC tocTitle="On this page">
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
        >
          <Typography />
        </ContentWithTOC>
      );
    }
    if (activeSlug === "materials") {
      return <PlaceholderContent title="Foundations" subsection="Materials" />;
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
        <ContentWithTOC tocTitle="On this page">
          <ButtonComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "icon-button") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <ButtonIconComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "slim-button") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <SlimButtonComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "slim-button-icon") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <SlimButtonIconComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "checkbox") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <CheckboxComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "blockquote") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <BlockquoteComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "pull-quote") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <PullQuoteComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "close") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <CloseComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "toggle" || activeSlug === "switch") {
      return (
        <ContentWithTOC tocTitle="On this page">
          <ToggleComponent />
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
        <div id="main-content" className="flex-1 min-w-0">
          <div className="p-12">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

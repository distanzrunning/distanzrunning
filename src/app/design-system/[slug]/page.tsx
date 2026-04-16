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
import ButtonIconComponent from "../components/content/ButtonIconComponent";
import SlimButtonComponent from "../components/content/SlimButtonComponent";
import SlimButtonIconComponent from "../components/content/SlimButtonIconComponent";
import CheckboxComponent from "../components/content/CheckboxComponent";
import ChoiceboxComponent from "../components/content/ChoiceboxComponent";
import BlockquoteComponent from "../components/content/BlockquoteComponent";
import PullQuoteComponent from "../components/content/PullQuoteComponent";
import CloseComponent from "../components/content/CloseComponent";
import ToggleComponent from "../components/content/ToggleComponent";
import CodeBlockComponent from "../components/content/CodeBlockComponent";
import CollapseComponent from "../components/content/CollapseComponent";
import ComboboxComponent from "../components/content/ComboboxComponent";
import AvatarComponent from "../components/content/AvatarComponent";
import BadgeComponent from "../components/content/BadgeComponent";
import BrowserComponent from "../components/content/BrowserComponent";
import ButtonComponentNew from "../components/content/ButtonComponentNew";
import ModalComponent from "../components/content/ModalComponent";
import CommandMenuComponent from "../components/content/CommandMenuComponent";
import ContextCardComponent from "../components/content/ContextCardComponent";
import ContextMenuComponent from "../components/content/ContextMenuComponent";
import DescriptionComponent from "../components/content/DescriptionComponent";
import DrawerComponent from "../components/content/DrawerComponent";
import EmptyStateComponent from "../components/content/EmptyStateComponent";
import EntityComponent from "../components/content/EntityComponent";
import ErrorComponent from "../components/content/ErrorComponent";
import FeedbackComponent from "../components/content/FeedbackComponent";
import GaugeComponent from "../components/content/GaugeComponent";
import GridComponent from "../components/content/GridComponent";
import InputComponent from "../components/content/InputComponent";
import KeyboardInputComponent from "../components/content/KeyboardInputComponent";
import LoadingDotsComponent from "../components/content/LoadingDotsComponent";
import MaterialComponent from "../components/content/MaterialComponent";
import MenuComponent from "../components/content/MenuComponent";
import PaginationComponent from "../components/content/PaginationComponent";
import PhoneComponent from "../components/content/PhoneComponent";
import ProgressComponent from "../components/content/ProgressComponent";
import ProjectBannerComponent from "../components/content/ProjectBannerComponent";
import RadioComponent from "../components/content/RadioComponent";
import RelativeTimeCardComponent from "../components/content/RelativeTimeCardComponent";
import ScrollerComponent from "../components/content/ScrollerComponent";
import SelectComponent from "../components/content/SelectComponent";
import SheetComponent from "../components/content/SheetComponent";
import ShowMoreComponent from "../components/content/ShowMoreComponent";
import SkeletonComponent from "../components/content/SkeletonComponent";
import SliderComponent from "../components/content/SliderComponent";
import SnippetComponent from "../components/content/SnippetComponent";
import SpinnerComponent from "../components/content/SpinnerComponent";
import SplitButtonComponent from "../components/content/SplitButtonComponent";
import StatusDotComponent from "../components/content/StatusDotComponent";
import SwitchComponent from "../components/content/SwitchComponent";
import TableComponent from "../components/content/TableComponent";
import TabsComponent from "../components/content/TabsComponent";
import TextareaComponent from "../components/content/TextareaComponent";
import ToastDSComponent from "../components/content/ToastDSComponent";
import ThemeSwitcherComponent from "../components/content/ThemeSwitcherComponent";
import TooltipComponent from "../components/content/TooltipComponent";
import MultiSelectComponent from "../components/content/MultiSelectComponent";
import NoteComponent from "../components/content/NoteComponent";
import CalendarComponent from "../components/content/CalendarComponent";
import ComponentGeneratorPage from "../components/content/ComponentGeneratorPage";
import Materials from "../components/content/Materials";
import ContentWithTOC from "../components/ContentWithTOC";
import { ToastContainer } from "@/components/ui/Toast";

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
      return (
        <ContentWithTOC
          tocTitle="On this page"
          tocItems={[]}
          pageTitle="Stride Design System"
          pageSubtitle="Distanz Running's design system for building consistent web experiences."
          mainSectionId="introduction"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <FoundationsOverview onNavigate={handleNavigation} />
        </ContentWithTOC>
      );
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
      return <div className="p-12"><PlaceholderContent title="Brands" subsection="Distanz" /></div>;
    }
    if (activeSlug === "stride") {
      return <div className="p-12"><PlaceholderContent title="Brands" subsection="Stride" /></div>;
    }

    // Components pages
    if (activeSlug === "button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Button"
          pageSubtitle="Trigger an action or event, such as submitting a form or displaying a dialog."
          mainSectionId="button"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ButtonComponentNew />
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
          pageTitle="Checkbox"
          pageSubtitle="A control that toggles between two options, checked or unchecked."
          mainSectionId="checkbox"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <CheckboxComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "choicebox") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Choicebox"
          pageSubtitle="A card-based selection component for single or multiple choice scenarios with larger tap targets."
          mainSectionId="choicebox"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ChoiceboxComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "combobox") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Combobox"
          pageSubtitle="An autocomplete input that filters and selects from a list of options."
          mainSectionId="combobox"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ComboboxComponent />
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

    if (activeSlug === "toggle") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Toggle"
          pageSubtitle="Displays a boolean value."
          mainSectionId="toggle"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ToggleComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "switch") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SwitchComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "table") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Table"
          mainSectionId="table"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <TableComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "tabs") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Tabs"
          pageSubtitle="A set of layered sections of content, known as tab panels, that are displayed one at a time."
          mainSectionId="tabs"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <TabsComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "textarea") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Textarea"
          pageSubtitle="Retrieve multi-line text input from a user."
          mainSectionId="textarea"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <TextareaComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "toast") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Toast"
          pageSubtitle="A succinct message that is displayed temporarily."
          mainSectionId="toast"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ToastDSComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "theme-switcher") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Theme Switcher"
          pageSubtitle="A segmented control for switching between system, light, and dark themes."
          mainSectionId="theme-switcher"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ThemeSwitcherComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "tooltip") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <TooltipComponent />
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

    if (activeSlug === "collapse") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Collapse"
          pageSubtitle="A set of headings, vertically stacked, that each reveal a related section of content."
          mainSectionId="collapse"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <CollapseComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "context-card") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Context Card"
          pageSubtitle="Tooltip"
          mainSectionId="context-card"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ContextCardComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "context-menu") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Context Menu"
          pageSubtitle="Displays a brief heading and subheading to communicate any additional information or context a user needs to continue."
          mainSectionId="context-menu"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ContextMenuComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "description") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Description"
          pageSubtitle="Displays a brief heading and subheading to communicate any additional information or context a user needs to continue."
          mainSectionId="description"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <DescriptionComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "drawer") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Drawer"
          pageSubtitle="Display content in a separate view from the existing context."
          mainSectionId="drawer"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <DrawerComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "empty-state") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Empty State"
          pageSubtitle="Fill spaces when no content has been added yet, or is temporarily empty due to the nature of the feature."
          mainSectionId="empty-state"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <EmptyStateComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "entity") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Entity"
          pageSubtitle="Displays up-to-two columns of content. The left column can contain arbitrary content, and the right column typically contains controls or actions related to the content in the left column."
          mainSectionId="entity"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <EntityComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "error") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Error"
          pageSubtitle="Good error design is clear, useful, and friendly. Designing concise and accurate error messages unblocks users and builds trust by meeting people where they are."
          mainSectionId="error"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ErrorComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "feedback") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Feedback"
          pageSubtitle="Gather text feedback with an associated emotion."
          mainSectionId="feedback"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <FeedbackComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "gauge") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Gauge"
          pageSubtitle="A circular visual for conveying a percentage."
          mainSectionId="gauge"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <GaugeComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "grid") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Grid"
          pageSubtitle="Display elements in a grid layout."
          mainSectionId="grid"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <GridComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "input") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Input"
          pageSubtitle="Retrieve text input from a user."
          mainSectionId="input"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <InputComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "keyboard-input") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Keyboard Input"
          pageSubtitle="Display keyboard input that triggers an action."
          mainSectionId="keyboard-input"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <KeyboardInputComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "loading-dots") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Loading Dots"
          pageSubtitle="Indicate an action running in the background."
          mainSectionId="loading-dots"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <LoadingDotsComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "material") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Material"
          pageSubtitle="Various surfaces with shadows, built on top of <Stack>."
          mainSectionId="material"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <MaterialComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "menu") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Menu"
          pageSubtitle="Dropdown menu opened via button. Supports typeahead and keyboard navigation."
          mainSectionId="menu"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <MenuComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "command-menu") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Command Menu"
          pageSubtitle="Launch a set of actions as a full-screen overlay."
          mainSectionId="command-menu"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <CommandMenuComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "modal") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Modal"
          pageSubtitle="Display popup content that requires attention or provides additional information."
          mainSectionId="modal"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ModalComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "multi-select") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Multi Select"
          pageSubtitle="A keyboard-navigable dropdown for selecting multiple items with advanced focus management."
          mainSectionId="multi-select"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <MultiSelectComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "note") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Note"
          pageSubtitle="Display text that requires attention or provides additional information."
          mainSectionId="note"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <NoteComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "pagination") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Pagination"
          pageSubtitle="Navigate between pages with previous and next links."
          mainSectionId="pagination"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <PaginationComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "phone") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Phone"
          pageSubtitle="The Phone component lets you showcase website screenshots or other content within a realistic phone-style frame."
          mainSectionId="phone"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <PhoneComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "progress") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Progress"
          pageSubtitle="Display progress relative to a limit or related to a task."
          mainSectionId="progress"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ProgressComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "project-banner") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Project Banner"
          pageSubtitle="Used for temporary, project-wide notifications that require resolution."
          mainSectionId="project-banner"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ProjectBannerComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "radio") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Radio"
          pageSubtitle="Provides single user input from a selection of options."
          mainSectionId="radio"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <RadioComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "relative-time-card") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Relative Time Card"
          pageSubtitle="Popover to show a given date in local time."
          mainSectionId="relative-time-card"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <RelativeTimeCardComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "scroller") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Scroller"
          pageSubtitle="Display an overflowing list of items."
          mainSectionId="scroller"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ScrollerComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "select") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Select"
          pageSubtitle="Display a dropdown list of items."
          mainSectionId="select"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SelectComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "sheet") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Sheet"
          pageSubtitle="Display content in a side panel that slides in from the edge of the screen."
          mainSectionId="sheet"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SheetComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "show-more") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Show more"
          pageSubtitle="Styling component to show expanded or collapsed content."
          mainSectionId="show-more"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <ShowMoreComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "skeleton") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Skeleton"
          pageSubtitle="Display a skeleton whilst another component is loading."
          mainSectionId="skeleton"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SkeletonComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "slider") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Slider"
          pageSubtitle="Input to select a value from a given range."
          mainSectionId="slider"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SliderComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "snippet") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Snippet"
          pageSubtitle="Display a snippet of copyable code for the command line."
          mainSectionId="snippet"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SnippetComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "spinner") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Spinner"
          pageSubtitle="Indicate an action running in the background."
          mainSectionId="spinner"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SpinnerComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "split-button") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Split Button"
          pageSubtitle="A button that offers a primary interaction coupled with a dropdown menu offering additional actions."
          mainSectionId="split-button"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <SplitButtonComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "status-dot") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Status Dot"
          pageSubtitle="Display an indicator of deployment status."
          mainSectionId="status-dot"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <StatusDotComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "calendar") {
      return (
        <ContentWithTOC
          tocTitle="On this page"
          pageTitle="Calendar"
          pageSubtitle="Displays a calendar from which users can select a date or range of dates."
          mainSectionId="calendar"
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
        >
          <CalendarComponent />
        </ContentWithTOC>
      );
    }

    if (activeSlug === "component-generator") {
      return <ComponentGeneratorPage />;
    }

    // Default placeholder for unimplemented pages
    const formattedTitle = activeSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <div className="p-12"><PlaceholderContent title="Design System" subsection={formattedTitle} /></div>
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--ds-background-200)" }}
    >
      {/* Geist-style Header */}
      <DesignSystemHeader
        onHomeClick={handleHomeClick}
        onNavigate={handleNavigation}
        activeSlug={activeSlug}
      />

      {/* Mobile/Tablet Section Header - visible below xl */}
      <div className="xl:hidden sticky top-[65px] z-30">
        <DesignSystemSidebar
          activeSlug={activeSlug}
          onNavigate={handleNavigation}
          onHomeClick={handleHomeClick}
        />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
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
          className="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-65px)]"
        >
          <div className="flex-1 flex flex-col">{renderContent()}</div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

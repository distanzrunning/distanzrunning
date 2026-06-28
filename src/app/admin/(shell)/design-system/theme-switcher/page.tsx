import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ThemeSwitcherComponent from "../components/content/ThemeSwitcherComponent";

export const metadata: Metadata = { title: "Theme Switcher" };

export default function ThemeSwitcherPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Theme Switcher"
      pageSubtitle="A segmented control for switching between system, light, and dark themes."
      mainSectionId="theme-switcher"
    >
      <ThemeSwitcherComponent />
    </ContentWithTOC>
  );
}

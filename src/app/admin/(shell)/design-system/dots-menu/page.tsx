import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DotsMenuComponent from "../components/content/DotsMenuComponent";

export const metadata: Metadata = { title: "Dots Menu" };

export default function DotsMenuPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Dots Menu"
      pageSubtitle="An overflow menu triggered by a three-dot icon that reveals additional actions in a dropdown."
      mainSectionId="dots-menu"
    >
      <DotsMenuComponent />
    </ContentWithTOC>
  );
}

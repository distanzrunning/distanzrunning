import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ContextMenuComponent from "../components/content/ContextMenuComponent";

export const metadata: Metadata = { title: "Context Menu" };

export default function ContextMenuPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Context Menu"
      pageSubtitle="Displays a brief heading and subheading to communicate any additional information or context a user needs to continue."
      mainSectionId="context-menu"
    >
      <ContextMenuComponent />
    </ContentWithTOC>
  );
}

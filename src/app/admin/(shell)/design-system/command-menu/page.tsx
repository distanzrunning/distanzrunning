import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CommandMenuComponent from "../components/content/CommandMenuComponent";

export const metadata: Metadata = { title: "Command Menu" };

export default function CommandMenuPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Command Menu"
      pageSubtitle="Launch a set of actions as a full-screen overlay."
      mainSectionId="command-menu"
    >
      <CommandMenuComponent />
    </ContentWithTOC>
  );
}

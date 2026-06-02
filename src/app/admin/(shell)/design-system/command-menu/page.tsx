import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CommandMenuComponent from "../components/content/CommandMenuComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Command Menu" };

export default function CommandMenuPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Command Menu"
      pageSubtitle="Launch a set of actions as a full-screen overlay."
      mainSectionId="command-menu"
      headerRight={<RegistryInstallButtons slug="command-menu" />}
    >
      <CommandMenuComponent />
    </ContentWithTOC>
  );
}

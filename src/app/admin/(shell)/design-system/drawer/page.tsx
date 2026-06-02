import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DrawerComponent from "../components/content/DrawerComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Drawer" };

export default function DrawerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Drawer"
      pageSubtitle="Display content in a separate view from the existing context."
      mainSectionId="drawer"
      headerRight={<RegistryInstallButtons slug="drawer" />}
    >
      <DrawerComponent />
    </ContentWithTOC>
  );
}

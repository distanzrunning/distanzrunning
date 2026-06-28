import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DrawerComponent from "../components/content/DrawerComponent";

export const metadata: Metadata = { title: "Drawer" };

export default function DrawerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Drawer"
      pageSubtitle="Display content in a separate view from the existing context."
      mainSectionId="drawer"
    >
      <DrawerComponent />
    </ContentWithTOC>
  );
}

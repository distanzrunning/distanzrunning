import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TabsComponent from "../components/content/TabsComponent";

export const metadata: Metadata = { title: "Tabs" };

export default function TabsPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Tabs"
      pageSubtitle="A set of layered sections of content, known as tab panels, that are displayed one at a time."
      mainSectionId="tabs"
    >
      <TabsComponent />
    </ContentWithTOC>
  );
}

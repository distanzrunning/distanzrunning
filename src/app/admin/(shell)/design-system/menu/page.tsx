import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import MenuComponent from "../components/content/MenuComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Menu"
      pageSubtitle="Dropdown menu opened via button. Supports typeahead and keyboard navigation."
      mainSectionId="menu"
      headerRight={<RegistryInstallButtons slug="menu" />}
    >
      <MenuComponent />
    </ContentWithTOC>
  );
}

import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import MaterialComponent from "../components/content/MaterialComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Material" };

export default function MaterialPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Material"
      pageSubtitle="Various surfaces with shadows, built on top of <Stack>."
      mainSectionId="material"
      headerRight={<RegistryInstallButtons slug="material" />}
    >
      <MaterialComponent />
    </ContentWithTOC>
  );
}

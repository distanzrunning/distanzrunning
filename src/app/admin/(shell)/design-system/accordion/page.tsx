import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import AccordionComponent from "../components/content/AccordionComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Accordion" };

export default function AccordionPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Accordion"
      pageSubtitle="Disclosure list — reveal grouped content on demand. Built on Base UI primitives via the shadcn workflow."
      mainSectionId="accordion"
      headerRight={<RegistryInstallButtons slug="accordion" />}
    >
      <AccordionComponent />
    </ContentWithTOC>
  );
}

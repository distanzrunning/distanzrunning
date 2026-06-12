import type { Metadata } from "next";

import ContentWithTOC from "../components/ContentWithTOC";
import FieldsetComponent from "../components/content/FieldsetComponent";

export const metadata: Metadata = { title: "Fieldset" };

export default function FieldsetPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Fieldset"
      pageSubtitle="Groups related form controls inside a bordered card with optional footer actions."
      mainSectionId="fieldset"
    >
      <FieldsetComponent />
    </ContentWithTOC>
  );
}

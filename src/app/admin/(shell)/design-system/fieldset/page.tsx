import type { Metadata } from "next";

import ContentWithTOC from "../components/ContentWithTOC";
import FieldsetComponent from "../components/content/FieldsetComponent";

export const metadata: Metadata = { title: "Fieldset" };

export default function FieldsetPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Fieldset"
      pageSubtitle="Vercel-style settings card — title + subtitle + content slot + optional footer with status text and an action. Used to stack one-setting-per-card layouts on settings pages."
      mainSectionId="fieldset"
    >
      <FieldsetComponent />
    </ContentWithTOC>
  );
}

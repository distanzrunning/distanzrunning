import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import LabelComponent from "../components/content/LabelComponent";

export const metadata: Metadata = { title: "Label" };

export default function LabelPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Label"
      pageSubtitle="Accessible text label for form controls."
      mainSectionId="label"
    >
      <LabelComponent />
    </ContentWithTOC>
  );
}

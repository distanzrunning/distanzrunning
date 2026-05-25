import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CheckboxComponent from "../components/content/CheckboxComponent";

export const metadata: Metadata = { title: "Checkbox" };

export default function CheckboxPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Checkbox"
      pageSubtitle="A control that toggles between two options, checked or unchecked."
      mainSectionId="checkbox"
    >
      <CheckboxComponent />
    </ContentWithTOC>
  );
}

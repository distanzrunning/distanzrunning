import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ComboboxComponent from "../components/content/ComboboxComponent";

export const metadata: Metadata = { title: "Combobox" };

export default function ComboboxPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Combobox"
      pageSubtitle="An autocomplete input that filters and selects from a list of options."
      mainSectionId="combobox"
    >
      <ComboboxComponent />
    </ContentWithTOC>
  );
}

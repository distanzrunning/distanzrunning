import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import RadioComponent from "../components/content/RadioComponent";

export const metadata: Metadata = { title: "Radio" };

export default function RadioPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Radio"
      pageSubtitle="Provides single user input from a selection of options."
      mainSectionId="radio"
    >
      <RadioComponent />
    </ContentWithTOC>
  );
}

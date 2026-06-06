import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DescriptionComponent from "../components/content/DescriptionComponent";

export const metadata: Metadata = { title: "Description" };

export default function DescriptionPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Description"
      pageSubtitle="Displays a brief heading and subheading to communicate any additional information or context a user needs to continue."
      mainSectionId="description"
    >
      <DescriptionComponent />
    </ContentWithTOC>
  );
}

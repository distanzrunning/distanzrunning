import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import EmptyStateComponent from "../components/content/EmptyStateComponent";

export const metadata: Metadata = { title: "Empty State" };

export default function EmptyStatePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Empty State"
      pageSubtitle="Fill spaces when no content has been added yet, or is temporarily empty due to the nature of the feature and should be designed to prevent confusion."
      mainSectionId="empty-state"
    >
      <EmptyStateComponent />
    </ContentWithTOC>
  );
}

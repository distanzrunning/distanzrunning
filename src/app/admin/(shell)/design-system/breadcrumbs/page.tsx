import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import BreadcrumbsComponent from "../components/content/BreadcrumbsComponent";

export const metadata: Metadata = { title: "Breadcrumbs" };

export default function BreadcrumbsPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Breadcrumbs"
      pageSubtitle="Navigation aid that shows the user's location within a site's hierarchy, with text and menu variants."
      mainSectionId="breadcrumbs"
    >
      <BreadcrumbsComponent />
    </ContentWithTOC>
  );
}

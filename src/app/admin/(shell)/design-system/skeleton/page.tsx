import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SkeletonComponent from "../components/content/SkeletonComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Skeleton" };

export default function SkeletonPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Skeleton"
      pageSubtitle="Display a skeleton whilst another component is loading."
      mainSectionId="skeleton"
      headerRight={<RegistryInstallButtons slug="skeleton" />}
    >
      <SkeletonComponent />
    </ContentWithTOC>
  );
}

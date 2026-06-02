import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ProjectBannerComponent from "../components/content/ProjectBannerComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Project Banner" };

export default function ProjectBannerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Project Banner"
      pageSubtitle="Used for temporary, project-wide notifications that require resolution."
      mainSectionId="project-banner"
      headerRight={<RegistryInstallButtons slug="project-banner" />}
    >
      <ProjectBannerComponent />
    </ContentWithTOC>
  );
}

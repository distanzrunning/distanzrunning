import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import AvatarComponent from "../components/content/AvatarComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Avatar" };

export default function AvatarPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Avatar"
      pageSubtitle="Avatars represent a user or a team. Stacked avatars represent a group of people."
      mainSectionId="avatar"
      headerRight={<RegistryInstallButtons slug="avatar" />}
    >
      <AvatarComponent />
    </ContentWithTOC>
  );
}

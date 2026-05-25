import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import AvatarComponent from "../components/content/AvatarComponent";

export const metadata: Metadata = { title: "Avatar" };

export default function AvatarPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Avatar"
      pageSubtitle="Avatars represent users or entities with images, initials, or icons."
      mainSectionId="avatar"
    >
      <AvatarComponent />
    </ContentWithTOC>
  );
}

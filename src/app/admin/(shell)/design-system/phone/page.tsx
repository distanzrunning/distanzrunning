import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import PhoneComponent from "../components/content/PhoneComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Phone" };

export default function PhonePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Phone"
      pageSubtitle="The Phone component lets you showcase website screenshots or other content within a realistic phone-style frame."
      mainSectionId="phone"
      headerRight={<RegistryInstallButtons slug="phone" />}
    >
      <PhoneComponent />
    </ContentWithTOC>
  );
}

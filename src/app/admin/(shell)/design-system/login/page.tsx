import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import LoginComponent from "../components/content/LoginComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Login"
      pageSubtitle="A composable card for authentication flows — logo, title, fields, submit, and footer slots."
      mainSectionId="login"
      headerRight={<RegistryInstallButtons slug="login" />}
    >
      <LoginComponent />
    </ContentWithTOC>
  );
}

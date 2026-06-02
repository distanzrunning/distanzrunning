import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CalendarComponent from "../components/content/CalendarComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Calendar"
      pageSubtitle="Displays a calendar from which users can select a date or range of dates."
      mainSectionId="calendar"
      headerRight={<RegistryInstallButtons slug="calendar" />}
    >
      <CalendarComponent />
    </ContentWithTOC>
  );
}

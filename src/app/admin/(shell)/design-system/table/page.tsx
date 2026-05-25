import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TableComponent from "../components/content/TableComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Table" };

export default function TablePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Table"
      mainSectionId="table"
      headerRight={<RegistryInstallButtons slug="table" />}
    >
      <TableComponent />
    </ContentWithTOC>
  );
}

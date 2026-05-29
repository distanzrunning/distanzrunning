import type { Metadata } from "next";

import ContentWithTOC from "../components/ContentWithTOC";
import AdminEnvFilterComponent from "../components/content/AdminEnvFilterComponent";

export const metadata: Metadata = { title: "Admin Env Filter" };

export default function AdminEnvFilterPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Admin Env Filter"
      pageSubtitle="Production / Staging / Development / All — the shared filter that scopes admin dashboards to a deployment env. URL-driven via ?env=."
      mainSectionId="admin-env-filter"
    >
      <AdminEnvFilterComponent />
    </ContentWithTOC>
  );
}

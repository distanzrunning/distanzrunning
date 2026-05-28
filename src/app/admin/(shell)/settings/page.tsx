import { getSiteSettings } from "@/lib/site-settings";

import { SettingsForm } from "./SettingsForm";

export const metadata = {
  title: "Settings — Stride Admin",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  // Intl.supportedValuesOf is Node 18+ and present in every modern
  // browser — gives the full IANA list (~400 entries).
  const timeZones = Intl.supportedValuesOf("timeZone");

  return (
    <div>
      <div
        style={{
          maxWidth: 1248,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 32,
          paddingBottom: 32,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <SettingsForm
          initialTimezone={settings.timezone}
          timeZones={timeZones}
        />
      </div>
    </div>
  );
}

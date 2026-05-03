// src/app/admin/(shell)/races/page.tsx
//
// Hub page for the Races admin section. Currently has only one
// real surface (Date Review), so we redirect straight to it.
// Add a real dashboard here once there's more than one Races
// admin surface to land on.

import { redirect } from "next/navigation";

export default function RacesIndexPage() {
  redirect("/admin/races/date-review");
}

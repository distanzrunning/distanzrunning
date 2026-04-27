// src/app/admin/studio/[[...tool]]/page.tsx
//
// Mounts the Sanity Studio at /admin/studio. Configuration lives in
// /sanity.config.ts (basePath: '/admin/studio'). Auth is handled by
// the parent /admin/studio/layout.tsx (admin cookie) plus Sanity's
// own login inside the Studio (token for api.sanity.io).

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export const dynamic = "force-static";

export default function AdminStudioPage() {
  return <NextStudio config={config} />;
}

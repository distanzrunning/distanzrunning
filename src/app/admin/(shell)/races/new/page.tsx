// src/app/admin/(shell)/races/new/page.tsx
//
// "Add race" tool (Plan 017, slice 3) — search a race name against
// Wikipedia, review the prefilled identity/records/climate facts,
// create it as an unpublished Sanity draft. See NewRaceTool.tsx for
// the flow; src/lib/raceDiscovery.ts for the pipeline.

import { listRaceCategories } from "./actions";
import NewRaceTool from "./NewRaceTool";

export const metadata = {
  title: "Add Race — Stride Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60;

export default async function NewRacePage() {
  const raceCategories = await listRaceCategories();
  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-6">
          <h1 className="m-0 text-heading-24 text-textDefault">Add Race</h1>
          <p className="mt-2 text-copy-14 text-textSubtler">
            Search Wikipedia for a race, review the prefilled facts, and
            create it as a draft.
          </p>
        </header>
        <NewRaceTool raceCategories={raceCategories} />
      </div>
    </div>
  );
}

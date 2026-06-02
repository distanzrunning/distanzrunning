import { NextResponse } from "next/server";

import { listRegistryItems } from "@/registry/items";
import type { RegistryIndex } from "@/registry/schema";

export const dynamic = "force-static";

// GET /r — shadcn registry index. Lists every published item along
// with the metadata the CLI / MCP need for discovery.
export async function GET() {
  const items = await listRegistryItems();
  const index: RegistryIndex = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "distanz-running",
    homepage: "https://distanzrunning.com",
    items: items.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      meta: item.meta,
    })),
  };
  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

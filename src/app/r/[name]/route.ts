import { NextResponse } from "next/server";

import {
  getRegistryItem,
  listRegistryItemNames,
} from "@/registry/items";

export const dynamic = "force-static";

// Pre-render every item plus its `.json`-suffixed alias.
export function generateStaticParams() {
  return listRegistryItemNames().flatMap((name) => [
    { name },
    { name: `${name}.json` },
  ]);
}

// GET /r/<name> or /r/<name>.json — shadcn registry-item JSON.
// The CLI is happy with either suffix; we accept both so URLs in
// docs (which usually carry .json) and direct fetches both work.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> },
) {
  const { name: raw } = await ctx.params;
  const name = raw.replace(/\.json$/i, "");
  const item = await getRegistryItem(name);

  if (!item) {
    return NextResponse.json(
      { error: `Registry item "${name}" not found` },
      { status: 404 },
    );
  }

  return NextResponse.json(item, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

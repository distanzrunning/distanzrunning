import { NextResponse } from "next/server";

import { getRegistryItem } from "@/registry/items";

// Dynamic so we can read the request origin to expand bare-name
// registryDependencies into absolute URLs that point back at this
// same registry.
export const dynamic = "force-dynamic";

// GET /r/<name> or /r/<name>.json — shadcn registry-item JSON.
// The CLI is happy with either suffix; we accept both so URLs in
// docs (which usually carry .json) and direct fetches both work.
export async function GET(
  req: Request,
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

  // shadcn resolves bare-name registryDependencies against its
  // default registry. Rewrite them to absolute URLs against this
  // origin so the CLI follows them back to us.
  const origin = new URL(req.url).origin;
  const resolved = {
    ...item,
    registryDependencies: item.registryDependencies?.map((dep) =>
      dep.includes("://") ? dep : `${origin}/r/${dep}.json`,
    ),
  };

  return NextResponse.json(resolved, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

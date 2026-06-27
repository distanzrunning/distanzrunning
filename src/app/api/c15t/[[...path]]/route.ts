import { c15t } from "@/lib/c15t/server";

// ============================================================================
// c15t self-hosted backend — catch-all route handler
// ----------------------------------------------------------------------------
// basePath is /api/c15t (set in baseC15tOptions), so this optional catch-all
// captures /api/c15t and everything beneath it (/init, /subjects, /consents,
// /status, /spec.json, …). c15t.handler is a Fetch-style handler; CORS is
// derived from trustedOrigins, so OPTIONS preflights are handled here too.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = (request: Request) => c15t.handler(request);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};

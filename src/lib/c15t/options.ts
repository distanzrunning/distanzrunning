import { policyPackPresets } from "@c15t/backend";
import type { C15TOptions } from "@c15t/backend";

// ============================================================================
// Shared c15t backend options (adapter-free)
// ----------------------------------------------------------------------------
// Both the runtime instance (src/lib/c15t/server.ts, pooled connection) and the
// migration CLI config (c15t.config.ts, direct connection) spread this base and
// attach their own database adapter. Keep this module free of node-only imports
// (pg/kysely) so the CLI loader and the Next server bundle can both consume it.
// ============================================================================

/**
 * Origins allowed to talk to the consent backend (CORS). Matching is
 * protocol-agnostic, so bare hosts are fine. We include the production hosts,
 * localhost for dev, and the Vercel-provided deployment/preview/prod URLs so
 * branch previews work without per-branch config.
 */
const trustedOrigins: string[] = [
  "distanzrunning.com",
  "www.distanzrunning.com",
  "localhost:3000",
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? [new URL(process.env.NEXT_PUBLIC_SITE_URL).host]
    : []),
  ...(process.env.VERCEL_URL ? [process.env.VERCEL_URL] : []),
  ...(process.env.VERCEL_BRANCH_URL ? [process.env.VERCEL_BRANCH_URL] : []),
  ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? [process.env.VERCEL_PROJECT_PRODUCTION_URL]
    : []),
];

/**
 * Signed policy snapshots keep `/init` and `POST /subjects` consistent: the
 * geo-resolved policy decision shown to the user is frozen into a JWT and
 * re-verified at write time. Optional — without the key, consent still records,
 * just without snapshot binding. We enable it only when the key is present so a
 * missing env var degrades gracefully rather than crashing the backend.
 * (`POLICY_SNAPSHOT_KEY` is branch-scoped on Vercel, like CONSENT_IP_SALT.)
 */
const policySnapshot: C15TOptions["policySnapshot"] = process.env
  .POLICY_SNAPSHOT_KEY
  ? {
      signingKey: process.env.POLICY_SNAPSHOT_KEY,
      // Re-resolve the policy at write time instead of 409-ing if a token is
      // expired/missing (e.g. a banner left open past the 30-min TTL), so a
      // late "Accept" still records the consent rather than being dropped.
      onValidationFailure: "resolve_current",
    }
  : undefined;

// `logger` is omitted so this base also satisfies `C15TConfig` (the CLI config
// type), which declares `logger?: never` — logger is managed internally.
export const baseC15tOptions: Omit<C15TOptions, "adapter" | "logger"> = {
  appName: "distanz",
  basePath: "/api/c15t",
  // Namespace c15t's tables (subject, consent, domain, …) so they can't collide
  // with our existing schema. Tables become c15t_subject, c15t_consent, etc.
  // MUST stay identical between the runtime instance and the migration CLI or
  // queries hit differently-named tables than migrations created.
  tablePrefix: "c15t_",
  trustedOrigins,
  // Mask IPs in stored consent records (IPv4 last octet / IPv6 last 80 bits
  // zeroed). This replaces our old salted-SHA-256 approach with c15t's standard
  // masking — still de-identified, no salt to manage.
  ipAddress: { tracking: true, masking: true },
  // Regional policy packs — c15t's MAINTAINED mappings (not hand-rolled lists).
  // Omitting policyPacks is deprecated and removed in 2.0 GA. Presets:
  //   europeOptIn      → EEA(30)+UK, opt-in banner, fallback when geo fails
  //   californiaOptOut → US-CA, opt-out model + GPC respected
  //   worldNoBanner    → rest-of-world default: auto-grant, no banner
  // Scope is permissive (no category allowlist), so our 4 categories all pass.
  policyPacks: [
    policyPackPresets.europeOptIn(),
    policyPackPresets.californiaOptOut(),
    policyPackPresets.worldNoBanner(),
  ],
  ...(policySnapshot ? { policySnapshot } : {}),
};

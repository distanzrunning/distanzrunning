import { NextResponse, type NextRequest } from "next/server";

// Countries where consent-on-entry is strictly required (GDPR + UK GDPR +
// Switzerland's FADP). In other regions the banner is skipped and consent
// defaults to accept-all; Global Privacy Control still auto-rejects on a
// per-visitor basis regardless of region (covers California's CCPA
// opt-out requirement).
const REGULATED_COUNTRIES = new Set([
  // EU / EEA
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EFTA
  "IS", "LI", "NO", "CH",
  // United Kingdom
  "GB",
]);

const REGION_COOKIE = "distanz-region";
const REGION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type Region = "regulated" | "other";

function classifyRegion(country: string): Region {
  const code = country.trim().toUpperCase();
  // Unknown / missing country → fall back to regulated (safe default —
  // also keeps the banner visible during local dev where Vercel's geo
  // headers aren't present).
  if (!code || code.length !== 2) return "regulated";
  return REGULATED_COUNTRIES.has(code) ? "regulated" : "other";
}

export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  const region = classifyRegion(country);

  const response = NextResponse.next();
  const existing = request.cookies.get(REGION_COOKIE)?.value;
  if (existing !== region) {
    response.cookies.set({
      name: REGION_COOKIE,
      value: region,
      path: "/",
      sameSite: "lax",
      maxAge: REGION_MAX_AGE,
    });
  }
  return response;
}

// Skip static assets and the consent API itself.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon[0-9]*|apple-icon|robots.txt|sitemap.xml|api/consent).*)",
  ],
};

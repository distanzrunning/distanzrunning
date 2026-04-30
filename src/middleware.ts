import { NextResponse, type NextRequest } from "next/server";
import {
  STAGING_COOKIE,
  STAGING_HOST,
  verifyStagingCookie,
} from "@/lib/staging-auth";

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

// Hostnames where the public site is held behind a coming-soon page
// until launch. Every request on these hosts gets rewritten to
// /coming-soon, so any deep link still lands on the holding page
// while keeping the URL the visitor typed in the address bar.
// Remove this set (or wrap in an env flag) at launch to expose the
// real site on the public domain.
const HOLDING_PAGE_HOSTS = new Set([
  "distanzrunning.com",
  "www.distanzrunning.com",
]);

const HOLDING_PAGE_PATH = "/coming-soon";

function handleHoldingPage(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host") ?? "";
  if (!HOLDING_PAGE_HOSTS.has(host)) return null;

  const { pathname } = request.nextUrl;
  // Allowlist — the holding page itself, framework internals, public
  // brand / image assets, and /api/* (newsletter signup, consent,
  // recaptcha, anything the holding page or its providers call).
  if (
    pathname === HOLDING_PAGE_PATH ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/images/")
  ) {
    return null;
  }

  const url = request.nextUrl.clone();
  url.pathname = HOLDING_PAGE_PATH;
  return NextResponse.rewrite(url);
}

async function handleStagingAuth(
  request: NextRequest,
): Promise<NextResponse | null> {
  // Staging gate applies only on the preview host.
  const host = request.headers.get("host") ?? "";
  if (host !== STAGING_HOST) return null;

  const { pathname } = request.nextUrl;
  // Always let the login UI, auth API, framework internals, and public
  // brand assets through. The /brand/ and /images/ allowlist is what
  // lets confirmation-email images render in inboxes — mail clients
  // fetch those URLs cookieless and would otherwise be redirected to
  // /login. These directories only contain public marketing assets.
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/images/")
  ) {
    return null;
  }

  const secret = process.env.AUTH_SECRET;
  // If the secret isn't configured we fail closed — redirect to /login so
  // the failure is visible rather than silently granting access.
  if (!secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookie = request.cookies.get(STAGING_COOKIE)?.value;
  const valid = await verifyStagingCookie(cookie, secret);
  if (valid) return null;

  return NextResponse.redirect(new URL("/login", request.url));
}

export async function middleware(request: NextRequest) {
  // 1. Production holding page — rewrite traffic on the public
  //    domain(s) to /coming-soon while the site is in pre-launch.
  const holdingResponse = handleHoldingPage(request);
  if (holdingResponse) return holdingResponse;

  // 2. Staging auth — redirect unauthenticated visitors to /login on the
  //    preview host. Runs before anything else so no downstream logic
  //    leaks data to unauthenticated requests.
  const authRedirect = await handleStagingAuth(request);
  if (authRedirect) return authRedirect;

  // 3. Regional gating — write / refresh the distanz-region cookie.
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  const region = classifyRegion(country);

  // 4. Forward the request pathname as a custom header so server
  //    components / layouts can branch chrome without falling back
  //    to a client-only usePathname() (which returns null during
  //    static rendering and causes a flash of the wrong navbar).
  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: forwardedHeaders },
  });
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

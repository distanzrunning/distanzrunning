// ============================================================================
// Lightweight user-agent parser for the consent dashboard breakdowns.
//
// Not a full UA database — just enough to bucket a consent row's userAgent
// into a device / browser / OS family for the ranked-breakdown panels. Order
// matters in each branch (e.g. Edge advertises "Chrome" too, so test Edge
// first). Anything unrecognised falls through to "Unknown" and the panels
// render it as an italic "(unknown)" bucket.
// ============================================================================

export interface ParsedUserAgent {
  device: "Desktop" | "Mobile" | "Tablet" | "Bot" | "Unknown";
  browser: string;
  os: string;
}

const UNKNOWN: ParsedUserAgent = {
  device: "Unknown",
  browser: "Unknown",
  os: "Unknown",
};

export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  if (!ua) return UNKNOWN;

  return {
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    os: parseOS(ua),
  };
}

function parseDevice(ua: string): ParsedUserAgent["device"] {
  if (/bot|crawler|spider|crawling|headless/i.test(ua)) return "Bot";
  // iPad reports "Macintosh" on iPadOS 13+, so catch explicit tablet hints
  // and Android-without-Mobile (Android phones include "Mobile").
  if (/\bipad\b|\btablet\b|\bkindle\b|\bplaybook\b|\bsilk\b/i.test(ua)) {
    return "Tablet";
  }
  if (/android/i.test(ua) && !/mobile/i.test(ua)) return "Tablet";
  if (/\bmobi\b|iphone|ipod|android.*mobile|windows phone/i.test(ua)) {
    return "Mobile";
  }
  if (/macintosh|windows|linux|cros|x11/i.test(ua)) return "Desktop";
  return "Unknown";
}

function parseBrowser(ua: string): string {
  if (/edg(a|ios|e)?\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  // Chrome must come before Safari (Chrome UA also contains "Safari"), and
  // CriOS is Chrome on iOS.
  if (/chrome|crios|chromium/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Unknown";
}

function parseOS(ua: string): string {
  if (/iphone|ipad|ipod|ios/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/windows nt|windows phone|win64|win32/i.test(ua)) return "Windows";
  // "Mac OS X" also appears on iPadOS, but iOS is caught above.
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/cros/i.test(ua)) return "ChromeOS";
  if (/linux|x11/i.test(ua)) return "Linux";
  return "Unknown";
}

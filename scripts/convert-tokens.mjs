// Drift guard for the Geist two-layer colour tokens.
//
// Each hue token has TWO representations in distanz-tokens.css:
//   - the HSL base        --ds-{hue}-{shade}-value: H, S%, L%   (sRGB fallback)
//   - the P3 enhancement  --ds-{hue}-{shade}: oklch(...)         (wide-gamut)
// They must describe the same colour: the HSL triplet is the CSS Color-4
// gamut-mapped rendering of the OKLCH, expressed in HSL. This script
// recomputes the expected HSL from each committed OKLCH and flags drift.
//
//   node scripts/convert-tokens.mjs           # report drift (exit 1 if any)
//   node scripts/convert-tokens.mjs --emit     # print corrected -value lines
import { readFileSync } from "node:fs";

const css = readFileSync(
  new URL("../src/registry/styles/distanz-tokens.css", import.meta.url),
  "utf8",
);

// ── colour math (OKLCH → gamut-mapped sRGB, as a browser renders it) ────────
const gammaEncode = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
function oklabToLinear(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const oklchToLinear = (L, C, hDeg) => {
  const h = (hDeg * Math.PI) / 180;
  return oklabToLinear(L, C * Math.cos(h), C * Math.sin(h));
};
const linearToOklab = (r, g, b) => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const inGamut = ([r, g, b], eps = 1e-4) =>
  [r, g, b].every((c) => c >= -eps && c <= 1 + eps);
const clampLin = ([r, g, b]) => [r, g, b].map((c) => Math.min(1, Math.max(0, c)));
const deltaEOK = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
function oklchToRgb(L, C, hDeg) {
  if (L >= 1) return [255, 255, 255];
  if (L <= 0) return [0, 0, 0];
  let lin = oklchToLinear(L, C, hDeg);
  if (!inGamut(lin)) {
    let lo = 0, hi = C;
    while (hi - lo > 1e-4) {
      const mid = (lo + hi) / 2;
      const cand = oklchToLinear(L, mid, hDeg);
      if (inGamut(cand)) lo = mid;
      else {
        const clipped = clampLin(cand);
        if (deltaEOK(linearToOklab(...cand), linearToOklab(...clipped)) < 0.02) {
          lin = clipped; lo = mid; break;
        }
        hi = mid;
      }
    }
    lin = clampLin(oklchToLinear(L, lo, hDeg));
  }
  return lin.map((c) => Math.round(gammaEncode(Math.min(1, Math.max(0, c))) * 255));
}

// sRGB ↔ HSL (the committed -value is HSL; compare in RGB space)
function rgbToHslTriplet(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  if (s < 0.006) return `0, 0%, ${Math.round(l * 100)}%`;
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// ── parse committed OKLCH (P3 blocks) + committed -value triplets ───────────
const oklch = {};
for (const m of css.matchAll(
  /--ds-([a-z]+-\d+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/g,
)) {
  // P3 light block comes first, dark second; key by occurrence keeps both —
  // but light/dark share token names. Disambiguate by which @media we're in:
  // simplest robust approach — record an array per token.
  (oklch[m[1]] ||= []).push([+m[2] / 100, +m[3], +m[4]]);
}
const values = {};
for (const m of css.matchAll(/--ds-([a-z]+-\d+)-value:\s*([\d, ]+);/g)) {
  (values[m[1]] ||= []).push(m[2].trim());
}

const emit = process.argv.includes("--emit");
let drift = 0;
const themes = ["light", "dark"];
const parse = (t) => t.replace(/%/g, "").split(", ").map(Number);
for (const token of Object.keys(oklch)) {
  oklch[token].forEach((ok, i) => {
    const expRgb = oklchToRgb(...ok);
    const expHsl = rgbToHslTriplet(...expRgb);
    if (emit) {
      console.log(`${themes[i]}  --ds-${token}-value: ${expHsl};`);
      return;
    }
    const committed = (values[token] || [])[i];
    if (!committed) return;
    // compare in RGB space — integer HSL rounding allows a small tolerance
    const comRgb = hslToRgb(...parse(committed));
    const d = comRgb.map((c, j) => Math.abs(c - expRgb[j]));
    if (Math.max(...d) > 4) {
      drift++;
      console.log(
        `DRIFT ${themes[i]} ${token.padEnd(13)} committed(${committed} → rgb ${comRgb.join(", ")}) ≠ oklch→rgb(${expRgb.join(", ")})`,
      );
    }
  });
}
if (!emit)
  console.log(drift ? `\n${drift} token(s) drifted.` : "No drift — HSL -value triplets match their OKLCH.");
process.exit(drift && !emit ? 1 : 0);

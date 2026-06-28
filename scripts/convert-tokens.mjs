// Same-hue sanity guard for the Geist two-layer colour tokens.
//
// Each hue token has TWO representations in distanz-tokens.css, and BOTH are
// copied verbatim from Geist — neither is derived from the other:
//   - the HSL base        --ds-{hue}-{shade}-value: H, S%, L%   (sRGB fallback)
//   - the P3 enhancement  --ds-{hue}-{shade}: oklch(...)         (wide-gamut)
// Geist authors the sRGB fallback independently of the P3 colour (the sRGB
// red is deliberately softer than the gamut-mapped P3 red would be), so the
// HSL is NOT a gamut-map of the OKLCH and must not be regenerated from it.
//
// This guard therefore checks only that the two layers describe the SAME HUE
// (within 25° in OKLCH) — catching a fat-finger / wrong-colour paste (a red
// token carrying a blue HSL) without flagging Geist's intentional saturation
// and lightness differences between the layers.
//
//   node scripts/convert-tokens.mjs      # report hue mismatches (exit 1 if any)
import { readFileSync } from "node:fs";

const css = readFileSync(
  new URL("../src/registry/styles/distanz-tokens.css", import.meta.url),
  "utf8",
);

// ── sRGB HSL → OKLCH (to read back the committed fallback's hue) ─────────────
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function rgbToOklch(r, g, b) {
  [r, g, b] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { C, h };
}

// ── parse committed OKLCH (P3 blocks) + committed HSL -value triplets ────────
// document order is light block first, dark second, for both layers.
const oklch = {};
for (const m of css.matchAll(
  /--ds-([a-z]+-\d+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/g,
)) {
  (oklch[m[1]] ||= []).push({ C: +m[3], h: +m[4] });
}
const values = {};
for (const m of css.matchAll(/--ds-([a-z]+-\d+)-value:\s*([^;]+);/g)) {
  (values[m[1]] ||= []).push(m[2].trim());
}

const HUE_TOLERANCE = 25; // degrees in OKLCH
const CHROMA_FLOOR = 0.02; // below this, hue is meaningless (neutrals)
const themes = ["light", "dark"];
let mismatches = 0;

for (const token of Object.keys(oklch)) {
  oklch[token].forEach((decl, i) => {
    const committed = (values[token] || [])[i];
    if (!committed) return;
    const [h, s, l] = committed.replace(/%/g, "").split(",").map((n) => +n.trim());
    const got = rgbToOklch(...hslToRgb(h, s, l));
    if (decl.C < CHROMA_FLOOR || got.C < CHROMA_FLOOR) return; // neutral
    let dh = Math.abs(decl.h - got.h);
    if (dh > 180) dh = 360 - dh;
    if (dh > HUE_TOLERANCE) {
      mismatches++;
      console.log(
        `HUE MISMATCH ${themes[i]} ${token.padEnd(13)} oklch h=${decl.h}° vs HSL(${committed}) → h=${got.h.toFixed(1)}°  (Δ${dh.toFixed(1)}°)`,
      );
    }
  });
}

console.log(
  mismatches
    ? `\n${mismatches} token(s) have mismatched hues between layers.`
    : "OK — every token's HSL fallback and OKLCH share the same hue.",
);
process.exit(mismatches ? 1 : 0);

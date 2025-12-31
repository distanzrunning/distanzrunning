/**
 * Generate CSS Custom Properties from Design Tokens
 *
 * This file converts our TypeScript design tokens into CSS variables
 * that can be used throughout the application.
 */

import { colors, fonts, fontWeights, typography, spacing } from './design-tokens';

/**
 * Convert RGB string to tuple
 * "rgb(17, 24, 39)" -> "17, 24, 39"
 */
function extractRgbValues(rgbString: string): string {
  const match = rgbString.match(/rgb\((\d+,\s*\d+,\s*\d+)\)/);
  return match ? match[1] : rgbString;
}

/**
 * Generate CSS variables for colors
 */
export function generateColorVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  // Semantic colors (light mode)
  Object.entries(colors.semantic.light).forEach(([key, value]) => {
    const varName = `--color-${key}`;
    vars[varName] = extractRgbValues(value);
  });

  return vars;
}

/**
 * Generate dark mode color overrides
 */
export function generateDarkModeVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  Object.entries(colors.semantic.dark).forEach(([key, value]) => {
    const varName = `--color-${key}`;
    vars[varName] = extractRgbValues(value);
  });

  return vars;
}

/**
 * Generate CSS variable declarations as a string
 */
export function toCssVariables(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

/**
 * Example usage:
 *
 * const lightModeVars = generateColorVars();
 * const darkModeVars = generateDarkModeVars();
 *
 * In CSS:
 * :root {
 *   ${toCssVariables(lightModeVars)}
 * }
 *
 * .dark {
 *   ${toCssVariables(darkModeVars)}
 * }
 */

"use client";

import { useState, useEffect } from "react";
import type { BundledLanguage } from "shiki";

// Token with dual theme colors
export interface DualThemeToken {
  content: string;
  color: string; // Light theme color
  darkColor: string; // Dark theme color (from --shiki-dark)
  fontStyle?: number;
}

// Map language prop to Shiki language
export function getShikiLanguage(
  language?: string,
  filename?: string,
): BundledLanguage {
  const ext = filename?.split(".").pop()?.toLowerCase();
  const lang = language?.toLowerCase() || ext;

  switch (lang) {
    case "js":
    case "javascript":
      return "javascript";
    case "ts":
    case "typescript":
      return "typescript";
    case "jsx":
      return "jsx";
    case "tsx":
    case "next":
      return "tsx";
    case "lua":
      return "lua";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    case "python":
    case "py":
      return "python";
    case "rust":
    case "rs":
      return "rust";
    case "go":
      return "go";
    case "bash":
    case "sh":
    case "shell":
      return "bash";
    default:
      return "javascript";
  }
}

// Hook that returns tokens with dual theme colors
export function useShikiHighlighter(
  code: string,
  language?: string,
  filename?: string,
  /**
   * Gate tokenization. Pass the code panel's open state so collapsed blocks
   * (the default on every page) skip the Shiki load + tokenize entirely —
   * highlighting only runs the first time a panel is expanded.
   */
  enabled: boolean = true,
): DualThemeToken[][] | null {
  const [tokenizedLines, setTokenizedLines] = useState<
    DualThemeToken[][] | null
  >(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const lang = getShikiLanguage(language, filename);

    // Lazy-load Shiki so its (large) bundle stays out of each route's initial
    // JS chunk — it loads once on demand and is cached across navigations, so
    // page transitions aren't blocked downloading/parsing the highlighter.
    import("shiki")
      .then(({ codeToTokens }) =>
        codeToTokens(code, {
          lang,
          themes: {
            light: "one-light",
            dark: "one-dark-pro",
          },
        }),
      )
      .then((result) => {
        if (cancelled) return;
        // Transform tokens to extract both light and dark colors
        const dualThemeTokens: DualThemeToken[][] = result.tokens.map((line) =>
          line.map((token) => {
            const htmlStyle = token.htmlStyle as
              | Record<string, string>
              | undefined;
            return {
              content: token.content,
              color: htmlStyle?.color || "inherit",
              darkColor:
                htmlStyle?.["--shiki-dark"] || htmlStyle?.color || "inherit",
              fontStyle: token.fontStyle,
            };
          }),
        );
        setTokenizedLines(dualThemeTokens);
      });

    return () => {
      cancelled = true;
    };
  }, [code, language, filename, enabled]);

  return tokenizedLines;
}

// Get style for a token (uses CSS custom property for dark mode)
export function getTokenStyle(
  token: DualThemeToken,
  diffMode?: "added" | "removed",
): React.CSSProperties {
  const style: React.CSSProperties = {};

  if (diffMode) {
    const content = token.content.trim();

    // Keywords like true/false are green in diff
    if (
      content === "true" ||
      content === "false" ||
      content === "null" ||
      content === "undefined"
    ) {
      style.color = "var(--ds-green-900)";
    }
    // Identifiers/property names are red
    else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(content) && content.length > 0) {
      style.color = "var(--ds-red-900)";
    }
    // Everything else is greyscale
    else {
      style.color = "var(--ds-gray-1000)";
    }
  } else {
    // Use CSS custom property with light as default, dark as override
    style.color = token.color;
    // The --shiki-dark variable will be applied via CSS when in dark mode
    (style as Record<string, string>)["--shiki-dark"] = token.darkColor;
  }

  if (token.fontStyle === 1) {
    style.fontStyle = "italic";
  }
  if (token.fontStyle === 2) {
    style.fontWeight = "bold";
  }

  return style;
}

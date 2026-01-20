"use client";

import { useState, useEffect } from "react";
import { codeToTokens, type BundledLanguage, type ThemedToken } from "shiki";

// Map language prop to Shiki language
export function getShikiLanguage(
  language?: string,
  filename?: string
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

export function useShikiHighlighter(
  code: string,
  language?: string,
  filename?: string
): ThemedToken[][] | null {
  const [tokenizedLines, setTokenizedLines] = useState<ThemedToken[][] | null>(
    null
  );

  useEffect(() => {
    const lang = getShikiLanguage(language, filename);

    codeToTokens(code, {
      lang,
      theme: "github-dark",
    }).then((result) => {
      setTokenizedLines(result.tokens);
    });
  }, [code, language, filename]);

  return tokenizedLines;
}

// Render a single Shiki token with optional diff mode
export function renderShikiToken(
  token: ThemedToken,
  diffMode?: "added" | "removed"
): React.CSSProperties {
  let style: React.CSSProperties = {};

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
  } else if (token.color) {
    style.color = token.color;
  }

  if (token.fontStyle === 1) {
    style.fontStyle = "italic";
  }
  if (token.fontStyle === 2) {
    style.fontWeight = "bold";
  }

  return style;
}

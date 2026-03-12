import { NextRequest } from "next/server";
import { transform } from "sucrase";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json({ error: "Code is required" }, { status: 400 });
    }

    // Strip "use client" directive (not needed in iframe preview)
    let cleaned = code.replace(/^["']use client["'];?\s*/m, "");

    // Strip markdown code fences if present
    const fenceMatch = cleaned.match(
      /```(?:tsx?|jsx?|javascript|typescript)?\s*\n([\s\S]*?)```/,
    );
    if (fenceMatch) {
      cleaned = fenceMatch[1];
    } else {
      const openFence = cleaned.match(
        /```(?:tsx?|jsx?|javascript|typescript)?\s*\n([\s\S]*)/,
      );
      if (openFence) {
        cleaned = openFence[1];
      }
      cleaned = cleaned
        .replace(/^```\w*\n?/gm, "")
        .replace(/```\s*$/gm, "");
    }

    cleaned = cleaned.trim();

    // Sucrase works correctly in Node.js — handles all TypeScript syntax
    const result = transform(cleaned, {
      transforms: ["typescript", "jsx", "imports"],
      jsxRuntime: "classic",
      jsxPragma: "React.createElement",
      jsxFragmentPragma: "React.Fragment",
      production: true,
    });

    return Response.json({ code: result.code });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ error: msg }, { status: 422 });
  }
}

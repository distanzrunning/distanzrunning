import { NextRequest } from "next/server";
import ts from "typescript";

/**
 * Extract actual code from AI output that may include explanatory text,
 * markdown fences, or other non-code content.
 */
function extractCode(raw: string): string {
  let cleaned = raw;

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

  // Strip "use client" directive (not needed in iframe preview)
  cleaned = cleaned.replace(/^["']use client["'];?\s*/m, "");

  // If the code starts with non-code text (AI explanation), strip lines
  // before the first line that looks like actual code
  const lines = cleaned.split("\n");
  const codeStartIdx = lines.findIndex((line) => {
    const trimmed = line.trim();
    return (
      trimmed === "" ||
      trimmed.startsWith("import ") ||
      trimmed.startsWith("import{") ||
      trimmed.startsWith("export ") ||
      trimmed.startsWith("const ") ||
      trimmed.startsWith("let ") ||
      trimmed.startsWith("var ") ||
      trimmed.startsWith("function ") ||
      trimmed.startsWith("class ") ||
      trimmed.startsWith("interface ") ||
      trimmed.startsWith("type ") ||
      trimmed.startsWith("enum ") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*")
    );
  });

  if (codeStartIdx > 0) {
    cleaned = lines.slice(codeStartIdx).join("\n");
  }

  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json({ error: "Code is required" }, { status: 400 });
    }

    const cleaned = extractCode(code);

    if (!cleaned) {
      return Response.json({ error: "No code found in input" }, { status: 422 });
    }

    // Use TypeScript's own compiler — handles ALL TypeScript syntax perfectly
    const result = ts.transpileModule(cleaned, {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ES2020,
        jsx: ts.JsxEmit.React,
        jsxFactory: "React.createElement",
        jsxFragmentFactory: "React.Fragment",
        esModuleInterop: true,
        allowJs: true,
        removeComments: false,
      },
      reportDiagnostics: true,
    });

    // Check for critical transpilation errors
    const errors = result.diagnostics?.filter(
      (d) => d.category === ts.DiagnosticCategory.Error,
    );
    if (errors && errors.length > 0) {
      const errorMsg = errors
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"))
        .join("\n");
      // Include a tail snippet of the code to help debug truncation issues
      const tail = cleaned.slice(-200);
      return Response.json(
        { error: errorMsg, codeTail: `...${tail}`, codeLength: cleaned.length },
        { status: 422 },
      );
    }

    return Response.json({ code: result.outputText });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ error: msg }, { status: 422 });
  }
}

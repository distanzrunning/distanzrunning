import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Read a component source file from the repo. Routes that use this
// are listed in next.config.ts under outputFileTracingIncludes so
// Vercel keeps the .tsx files in the deployed bundle.
export function loadComponentSource(fileName: string): Promise<string> {
  const path = join(process.cwd(), "src/components/ui", fileName);
  return readFile(path, "utf-8");
}

// Read a CSS file from src/registry/styles. Same tracing rules apply.
export function loadStyleAsset(fileName: string): Promise<string> {
  const path = join(process.cwd(), "src/registry/styles", fileName);
  return readFile(path, "utf-8");
}

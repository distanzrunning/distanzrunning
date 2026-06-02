import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Read a component source file from src/components/ui. Routes that
// use this are listed in next.config.ts under outputFileTracingIncludes
// so Vercel keeps the .tsx files in the deployed bundle.
export function loadComponentSource(fileName: string): Promise<string> {
  return loadSource(`src/components/ui/${fileName}`);
}

// Load any source file from the repo (relative to repo root). Used
// for items that live outside src/components/ui — e.g. context
// providers under src/contexts, or page-level wrappers under
// src/components.
export function loadSource(relativePath: string): Promise<string> {
  return readFile(join(process.cwd(), relativePath), "utf-8");
}

// Read a CSS file from src/registry/styles. Same tracing rules apply.
export function loadStyleAsset(fileName: string): Promise<string> {
  const path = join(process.cwd(), "src/registry/styles", fileName);
  return readFile(path, "utf-8");
}

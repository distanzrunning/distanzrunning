// src/lib/modelJson.ts
//
// Tolerant parsing for model-emitted JSON. Haiku mostly obeys
// "STRICT JSON only", but occasionally wraps the object in ```json
// fences or appends a trailing explanation sentence — either of
// which kills a bare JSON.parse. This strips fences, then parses
// the FIRST balanced top-level object in the text.

export function parseModelJson<T>(raw: string): T {
  const text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  try {
    return JSON.parse(text) as T;
  } catch {
    // Fall through to balanced-object extraction.
  }
  const start = text.indexOf("{");
  if (start < 0) throw new Error("No JSON object in model output");
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      if (inString) escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return JSON.parse(text.slice(start, i + 1)) as T;
      }
    }
  }
  throw new Error("Unbalanced JSON object in model output");
}

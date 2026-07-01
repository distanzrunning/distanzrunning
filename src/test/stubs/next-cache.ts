// Test stub for `next/cache`, aliased in vitest.config.ts.
//
// The admin data modules wrap fetchers with `unstable_cache(fn, keys, opts)`
// at module scope, so importing them under Vitest evaluates that call. The
// real `next/cache` needs a Next request/runtime context; the pure functions
// under test (parseFilters, matchesFilters, rankBreakdowns, …) don't use the
// cache at all. This pass-through keeps module import side-effect-free without
// stubbing anything inside the module itself.

export function unstable_cache<T extends (...args: unknown[]) => unknown>(
  fn: T,
): T {
  return fn;
}

export function revalidateTag(): void {}
export function revalidatePath(): void {}

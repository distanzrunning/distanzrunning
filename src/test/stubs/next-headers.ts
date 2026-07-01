// Test stub for `next/headers`, aliased in vitest.config.ts.
//
// admin-auth.ts imports `cookies` at module scope. The pure functions under
// test (adminCookieValueFor, passwordIsValid, deriveCookie) never call it; this
// stub just lets the module import under the node test env. isAdminAuthenticated
// (which does read the cookie store) is exercised via its runtime, not here.

export async function cookies() {
  return {
    get: (_name: string): { value: string } | undefined => undefined,
    set: (): void => {},
    delete: (): void => {},
  };
}

export function headers() {
  return new Map<string, string>();
}

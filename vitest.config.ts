import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Pass-through the Next data cache so admin data modules import cleanly
      // under the node test env (see src/test/stubs/next-cache.ts).
      "next/cache": fileURLToPath(
        new URL("./src/test/stubs/next-cache.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});

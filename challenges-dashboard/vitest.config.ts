import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      "**/coverage/**",
      // Playwright E2E specs are executed via `npm run test:e2e`
      "tests/e2e/**",
      "**/*.spec.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", ".astro/", "coverage/"],
    },
  },
});

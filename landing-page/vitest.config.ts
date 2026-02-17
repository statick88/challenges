import { defineConfig } from "vitest/config";
import { getViteConfig } from "astro/config";

export default defineConfig({
  ...getViteConfig(),
  test: {
    include: ["**/*.{test,spec}.{js,ts,astro}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    environment: "jsdom",
  },
});

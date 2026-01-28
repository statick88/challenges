import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [tailwind()],
  output: "static",
  build: {
    format: "directory"
  },
  vite: {
    optimizeDeps: {
      exclude: ["astro"]
    }
  }
});
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  output: "static",
  site: "https://statick88.github.io/challenges",
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `_astro/[name]-[hash].js`,
          chunkFileNames: `_astro/[name]-[hash].js`,
          assetFileNames: `_astro/[name]-[hash][extname]`,
        },
      },
    },
  },
});

import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// Siempre usar el base path para GitHub Pages
// El repositorio se sirve en /challenges/
const repoName = "challenges";

export default defineConfig({
  integrations: [tailwind()],
  output: "static",
  site: "https://statick88.github.io",
  base: `/${repoName}`,
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/global.css";`,
        },
      },
    },
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

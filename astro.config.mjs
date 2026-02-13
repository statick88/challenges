import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  output: "static",
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
      // Genera nombres únicos para evitar cache
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

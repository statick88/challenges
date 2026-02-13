import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// Detectar si estamos en GitHub Pages o en desarrollo
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "challenges"; // Nombre del repositorio

export default defineConfig({
  integrations: [tailwind()],
  output: "static",
  // Configuración para GitHub Pages
  site: "https://statick88.github.io",
  base: isGitHubPages ? `/${repoName}` : undefined,
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

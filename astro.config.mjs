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
  },
});

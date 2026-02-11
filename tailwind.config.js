/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0f172a",
        "dark-card": "#1e293b",
        "dark-border": "#334155",
      },
    },
  },
  plugins: [],
};

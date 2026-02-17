/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Paleta principal basada en statick88.github.io
        primary: {
          DEFAULT: "#0a0e1a",
          light: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1b243d",
          light: "#f4f4f4",
        },
        accent: {
          DEFAULT: "#4c80cc",
          hover: "#5a8fd4",
          muted: "rgba(76, 128, 204, 0.3)",
        },
        border: {
          DEFAULT: "#2a2a2a",
          light: "#dddddd",
        },
        text: {
          primary: "#ffffff",
          secondary: "#b8b8b8",
          muted: "#666666",
          dark: "#000000",
          "dark-secondary": "#444444",
        },
        // Colores de estado
        success: "#1a7f37",
        warning: "#f59e0b",
        error: "#dc2626",
        // Colores de categoría
        linux: {
          DEFAULT: "#f97316",
          gradient: "from-orange-500 to-red-600",
        },
        docker: {
          DEFAULT: "#3b82f6",
          gradient: "from-blue-500 to-cyan-600",
        },
        devops: {
          DEFAULT: "#a855f7",
          gradient: "from-purple-500 to-pink-600",
        },
        ctf: {
          DEFAULT: "#22c55e",
          gradient: "from-green-500 to-emerald-600",
        },
        htb: {
          DEFAULT: "#10b981",
          gradient: "from-green-500 to-emerald-600",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        accent: "0 0 20px rgba(76, 128, 204, 0.3)",
        "accent-hover": "0 0 30px rgba(76, 128, 204, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

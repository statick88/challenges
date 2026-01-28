/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",      // slate-900 - fondo principal
        secondary: "#1e293b",    // slate-800 - cards y panels
        accent: "#10b981",       // emerald-500 - elementos interactivos
        success: "#22c55e",      // green-500 - métricas positivas
        warning: "#f59e0b",      // amber-500 - alertas y warnings
        text: "#f8fafc",         // slate-50 - texto principal
        muted: "#94a3b8"         // slate-400 - texto secundario
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      animation: {
        "counter": "counter 2s ease-out",
        "progress-fill": "progress-fill 1s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out"
      },
      keyframes: {
        counter: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
}
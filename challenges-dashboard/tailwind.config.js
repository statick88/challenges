/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary))",
          50: "rgb(248 250 252)",
          100: "rgb(241 245 249)",
          // ... existing slate colors
          900: "rgb(var(--color-primary))",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary))",
          50: "rgb(248 250 252)",
          // ... existing slate colors  
          800: "rgb(var(--color-secondary))",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent))",
          400: "rgb(52 211 153)",
          500: "rgb(var(--color-accent))",
        },
        success: "rgb(var(--color-success))",
        warning: "rgb(var(--color-warning))",
        text: "rgb(var(--color-text))",
        muted: "rgb(var(--color-muted))"
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
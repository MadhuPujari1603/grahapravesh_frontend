import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: {
            DEFAULT: "#0a3d2e",
            light: "#0e5540",
            dark: "#072d21",
            deeper: "#051f17",
            darker: "#03150e",
            darkest: "#020d09",
          },
          gold: {
            DEFAULT: "#c9a84c",
            dark: "#b8941f",
            light: "#ddc06e",
            muted: "#a68b3a",
          },
          cream: {
            DEFAULT: "#f5f0e8",
            light: "#fafaf7",
          },
          charcoal: {
            DEFAULT: "#1c1917",
            medium: "#57534e",
            light: "#a8a29e",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Glassmorphism shadows
        card:        "0 2px 16px 0 rgba(10,61,46,0.06), 0 1px 0 0 rgba(255,255,255,0.8) inset",
        "card-hover":"0 8px 32px 0 rgba(10,61,46,0.10), 0 1px 0 0 rgba(255,255,255,0.9) inset",
        premium:     "0 8px 32px 0 rgba(10,61,46,0.12)",
        glass:       "0 2px 16px 0 rgba(10,61,46,0.06), 0 1px 0 0 rgba(255,255,255,0.8) inset",
        "glass-lg":  "0 25px 60px -12px rgba(10,61,46,0.20), 0 1px 0 0 rgba(255,255,255,0.9) inset",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

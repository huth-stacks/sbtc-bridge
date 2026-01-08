import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "matter-mono": "var(--font-matter-mono)",
        matter: "var(--font-matter)",
      },
      animation: {
        "spin-slow": "spin 15s linear infinite",
      },
      colors: {
        /* ===== EXPLORER SAND PALETTE ===== */
        "sand": {
          50: "var(--neutral-sand-50)",
          100: "var(--neutral-sand-100)",
          150: "var(--neutral-sand-150)",
          200: "var(--neutral-sand-200)",
          300: "var(--neutral-sand-300)",
          400: "var(--neutral-sand-400)",
          500: "var(--neutral-sand-500)",
          600: "var(--neutral-sand-600)",
          700: "var(--neutral-sand-700)",
          800: "var(--neutral-sand-800)",
          900: "var(--neutral-sand-900)",
          950: "var(--neutral-sand-950)",
          1000: "var(--neutral-sand-1000)",
        },
        /* ===== STACKS ACCENT ===== */
        "stacks": {
          100: "var(--accent-stacks-100)",
          200: "var(--accent-stacks-200)",
          300: "var(--accent-stacks-300)",
          400: "var(--accent-stacks-400)",
          500: "var(--accent-stacks-500)",
          600: "var(--accent-stacks-600)",
          700: "var(--accent-stacks-700)",
        },
        /* ===== BITCOIN ACCENT ===== */
        "bitcoin": {
          100: "var(--accent-bitcoin-100)",
          200: "var(--accent-bitcoin-200)",
          300: "var(--accent-bitcoin-300)",
          400: "var(--accent-bitcoin-400)",
          500: "var(--accent-bitcoin-500)",
          600: "var(--accent-bitcoin-600)",
          700: "var(--accent-bitcoin-700)",
        },
        /* ===== SEMANTIC COLORS ===== */
        "surface": {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
          fourth: "var(--surface-fourth)",
        },
        "text": {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        "explorer-border": {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
        },
        /* ===== FEEDBACK COLORS ===== */
        "feedback": {
          "green-100": "var(--feedback-green-100)",
          "green-500": "var(--feedback-green-500)",
          "green-600": "var(--feedback-green-600)",
          "red-100": "var(--feedback-red-100)",
          "red-400": "var(--feedback-red-400)",
          "red-500": "var(--feedback-red-500)",
          "yellow-100": "var(--feedback-yellow-100)",
          "yellow-500": "var(--feedback-yellow-500)",
          "blue-500": "var(--feedback-blue-500)",
        },
        /* ===== LEGACY COLORS (kept for compatibility) ===== */
        orange: "#FD9D41",
        lightOrange: "#FFF6EC",
        darkGray: "#6C6C6C",
        midGray: "#D7D7D7",
        gray: "#B9B9B9",
        lightGray: "#F5F5F5",
        "reskin-dark-gray": "#272628",
        "dark-reskin-border-gray": "#333135",
        "ship-gray": "#333135",
        "light-reskin-border-gray": "rgba(0, 0, 0, 0.2)",
        "dark-reskin-orange": "#FC6432",
        "dark-reskin-dark-gray": "#525153",
        "timeline-inactive-gray": "#ededed",
        "timeline-inactive-step-text": "#808080",
        "timeline-active-step-text": "#141414",
        "dark-timeline-inactive-step-text": "#FAFAFA",
        alabastar: "#FAFAFA",
        tundora: "#4A4A4A",
        confetti: "#E5D660",
        "chateau-green": "#34A853",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "input-label-dark": "#1E1E1E",
        "button-secondary-text-light": "#333333",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "selector",
};
export default config;

/** @type {import('tailwindcss').Config} */

// Semantic surfaces resolve through CSS variables, so light and dark are one
// declaration block each rather than a `dark:` class on every element.
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* --- Semantic tokens (theme-aware) --- */
        surface: themed("surface"),
        sunken: themed("sunken"),
        elevated: themed("elevated"),
        fg: themed("fg"),
        muted: themed("muted"),
        subtle: themed("subtle"),
        line: themed("line"),
        "line-strong": themed("line-strong"),
        brand: themed("brand"),
        "brand-hover": themed("brand-hover"),
        "brand-soft": themed("brand-soft"),
        "brand-soft-fg": themed("brand-soft-fg"),

        primary: {
          // Royal blue, as a flat ramp. 600 is the action colour, 700 its pressed
          // state, 800/900 for dark surfaces. No gradients anywhere in this app.
          50: "#eff5ff",
          100: "#dbe8fe",
          200: "#bfd7fe",
          300: "#93bbfd",
          400: "#6095fa",
          500: "#3b73f6",
          600: "#2556eb",
          700: "#1d43d8",
          800: "#1e3a8a",
          900: "#1b2f6b",
          950: "#141f47",
        },
        accent: {
          // Amber. Used for "Featured" markers only never as a body surface.
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        success: {
          // Call / WhatsApp affordances.
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        ink: {
          // Dark surfaces (footer, hero overlays, newsletter band).
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#0b1120",
        },
      },
      fontFamily: {
        // High-contrast serif for display, grotesque for text, mono for every
        // number and label. The mono is doing real work here: prices, seat
        // counts and section markers all want tabular figures.
        display: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Archivo", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Near-sharp. Architectural drawings don't have 18px corner radii.
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "3px",
        md: "3px",
        lg: "4px",
        xl: "5px",
        "2xl": "6px",
        "3xl": "8px",
        "4xl": "10px",
        full: "9999px",
      },
      boxShadow: {
        // Flat, neutral elevation driven by a themed shadow colour, so cards
        // don't glow white-ish in dark mode. Tinted shadows read as gradients.
        card: "0 1px 2px 0 rgb(var(--shadow) / 0.04), 0 4px 16px -4px rgb(var(--shadow) / 0.08)",
        "card-hover":
          "0 2px 4px 0 rgb(var(--shadow) / 0.05), 0 12px 32px -8px rgb(var(--shadow) / 0.16)",
        sheet: "0 -8px 40px -12px rgb(var(--shadow) / 0.3)",
        nav: "0 1px 0 0 rgb(var(--shadow) / 0.06)",
        pop: "0 4px 24px -6px rgb(var(--shadow) / 0.2)",
      },
      transitionTimingFunction: {
        // Built-in CSS easings are too weak to read as intentional.
        // Sources: easing.dev, Ionic's drawer curve.
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionDuration: {
        120: "120ms",
        160: "160ms",
        250: "250ms",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top, 0px)",
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
        "safe-left": "env(safe-area-inset-left, 0px)",
        "safe-right": "env(safe-area-inset-right, 0px)",
        // Height of the mobile tab bar plus the home-indicator inset.
        "tabbar": "calc(4rem + env(safe-area-inset-bottom, 0px))",
      },
      maxWidth: {
        content: "80rem",
      },
      keyframes: {
        "sheet-in": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        // Linear: constant motion should not accelerate.
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};

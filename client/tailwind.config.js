/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(99,102,241,0.08)",
        "card-hover": "0 8px 32px 0 rgba(99,102,241,0.16)",
      },
    },
  },
  plugins: [
    require('lightswind/plugin'),
    require('tailwind-scrollbar'),
    {
      handler: ({ addUtilities, theme }) => {
        addUtilities({
          ".scrollbar-primary": {
            "scrollbar-color": `${theme("colors.primary.500")} transparent`,
            "scrollbar-width": "8px",
          },
          ".scrollbar-primary::-webkit-scrollbar": {
            width: "8px",
          },
          ".scrollbar-primary::-webkit-scrollbar-track": {
            background: "transparent",
          },
          ".scrollbar-primary::-webkit-scrollbar-thumb": {
            background: theme("colors.primary.500"),
            borderRadius: "4px",
          },
          ".scrollbar-primary::-webkit-scrollbar-thumb:hover": {
            background: theme("colors.primary.600"),
          },
        });
      },
    },
  ],
};

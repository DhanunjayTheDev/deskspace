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
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
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

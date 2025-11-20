/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  darkMode: "class",
  safelist: [
    "bg-light-bg",
    "bg-dark-bg",
    "text-light-text",
    "text-dark-text"
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LIGHT
        "light-bg": "#fffefb",
        "light-text": "#0F172A",

        // DARK
        "dark-bg": "#0B1120",
        "dark-text": "#E2E8F0",

        // Universal accents
        primary: "#3B82F6",
        accent: "#22C55E",
      },
    },
  },
  plugins: [],
});

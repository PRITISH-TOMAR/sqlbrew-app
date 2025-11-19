/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  darkMode: "class", // <-- Important
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LIGHT THEME
        "light-bg": "#fffefbff",
        "light-text": "#0F172A",

        // DARK THEME
        "dark-bg": "#0B1120",
        "dark-text": "#E2E8F0",

        // Optional accent colors (same in both themes)
        primary: "#3B82F6",
        accent: "#22C55E",
      },
    },
  },
  plugins: [],
});

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
        accent:  '#52c41a',
      },
    },
  },
  plugins: [],
  // Disable Tailwind preflight so it doesn't fight MUI's CssBaseline
  corePlugins: {
    preflight: false,
  },
};

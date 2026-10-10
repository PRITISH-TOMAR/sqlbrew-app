/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Garnet theme — keep in sync with src/theme/palette.js
      colors: {
        primary: {
          DEFAULT: '#9B1B30',
          50:  '#F7E9EC',
          100: '#F2D3D9',
          200: '#E5A7B2',
          300: '#D4697B',
          400: '#F2546B', // dark-mode primary
          500: '#B3324A',
          600: '#9B1B30', // light-mode primary
          700: '#7A1426',
          800: '#5A0F1C',
          900: '#3A1820',
        },
        accent: '#15804F',
        neutral: {
          0:   '#FFFFFF',
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
        ink: {
          base:   '#121012',
          paper:  '#1A1618',
          raised: '#231E20',
          border: '#332B2E',
          strong: '#4A4043',
          text:   '#F2ECEC',
          muted:  '#A89C9F',
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
  // Disable Tailwind preflight so it doesn't fight MUI's CssBaseline
  corePlugins: {
    preflight: false,
  },
};

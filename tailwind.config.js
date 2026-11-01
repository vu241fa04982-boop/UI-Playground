/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        playground: {
          dark: '#020817',
          darker: '#01050F',
          secondary: '#07152B',
          panel: '#0B1D3A',
          border: '#12345C',
          purple: '#7C3AED',
          brightPurple: '#8B5CF6',
          blue: '#2563EB',
          pink: '#EC4899',
          cyan: '#22D3EE',
          text: '#F8FAFC',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

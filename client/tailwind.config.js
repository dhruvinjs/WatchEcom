/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          100: '#d1f7e5',
          200: '#a8f0c6',
          300: '#50C878',
          400: '#1c9b5e',
          500: '#006400',
          600: '#004d34',
        },
        gold: {
          100: '#f7e2b1',
          200: '#f2d188',
          300: '#e4b24c',
          400: '#d49e21',
          500: '#c78a00',
          600: '#b67400',
        },
      },
    },
  },
  plugins: [],
};

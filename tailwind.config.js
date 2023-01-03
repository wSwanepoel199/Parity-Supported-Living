/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html'
  ],
  darkMode: 'class',
  important: '#root',
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html'
  ],
  purhe: ["./src/**/*.{js,jsx,ts,tsx}", './public/index.html'],
  mode: 'jit',
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

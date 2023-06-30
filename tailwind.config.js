/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html'
  ],
  important: true,
  mode: 'jit',
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'psl-primary': '#213430',
        'psl-secondary': '#009368',
        'psl-active-link': '#f37b1c',
        "psl-active-text": '#F5F5F5',
        'psl-primary-text': '#6F7775',
        'psl-secondary-text': '#DDDDDD',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(-90.0deg)' },
          '100%': { transform: 'rotate(-0.0deg)' }
        }
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};

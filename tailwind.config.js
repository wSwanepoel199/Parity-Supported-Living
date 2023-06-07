/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html',
    './build/*.html'
  ],
  mode: 'jit',
  theme: {
    extend: {
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

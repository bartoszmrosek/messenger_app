/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      animation:{
        blob: 'blob 10s ease-in-out infinite'
      },
      'keyframes':{
        'blob':{
          '0%, 100%': {'fill': '#8A3FFC', 'transform': 'translate(35%, 35%) scale(0.75)'},
          "50%":{'fill': '#4903B2', 'transform': 'translate(50%, 50%) scale(1)'}
        }
      }
    },
  },
  plugins: [],
}

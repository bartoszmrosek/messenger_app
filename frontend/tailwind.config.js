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
        blob: 'blob 5s ease-in-out infinite'
      },
      'keyframes':{
        'blob':{
          '0%, 100%': {'fill': 'red'},
          "50%":{'fill': 'blue'}
        }
      }
    },
  },
  plugins: [],
}

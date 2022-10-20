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
        'wobble0': 'wobble0 15s linear infinite',
        'wobble1': 'wobble1 15s linear infinite',
        'search-fade-in': 'fadeIn 1s linear forwards',
        'search-fade-out': 'fadeOut 1s linear forwards'
      },
      keyframes:{
        'wobble0': {
          '0%': {"transform": 'rotate(0deg) translate-x-[-0%] translate-y-[0%]'},
          '100%': {"transform": 'rotate(360deg) translate-x-[--10%] translate-y-[-0%]'}
        },
        'wobble1': {
          '0%': {"transform": 'rotate(0deg) translate-x-[0%] translate-y-[0%]'},
          '100%': {"transform": 'rotate(360deg) translate-x-[0%] translate-y-[0%]'}
        },
        fadeIn:{
          '0%':{transform: 'translate(0, -100%)'},
          "100%":{transform: 'translate(0, 0)'}
        },
        fadeOut:{
          '0%':{transform: 'translate(0, 0)'},
          "100%":{transform: 'translate(0, -100%)'}
        }
      },
      transitionDuration:{
        '4000': '4000ms'
      },
      transitionTimingFunction:{
        'wobble': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
      },
      colors:{
        'main-purple': '#8A3FFC',
        'porcelain': "#EBECED"
      }
    },
  },
  plugins: [],
}

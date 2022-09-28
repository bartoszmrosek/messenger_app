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
        wobble0: 'wobble0 15s linear infinite',
          wobble1: 'wobble1 15s linear infinite',        
      },
      keyframes:{
        'wobble0': {
          '0%': {"transform": 'rotate(0deg) translate-x-[-50%] translate-y-[-50%]'},
          '100%': {"transform": 'rotate(360deg) translate-x-[-50%] translate-y-[-50%]'}
        },
        'wobble1': {
          '0%': {"transform": 'rotate(0deg) translate-x-[50%] translate-y-[50%]'},
          '100%': {"transform": 'rotate(360deg) translate-x-[50%] translate-y-[50%]'}
        }
      },
      transitionDuration:{
        '4000': '4000ms'
      },
      transitionTimingFunction:{
        'wobble': '[cubic-bezier(0.455, 0.03, 0.515, 0.955)]'
      }
    },
  },
  plugins: [],
}

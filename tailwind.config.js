const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      gray: colors.gray,
      white: colors.white,
      green: colors.green,
      sidebar: '#F6F7F8',
      accent: "#FE5738",
      darksidebar: "#111111",
      darkbackground: "#000",

    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: "jit",
  content: ["./public/src/components/*.{js,jsx}"],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', ...defaultTheme.fontFamily.sans],
      'serif': ['Libre Baskerville', ...defaultTheme.fontFamily.serif],
    },
  }
}

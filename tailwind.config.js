module.exports = {
  content: ["./*.html", "./site-dist/*.html", "./build-site.js"],
  theme: {
    extend: {
      colors: {
        ink: "#0E0B1F",
        cream: "#FAF7F2",
        indigo2: "#4338CA",
        violet2: "#7C3AED",
        pink2: "#EC4899",
        pinklight: "#F9A8D4",
        mint: "#5EE3C1",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
    },
  },
};

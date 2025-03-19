const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        headerBg: "#F4F5F7",
        tableHeaderBg: "#F0F0F0",
        primary: "#612B9B",
        secondary: "#ab47bc",
      },
    },
  },
  plugins: [],
});

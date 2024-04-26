/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaryDarkBg: "#266150",
        primaryLightBg: "#f0f0f04d",
        secondaryLightBg: "#E2E8F0",
        backDropBg: "#F2F1EB",
        primaryWhite: "#FFFFFF",
        textBlack: "#4F4846",
        hoverBg: "#3c3635",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scan all your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

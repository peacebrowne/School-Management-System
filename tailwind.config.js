/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin"), require("flowbite")],
};

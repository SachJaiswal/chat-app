import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light", "dark"
    ],
    darkTheme: "dark", // default dark theme
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
  },
};

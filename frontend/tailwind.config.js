import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        ambidexter: ["Ambidexter", "cursive"],
        bergamasco: ["Bergamasco", "serif"],
        disruptors: ["Disruptors", "cursive"],
        passions: ["Passions", "cursive"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fordham: {
          maroon: "#861F41",      // Fordham Maroon
          maroonDark: "#60142E",  // Deep Maroon
          maroonLight: "#A52D53", // Lighter accent Maroon
          gold: "#D4AF37",        // Fordham Gold accent
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}", // Include all .ts and .tsx files in app directory
    "./src/components/**/*.{ts,tsx}", // Include all .ts and .tsx files in components directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

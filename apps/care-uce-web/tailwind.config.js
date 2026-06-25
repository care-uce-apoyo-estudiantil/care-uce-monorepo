/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        'uce-primary': '#003366',
        'uce-danger': '#D32F2F',
      },
    },
  },
  plugins: [],
};

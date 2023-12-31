/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mb': '350px',
        'xss': '400px',
        'xs': '465px',
        'tab': '890px',
      },
      width: {
        'w-75': '300px'
      },
      colors: {
        'green-cust-300': '#E0F7F0',
        'green-cust-100': '#EEF7F4',
      },
    },
  },
  plugins: [],
};

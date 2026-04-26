/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f0',
          100: '#dcebdc',
          200: '#bcd9bc',
          300: '#93c093',
          400: '#6aa36a',
          500: '#4d8a4d',
          600: '#3d6e3d',
          700: '#335833',
          800: '#2c472c',
          900: '#263b26',
        },
        accent: {
          DEFAULT: '#5d7a5d',
          dark: '#4a624a',
        }
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
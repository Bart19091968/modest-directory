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
          DEFAULT: '#111111',
          dark: '#000000',
        }
      },
      fontSize: {
        // Scaled-down editorial type scale (FashionUnited style)
        '4xl': ['1.5rem',    { lineHeight: '2rem' }],      // 24px  (was 36px)
        '3xl': ['1.25rem',   { lineHeight: '1.75rem' }],   // 20px  (was 30px)
        '2xl': ['1.125rem',  { lineHeight: '1.625rem' }],  // 18px  (was 24px)
        'xl':  ['1rem',      { lineHeight: '1.5rem' }],    // 16px  (was 20px)
        'lg':  ['0.9375rem', { lineHeight: '1.5rem' }],    // 15px  (was 18px)
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
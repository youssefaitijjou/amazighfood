/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazigh: {
          red: '#C23B22',
          yellow: '#FFD700',
          green: '#009B77',
          blue: '#1C39BB',
          sand: '#F4A460',
          earth: '#8B4513'
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
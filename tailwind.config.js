/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        eth: ['EthGofa', 'var(--font-amharic)', 'Noto Sans Ethiopic', 'Abyssinica SIL', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        amharic: ['EthGofa', 'var(--font-amharic)', 'Noto Sans Ethiopic', 'Abyssinica SIL', 'Nyala', 'sans-serif'],
        hebrew: ['var(--font-hebrew)', 'Frank Ruhl Libre', 'Noto Serif Hebrew', 'David Libre', 'serif'],
        greek: ['var(--font-greek)', 'Gentium Book Plus', 'Noto Serif', 'Times New Roman', 'serif'],
        english: ['var(--font-english)', 'Cormorant Garamond', 'EB Garamond', 'Georgia', 'serif'],
      },
      colors: {
        gold: {
          300: '#eed698',
          400: '#e5c474',
          500: '#c6a86e',
          600: '#a78a50',
        },
        sepia: {
          50: '#faf6ee',
          100: '#f4ede0',
          200: '#e8dbca',
          300: '#d7c1a8',
          400: '#c2a382',
          500: '#b08b64',
          600: '#9b7450',
          700: '#7d5c3f',
          800: '#644a34',
          900: '#4c3726',
          950: '#2d1f14',
        },
        parchment: '#f8f5ee',
        ink: '#1c1917',
      },
    },
  },
  plugins: [],
}

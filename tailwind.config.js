/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        steel: {
          900: '#0F1923',
          800: '#1B2838',
          700: '#243447',
          600: '#2D3748',
          500: '#4A5568',
          400: '#718096',
          300: '#A0AEC0',
        },
        industrial: {
          orange: '#FF6B35',
          'orange-light': '#FF8F66',
          green: '#48BB78',
          red: '#FC8181',
          yellow: '#ECC94B',
          blue: '#4299E1',
          cyan: '#00D4FF',
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

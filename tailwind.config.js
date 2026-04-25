/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          950: '#0a0612',
          900: '#130a24',
          800: '#1e1035',
          700: '#2d1a52',
          600: '#4c1d95',
          500: '#7c3aed',
          400: '#a855f7',
          300: '#c084fc',
          200: '#ddd6fe',
          100: '#f3e8ff',
        },
      },
      fontFamily: {
        mono: ['Share Tech Mono', 'Space Mono', 'Courier New', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        ui: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'flicker': 'flicker 4s linear infinite',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.8' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.6' },
          '99%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}

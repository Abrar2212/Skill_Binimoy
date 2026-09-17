/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          DEFAULT: '#6C63FF',
          600: '#6C63FF',
          700: '#5a52d5',
          800: '#483fb0',
          900: '#342d86',
        },
        cyan: {
          DEFAULT: '#00C2FF',
          400: '#38bdf8',
          500: '#00C2FF',
          600: '#0284c7',
        },
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          cardHover: '#273549',
          border: '#334155',
          muted: '#94A3B8',
        }
      },
      boxShadow: {
        glow: '0 0 25px rgba(108, 99, 255, 0.35)',
        glowCyan: '0 0 25px rgba(0, 194, 255, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

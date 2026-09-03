/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#F7F7F7',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#999999',
          400: '#666666',
          500: '#333333',
          600: '#262626',
          700: '#1F1F1F',
          800: '#171717', // Primary Charcoal
          900: '#0F0F0F',
          950: '#0A0A0A',
        },
        concrete: {
          50: '#FAF9F6',
          100: '#F5F4F0', // Main background
          200: '#E8E7E1', // Border / separator
          300: '#D6D5CD',
          400: '#A8A79E',
          500: '#777777', // Secondary grey
          600: '#5A5A5A',
          700: '#404040',
          800: '#2B2B2B',
          900: '#1C1C1C',
        },
        yellow: {
          brand: '#F5B700', // Construction Yellow Accent
          hover: '#E0A600',
          active: '#C79300',
          light: '#FFF9E6',
          dark: '#997300',
        },
        brand: {
          emerald: '#10B981',
          danger: '#EF4444',
          amber: '#F59E0B',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'modal': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'yellow-glow': '0 0 15px rgba(245, 183, 0, 0.3)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}

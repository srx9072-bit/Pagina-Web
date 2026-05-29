/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff0f2',
          100: '#ffd6db',
          200: '#ffadb8',
          300: '#ff7085',
          400: '#ff3355',
          DEFAULT: '#e8002d',
          500: '#e8002d',
          600: '#c00025',
          700: '#99001e',
          800: '#7a0018',
          900: '#600013'
        },
        secondary: {
          DEFAULT: '#ff6d00',
          400: '#ff9e00',
          500: '#ff6d00',
          600: '#e05e00'
        },
        dark: {
          DEFAULT: '#0a0a0f',
          card:    '#13131a',
          border:  '#1e1e2e',
          hover:   '#1a1a28'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      boxShadow: {
        'glow': '0 0 30px rgba(232, 0, 45, 0.3)',
        'glow-lg': '0 0 60px rgba(232, 0, 45, 0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.4)'
      }
    }
  },
  plugins: []
};

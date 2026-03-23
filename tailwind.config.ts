import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6f6',
          100: '#faeaea',
          200: '#f3d0d0',
          300: '#e9aaaa',
          400: '#d97c7c',
          500: '#c85a5a',
          600: '#b54040',
          700: '#973333',
          800: '#7d2e2e',
          900: '#692b2b',
          950: '#381313',
        },
        rose: {
          blush: '#D4A5A5',
          deep: '#C48B8B',
          light: '#F5E6E6',
          pale: '#FAF0F0',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
          light: '#4A4A4A',
          dark: '#1A1A1A',
        },
        cream: {
          DEFAULT: '#FAF7F5',
          dark: '#F0EBE8',
        },
        mint: {
          DEFAULT: '#9ECFC5',
          dark: '#5A9E96',
          darker: '#3D7D76',
          light: '#C5E8E3',
          pale: '#EAF6F4',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #D4A5A5 0%, #C48B8B 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(45,45,45,0.3) 0%, rgba(45,45,45,0.7) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

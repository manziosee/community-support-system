/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Cool & Trustworthy)
        primary: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688', // Teal Blue - Main
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },
        secondary: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3F51B5', // Indigo - Main
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },
        // Accent Colors (Vibrant & Friendly)
        accent: {
          50: '#ffe5e2',
          100: '#ffbeb6',
          200: '#ff9387',
          300: '#ff6f61', // Coral - Main
          400: '#ff5247',
          500: '#ff3d2e',
          600: '#f5362a',
          700: '#e82d23',
          800: '#dc251d',
          900: '#cd1712',
        },
        success: {
          50: '#f9fbe7',
          100: '#f0f4c3',
          200: '#e6ee9c',
          300: '#dce775',
          400: '#d4e157',
          500: '#CDDC39', // Lime Green - Main
          600: '#c0ca33',
          700: '#afb42b',
          800: '#9e9d24',
          900: '#827717',
        },
        // Neutrals (Clean & Readable)
        neutral: {
          50: '#FAFAFA', // Soft White
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#B0BEC5', // Cool Gray
          600: '#90a4ae',
          700: '#78909c',
          800: '#607d8b',
          900: '#455a64',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 150, 136, 0.1), 0 10px 20px -2px rgba(0, 150, 136, 0.05)',
        'soft-lg': '0 10px 40px -10px rgba(0, 150, 136, 0.2)',
        'glow': '0 0 20px rgba(0, 150, 136, 0.3)',
        'glow-accent': '0 0 20px rgba(255, 111, 97, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
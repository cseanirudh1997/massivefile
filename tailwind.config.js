/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Electric cyan — primary brand
        brand: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',   // electric cyan
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Violet — accent
        accent: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',   // violet
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#2e1065',
          950: '#1a0533',
        },
        neon: {
          cyan:   '#22d3ee',
          violet: '#8b5cf6',
          blue:   '#3b82f6',
          green:  '#10b981',
        },
      },
      animation: {
        'gradient-x':    'gradient-x 8s ease infinite',
        'float':         'float 6s ease-in-out infinite',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':     'spin 8s linear infinite',
        'blink-caret':   'blink-caret 0.75s step-end infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'circuit-glow':  'circuit-glow 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%':      { 'border-color': '#22d3ee' },
        },
        shimmer: {
          '0%':   { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'circuit-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm':     '0 0 15px rgba(34, 211, 238, 0.25)',
        'glow':        '0 0 30px rgba(34, 211, 238, 0.35)',
        'glow-lg':     '0 0 60px rgba(34, 211, 238, 0.45)',
        'glow-violet': '0 0 30px rgba(139, 92, 246, 0.35)',
        'glow-violet-lg': '0 0 60px rgba(139, 92, 246, 0.45)',
        'glass':       '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.5)',
        'cyan':        '0 4px 24px rgba(34, 211, 238, 0.2)',
      },
    },
  },
  plugins: [],
}

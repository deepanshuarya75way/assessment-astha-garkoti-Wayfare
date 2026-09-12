/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#fbf7ee',
        parchmentDim: '#f3eee3',
        ink: '#17302a',
        teal: '#0d5c63',
        'teal-light': '#14747b',
        marigold: '#e9b949',
        coral: '#e76f51',
        line: '#ddd5c7',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        ticket: '0 8px 24px rgba(23, 48, 42, 0.10)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stamp: {
          '0%': { opacity: '0', transform: 'scale(0.75) rotate(-8deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
      },
      animation: {
        rise: 'rise .45s ease-out both',
        stamp: 'stamp .35s ease-out both',
      },
    },
  },
  plugins: [],
}

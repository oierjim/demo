/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ejie: {
          navy: '#1e293b',
          dark: '#0f172a',
          accent: '#3b82f6',
          footer: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}

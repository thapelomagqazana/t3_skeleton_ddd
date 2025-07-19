/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Add this line so Tailwind scans your components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

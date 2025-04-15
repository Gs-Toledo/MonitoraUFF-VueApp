/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        customBlueStart: '#215CAA',
        customBlueEnd: '#0F315C',
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(to right, #215CAA, #0F315C)',
      }
    },
  },
  plugins: [],
}


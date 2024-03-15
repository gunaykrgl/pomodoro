/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
   "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "micro": '"Micro 5"'
      },
    },
  },
  plugins: [],
}


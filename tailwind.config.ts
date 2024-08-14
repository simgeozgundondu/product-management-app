import type { Config } from "tailwindcss";


const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        customBackground: '#f4f4ed',
        primaryDarkColor:'#0284c7',
        primaryLightColor:'#93c5fd',
        secondaryLightColor :'#fb571a',
        secondaryDarkColor : '#fc9067',
        lightColor :'#F8F7FF'
      },
      fontFamily: {
        'reenie': ['"Reenie Beanie"', 'cursive'],
        'quicksand' : ['"Quicksand", sans-serif']
      },
      
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
export default config;

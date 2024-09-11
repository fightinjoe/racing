import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean-100': '#F7FBFE', // light light blue
        'ocean-200': '#E6F4FF',
        'ocean-300': '#B1DCFF',
        'ocean-400': '#2C98F0',
        'ocean-500': '#0F81DE',
        'ocean-800': '#2451B8',
        'aqua-300': '#80F6DD',
        'aqua-400': '#2CF0C6',
        'aqua-500': '#04E0B1'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
export default config;

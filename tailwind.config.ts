import type { Config } from "tailwindcss"

import plugin from "tailwindcss/plugin"

const CSS = {
  row: {
    display: 'flex',
    'flex-direction': 'row'
  },

  col: {
    display: 'flex',
    'flex-direction': 'column'
  }
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    gapSize: {
      0: '0px',
      2: '0.5rem',
      4: '1rem'
    },
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
        'aqua-500': '#04E0B1',
        'clear-100': '#FFFFFF66'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin( function({matchComponents, theme}) {
      matchComponents({

        /**
         * Shortcut for a flexbox row
         * @param value theme.gapSize number representing the gap between items
         * @example <div className="row-2">...</div> 
         */
        row: (value) => ({
          ...CSS.row,
          gap: value
        }),
        
        /**
         * Shortcut for a wrapping flexbox row
         */
        'row-wrap': (value) => ({
          ...CSS.row,
          'flex-wrap': 'wrap',
          gap: value
        }),

        /**
         * Shortcut for a flexbox column
         */
        col: (value) => ({
          ...CSS.col,
          'gap': value
        })
      },{
        values: theme('gapSize')
      })
    } )
  ],
}

export default config
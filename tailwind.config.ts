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
      4: '1rem',
      6: '1.5rem',
    },
    extend: {
      colors: {
        'ocean-100': '#F7FBFE', // light light blue
        'ocean-200': '#E6F4FF',
        'ocean-300': '#B1DCFF',
        'ocean-400': '#2C98F0',
        'ocean-500': '#0F81DE',
        'ocean-800': '#2451B8',
        'ocean-900': '#003E7D',
        'ocean-950': '#102452',
        'aqua-300': '#80F6DD',
        'aqua-400': '#2CF0C6',
        'aqua-500': '#04E0B1',
        'sky-300': '#7DA8E5',
        'clear-100': '#FFFFFF1A',
        'clear-400': '#FFFFFF66',
        'clear-500': '#FFFFFF88',
        'smoke-100': '#0000001A',
        'smoke-400': '#00000066',
        'smoke-500': '#00000088',
        'smoke-800': '#000000DD',
      },

      /* Tailwind bug: a theme.animation referencing a theme.keyframe */
      /* does not trigger the compilation of the animation, so it shows up */
      /* as undefined. Adding it explicitly to globals.css makes it accessible */
      // keyframes: {
      //   mfabounce: {
      //     "0%":  { transform: "translateY(0)" },
      //     "6%":  { transform: "translateY(0)" },
      //     "10%": { transform: "translateY(-8px)" },
      //     "12%": { transform: "translateY(0)" },
      //     "14%": { transform: "translateY(-6px)" },
      //     "16%": { transform: "translateY(0)" },
      //     "18%": { transform: "translateY(-3px)" },
      //     "20%": { transform: "translateY(0)" },
      //     "22%": { transform: "translateY(-2px)" },
      //     "24%": { transform: "translateY(0)" },
      //     "100%": { transform: "translateY(0)" },
      //   }
      // },
      // animation: {
      //   mfabounce: 'mfabounce 3s ease-in-out infinite'
      // }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin( function({addComponents, addUtilities, matchComponents, theme}) {      
      addUtilities({
        '.bg-ocean-linear': {
          background: `linear-gradient(${theme('colors.ocean-950')}, ${theme('colors.ocean-900')})`,
        },

        '.bg-ocean-radial': {
          background: `radial-gradient(circle at 50% 0, ${theme('colors.ocean-900')}, ${theme('colors.sky-300')})`
        },

        '.shadow-top': {
          'box-shadow': '0px -10px 15px -3px rgba(0,0,0,0.1), 0px -4px 6px 4px rgba(0,0,0,0.1)'
        }
      })

      /** Tile styles */
      addComponents({
        '.tile': {
          background: theme('colors.ocean-100'),
          /* Determine the width and height of a tile relative to the container size */
          /* parent width - primary gutters - padding - column gaps */
          width: 'calc( (100cqw - 16px*2 - 8px*2) / 3)',
          height: 'calc( (100cqw - 16px*2 - 8px*2) / 3)',
          transition: 'all 0.1s ease-in-out',
          position: 'relative',
          'text-align': 'center',
          'border-radius': '4px',
        },

        '.tile-todo': {
          border: `2px dashed ${theme('colors.ocean-300')}`,
          background: 'none',
          color: theme('colors.ocean-200'),
          '&:hover, &:active': {
            'border-style': 'solid',
            'background-color': theme('colors.clear-100')
          },
          'backdrop-filter': 'blur(12px)',
        },

        '.tile-emphasize': {
          border: `2px dashed ${theme('colors.yellow.200')}`,
          background: hexToRGBA(theme('colors.yellow.200'), 0.2),
          color: theme('colors.yellow.200'),
          animation: `mfawiggle 5s linear infinite`,
          '&:hover, &:active': {
            'border-color': theme('colors.yellow.300'),
            'border-style': 'solid',
            color: theme('colors.yellow.300'),
            'background-color': hexToRGBA(theme('colors.yellow.200'), 0.3),
            animation: 'none'
          }
        },

        '.tile-done': {
          background: theme('colors.clear-400'),
          '&:hover, &:active': {
            background: theme('colors.clear-500')
          },
          'backdrop-filter': 'blur(6px)',
        }
      })

      /** Button styles */
      addComponents({
        '.button-header': {
            'color': theme('colors.aqua-500'),
            'padding': '1rem 0.5rem',
        },
        '.button-cancel': {
          'color': theme('colors.smoke-500'),
          'padding': '1rem',
          'font-size': '0.875rem',
        }
      })

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

export function hexToRGBA(hex: string, alpha: number) {
  const [r,g,b] = hex.match(/\w{2}/g)!.map( x => parseInt(x, 16) )
  return `rgba(${r},${g},${b},${alpha})`
}

export default config
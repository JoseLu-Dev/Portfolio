const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
  prefix: '',
  mode: 'jit',
  purge: {
    content: [
      './src/**/*.{html,ts,css,scss,sass,less,styl}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'lato': ['Lato', 'sans-serif']
      },
      colors: {
        dark: {
          darkest: '#202225',
          dark: '#2F3136',
          DEFAULT: '#36393F',
          light: '#72767D',
          lightest: '#DBDCDD',
        },
        light: {
          darkest:'#919191',
          dark: '#CCCCCC',
          DEFAULT: '#EDEDED',
          light: '#F5F5F5',
          lightest:'#FFFFFF',
        },
        blue: {
          DEFAULT: '#0077b6'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};

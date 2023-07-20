const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        rusty: {
          primary: '#d4916a',

          secondary: '#4e5255',

          accent: '#e0ac69',

          neutral: '#8d918d',

          'base-100': '#313335',

          info: '#2e3133',

          success: '#589464',

          warning: '#aa6c39',

          error: '#b22222',
        },
      },
    ],
  },
};

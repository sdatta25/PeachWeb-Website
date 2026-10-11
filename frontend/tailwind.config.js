export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF7F1',
        bisque: '#F3E6D8',
        peach: { DEFAULT: '#EFA77E', soft: '#F8DDC9' },
        terracotta: { DEFAULT: '#A3431D', deep: '#7F3214' },
        charcoal: '#241D19',
        stone: '#685B51',
        line: '#E5D7C7',
        mist: '#C9BBAE',
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      maxWidth: { page: '76rem' },
    }
  },
  plugins: []
}

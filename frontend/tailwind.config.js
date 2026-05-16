export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        peach: { 50: '#FFF5F0', 100: '#FFE4D6', 200: '#FFCAB0', 300: '#FFAB76', 400: '#FF8C61', 500: '#FF6B35', 600: '#E8571A', 700: '#C44312' },
        dark: '#1C1C1C'
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
}

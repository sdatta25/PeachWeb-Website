// Colours point at the CSS variables in src/index.css so there is one source of truth.
const v = name => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './404.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: v('page'),
        cream: v('cream'),
        chip: v('chip'),
        orange: v('orange'),
        burnt: v('burnt'),
        dark: v('dark'),
        muted: v('muted'),
        line: v('line'),
      },
      fontFamily: {
        sans: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        hero: ['"Times New Roman"', 'Times', 'serif'],
      },
      // Type scale. Display sizes are fluid between 360px and 1440px.
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5' }],      // 13
        sm: ['0.875rem', { lineHeight: '1.5' }],       // 14
        base: ['1.0625rem', { lineHeight: '1.65' }],   // 17
        lg: ['1.125rem', { lineHeight: '1.6' }],       // 18
        xl: ['1.375rem', { lineHeight: '1.35' }],      // 22
        h3: ['clamp(1.625rem, 1.2rem + 1vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h2: ['clamp(2.5rem, 1.6rem + 3.4vw, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        h1: ['clamp(3rem, 1.6rem + 5.6vw, 6.5rem)', { lineHeight: '0.94', letterSpacing: '-0.025em' }],
      },
      maxWidth: { page: '80rem', prose: '36rem' },
      boxShadow: {
        // The only shadow on the site.
        frame: '0 1px 2px rgb(var(--dark) / 0.06), 0 24px 48px -24px rgb(var(--dark) / 0.28)',
      },
      borderRadius: { DEFAULT: '8px', lg: '8px', xl: '16px' },
    },
  },
  plugins: [],
}

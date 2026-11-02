// Colours point at the CSS variables in src/index.css so there is one source of truth.
const v = name => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './404.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: v('page'),
        peach: v('peach'),
        cream: v('cream'),
        chip: v('chip'),
        orange: v('orange'),
        burnt: v('burnt'),
        dark: v('dark'),
        muted: v('muted'),
        line: v('line'),
      },
      fontFamily: {
        // One typeface for the whole site: the hero headline's Instrument Sans.
        // `display` and `hero` stay as aliases so headings keep their class names.
        sans: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
        display: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
        hero: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
      },
      // Type scale. Display sizes are fluid between 360px and 1440px. Headings are semibold
      // with tightened tracking, matching the hero headline.
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5' }],      // 13
        sm: ['0.875rem', { lineHeight: '1.5' }],       // 14
        base: ['1.0625rem', { lineHeight: '1.65' }],   // 17
        lg: ['1.125rem', { lineHeight: '1.6' }],       // 18
        xl: ['1.375rem', { lineHeight: '1.35' }],      // 22
        h3: ['clamp(1.625rem, 1.2rem + 1vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
        h2: ['clamp(2.25rem, 1.5rem + 3vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.035em', fontWeight: '600' }],
        hero: ['clamp(2.75rem, 1.5rem + 4.8vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '600' }],
        h1: ['clamp(2.75rem, 1.5rem + 4.8vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '600' }],
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

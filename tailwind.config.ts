import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Anthropic-style color palette
        background: '#FAF9F6', // warm off-white
        'background-secondary': '#EDE9E0', // darker cream for testimonials
        foreground: '#1A1714', // dark brown-charcoal
        border: '#D6D0C8', // 1px dividers
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        // From globals.css :root (used by button and other UI)
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        success: 'var(--success)',
        'success-foreground': 'var(--success-foreground)',
        warning: 'var(--warning)',
        'warning-foreground': 'var(--warning-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-mobile': ['clamp(2.5rem, 10vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'quote': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.4' }],
      },
      spacing: {
        'section': '8rem',
        'section-mobile': '4rem',
      },
      maxWidth: {
        'editorial': '1200px',
        'narrow': '680px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

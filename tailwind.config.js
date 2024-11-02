import { animations, components, palettes, rounded, shade, visualizations } from '@tailus/themer';
import typography from '@tailwindcss/typography';
import tailwindAnimations from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@tailus/themer/dist/**/*.{js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...palettes.trust,
        'soft-bg': 'var(--ui-soft-bg)',
        'sidebar-background': 'var(--sidebar-background)',
        'sidebar-foreground': 'var(--sidebar-foreground)',
        'sidebar-accent': 'var(--sidebar-accent)',
        'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
        'sidebar-border': 'var(--sidebar-border)',
        'sidebar-ring': 'var(--sidebar-ring)',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Geist', 'Inter', ...defaultTheme.fontFamily.sans],
        mono: ['GeistMono', 'fira-code', ...defaultTheme.fontFamily.mono],
      },
      rounded: {
        card: '0.75rem',
        btn: 'var(--btn-radius)',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [animations, components, rounded, shade, visualizations, tailwindAnimations, typography],
};

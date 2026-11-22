/* Tailwind config for the frontend react app. This is where the app theme should be defined: https://v2.tailwindcss.com/docs/configuration. */

import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Jost', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        /* Tibetan temple palette: warm coffee-browns, terracotta, deep wine, saffron */
        cream: {
          DEFAULT: '#E8D9C3',
          50: '#F7EFE1',
          100: '#F3E9D7',
          200: '#E8D9C3',
          300: '#DFCBAE',
          400: '#D9C3A9',
        },
        clay: {
          DEFAULT: '#D9C3A9',
          light: '#E6D4BB',
          dark: '#C0A683',
        },
        terracotta: {
          DEFAULT: '#B4674A',
          light: '#C98A6B',
          dark: '#8F4E37',
        },
        wine: {
          DEFAULT: '#6B2A2A',
          light: '#7E3936',
          dark: '#551F1E',
          deep: '#3B1715',
        },
        saffron: {
          DEFAULT: '#D07832',
          light: '#E08A3C',
          dark: '#B8621F',
        },
        gold: {
          DEFAULT: '#B49A67',
          light: '#C7B183',
          dark: '#967D4D',
          hover: '#C2A976',
        },
        espresso: {
          DEFAULT: '#2E1F1A',
          muted: '#553F35',
          soft: '#6E564A',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        elevation: '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.42, 0, 0.58, 1)',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config

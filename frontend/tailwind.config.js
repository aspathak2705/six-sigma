/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink:    '#0A0E1A',
        panel:  '#111827',
        card:   '#1A2235',
        border: '#1E2D45',
        cyan:   { DEFAULT: '#00E5FF', dim: '#00B8CC', glow: 'rgba(0,229,255,0.15)' },
        coral:  { DEFAULT: '#FF6B6B', dim: '#CC5555' },
        amber:  { DEFAULT: '#FFB347', dim: '#CC8F39' },
        jade:   { DEFAULT: '#00D68F', dim: '#00A870' },
        violet: { DEFAULT: '#A78BFA', dim: '#7C5FD4' },
        muted:  '#4B6080',
        subtle: '#8A9BB5',
      },
      boxShadow: {
        glow:     '0 0 24px rgba(0,229,255,0.18)',
        'glow-sm':'0 0 12px rgba(0,229,255,0.12)',
        card:     '0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(0,229,255,0.1)' },
          '50%':       { boxShadow: '0 0 28px rgba(0,229,255,0.3)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.5s ease forwards',
        'fade-in':    'fade-in 0.4s ease forwards',
        'pulse-glow': 'pulse_glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

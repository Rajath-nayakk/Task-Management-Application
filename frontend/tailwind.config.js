/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#07070d',
          surface: '#0d0d17',
          card: '#121221',
          cardHover: '#17172b',
          border: '#1e1e38',
          borderGlow: 'var(--neon-glow-border)',
          cyan: '#00f0ff',
          magenta: '#ff2bd6',
          yellow: '#f5e642',
          green: '#39ff88',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'pulse-neon': 'pulseNeon 2.5s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '0.9', filter: 'drop-shadow(0 0 6px var(--neon-primary))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 14px var(--neon-primary))' },
        },
      },
    },
  },
  plugins: [],
}

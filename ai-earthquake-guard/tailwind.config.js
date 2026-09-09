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
        seismic: {
          dark: '#0a0e17',
          card: '#111827',
          panel: '#151d30',
          border: '#1e293b',
          accent: '#00f2fe',
          cyan: '#06b6d4',
          alert: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          pwave: '#38bdf8',
          swave: '#f43f5e',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

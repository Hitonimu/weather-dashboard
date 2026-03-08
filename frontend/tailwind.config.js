/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
        'bg-light': '#f0f4f8',
        'bg-dark': '#0f172a',
        'glass-light': 'rgba(255,255,255,0.65)',
        'glass-dark': 'rgba(30,41,59,0.65)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31,38,135,0.15)',
        'card-hover': '0 20px 40px rgba(31,38,135,0.18)',
        'blue-glow': '0 0 40px rgba(59,130,246,0.3)',
      },
      backgroundImage: {
        'weather-gradient': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
        'storm-gradient': 'linear-gradient(135deg, #475569 0%, #334155 100%)',
        'rain-gradient': 'linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%)',
        'sunny-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'mesh-light': 'radial-gradient(at 40% 20%, hsla(214,100%,76%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.2) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

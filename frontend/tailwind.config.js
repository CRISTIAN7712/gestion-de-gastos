/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // ← Activar dark mode por clase
  theme: {
    extend: {
      colors: {
        // Paleta premium para finanzas - Modo claro
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        finance: {
          // Modo claro
          dark: '#0f172a',
          base: '#1e293b',
          muted: '#64748b',
          light: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          // ← Nuevos colores para modo oscuro
          'dark-bg': '#0a0f1d',
          'dark-card': '#111827',
          'dark-border': '#1f2937',
          'dark-text': '#f1f5f9',
          'dark-muted': '#94a3b8',
        },
        accent: {
          gold: '#d4af37',
          emerald: '#059669',
          ruby: '#dc2626',
          amber: '#f59e0b',
          violet: '#7c3aed',
        },
        gradient: {
          primary: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
          success: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          warning: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
          danger: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
          luxury: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'elevated': '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'luxury': '0 8px 40px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)',
        'glow': '0 0 0 4px rgba(14, 165, 233, 0.15)',
        'dark-soft': '0 2px 12px rgba(0, 0, 0, 0.2)',
        'dark-elevated': '0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
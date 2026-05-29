const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    50:  '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                surface: {
                    50:  '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    700: '#334155',
                    800: '#1e293b',
                    850: '#162032',
                    900: '#0f172a',
                    950: '#020617',
                },
                emerald: {
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                },
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'glow-brand': '0 0 20px -5px rgba(99,102,241,.4)',
                'glow-emerald': '0 0 20px -5px rgba(16,185,129,.4)',
                'card': '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)',
                'card-hover': '0 10px 25px -5px rgba(0,0,0,.15), 0 8px 10px -6px rgba(0,0,0,.1)',
                'glass': '0 8px 32px rgba(0,0,0,.12)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'gradient-x': 'gradient-x 8s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(.4,0,.6,1) infinite',
                'fade-in-up': 'fadeInUp .5s ease-out',
                'fade-in': 'fadeIn .4s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'fadeInUp': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fadeIn': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}
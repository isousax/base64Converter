const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4361ee',
                'primary-light': '#4895ef',
                secondary: '#3f37c9',
                success: '#4cc9f0',
                warning: '#f72585',
                dark: '#2b2d42',
                light: '#f8f9fa',
                border: '#e2e8f0',
                customGray: '#8d99ae',
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}
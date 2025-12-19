/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'gold-shine': 'goldShine 3s infinite linear',
                'marquee': 'marquee 40s linear infinite',
                'float-slow': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: 0, transform: 'translateY(20px)', filter: 'blur(5px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
                },
                goldShine: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                }
            },
            colors: {
                obsidian: {
                    50: '#f8fafc',
                    950: '#000000',
                },
                gold: {
                    500: '#d4af37',
                    600: '#b8860b',
                }
            }
        },
    },
    plugins: [],
}

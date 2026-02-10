/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                jack: {
                    // Fondo principal: Un negro con un matiz púrpura muy profundo (sacado de las sombras del pantalón)
                    base: '#0B0A12',

                    // Paneles/Tarjetas: Azul oscuro desaturado (sacado del forro de la capa)
                    panel: '#151922',

                    // Acción Principal: El rojo vino tinto de la capa (NO es rojo brillante, es elegante)
                    crimson: '#7A1F2E',

                    // Acentos: El dorado del reloj de bolsillo y los botones
                    gold: '#Cfb568',

                    // Texto Principal: El gris azulado/plata del chaleco
                    silver: '#A8B4C2',

                    // Detalles sutiles: El morado ciruela de los pantalones
                    plum: '#3E2034',

                    // Texto de lectura: Blanco hueso (camisa)
                    white: '#E8E6E1',
                }
            },
            fontFamily: {
                serif: ['Times New Roman', 'serif'],
                cinzel: ['var(--font-cinzel)', 'serif'], // Asegúrate de tener esto si usas fuentes google
            },
            backgroundImage: {
                // Un degradado que va desde el azul oscuro de la capa hasta el negro
                'london-mist': "radial-gradient(circle at center, #1F2533 0%, #0B0A12 100%)",
                // Textura sutil para los paneles
                'velvet': "linear-gradient(to bottom right, #151922, #0B0A12)",
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(207, 181, 104, 0.1)' },
                    '50%': { boxShadow: '0 0 40px rgba(207, 181, 104, 0.3)' },
                },
                'ticker-down': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-50%)' },
                },
            },
            animation: {
                marquee: 'marquee 35s linear infinite',
                shimmer: 'shimmer 0.7s ease-in-out',
                'gradient-shift': 'gradient-shift 8s ease infinite',
                float: 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'ticker-down': 'ticker-down 20s linear infinite',
            },
        },
    },
    plugins: [],
}
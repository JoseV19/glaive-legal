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
            }
        },
    },
    plugins: [],
}
import type { Metadata } from "next";
import { Cinzel, Merriweather } from "next/font/google";
import "./globals.css";

// Cargamos las fuentes de Google
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-cinzel'
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: "GLAIVE",
  description: "Zionak Legal Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicamos las variables de fuente y el color base */}
      <body className={`${cinzel.variable} ${merriweather.variable} bg-jack-base text-jack-silver font-serif antialiased`}>
        {children}
      </body>
    </html>
  );
}
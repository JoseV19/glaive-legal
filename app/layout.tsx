import { Inter, Cinzel, Playfair_Display } from 'next/font/google';
import './globals.css';
import ClientShell from '@/components/ClientShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0B0A12" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Glaive Legal" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} ${playfair.variable} bg-london-mist text-jack-silver flex h-screen overflow-hidden`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

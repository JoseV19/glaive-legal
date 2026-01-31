"use client";
import { Inter, Cinzel, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Scale, LayoutDashboard, FolderOpen, Users, BookOpen, Settings, FileText, Bot, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // <--- AGREGAMOS usePathname

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // <--- Detectamos en qué página estamos

  // DETECTAR SI ESTAMOS EN EL LOGIN
  const isLoginPage = pathname === '/login';

  // FUNCIÓN DE LOGOUT
  const handleLogout = () => {
    if (confirm("¿Cerrar sesión y bloquear el sistema?")) {
      localStorage.removeItem("user_name");
      window.location.href = '/login';
    }
  };

  return (
    <html lang="es">
      <body className={`${inter.variable} ${cinzel.variable} ${playfair.variable} bg-london-mist text-jack-silver flex h-screen overflow-hidden`}>

        {/* --- LÓGICA CONDICIONAL: SI ES LOGIN, SOLO MUESTRA EL CONTENIDO --- */}
        {isLoginPage ? (
          <main className="w-full h-full">
            {children}
          </main>
        ) : (
          /* --- SI NO ES LOGIN (ES EL DASHBOARD), MUESTRA TODO EL SISTEMA --- */
          <>
            {/* SIDEBAR (Solo PC) */}
            <aside className="w-64 bg-jack-base border-r border-jack-gold/20 flex flex-col hidden md:flex z-50 shadow-2xl">
              <div className="p-6 border-b border-jack-gold/10 flex items-center gap-3">
                <div className="p-2 bg-jack-plum/20 rounded border border-jack-gold/30">
                  <Scale className="w-6 h-6 text-jack-gold" />
                </div>
                <div>
                  <h1 className="text-xl font-cinzel font-bold text-jack-white tracking-widest">GLAIVE</h1>
                  <p className="text-[9px] text-jack-silver/50 uppercase tracking-widest">Enterprise Edition</p>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <p className="text-[10px] uppercase tracking-widest text-jack-gold/50 font-bold mb-2 mt-4 px-3">Gestión</p>
                <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
                  <LayoutDashboard className="w-4 h-4 group-hover:text-jack-gold" /> Dashboard
                </Link>
                <Link href="/expedientes" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
                  <FolderOpen className="w-4 h-4 group-hover:text-jack-gold" /> Expedientes
                </Link>
                <Link href="/clientes" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
                  <Users className="w-4 h-4 group-hover:text-jack-gold" /> Clientes (CRM)
                </Link>

                <p className="text-[10px] uppercase tracking-widest text-jack-gold/50 font-bold mb-2 mt-6 px-3">Herramientas IA</p>
                <Link href="/laboral" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
                  <Bot className="w-4 h-4 text-jack-crimson" /> Analista Legal
                </Link>
                <Link href="/protocolo" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
                  <FileText className="w-4 h-4 group-hover:text-jack-gold" /> Redacción
                </Link>
                <Link href="/codex" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
                  <BookOpen className="w-4 h-4 group-hover:text-jack-gold" /> Biblioteca
                </Link>
              </nav>

              <div className="p-4 border-t border-jack-gold/10 space-y-2">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-xs text-jack-silver/50 hover:text-jack-gold transition-colors">
                  <Settings className="w-4 h-4" /> Configuración
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-xs text-jack-crimson hover:bg-jack-crimson/10 rounded transition-colors font-bold tracking-wider"
                >
                  <LogOut className="w-4 h-4" /> CERRAR SESIÓN
                </button>
              </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <main className="flex-1 overflow-y-auto relative bg-london-mist pb-20 md:pb-0">

              {/* Header Flotante */}
              <div className="sticky top-0 z-40 w-full h-16 bg-jack-panel/95 backdrop-blur-md border-b border-jack-gold/10 flex items-center justify-between px-6 md:px-8 shadow-lg">
                <h2 className="text-xs md:text-sm font-cinzel text-jack-gold tracking-widest">ZIONAK LEGAL SYSTEMS</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLogout}
                    className="md:hidden text-jack-silver/50 hover:text-jack-crimson transition-colors"
                    title="Salir"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-jack-crimson flex items-center justify-center text-xs font-bold text-white border border-jack-gold/20 shadow-[0_0_10px_rgba(122,31,46,0.5)] cursor-default">
                    W
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-8">
                {children}
              </div>
            </main>

            {/* MENU MOVIL INFERIOR (Solo Celular) */}
            <nav className="md:hidden fixed bottom-0 w-full bg-jack-base border-t border-jack-gold/20 z-50 flex justify-around items-center py-3 px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
              <Link href="/" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-[9px] uppercase tracking-widest">Inicio</span>
              </Link>
              <Link href="/expedientes" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
                <FolderOpen className="w-5 h-5" />
                <span className="text-[9px] uppercase tracking-widest">Casos</span>
              </Link>
              <Link href="/laboral" className="relative -top-5 bg-jack-crimson border-4 border-jack-base rounded-full p-3 shadow-[0_0_15px_rgba(122,31,46,0.6)] text-white hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </Link>
              <Link href="/clientes" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
                <Users className="w-5 h-5" />
                <span className="text-[9px] uppercase tracking-widest">CRM</span>
              </Link>
              <Link href="/codex" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-[9px] uppercase tracking-widest">Leyes</span>
              </Link>
            </nav>
          </>
        )}

      </body>
    </html>
  );
}
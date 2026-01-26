"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scale, FileSignature, Gavel, Settings, BookOpen, Book, LogOut, ShieldAlert } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // --- EL GUARDIA DE SEGURIDAD (Auth Guard) ---
  useEffect(() => {
    // Verificamos si existe la "llave" en el navegador
    const storedName = localStorage.getItem("user_name");

    if (!storedName) {
      // SI NO HAY LLAVE: ¡Alerta de Intruso! Redirigir al Login
      router.push('/login');
    } else {
      // SI HAY LLAVE: Permitir el paso y cargar el nombre
      setUserName(storedName);
      setLoading(false);
    }
  }, [router]);

  // --- FUNCIÓN DE LOGOUT ---
  const handleLogout = () => {
    if (confirm("¿Desea cerrar la sesión segura y bloquear el sistema?")) {
      // 1. Destruir la credencial
      localStorage.removeItem("user_name");
      // 2. Redirigir a la pantalla de bloqueo
      router.push('/login');
    }
  };

  // Pantalla de carga mientras el Guardia verifica (para evitar parpadeos)
  if (loading) {
    return (
      <div className="min-h-screen bg-jack-base flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-jack-crimson" />
          <span className="text-jack-gold font-cinzel tracking-widest text-xs">VERIFICANDO CREDENCIALES...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-london-mist p-8 md:p-12 flex flex-col items-center relative overflow-hidden animate-in fade-in duration-700">

      {/* Elemento decorativo de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-jack-gold/5 rounded-full pointer-events-none"></div>

      {/* BOTÓN DE LOGOUT (Esquina Superior Derecha) */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 group flex items-center gap-2 px-4 py-2 border border-jack-crimson/30 rounded-full hover:bg-jack-crimson hover:text-white transition-all z-50"
        title="Cerrar Sesión"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold hidden md:block group-hover:block">Cerrar Sesión</span>
        <LogOut className="w-4 h-4 text-jack-crimson group-hover:text-white" />
      </button>

      {/* HEADER: Bienvenida Personalizada */}
      <header className="z-10 text-center mb-12 max-w-2xl relative">
        <div className="inline-block mb-4 p-2 rounded-full border border-jack-gold/30 bg-jack-plum/20">
          <Scale className="w-8 h-8 text-jack-gold" />
        </div>
        <h1 className="text-6xl md:text-7xl font-bold text-jack-gold tracking-[0.15em] drop-shadow-2xl mb-2 font-cinzel">
          GLAIVE (Demo)
        </h1>
        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-jack-crimson to-transparent mx-auto mb-4"></div>
        <p className="text-jack-silver tracking-widest text-sm uppercase font-serif opacity-80">
          Bienvenido a su despacho, <span className="text-jack-gold font-bold">{userName}</span>
        </p>
      </header>

      {/* GRID DE MÓDULOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 w-full max-w-5xl">

        {/* CARD 1: PROTOCOLO */}
        <Link href="/protocolo" className="group relative bg-jack-panel border border-jack-gold/20 p-8 rounded-sm hover:border-jack-gold transition-all duration-500 hover:shadow-[0_0_30px_rgba(194,155,64,0.15)] overflow-hidden">
          <div className="absolute top-0 left-0 w-[2px] h-0 bg-jack-gold group-hover:h-full transition-all duration-500 ease-out"></div>
          <div className="flex justify-between items-start mb-6">
            <FileSignature className="w-10 h-10 text-jack-silver group-hover:text-jack-gold transition-colors" />
            <span className="text-[10px] tracking-widest text-jack-crimson font-bold border border-jack-crimson/30 px-2 py-1 rounded bg-jack-crimson/10">PRIORIDAD</span>
          </div>
          <h2 className="text-2xl text-jack-white font-bold mb-3 font-cinzel tracking-wide group-hover:translate-x-2 transition-transform">
            Matriz de Protocolo
          </h2>
          <p className="text-jack-silver/70 text-sm leading-relaxed font-serif">
            Editor de precisión milimétrica. Formato de 25 líneas con márgenes estrictos para impresión notarial.
          </p>
        </Link>

        {/* CARD 2: DEFENSA LABORAL */}
        <Link href="/laboral" className="group relative bg-jack-panel border border-jack-gold/20 p-8 rounded-sm hover:border-jack-crimson transition-all duration-500 hover:shadow-[0_0_30px_rgba(122,31,46,0.25)] overflow-hidden">
          <div className="absolute top-0 left-0 w-[2px] h-0 bg-jack-crimson group-hover:h-full transition-all duration-500 ease-out"></div>
          <div className="flex justify-between items-start mb-6">
            <Gavel className="w-10 h-10 text-jack-silver group-hover:text-jack-crimson transition-colors" />
            <span className="text-[10px] tracking-widest text-jack-silver font-bold border border-jack-silver/30 px-2 py-1 rounded bg-jack-silver/10">IA ACTIVA v4.0</span>
          </div>
          <h2 className="text-2xl text-jack-white font-bold mb-3 font-cinzel tracking-wide group-hover:translate-x-2 transition-transform">
            Defensa Laboral
          </h2>
          <p className="text-jack-silver/70 text-sm leading-relaxed font-serif">
            Detector de amenazas y generador de fundamentos jurídicos. Analiza despidos, acoso y prestaciones.
          </p>
        </Link>

        {/* CARD 3: CODEX LEGISLATIVO */}
        <Link href="/codex" className="group relative bg-jack-panel border border-jack-gold/20 p-8 rounded-sm hover:border-jack-silver transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,180,194,0.15)] overflow-hidden">
          <div className="absolute top-0 left-0 w-[2px] h-0 bg-jack-silver group-hover:h-full transition-all duration-500 ease-out"></div>
          <div className="flex justify-between items-start mb-6">
            <Book className="w-10 h-10 text-jack-silver group-hover:text-white transition-colors" />
            <span className="text-[10px] tracking-widest text-jack-silver font-bold border border-jack-silver/30 px-2 py-1 rounded bg-jack-silver/10">LEYES</span>
          </div>
          <h2 className="text-2xl text-jack-white font-bold mb-3 font-cinzel tracking-wide group-hover:translate-x-2 transition-transform">
            Codex Legislativo
          </h2>
          <p className="text-jack-silver/70 text-sm leading-relaxed font-serif">
            Búsqueda rápida en la Constitución, Código Penal, Civil, Laboral y de Comercio. "Los 5 Grandes".
          </p>
        </Link>

        {/* CARD 4: JURISPRUDENCIA */}
        <Link href="/investigacion" className="group relative bg-jack-panel border border-jack-gold/20 p-8 rounded-sm hover:border-jack-gold transition-all duration-500 hover:shadow-[0_0_30px_rgba(194,155,64,0.15)] overflow-hidden">
          <div className="absolute top-0 left-0 w-[2px] h-0 bg-jack-gold group-hover:h-full transition-all duration-500 ease-out"></div>
          <div className="flex justify-between items-start mb-6">
            <BookOpen className="w-10 h-10 text-jack-silver group-hover:text-jack-gold transition-colors" />
            <span className="text-[10px] tracking-widest text-jack-gold font-bold border border-jack-gold/30 px-2 py-1 rounded bg-jack-gold/10">ARCHIVO</span>
          </div>
          <h2 className="text-2xl text-jack-white font-bold mb-3 font-cinzel tracking-wide group-hover:translate-x-2 transition-transform">
            Jurisprudencia
          </h2>
          <p className="text-jack-silver/70 text-sm leading-relaxed font-serif">
            Buscador de precedentes y expedientes. Compare su caso con sentencias de la Corte de Constitucionalidad.
          </p>
        </Link>

      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full bg-jack-panel border-t border-jack-gold/10 p-4 flex justify-between items-center text-xs text-jack-silver/40 z-20 font-serif">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-900 border border-green-500 shadow-[0_0_5px_#22c55e]"></div>
          <span>SISTEMA OPERATIVO: ONLINE</span>
        </div>
        <div className="italic text-jack-gold/50 hidden md:block">
          "London Bridge is falling down..."
        </div>
        <div className="flex items-center gap-4">
          <span>v.1.1.0</span>
          <Settings className="w-4 h-4 hover:text-jack-gold cursor-pointer transition-colors" />
        </div>
      </footer>

    </main>
  );
}
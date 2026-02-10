"use client";
import { useState, useEffect, useRef } from 'react';
import { Scale, LayoutDashboard, FolderOpen, Users, BookOpen, Settings, FileText, Bot, LogOut, Bell, FileSignature, FolderPlus, RefreshCw, Upload, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UserRole, ROLES, getUserRole, canAccessRoute } from '@/lib/roles';

interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  leido: boolean;
  expediente_id: number | null;
  created_at: string;
}

function NotifIcon({ tipo }: { tipo: string }) {
  switch (tipo) {
    case 'expediente_creado': return <FolderPlus className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />;
    case 'estado_actualizado': return <RefreshCw className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />;
    case 'documento_subido': return <Upload className="w-4 h-4 text-jack-gold mt-0.5 flex-shrink-0" />;
    case 'plazo_proximo': return <Clock className="w-4 h-4 text-jack-crimson mt-0.5 flex-shrink-0" />;
    default: return <Bell className="w-4 h-4 text-jack-silver/50 mt-0.5 flex-shrink-0" />;
  }
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} dias`;
  return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' });
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCleanLayout = pathname === '/login' || pathname === '/landing';

  const [role, setRole] = useState<UserRole>('titular');
  const [userName, setUserName] = useState('U');
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notificaciones.filter((n) => !n.leido).length;

  // Read client-only values after mount
  useEffect(() => {
    setRole(getUserRole());
    setUserName(localStorage.getItem('user_name') || 'U');
  }, []);

  // Fetch notifications + realtime
  useEffect(() => {
    if (isCleanLayout) return;

    async function fetchNotificaciones() {
      const { data } = await supabase
        .from('notificaciones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      setNotificaciones((data as Notificacion[]) || []);
    }
    fetchNotificaciones();

    const channel = supabase
      .channel('notificaciones-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notificaciones' },
        (payload) => {
          setNotificaciones((prev) => [payload.new as Notificacion, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isCleanLayout]);

  // Close notification panel on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    }
    if (showNotifPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifPanel]);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  async function markAsRead(id: number) {
    await supabase.from('notificaciones').update({ leido: true }).eq('id', id);
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
    );
  }

  async function markAllRead() {
    await supabase.from('notificaciones').update({ leido: true }).eq('leido', false);
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
  }

  const handleLogout = () => {
    if (confirm("Cerrar sesion y bloquear el sistema?")) {
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      window.location.href = '/login';
    }
  };

  const sidebarGestion = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/expedientes', icon: FolderOpen, label: 'Expedientes' },
    { href: '/clientes', icon: Users, label: 'Clientes (CRM)' },
    { href: '/calendario', icon: Calendar, label: 'Calendario' },
  ];

  const sidebarHerramientas = [
    { href: '/laboral', icon: Bot, label: 'Analista Legal', iconClass: 'text-jack-crimson' },
    { href: '/protocolo', icon: FileText, label: 'Redaccion' },
    { href: '/plantillas', icon: FileSignature, label: 'Plantillas' },
    { href: '/codex', icon: BookOpen, label: 'Biblioteca' },
  ];

  // Clean layout for login/landing
  if (isCleanLayout) {
    return (
      <main className="w-full h-full">
        {children}
      </main>
    );
  }

  // App shell
  return (
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
          <p className="text-[10px] uppercase tracking-widest text-jack-gold/50 font-bold mb-2 mt-4 px-3">Gestion</p>
          {sidebarGestion.filter(item => canAccessRoute(role, item.href)).map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
              <item.icon className="w-4 h-4 group-hover:text-jack-gold" /> {item.label}
            </Link>
          ))}

          <p className="text-[10px] uppercase tracking-widest text-jack-gold/50 font-bold mb-2 mt-6 px-3">Herramientas</p>
          {sidebarHerramientas.filter(item => canAccessRoute(role, item.href)).map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 text-jack-silver hover:text-jack-white transition-colors group">
              <item.icon className={`w-4 h-4 ${item.iconClass || 'group-hover:text-jack-gold'}`} /> {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-jack-gold/10 space-y-2">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-xs text-jack-silver/50 hover:text-jack-gold transition-colors">
            <Settings className="w-4 h-4" /> Configuracion
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-xs text-jack-crimson hover:bg-jack-crimson/10 rounded transition-colors font-bold tracking-wider"
          >
            <LogOut className="w-4 h-4" /> CERRAR SESION
          </button>
        </div>
      </aside>

      {/* AREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative bg-london-mist pb-20 md:pb-0">

        {/* Header Flotante */}
        <div className="sticky top-0 z-40 w-full h-16 bg-jack-panel/95 backdrop-blur-md border-b border-jack-gold/10 flex items-center justify-between px-6 md:px-8 shadow-lg">
          <h2 className="text-xs md:text-sm font-cinzel text-jack-gold tracking-widest">ZIONAK LEGAL SYSTEMS</h2>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="relative p-2 text-jack-silver/50 hover:text-jack-gold transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-jack-crimson text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifPanel && (
                <div className="absolute right-0 top-12 w-80 md:w-96 bg-jack-base border border-jack-gold/20 rounded shadow-2xl z-50 max-h-[70vh] flex flex-col">
                  <div className="p-4 border-b border-jack-gold/10 flex justify-between items-center">
                    <h3 className="text-jack-white font-cinzel font-bold text-sm">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] text-jack-gold hover:underline">
                        Marcar todas como leidas
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto flex-1 divide-y divide-white/5">
                    {notificaciones.length === 0 ? (
                      <div className="p-8 text-center text-jack-silver/30 text-sm">
                        No hay notificaciones.
                      </div>
                    ) : (
                      notificaciones.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${!n.leido ? 'bg-jack-gold/5 border-l-2 border-l-jack-gold' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <NotifIcon tipo={n.tipo} />
                            <div className="min-w-0">
                              <p className={`text-sm leading-snug ${!n.leido ? 'text-jack-white font-bold' : 'text-jack-silver/70'}`}>
                                {n.mensaje}
                              </p>
                              <p className="text-[10px] text-jack-silver/40 mt-1">
                                {timeAgo(n.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile logout */}
            <button
              onClick={handleLogout}
              className="md:hidden text-jack-silver/50 hover:text-jack-crimson transition-colors"
              title="Salir"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Role badge */}
            <span className={`hidden sm:inline-block text-[9px] px-2 py-0.5 rounded font-bold tracking-widest ${ROLES[role].badgeClass}`}>
              {ROLES[role].label}
            </span>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-jack-crimson flex items-center justify-center text-xs font-bold text-white border border-jack-gold/20 shadow-[0_0_10px_rgba(122,31,46,0.5)] cursor-default">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* MENU MOVIL INFERIOR */}
      <nav className="md:hidden fixed bottom-0 w-full bg-jack-base border-t border-jack-gold/20 z-50 flex justify-around items-center py-3 px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest">Inicio</span>
        </Link>
        {canAccessRoute(role, '/expedientes') && (
          <Link href="/expedientes" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
            <FolderOpen className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest">Casos</span>
          </Link>
        )}
        {canAccessRoute(role, '/laboral') && (
          <Link href="/laboral" className="relative -top-5 bg-jack-crimson border-4 border-jack-base rounded-full p-3 shadow-[0_0_15px_rgba(122,31,46,0.6)] text-white hover:scale-110 transition-transform">
            <Bot className="w-6 h-6" />
          </Link>
        )}
        {canAccessRoute(role, '/clientes') && (
          <Link href="/clientes" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
            <Users className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest">CRM</span>
          </Link>
        )}
        {canAccessRoute(role, '/codex') && (
          <Link href="/codex" className="flex flex-col items-center gap-1 text-jack-silver hover:text-jack-gold transition-colors p-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-widest">Leyes</span>
          </Link>
        )}
      </nav>
    </>
  );
}

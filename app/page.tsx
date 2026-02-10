"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, FileText, Gavel, Search, Loader2, Users, Briefcase, Scale, BookOpen,
  Bot, Calendar, Clock, FolderOpen, ChevronRight, Sparkles, TrendingUp,
  Bell, FileSignature, Activity, CircleDot, Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, StaggerItem } from '@/components/animations/StaggerChildren';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';

// --- INTERFACES ---
interface Expediente {
  id: number;
  numero_caso: string;
  materia: string;
  estado: string;
  created_at: string;
  clientes: { nombre: string };
}

interface Evento {
  id: number;
  titulo: string;
  tipo: string;
  fecha: string;
  hora: string | null;
  prioridad: string;
  completado: boolean;
  expediente_id: number | null;
}

interface Actividad {
  id: number;
  tipo: string;
  descripcion: string;
  usuario: string;
  created_at: string;
}

interface KPIs {
  totalExpedientes: number;
  enTramite: number;
  sentencia: number;
  archivo: number;
  totalClientes: number;
}

const estadoColor: Record<string, string> = {
  'En Trámite': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Sentencia': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Archivo': 'bg-white/5 text-jack-silver/50 border-white/10',
};

const materiaColor: Record<string, string> = {
  'Penal': 'text-red-400',
  'Laboral': 'text-blue-400',
  'Civil': 'text-jack-gold',
  'Familia': 'text-purple-400',
  'Mercantil': 'text-emerald-400',
};

const eventoTypeConfig: Record<string, { color: string; icon: typeof Calendar; bg: string }> = {
  audiencia: { color: 'text-blue-400', icon: Scale, bg: 'bg-blue-500/10 border-blue-500/20' },
  plazo: { color: 'text-jack-gold', icon: Clock, bg: 'bg-jack-gold/10 border-jack-gold/20' },
  recordatorio: { color: 'text-purple-400', icon: Bell, bg: 'bg-purple-500/10 border-purple-500/20' },
};

const actividadIcon: Record<string, { icon: typeof Activity; color: string }> = {
  expediente_creado: { icon: FolderOpen, color: 'text-blue-400' },
  documento_subido: { icon: FileText, color: 'text-jack-gold' },
  estado_actualizado: { icon: TrendingUp, color: 'text-emerald-400' },
  nota_agregada: { icon: FileSignature, color: 'text-purple-400' },
};

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
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' });
}

function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff < 0) return `Hace ${Math.abs(diff)}d`;
  return `En ${diff} días`;
}

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-jack-gold/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [recientes, setRecientes] = useState<Expediente[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [kpis, setKpis] = useState<KPIs>({ totalExpedientes: 0, enTramite: 0, sentencia: 0, archivo: 0, totalClientes: 0 });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setUserName(localStorage.getItem('user_name') || 'Abogado');
  }, []);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchDashboard() {
      const today = new Date().toISOString().split('T')[0];

      const [expRes, clientesRes, tramiteRes, sentenciaRes, archivoRes, eventosRes, actividadesRes] = await Promise.all([
        supabase
          .from('expedientes')
          .select('id, numero_caso, materia, estado, created_at, clientes(nombre)')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('expedientes')
          .select('*', { count: 'exact', head: true })
          .eq('estado', 'En Trámite'),
        supabase
          .from('expedientes')
          .select('*', { count: 'exact', head: true })
          .eq('estado', 'Sentencia'),
        supabase
          .from('expedientes')
          .select('*', { count: 'exact', head: true })
          .eq('estado', 'Archivo'),
        supabase
          .from('eventos')
          .select('*')
          .gte('fecha', today)
          .eq('completado', false)
          .order('fecha', { ascending: true })
          .limit(5),
        supabase
          .from('actividades')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6),
      ]);

      setRecientes((expRes.data as unknown as Expediente[]) || []);
      setEventos((eventosRes.data as Evento[]) || []);
      setActividades((actividadesRes.data as Actividad[]) || []);
      setKpis({
        totalExpedientes: (tramiteRes.count ?? 0) + (sentenciaRes.count ?? 0) + (archivoRes.count ?? 0),
        enTramite: tramiteRes.count ?? 0,
        sentencia: sentenciaRes.count ?? 0,
        archivo: archivoRes.count ?? 0,
        totalClientes: clientesRes.count ?? 0,
      });
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  const greeting = (() => {
    const h = currentTime.getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  const dateFormatted = currentTime.toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Scale className="w-10 h-10 text-jack-gold/40" />
        </motion.div>
        <p className="text-jack-silver/30 text-sm font-cinzel tracking-widest">CARGANDO SISTEMA</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">

      {/* ═══ WELCOME HERO ═══ */}
      <FadeIn direction="none" duration={0.8}>
        <div className="relative overflow-hidden rounded-sm border border-jack-gold/10 bg-gradient-to-br from-jack-panel via-jack-base to-jack-plum/30 p-6 md:p-8">
          <FloatingParticles />

          {/* Gold accent line */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-jack-gold to-transparent"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <motion.p
                className="text-jack-silver/50 text-xs uppercase tracking-[0.3em] mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {dateFormatted}
              </motion.p>
              <motion.h1
                className="text-2xl md:text-4xl font-cinzel font-bold text-jack-white tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {greeting},{' '}
                <span className="text-gradient-gold">{userName}</span>
              </motion.h1>
              <motion.p
                className="text-jack-silver/60 text-sm mt-2 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {kpis.enTramite > 0
                  ? `Tienes ${kpis.enTramite} caso${kpis.enTramite > 1 ? 's' : ''} activo${kpis.enTramite > 1 ? 's' : ''} y ${eventos.length} evento${eventos.length !== 1 ? 's' : ''} próximo${eventos.length !== 1 ? 's' : ''}.`
                  : 'Tu panel de gestión legal está listo.'
                }
              </motion.p>
            </div>

            {/* Quick action buttons */}
            <motion.div
              className="flex gap-3 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/expedientes"
                className="btn-shimmer bg-jack-crimson text-white px-5 py-2.5 rounded-sm text-sm font-bold tracking-wide flex items-center gap-2 hover:shadow-[0_0_25px_rgba(122,31,46,0.4)] transition-all duration-300"
              >
                <Briefcase className="w-4 h-4" /> NUEVO CASO
              </Link>
              <Link
                href="/laboral"
                className="btn-shimmer bg-jack-panel border border-jack-gold/20 text-jack-silver hover:text-jack-gold px-5 py-2.5 rounded-sm text-sm flex items-center gap-2 hover:border-jack-gold/50 transition-all duration-300"
              >
                <Bot className="w-4 h-4" /> ANALISTA IA
              </Link>
            </motion.div>
          </div>

          {/* Bottom gold accent */}
          <motion.div
            className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-jack-gold/30 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          />
        </div>
      </FadeIn>

      {/* ═══ KPI CARDS ═══ */}
      <StaggerChildren staggerDelay={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'En Trámite', value: kpis.enTramite, sub: 'Casos activos', color: 'text-blue-400', borderColor: 'hover:border-blue-500/30', glowColor: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]', icon: <Scale className="w-5 h-5" /> },
          { label: 'Sentencia', value: kpis.sentencia, sub: 'Resueltos', color: 'text-emerald-400', borderColor: 'hover:border-emerald-500/30', glowColor: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]', icon: <Gavel className="w-5 h-5" /> },
          { label: 'Archivo', value: kpis.archivo, sub: 'Cerrados', color: 'text-jack-silver/50', borderColor: 'hover:border-white/20', glowColor: '', icon: <FileText className="w-5 h-5" /> },
          { label: 'Clientes', value: kpis.totalClientes, sub: 'Registrados', color: 'text-jack-gold', borderColor: 'hover:border-jack-gold/30', glowColor: 'hover:shadow-[0_0_20px_rgba(207,181,104,0.08)]', icon: <Users className="w-5 h-5" /> },
        ].map((stat, i) => (
          <StaggerItem key={i}>
            <motion.div
              className={`bg-jack-panel border border-jack-gold/10 p-5 rounded-sm transition-all duration-300 cursor-default ${stat.borderColor} ${stat.glowColor}`}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-widest text-jack-silver/50 font-bold">{stat.label}</p>
                <span className={`${stat.color} opacity-30`}>{stat.icon}</span>
              </div>
              <h3 className={`text-3xl md:text-4xl font-bold font-cinzel ${stat.color}`}>
                <AnimatedCounter target={stat.value} duration={1.5} />
              </h3>
              <p className="text-xs text-jack-silver/40 mt-3 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {stat.sub}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      {/* ═══ MAIN GRID: 3 columns ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── COL 1-2: Expedientes Recientes ── */}
        <FadeIn direction="left" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-jack-gold/10 pb-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-jack-gold/50" />
              <h3 className="text-jack-white font-cinzel font-bold text-sm">Expedientes Recientes</h3>
            </div>
            <Link href="/expedientes" className="text-xs text-jack-gold hover:text-jack-white transition-colors flex items-center gap-1">
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recientes.length === 0 ? (
            <div className="text-center py-16 text-jack-silver/30 bg-jack-panel border border-dashed border-jack-gold/10 rounded-sm">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <FileText className="w-10 h-10 mx-auto mb-4 opacity-20" />
              </motion.div>
              <p className="font-cinzel text-sm">No hay expedientes registrados.</p>
              <Link href="/expedientes" className="text-xs text-jack-gold hover:underline mt-2 inline-block">Crear el primero</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recientes.map((caso, idx) => (
                <motion.div
                  key={caso.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                >
                  <Link href={`/expedientes/${caso.id}`}>
                    <div className="bg-jack-panel border border-jack-gold/5 p-4 flex items-center justify-between hover:border-jack-gold/25 cursor-pointer transition-all duration-200 group rounded-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-jack-base rounded-sm border border-white/5 text-jack-silver group-hover:text-jack-gold group-hover:border-jack-gold/20 transition-all duration-200">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-jack-white text-sm font-bold group-hover:text-jack-gold transition-colors">
                            {caso.clientes?.nombre || 'Sin cliente'}
                          </h4>
                          <p className="text-xs text-jack-silver/50 mt-0.5">
                            {caso.numero_caso} &bull; <span className={materiaColor[caso.materia] || 'text-jack-silver'}>{caso.materia}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-sm font-bold border ${estadoColor[caso.estado] || 'bg-white/5 text-jack-silver border-white/10'}`}>
                          {caso.estado}
                        </span>
                        <span className="text-[10px] text-jack-silver/30">{timeAgo(caso.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </FadeIn>

        {/* ── COL 3: Upcoming Events ── */}
        <FadeIn direction="right" className="space-y-4">
          <div className="flex items-center justify-between border-b border-jack-gold/10 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-jack-gold/50" />
              <h3 className="text-jack-white font-cinzel font-bold text-sm">Próximos Eventos</h3>
            </div>
            <Link href="/calendario" className="text-xs text-jack-gold hover:text-jack-white transition-colors flex items-center gap-1">
              Calendario <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {eventos.length === 0 ? (
            <div className="text-center py-12 text-jack-silver/30 bg-jack-panel border border-dashed border-jack-gold/10 rounded-sm">
              <Calendar className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Sin eventos próximos.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {eventos.map((ev, idx) => {
                const config = eventoTypeConfig[ev.tipo] || eventoTypeConfig.recordatorio;
                const IconComp = config.icon;
                const dayLabel = daysUntil(ev.fecha);
                const isUrgent = ev.prioridad === 'urgente';
                const isToday = dayLabel === 'Hoy';

                return (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * idx, duration: 0.35 }}
                    className={`bg-jack-panel border rounded-sm p-3.5 transition-all duration-200 hover:border-jack-gold/25 ${isUrgent ? 'border-jack-crimson/30 animate-pulse-glow' : 'border-jack-gold/5'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-sm border ${config.bg} flex-shrink-0`}>
                        <IconComp className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-jack-white text-sm font-bold truncate">{ev.titulo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold ${isToday ? 'text-jack-crimson' : isUrgent ? 'text-jack-crimson' : 'text-jack-silver/50'}`}>
                            {dayLabel}
                          </span>
                          {ev.hora && (
                            <span className="text-[10px] text-jack-silver/40">
                              {ev.hora.slice(0, 5)}
                            </span>
                          )}
                        </div>
                      </div>
                      {isUrgent && (
                        <span className="text-[8px] bg-jack-crimson/20 text-jack-crimson px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">
                          Urgente
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </FadeIn>
      </div>

      {/* ═══ SECOND ROW: Activity + Quick Tools ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Activity Feed ── */}
        <FadeIn direction="up" delay={0.1} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-jack-gold/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-jack-gold/50" />
              <h3 className="text-jack-white font-cinzel font-bold text-sm">Actividad Reciente</h3>
            </div>
          </div>

          {actividades.length === 0 ? (
            <div className="text-center py-12 text-jack-silver/30 bg-jack-panel border border-dashed border-jack-gold/10 rounded-sm">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Sin actividad registrada.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-jack-gold/20 via-jack-gold/10 to-transparent" />

              <div className="space-y-1">
                {actividades.map((act, idx) => {
                  const actConfig = actividadIcon[act.tipo] || { icon: CircleDot, color: 'text-jack-silver/50' };
                  const ActIcon = actConfig.icon;

                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * idx, duration: 0.3 }}
                      className="flex items-start gap-4 py-3 pl-1 group"
                    >
                      <div className="relative z-10 p-1.5 rounded-full bg-jack-base border border-jack-gold/10 group-hover:border-jack-gold/30 transition-colors">
                        <ActIcon className={`w-3.5 h-3.5 ${actConfig.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-jack-silver/80 leading-snug">{act.descripcion}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-jack-silver/30">{act.usuario}</span>
                          <span className="text-[10px] text-jack-silver/20">&bull;</span>
                          <span className="text-[10px] text-jack-silver/30">{timeAgo(act.created_at)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </FadeIn>

        {/* ── Quick Tools ── */}
        <FadeIn direction="up" delay={0.2} className="space-y-4">
          <div className="flex items-center justify-between border-b border-jack-gold/10 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-jack-gold/50" />
              <h3 className="text-jack-white font-cinzel font-bold text-sm">Acceso Rápido</h3>
            </div>
          </div>

          <StaggerChildren staggerDelay={0.08} className="space-y-2.5">
            {[
              { href: '/laboral', icon: Bot, label: 'Analista Legal IA', desc: 'Detectar infracciones automáticamente', accent: 'jack-crimson', border: 'border-jack-crimson/20 hover:border-jack-crimson/40', bg: 'bg-jack-crimson/5 hover:bg-jack-crimson/10' },
              { href: '/codex', icon: BookOpen, label: 'Biblioteca Legal', desc: 'Consultar leyes y artículos', accent: 'jack-gold', border: 'border-jack-gold/20 hover:border-jack-gold/40', bg: 'bg-jack-gold/5 hover:bg-jack-gold/10' },
              { href: '/protocolo', icon: FileSignature, label: 'Redacción Notarial', desc: 'Editor de protocolo digital', accent: 'purple-400', border: 'border-purple-500/20 hover:border-purple-500/40', bg: 'bg-purple-500/5 hover:bg-purple-500/10' },
              { href: '/plantillas', icon: FileText, label: 'Plantillas', desc: 'Documentos con campos dinámicos', accent: 'blue-400', border: 'border-blue-500/20 hover:border-blue-500/40', bg: 'bg-blue-500/5 hover:bg-blue-500/10' },
            ].map((tool) => (
              <StaggerItem key={tool.href}>
                <Link href={tool.href}>
                  <motion.div
                    className={`btn-shimmer border rounded-sm p-4 transition-all duration-200 group cursor-pointer ${tool.border} ${tool.bg}`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3">
                      <tool.icon className={`w-5 h-5 text-${tool.accent} flex-shrink-0`} />
                      <div className="min-w-0">
                        <h4 className="text-jack-white text-sm font-bold group-hover:text-jack-gold transition-colors">{tool.label}</h4>
                        <p className="text-[11px] text-jack-silver/50 mt-0.5">{tool.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-jack-silver/20 group-hover:text-jack-gold/50 ml-auto flex-shrink-0 transition-colors" />
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* System status pill */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-jack-base border border-jack-gold/10 rounded-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-jack-silver/40 uppercase tracking-widest font-bold">Sistema Operativo</span>
            <Sparkles className="w-3 h-3 text-jack-gold/30" />
          </motion.div>
        </FadeIn>
      </div>
    </div>
  );
}

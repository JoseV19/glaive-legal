"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileText, Gavel, Search, Loader2, Users, Briefcase, Scale, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- INTERFACES ---
interface Expediente {
    id: number;
    numero_caso: string;
    materia: string;
    estado: string;
    created_at: string;
    clientes: {
        nombre: string;
    };
}

interface KPIs {
    totalExpedientes: number;
    enTramite: number;
    sentencia: number;
    archivo: number;
    totalClientes: number;
}

const estadoColor: Record<string, string> = {
    'En Trámite': 'bg-blue-900/20 text-blue-400 border-blue-900/30',
    'Sentencia': 'bg-green-900/20 text-green-400 border-green-900/30',
    'Archivo': 'bg-white/5 text-jack-silver/50 border-white/10',
};

const materiaColor: Record<string, string> = {
    'Penal': 'text-red-400',
    'Laboral': 'text-blue-400',
    'Civil': 'text-jack-gold',
    'Familia': 'text-purple-400',
    'Mercantil': 'text-emerald-400',
};

export default function Dashboard() {
    const [recientes, setRecientes] = useState<Expediente[]>([]);
    const [kpis, setKpis] = useState<KPIs>({ totalExpedientes: 0, enTramite: 0, sentencia: 0, archivo: 0, totalClientes: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            // Ejecutar queries en paralelo
            const [expRes, clientesRes, tramiteRes, sentenciaRes, archivoRes] = await Promise.all([
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
            ]);

            setRecientes((expRes.data as unknown as Expediente[]) || []);
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

    // Formatear fecha relativa
    function timeAgo(dateStr: string) {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `Hace ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours}h`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-cinzel text-jack-white font-bold">Panel de Control</h1>
                    <p className="text-jack-silver/60 text-sm mt-1">Resumen de actividad del bufete.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/expedientes" className="bg-jack-panel border border-jack-gold/20 text-jack-silver hover:text-white px-4 py-2 rounded-sm text-sm flex items-center gap-2 transition-colors">
                        <Search className="w-4 h-4" /> Buscar Expediente
                    </Link>
                    <Link href="/expedientes" className="bg-jack-crimson text-white px-4 py-2 rounded-sm text-sm font-bold tracking-wide flex items-center gap-2 hover:bg-red-900 transition-colors shadow-lg shadow-red-900/20">
                        <Briefcase className="w-4 h-4" /> NUEVO CASO
                    </Link>
                </div>
            </div>

            {/* 2. KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'En Trámite', value: kpis.enTramite, sub: 'Casos activos', color: 'text-blue-400', icon: <Scale className="w-4 h-4" /> },
                    { label: 'Sentencia', value: kpis.sentencia, sub: 'Resueltos', color: 'text-green-400', icon: <Gavel className="w-4 h-4" /> },
                    { label: 'Archivo', value: kpis.archivo, sub: 'Cerrados', color: 'text-jack-silver/50', icon: <FileText className="w-4 h-4" /> },
                    { label: 'Clientes', value: kpis.totalClientes, sub: 'Registrados', color: 'text-jack-gold', icon: <Users className="w-4 h-4" /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-jack-panel border border-jack-gold/10 p-5 rounded-sm hover:border-jack-gold/30 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest text-jack-silver/50 font-bold">{stat.label}</p>
                            <span className={`${stat.color} opacity-40`}>{stat.icon}</span>
                        </div>
                        <h3 className={`text-3xl font-bold font-cinzel ${stat.color}`}>{stat.value}</h3>
                        <p className="text-xs text-jack-silver/40 mt-2 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> {stat.sub}
                        </p>
                    </div>
                ))}
            </div>

            {/* 3. Área principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Expedientes Recientes */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-jack-gold/10 pb-2">
                        <h3 className="text-jack-white font-cinzel font-bold">Expedientes Recientes</h3>
                        <Link href="/expedientes" className="text-xs text-jack-gold hover:underline">Ver todos</Link>
                    </div>

                    {recientes.length === 0 ? (
                        <div className="text-center py-12 text-jack-silver/30 bg-jack-panel border border-dashed border-jack-gold/10 rounded">
                            <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
                            <p className="font-serif text-sm">No hay expedientes registrados aún.</p>
                            <Link href="/expedientes" className="text-xs text-jack-gold hover:underline mt-2 inline-block">Crear el primero</Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recientes.map((caso) => (
                                <Link href="/expedientes" key={caso.id} className="block">
                                    <div className="bg-jack-panel border border-jack-gold/5 p-4 flex items-center justify-between hover:border-jack-gold/30 cursor-pointer transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-jack-base rounded border border-white/5 text-jack-silver group-hover:text-jack-gold transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-jack-white text-sm font-bold group-hover:text-jack-gold transition-colors">
                                                    {caso.clientes.nombre}
                                                </h4>
                                                <p className="text-xs text-jack-silver/50">
                                                    {caso.numero_caso} &bull; <span className={materiaColor[caso.materia] || 'text-jack-silver'}>{caso.materia}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${estadoColor[caso.estado] || 'bg-white/5 text-jack-silver border-white/10'}`}>
                                                {caso.estado}
                                            </span>
                                            <span className="text-[10px] text-jack-silver/30">{timeAgo(caso.created_at)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Herramientas Rápidas */}
                <div className="space-y-4">
                    <h3 className="text-jack-white font-cinzel font-bold border-b border-jack-gold/10 pb-2">Herramientas Rápidas</h3>

                    <Link href="/laboral" className="block group">
                        <div className="bg-jack-plum/10 border border-jack-crimson/20 p-4 rounded-sm hover:bg-jack-crimson/20 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <Gavel className="w-5 h-5 text-jack-crimson" />
                                <h4 className="text-jack-white font-bold text-sm">Analista Laboral IA</h4>
                            </div>
                            <p className="text-xs text-jack-silver/60">Analizar chats o narrativas para detectar infracciones automáticamente.</p>
                        </div>
                    </Link>

                    <Link href="/codex" className="block group">
                        <div className="bg-jack-panel border border-jack-gold/20 p-4 rounded-sm hover:border-jack-gold transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-5 h-5 text-jack-gold" />
                                <h4 className="text-jack-white font-bold text-sm">Consultar Codex</h4>
                            </div>
                            <p className="text-xs text-jack-silver/60">Búsqueda rápida en leyes y reglamentos.</p>
                        </div>
                    </Link>

                    <Link href="/clientes" className="block group">
                        <div className="bg-jack-panel border border-jack-gold/20 p-4 rounded-sm hover:border-jack-gold transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-5 h-5 text-jack-gold" />
                                <h4 className="text-jack-white font-bold text-sm">Cartera de Clientes</h4>
                            </div>
                            <p className="text-xs text-jack-silver/60">Directorio de personas individuales y jurídicas.</p>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}

"use client";
import { useState, useEffect } from 'react';
import {
    Calendar, ChevronLeft, ChevronRight, Plus, X, Loader2,
    Gavel, Clock, Bell, CheckCircle2, AlertCircle, Link2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUserRole, canCreate } from '@/lib/roles';

// --- INTERFACES ---
interface Evento {
    id: number;
    expediente_id: number | null;
    titulo: string;
    tipo: string;
    fecha: string;
    hora: string | null;
    descripcion: string | null;
    prioridad: string;
    completado: boolean;
    created_at: string;
}

interface Expediente {
    id: number;
    numero_caso: string;
    clientes: { nombre: string };
}

// --- CONSTANTES ---
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const TIPOS_EVENTO = ['audiencia', 'plazo', 'recordatorio'];
const PRIORIDADES = ['baja', 'media', 'alta', 'urgente'];

const tipoConfig: Record<string, { label: string; color: string; dotColor: string; icon: React.ReactNode }> = {
    audiencia: {
        label: 'Audiencia',
        color: 'bg-blue-900/20 text-blue-400 border-blue-900/30',
        dotColor: 'bg-blue-400',
        icon: <Gavel className="w-4 h-4" />,
    },
    plazo: {
        label: 'Plazo',
        color: 'bg-jack-gold/15 text-jack-gold border-jack-gold/30',
        dotColor: 'bg-jack-gold',
        icon: <Clock className="w-4 h-4" />,
    },
    recordatorio: {
        label: 'Recordatorio',
        color: 'bg-purple-900/20 text-purple-400 border-purple-900/30',
        dotColor: 'bg-purple-400',
        icon: <Bell className="w-4 h-4" />,
    },
};

const prioridadConfig: Record<string, { label: string; color: string }> = {
    baja: { label: 'Baja', color: 'text-jack-silver/50' },
    media: { label: 'Media', color: 'text-blue-400' },
    alta: { label: 'Alta', color: 'text-jack-gold' },
    urgente: { label: 'Urgente', color: 'text-jack-crimson' },
};

// --- HELPERS DE CALENDARIO ---
function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Lunes = 0
}

function isSameDay(dateStr: string, year: number, month: number, day: number) {
    const d = new Date(dateStr);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
}

function isToday(year: number, month: number, day: number) {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
}

export default function CalendarioPage() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [role] = useState(getUserRole());
    const [filtroTipos, setFiltroTipos] = useState<Set<string>>(new Set(TIPOS_EVENTO));

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

    // --- FETCH EVENTOS ---
    async function fetchEventos() {
        setLoading(true);
        const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
        const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${getDaysInMonth(currentYear, currentMonth)}`;

        const { data } = await supabase
            .from('eventos')
            .select('*')
            .gte('fecha', startDate)
            .lte('fecha', endDate)
            .order('hora', { ascending: true });
        setEventos((data as unknown as Evento[]) || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchEventos();
    }, [currentMonth, currentYear]);

    // --- NAVEGACION ---
    function prevMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDay(null);
    }

    function nextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDay(null);
    }

    function goToToday() {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDay(today.getDate());
    }

    // --- TOGGLE COMPLETADO ---
    async function toggleCompletado(evento: Evento) {
        await supabase.from('eventos').update({ completado: !evento.completado }).eq('id', evento.id);

        if (evento.expediente_id) {
            const userName = localStorage.getItem('user_name') || 'Sistema';
            await supabase.from('actividades').insert({
                expediente_id: evento.expediente_id,
                tipo: 'estado_actualizado',
                descripcion: `Evento "${evento.titulo}" marcado como ${!evento.completado ? 'completado' : 'pendiente'}`,
                usuario: userName,
            });
        }

        await fetchEventos();
    }

    // --- ELIMINAR EVENTO ---
    async function deleteEvento(evento: Evento) {
        await supabase.from('eventos').delete().eq('id', evento.id);
        await fetchEventos();
    }

    // --- TOGGLE FILTRO ---
    function toggleFiltro(tipo: string) {
        setFiltroTipos((prev) => {
            const next = new Set(prev);
            if (next.has(tipo)) next.delete(tipo);
            else next.add(tipo);
            return next;
        });
    }

    // --- DATOS DEL GRID ---
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const filteredEventos = eventos.filter((e) => filtroTipos.has(e.tipo));

    function getEventosForDay(day: number) {
        return filteredEventos.filter((e) => isSameDay(e.fecha, currentYear, currentMonth, day));
    }

    // Eventos del dia seleccionado
    const selectedDayEventos = selectedDay ? getEventosForDay(selectedDay) : [];

    // Generar celdas del grid
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-jack-gold/10 pb-6">
                <div>
                    <h1 className="text-3xl font-cinzel text-jack-white font-bold tracking-wide">Calendario</h1>
                    <p className="text-jack-silver/50 text-sm mt-1 font-serif">Audiencias, plazos procesales y recordatorios.</p>
                </div>
                {canCreate(role) && (
                    <button
                        onClick={() => { setEditingEvento(null); setShowModal(true); }}
                        className="px-4 py-2 bg-jack-crimson text-white font-bold tracking-wider text-sm flex items-center gap-2 hover:bg-red-900 shadow-[0_0_15px_rgba(122,31,46,0.4)] transition-all mt-4 md:mt-0"
                    >
                        <Plus className="w-4 h-4" /> NUEVO EVENTO
                    </button>
                )}
            </div>

            {/* CONTROLES DE MES + FILTROS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="p-2 text-jack-silver/50 hover:text-jack-gold hover:bg-jack-gold/10 rounded transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-cinzel text-jack-white font-bold tracking-wide min-w-[220px] text-center">
                        {MESES[currentMonth]} {currentYear}
                    </h2>
                    <button onClick={nextMonth} className="p-2 text-jack-silver/50 hover:text-jack-gold hover:bg-jack-gold/10 rounded transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={goToToday} className="text-xs text-jack-gold/60 hover:text-jack-gold border border-jack-gold/20 hover:border-jack-gold/40 px-3 py-1.5 rounded transition-colors">
                        Hoy
                    </button>
                </div>

                {/* Filtros por tipo */}
                <div className="flex gap-2">
                    {TIPOS_EVENTO.map((tipo) => {
                        const cfg = tipoConfig[tipo];
                        const active = filtroTipos.has(tipo);
                        return (
                            <button
                                key={tipo}
                                onClick={() => toggleFiltro(tipo)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase border transition-all ${
                                    active ? cfg.color : 'bg-white/5 text-jack-silver/30 border-white/10'
                                }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${active ? cfg.dotColor : 'bg-jack-silver/20'}`} />
                                {cfg.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* GRID + PANEL LATERAL */}
            <div className="flex gap-6">
                {/* CALENDARIO GRID */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
                        </div>
                    ) : (
                        <div className="bg-jack-panel border border-jack-gold/10 rounded-sm overflow-hidden">
                            {/* Header dias */}
                            <div className="grid grid-cols-7 border-b border-jack-gold/20 bg-jack-base/50">
                                {DIAS_SEMANA.map((dia) => (
                                    <div key={dia} className="p-3 text-center text-[10px] uppercase tracking-widest text-jack-gold/70 font-cinzel font-bold">
                                        {dia}
                                    </div>
                                ))}
                            </div>

                            {/* Celdas */}
                            <div className="grid grid-cols-7">
                                {cells.map((day, idx) => {
                                    if (day === null) {
                                        return <div key={`empty-${idx}`} className="min-h-[100px] bg-jack-base/30 border border-white/[0.03]" />;
                                    }

                                    const dayEventos = getEventosForDay(day);
                                    const isSelected = selectedDay === day;
                                    const todayClass = isToday(currentYear, currentMonth, day);

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDay(day)}
                                            className={`min-h-[100px] p-2 border border-white/[0.03] cursor-pointer transition-all hover:bg-white/5 ${
                                                isSelected ? 'bg-jack-gold/10 border-jack-gold/30' : ''
                                            }`}
                                        >
                                            <span className={`text-sm font-mono inline-flex items-center justify-center w-7 h-7 rounded-full ${
                                                todayClass
                                                    ? 'bg-jack-gold text-jack-base font-bold'
                                                    : 'text-jack-silver/60'
                                            }`}>
                                                {day}
                                            </span>

                                            {/* Event indicators */}
                                            <div className="mt-1 space-y-1">
                                                {dayEventos.slice(0, 3).map((ev) => {
                                                    const cfg = tipoConfig[ev.tipo];
                                                    return (
                                                        <div
                                                            key={ev.id}
                                                            className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                                                                ev.completado
                                                                    ? 'bg-white/5 text-jack-silver/30 line-through'
                                                                    : ev.prioridad === 'urgente'
                                                                        ? 'bg-jack-crimson/20 text-jack-crimson border border-jack-crimson/30'
                                                                        : cfg.color
                                                            }`}
                                                        >
                                                            {ev.hora ? ev.hora.slice(0, 5) + ' ' : ''}{ev.titulo}
                                                        </div>
                                                    );
                                                })}
                                                {dayEventos.length > 3 && (
                                                    <div className="text-[9px] text-jack-silver/40 pl-1">
                                                        +{dayEventos.length - 3} más
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* PANEL LATERAL — Eventos del dia */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <div className="bg-jack-panel border border-jack-gold/10 rounded-sm sticky top-24">
                        <div className="p-4 border-b border-jack-gold/10">
                            <h3 className="text-jack-white font-cinzel font-bold text-sm">
                                {selectedDay
                                    ? `${selectedDay} de ${MESES[currentMonth]}`
                                    : 'Selecciona un dia'
                                }
                            </h3>
                            {selectedDay && (
                                <p className="text-[10px] text-jack-silver/40 mt-0.5">
                                    {selectedDayEventos.length} evento{selectedDayEventos.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5">
                            {!selectedDay ? (
                                <div className="p-8 text-center text-jack-silver/30 text-sm">
                                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    Haz clic en un dia para ver sus eventos.
                                </div>
                            ) : selectedDayEventos.length === 0 ? (
                                <div className="p-8 text-center text-jack-silver/30 text-sm">
                                    Sin eventos este dia.
                                    {canCreate(role) && (
                                        <button
                                            onClick={() => { setEditingEvento(null); setShowModal(true); }}
                                            className="block mx-auto mt-3 text-jack-gold text-xs hover:underline"
                                        >
                                            + Agregar evento
                                        </button>
                                    )}
                                </div>
                            ) : (
                                selectedDayEventos.map((ev) => {
                                    const cfg = tipoConfig[ev.tipo];
                                    const prioCfg = prioridadConfig[ev.prioridad];
                                    return (
                                        <div key={ev.id} className={`p-4 transition-colors hover:bg-white/5 ${ev.completado ? 'opacity-50' : ''}`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`p-1.5 rounded border flex-shrink-0 mt-0.5 ${cfg.color}`}>
                                                    {cfg.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-sm font-bold ${ev.completado ? 'text-jack-silver/40 line-through' : 'text-jack-white'}`}>
                                                        {ev.titulo}
                                                    </p>
                                                    {ev.hora && (
                                                        <p className="text-xs text-jack-silver/50 mt-0.5">{ev.hora.slice(0, 5)} hrs</p>
                                                    )}
                                                    {ev.descripcion && (
                                                        <p className="text-xs text-jack-silver/40 mt-1 leading-relaxed">{ev.descripcion}</p>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${prioCfg.color}`}>
                                                            {prioCfg.label}
                                                        </span>
                                                        {ev.expediente_id && (
                                                            <a href={`/expedientes/${ev.expediente_id}`} className="text-[10px] text-jack-gold/60 hover:text-jack-gold flex items-center gap-0.5">
                                                                <Link2 className="w-3 h-3" /> Ver caso
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            {canCreate(role) && (
                                                <div className="flex gap-2 mt-3 ml-9">
                                                    <button
                                                        onClick={() => toggleCompletado(ev)}
                                                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                                                            ev.completado
                                                                ? 'border-jack-silver/20 text-jack-silver/40 hover:text-jack-white'
                                                                : 'border-green-900/30 text-green-400 hover:bg-green-900/20'
                                                        }`}
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 inline mr-1" />
                                                        {ev.completado ? 'Reabrir' : 'Completar'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEvento(ev)}
                                                        className="text-[10px] px-2 py-1 rounded border border-jack-crimson/20 text-jack-crimson/60 hover:bg-jack-crimson/10 hover:text-jack-crimson transition-colors"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PANEL MOVIL (cuando hay dia seleccionado, en pantallas < lg) */}
            {selectedDay && selectedDayEventos.length > 0 && (
                <div className="lg:hidden bg-jack-panel border border-jack-gold/10 rounded-sm">
                    <div className="p-4 border-b border-jack-gold/10 flex justify-between items-center">
                        <h3 className="text-jack-white font-cinzel font-bold text-sm">
                            {selectedDay} de {MESES[currentMonth]} — {selectedDayEventos.length} evento{selectedDayEventos.length !== 1 ? 's' : ''}
                        </h3>
                        <button onClick={() => setSelectedDay(null)} className="text-jack-silver/50 hover:text-jack-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {selectedDayEventos.map((ev) => {
                            const cfg = tipoConfig[ev.tipo];
                            return (
                                <div key={ev.id} className={`p-4 ${ev.completado ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded border flex-shrink-0 ${cfg.color}`}>
                                            {cfg.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-bold ${ev.completado ? 'line-through text-jack-silver/40' : 'text-jack-white'}`}>
                                                {ev.titulo}
                                            </p>
                                            <p className="text-xs text-jack-silver/50">
                                                {ev.hora ? ev.hora.slice(0, 5) + ' hrs' : cfg.label}
                                                {ev.prioridad === 'urgente' && <span className="text-jack-crimson ml-2 font-bold">URGENTE</span>}
                                            </p>
                                        </div>
                                        {canCreate(role) && (
                                            <button onClick={() => toggleCompletado(ev)} className="ml-auto flex-shrink-0">
                                                <CheckCircle2 className={`w-5 h-5 ${ev.completado ? 'text-green-500' : 'text-jack-silver/20 hover:text-green-400'}`} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* MODAL NUEVO EVENTO */}
            {showModal && (
                <NuevoEventoModal
                    defaultDate={selectedDay ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : undefined}
                    onClose={() => setShowModal(false)}
                    onCreated={() => {
                        setShowModal(false);
                        fetchEventos();
                    }}
                />
            )}
        </div>
    );
}

// --- MODAL: NUEVO EVENTO ---
function NuevoEventoModal({ defaultDate, onClose, onCreated }: {
    defaultDate?: string;
    onClose: () => void;
    onCreated: () => void;
}) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [expedientes, setExpedientes] = useState<Expediente[]>([]);
    const [form, setForm] = useState({
        titulo: '',
        tipo: 'audiencia',
        fecha: defaultDate || new Date().toISOString().split('T')[0],
        hora: '',
        expediente_id: '',
        prioridad: 'media',
        descripcion: '',
    });

    useEffect(() => {
        async function fetch() {
            const { data } = await supabase
                .from('expedientes')
                .select('id, numero_caso, clientes(nombre)')
                .order('created_at', { ascending: false });
            setExpedientes((data as unknown as Expediente[]) || []);
        }
        fetch();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!form.titulo.trim() || !form.fecha) {
            setError('Titulo y fecha son obligatorios.');
            return;
        }

        setSaving(true);
        const { data: inserted, error: dbError } = await supabase
            .from('eventos')
            .insert({
                titulo: form.titulo.trim(),
                tipo: form.tipo,
                fecha: form.fecha,
                hora: form.hora || null,
                expediente_id: form.expediente_id ? Number(form.expediente_id) : null,
                prioridad: form.prioridad,
                descripcion: form.descripcion.trim() || null,
            })
            .select('id')
            .single();

        if (dbError) {
            setError(dbError.message);
            setSaving(false);
            return;
        }

        // Auto-notify + log activity
        if (inserted) {
            const userName = localStorage.getItem('user_name') || 'Sistema';
            const tipoLabel = tipoConfig[form.tipo]?.label || form.tipo;
            await supabase.from('notificaciones').insert({
                tipo: 'plazo_proximo',
                mensaje: `${tipoLabel}: "${form.titulo.trim()}" programado para ${form.fecha}`,
                expediente_id: form.expediente_id ? Number(form.expediente_id) : null,
            });

            if (form.expediente_id) {
                await supabase.from('actividades').insert({
                    expediente_id: Number(form.expediente_id),
                    tipo: 'creacion',
                    descripcion: `${tipoLabel} "${form.titulo.trim()}" agregado al calendario — ${form.fecha}`,
                    usuario: userName,
                });
            }
        }

        onCreated();
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <form
                onSubmit={handleSubmit}
                className="bg-jack-base border border-jack-gold w-full max-w-lg flex flex-col shadow-2xl rounded-sm animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-jack-gold/20 bg-jack-panel">
                    <h2 className="text-xl font-cinzel text-jack-white font-bold tracking-wide flex items-center gap-2">
                        <Plus className="w-5 h-5 text-jack-gold" /> Nuevo Evento
                    </h2>
                    <button type="button" onClick={onClose} className="text-jack-silver hover:text-white p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
                    {error && (
                        <div className="bg-red-900/20 border border-red-900/40 text-red-400 px-4 py-2 text-sm rounded flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                        </div>
                    )}

                    {/* Titulo */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Titulo *</label>
                        <input
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Audiencia de conciliacion, Vencimiento de plazo..."
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Tipo y Prioridad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Tipo</label>
                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={handleChange}
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            >
                                {TIPOS_EVENTO.map((t) => (
                                    <option key={t} value={t}>{tipoConfig[t].label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Prioridad</label>
                            <select
                                name="prioridad"
                                value={form.prioridad}
                                onChange={handleChange}
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            >
                                {PRIORIDADES.map((p) => (
                                    <option key={p} value={p}>{prioridadConfig[p].label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Fecha *</label>
                            <input
                                type="date"
                                name="fecha"
                                value={form.fecha}
                                onChange={handleChange}
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Hora (opcional)</label>
                            <input
                                type="time"
                                name="hora"
                                value={form.hora}
                                onChange={handleChange}
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            />
                        </div>
                    </div>

                    {/* Expediente */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Vincular Expediente (opcional)</label>
                        <select
                            name="expediente_id"
                            value={form.expediente_id}
                            onChange={handleChange}
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                        >
                            <option value="">— Sin vincular —</option>
                            {expedientes.map((exp) => (
                                <option key={exp.id} value={exp.id}>
                                    {exp.numero_caso} — {exp.clientes.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Descripcion */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Descripcion</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Detalles del evento..."
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-jack-gold/20 bg-jack-panel flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-jack-silver hover:text-white text-xs uppercase tracking-widest font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Crear Evento'}
                    </button>
                </div>
            </form>
        </div>
    );
}

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FolderPlus, Clock, AlertCircle, CheckCircle2, Archive, Loader2, X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUserRole, canCreate } from '@/lib/roles';

// --- INTERFACES ---
interface Cliente {
    id: number;
    nombre: string;
    tipo: string;
}

interface Expediente {
    id: number;
    numero_caso: string;
    cliente_id: number;
    materia: string;
    estado: string;
    juzgado: string | null;
    descripcion: string | null;
    created_at: string;
    clientes: {
        nombre: string;
        tipo: string;
    };
}

// --- CONSTANTES DE ESTADO ---
const estadoConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    'En Trámite': {
        label: 'En Trámite',
        color: 'bg-blue-900/20 text-blue-400 border-blue-900/30',
        icon: <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />,
    },
    'Sentencia': {
        label: 'Sentencia',
        color: 'bg-green-900/20 text-green-400 border-green-900/30',
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    },
    'Archivo': {
        label: 'Archivo',
        color: 'bg-white/5 text-jack-silver/50 border-white/10',
        icon: <Archive className="w-4 h-4 text-jack-silver/40" />,
    },
};

const materiaColors: Record<string, string> = {
    'Penal': 'bg-red-900/20 text-red-400 border-red-900/30',
    'Laboral': 'bg-blue-900/20 text-blue-400 border-blue-900/30',
    'Civil': 'bg-jack-gold/10 text-jack-gold border-jack-gold/20',
    'Familia': 'bg-purple-900/20 text-purple-400 border-purple-900/30',
    'Mercantil': 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30',
};

const MATERIAS = ['Laboral', 'Penal', 'Civil', 'Familia', 'Mercantil', 'Notarial', 'Administrativo'];
const ESTADOS = ['En Trámite', 'Sentencia', 'Archivo'];

export default function ExpedientesPage() {
    const router = useRouter();
    const [expedientes, setExpedientes] = useState<Expediente[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState(getUserRole());

    useEffect(() => { setRole(getUserRole()); }, []);

    // --- FETCH EXPEDIENTES ---
    async function fetchExpedientes() {
        setLoading(true);
        const { data } = await supabase
            .from('expedientes')
            .select('*, clientes(nombre, tipo)')
            .order('created_at', { ascending: false });
        setExpedientes((data as unknown as Expediente[]) || []);
        setLoading(false);
    }

    // --- FETCH CLIENTES (para el select del modal) ---
    async function fetchClientes() {
        const { data } = await supabase
            .from('clientes')
            .select('id, nombre, tipo')
            .order('nombre');
        setClientes((data as unknown as Cliente[]) || []);
    }

    useEffect(() => {
        fetchExpedientes();
        fetchClientes();
    }, []);

    // --- FILTRADO LOCAL ---
    const filtered = expedientes.filter((exp) => {
        if (!filter.trim()) return true;
        const term = filter.toLowerCase();
        return (
            exp.numero_caso.toLowerCase().includes(term) ||
            exp.clientes.nombre.toLowerCase().includes(term) ||
            exp.materia.toLowerCase().includes(term) ||
            (exp.juzgado && exp.juzgado.toLowerCase().includes(term))
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-jack-gold/10 pb-6">
                <div>
                    <h1 className="text-3xl font-cinzel text-jack-white font-bold tracking-wide">Expedientes</h1>
                    <p className="text-jack-silver/50 text-sm mt-1 font-serif">Gestión centralizada de litigios y trámites notariales.</p>
                </div>
                {canCreate(role) && (
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-jack-crimson text-white font-bold tracking-wider text-sm flex items-center gap-2 hover:bg-red-900 shadow-[0_0_15px_rgba(122,31,46,0.4)] transition-all"
                        >
                            <FolderPlus className="w-4 h-4" /> NUEVO CASO
                        </button>
                    </div>
                )}
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-jack-gold/50 group-focus-within:text-jack-gold transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-jack-panel border-l-4 border-l-jack-gold/20 border-y border-r border-white/5 text-jack-silver placeholder-jack-silver/30 focus:border-l-jack-gold focus:outline-none focus:bg-jack-panel/80 transition-all font-serif"
                    placeholder="Buscar por cliente, número de expediente o juzgado..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {/* TABLA */}
            <div className="bg-jack-panel border border-jack-gold/10 rounded-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-jack-gold/20 bg-jack-base/50 text-xs uppercase tracking-widest text-jack-gold/70">
                                        <th className="p-4 font-cinzel">No. Expediente</th>
                                        <th className="p-4 font-cinzel">Cliente / Entidad</th>
                                        <th className="p-4 font-cinzel">Materia</th>
                                        <th className="p-4 font-cinzel">Estado</th>
                                        <th className="p-4 font-cinzel">Juzgado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.map((exp) => {
                                        const est = estadoConfig[exp.estado];
                                        return (
                                            <tr key={exp.id} onClick={() => router.push(`/expedientes/${exp.id}`)} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                                <td className="p-4 font-mono text-xs text-jack-silver/50 group-hover:text-jack-gold transition-colors">
                                                    {exp.numero_caso}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-jack-white text-sm">{exp.clientes.nombre}</div>
                                                    <div className="text-xs text-jack-silver/40 mt-0.5">{exp.clientes.tipo}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${materiaColors[exp.materia] || 'bg-jack-gold/10 text-jack-gold border-jack-gold/20'}`}>
                                                        {exp.materia}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {est?.icon || <div className="w-2 h-2 rounded-full bg-jack-gold animate-pulse" />}
                                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${est?.color || 'bg-white/5 text-jack-silver border-white/10'}`}>
                                                            {exp.estado}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-jack-silver/60">
                                                    {exp.juzgado || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-white/5">
                            {filtered.map((exp) => {
                                const est = estadoConfig[exp.estado];
                                return (
                                    <div key={exp.id} onClick={() => router.push(`/expedientes/${exp.id}`)} className="p-4 space-y-2 cursor-pointer hover:bg-white/5 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <span className="font-mono text-xs text-jack-gold">{exp.numero_caso}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${est?.color || 'bg-white/5 text-jack-silver border-white/10'}`}>
                                                {exp.estado}
                                            </span>
                                        </div>
                                        <div className="font-bold text-jack-white text-sm">{exp.clientes.nombre}</div>
                                        <div className="flex gap-2 items-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${materiaColors[exp.materia] || 'bg-jack-gold/10 text-jack-gold border-jack-gold/20'}`}>
                                                {exp.materia}
                                            </span>
                                            <span className="text-xs text-jack-silver/40">{exp.juzgado || ''}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-jack-silver/30">
                                <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
                                <p className="font-serif">No se encontraron expedientes.</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="p-4 border-t border-jack-gold/10 text-xs text-jack-silver/40 font-mono">
                            Mostrando {filtered.length} de {expedientes.length} expedientes
                        </div>
                    </>
                )}
            </div>

            {/* MODAL NUEVO CASO */}
            {showModal && (
                <NuevoCasoModal
                    clientes={clientes}
                    onClose={() => setShowModal(false)}
                    onCreated={() => {
                        setShowModal(false);
                        fetchExpedientes();
                    }}
                />
            )}
        </div>
    );
}

// --- MODAL: NUEVO CASO ---
function NuevoCasoModal({ clientes, onClose, onCreated }: {
    clientes: Cliente[];
    onClose: () => void;
    onCreated: () => void;
}) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        numero_caso: '',
        cliente_id: '',
        materia: MATERIAS[0],
        estado: ESTADOS[0],
        juzgado: '',
        descripcion: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!form.numero_caso.trim() || !form.cliente_id) {
            setError('Número de caso y cliente son obligatorios.');
            return;
        }

        setSaving(true);
        const { data: inserted, error: dbError } = await supabase
            .from('expedientes')
            .insert({
                numero_caso: form.numero_caso.trim(),
                cliente_id: Number(form.cliente_id),
                materia: form.materia,
                estado: form.estado,
                juzgado: form.juzgado.trim() || null,
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
            await supabase.from('notificaciones').insert({
                tipo: 'expediente_creado',
                mensaje: `Nuevo expediente ${form.numero_caso.trim()} creado por ${userName}`,
                expediente_id: inserted.id,
            });
            await supabase.from('actividades').insert({
                expediente_id: inserted.id,
                tipo: 'creacion',
                descripcion: `Expediente ${form.numero_caso.trim()} creado — ${form.materia}`,
                usuario: userName,
            });
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
                        <Plus className="w-5 h-5 text-jack-gold" /> Nuevo Caso
                    </h2>
                    <button type="button" onClick={onClose} className="text-jack-silver hover:text-white p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
                    {error && (
                        <div className="bg-red-900/20 border border-red-900/40 text-red-400 px-4 py-2 text-sm rounded">
                            {error}
                        </div>
                    )}

                    {/* Número de Caso */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Número de Caso *</label>
                        <input
                            name="numero_caso"
                            value={form.numero_caso}
                            onChange={handleChange}
                            placeholder="EXP-2026-006"
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Cliente (Select dinámico) */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Cliente *</label>
                        <select
                            name="cliente_id"
                            value={form.cliente_id}
                            onChange={handleChange}
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                        >
                            <option value="">— Seleccionar cliente —</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre} ({c.tipo})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Materia y Estado en fila */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Materia</label>
                            <select
                                name="materia"
                                value={form.materia}
                                onChange={handleChange}
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            >
                                {MATERIAS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Estado</label>
                            <select
                                name="estado"
                                value={form.estado}
                                onChange={handleChange}
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            >
                                {ESTADOS.map((e) => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Juzgado */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Juzgado</label>
                        <input
                            name="juzgado"
                            value={form.juzgado}
                            onChange={handleChange}
                            placeholder="Juzgado 1ro. de Trabajo"
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Breve descripción del caso..."
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
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Crear Caso'}
                    </button>
                </div>
            </form>
        </div>
    );
}

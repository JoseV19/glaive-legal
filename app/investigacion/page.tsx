"use client";
import { useState, useEffect, useCallback } from 'react';
import { Search, BookOpen, Scale, Filter, ChevronRight, ArrowLeft, Landmark, Users, Briefcase, Gavel, FileText, Plus, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUserRole, canEdit, canDelete, canCreate } from '@/lib/roles';

interface Sentencia {
    id: number;
    codigo: string;
    titulo: string;
    corte: string;
    fecha: string;
    resumen: string;
    tags: string[];
}

function getIcon(tags: string[]) {
    const first = tags[0];
    switch (first) {
        case 'Laboral': return <Briefcase className="w-5 h-5" />;
        case 'Penal': return <Gavel className="w-5 h-5" />;
        case 'Civil': return <FileText className="w-5 h-5" />;
        case 'Familia': return <Users className="w-5 h-5" />;
        case 'Mercantil': return <Landmark className="w-5 h-5" />;
        default: return <Scale className="w-5 h-5" />;
    }
}

const RAMAS = ['Penal', 'Civil', 'Laboral', 'Familia', 'Mercantil'];
const RAMA_ICONS: Record<string, any> = {
    'Todos': Scale, 'Penal': Gavel, 'Civil': FileText, 'Laboral': Briefcase, 'Familia': Users, 'Mercantil': Landmark,
};

export default function InvestigacionPage() {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('Todos');
    const [sentencias, setSentencias] = useState<Sentencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Sentencia | null>(null);
    const [role] = useState(() => getUserRole());

    const fetchSentencias = useCallback(async () => {
        const { data } = await supabase
            .from('jurisprudencia')
            .select('*')
            .order('created_at', { ascending: false });
        setSentencias((data as Sentencia[]) || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSentencias();
    }, [fetchSentencias]);

    const filteredResults = sentencias.filter(item => {
        const searchLower = query.toLowerCase();
        const matchesSearch = item.titulo.toLowerCase().includes(searchLower) ||
            item.resumen.toLowerCase().includes(searchLower) ||
            item.codigo.toLowerCase().includes(searchLower);
        const matchesFilter = filter === 'Todos' || item.tags.includes(filter);
        return matchesSearch && matchesFilter;
    });

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar esta sentencia?')) return;
        await supabase.from('jurisprudencia').delete().eq('id', id);
        await fetchSentencias();
    };

    const handleEdit = (item: Sentencia) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver p-4 md:p-8 font-serif">

            {/* HEADER */}
            <header className="max-w-6xl mx-auto mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-end border-b border-jack-gold/20 pb-6">
                <div className="w-full">
                    <Link href="/" className="text-jack-gold hover:text-jack-crimson transition-colors flex items-center gap-2 mb-4 text-xs tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> VOLVER AL DASHBOARD
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-jack-panel border border-jack-gold/30 rounded-sm">
                            <BookOpen className="w-8 h-8 text-jack-gold" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-cinzel text-jack-white tracking-widest">
                                ARCHIVO JURISPRUDENCIAL
                            </h1>
                            <p className="text-jack-silver/50 text-sm mt-1 font-mono">
                                Base de Datos Unificada • Zionak Systems v2.1
                            </p>
                        </div>
                    </div>
                </div>
                {canCreate(role) && (
                    <button
                        onClick={handleNew}
                        className="mt-4 md:mt-0 px-4 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded flex items-center gap-2 flex-shrink-0"
                    >
                        <Plus className="w-4 h-4" /> AGREGAR SENTENCIA
                    </button>
                )}
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* SIDEBAR: FILTROS */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-jack-panel p-1 rounded-sm border-2 border-jack-gold/20 focus-within:border-jack-gold transition-colors shadow-lg">
                        <div className="flex items-center px-3 py-2">
                            <Search className="w-5 h-5 text-jack-gold/70 mr-2" />
                            <input
                                type="text"
                                placeholder="Buscar sentencia..."
                                className="bg-transparent border-none focus:outline-none text-jack-white placeholder-jack-silver/30 w-full text-sm font-sans"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-jack-panel border border-jack-gold/10 p-4 rounded-sm">
                        <h3 className="text-jack-gold font-bold mb-4 flex items-center gap-2 text-xs tracking-widest uppercase">
                            <Filter className="w-3 h-3" /> Filtrar por Rama
                        </h3>
                        <div className="space-y-1">
                            {[{ name: 'Todos' }, ...RAMAS.map(r => ({ name: r }))].map((category) => {
                                const Icon = RAMA_ICONS[category.name] || Scale;
                                return (
                                    <button
                                        key={category.name}
                                        onClick={() => setFilter(category.name)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm transition-all border-r-2 ${filter === category.name
                                            ? 'border-jack-crimson bg-gradient-to-l from-jack-crimson/10 to-transparent text-jack-white font-bold'
                                            : 'border-transparent text-jack-silver/60 hover:text-jack-gold hover:bg-jack-gold/5'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${filter === category.name ? 'text-jack-crimson' : 'text-current'}`} />
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 bg-jack-plum/20 border border-jack-crimson/20 rounded text-xs text-jack-silver/60 text-center">
                        <p>Mostrando {filteredResults.length} de {sentencias.length} expedientes</p>
                    </div>
                </aside>

                {/* LISTADO DE RESULTADOS */}
                <section className="lg:col-span-3 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-jack-gold/10 bg-jack-panel/30 rounded">
                            <Scale className="w-16 h-16 mx-auto mb-4 text-jack-silver/20" />
                            <p className="text-jack-silver/50">No se encontraron precedentes con ese criterio.</p>
                            <button onClick={() => { setFilter('Todos'); setQuery('') }} className="mt-4 text-jack-gold hover:underline text-sm">
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        filteredResults.map((item) => (
                            <div key={item.id} className="group bg-jack-panel border-l-[3px] border-l-jack-gold/30 border-y border-r border-jack-gold/10 p-6 hover:border-l-jack-crimson hover:shadow-[0_5px_20px_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1.5 bg-jack-base rounded border border-jack-gold/20 text-jack-gold">
                                            {getIcon(item.tags)}
                                        </span>
                                        <span className="text-xs font-mono text-jack-silver/50 tracking-wide">{item.codigo}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-jack-base px-2 py-1 rounded text-jack-silver/70 border border-white/5">
                                            {item.fecha}
                                        </span>
                                        {canEdit(role) && (
                                            <button onClick={() => handleEdit(item)} className="p-1.5 text-jack-silver/30 hover:text-jack-gold transition-colors">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        {canDelete(role) && (
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-jack-silver/30 hover:text-jack-crimson transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Título */}
                                <h3 className="text-xl font-bold text-jack-white mb-2 font-cinzel group-hover:text-jack-gold transition-colors">
                                    {item.titulo}
                                </h3>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-jack-crimson">
                                        {item.corte}
                                    </span>
                                    {item.tags.filter(t => t !== filter).map(tag => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/5 text-jack-silver/60 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Resumen */}
                                <p className="text-sm text-jack-silver/80 leading-relaxed font-serif border-t border-jack-gold/10 pt-4 group-hover:text-jack-silver transition-colors">
                                    {item.resumen}
                                </p>

                                <div className="mt-4 flex items-center justify-end text-jack-crimson text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    ANALIZAR SENTENCIA COMPLETA <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>

            {/* MODAL CREAR/EDITAR SENTENCIA */}
            {showForm && (
                <SentenciaForm
                    item={editingItem}
                    onClose={() => { setShowForm(false); setEditingItem(null); fetchSentencias(); }}
                />
            )}
        </div>
    );
}

// --- FORMULARIO DE SENTENCIA ---
function SentenciaForm({ item, onClose }: { item: Sentencia | null; onClose: () => void }) {
    const [form, setForm] = useState({
        codigo: item?.codigo || '',
        titulo: item?.titulo || '',
        corte: item?.corte || '',
        fecha: item?.fecha || '',
        resumen: item?.resumen || '',
        tags: item?.tags.join(', ') || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.codigo.trim() || !form.titulo.trim() || !form.corte.trim()) {
            alert('Código, Título y Corte son obligatorios.');
            return;
        }
        setSaving(true);
        const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
        const payload = {
            codigo: form.codigo.trim(),
            titulo: form.titulo.trim(),
            corte: form.corte.trim(),
            fecha: form.fecha.trim(),
            resumen: form.resumen.trim(),
            tags: tagsArray,
        };

        if (item) {
            await supabase.from('jurisprudencia').update(payload).eq('id', item.id);
        } else {
            await supabase.from('jurisprudencia').insert(payload);
        }
        setSaving(false);
        onClose();
    };

    const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-jack-base border border-jack-gold w-full max-w-2xl shadow-2xl rounded-sm">
                <div className="p-5 border-b border-jack-gold/20 bg-jack-panel flex justify-between items-center">
                    <h3 className="text-lg font-cinzel text-jack-white font-bold">
                        {item ? 'Editar Sentencia' : 'Nueva Sentencia'}
                    </h3>
                    <button onClick={onClose} className="text-jack-silver hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Código</label>
                            <input value={form.codigo} onChange={e => set('codigo', e.target.value)} placeholder="EXP-LAB-2024-01" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Fecha</label>
                            <input value={form.fecha} onChange={e => set('fecha', e.target.value)} placeholder="14 Ene 2024" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Título</label>
                        <input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Despido Indirecto por Falta de Pago" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Corte / Tribunal</label>
                        <input value={form.corte} onChange={e => set('corte', e.target.value)} placeholder="Corte de Constitucionalidad" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Tags (separados por coma)</label>
                        <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Laboral, Salarios, Sentencia" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                        <p className="text-[10px] text-jack-silver/40 mt-1">Primera tag define la rama: Laboral, Penal, Civil, Familia, Mercantil</p>
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Resumen</label>
                        <textarea value={form.resumen} onChange={e => set('resumen', e.target.value)} rows={4} placeholder="Se establece que..." className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm resize-none" />
                    </div>
                </div>
                <div className="p-5 border-t border-jack-gold/20 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-jack-silver hover:text-white text-sm transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {item ? 'ACTUALIZAR' : 'CREAR'}
                    </button>
                </div>
            </div>
        </div>
    );
}

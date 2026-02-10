"use client";
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Gavel, FileText, CheckCircle2, Siren, Banknote, Clock, ShieldAlert, Skull, Users, HeartCrack, Copy, Settings2, Plus, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUserRole, canEdit, canDelete, canCreate } from '@/lib/roles';

interface Infraccion {
    id: number;
    codigo: string;
    keywords: string[];
    ley: string;
    articulo: string;
    texto: string;
    cita: string;
    tipo: string;
}

function getIcon(tipo: string) {
    switch (tipo) {
        case 'economic': return <Banknote className="w-5 h-5 text-green-500" />;
        case 'rights': return <Clock className="w-5 h-5 text-orange-400" />;
        case 'critical': return <Gavel className="w-5 h-5 text-jack-crimson" />;
        case 'grave': return <HeartCrack className="w-5 h-5 text-purple-500" />;
        case 'alert': return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
        default: return <ShieldAlert className="w-5 h-5 text-jack-silver" />;
    }
}

export default function LaboralPage() {
    const [inputText, setInputText] = useState('');
    const [analysis, setAnalysis] = useState<Infraccion[]>([]);
    const [knowledgeBase, setKnowledgeBase] = useState<Infraccion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showManager, setShowManager] = useState(false);
    const [role] = useState(() => getUserRole());

    const fetchInfracciones = useCallback(async () => {
        const { data } = await supabase
            .from('laboral_infracciones')
            .select('*')
            .order('codigo');
        setKnowledgeBase((data as Infraccion[]) || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchInfracciones();
    }, [fetchInfracciones]);

    const printReport = () => {
        const style = document.createElement('style');
        style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #labor-report, #labor-report * { visibility: visible; }
        #labor-report { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; }
        .no-print { display: none !important; }
        h3 { color: black !important; }
        p { color: #333 !important; }
      }
    `;
        document.head.appendChild(style);
        window.print();
        document.head.removeChild(style);
    };

    const copyLegalArgument = (item: Infraccion) => {
        const legalText = `FUNDAMENTO DE DERECHO:\nDe conformidad con lo establecido en la ${item.ley}, específicamente en su ${item.articulo}, que literalmente establece:\n"${item.cita}"\n\nPor lo anterior, solicito el cumplimiento de dicha norma.`;
        navigator.clipboard.writeText(legalText);
        alert(`Fundamento del ${item.articulo} copiado al portapapeles.`);
    };

    const analyzeCase = () => {
        const findings = knowledgeBase.filter(rule =>
            rule.keywords.some(keyword => inputText.toLowerCase().includes(keyword))
        );
        setAnalysis(findings);
    };

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver p-6 md:p-12 font-serif">

            {/* HEADER */}
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 border-b border-jack-gold/20 pb-6">
                <Link href="/" className="flex items-center text-jack-gold hover:text-jack-crimson transition-colors gap-2 mb-4 md:mb-0">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-cinzel tracking-widest text-sm">VOLVER AL DASHBOARD</span>
                </Link>
                <div className="flex items-center gap-3">
                    {canEdit(role) && (
                        <button
                            onClick={() => setShowManager(true)}
                            className="flex items-center gap-2 text-xs text-jack-silver hover:text-jack-gold border border-jack-gold/20 px-3 py-2 rounded transition-colors"
                        >
                            <Settings2 className="w-4 h-4" /> GESTIONAR BASE LEGAL
                        </button>
                    )}
                    <div className="p-2 bg-jack-crimson/20 rounded border border-jack-crimson/50">
                        <Siren className="w-6 h-6 text-jack-crimson animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-cinzel text-jack-white tracking-widest">DEFENSOR LABORAL PRO</h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* INPUT */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-jack-gold font-bold tracking-wide flex items-center gap-2">
                            <FileText className="w-4 h-4" /> NARRATIVA DEL CLIENTE
                        </h2>
                        <span className="text-[10px] tracking-widest text-jack-crimson border border-jack-crimson/30 px-2 py-1 rounded bg-jack-crimson/10 uppercase">
                            {loading ? 'Cargando base...' : `${knowledgeBase.length} infracciones en base`}
                        </span>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-jack-gold/20 to-jack-crimson/20 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                        <textarea
                            className="relative w-full h-[500px] bg-jack-panel border border-jack-gold/20 p-6 text-sm leading-relaxed focus:outline-none focus:border-jack-gold text-jack-silver resize-none placeholder-jack-silver/20 font-mono"
                            placeholder="Ej: 'Mi jefe me insinúa cosas raras, me cambiaron de puesto a una zona peligrosa y no me dan equipo de seguridad...'"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            spellCheck={false}
                        />
                    </div>

                    <button
                        onClick={analyzeCase}
                        disabled={loading}
                        className="w-full py-4 bg-jack-crimson text-jack-white font-cinzel font-bold tracking-[0.2em] border border-jack-gold/50 hover:bg-red-900 hover:shadow-[0_0_20px_rgba(122,31,46,0.5)] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'CARGANDO BASE LEGAL...' : 'EJECUTAR ANÁLISIS FORENSE'}
                    </button>
                </section>

                {/* RESULTADOS */}
                <section id="labor-report" className="space-y-6">
                    <div className="flex justify-between items-center border-b border-jack-gold/10 pb-4">
                        <h2 className="text-jack-gold font-bold tracking-wide flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> HALLAZGOS JURÍDICOS
                        </h2>
                        {analysis.length > 0 && (
                            <button
                                onClick={printReport}
                                className="text-xs flex items-center gap-1 text-jack-silver hover:text-jack-white border border-jack-silver/30 px-3 py-1 rounded hover:bg-jack-silver/10 transition-colors no-print"
                            >
                                <FileText className="w-3 h-3" /> EXPORTAR PDF
                            </button>
                        )}
                    </div>

                    {analysis.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-jack-silver/30 bg-jack-panel/30 border border-dashed border-jack-gold/10 rounded">
                            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                            <p className="italic font-serif text-center px-10 text-sm">
                                "El sistema busca patrones de abuso, peligro o deuda..."
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[500px] overflow-y-auto pr-2 custom-scrollbar">

                            {/* Resumen de alertas */}
                            <div className="flex gap-2 mb-4">
                                <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/20">
                                    {analysis.filter(i => i.tipo === 'grave' || i.tipo === 'alert').length} Amenazas Graves
                                </span>
                                <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20">
                                    {analysis.filter(i => i.tipo === 'economic').length} Reclamos Económicos
                                </span>
                            </div>

                            {analysis.map((item) => (
                                <div key={item.id} className={`bg-jack-panel border-l-[4px] p-5 shadow-lg relative group transition-all hover:bg-jack-panel/80 ${item.tipo === 'grave' ? 'border-l-purple-500' :
                                    item.tipo === 'alert' ? 'border-l-red-500' :
                                        'border-l-jack-gold'
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {getIcon(item.tipo)}
                                            <h3 className="text-jack-white font-bold text-sm font-cinzel">{item.ley}</h3>
                                        </div>
                                        <span className="text-[10px] font-mono text-jack-base bg-jack-gold/80 px-2 py-1 rounded font-bold">
                                            {item.articulo}
                                        </span>
                                    </div>

                                    <p className="text-jack-silver text-sm mb-3 leading-relaxed border-t border-white/5 pt-2 mt-2">
                                        {item.texto}
                                    </p>

                                    <div className="bg-black/20 p-3 border-l-2 border-jack-silver/30 text-xs text-jack-silver/60 italic mb-4 font-serif">
                                        &quot;{item.cita.substring(0, 80)}...&quot;
                                    </div>

                                    <div className="flex justify-end gap-3 mt-2 no-print">
                                        <button
                                            onClick={() => copyLegalArgument(item)}
                                            className="text-[10px] tracking-widest uppercase text-jack-gold hover:text-white transition-colors flex items-center gap-1 font-bold border border-jack-gold/30 px-3 py-1.5 rounded hover:bg-jack-gold/10"
                                        >
                                            <Copy className="w-3 h-3" /> Copiar Fundamento
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>

            {/* MODAL GESTIÓN BASE LEGAL */}
            {showManager && (
                <InfraccionManager
                    role={role}
                    onClose={() => { setShowManager(false); fetchInfracciones(); }}
                />
            )}
        </div>
    );
}

// --- MODAL CRUD DE INFRACCIONES ---
function InfraccionManager({ role, onClose }: { role: string; onClose: () => void }) {
    const [infracciones, setInfracciones] = useState<Infraccion[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<Infraccion | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchAll = useCallback(async () => {
        const { data } = await supabase.from('laboral_infracciones').select('*').order('codigo');
        setInfracciones((data as Infraccion[]) || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar esta infracción de la base legal?')) return;
        await supabase.from('laboral_infracciones').delete().eq('id', id);
        await fetchAll();
    };

    const handleEdit = (item: Infraccion) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-jack-base border border-jack-gold w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl rounded-sm">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-jack-gold/20 bg-jack-panel flex-shrink-0">
                    <h2 className="text-xl font-cinzel text-jack-white font-bold tracking-wide flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-jack-gold" /> BASE LEGAL — {infracciones.length} INFRACCIONES
                    </h2>
                    <div className="flex items-center gap-3">
                        {canCreate(role as any) && (
                            <button
                                onClick={handleNew}
                                className="px-4 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> NUEVA
                            </button>
                        )}
                        <button onClick={onClose} className="text-jack-silver hover:text-white p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
                        </div>
                    ) : infracciones.map((item) => (
                        <div key={item.id} className="bg-jack-panel border border-jack-gold/10 p-4 flex items-start gap-4 hover:border-jack-gold/30 transition-colors">
                            <div className="flex-shrink-0 mt-1">{getIcon(item.tipo)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono bg-jack-gold/20 text-jack-gold px-1.5 py-0.5 rounded">{item.codigo}</span>
                                    <span className="text-[10px] font-mono bg-white/5 text-jack-silver/50 px-1.5 py-0.5 rounded">{item.articulo}</span>
                                </div>
                                <p className="text-sm text-jack-white font-bold">{item.ley}</p>
                                <p className="text-xs text-jack-silver/60 mt-1">{item.texto}</p>
                                <p className="text-[10px] text-jack-silver/40 mt-1 truncate">Keywords: {item.keywords.join(', ')}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {canEdit(role as any) && (
                                    <button onClick={() => handleEdit(item)} className="p-2 text-jack-silver/40 hover:text-jack-gold transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                )}
                                {canDelete(role as any) && (
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-jack-silver/40 hover:text-jack-crimson transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sub-modal: Form */}
            {showForm && (
                <InfraccionForm
                    item={editingItem}
                    onClose={() => { setShowForm(false); fetchAll(); }}
                />
            )}
        </div>
    );
}

// --- FORMULARIO DE INFRACCIÓN ---
const TIPOS = ['economic', 'rights', 'critical', 'grave', 'alert'];

function InfraccionForm({ item, onClose }: { item: Infraccion | null; onClose: () => void }) {
    const [form, setForm] = useState({
        codigo: item?.codigo || '',
        keywords: item?.keywords.join(', ') || '',
        ley: item?.ley || '',
        articulo: item?.articulo || '',
        texto: item?.texto || '',
        cita: item?.cita || '',
        tipo: item?.tipo || 'economic',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.codigo.trim() || !form.ley.trim() || !form.articulo.trim()) {
            alert('Código, Ley y Artículo son obligatorios.');
            return;
        }
        setSaving(true);
        const keywordsArray = form.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        const payload = {
            codigo: form.codigo.trim(),
            keywords: keywordsArray,
            ley: form.ley.trim(),
            articulo: form.articulo.trim(),
            texto: form.texto.trim(),
            cita: form.cita.trim(),
            tipo: form.tipo,
        };

        if (item) {
            await supabase.from('laboral_infracciones').update(payload).eq('id', item.id);
        } else {
            await supabase.from('laboral_infracciones').insert(payload);
        }
        setSaving(false);
        onClose();
    };

    const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4">
            <div className="bg-jack-base border border-jack-gold w-full max-w-2xl shadow-2xl rounded-sm">
                <div className="p-5 border-b border-jack-gold/20 bg-jack-panel flex justify-between items-center">
                    <h3 className="text-lg font-cinzel text-jack-white font-bold">
                        {item ? 'Editar Infracción' : 'Nueva Infracción'}
                    </h3>
                    <button onClick={onClose} className="text-jack-silver hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Código</label>
                            <input value={form.codigo} onChange={e => set('codigo', e.target.value)} placeholder="ECO-01" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Tipo</label>
                            <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm">
                                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Ley</label>
                        <input value={form.ley} onChange={e => set('ley', e.target.value)} placeholder="Código de Trabajo" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Artículo</label>
                        <input value={form.articulo} onChange={e => set('articulo', e.target.value)} placeholder="Art. 121" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Descripción Breve</label>
                        <input value={form.texto} onChange={e => set('texto', e.target.value)} placeholder="Pago de Jornada Extraordinaria (+50%)" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Keywords (separadas por coma)</label>
                        <input value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="horas extra, tiempo extra, tarde, noche" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Cita Legal Completa</label>
                        <textarea value={form.cita} onChange={e => set('cita', e.target.value)} rows={4} placeholder="El trabajo efectivo que se ejecute fuera de los límites..." className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm resize-none" />
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

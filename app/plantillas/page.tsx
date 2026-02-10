"use client";
import { useState, useEffect, useCallback } from 'react';
import {
    FileSignature, Gavel, FileText, Users2, Stamp, ScrollText,
    Loader2, X, Printer, ChevronRight, Search, Hash, Plus, Pencil, Trash2, Save
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUserRole, canEdit, canDelete, canCreate } from '@/lib/roles';

// --- INTERFACES ---
interface Plantilla {
    id: number;
    nombre: string;
    tipo: string;
    contenido: string;
    campos_dinamicos: string[];
    created_at: string;
}

interface Expediente {
    id: number;
    numero_caso: string;
    materia: string;
    juzgado: string | null;
    clientes: {
        nombre: string;
        tipo: string;
    };
}

const tipoIcons: Record<string, React.ReactNode> = {
    'demanda': <Gavel className="w-6 h-6" />,
    'memorial': <FileText className="w-6 h-6" />,
    'contrato': <Users2 className="w-6 h-6" />,
    'poder': <Stamp className="w-6 h-6" />,
    'acta': <ScrollText className="w-6 h-6" />,
};

const tipoColors: Record<string, string> = {
    'demanda': 'bg-red-900/20 text-red-400 border-red-900/30',
    'memorial': 'bg-blue-900/20 text-blue-400 border-blue-900/30',
    'contrato': 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30',
    'poder': 'bg-purple-900/20 text-purple-400 border-purple-900/30',
    'acta': 'bg-jack-gold/10 text-jack-gold border-jack-gold/20',
};

const TIPOS_PLANTILLA = ['demanda', 'memorial', 'contrato', 'poder', 'acta'];

export default function PlantillasPage() {
    const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlantilla, setSelectedPlantilla] = useState<Plantilla | null>(null);
    const [filter, setFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingPlantilla, setEditingPlantilla] = useState<Plantilla | null>(null);
    const [role] = useState(() => getUserRole());

    const fetchPlantillas = useCallback(async () => {
        const { data } = await supabase
            .from('plantillas')
            .select('*')
            .order('nombre');
        setPlantillas((data as unknown as Plantilla[]) || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPlantillas();
    }, [fetchPlantillas]);

    const filtered = plantillas.filter((p) => {
        if (!filter.trim()) return true;
        const term = filter.toLowerCase();
        return p.nombre.toLowerCase().includes(term) || p.tipo.toLowerCase().includes(term);
    });

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm('¿Eliminar esta plantilla?')) return;
        await supabase.from('plantillas').delete().eq('id', id);
        await fetchPlantillas();
    };

    const handleEdit = (e: React.MouseEvent, plantilla: Plantilla) => {
        e.stopPropagation();
        setEditingPlantilla(plantilla);
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingPlantilla(null);
        setShowForm(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div className="border-b border-jack-gold/10 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-cinzel text-jack-white font-bold tracking-wide">Plantillas</h1>
                    <p className="text-jack-silver/50 text-sm mt-1 font-serif">Generacion de documentos legales con campos dinamicos.</p>
                </div>
                {canCreate(role) && (
                    <button
                        onClick={handleNew}
                        className="px-4 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> NUEVA PLANTILLA
                    </button>
                )}
            </div>

            {/* SEARCH */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jack-silver/50 group-focus-within:text-jack-gold transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar plantilla..."
                    className="w-full bg-jack-panel border border-jack-gold/10 py-3 pl-12 pr-4 text-jack-silver focus:border-jack-gold focus:outline-none transition-colors font-serif"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {/* GRID */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-jack-gold/20 bg-jack-panel rounded-lg">
                    <FileSignature className="w-12 h-12 text-jack-gold/20 mx-auto mb-4" />
                    <p className="text-jack-white font-cinzel text-lg">Sin resultados</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((plantilla) => (
                        <div
                            key={plantilla.id}
                            onClick={() => setSelectedPlantilla(plantilla)}
                            className="group bg-jack-panel border border-jack-gold/10 p-6 relative overflow-hidden hover:border-jack-gold/40 transition-all cursor-pointer"
                        >
                            <div className="absolute top-0 left-0 w-1 h-0 bg-jack-gold group-hover:h-full transition-all duration-300" />

                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded border ${tipoColors[plantilla.tipo] || 'bg-jack-gold/10 text-jack-gold border-jack-gold/20'}`}>
                                    {tipoIcons[plantilla.tipo] || <FileSignature className="w-6 h-6" />}
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 font-bold tracking-widest rounded-sm border uppercase ${tipoColors[plantilla.tipo] || 'bg-jack-gold/10 text-jack-gold border-jack-gold/20'}`}>
                                    {plantilla.tipo}
                                </span>
                            </div>

                            <h3 className="text-lg font-cinzel font-bold text-jack-white mb-2 group-hover:text-jack-gold transition-colors">
                                {plantilla.nombre}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-jack-silver/50">
                                <Hash className="w-3 h-3" />
                                {plantilla.campos_dinamicos?.length || 0} campos dinamicos
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {canEdit(role) && (
                                        <button onClick={(e) => handleEdit(e, plantilla)} className="p-1.5 text-jack-silver/30 hover:text-jack-gold transition-colors">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    {canDelete(role) && (
                                        <button onClick={(e) => handleDelete(e, plantilla.id)} className="p-1.5 text-jack-silver/30 hover:text-jack-crimson transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-jack-silver/30 group-hover:translate-x-1 group-hover:text-jack-gold transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL VISTA/FILL */}
            {selectedPlantilla && (
                <PlantillaModal
                    plantilla={selectedPlantilla}
                    onClose={() => setSelectedPlantilla(null)}
                />
            )}

            {/* MODAL CREAR/EDITAR */}
            {showForm && (
                <PlantillaForm
                    item={editingPlantilla}
                    onClose={() => { setShowForm(false); setEditingPlantilla(null); fetchPlantillas(); }}
                />
            )}
        </div>
    );
}

// --- MODAL DE PLANTILLA (vista + fill) ---
function PlantillaModal({ plantilla, onClose }: {
    plantilla: Plantilla;
    onClose: () => void;
}) {
    const [campos, setCampos] = useState<Record<string, string>>({});
    const [expedientes, setExpedientes] = useState<Expediente[]>([]);
    const [selectedExp, setSelectedExp] = useState('');

    useEffect(() => {
        async function fetch() {
            const { data } = await supabase
                .from('expedientes')
                .select('id, numero_caso, materia, juzgado, clientes(nombre, tipo)')
                .order('created_at', { ascending: false });
            setExpedientes((data as unknown as Expediente[]) || []);
        }
        fetch();
    }, []);

    useEffect(() => {
        if (!selectedExp) return;
        const exp = expedientes.find((e) => String(e.id) === selectedExp);
        if (!exp) return;

        const autoFill: Record<string, string> = {};
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });

        const mappings: Record<string, string> = {
            'nombre_demandante': exp.clientes.nombre,
            'nombre_cliente': exp.clientes.nombre,
            'nombre_trabajador': exp.clientes.nombre,
            'nombre_otorgante': exp.clientes.nombre,
            'nombre_compareciente': exp.clientes.nombre,
            'juzgado': exp.juzgado || '',
            'materia': exp.materia,
            'numero_caso': exp.numero_caso,
            'fecha': dateStr,
            'fecha_actual': dateStr,
            'ciudad': 'Guatemala',
        };

        plantilla.campos_dinamicos.forEach((campo) => {
            const key = campo.toLowerCase().replace(/\s+/g, '_');
            for (const [mapKey, mapVal] of Object.entries(mappings)) {
                if (key.includes(mapKey)) {
                    autoFill[campo] = mapVal;
                    break;
                }
            }
        });

        setCampos((prev) => ({ ...prev, ...autoFill }));
    }, [selectedExp, expedientes, plantilla.campos_dinamicos]);

    const preview = plantilla.campos_dinamicos.reduce((text, campo) => {
        const value = campos[campo];
        if (value) {
            return text.replace(new RegExp(`\\{\\{${campo}\\}\\}`, 'g'), value);
        }
        return text.replace(
            new RegExp(`\\{\\{${campo}\\}\\}`, 'g'),
            `<span class="text-jack-gold bg-jack-gold/10 px-1 rounded">[${campo}]</span>`
        );
    }, plantilla.contenido);

    function handlePrint() {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const cleanPreview = plantilla.campos_dinamicos.reduce((text, campo) => {
            const value = campos[campo];
            if (value) {
                return text.replace(new RegExp(`\\{\\{${campo}\\}\\}`, 'g'), value);
            }
            return text.replace(new RegExp(`\\{\\{${campo}\\}\\}`, 'g'), `[${campo}]`);
        }, plantilla.contenido);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${plantilla.nombre}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; margin: 2cm 2.5cm; color: #000; }
                    h1, h2, h3 { text-align: center; }
                    p { text-align: justify; text-indent: 1cm; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>${cleanPreview.replace(/\n/g, '<br/>')}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-jack-base border border-jack-gold w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-jack-gold/20 bg-jack-panel flex-shrink-0">
                    <h2 className="text-xl font-cinzel text-jack-white font-bold tracking-wide flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-jack-gold" /> {plantilla.nombre}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded flex items-center gap-2"
                        >
                            <Printer className="w-4 h-4" /> IMPRIMIR
                        </button>
                        <button onClick={onClose} className="text-jack-silver hover:text-white p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body - Split layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Form */}
                    <div className="w-full md:w-2/5 border-r border-jack-gold/10 p-6 overflow-y-auto space-y-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">
                                Vincular Expediente (opcional)
                            </label>
                            <select
                                value={selectedExp}
                                onChange={(e) => setSelectedExp(e.target.value)}
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

                        <div className="h-px bg-jack-gold/10" />

                        <p className="text-[10px] uppercase tracking-widest text-jack-gold/50 font-bold">
                            Campos del Documento
                        </p>

                        {plantilla.campos_dinamicos.map((campo) => (
                            <div key={campo}>
                                <label className="block text-xs text-jack-silver/60 font-bold mb-1">
                                    {campo}
                                </label>
                                <input
                                    type="text"
                                    value={campos[campo] || ''}
                                    onChange={(e) => setCampos({ ...campos, [campo]: e.target.value })}
                                    placeholder={`Ingrese ${campo.toLowerCase()}`}
                                    className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none transition-colors text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right: Preview */}
                    <div className="hidden md:block flex-1 p-6 overflow-y-auto bg-white/[0.02]">
                        <div className="max-w-2xl mx-auto">
                            <p className="text-[10px] uppercase tracking-widest text-jack-gold/50 font-bold mb-4">
                                Vista Previa del Documento
                            </p>
                            <div
                                id="plantilla-preview"
                                className="bg-white/5 border border-white/10 rounded p-8 font-serif text-jack-silver text-sm leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: preview.replace(/\n/g, '<br/>') }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- FORMULARIO CREAR/EDITAR PLANTILLA ---
function PlantillaForm({ item, onClose }: { item: Plantilla | null; onClose: () => void }) {
    const [form, setForm] = useState({
        nombre: item?.nombre || '',
        tipo: item?.tipo || 'demanda',
        contenido: item?.contenido || '',
    });
    const [saving, setSaving] = useState(false);

    // Auto-extract campos_dinamicos from content
    const extractCampos = (text: string): string[] => {
        const matches = text.match(/\{\{(\w+)\}\}/g) || [];
        const names = matches.map(m => m.replace(/\{\{|\}\}/g, ''));
        return names.filter((v, i, a) => a.indexOf(v) === i);
    };

    const campos = extractCampos(form.contenido);

    const handleSave = async () => {
        if (!form.nombre.trim() || !form.contenido.trim()) {
            alert('Nombre y contenido son obligatorios.');
            return;
        }
        setSaving(true);
        const payload = {
            nombre: form.nombre.trim(),
            tipo: form.tipo,
            contenido: form.contenido,
            campos_dinamicos: campos,
        };

        if (item) {
            await supabase.from('plantillas').update(payload).eq('id', item.id);
        } else {
            await supabase.from('plantillas').insert(payload);
        }
        setSaving(false);
        onClose();
    };

    const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-jack-base border border-jack-gold w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl rounded-sm">
                <div className="p-5 border-b border-jack-gold/20 bg-jack-panel flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-cinzel text-jack-white font-bold">
                        {item ? 'Editar Plantilla' : 'Nueva Plantilla'}
                    </h3>
                    <button onClick={onClose} className="text-jack-silver hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Editor */}
                    <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Nombre</label>
                                <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Demanda Laboral Ordinaria" className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Tipo</label>
                                <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-2.5 text-jack-white focus:outline-none text-sm">
                                    {TIPOS_PLANTILLA.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">
                                Contenido <span className="text-jack-silver/40 normal-case">(usa {`{{campo}}`} para campos dinamicos)</span>
                            </label>
                            <textarea
                                value={form.contenido}
                                onChange={e => set('contenido', e.target.value)}
                                placeholder={`SEÑOR JUEZ DE PRIMERA INSTANCIA DE TRABAJO Y PREVISIÓN SOCIAL:\n\n{{nombre_demandante}}, de {{edad}} años de edad, {{estado_civil}}, guatemalteco(a)...`}
                                className="flex-1 bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none text-sm resize-none font-mono leading-relaxed min-h-[300px]"
                            />
                        </div>
                    </div>

                    {/* Right: Preview campos */}
                    <div className="w-72 border-l border-jack-gold/10 p-5 overflow-y-auto bg-white/[0.02]">
                        <p className="text-[10px] uppercase tracking-widest text-jack-gold/50 font-bold mb-4">
                            Campos Detectados ({campos.length})
                        </p>
                        {campos.length === 0 ? (
                            <p className="text-xs text-jack-silver/30 italic">
                                Escribe {`{{nombre}}`} en el contenido para agregar campos.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {campos.map(campo => (
                                    <div key={campo} className="bg-jack-panel border border-jack-gold/10 px-3 py-2 rounded text-sm text-jack-gold flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-jack-gold/50" />
                                        {campo}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-jack-gold/20 flex justify-end gap-3 flex-shrink-0">
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

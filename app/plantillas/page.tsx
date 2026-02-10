"use client";
import { useState, useEffect, useCallback } from 'react';
import {
    FileSignature, Gavel, FileText, Users2, Stamp, ScrollText,
    Loader2, X, Printer, ChevronRight, Search, Hash
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

export default function PlantillasPage() {
    const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlantilla, setSelectedPlantilla] = useState<Plantilla | null>(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        async function fetch() {
            const { data } = await supabase
                .from('plantillas')
                .select('*')
                .order('nombre');
            setPlantillas((data as unknown as Plantilla[]) || []);
            setLoading(false);
        }
        fetch();
    }, []);

    const filtered = plantillas.filter((p) => {
        if (!filter.trim()) return true;
        const term = filter.toLowerCase();
        return p.nombre.toLowerCase().includes(term) || p.tipo.toLowerCase().includes(term);
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div className="border-b border-jack-gold/10 pb-6">
                <h1 className="text-3xl font-cinzel text-jack-white font-bold tracking-wide">Plantillas</h1>
                <p className="text-jack-silver/50 text-sm mt-1 font-serif">Generacion de documentos legales con campos dinamicos.</p>
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

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                                <ChevronRight className="w-4 h-4 text-jack-silver/30 group-hover:translate-x-1 group-hover:text-jack-gold transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {selectedPlantilla && (
                <PlantillaModal
                    plantilla={selectedPlantilla}
                    onClose={() => setSelectedPlantilla(null)}
                />
            )}
        </div>
    );
}

// --- MODAL DE PLANTILLA ---
function PlantillaModal({ plantilla, onClose }: {
    plantilla: Plantilla;
    onClose: () => void;
}) {
    const [campos, setCampos] = useState<Record<string, string>>({});
    const [expedientes, setExpedientes] = useState<Expediente[]>([]);
    const [selectedExp, setSelectedExp] = useState('');

    // Fetch expedientes para auto-relleno
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

    // Auto-relleno al seleccionar expediente
    useEffect(() => {
        if (!selectedExp) return;
        const exp = expedientes.find((e) => String(e.id) === selectedExp);
        if (!exp) return;

        const autoFill: Record<string, string> = {};
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });

        // Map common field names to expediente data
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

    // Generate preview
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
                        {/* Vincular expediente */}
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

"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Printer, Save, FileSignature, Eraser, FolderOpen, Plus, Loader2, Check, ChevronDown, Trash2, Hash, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Borrador {
    id: number;
    titulo: string;
    contenido: string;
    updated_at: string;
}

interface PlantillaSimple {
    id: number;
    nombre: string;
    tipo: string;
    contenido: string;
}

// Números en español (1-100)
function numeroALetras(n: number): string {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];

    if (n === 100) return 'CIEN';
    if (n < 1 || n > 100) return String(n);
    if (n < 10) return unidades[n];
    if (n < 20) return especiales[n - 10];
    if (n === 20) return 'VEINTE';
    if (n < 30) return 'VEINTI' + unidades[n - 20];
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? decenas[d] : `${decenas[d]} Y ${unidades[u]}`;
}

export default function ProtocoloPage() {
    const [content, setContent] = useState("");
    const [titulo, setTitulo] = useState("Sin título");
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [borradores, setBorradores] = useState<Borrador[]>([]);
    const [showList, setShowList] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [plantillas, setPlantillas] = useState<PlantillaSimple[]>([]);
    const [showPlantillas, setShowPlantillas] = useState(false);
    const [showNumero, setShowNumero] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const fetchBorradores = useCallback(async () => {
        const { data } = await supabase
            .from('protocolo_borradores')
            .select('id, titulo, contenido, updated_at')
            .order('updated_at', { ascending: false });
        setBorradores((data as Borrador[]) || []);
        setLoading(false);
    }, []);

    const fetchPlantillas = useCallback(async () => {
        const { data } = await supabase
            .from('plantillas')
            .select('id, nombre, tipo, contenido')
            .order('nombre');
        setPlantillas((data as PlantillaSimple[]) || []);
    }, []);

    useEffect(() => {
        fetchBorradores();
        fetchPlantillas();
    }, [fetchBorradores, fetchPlantillas]);

    const handleSave = async () => {
        setSaving(true);
        const userName = localStorage.getItem('user_name') || 'Sistema';

        if (currentId) {
            await supabase
                .from('protocolo_borradores')
                .update({
                    titulo: titulo.trim() || 'Sin título',
                    contenido: content,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', currentId);
        } else {
            const { data } = await supabase
                .from('protocolo_borradores')
                .insert({
                    titulo: titulo.trim() || 'Sin título',
                    contenido: content,
                    usuario: userName,
                })
                .select('id')
                .single();
            if (data) setCurrentId(data.id);
        }

        await fetchBorradores();
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLoad = (borrador: Borrador) => {
        setCurrentId(borrador.id);
        setTitulo(borrador.titulo);
        setContent(borrador.contenido);
        setShowList(false);
    };

    const handleNew = () => {
        if (content.trim() && !confirm('¿Crear nuevo documento? Los cambios no guardados se perderán.')) return;
        setCurrentId(null);
        setTitulo('Sin título');
        setContent('');
        setShowList(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este borrador?')) return;
        await supabase.from('protocolo_borradores').delete().eq('id', id);
        if (currentId === id) {
            setCurrentId(null);
            setTitulo('Sin título');
            setContent('');
        }
        await fetchBorradores();
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClear = () => {
        if (confirm("¿Desea borrar todo el contenido del instrumento público?")) {
            setContent("");
        }
    };

    const handleInsertPlantilla = (plantilla: PlantillaSimple) => {
        if (content.trim() && !confirm('¿Reemplazar el contenido actual con la plantilla?')) {
            setShowPlantillas(false);
            return;
        }
        setContent(plantilla.contenido);
        if (titulo === 'Sin título') {
            setTitulo(plantilla.nombre);
        }
        setShowPlantillas(false);
    };

    const handleInsertNumero = (num: number) => {
        const texto = `NUMERO ${numeroALetras(num)} (${num}). `;
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const before = content.substring(0, start);
            const after = content.substring(start);
            setContent(before + texto + after);
            // Focus back and position cursor after inserted text
            setTimeout(() => {
                textarea.focus();
                const newPos = start + texto.length;
                textarea.setSelectionRange(newPos, newPos);
            }, 0);
        } else {
            setContent(texto + content);
        }
        setShowNumero(false);
    };

    const nextNumber = borradores.length + 1;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-GT', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-jack-base text-jack-silver flex flex-col items-center py-8 font-serif relative overflow-hidden">

            {/* Fondo decorativo (Niebla) */}
            <div className="absolute inset-0 bg-london-mist pointer-events-none z-0"></div>

            {/* BARRA DE HERRAMIENTAS FLOTANTE */}
            <nav className="fixed top-6 z-50 bg-jack-panel/90 backdrop-blur-md border border-jack-gold/30 rounded-full px-4 md:px-8 py-3 flex items-center gap-3 md:gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <Link href="/" className="text-jack-silver hover:text-jack-gold transition-colors" title="Volver">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="h-6 w-[1px] bg-jack-gold/20"></div>

                <h1 className="font-cinzel text-jack-gold font-bold tracking-widest text-sm hidden md:block">
                    MATRIZ NOTARIAL
                </h1>

                <div className="h-6 w-[1px] bg-jack-gold/20 hidden md:block"></div>

                {/* Borradores */}
                <div className="relative">
                    <button
                        onClick={() => { setShowList(!showList); setShowPlantillas(false); setShowNumero(false); }}
                        className="text-jack-silver hover:text-white transition-colors flex items-center gap-1"
                        title="Mis Borradores"
                    >
                        <FolderOpen className="w-5 h-5" />
                        <ChevronDown className={`w-3 h-3 transition-transform ${showList ? 'rotate-180' : ''}`} />
                    </button>

                    {showList && (
                        <div className="absolute top-12 left-0 w-72 bg-jack-base border border-jack-gold/20 rounded shadow-2xl z-50 max-h-80 flex flex-col">
                            <div className="p-3 border-b border-jack-gold/10 flex justify-between items-center">
                                <span className="text-xs text-jack-gold font-cinzel font-bold tracking-widest">BORRADORES</span>
                                <button onClick={handleNew} className="text-xs text-jack-gold hover:text-white flex items-center gap-1 transition-colors">
                                    <Plus className="w-3 h-3" /> Nuevo
                                </button>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                {loading ? (
                                    <div className="p-6 text-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-jack-gold/30 mx-auto" />
                                    </div>
                                ) : borradores.length === 0 ? (
                                    <div className="p-6 text-center text-jack-silver/30 text-xs">
                                        No hay borradores guardados.
                                    </div>
                                ) : (
                                    borradores.map((b) => (
                                        <div
                                            key={b.id}
                                            className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between gap-2 ${currentId === b.id ? 'bg-jack-gold/5 border-l-2 border-l-jack-gold' : ''}`}
                                        >
                                            <div className="min-w-0 flex-1" onClick={() => handleLoad(b)}>
                                                <p className="text-sm text-jack-white truncate font-bold">{b.titulo}</p>
                                                <p className="text-[10px] text-jack-silver/40">{formatDate(b.updated_at)}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                                                className="p-1 text-jack-silver/20 hover:text-jack-crimson transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Insertar Plantilla */}
                <div className="relative">
                    <button
                        onClick={() => { setShowPlantillas(!showPlantillas); setShowList(false); setShowNumero(false); }}
                        className="text-jack-silver hover:text-white transition-colors flex items-center gap-1"
                        title="Insertar Plantilla"
                    >
                        <ScrollText className="w-5 h-5" />
                    </button>

                    {showPlantillas && (
                        <div className="absolute top-12 left-0 w-72 bg-jack-base border border-jack-gold/20 rounded shadow-2xl z-50 max-h-80 flex flex-col">
                            <div className="p-3 border-b border-jack-gold/10">
                                <span className="text-xs text-jack-gold font-cinzel font-bold tracking-widest">INSERTAR PLANTILLA</span>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                {plantillas.length === 0 ? (
                                    <div className="p-6 text-center text-jack-silver/30 text-xs">
                                        No hay plantillas disponibles.
                                    </div>
                                ) : (
                                    plantillas.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => handleInsertPlantilla(p)}
                                            className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                        >
                                            <p className="text-sm text-jack-white font-bold truncate">{p.nombre}</p>
                                            <p className="text-[10px] text-jack-silver/40 uppercase">{p.tipo}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Insertar Número */}
                <div className="relative">
                    <button
                        onClick={() => { setShowNumero(!showNumero); setShowList(false); setShowPlantillas(false); }}
                        className="text-jack-silver hover:text-white transition-colors"
                        title="Insertar Número de Instrumento"
                    >
                        <Hash className="w-5 h-5" />
                    </button>

                    {showNumero && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 bg-jack-base border border-jack-gold/20 rounded shadow-2xl z-50">
                            <div className="p-3 border-b border-jack-gold/10">
                                <span className="text-xs text-jack-gold font-cinzel font-bold tracking-widest">NÚMERO DE INSTRUMENTO</span>
                            </div>
                            <div className="p-3 space-y-2">
                                <button
                                    onClick={() => handleInsertNumero(nextNumber)}
                                    className="w-full text-left p-2 bg-jack-gold/10 border border-jack-gold/20 rounded hover:bg-jack-gold/20 transition-colors"
                                >
                                    <p className="text-sm text-jack-white font-bold">Siguiente: #{nextNumber}</p>
                                    <p className="text-[10px] text-jack-gold">NUMERO {numeroALetras(nextNumber)} ({nextNumber}).</p>
                                </button>
                                <div className="flex gap-2">
                                    {[1, 5, 10, 25, 50].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => handleInsertNumero(n)}
                                            className="flex-1 p-2 bg-jack-panel border border-jack-gold/10 rounded text-xs text-jack-silver hover:text-jack-gold hover:border-jack-gold/30 transition-colors text-center font-bold"
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        placeholder="Otro #"
                                        className="flex-1 bg-jack-panel border border-jack-gold/20 rounded px-3 py-2 text-jack-white text-xs focus:outline-none focus:border-jack-gold"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = parseInt((e.target as HTMLInputElement).value);
                                                if (val >= 1 && val <= 100) handleInsertNumero(val);
                                            }
                                        }}
                                    />
                                    <span className="text-[10px] text-jack-silver/40">Enter</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={handleNew} className="text-jack-silver hover:text-white transition-colors" title="Nuevo Documento">
                    <Plus className="w-5 h-5" />
                </button>

                <div className="h-6 w-[1px] bg-jack-gold/20"></div>

                <button onClick={handleClear} className="text-jack-crimson hover:text-red-400 transition-colors" title="Limpiar Hoja">
                    <Eraser className="w-5 h-5" />
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`transition-colors ${saved ? 'text-green-400' : 'text-jack-silver hover:text-white'}`}
                    title={currentId ? 'Guardar Cambios' : 'Guardar Nuevo Borrador'}
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-jack-gold text-jack-base px-4 py-1.5 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" />
                    <span className="text-xs tracking-wide hidden sm:inline">IMPRIMIR</span>
                </button>
            </nav>

            {/* MESA DE TRABAJO */}
            <div className="mt-20 z-10 flex flex-col items-center justify-center w-full overflow-auto pb-20">

                {/* TÍTULO EDITABLE */}
                <div className="mb-4 w-full max-w-[21.59cm]">
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="bg-transparent text-jack-white font-cinzel text-center w-full text-lg font-bold tracking-widest focus:outline-none border-b border-transparent focus:border-jack-gold/30 transition-colors py-2"
                        placeholder="Título del documento..."
                    />
                </div>

                {/* EL PAPEL DE PROTOCOLO */}
                <div
                    id="protocol-sheet"
                    className="relative bg-[#fdfbf7] text-black shadow-2xl transition-transform duration-300 ease-out"
                    style={{
                        width: '21.59cm',
                        height: '27.94cm',
                        paddingTop: '2.5cm',
                        paddingLeft: '2cm',
                        paddingRight: '1.5cm',
                    }}
                >
                    {/* LÍNEAS GUÍA */}
                    <div className="absolute inset-0 pointer-events-none no-print opacity-20 pt-[2.5cm]">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div
                                key={i}
                                className="border-b border-cyan-500 w-full mx-auto"
                                style={{ height: '0.96cm' }}
                            >
                                <span className="absolute left-1 text-[8px] text-cyan-600">{i + 1}</span>
                            </div>
                        ))}
                    </div>

                    {/* MARGENES ROJOS LATERALES */}
                    <div className="absolute top-0 left-[1.5cm] bottom-0 w-[1px] bg-red-500/30 no-print h-full"></div>
                    <div className="absolute top-0 right-[1cm] bottom-0 w-[1px] bg-red-500/30 no-print h-full"></div>

                    {/* ÁREA DE ESCRITURA */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full bg-transparent resize-none focus:outline-none font-[family-name:var(--font-serif)] text-justify leading-[0.96cm] text-[15px]"
                        spellCheck={false}
                        placeholder="NUMERO UNO (1). En la ciudad de Guatemala, el veintiséis de enero del año dos mil veintiséis, ANTE MÍ: JOSÉ ALEJANDRO..."
                        style={{
                            lineHeight: '0.96cm',
                            letterSpacing: '0.01em'
                        }}
                    />

                    {/* Sello de Agua */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none no-print opacity-5">
                        <FileSignature className="w-64 h-64 text-jack-base" />
                    </div>
                </div>

                {/* Info del estado */}
                <div className="mt-6 text-jack-silver/50 text-xs font-mono bg-jack-panel px-4 py-2 rounded border border-jack-gold/10 flex items-center gap-4">
                    <span>LÍNEAS: {content.split('\n').length} / 25</span>
                    <span className="text-jack-gold/30">|</span>
                    <span>{currentId ? `Borrador #${currentId}` : 'Nuevo documento'}</span>
                    <span className="text-jack-gold/30">|</span>
                    <span>{plantillas.length} plantillas disponibles</span>
                    {saved && <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Guardado</span>}
                </div>
            </div>
        </div>
    );
}

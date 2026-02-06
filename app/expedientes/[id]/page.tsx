"use client";
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Loader2, FileText, Upload, Download, Trash2, X,
    User, MapPin, Scale, Calendar, AlertCircle, CheckCircle2, Archive,
    File, Image, FileSpreadsheet
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- INTERFACES ---
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
        telefono: string | null;
        email: string | null;
    };
}

interface Documento {
    id: number;
    nombre: string;
    archivo_url: string;
    tipo: string | null;
    tamaño: number | null;
    created_at: string;
}

const estadoConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    'En Trámite': {
        color: 'bg-blue-900/20 text-blue-400 border-blue-900/30',
        icon: <Scale className="w-4 h-4" />,
    },
    'Sentencia': {
        color: 'bg-green-900/20 text-green-400 border-green-900/30',
        icon: <CheckCircle2 className="w-4 h-4" />,
    },
    'Archivo': {
        color: 'bg-white/5 text-jack-silver/50 border-white/10',
        icon: <Archive className="w-4 h-4" />,
    },
};

function fileIcon(tipo: string | null) {
    if (!tipo) return <File className="w-5 h-5" />;
    if (tipo.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (tipo.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (tipo.includes('sheet') || tipo.includes('excel')) return <FileSpreadsheet className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
}

function formatBytes(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function timeAgo(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ExpedienteDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [expediente, setExpediente] = useState<Expediente | null>(null);
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    // --- FETCH EXPEDIENTE ---
    useEffect(() => {
        async function fetch() {
            const { data } = await supabase
                .from('expedientes')
                .select('*, clientes(nombre, tipo, telefono, email)')
                .eq('id', id)
                .single();
            setExpediente(data as unknown as Expediente);
            setLoading(false);
        }
        fetch();
    }, [id]);

    // --- FETCH DOCUMENTOS ---
    const fetchDocumentos = useCallback(async () => {
        const { data } = await supabase
            .from('documentos')
            .select('*')
            .eq('expediente_id', id)
            .order('created_at', { ascending: false });
        setDocumentos((data as unknown as Documento[]) || []);
    }, [id]);

    useEffect(() => {
        fetchDocumentos();
    }, [fetchDocumentos]);

    // --- SUBIR ARCHIVO ---
    async function handleUpload(files: FileList | null) {
        if (!files || files.length === 0) return;
        setUploading(true);

        for (const file of Array.from(files)) {
            const filePath = `expediente-${id}/${Date.now()}-${file.name}`;

            const { error: storageError } = await supabase.storage
                .from('evidencias')
                .upload(filePath, file);

            if (storageError) {
                console.error('Error subiendo archivo:', storageError.message);
                continue;
            }

            const { data: urlData } = supabase.storage
                .from('evidencias')
                .getPublicUrl(filePath);

            await supabase.from('documentos').insert({
                expediente_id: Number(id),
                nombre: file.name,
                archivo_url: urlData.publicUrl,
                tipo: file.type,
                tamaño: file.size,
            });
        }

        await fetchDocumentos();
        setUploading(false);
    }

    // --- ELIMINAR DOCUMENTO ---
    async function handleDelete(doc: Documento) {
        // Extraer path del archivo desde la URL
        const url = new URL(doc.archivo_url);
        const pathParts = url.pathname.split('/evidencias/');
        const storagePath = pathParts[1] ? decodeURIComponent(pathParts[1]) : null;

        if (storagePath) {
            await supabase.storage.from('evidencias').remove([storagePath]);
        }

        await supabase.from('documentos').delete().eq('id', doc.id);
        await fetchDocumentos();
    }

    // --- DRAG & DROP ---
    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(true);
    }
    function handleDragLeave() {
        setDragOver(false);
    }
    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        handleUpload(e.dataTransfer.files);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
            </div>
        );
    }

    if (!expediente) {
        return (
            <div className="text-center py-32 space-y-4">
                <AlertCircle className="w-12 h-12 text-jack-crimson/40 mx-auto" />
                <p className="text-jack-white font-cinzel text-xl">Expediente no encontrado</p>
                <Link href="/expedientes" className="text-jack-gold text-sm hover:underline">Volver a expedientes</Link>
            </div>
        );
    }

    const est = estadoConfig[expediente.estado];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* NAV */}
            <div className="flex items-center justify-between border-b border-jack-gold/10 pb-4">
                <Link href="/expedientes" className="text-jack-gold hover:text-white transition-colors flex items-center gap-2 text-xs tracking-widest uppercase font-bold">
                    <ArrowLeft className="w-4 h-4" /> Expedientes
                </Link>
                <span className="font-mono text-xs text-jack-silver/40">{expediente.numero_caso}</span>
            </div>

            {/* HEADER DEL CASO */}
            <div className="bg-jack-panel border border-jack-gold/10 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-cinzel text-jack-white font-bold">{expediente.numero_caso}</h1>
                            <span className={`px-3 py-1 rounded text-[10px] uppercase font-bold border flex items-center gap-1.5 ${est?.color || 'bg-white/5 text-jack-silver border-white/10'}`}>
                                {est?.icon}
                                {expediente.estado}
                            </span>
                        </div>
                        {expediente.descripcion && (
                            <p className="text-jack-silver/70 font-serif text-sm leading-relaxed max-w-2xl">
                                {expediente.descripcion}
                            </p>
                        )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <span className="text-[10px] text-jack-silver/40 uppercase tracking-widest">Materia</span>
                        <p className="text-jack-gold font-bold text-lg font-cinzel">{expediente.materia}</p>
                    </div>
                </div>

                {/* DETALLES EN GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                        <span className="text-[10px] text-jack-silver/40 uppercase tracking-widest flex items-center gap-1">
                            <User className="w-3 h-3" /> Cliente
                        </span>
                        <p className="text-jack-white font-bold text-sm">{expediente.clientes.nombre}</p>
                        <p className="text-jack-silver/50 text-xs">{expediente.clientes.tipo}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] text-jack-silver/40 uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Juzgado
                        </span>
                        <p className="text-jack-white font-bold text-sm">{expediente.juzgado || 'No asignado'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] text-jack-silver/40 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Fecha de apertura
                        </span>
                        <p className="text-jack-white font-bold text-sm">
                            {new Date(expediente.created_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] text-jack-silver/40 uppercase tracking-widest flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Documentos
                        </span>
                        <p className="text-jack-white font-bold text-sm">{documentos.length} archivo{documentos.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            {/* MÓDULO DE DOCUMENTOS */}
            <div className="space-y-4">
                <h2 className="text-jack-white font-cinzel font-bold text-lg border-b border-jack-gold/10 pb-2">
                    Documentos Adjuntos
                </h2>

                {/* ZONA DE DRAG & DROP */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                        ${dragOver
                            ? 'border-jack-gold bg-jack-gold/10'
                            : 'border-jack-gold/20 bg-jack-panel hover:border-jack-gold/40'
                        }`}
                >
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
                        onChange={(e) => handleUpload(e.target.files)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-jack-gold" />
                            <p className="text-jack-gold text-sm font-bold">Subiendo archivos...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <Upload className={`w-8 h-8 ${dragOver ? 'text-jack-gold' : 'text-jack-gold/30'}`} />
                            <div>
                                <p className="text-jack-white text-sm font-bold">
                                    Arrastra archivos aquí o <span className="text-jack-gold">haz clic para seleccionar</span>
                                </p>
                                <p className="text-jack-silver/40 text-xs mt-1">PDF, Imágenes, Word, Excel</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* LISTA DE DOCUMENTOS */}
                {documentos.length === 0 ? (
                    <div className="text-center py-8 text-jack-silver/30">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-serif">No hay documentos adjuntos aún.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {documentos.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-jack-panel border border-jack-gold/10 hover:border-jack-gold/30 p-4 flex items-center justify-between transition-all group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="p-2 bg-jack-base rounded border border-white/5 text-jack-gold/60 group-hover:text-jack-gold transition-colors flex-shrink-0">
                                        {fileIcon(doc.tipo)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-jack-white text-sm font-bold truncate group-hover:text-jack-gold transition-colors">
                                            {doc.nombre}
                                        </p>
                                        <p className="text-jack-silver/40 text-xs">
                                            {formatBytes(doc.tamaño)} &bull; {timeAgo(doc.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                    <a
                                        href={doc.archivo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-jack-silver/40 hover:text-jack-gold hover:bg-jack-gold/10 rounded transition-colors"
                                        title="Descargar / Ver"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(doc)}
                                        className="p-2 text-jack-silver/40 hover:text-jack-crimson hover:bg-jack-crimson/10 rounded transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

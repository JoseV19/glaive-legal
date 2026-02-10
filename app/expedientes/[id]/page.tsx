"use client";
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Loader2, FileText, Upload, Download, Trash2, X,
    User, MapPin, Scale, Calendar, AlertCircle, CheckCircle2, Archive,
    File, Image, FileSpreadsheet, FolderPlus, RefreshCw, MessageSquare, Send,
    Pencil, Plus, Save
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUserRole, canEdit, canDelete } from '@/lib/roles';

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

interface Actividad {
    id: number;
    tipo: string;
    descripcion: string;
    usuario: string;
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
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [role] = useState(getUserRole());
    const [nuevaNota, setNuevaNota] = useState('');
    const [savingNota, setSavingNota] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    // --- FETCH EXPEDIENTE ---
    const fetchExpediente = useCallback(async () => {
        const { data } = await supabase
            .from('expedientes')
            .select('*, clientes(nombre, tipo, telefono, email)')
            .eq('id', id)
            .single();
        setExpediente(data as unknown as Expediente);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        fetchExpediente();
    }, [fetchExpediente]);

    // --- ELIMINAR EXPEDIENTE ---
    async function handleDeleteExpediente() {
        if (!confirm('¿Está seguro? Se eliminarán todos los documentos y actividades asociadas a este expediente.')) return;
        setDeleting(true);
        await supabase.from('notificaciones').delete().eq('expediente_id', Number(id));
        await supabase.from('actividades').delete().eq('expediente_id', Number(id));
        await supabase.from('documentos').delete().eq('expediente_id', Number(id));
        await supabase.from('eventos').delete().eq('expediente_id', Number(id));
        await supabase.from('expedientes').delete().eq('id', Number(id));
        router.push('/expedientes');
    }

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

    // --- FETCH ACTIVIDADES ---
    const fetchActividades = useCallback(async () => {
        const { data } = await supabase
            .from('actividades')
            .select('*')
            .eq('expediente_id', id)
            .order('created_at', { ascending: false });
        setActividades((data as unknown as Actividad[]) || []);
    }, [id]);

    useEffect(() => {
        fetchActividades();
    }, [fetchActividades]);

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

            // Auto-notify + log activity
            const userName = localStorage.getItem('user_name') || 'Sistema';
            await supabase.from('notificaciones').insert({
                tipo: 'documento_subido',
                mensaje: `Documento "${file.name}" subido al expediente ${expediente?.numero_caso || id}`,
                expediente_id: Number(id),
            });
            await supabase.from('actividades').insert({
                expediente_id: Number(id),
                tipo: 'documento_subido',
                descripcion: `Documento "${file.name}" subido`,
                usuario: userName,
            });
        }

        await fetchDocumentos();
        await fetchActividades();
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

        // Log activity
        const userName = localStorage.getItem('user_name') || 'Sistema';
        await supabase.from('actividades').insert({
            expediente_id: Number(id),
            tipo: 'documento_eliminado',
            descripcion: `Documento "${doc.nombre}" eliminado`,
            usuario: userName,
        });

        await fetchDocumentos();
        await fetchActividades();
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
                    <div className="flex-shrink-0 flex flex-col items-end gap-3">
                        <div>
                            <span className="text-[10px] text-jack-silver/40 uppercase tracking-widest">Materia</span>
                            <p className="text-jack-gold font-bold text-lg font-cinzel">{expediente.materia}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {canEdit(role) && (
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="px-3 py-1.5 bg-jack-gold/10 border border-jack-gold/30 text-jack-gold text-xs font-bold tracking-wider hover:bg-jack-gold/20 transition-colors flex items-center gap-1.5"
                                >
                                    <Pencil className="w-3 h-3" /> EDITAR
                                </button>
                            )}
                            {canDelete(role) && (
                                <button
                                    onClick={handleDeleteExpediente}
                                    disabled={deleting}
                                    className="px-3 py-1.5 bg-jack-crimson/10 border border-jack-crimson/30 text-jack-crimson text-xs font-bold tracking-wider hover:bg-jack-crimson/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Trash2 className="w-3 h-3" /> {deleting ? 'ELIMINANDO...' : 'ELIMINAR'}
                                </button>
                            )}
                        </div>
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
                {canEdit(role) && (
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
                )}

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
                                    {canDelete(role) && (
                                        <button
                                            onClick={() => handleDelete(doc)}
                                            className="p-2 text-jack-silver/40 hover:text-jack-crimson hover:bg-jack-crimson/10 rounded transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE EDICIÓN */}
            {showEditModal && expediente && (
                <EditExpedienteModal
                    expediente={expediente}
                    onClose={() => setShowEditModal(false)}
                    onSaved={async () => {
                        setShowEditModal(false);
                        await fetchExpediente();
                        await fetchActividades();
                    }}
                />
            )}

            {/* HISTORIAL DE ACTIVIDAD */}
            <div className="space-y-4">
                <h2 className="text-jack-white font-cinzel font-bold text-lg border-b border-jack-gold/10 pb-2">
                    Historial de Actividad
                </h2>

                {/* Agregar nota manual */}
                {canEdit(role) && (
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={nuevaNota}
                            onChange={(e) => setNuevaNota(e.target.value)}
                            placeholder="Agregar nota o comentario..."
                            className="flex-1 bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white text-sm focus:outline-none transition-colors"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && nuevaNota.trim()) {
                                    e.preventDefault();
                                    handleAddNota();
                                }
                            }}
                        />
                        <button
                            onClick={handleAddNota}
                            disabled={savingNota || !nuevaNota.trim()}
                            className="px-4 py-3 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded disabled:opacity-50 flex items-center gap-2"
                        >
                            {savingNota ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                )}

                {/* Timeline */}
                {actividades.length === 0 ? (
                    <div className="text-center py-8 text-jack-silver/30">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-serif">No hay actividad registrada.</p>
                    </div>
                ) : (
                    <div className="relative pl-6 space-y-0">
                        {/* Vertical line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-jack-gold/15" />

                        {actividades.map((act) => (
                            <div key={act.id} className="relative pb-6 last:pb-0">
                                {/* Dot */}
                                <div className={`absolute -left-6 top-1 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${
                                    act.tipo === 'creacion' ? 'border-blue-500 bg-blue-900/30' :
                                    act.tipo === 'documento_subido' ? 'border-jack-gold bg-jack-gold/20' :
                                    act.tipo === 'documento_eliminado' ? 'border-jack-crimson bg-jack-crimson/20' :
                                    act.tipo === 'estado_actualizado' ? 'border-green-500 bg-green-900/30' :
                                    'border-jack-silver/30 bg-jack-panel'
                                }`}>
                                    {act.tipo === 'creacion' && <FolderPlus className="w-3 h-3 text-blue-400" />}
                                    {act.tipo === 'documento_subido' && <Upload className="w-3 h-3 text-jack-gold" />}
                                    {act.tipo === 'documento_eliminado' && <Trash2 className="w-3 h-3 text-jack-crimson" />}
                                    {act.tipo === 'estado_actualizado' && <RefreshCw className="w-3 h-3 text-green-400" />}
                                    {act.tipo === 'nota' && <MessageSquare className="w-3 h-3 text-jack-silver/60" />}
                                </div>

                                {/* Card */}
                                <div className="bg-jack-panel border border-white/5 hover:border-jack-gold/20 rounded p-4 ml-4 transition-colors">
                                    <p className="text-jack-white text-sm">{act.descripcion}</p>
                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-jack-silver/40">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" /> {act.usuario}
                                        </span>
                                        <span>{timeAgo(act.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    async function handleAddNota() {
        if (!nuevaNota.trim()) return;
        setSavingNota(true);
        const userName = localStorage.getItem('user_name') || 'Sistema';
        await supabase.from('actividades').insert({
            expediente_id: Number(id),
            tipo: 'nota',
            descripcion: nuevaNota.trim(),
            usuario: userName,
        });
        setNuevaNota('');
        await fetchActividades();
        setSavingNota(false);
    }
}

// --- CONSTANTES ---
const MATERIAS = ['Laboral', 'Penal', 'Civil', 'Familia', 'Mercantil', 'Notarial', 'Administrativo'];
const ESTADOS = ['En Trámite', 'Sentencia', 'Archivo'];

// --- MODAL: EDITAR EXPEDIENTE ---
function EditExpedienteModal({ expediente, onClose, onSaved }: {
    expediente: Expediente;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>([]);
    const [form, setForm] = useState({
        numero_caso: expediente.numero_caso,
        cliente_id: String(expediente.cliente_id),
        materia: expediente.materia,
        estado: expediente.estado,
        juzgado: expediente.juzgado || '',
        descripcion: expediente.descripcion || '',
    });

    useEffect(() => {
        supabase.from('clientes').select('id, nombre').order('nombre').then(({ data }) => {
            setClientes((data as { id: number; nombre: string }[]) || []);
        });
    }, []);

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
        const estadoChanged = form.estado !== expediente.estado;

        const { error: dbError } = await supabase
            .from('expedientes')
            .update({
                numero_caso: form.numero_caso.trim(),
                cliente_id: Number(form.cliente_id),
                materia: form.materia,
                estado: form.estado,
                juzgado: form.juzgado.trim() || null,
                descripcion: form.descripcion.trim() || null,
            })
            .eq('id', expediente.id);

        if (dbError) {
            setError(dbError.message);
            setSaving(false);
            return;
        }

        // Log activity
        const userName = localStorage.getItem('user_name') || 'Sistema';
        if (estadoChanged) {
            await supabase.from('actividades').insert({
                expediente_id: expediente.id,
                tipo: 'estado_actualizado',
                descripcion: `Estado cambiado de "${expediente.estado}" a "${form.estado}"`,
                usuario: userName,
            });
            await supabase.from('notificaciones').insert({
                tipo: 'estado_actualizado',
                mensaje: `Expediente ${form.numero_caso} actualizado a "${form.estado}" por ${userName}`,
                expediente_id: expediente.id,
            });
        } else {
            await supabase.from('actividades').insert({
                expediente_id: expediente.id,
                tipo: 'nota',
                descripcion: `Expediente actualizado por ${userName}`,
                usuario: userName,
            });
        }

        onSaved();
    }

    const inputClass = "w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <form onSubmit={handleSubmit} className="bg-jack-base border border-jack-gold w-full max-w-lg flex flex-col shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-jack-gold/20 bg-jack-panel">
                    <h2 className="text-xl font-cinzel text-jack-white font-bold tracking-wide flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-jack-gold" /> Editar Expediente
                    </h2>
                    <button type="button" onClick={onClose} className="text-jack-silver hover:text-white p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
                    {error && (
                        <div className="bg-red-900/20 border border-red-900/40 text-red-400 px-4 py-2 text-sm rounded">{error}</div>
                    )}

                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Número de Caso *</label>
                        <input name="numero_caso" value={form.numero_caso} onChange={handleChange} className={inputClass} />
                    </div>

                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Cliente *</label>
                        <select name="cliente_id" value={form.cliente_id} onChange={handleChange} className={inputClass}>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Materia</label>
                            <select name="materia" value={form.materia} onChange={handleChange} className={inputClass}>
                                {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Estado</label>
                            <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
                                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Juzgado</label>
                        <input name="juzgado" value={form.juzgado} onChange={handleChange} placeholder="Juzgado 1ro. de Trabajo" className={inputClass} />
                    </div>

                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Descripción</label>
                        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Descripción del caso..." className={`${inputClass} resize-none`} />
                    </div>
                </div>

                <div className="p-4 border-t border-jack-gold/20 bg-jack-panel flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2 text-jack-silver hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-jack-gold text-jack-base font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded disabled:opacity-50 flex items-center gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}

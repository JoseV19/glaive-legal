"use client";
import { useState, useEffect } from 'react';
import { Search, UserPlus, Building2, User, Phone, Mail, ChevronRight, Loader2, X, Plus, Briefcase, Pencil, Trash2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUserRole, canCreate, canEdit, canDelete } from '@/lib/roles';

// --- INTERFACES ---
interface Cliente {
    id: number;
    nombre: string;
    tipo: string;
    contacto: string | null;
    telefono: string | null;
    email: string | null;
    estado: string;
    created_at: string;
    expedientes: { count: number }[];
}

const TIPOS = ['Individual', 'Empresa', 'Corporativo'];
const ESTADOS_CLIENTE = ['Activo', 'VIP', 'Deudor', 'Inactivo'];

const estadoBadge: Record<string, { label: string; class: string }> = {
    'VIP': { label: 'VIP', class: 'bg-jack-gold text-jack-base' },
    'Deudor': { label: 'MORA', class: 'bg-jack-crimson text-white' },
    'Activo': { label: 'ACTIVO', class: 'bg-green-900/30 text-green-400' },
    'Inactivo': { label: 'INACTIVO', class: 'bg-white/5 text-jack-silver/40' },
};

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Cliente | null>(null);
    const [role, setRole] = useState(getUserRole());

    useEffect(() => { setRole(getUserRole()); }, []);

    async function handleDeleteCliente(client: Cliente) {
        if (!confirm(`¿Eliminar a "${client.nombre}"? Si tiene expedientes vinculados, no podrá eliminarse.`)) return;
        const { error } = await supabase.from('clientes').delete().eq('id', client.id);
        if (error) {
            alert('No se pudo eliminar. El cliente tiene expedientes vinculados.');
            return;
        }
        fetchClientes();
    }

    // --- FETCH CLIENTES con conteo de expedientes ---
    async function fetchClientes() {
        setLoading(true);
        const { data } = await supabase
            .from('clientes')
            .select('*, expedientes(count)')
            .order('nombre');
        setClientes((data as unknown as Cliente[]) || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchClientes();
    }, []);

    // --- FILTRO LOCAL ---
    const filtered = clientes.filter((c) => {
        if (!filter.trim()) return true;
        const term = filter.toLowerCase();
        return (
            c.nombre.toLowerCase().includes(term) ||
            c.tipo.toLowerCase().includes(term) ||
            (c.contacto && c.contacto.toLowerCase().includes(term)) ||
            (c.email && c.email.toLowerCase().includes(term))
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-jack-gold/10 pb-6">
                <div>
                    <h1 className="text-3xl font-cinzel text-jack-white font-bold tracking-wide">Cartera de Clientes</h1>
                    <p className="text-jack-silver/50 text-sm mt-1 font-serif">Directorio de personas individuales y jurídicas.</p>
                </div>
                {canCreate(role) && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-jack-gold text-jack-base font-bold tracking-wider text-sm flex items-center gap-2 hover:bg-white transition-all shadow-lg mt-4 md:mt-0"
                    >
                        <UserPlus className="w-4 h-4" /> NUEVO CLIENTE
                    </button>
                )}
            </div>

            {/* SEARCH */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jack-silver/50 group-focus-within:text-jack-gold transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, tipo o representante..."
                    className="w-full bg-jack-panel border border-jack-gold/10 py-3 pl-12 pr-4 text-jack-silver focus:border-jack-gold focus:outline-none transition-colors font-serif"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {/* CONTENIDO */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-jack-gold/30" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-jack-gold/20 bg-jack-panel rounded-lg">
                    <User className="w-12 h-12 text-jack-gold/20 mx-auto mb-4" />
                    <p className="text-jack-white font-cinzel text-lg">Sin resultados</p>
                    <p className="text-jack-silver/40 text-sm mt-2">No se encontraron clientes.</p>
                </div>
            ) : (
                <>
                    {/* Contador */}
                    <p className="text-xs text-jack-silver/40 font-mono">
                        Mostrando {filtered.length} de {clientes.length} clientes
                    </p>

                    {/* GRID DE TARJETAS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((client) => {
                            const casosCount = client.expedientes?.[0]?.count ?? 0;
                            const badge = estadoBadge[client.estado];
                            const isOrg = client.tipo === 'Empresa' || client.tipo === 'Corporativo';

                            return (
                                <div
                                    key={client.id}
                                    className="group bg-jack-panel border border-jack-gold/10 p-6 relative overflow-hidden hover:border-jack-gold/40 transition-all cursor-pointer"
                                >
                                    {/* Barra lateral hover */}
                                    <div className="absolute top-0 left-0 w-1 h-0 bg-jack-gold group-hover:h-full transition-all duration-300" />

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-full border ${isOrg
                                            ? 'bg-blue-900/10 border-blue-500/20 text-blue-400'
                                            : 'bg-jack-gold/10 border-jack-gold/20 text-jack-gold'
                                        }`}>
                                            {isOrg ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                        </div>
                                        {badge && (
                                            <span className={`text-[10px] px-2 py-0.5 font-bold tracking-widest rounded-sm ${badge.class}`}>
                                                {badge.label}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-cinzel font-bold text-jack-white mb-1 truncate group-hover:text-jack-gold transition-colors">
                                        {client.nombre}
                                    </h3>
                                    <p className="text-xs text-jack-silver/50 mb-4 font-mono">
                                        C-{String(client.id).padStart(3, '0')} &bull; {client.tipo}
                                    </p>

                                    <div className="space-y-2 border-t border-white/5 pt-4 text-sm text-jack-silver/70">
                                        {client.contacto && (
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-jack-gold/50 flex-shrink-0" />
                                                <span className="truncate">{client.contacto}</span>
                                            </div>
                                        )}
                                        {client.telefono && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3 h-3 text-jack-gold/50 flex-shrink-0" />
                                                <span>{client.telefono}</span>
                                            </div>
                                        )}
                                        {client.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-jack-gold/50 flex-shrink-0" />
                                                <span className="truncate hover:text-jack-gold transition-colors">{client.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between text-xs">
                                        <span className="bg-white/5 px-2 py-1 rounded text-jack-silver/50 border border-white/5 group-hover:bg-jack-gold/10 group-hover:text-jack-gold transition-colors flex items-center gap-1.5">
                                            <Briefcase className="w-3 h-3" />
                                            {casosCount} {casosCount === 1 ? 'Caso' : 'Casos'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {canEdit(role) && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingClient(client); }}
                                                    className="p-1.5 text-jack-silver/30 hover:text-jack-gold hover:bg-jack-gold/10 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {canDelete(role) && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteCliente(client); }}
                                                    className="p-1.5 text-jack-silver/30 hover:text-jack-crimson hover:bg-jack-crimson/10 rounded transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* MODAL NUEVO CLIENTE */}
            {showModal && (
                <NuevoClienteModal
                    onClose={() => setShowModal(false)}
                    onCreated={() => {
                        setShowModal(false);
                        fetchClientes();
                    }}
                />
            )}

            {/* MODAL EDITAR CLIENTE */}
            {editingClient && (
                <EditClienteModal
                    client={editingClient}
                    onClose={() => setEditingClient(null)}
                    onSaved={() => {
                        setEditingClient(null);
                        fetchClientes();
                    }}
                />
            )}
        </div>
    );
}

// --- MODAL: NUEVO CLIENTE ---
function NuevoClienteModal({ onClose, onCreated }: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        nombre: '',
        tipo: TIPOS[0],
        contacto: '',
        telefono: '',
        email: '',
        estado: ESTADOS_CLIENTE[0],
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!form.nombre.trim()) {
            setError('El nombre del cliente es obligatorio.');
            return;
        }

        setSaving(true);
        const { error: dbError } = await supabase
            .from('clientes')
            .insert({
                nombre: form.nombre.trim(),
                tipo: form.tipo,
                contacto: form.contacto.trim() || null,
                telefono: form.telefono.trim() || null,
                email: form.email.trim() || null,
                estado: form.estado,
            });

        if (dbError) {
            setError(dbError.message);
            setSaving(false);
            return;
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
                        <Plus className="w-5 h-5 text-jack-gold" /> Nuevo Cliente
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

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Nombre *</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Nombre completo o razón social"
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Tipo y Estado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Tipo</label>
                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={handleChange}
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            >
                                {TIPOS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
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
                                {ESTADOS_CLIENTE.map((e) => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Persona de Contacto</label>
                        <input
                            name="contacto"
                            value={form.contacto}
                            onChange={handleChange}
                            placeholder="Representante legal o contacto directo"
                            className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Teléfono y Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Teléfono</label>
                            <input
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                placeholder="+502 0000-0000"
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                className="w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm"
                            />
                        </div>
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
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Crear Cliente'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// --- MODAL: EDITAR CLIENTE ---
function EditClienteModal({ client, onClose, onSaved }: {
    client: Cliente;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        nombre: client.nombre,
        tipo: client.tipo,
        contacto: client.contacto || '',
        telefono: client.telefono || '',
        email: client.email || '',
        estado: client.estado,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!form.nombre.trim()) {
            setError('El nombre del cliente es obligatorio.');
            return;
        }

        setSaving(true);
        const { error: dbError } = await supabase
            .from('clientes')
            .update({
                nombre: form.nombre.trim(),
                tipo: form.tipo,
                contacto: form.contacto.trim() || null,
                telefono: form.telefono.trim() || null,
                email: form.email.trim() || null,
                estado: form.estado,
            })
            .eq('id', client.id);

        if (dbError) {
            setError(dbError.message);
            setSaving(false);
            return;
        }

        onSaved();
    }

    const inputClass = "w-full bg-jack-panel border border-jack-gold/20 focus:border-jack-gold rounded px-4 py-3 text-jack-white focus:outline-none transition-colors text-sm";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <form onSubmit={handleSubmit} className="bg-jack-base border border-jack-gold w-full max-w-lg flex flex-col shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-jack-gold/20 bg-jack-panel">
                    <h2 className="text-xl font-cinzel text-jack-white font-bold tracking-wide flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-jack-gold" /> Editar Cliente
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
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Nombre *</label>
                        <input name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Tipo</label>
                            <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Estado</label>
                            <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
                                {ESTADOS_CLIENTE.map((e) => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Persona de Contacto</label>
                        <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Representante legal" className={inputClass} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Teléfono</label>
                            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+502 0000-0000" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs text-jack-gold uppercase tracking-widest font-bold mb-1">Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" className={inputClass} />
                        </div>
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

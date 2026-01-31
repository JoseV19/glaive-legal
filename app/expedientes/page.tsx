"use client";
import { useState } from 'react';
import { Search, Filter, FolderPlus, MoreHorizontal, FileText, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

// DATA SIMULADA (Esto vendrá de Supabase después)
const casesData = [
    { id: 'EXP-2026-001', client: 'Industrias Farmacéuticas S.A.', type: 'Laboral', status: 'Activo', stage: 'Fase de Prueba', lastUpdate: 'Hoy' },
    { id: 'EXP-2026-002', client: 'Juan Carlos Pérez', type: 'Penal', status: 'Crítico', stage: 'Audiencia Inicial', lastUpdate: 'Ayer' },
    { id: 'EXP-2026-003', client: 'Inmobiliaria Los Altos', type: 'Civil', status: 'Espera', stage: 'Revisión de Escritura', lastUpdate: 'Hace 3 días' },
    { id: 'EXP-2026-004', client: 'Maria Antonieta López', type: 'Familia', status: 'Activo', stage: 'Pensión Alimenticia', lastUpdate: 'Hace 1 semana' },
    { id: 'EXP-2026-005', client: 'Banco G&T Continental', type: 'Mercantil', status: 'Cerrado', stage: 'Cobro Judicial', lastUpdate: 'Hace 2 semanas' },
];

export default function ExpedientesPage() {
    const [filter, setFilter] = useState('');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER DE LA SECCIÓN */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-jack-gold/10 pb-6">
                <div>
                    <h1 className="text-3xl font-cinzel text-jack-white font-bold tracking-wide">Expedientes</h1>
                    <p className="text-jack-silver/50 text-sm mt-1 font-serif">Gestión centralizada de litigios y trámites notariales.</p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="px-4 py-2 bg-jack-panel border border-jack-gold/20 text-jack-silver hover:text-white hover:border-jack-gold transition-all text-sm flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filtrar
                    </button>
                    <button className="px-4 py-2 bg-jack-crimson text-white font-bold tracking-wider text-sm flex items-center gap-2 hover:bg-red-900 shadow-[0_0_15px_rgba(122,31,46,0.4)] transition-all">
                        <FolderPlus className="w-4 h-4" /> APERTURAR CASO
                    </button>
                </div>
            </div>

            {/* BARRA DE BÚSQUEDA ESTILO "JACK" */}
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

            {/* TABLA DE EXPEDIENTES (Diseño Victoriano Moderno) */}
            <div className="bg-jack-panel border border-jack-gold/10 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-jack-gold/20 bg-jack-base/50 text-xs uppercase tracking-widest text-jack-gold/70">
                            <th className="p-4 font-cinzel">No. Expediente</th>
                            <th className="p-4 font-cinzel">Cliente / Entidad</th>
                            <th className="p-4 font-cinzel">Materia</th>
                            <th className="p-4 font-cinzel">Estado Procesal</th>
                            <th className="p-4 font-cinzel text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {casesData.map((exp) => (
                            <tr key={exp.id} className="group hover:bg-white/5 transition-colors cursor-pointer">

                                {/* ID */}
                                <td className="p-4 font-mono text-xs text-jack-silver/50 group-hover:text-jack-gold transition-colors">
                                    {exp.id}
                                </td>

                                {/* CLIENTE */}
                                <td className="p-4">
                                    <div className="font-bold text-jack-white text-sm">{exp.client}</div>
                                    <div className="text-xs text-jack-silver/40 flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" /> Actividad: {exp.lastUpdate}
                                    </div>
                                </td>

                                {/* TIPO/MATERIA */}
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${exp.type === 'Penal' ? 'bg-red-900/20 text-red-400 border-red-900/30' :
                                            exp.type === 'Laboral' ? 'bg-blue-900/20 text-blue-400 border-blue-900/30' :
                                                'bg-jack-gold/10 text-jack-gold border-jack-gold/20'
                                        }`}>
                                        {exp.type}
                                    </span>
                                </td>

                                {/* ESTADO */}
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {exp.status === 'Crítico' ? <AlertCircle className="w-4 h-4 text-jack-crimson" /> :
                                            exp.status === 'Cerrado' ? <CheckCircle2 className="w-4 h-4 text-green-500/50" /> :
                                                <div className="w-2 h-2 rounded-full bg-jack-gold animate-pulse"></div>}
                                        <span className="text-sm text-jack-silver">{exp.stage}</span>
                                    </div>
                                </td>

                                {/* MENU ACCIONES */}
                                <td className="p-4 text-right">
                                    <button className="p-2 hover:bg-white/10 rounded text-jack-silver hover:text-white transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer de la Tabla */}
                <div className="p-4 border-t border-jack-gold/10 text-xs text-jack-silver/40 flex justify-between items-center font-mono">
                    <span>Mostrando 5 de 124 expedientes activos</span>
                    <div className="flex gap-2">
                        <button className="hover:text-jack-gold">Anterior</button>
                        <span className="text-jack-gold">1</span>
                        <button className="hover:text-jack-gold">2</button>
                        <button className="hover:text-jack-gold">3</button>
                        <button className="hover:text-jack-gold">Siguiente</button>
                    </div>
                </div>
            </div>

        </div>
    );
}